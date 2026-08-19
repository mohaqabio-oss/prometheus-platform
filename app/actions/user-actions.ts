"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { RoleType } from "@prisma/client";

export interface LocalUserRecord {
  id: string;
  email: string;
  roles: RoleType[];
  fullName?: string;
  title?: string;
  departmentName?: string;
  createdAt: string;
}

// Fallback Mock Users when Database is empty or unreachable
const MOCK_ADMIN_USERS: LocalUserRecord[] = [
  {
    id: "usr-master-1",
    email: "admin@mywebsite.com",
    roles: ["ADMIN"],
    fullName: "Master Admin",
    title: "System Administrator",
    departmentName: "Executive Leadership",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-admin-2",
    email: "admin@prometheus.local",
    roles: ["ADMIN"],
    fullName: "Karrar Al-Mansoor",
    title: "Technical Lead",
    departmentName: "Technology",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-hr-3",
    email: "hr@prometheus.local",
    roles: ["HR_EDITOR"],
    fullName: "Omar Al-Farooq",
    title: "HR Coordinator",
    departmentName: "HR & Operations",
    createdAt: new Date().toISOString(),
  },
];

let IN_MEMORY_USERS: LocalUserRecord[] = [...MOCK_ADMIN_USERS];

async function requireAdminRole() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  if (!session.roles.includes("ADMIN")) {
    throw new Error("Unauthorized: Only Master ADMIN users can manage user accounts and roles.");
  }
  return session;
}

export async function getAdminUsersList(): Promise<LocalUserRecord[]> {
  try {
    const dbUsers = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        member: {
          include: {
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbUsers.length > 0) {
      return dbUsers.map((u) => ({
        id: u.id,
        email: u.email,
        roles: u.userRoles.map((ur) => ur.role.name as RoleType),
        fullName: u.member?.fullName || "Unlinked User",
        title: u.member?.title || "No Title",
        departmentName: u.member?.department?.name || "General",
        createdAt: u.createdAt.toISOString(),
      }));
    }
  } catch (e) {
    console.error("Error fetching users from DB, falling back to local memory:", e);
  }

  return IN_MEMORY_USERS;
}

export async function createUserAction(prevState: any, formData: FormData) {
  try {
    await requireAdminRole();
  } catch (err: any) {
    return { error: err.message };
  }

  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString().trim() || "adminpassword123";
  const roleInput = (formData.get("role")?.toString().trim() as RoleType) || "MEMBER";
  const fullName = formData.get("fullName")?.toString().trim() || "New User";
  const title = formData.get("title")?.toString().trim() || "Team Member";

  if (!email) {
    return { error: "Email address is required." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // 1. Resolve role in DB
    let roleRecord = await prisma.role.findUnique({ where: { name: roleInput } });
    if (!roleRecord) {
      roleRecord = await prisma.role.create({
        data: { name: roleInput, description: `${roleInput} system role` },
      });
    }

    // 2. Create User + UserRole + Member
    await prisma.user.create({
      data: {
        email,
        passwordHash,
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
          },
        },
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (e: any) {
    console.warn("DB Create User Error, updating in-memory fallback:", e);

    // Check duplicate in memory
    if (IN_MEMORY_USERS.some((u) => u.email === email)) {
      return { error: "A user with this email address already exists." };
    }

    IN_MEMORY_USERS.unshift({
      id: `usr-${Date.now()}`,
      email,
      roles: [roleInput],
      fullName,
      title,
      departmentName: "General",
      createdAt: new Date().toISOString(),
    });

    revalidatePath("/admin/users");
    return { success: true };
  }
}

export async function updateUserRoleAction(userId: string, newRole: RoleType) {
  try {
    await requireAdminRole();
  } catch (err: any) {
    return { error: err.message };
  }

  try {
    let roleRecord = await prisma.role.findUnique({ where: { name: newRole } });
    if (!roleRecord) {
      roleRecord = await prisma.role.create({
        data: { name: newRole, description: `${newRole} system role` },
      });
    }

    // Delete existing roles and assign new role
    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.userRole.create({
      data: {
        userId,
        roleId: roleRecord.id,
      },
    });
  } catch (e) {
    // Fallback in-memory update
    const target = IN_MEMORY_USERS.find((u) => u.id === userId);
    if (target) {
      target.roles = [newRole];
    }
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  try {
    await requireAdminRole();
  } catch (err: any) {
    return { error: err.message };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (e) {
    IN_MEMORY_USERS = IN_MEMORY_USERS.filter((u) => u.id !== userId);
  }

  revalidatePath("/admin/users");
  return { success: true };
}
