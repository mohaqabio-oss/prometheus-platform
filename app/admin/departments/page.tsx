import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDepartmentsAction } from "@/app/actions/department-actions";
import { DepartmentsClientPage } from "@/components/admin/departments-client-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إدارة الأقسام التشغيلية | لوحة التحكم",
  description: "إضافة وتعديل وإدارة الأقسام والتخصصات الأكاديمية والبرمجية.",
};

export default async function AdminDepartmentsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const hasHR = session.roles.includes("ADMIN") || session.roles.includes("HR_EDITOR");
  if (!hasHR) {
    return (
      <div className="p-12 text-center text-white space-y-4">
        <h1 className="text-2xl font-bold text-rose-500 font-display">غير مصرح بالوصول (403 Forbidden)</h1>
        <p className="text-sm text-[#6B7280]">
          هذه الصفحة مخصصة لمسؤولي الموارد البشرية وإدارة النظام فقط.
        </p>
      </div>
    );
  }

  const departments = await getDepartmentsAction();

  return <DepartmentsClientPage departments={departments} />;
}
