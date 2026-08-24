"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export interface DepartmentRecord {
  id: string;
  nameAr: string;
  nameEn: string;
  createdAt: string;
}

const DEFAULT_DEPARTMENTS = [
  { nameAr: "الهندسة البرمجية", nameEn: "Software Engineering" },
  { nameAr: "البحث العلمي", nameEn: "Scientific Research" },
  { nameAr: "التعليم والتطوير", nameEn: "Education & Content" },
  { nameAr: "الموارد البشرية والعمليات", nameEn: "HR & Operations" },
];

async function requireHRPermission() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  const hasHR = session.roles.includes("ADMIN") || session.roles.includes("HR_EDITOR");
  if (!hasHR) {
    throw new Error("Unauthorized: HR_EDITOR or ADMIN role is required to manage departments.");
  }
  return session;
}

// 1. Get All Departments (Public & Admin)
export async function getDepartmentsAction(): Promise<DepartmentRecord[]> {
  try {
    let dbDepts = await prisma.department.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Auto-seed default departments if database table is empty
    if (dbDepts.length === 0) {
      for (const d of DEFAULT_DEPARTMENTS) {
        try {
          await prisma.department.create({
            data: {
              nameAr: d.nameAr,
              nameEn: d.nameEn,
            },
          });
        } catch (e) {}
      }

      dbDepts = await prisma.department.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    return dbDepts.map((d) => ({
      id: d.id,
      nameAr: d.nameAr,
      nameEn: d.nameEn,
      createdAt: d.createdAt.toISOString(),
    }));
  } catch (e: any) {
    console.error("Error fetching departments:", e);
    return DEFAULT_DEPARTMENTS.map((d, i) => ({
      id: `default-${i}`,
      nameAr: d.nameAr,
      nameEn: d.nameEn,
      createdAt: new Date().toISOString(),
    }));
  }
}

// 2. Create Department
export async function createDepartmentAction(prevState: any, formData: FormData) {
  await requireHRPermission();

  const nameAr = formData.get("nameAr")?.toString().trim();
  const nameEn = formData.get("nameEn")?.toString().trim();

  if (!nameAr || !nameEn) {
    return { error: "الاسم بالعربية والانكليزية مطلوبة." };
  }

  try {
    await prisma.department.create({
      data: {
        nameAr,
        nameEn,
      },
    });

    revalidatePath("/admin/departments");
    revalidatePath("/join-us");
    revalidatePath("/members");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل إضافة القسم." };
  }
}

// 3. Update Department
export async function updateDepartmentAction(prevState: any, formData: FormData) {
  await requireHRPermission();

  const id = formData.get("id")?.toString();
  const nameAr = formData.get("nameAr")?.toString().trim();
  const nameEn = formData.get("nameEn")?.toString().trim();

  if (!id || !nameAr || !nameEn) {
    return { error: "معرف القسم والأسماء مطلوبة." };
  }

  try {
    await prisma.department.update({
      where: { id },
      data: {
        nameAr,
        nameEn,
      },
    });

    revalidatePath("/admin/departments");
    revalidatePath("/join-us");
    revalidatePath("/members");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل تعديل بيانات القسم." };
  }
}

// 4. Delete Department
export async function deleteDepartmentAction(id: string) {
  await requireHRPermission();

  try {
    await prisma.department.delete({
      where: { id },
    });

    revalidatePath("/admin/departments");
    revalidatePath("/join-us");
    revalidatePath("/members");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف القسم." };
  }
}
