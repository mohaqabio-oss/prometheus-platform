import React from "react";
import { getSiteSettings, getPartners, updateSiteSettingsAction } from "@/app/actions/website-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPartnerManager } from "@/components/admin/admin-partner-manager";
import {
  Globe,
  Save,
  Building2,
  FileText,
  BarChart3,
} from "lucide-react";

export default async function AdminWebsiteCmsPage() {
  const settings = await getSiteSettings();
  const partners = await getPartners();

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <SectionHeader
        badgeText="نظام إدارة المحتوى (CMS)"
        title="إدارة المحتوى والمظهر"
        highlightedTitle="للصفحة الرئيسية"
        description="تعديل نصوص واجهة الموقع الرئيسية، الرؤية والرسالة، الأرقام والإحصائيات التراكمية، وإدارة الشركاء والرعاة بشكل مباشر."
      />

      {/* Main CMS Settings Form */}
      <form action={updateSiteSettingsAction} className="space-y-8">
        
        {/* Hero & Header Section */}
        <Card className="p-6 bg-brand-dark-900/90 border-brand-dark-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-brand-dark-800 pb-4">
            <Globe className="w-5 h-5 text-brand-orange" />
            <div>
              <h3 className="font-display font-bold text-white text-base">القسم الرئيسي (Hero Section)</h3>
              <p className="text-xs text-brand-gray-400">العنوان الكبير والوصف التشجيعي أعلى الصفحة الرئيسية</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-brand-gray-300 font-sans">عنوان الواجهة الرئيسية (Hero Title)</label>
              <Input
                name="setting.hero.title"
                defaultValue={settings["hero.title"] || ""}
                className="font-display font-bold text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-brand-gray-300 font-sans">الوصف الفرعي (Hero Subtitle)</label>
              <textarea
                name="setting.hero.subtitle"
                rows={3}
                defaultValue={settings["hero.subtitle"] || ""}
                className="w-full rounded-md border border-brand-dark-800 bg-brand-dark-950 p-3 text-xs text-white placeholder:text-brand-gray-500 focus:border-brand-orange focus:outline-none font-sans"
              />
            </div>
          </div>
        </Card>

        {/* Vision & About Section */}
        <Card className="p-6 bg-brand-dark-900/90 border-brand-dark-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-brand-dark-800 pb-4">
            <FileText className="w-5 h-5 text-brand-orange" />
            <div>
              <h3 className="font-display font-bold text-white text-base">رسالة وهدف الفريق (About Section)</h3>
              <p className="text-xs text-brand-gray-400">نصوص التعريف بهدف المنظمة والرسالة المؤسسية</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-brand-gray-300 font-sans">عنوان قسم التعريف</label>
              <Input
                name="setting.about.title"
                defaultValue={settings["about.title"] || ""}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-brand-gray-300 font-sans">نص الرسالة والرؤية المؤسسية</label>
              <textarea
                name="setting.about.description"
                rows={4}
                defaultValue={settings["about.description"] || ""}
                className="w-full rounded-md border border-brand-dark-800 bg-brand-dark-950 p-3 text-xs text-white placeholder:text-brand-gray-500 focus:border-brand-orange focus:outline-none font-sans"
              />
            </div>
          </div>
        </Card>

        {/* Stats Metrics Section */}
        <Card className="p-6 bg-brand-dark-900/90 border-brand-dark-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-brand-dark-800 pb-4">
            <BarChart3 className="w-5 h-5 text-brand-orange" />
            <div>
              <h3 className="font-display font-bold text-white text-base">الأرقام والإحصائيات التراكمية (Stats Bar)</h3>
              <p className="text-xs text-brand-gray-400">القيم الإحصائية المعروضة في شريط الأرقام بالصفحة الرئيسية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-brand-gray-300 font-sans">ساعات التطوع الموثقة</label>
              <Input
                name="setting.stat.hours"
                defaultValue={settings["stat.hours"] || "+600"}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-brand-gray-300 font-sans">الأوراق والمقالات العلمية</label>
              <Input
                name="setting.stat.articles"
                defaultValue={settings["stat.articles"] || "+45"}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-brand-gray-300 font-sans">الأعضاء الفاعلون</label>
              <Input
                name="setting.stat.members"
                defaultValue={settings["stat.members"] || "+30"}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-brand-gray-300 font-sans">الأقسام التخصصية</label>
              <Input
                name="setting.stat.departments"
                defaultValue={settings["stat.departments"] || "4"}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Floating Save Button */}
        <div className="flex justify-end pt-4 border-t border-brand-dark-800">
          <Button type="submit" size="md" className="gap-2 px-6">
            <Save className="w-4 h-4" />
            <span>حفظ جميع التغييرات</span>
          </Button>
        </div>

      </form>

      {/* Partners Section Manager */}
      <div className="pt-8 border-t border-brand-dark-800 space-y-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-brand-orange" />
          <h2 className="font-display font-bold text-white text-lg">إدارة الشركاء والرعاة الرسميين</h2>
        </div>

        <AdminPartnerManager partners={partners} />
      </div>

    </div>
  );
}
