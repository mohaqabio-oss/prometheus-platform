"use client";

import React, { useState, useTransition } from "react";
import {
  SiteSettingsData,
  PartnerRecord,
  HomeBlockConfig,
  updateSiteBuilderAction,
  AcademicSpecsConfig,
} from "@/app/actions/website-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPartnerManager } from "@/components/admin/admin-partner-manager";
import {
  Palette,
  Type,
  LayoutGrid,
  Building2,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Link2,
  ShieldAlert,
  Mail,
  ShieldCheck,
} from "lucide-react";

interface AdminSiteBuilderFormProps {
  initialSettings: SiteSettingsData;
  partners: PartnerRecord[];
}

export function AdminSiteBuilderForm({
  initialSettings,
  partners,
}: AdminSiteBuilderFormProps) {
  const [activeTab, setActiveTab] = useState<
    "theme" | "headers" | "ethics" | "contact" | "specs" | "blocks" | "partners"
  >("theme");
  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Tab Navigation items
  const tabs = [
    { id: "theme", label: "ألوان ومظهر الموقع", icon: <Palette className="w-4 h-4" /> },
    { id: "headers", label: "إدارة الترويسات والعناوين (CMS)", icon: <Type className="w-4 h-4" /> },
    { id: "specs", label: "شارة التوثيق الأكاديمي (Academic Specs)", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "ethics", label: "محتوى أخلاقيات النشر", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "contact", label: "بيانات صفحة اتصل بنا", icon: <Mail className="w-4 h-4" /> },
    { id: "blocks", label: "منشئ المكونات (Homepage)", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "partners", label: "إدارة الشركاء والرعاة", icon: <Building2 className="w-4 h-4" /> },
  ];

  // Helper for setting color
  const handleColorChange = (key: "primaryColor" | "secondaryColor", val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  // Helper for setting page header fields
  const handleHeaderChange = (
    sectionKey: keyof SiteSettingsData["pageHeaders"],
    field: string,
    val: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      pageHeaders: {
        ...prev.pageHeaders,
        [sectionKey]: {
          ...(prev.pageHeaders[sectionKey] || {}),
          [field]: val,
        },
      },
    }));
  };

  // Helper for Academic Specs
  const handleSpecChange = (field: keyof AcademicSpecsConfig, val: any) => {
    setSettings((prev) => ({
      ...prev,
      academicSpecs: {
        ...(prev.academicSpecs || {
          enabled: false,
          volumeTitle: "SPEC REGISTRY // VOL. 04",
          peerReviewType: "Double-Blind Peer Review",
          licenseType: "Open Access (CC BY 4.0)",
          repositoryStatus: "Active Academic Repository",
        }),
        [field]: val,
      },
    }));
  };

  // Helper for Home Blocks
  const addBlock = (type: "info-box" | "image-card" | "shortcut-link") => {
    const newBlock: HomeBlockConfig = {
      id: `block-${Date.now()}`,
      type,
      title: type === "info-box" ? "عنوان الميزة أو المكون" : type === "image-card" ? "عنوان البطاقة المصورة" : "عنوان الرابط السريع",
      subtitle: "التصنيف الفرعي",
      content: "وصف مختصر توضيحي يعرض المحتوى المطلوب بأسلوب بصري جذاب.",
      image_url: type === "image-card" ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" : "",
      target_url: "/articles",
    };
    setSettings((prev) => ({
      ...prev,
      homeBlocks: [...prev.homeBlocks, newBlock],
    }));
  };

  const updateBlock = (id: string, field: keyof HomeBlockConfig, val: string) => {
    setSettings((prev) => ({
      ...prev,
      homeBlocks: prev.homeBlocks.map((b) =>
        b.id === id ? { ...b, [field]: val } : b
      ),
    }));
  };

  const deleteBlock = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      homeBlocks: prev.homeBlocks.filter((b) => b.id !== id),
    }));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const updated = [...settings.homeBlocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSettings((prev) => ({ ...prev, homeBlocks: updated }));
  };

  // Submit Handler
  const handleSave = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await updateSiteBuilderAction(settings);
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "تم حفظ التعديلات وإعادة بناء المظهر العام والمحتوى بنجاح!",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "حدث خطأ أثناء حفظ الإعدادات.",
        });
      }
    });
  };

  const specs = settings.academicSpecs || {
    enabled: false,
    volumeTitle: "SPEC REGISTRY // VOL. 04",
    peerReviewType: "Double-Blind Peer Review",
    licenseType: "Open Access (CC BY 4.0)",
    repositoryStatus: "Active Academic Repository",
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-sans border ${
            statusMessage.type === "success"
              ? "bg-[#0A0F1D] border-emerald-500/40 text-emerald-300"
              : "bg-[#0A0F1D] border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs hover:underline opacity-80"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Tabs Header Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-mono transition-all duration-200 whitespace-nowrap border-b-2 ${
                isActive
                  ? "bg-[#141C2F] text-[#F8FAFC] font-bold border-[#D49B4B]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] border-transparent hover:bg-[#141C2F]/50"
              }`}
            >
              <span className={isActive ? "text-[#D49B4B]" : "text-[#94A3B8]"}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: THEME & COLOR SETTINGS */}
      {activeTab === "theme" && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#141C2F] border border-[#1E293B] space-y-6 rounded-2xl">
            <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
              <Palette className="w-5 h-5 text-[#D49B4B]" />
              <div>
                <h3 className="font-serif font-bold text-[#F8FAFC] text-base">
                  ألوان الثيم الرئيسية (Theme Palette)
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans">
                  التحكم الديناميكي باللون الأساسي (Primary Color) ولون الخلفية الثاني (Secondary Color) عبر كامل الواجهة العامة.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Primary Color Picker */}
              <div className="space-y-3 p-4 bg-[#0A0F1D] border border-[#1E293B] rounded-xl">
                <label className="text-xs text-[#F8FAFC] font-bold block font-sans">
                  اللون الأساسي للتميز والأزرار (Primary Color)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <Input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    className="font-mono text-xs uppercase"
                    placeholder="#D49B4B"
                  />
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  يستخدم للأزرار، التوهجات الشفافة، الإطارات النشطة، والنصوص التمييزية.
                </p>
              </div>

              {/* Secondary Color Picker */}
              <div className="space-y-3 p-4 bg-[#0A0F1D] border border-[#1E293B] rounded-xl">
                <label className="text-xs text-[#F8FAFC] font-bold block font-sans">
                  اللون الثانوي للخلفية والتفاصيل (Secondary Color)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <Input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    className="font-mono text-xs uppercase"
                    placeholder="#0A0F1D"
                  />
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  يستخدم لخلفية الصفحة العامة، الهيدر، والأقسام الثانوية.
                </p>
              </div>

            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: PAGE HEADERS & TYPOGRAPHY CMS */}
      {activeTab === "headers" && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#141C2F] border border-[#1E293B] space-y-8 rounded-2xl">
            
            <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
              <Type className="w-5 h-5 text-[#D49B4B]" />
              <div>
                <h3 className="font-serif font-bold text-[#F8FAFC] text-base">
                  نظام إدارة الترويسات والعناوين العامة (Page Headers CMS)
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans">
                  تعديل الترويسات، العناوين، والشارات الوصفية لمختلف صفحات الواجهة العامة مباشرة من قاعدة البيانات.
                </p>
              </div>
            </div>

            {/* Headers Sections List */}
            <div className="space-y-6">
              
              {/* Home Hero Section */}
              <div className="p-4 bg-[#0A0F1D] border border-[#1E293B] rounded-xl space-y-3">
                <h4 className="font-bold text-xs text-[#D49B4B] font-mono">
                  1. الواجهة الرئيسية (Home Hero Header)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#94A3B8]">الشارة الوصفية (Badge)</label>
                    <Input
                      value={settings.pageHeaders.homeHero?.badge || ""}
                      onChange={(e) => handleHeaderChange("homeHero", "badge", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] text-[#94A3B8]">العنوان الرئيسي</label>
                    <Input
                      value={settings.pageHeaders.homeHero?.title || ""}
                      onChange={(e) => handleHeaderChange("homeHero", "title", e.target.value)}
                      className="text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[11px] text-[#94A3B8]">الوصف الفرعي</label>
                    <textarea
                      rows={2}
                      value={settings.pageHeaders.homeHero?.subtitle || ""}
                      onChange={(e) => handleHeaderChange("homeHero", "subtitle", e.target.value)}
                      className="w-full rounded-md border border-[#1E293B] bg-[#141C2F] p-3 text-xs text-[#F8FAFC] focus:border-[#D49B4B] focus:outline-none font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Editorial Board Header */}
              <div className="p-4 bg-[#0A0F1D] border border-[#1E293B] rounded-xl space-y-3">
                <h4 className="font-bold text-xs text-[#D49B4B] font-mono">
                  2. صفحة الهيئة التحريرية (/editorial-board)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#94A3B8]">الشارة</label>
                    <Input
                      value={settings.pageHeaders.editorialBoard?.badge || ""}
                      onChange={(e) => handleHeaderChange("editorialBoard", "badge", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] text-[#94A3B8]">العنوان الرئيسي</label>
                    <Input
                      value={settings.pageHeaders.editorialBoard?.title || ""}
                      onChange={(e) => handleHeaderChange("editorialBoard", "title", e.target.value)}
                      className="text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[11px] text-[#94A3B8]">الوصف</label>
                    <Input
                      value={settings.pageHeaders.editorialBoard?.subtitle || ""}
                      onChange={(e) => handleHeaderChange("editorialBoard", "subtitle", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Articles Page Header */}
              <div className="p-4 bg-[#0A0F1D] border border-[#1E293B] rounded-xl space-y-3">
                <h4 className="font-bold text-xs text-[#D49B4B] font-mono">
                  3. صفحة الأوراق والمقالات العلمية (/articles)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#94A3B8]">الشارة</label>
                    <Input
                      value={settings.pageHeaders.articles?.badge || ""}
                      onChange={(e) => handleHeaderChange("articles", "badge", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] text-[#94A3B8]">عنوان الصفحة</label>
                    <Input
                      value={settings.pageHeaders.articles?.title || ""}
                      onChange={(e) => handleHeaderChange("articles", "title", e.target.value)}
                      className="text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[11px] text-[#94A3B8]">الوصف</label>
                    <Input
                      value={settings.pageHeaders.articles?.subtitle || ""}
                      onChange={(e) => handleHeaderChange("articles", "subtitle", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Members Page Header */}
              <div className="p-4 bg-[#0A0F1D] border border-[#1E293B] rounded-xl space-y-3">
                <h4 className="font-bold text-xs text-[#D49B4B] font-mono">
                  4. صفحة دليل الأعضاء والكوادر (/members)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#94A3B8]">الشارة</label>
                    <Input
                      value={settings.pageHeaders.members?.badge || ""}
                      onChange={(e) => handleHeaderChange("members", "badge", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] text-[#94A3B8]">عنوان الصفحة</label>
                    <Input
                      value={settings.pageHeaders.members?.title || ""}
                      onChange={(e) => handleHeaderChange("members", "title", e.target.value)}
                      className="text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[11px] text-[#94A3B8]">الوصف</label>
                    <Input
                      value={settings.pageHeaders.members?.subtitle || ""}
                      onChange={(e) => handleHeaderChange("members", "subtitle", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>

          </Card>
        </div>
      )}

      {/* TAB 3: ACADEMIC SPECS BADGE TOGGLE & CMS */}
      {activeTab === "specs" && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#141C2F] border border-[#1E293B] space-y-6 rounded-2xl">
            <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
              <ShieldCheck className="w-5 h-5 text-[#D49B4B]" />
              <div>
                <h3 className="font-serif font-bold text-[#F8FAFC] text-base">
                  شارة التوثيق الأكاديمي (Academic Specs Box)
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans">
                  التحكم في تفعيل أو إخفاء صندوق التوثيق الأكاديمي بالصفحة الرئيسية وتحديث النصوص المعتمدة.
                </p>
              </div>
            </div>

            {/* Toggle Enable/Disable Checkbox */}
            <div className="p-4 bg-[#0A0F1D] border border-[#1E293B] rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#F8FAFC] block cursor-pointer" htmlFor="toggle-spec">
                  تفعيل عارض شارة التوثيق الأكاديمي (Academic Spec Box)
                </label>
                <p className="text-[11px] text-[#94A3B8]">
                  عند التفعيل، يظهر الصندوق الأكاديمي الفاخر بجانب الهيدر الرئيسي على الواجهة العامة.
                </p>
              </div>

              <input
                id="toggle-spec"
                type="checkbox"
                checked={specs.enabled}
                onChange={(e) => handleSpecChange("enabled", e.target.checked)}
                className="w-5 h-5 accent-[#D49B4B] cursor-pointer rounded"
              />
            </div>

            {/* Spec Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] text-[#94A3B8]">عنوان الفهرسة / المجلد (Volume Title)</label>
                  <Input
                    value={specs.volumeTitle || ""}
                    onChange={(e) => handleSpecChange("volumeTitle", e.target.value)}
                    className="text-xs font-mono"
                    placeholder="SPEC REGISTRY // VOL. 04"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#94A3B8]">نوع التحكيم المعتمد (Peer-Review Type)</label>
                  <Input
                    value={specs.peerReviewType || ""}
                    onChange={(e) => handleSpecChange("peerReviewType", e.target.value)}
                    className="text-xs"
                    placeholder="Double-Blind Peer Review"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#94A3B8]">نوع الترخيص والوصول (License Type)</label>
                  <Input
                    value={specs.licenseType || ""}
                    onChange={(e) => handleSpecChange("licenseType", e.target.value)}
                    className="text-xs font-mono"
                    placeholder="Open Access (CC BY 4.0)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#94A3B8]">حالة الأرشيف / المستودع (Repository Status)</label>
                  <Input
                    value={specs.repositoryStatus || ""}
                    onChange={(e) => handleSpecChange("repositoryStatus", e.target.value)}
                    className="text-xs"
                    placeholder="Active Academic Repository"
                  />
                </div>

              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: PUBLICATION ETHICS CMS */}
      {activeTab === "ethics" && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#141C2F] border border-[#1E293B] space-y-6 rounded-2xl">
            <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
              <ShieldAlert className="w-5 h-5 text-[#D49B4B]" />
              <div>
                <h3 className="font-serif font-bold text-[#F8FAFC] text-base">
                  إدارة محتوى صفحة أخلاقيات النشر (/publication-ethics)
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans">
                  التحكم بترويسة الصفحة، الشارات، وميثاق النزاهة العلمية المعروض للمستخدمين.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#94A3B8]">الشارة</label>
                  <Input
                    value={settings.pageHeaders.publicationEthics?.badge || ""}
                    onChange={(e) => handleHeaderChange("publicationEthics", "badge", e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] text-[#94A3B8]">عنوان الصفحة</label>
                  <Input
                    value={settings.pageHeaders.publicationEthics?.title || ""}
                    onChange={(e) => handleHeaderChange("publicationEthics", "title", e.target.value)}
                    className="text-xs font-bold"
                  />
                </div>
                <div className="space-y-1 md:col-span-3">
                  <label className="text-[11px] text-[#94A3B8]">الوصف العام للصفحة</label>
                  <Input
                    value={settings.pageHeaders.publicationEthics?.subtitle || ""}
                    onChange={(e) => handleHeaderChange("publicationEthics", "subtitle", e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#0A0F1D] border border-[#1E293B] rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[#F8FAFC] font-mono">
                  ميثاق النزاهة والشفافية (Ethos Card)
                </h4>
                <div className="space-y-2">
                  <label className="text-[11px] text-[#94A3B8]">عنوان بطاقة الميثاق</label>
                  <Input
                    value={settings.pageHeaders.publicationEthics?.ethosTitle || ""}
                    onChange={(e) => handleHeaderChange("publicationEthics", "ethosTitle", e.target.value)}
                    className="text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-[#94A3B8]">نص ميثاق النزاهة والشفافية</label>
                  <textarea
                    rows={3}
                    value={settings.pageHeaders.publicationEthics?.ethosText || ""}
                    onChange={(e) => handleHeaderChange("publicationEthics", "ethosText", e.target.value)}
                    className="w-full rounded-md border border-[#1E293B] bg-[#141C2F] p-3 text-xs text-[#F8FAFC] focus:border-[#D49B4B] focus:outline-none font-sans"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: CONTACT US CMS */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#141C2F] border border-[#1E293B] space-y-6 rounded-2xl">
            <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
              <Mail className="w-5 h-5 text-[#D49B4B]" />
              <div>
                <h3 className="font-serif font-bold text-[#F8FAFC] text-base">
                  إدارة محتوى ومعلومات صفحة اتصل بنا (/contact)
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans">
                  التحكم بالبريد الإلكتروني للتحرير، وصف المكتب التحريري، وساعات العمل.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#94A3B8]">الشارة</label>
                  <Input
                    value={settings.pageHeaders.contact?.badge || ""}
                    onChange={(e) => handleHeaderChange("contact", "badge", e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] text-[#94A3B8]">عنوان الصفحة</label>
                  <Input
                    value={settings.pageHeaders.contact?.title || ""}
                    onChange={(e) => handleHeaderChange("contact", "title", e.target.value)}
                    className="text-xs font-bold"
                  />
                </div>
                <div className="space-y-1 md:col-span-3">
                  <label className="text-[11px] text-[#94A3B8]">الوصف</label>
                  <Input
                    value={settings.pageHeaders.contact?.subtitle || ""}
                    onChange={(e) => handleHeaderChange("contact", "subtitle", e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#94A3B8]">البريد الإلكتروني المعتمد</label>
                  <Input
                    value={settings.pageHeaders.contact?.email || ""}
                    onChange={(e) => handleHeaderChange("contact", "email", e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#94A3B8]">ساعات العمل والاستقبال</label>
                  <Input
                    value={settings.pageHeaders.contact?.hours || ""}
                    onChange={(e) => handleHeaderChange("contact", "hours", e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] text-[#94A3B8]">وصف المكتب التحريري</label>
                  <Input
                    value={settings.pageHeaders.contact?.officeInfo || ""}
                    onChange={(e) => handleHeaderChange("contact", "officeInfo", e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: HOMEPAGE BLOCK BUILDER */}
      {activeTab === "blocks" && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#141C2F] border border-[#1E293B] space-y-6 rounded-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-[#D49B4B]" />
                <div>
                  <h3 className="font-serif font-bold text-[#F8FAFC] text-base">
                    منشئ المكونات الديناميكية (Home Block Builder)
                  </h3>
                  <p className="text-xs text-[#94A3B8] font-sans">
                    إضافة، تعديل، وترتيب الصناديق والمكونات التفاعلية المعروضة ديناميكياً على الصفحة الرئيسية.
                  </p>
                </div>
              </div>

              {/* Add Block Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("info-box")}
                  className="gap-1.5 text-xs rounded-xl border-[#1E293B] bg-[#0A0F1D] text-[#F8FAFC]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D49B4B]" />
                  <span>+ صندوق معلومات</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("image-card")}
                  className="gap-1.5 text-xs rounded-xl border-[#1E293B] bg-[#0A0F1D] text-[#F8FAFC]"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#D49B4B]" />
                  <span>+ بطاقة مصورة</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addBlock("shortcut-link")}
                  className="gap-1.5 text-xs rounded-xl border-[#1E293B] bg-[#0A0F1D] text-[#F8FAFC]"
                >
                  <Link2 className="w-3.5 h-3.5 text-[#D49B4B]" />
                  <span>+ رابط سريع</span>
                </Button>
              </div>
            </div>

            {/* Blocks List */}
            {settings.homeBlocks.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-[#1E293B] rounded-xl space-y-3">
                <LayoutGrid className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <p className="text-xs text-[#94A3B8]">
                  لا توجد مكونات ديناميكية حالياً. اضغط على أحد الأزرار أعلاه لإضافة مكون جديد.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {settings.homeBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="p-5 bg-[#0A0F1D] border border-[#1E293B] rounded-xl space-y-4 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#D49B4B]/20 border border-[#D49B4B]/30 text-[#D49B4B] font-mono text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#F8FAFC] uppercase">
                          {block.type === "info-box"
                            ? "صندوق معلومات (Info Box)"
                            : block.type === "image-card"
                            ? "بطاقة مصورة (Image Card)"
                            : "رابط سريع (Shortcut Link)"}
                        </span>
                      </div>

                      {/* Reorder and Delete Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveBlock(index, "up")}
                          className="p-1.5 rounded-lg border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30"
                          title="تحريك للأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === settings.homeBlocks.length - 1}
                          onClick={() => moveBlock(index, "down")}
                          className="p-1.5 rounded-lg border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30"
                          title="تحريك للأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBlock(block.id)}
                          className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950/50 mr-2"
                          title="حذف المكون"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94A3B8]">نوع المكون</label>
                        <select
                          value={block.type}
                          onChange={(e) => updateBlock(block.id, "type", e.target.value as any)}
                          className="w-full bg-[#141C2F] border border-[#1E293B] rounded-xl px-3 py-2 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#D49B4B]"
                        >
                          <option value="info-box">صندوق معلومات (Info Box)</option>
                          <option value="image-card">بطاقة مصورة (Image Card)</option>
                          <option value="shortcut-link">رابط سريع (Shortcut Link)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94A3B8]">العنوان الفرعي / التصنيف</label>
                        <Input
                          value={block.subtitle || ""}
                          onChange={(e) => updateBlock(block.id, "subtitle", e.target.value)}
                          className="text-xs"
                          placeholder="مثال: الهندسة والبرمجيات"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] text-[#94A3B8]">العنوان الرئيسي</label>
                        <Input
                          value={block.title}
                          onChange={(e) => updateBlock(block.id, "title", e.target.value)}
                          className="text-xs font-bold"
                          placeholder="عنوان المكون"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] text-[#94A3B8]">المحتوى والوصف</label>
                        <textarea
                          rows={2}
                          value={block.content || ""}
                          onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                          className="w-full rounded-md border border-[#1E293B] bg-[#141C2F] p-3 text-xs text-[#F8FAFC] focus:border-[#D49B4B] focus:outline-none font-sans"
                          placeholder="تفاصيل المكون النصية..."
                        />
                      </div>

                      {block.type === "image-card" && (
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[11px] text-[#94A3B8]">رابط الصورة (Image URL)</label>
                          <Input
                            value={block.image_url || ""}
                            onChange={(e) => updateBlock(block.id, "image_url", e.target.value)}
                            className="text-xs font-mono"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                      )}

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] text-[#94A3B8]">رابط التوجيه (Target URL)</label>
                        <Input
                          value={block.target_url || ""}
                          onChange={(e) => updateBlock(block.id, "target_url", e.target.value)}
                          className="text-xs font-mono"
                          placeholder="/articles أو /join-us"
                        />
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </Card>
        </div>
      )}

      {/* TAB 7: PARTNERSHIPS & SPONSORS */}
      {activeTab === "partners" && (
        <div className="space-y-6">
          <Card className="p-6 bg-[#141C2F] border border-[#1E293B] space-y-6 rounded-2xl">
            <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
              <Building2 className="w-5 h-5 text-[#D49B4B]" />
              <div>
                <h3 className="font-serif font-bold text-[#F8FAFC] text-base">
                  إدارة الشركاء والرعاة الرسميين
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans">
                  إضافة وإزالة شعارات المؤسسات والشركاء الداعمين لمنصة الفريق.
                </p>
              </div>
            </div>

            <AdminPartnerManager partners={partners} />
          </Card>
        </div>
      )}

      {/* Global Bottom Actions Bar */}
      <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between sticky bottom-4 bg-[#141C2F]/95 p-4 rounded-2xl backdrop-blur-md shadow-xl border border-[#1E293B] z-20">
        <span className="text-xs font-mono text-[#94A3B8]">
          * الحفظ ينطبق على الألوان، الترويسات، شارة التوثيق الأكاديمي، والمكونات.
        </span>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          size="md"
          className="gap-2 px-8 bg-[#D49B4B] hover:bg-[#b8823b] text-[#0A0F1D] font-bold rounded-xl shadow-lg transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? "جاري حفظ التعديلات..." : "حفظ جميع التغييرات"}</span>
        </Button>
      </div>

    </div>
  );
}
