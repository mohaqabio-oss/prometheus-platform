import { PrismaClient, RoleType } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function slugify(text: string): string {
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || `dept-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(content: string): Array<Record<string, string>> {
  const cleanContent = content.replace(/^\uFEFF/, "");
  const lines = cleanContent.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const rows: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0].trim() === "")) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : "";
    });
    rows.push(row);
  }
  return rows;
}

function mapRoleType(roleStr?: string | null, titleStr?: string | null): RoleType {
  if (roleStr) {
    const normalized = roleStr.trim().toUpperCase();
    switch (normalized) {
      case "ADMIN":
        return RoleType.ADMIN;
      case "HR_EDITOR":
      case "HR":
        return RoleType.HR_EDITOR;
      case "POST_EDITOR":
      case "EDITOR":
        return RoleType.POST_EDITOR;
      case "AUTHOR":
        return RoleType.AUTHOR;
      case "MEMBER":
        return RoleType.MEMBER;
    }
  }

  if (titleStr) {
    const normTitle = titleStr.trim().toLowerCase();
    if (normTitle.includes("founder") || normTitle.includes("leader") || normTitle.includes("director")) {
      return RoleType.ADMIN;
    }
    if (normTitle.includes("head of department") || normTitle.includes("hr")) {
      return RoleType.HR_EDITOR;
    }
  }

  return RoleType.MEMBER;
}

async function main() {
  console.log("📥 Starting Prometheus Team CSV Data Import...");

  const csvFilePath = path.join(process.cwd(), "members.csv");

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ Error: File not found at path: ${csvFilePath}`);
    console.log("Please make sure 'members.csv' exists in the root directory.");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvFilePath, "utf-8");
  const records = parseCSV(fileContent);

  if (records.length === 0) {
    console.log("⚠️ No records found in members.csv");
    return;
  }

  console.log(`📄 Found ${records.length} records in members.csv. Processing...\n`);

  let createdCount = 0;
  let skippedCount = 0;
  const defaultPassword = "Prometheus@2026";
  const defaultPasswordHash = await bcrypt.hash(defaultPassword, 10);

  for (const [index, row] of records.entries()) {
    const fullName =
      row["fullName - Arabic"]?.trim() ||
      row["fullName"]?.trim() ||
      row["fullname - English"]?.trim();
    const email = row["email"]?.trim().toLowerCase();
    const deptName = row["department"]?.trim();
    const title = row["title"]?.trim() || null;
    const systemRoleStr = row["systemRole"]?.trim();
    const rawVolunteerHours = row["volunteerHours"]?.trim();
    const rawPhotoUrl = row["photoUrl"]?.trim();

    if (!email || !fullName) {
      console.log(`⚠️ Row ${index + 1}: Missing fullName or email. Skipping.`);
      skippedCount++;
      continue;
    }

    const cleanHoursStr = rawVolunteerHours ? rawVolunteerHours.replace(/[^0-9]/g, "") : "";
    const volunteerHours = cleanHoursStr ? parseInt(cleanHoursStr, 10) || 0 : 0;
    const photoUrl = rawPhotoUrl && rawPhotoUrl !== "" && rawPhotoUrl !== "null" ? rawPhotoUrl : null;
    const roleType = mapRoleType(systemRoleStr, title);

    // 1. Resolve or Create Role
    let roleRecord = await prisma.role.findUnique({ where: { name: roleType } });
    if (!roleRecord) {
      roleRecord = await prisma.role.create({
        data: {
          name: roleType,
          description: `${roleType} system role`,
        },
      });
    }

    // 2. Resolve or Create Department
    let deptRecord = null;
    if (deptName) {
      deptRecord = await prisma.department.findFirst({
        where: {
          OR: [
            { name: { equals: deptName, mode: "insensitive" } },
            { slug: { equals: slugify(deptName), mode: "insensitive" } },
          ],
        },
      });

      if (!deptRecord) {
        const slug = slugify(deptName);
        deptRecord = await prisma.department.create({
          data: {
            name: deptName,
            slug: slug,
            description: `Department for ${deptName}`,
          },
        });
        console.log(`  🏷️ Created new department: "${deptName}" (slug: ${slug})`);
      }
    }

    // 3. Check for existing User by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { member: true },
    });

    if (existingUser) {
      console.log(`  ⚠️ User email "${email}" already exists. Skipping user creation.`);
      if (!existingUser.member) {
        await prisma.member.create({
          data: {
            userId: existingUser.id,
            fullName,
            title,
            departmentName: deptName || "Technology",
            volunteerHours,
            avatarUrl: photoUrl,
          },
        });
        console.log(`  └─ Created connected Member profile for existing user.`);
      }
      skippedCount++;
      continue;
    }

    // 4. Create User with Role and Member
    await prisma.user.create({
      data: {
        email,
        passwordHash: defaultPasswordHash,
        emailVerified: new Date(),
        userRoles: {
          create: {
            roleId: roleRecord.id,
          },
        },
        member: {
          create: {
            fullName,
            title,
            departmentName: deptName || "Technology",
            volunteerHours,
            avatarUrl: photoUrl,
          },
        },
      },
    });

    console.log(`  ✅ [${index + 1}/${records.length}] Imported "${fullName}" <${email}> (${roleType})`);
    createdCount++;
  }

  console.log("\n=========================================");
  console.log("🎉 CSV Data Import Completed Successfully!");
  console.log(`- Total Processed: ${records.length}`);
  console.log(`- Created Users: ${createdCount}`);
  console.log(`- Skipped/Existing: ${skippedCount}`);
  console.log(`- Default Password: ${defaultPassword}`);
  console.log("=========================================");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ CSV Import Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
