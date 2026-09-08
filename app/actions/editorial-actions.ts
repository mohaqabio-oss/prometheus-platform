"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export interface EditorialMemberRecord {
  id: string;
  name: string;
  role: string;
  institution?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  order: number;
  createdAt: string;
  // Aliases for backwards compatibility with any existing components
  fullName?: string;
  academicRank?: string | null;
  university?: string | null;
  specialty?: string | null;
  orcidUrl?: string | null;
}

async function requireAdminOrEditorPermission() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  const hasAuth =
    session.roles.includes("ADMIN") ||
    session.roles.includes("HR_EDITOR") ||
    session.roles.includes("POST_EDITOR" as any) ||
    session.roles.includes("WRITER");

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

    return records.map((item: any) => ({
      id: item.id,
      name: item.name || item.fullName || "عضو هيئة التحرير",
      role: item.role || item.academicRank || "محرر أكاديمي",
      institution: item.institution || item.university || null,
      bio: item.bio,
      avatarUrl: item.avatarUrl,
      order: item.order ?? 0,
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      // Backward compat aliases
      fullName: item.name || item.fullName,
      academicRank: item.role || item.academicRank,
      university: item.institution || item.university,
      specialty: item.role,
      orcidUrl: null,
    }));
  } catch (error) {
    console.error("Error fetching editorial members:", error);
    return [];
  }
}

export async function createEditorialMemberAction(prevState: any, formData: FormData) {
  await requireAdminOrEditorPermission();

  const name =
    formData.get("name")?.toString().trim() ||
    formData.get("fullName")?.toString().trim();
  const role =
    formData.get("role")?.toString().trim() ||
    formData.get("academicRank")?.toString().trim() ||
    "محرر أكاديمي";
  const institution =
    formData.get("institution")?.toString().trim() ||
    formData.get("university")?.toString().trim() ||
    null;
  const bio = formData.get("bio")?.toString().trim() || null;
  const order = parseInt(formData.get("order")?.toString() || "0", 10);
  let avatarUrl = formData.get("avatarUrl")?.toString() || null;

  if (avatarUrl && avatarUrl.startsWith("blob:")) {
    avatarUrl = null;
  }

  if (!name) {
    return { error: "الاسم مطلوب لإضافة عضو هيئة التحرير." };
  }

  try {
    await prisma.editorialMember.create({
      data: {
        name,
        role,
        institution,
        bio,
        avatarUrl,
        order: isNaN(order) ? 0 : order,
      },
    });
  } catch (err: any) {
    console.error("[CREATE_EDITORIAL_MEMBER_ERROR]:", err);
    return { error: err.message || "فشل في إضافة عضو هيئة التحرير." };
  }

  revalidatePath("/admin/post/editorial");
  revalidatePath("/admin/editorial-members");
  revalidatePath("/PtPost/editorial-board");
  revalidatePath("/PtPost");
  return { success: true };
}

export async function updateEditorialMemberAction(prevState: any, formData: FormData) {
  await requireAdminOrEditorPermission();

  const id = formData.get("id")?.toString();
  const name =
    formData.get("name")?.toString().trim() ||
    formData.get("fullName")?.toString().trim();
  const role =
    formData.get("role")?.toString().trim() ||
    formData.get("academicRank")?.toString().trim() ||
    "محرر أكاديمي";
  const institution =
    formData.get("institution")?.toString().trim() ||
    formData.get("university")?.toString().trim() ||
    null;
  const bio = formData.get("bio")?.toString().trim() || null;
  const order = parseInt(formData.get("order")?.toString() || "0", 10);
  let avatarUrl = formData.get("avatarUrl")?.toString() || null;

  if (avatarUrl && avatarUrl.startsWith("blob:")) {
    avatarUrl = null;
  }

  if (!id || !name) {
    return { error: "معرف العضو والاسم مطلوبان للتحديث." };
  }

  try {
    await prisma.editorialMember.update({
      where: { id },
      data: {
        name,
        role,
        institution,
        bio,
        avatarUrl,
        order: isNaN(order) ? 0 : order,
      },
    });
  } catch (err: any) {
    console.error("[UPDATE_EDITORIAL_MEMBER_ERROR]:", err);
    return { error: err.message || "فشل في تحديث بيانات العضو." };
  }

  revalidatePath("/admin/post/editorial");
  revalidatePath("/admin/editorial-members");
  revalidatePath("/PtPost/editorial-board");
  revalidatePath("/PtPost");
  return { success: true };
}

export async function deleteEditorialMemberAction(id: string) {
  await requireAdminOrEditorPermission();

  if (!id) {
    return { error: "معرف العضو مطلوب للحذف." };
  }

  try {
    await prisma.editorialMember.delete({
      where: { id },
    });
  } catch (err: any) {
    console.error("[DELETE_EDITORIAL_MEMBER_ERROR]:", err);
    return { error: err.message || "فشل في حذف عضو هيئة التحرير." };
  }

  revalidatePath("/admin/post/editorial");
  revalidatePath("/admin/editorial-members");
  revalidatePath("/PtPost/editorial-board");
  revalidatePath("/PtPost");
  return { success: true };
}
