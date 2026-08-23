"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export interface EditorialMemberRecord {
  id: string;
  fullName: string;
  academicRank?: string | null;
  university?: string | null;
  specialty?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  orcidUrl?: string | null;
  order: number;
  createdAt: string;
}

async function requireAdminOrEditorPermission() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  const hasAuth =
    session.roles.includes("ADMIN") ||
    session.roles.includes("HR_EDITOR") ||
    session.roles.includes("POST_EDITOR" as any);

  if (!hasAuth) {
    throw new Error("Unauthorized access.");
  }
  return session;
}

export async function getEditorialMembers(): Promise<EditorialMemberRecord[]> {
  try {
    const records = await prisma.editorialMember.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "asc" },
      ],
    });

    return records.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      academicRank: item.academicRank,
      university: item.university,
      specialty: item.specialty,
      bio: item.bio,
      avatarUrl: item.avatarUrl,
      orcidUrl: item.orcidUrl,
      order: item.order,
      createdAt: item.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching editorial members:", error);
    return [];
  }
}

export async function createEditorialMemberAction(prevState: any, formData: FormData) {
  await requireAdminOrEditorPermission();

  const fullName = formData.get("fullName")?.toString().trim();
  const academicRank = formData.get("academicRank")?.toString().trim() || null;
  const university = formData.get("university")?.toString().trim() || null;
  const specialty = formData.get("specialty")?.toString().trim() || null;
  const bio = formData.get("bio")?.toString().trim() || null;
  const orcidUrl = formData.get("orcidUrl")?.toString().trim() || null;
  const order = parseInt(formData.get("order")?.toString() || "0", 10);
  let avatarUrl = formData.get("avatarUrl")?.toString() || null;

  if (avatarUrl && avatarUrl.startsWith("blob:")) {
    avatarUrl = null;
  }

  if (!fullName) {
    return { error: "Full Name is required for editorial member." };
  }

  try {
    await prisma.editorialMember.create({
      data: {
        fullName,
        academicRank,
        university,
        specialty,
        bio,
        avatarUrl,
        orcidUrl,
        order: isNaN(order) ? 0 : order,
      },
    });
  } catch (err: any) {
    return { error: err.message || "Failed to create editorial member." };
  }

  revalidatePath("/admin/editorial-members");
  revalidatePath("/editorial-board");
  return { success: true };
}

export async function updateEditorialMemberAction(prevState: any, formData: FormData) {
  await requireAdminOrEditorPermission();

  const id = formData.get("id")?.toString();
  const fullName = formData.get("fullName")?.toString().trim();
  const academicRank = formData.get("academicRank")?.toString().trim() || null;
  const university = formData.get("university")?.toString().trim() || null;
  const specialty = formData.get("specialty")?.toString().trim() || null;
  const bio = formData.get("bio")?.toString().trim() || null;
  const orcidUrl = formData.get("orcidUrl")?.toString().trim() || null;
  const order = parseInt(formData.get("order")?.toString() || "0", 10);
  let avatarUrl = formData.get("avatarUrl")?.toString() || null;

  if (avatarUrl && avatarUrl.startsWith("blob:")) {
    avatarUrl = null;
  }

  if (!id || !fullName) {
    return { error: "Member ID and Full Name are required." };
  }

  try {
    await prisma.editorialMember.update({
      where: { id },
      data: {
        fullName,
        academicRank,
        university,
        specialty,
        bio,
        avatarUrl,
        orcidUrl,
        order: isNaN(order) ? 0 : order,
      },
    });
  } catch (err: any) {
    return { error: err.message || "Failed to update editorial member." };
  }

  revalidatePath("/admin/editorial-members");
  revalidatePath("/editorial-board");
  return { success: true };
}

export async function deleteEditorialMemberAction(id: string) {
  await requireAdminOrEditorPermission();

  if (!id) {
    return { error: "Member ID is required for deletion." };
  }

  try {
    await prisma.editorialMember.delete({
      where: { id },
    });
  } catch (err: any) {
    return { error: err.message || "Failed to delete editorial member." };
  }

  revalidatePath("/admin/editorial-members");
  revalidatePath("/editorial-board");
  return { success: true };
}
