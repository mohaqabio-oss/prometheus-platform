import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getJoinRequestsAction } from "@/app/actions/application-actions";
import { ApplicationsClientPage } from "@/components/admin/applications-client-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "طلبات الانضمام والتوظيف | لوحة الموارد البشرية",
  description: "مراجعة طلبات الانضمام الواردة من الكوادر المتقدمة وإدارتها.",
};

export default async function AdminApplicationsPage() {
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
          هذه الصفحة مخصصة مسؤولي الموارد البشرية وإدارة النظام فقط.
        </p>
      </div>
    );
  }

  const requests = await getJoinRequestsAction();

  return <ApplicationsClientPage requests={requests} />;
}
