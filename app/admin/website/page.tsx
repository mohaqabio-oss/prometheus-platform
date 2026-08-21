import React from "react";
import { getSiteSettings, getPartners } from "@/app/actions/website-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { AdminSiteBuilderForm } from "@/components/admin/admin-site-builder-form";

export default async function AdminWebsiteCmsPage() {
  const settings = await getSiteSettings();
  const partners = await getPartners();

  return (
    <div className="space-y-8">
      {/* Admin Section Header */}
      <SectionHeader
        badgeText="نظام منشئ الموقع (Site Builder)"
        title="إدارة المظهر، الترويسات"
        highlightedTitle="والمكونات الديناميكية"
        description="التحكم الكامل بألوان الموقع، ترويسات كافة الصفحات، المكونات التفاعلية للصفحة الرئيسية، وإدارة الشركاء والرعاة بشكل مباشر وبدون كود ثابت."
      />

      {/* Main Interactive Site Builder Form */}
      <AdminSiteBuilderForm initialSettings={settings} partners={partners} />
    </div>
  );
}
