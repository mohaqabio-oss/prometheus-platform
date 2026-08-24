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
  role: RoleType;
  roles: RoleType[];
  createdAt: string;
}

// 1. Get List of System Users (Master Admin Only)
export async function getAdminUsersList(): Promise<AdminUserItem[]> {
  await requireMasterAdmin();

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName || u.email.split("@")[0],
      role: u.role || "MEMBER",
      roles: u.roles && u.roles.length > 0 ? u.roles : [u.role || "MEMBER"],
      createdAt: u.createdAt.toISOString(),
    }));
  } catch (e: any) {
    console.error("Error fetching system users:", e);
    return [];
  }
}

// 2. Create New System User Account (Master Admin Only) - DECOUPLED FROM PUBLIC MEMBER DIRECTORY
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
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return { error: "An account with this email address already exists." };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
        role: roleType,
        roles: [roleType],
      },
    });

    revalidatePath("/admin/system-users");
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

  revalidatePath("/admin/system-users");
  revalidatePath("/admin/users");
  return { success: true };
}

// 4. Update User Role (Master Admin Only)
export async function updateUserRoleAction(userId: string, newRole: RoleType) {
  await requireMasterAdmin();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole,
        roles: [newRole],
      },
    });

    revalidatePath("/admin/system-users");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    throw new Error(err.message || "Failed to update user role.");
  }
}

// 5. Reset User Password Action (Master Admin Only)
export async function resetUserPasswordAction(userId: string, newPassword?: string) {
  await requireMasterAdmin();

  if (!newPassword || newPassword.length < 6) {
    return { error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل." };
  }

  try {
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    revalidatePath("/admin/system-users");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل إعادة تعيين كلمة المرور." };
  }
}
