"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export interface JoinRequestRecord {
  id: string;
  nameAr: string;
  nameEn: string;
  contactInfo: string;
  department: string;
  education: string;
  experience: string;
  aboutPrometheus: string;
  reasonToJoin: string;
  portfolioLink?: string | null;
  status: string;
  createdAt: string;
}

// Helper: Require HR or ADMIN permission
async function requireHRPermission() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  const hasHR = session.roles.includes("ADMIN") || session.roles.includes("HR_EDITOR");
  if (!hasHR) {
    throw new Error("Unauthorized: HR_EDITOR or ADMIN role is required to manage applications.");
  }
  return session;
}

// 1. Submit Join Request (Public Form)
export async function submitJoinRequestAction(prevState: any, formData: FormData) {
  const nameAr = formData.get("nameAr")?.toString().trim();
  const nameEn = formData.get("nameEn")?.toString().trim();
  const contactInfo = formData.get("contactInfo")?.toString().trim();
  const department = formData.get("department")?.toString().trim();
  const education = formData.get("education")?.toString().trim();
  const experience = formData.get("experience")?.toString().trim();
  const aboutPrometheus = formData.get("aboutPrometheus")?.toString().trim();
  const reasonToJoin = formData.get("reasonToJoin")?.toString().trim();
  const portfolioLink = formData.get("portfolioLink")?.toString().trim() || null;

  if (!nameAr || !nameEn || !contactInfo || !department || !education || !experience || !aboutPrometheus || !reasonToJoin) {
    return { error: "جميع الحقول المفتاحية مطلوبة لإتمام تقديم الطلب بنجاح." };
  }

  try {
    await prisma.joinRequest.create({
      data: {
        nameAr,
        nameEn,
        contactInfo,
        department,
        education,
        experience,
        aboutPrometheus,
        reasonToJoin,
        portfolioLink,
        status: "PENDING",
      },
    });

    revalidatePath("/admin/applications");
    return { success: true };
  } catch (err: any) {
    console.error("Error creating join request:", err);
    return { error: err.message || "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً." };
  }
}

// 2. Fetch All Join Requests (HR / Admin Dashboard)
export async function getJoinRequestsAction(): Promise<JoinRequestRecord[]> {
  await requireHRPermission();

  try {
    const requests = await prisma.joinRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return requests.map((r) => ({
      id: r.id,
      nameAr: r.nameAr,
      nameEn: r.nameEn,
      contactInfo: r.contactInfo,
      department: r.department,
      education: r.education,
      experience: r.experience,
      aboutPrometheus: r.aboutPrometheus,
      reasonToJoin: r.reasonToJoin,
      portfolioLink: r.portfolioLink,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (e: any) {
    console.error("Error fetching join requests:", e);
    return [];
  }
}

// 3. Update Join Request Status (HR / Admin Dashboard)
export async function updateJoinRequestStatusAction(requestId: string, status: string) {
  await requireHRPermission();

  try {
    await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status },
    });

    revalidatePath("/admin/applications");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل تحديث حالة الطلب." };
  }
}

// 4. Delete Join Request (HR / Admin Dashboard)
export async function deleteJoinRequestAction(requestId: string) {
  await requireHRPermission();

  try {
    await prisma.joinRequest.delete({
      where: { id: requestId },
    });

    revalidatePath("/admin/applications");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف الطلب." };
  }
}
