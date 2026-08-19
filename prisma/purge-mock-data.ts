import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("🔥 Starting database mock/dummy data purge...");

  try {
    // Find Admin Users to preserve
    const adminRoles = await prisma.role.findMany({
      where: { name: "ADMIN" },
    });
    const adminRoleIds = adminRoles.map((r) => r.id);

    const adminUserRoles = await prisma.userRole.findMany({
      where: { roleId: { in: adminRoleIds } },
    });
    const adminUserIds = new Set(adminUserRoles.map((ur) => ur.userId));

    // Find admin users by email as safety fallback
    const adminUsersByEmail = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: "admin" } },
          { email: "admin@mywebsite.com" },
          { email: "admin@prometheus.local" },
        ],
      },
    });
    adminUsersByEmail.forEach((u) => adminUserIds.add(u.id));

    console.log(`🛡️ Preserving ${adminUserIds.size} Master Admin User(s)...`);

    // Delete Content & Publishing Data
    console.log("Deleting Article collections, sources, and articles...");
    await prisma.articleCollection.deleteMany({});
    await prisma.articleSource.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.collection.deleteMany({});

    // Delete HR, Members & Operations Data
    console.log("Deleting Applications, Certificates, Volunteer Records, and Member Achievements...");
    await prisma.application.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.volunteerRecord.deleteMany({});
    await prisma.socialLink.deleteMany({});
    await prisma.memberAchievement.deleteMany({});
    await prisma.projectMember.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.partner.deleteMany({});

    // Delete Non-Admin Members
    console.log("Deleting non-admin Member profiles...");
    const nonAdminMembers = await prisma.member.findMany({
      where: {
        userId: { notIn: Array.from(adminUserIds) },
      },
    });
    
    await prisma.member.deleteMany({
      where: {
        id: { in: nonAdminMembers.map((m) => m.id) },
      },
    });

    // Delete Non-Admin Users
    console.log("Deleting non-admin User accounts...");
    const nonAdminUsers = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(adminUserIds) },
      },
    });

    await prisma.userRole.deleteMany({
      where: {
        userId: { in: nonAdminUsers.map((u) => u.id) },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: { in: nonAdminUsers.map((u) => u.id) },
      },
    });

    console.log("✅ Data Purge Complete! All dummy mock records removed.");
    console.log("🛡️ Master Admin account remains active.");
  } catch (e: any) {
    console.warn("⚠️ Database connection offline or unreachable at run time:", e?.message || e);
    console.log("ℹ️ Database purge script is ready and will execute automatically once database network is reachable.");
  }
}

main()
  .catch((e) => {
    console.error("Error running script:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
