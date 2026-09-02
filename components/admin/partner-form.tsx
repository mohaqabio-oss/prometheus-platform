"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Save, Loader2, AlertCircle, Building2, Upload, Globe, Link2, BookMarked } from "lucide-react";

interface Partner {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  bio?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

interface PartnerFormProps {
  partner?: Partner | null;
  saveAction: (prevState: any, formData: FormData) => Promise<any>;
}

export function PartnerForm({ partner, saveAction }: PartnerFormProps) {
  const [logoUrl, setLogoUrl] = useState(partner?.logoUrl || "");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (logoUrl) formData.set("logoUrl", logoUrl);
    return await saveAction(prevState, formData);
  }, null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setLogoUrl(data.url);
    } catch (err) {
      console.error("Logo upload failed:", err);
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  return (
    <form action={formAction} className="space-y-6 text-white">
      {partner?.id && <input type="hidden" name="id" value={partner.id} />}

      {state?.error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-[#0D0D0D]/90 rounded-2xl border border-[#6B7280]/20 sticky top-2 z-40 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#D49B4B]" />
          <span className="font-cairo font-bold text-white text-sm">
            {partner ? "تعديل الشريك" : "شريك مؤسسي جديد"}
          </span>
        </div>
        <Button type="submit" disabled={isPending}
          className="gap-2 bg-[#D49B4B] hover:bg-[#c08a3a] text-[#0A0F1D] rounded-xl px-6 font-bold text-xs">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ الشريك
        </Button>
      </div>

      <div className="space-y-5">

        {/* Logo */}
        <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 space-y-4">
          <h3 className="font-cairo font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#D49B4B]" />
            الشعار والهوية البصرية
          </h3>
          <div className="flex items-center gap-6">
            {logoUrl ? (
              <div className="w-24 h-24 rounded-2xl bg-white/5 border border-[#1E293B] flex items-center justify-center overflow-hidden shrink-0">
                <img src={logoUrl} alt="Logo" className="w-20 h-20 object-contain" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#6B7280] shrink-0">
                <Building2 className="w-10 h-10" />
              </div>
            )}
            <div className="space-y-3 flex-1">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-white hover:border-[#D49B4B] transition-all text-xs font-semibold">
                {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin text-[#D49B4B]" /> : <Upload className="w-4 h-4 text-[#D49B4B]" />}
                {uploadingLogo ? "جاري الرفع..." : "رفع الشعار"}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
              </label>
              <p className="text-xs text-[#6B7280] font-sans">أو أدخل رابط الشعار مباشرة:</p>
              <input type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full h-9 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-lg text-xs text-white font-inter placeholder-[#6B7280]/60 focus:outline-none focus:border-[#D49B4B]"
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 space-y-4">
          <h3 className="font-cairo font-bold text-white border-b border-[#6B7280]/20 pb-3">المعلومات الأساسية</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#6B7280] mb-1.5 block font-sans">اسم المؤسسة *</label>
              <input type="text" name="name" defaultValue={partner?.name || ""} required
                placeholder="اسم الشريك أو المؤسسة"
                className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white font-cairo focus:outline-none focus:border-[#D49B4B]"
              />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] mb-1.5 block font-sans">
                الرابط المختصر (Slug)
                <span className="text-[10px] text-[#6B7280]/60 mr-1">- يُولَّد تلقائياً إذا تُرك فارغاً</span>
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7280] font-fira">/partners/</span>
                <input type="text" name="slug" defaultValue={partner?.slug || ""}
                  placeholder="partner-name"
                  dir="ltr"
                  className="w-full h-10 pl-3 pr-24 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white font-fira focus:outline-none focus:border-[#D49B4B]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#6B7280] mb-1.5 block font-sans">
              <Globe className="w-3.5 h-3.5 inline mr-1 text-[#D49B4B]" />
              الموقع الإلكتروني
            </label>
            <input type="url" name="websiteUrl" defaultValue={partner?.websiteUrl || ""}
              placeholder="https://example.com"
              dir="ltr"
              className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white font-inter focus:outline-none focus:border-[#D49B4B]"
            />
          </div>

          <div>
            <label className="text-xs text-[#6B7280] mb-1.5 block font-sans">وصف قصير (يظهر في بطاقة الشريك)</label>
            <textarea name="description" rows={3} defaultValue={partner?.description || ""}
              placeholder="وصف مختصر عن المؤسسة الشريكة..."
              className="w-full px-3 py-2 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white font-sans focus:outline-none focus:border-[#D49B4B] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 space-y-4">
          <h3 className="font-cairo font-bold text-white flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
            <BookMarked className="w-4 h-4 text-[#D49B4B]" />
            النبذة الأكاديمية المفصّلة
          </h3>
          <p className="text-xs text-[#6B7280] font-amiri italic">
            تُعرض بخط الأميري في صفحة الشريك العامة. اكتب هنا وصفاً مفصلاً وموثقاً.
          </p>
          <textarea name="bio" rows={6} defaultValue={partner?.bio || ""}
            placeholder="النبذة التفصيلية عن المؤسسة — تاريخها، أهدافها، مجالات شراكتها مع بروميثيوس..."
            className="w-full px-3 py-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white font-amiri focus:outline-none focus:border-[#D49B4B] resize-none leading-loose"
          />
        </div>

      </div>
    </form>
  );
}
