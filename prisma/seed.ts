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
  console.log("🌱 Starting Prometheus Master Database Seeding...");

  // 1. Ensure System Roles Exist
  const roleTypes: RoleType[] = ["ADMIN", "HR_EDITOR", "POST_EDITOR", "AUTHOR", "MEMBER"];
  const roles: Record<RoleType, any> = {} as any;

  for (const rType of roleTypes) {
    roles[rType] = await prisma.role.upsert({
      where: { name: rType },
      update: {},
      create: {
        name: rType,
        description: `${rType} system role`,
      },
    });
  }
  console.log("✅ 5 RBAC System Roles verified.");

  // 2. Create Master Admin Account (admin@mywebsite.com / adminpassword123)
  const masterAdminEmail = "admin@mywebsite.com";
  const masterAdminPasswordHash = await bcrypt.hash("adminpassword123", 10);

  const masterAdminUser = await prisma.user.upsert({
    where: { email: masterAdminEmail },
    update: {
      passwordHash: masterAdminPasswordHash,
    },
    create: {
      email: masterAdminEmail,
      passwordHash: masterAdminPasswordHash,
      emailVerified: new Date(),
      userRoles: {
        create: {
          roleId: roles.ADMIN.id,
        },
      },
      member: {
        create: {
          fullName: "Master Admin",
          title: "System Administrator",
          bio: "Default Master System Administrator",
          volunteerHours: 200,
        },
      },
    },
    include: {
      userRoles: true,
      member: true,
    },
  });

  // Ensure ADMIN role assignment
  const hasAdminRole = masterAdminUser.userRoles.some((ur) => ur.roleId === roles.ADMIN.id);
  if (!hasAdminRole) {
    await prisma.userRole.create({
      data: {
        userId: masterAdminUser.id,
        roleId: roles.ADMIN.id,
      },
    });
  }
  console.log(`✅ Master Admin Account Ready: ${masterAdminEmail} (Password: adminpassword123)`);

  // 3. Find CSV File
  const possiblePaths = [
    path.join(process.cwd(), "Members.csv"),
    path.join(process.cwd(), "Members copy.csv"),
    path.join(process.cwd(), "members.csv"),
  ];

  let csvFilePath = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      csvFilePath = p;
      break;
    }
  }

  if (!csvFilePath) {
    console.log("⚠️ No CSV file found in root. Skipping CSV import.");
    return;
  }

  console.log(`📄 Found CSV file at: ${csvFilePath}`);
  const fileContent = fs.readFileSync(csvFilePath, "utf-8");
  const records = parseCSV(fileContent);

  if (records.length === 0) {
    console.log("⚠️ No records found in CSV file.");
    return;
  }

  console.log(`📥 Processing ${records.length} member records from CSV...`);

  let createdCount = 0;
  let skippedCount = 0;
  const defaultMemberPasswordHash = await bcrypt.hash("Prometheus@2026", 10);

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
    const targetRole = roles[roleType] || roles.MEMBER;

    // A. Resolve or Create Department (Parent Record)
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
      }
    }

    // B. Check for Existing User (Parent Record)
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { member: true },
    });

    if (existingUser) {
      if (!existingUser.member) {
        await prisma.member.create({
          data: {
            userId: existingUser.id,
            fullName,
            title,
            departmentId: deptRecord?.id,
            volunteerHours,
            avatarUrl: photoUrl,
          },
        });
      }
      skippedCount++;
      continue;
    }

    // C. Create User and Linked Member
    await prisma.user.create({
      data: {
        email,
        passwordHash: defaultMemberPasswordHash,
        emailVerified: new Date(),
        userRoles: {
          create: {
            roleId: targetRole.id,
          },
        },
        member: {
          create: {
            fullName,
            title,
            departmentId: deptRecord?.id,
            volunteerHours,
            avatarUrl: photoUrl,
          },
        },
      },
    });

    createdCount++;
  }

  console.log("=========================================");
  console.log("🎉 Seeding & Import Completed Successfully!");
  console.log(`- Created Users from CSV: ${createdCount}`);
  console.log(`- Skipped Existing: ${skippedCount}`);
  console.log(`- Master Admin: ${masterAdminEmail} (adminpassword123)`);
  console.log("=========================================");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
