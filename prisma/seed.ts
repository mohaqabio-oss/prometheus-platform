import { PrismaClient, RoleType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Prometheus Database Seeding...");

  // 1. Clear Existing Data
  await prisma.userRole.deleteMany({});
  await prisma.volunteerRecord.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.memberAchievement.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.articleCollection.deleteMany({});
  await prisma.articleSource.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.achievement.deleteMany({});

  console.log("🧹 Cleared existing database records.");

  // 2. Create System Roles
  const roles: Record<RoleType, any> = {
    ADMIN: await prisma.role.create({
      data: { name: "ADMIN", description: "Unrestricted system administrator" },
    }),
    HR_EDITOR: await prisma.role.create({
      data: { name: "HR_EDITOR", description: "HR recruitment and member management" },
    }),
    POST_EDITOR: await prisma.role.create({
      data: { name: "POST_EDITOR", description: "Publication editor and content moderator" },
    }),
    AUTHOR: await prisma.role.create({
      data: { name: "AUTHOR", description: "Article writer and contributor" },
    }),
    MEMBER: await prisma.role.create({
      data: { name: "MEMBER", description: "Standard voluntary team member" },
    }),
  };
  console.log("✅ Created 5 RBAC System Roles.");

  // 3. Create Departments
  const deptTech = await prisma.department.create({
    data: { name: "Technology", slug: "technology", description: "Software architecture, web platforms, and open source tools." },
  });
  const deptResearch = await prisma.department.create({
    data: { name: "Research", slug: "research", description: "Academic research synthesis, genomics, and literature reviews." },
  });
  const deptEdu = await prisma.department.create({
    data: { name: "Education", slug: "education", description: "Interactive workshops, training bootcamps, and technical writing." },
  });
  const deptHR = await prisma.department.create({
    data: { name: "HR & Operations", slug: "hr-operations", description: "Member recruitment, volunteer hours logging, and events." },
  });
  console.log("✅ Created 4 Primary Departments.");

  // Password Hash for 'password123'
  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  // 4. Create Initial Staff Users & Linked Member Profiles

  // Account 1: ADMIN
  const userAdmin = await prisma.user.create({
    data: {
      email: "admin@prometheus.local",
      passwordHash: defaultPasswordHash,
      emailVerified: new Date(),
      userRoles: {
        create: { roleId: roles.ADMIN.id },
      },
      member: {
        create: {
          fullName: "Karrar Al-Mansoor",
          title: "Technical Lead & Software Architect",
          bio: "Full-stack software architect specializing in Next.js App Router and Prisma ORM.",
          departmentId: deptTech.id,
          volunteerHours: 140,
        },
      },
    },
  });

  // Account 2: HR_EDITOR
  const userHR = await prisma.user.create({
    data: {
      email: "hr@prometheus.local",
      passwordHash: defaultPasswordHash,
      emailVerified: new Date(),
      userRoles: {
        create: { roleId: roles.HR_EDITOR.id },
      },
      member: {
        create: {
          fullName: "Omar Al-Farooq",
          title: "HR & Recruitment Coordinator",
          bio: "Coordinates voluntary application reviews, onboarding, and certificate verification.",
          departmentId: deptHR.id,
          volunteerHours: 85,
        },
      },
    },
  });

  // Account 3: POST_EDITOR
  const userEditor = await prisma.user.create({
    data: {
      email: "editor@prometheus.local",
      passwordHash: defaultPasswordHash,
      emailVerified: new Date(),
      userRoles: {
        create: { roleId: roles.POST_EDITOR.id },
      },
      member: {
        create: {
          fullName: "Mustafa Tariq",
          title: "Post Editor-in-Chief",
          bio: "Leads technical journalism and publication standards across Prometheus Post.",
          departmentId: deptEdu.id,
          volunteerHours: 95,
        },
      },
    },
  });

  // Account 4: AUTHOR
  const userAuthor = await prisma.user.create({
    data: {
      email: "author@prometheus.local",
      passwordHash: defaultPasswordHash,
      emailVerified: new Date(),
      userRoles: {
        create: { roleId: roles.AUTHOR.id },
      },
      member: {
        create: {
          fullName: "Sarah Al-Hassani",
          title: "Research Director & Computational Biologist",
          bio: "Bioinformatics researcher evaluating non-coding genomic variant predictions.",
          departmentId: deptResearch.id,
          volunteerHours: 125,
        },
      },
    },
  });

  console.log("🎉 Seeding Completed Successfully!");
  console.log("=========================================");
  console.log("Test Accounts (Password: password123):");
  console.log("1. admin@prometheus.local  -> Role: ADMIN");
  console.log("2. hr@prometheus.local     -> Role: HR_EDITOR");
  console.log("3. editor@prometheus.local -> Role: POST_EDITOR");
  console.log("4. author@prometheus.local -> Role: AUTHOR");
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
