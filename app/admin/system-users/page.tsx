import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getAdminUsersList } from "@/app/actions/user-actions";
import { SystemUsersClientPage } from "@/components/admin/system-users-client-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "حسابات النظام والمدراء (System Users) | لوحة التحكم",
  description: "إدارة الحسابات الإدارية وصلاحيات الدخول لمنصة بروميثيوس.",
};

export default async function SystemUsersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Master Admin security check
  const isMasterAdmin = session.roles.includes("ADMIN");
  if (!isMasterAdmin) {
    return (
      <div className="p-12 text-center text-white space-y-4">
        <h1 className="text-2xl font-bold text-rose-500 font-display">غير مصرح بالوصول (403 Forbidden)</h1>
        <p className="text-sm text-[#6B7280]">
          هذه الصفحة مخصصة حصراً لمدير النظام (Master Admin).
        </p>
      </div>
    );
  }

  const users = await getAdminUsersList();

  return (
    <SystemUsersClientPage
      users={users}
      currentUserId={session.userId}
    />
  );
}
