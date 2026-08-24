import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDashboardAnalyticsData } from "@/app/actions/article-actions";
import { AnalyticsClientPage } from "@/components/admin/analytics-client-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تحليلات وإحصائيات المنصة (Analytics) | لوحة التحكم",
  description: "عرض شامل لمعدلات قراءة الأوراق البحثية والمقالات وتفاعل الأعضاء والنشاط الأكاديمي.",
};

export default async function AnalyticsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const analyticsData = await getDashboardAnalyticsData();

  return (
    <AnalyticsClientPage
      analytics={analyticsData}
      userRole={session.roles[0] || "MEMBER"}
    />
  );
}
