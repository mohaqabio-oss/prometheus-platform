"use server";

import { revalidatePath } from "next/cache";
import { getSession, hashPassword } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { RoleType } from "@prisma/client";

// Helper: Ensure Master Admin role
async function requireMasterAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  if (!session.roles.includes("ADMIN")) {
    throw new Error("Unauthorized: Master Admin (ADMIN) access is strictly required.");
  }
  return session;
}

export interface AdminUserItem {
  id: string;
  email: string;
  fullName: string;
  roles: RoleType[];
  createdAt: string;
}

// 1. Get List of Users for Master Admin Panel
export async function getAdminUsersList(): Promise<AdminUserItem[]> {
  await requireMasterAdmin();

  try {
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        member: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => {
      const roles = u.userRoles.map((ur) => ur.role.name);
      return {
        id: u.id,
        email: u.email,
        fullName: u.fullName || u.member?.fullName || u.email.split("@")[0],
        roles: roles.length > 0 ? roles : ["MEMBER" as RoleType],
        createdAt: u.createdAt.toISOString(),
      };
    });
  } catch (e) {
    return [];
  }
}

// 2. Create New User Account (Master Admin Only) - DECOUPLED FROM PUBLIC MEMBER DIRECTORY
export async function createUserAction(prevState: any, formData: FormData) {
  await requireMasterAdmin();

  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const roleType = (formData.get("role")?.toString() || "MEMBER") as RoleType;

  if (!fullName || !email || !password) {
    return { error: "Full Name, Email Address, and Password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    // Check if email exists in User table
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return { error: "An account with this email address already exists." };
    }

    // Securely hash password
    const hashedPassword = await hashPassword(password);

    // Get or create Role record
    const roleRecord = await prisma.role.upsert({
      where: { name: roleType },
      update: {},
      create: {
        name: roleType,
        description: `${roleType} Role`,
      },
    });

    // Create User & UserRole ONLY (Does NOT create a public Member record)
    await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash: hashedPassword,
        userRoles: {
          create: {
            roleId: roleRecord.id,
          },
        },
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create user account." };
  }
}

// 3. Delete User Account (Master Admin Only)
export async function deleteUserAction(userId: string) {
  const session = await requireMasterAdmin();

  if (session.userId === userId) {
    throw new Error("Security Violation: You cannot delete your own Master Admin account.");
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (err: any) {
    return { error: err.message || "Failed to delete user account." };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

// 4. Update User Role (Master Admin Only)
export async function updateUserRoleAction(userId: string, newRole: RoleType) {
  await requireMasterAdmin();

  try {
    const roleRecord = await prisma.role.upsert({
      where: { name: newRole },
      update: {},
      create: {
        name: newRole,
        description: `${newRole} Role`,
      },
    });

    // Remove existing roles and assign new role
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    await prisma.userRole.create({
      data: {
        userId,
        roleId: roleRecord.id,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    throw new Error(err.message || "Failed to update user role.");
  }
}
