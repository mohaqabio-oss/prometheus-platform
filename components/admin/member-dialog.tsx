"use client";

import React, { useState, useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createMemberAction, updateMemberAction } from "@/app/actions/hr-actions";
import { convertImageToBase64 } from "@/lib/utils/image-converter";
import {
  UserPlus,
  Edit3,
  X,
  Upload,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

export interface CustomSectionItem {
  title: string;
  content: string;
}

export interface MemberDialogProps {
  mode: "create" | "edit";
  member?: {
    id: string;
    fullName: string;
    title?: string | null;
    departmentName?: string | null;
    volunteerHours?: number;
    status?: string;
    profileImage?: string | null;
    avatarUrl?: string | null;
    customSections?: any;
  } | null;
}

export function MemberDialog({ mode, member }: MemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(
    member?.profileImage || member?.avatarUrl || ""
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(member?.profileImage || member?.avatarUrl || "");
    setImageError(false);
    setUploadErrorMessage(null);
  }, [member]);

  const initialSections: CustomSectionItem[] = Array.isArray(member?.customSections)
    ? member.customSections
    : [];
  const [customSections, setCustomSections] = useState<CustomSectionItem[]>(initialSections);

  const actionFn = mode === "edit" ? updateMemberAction : createMemberAction;
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (imageUrl && !imageUrl.startsWith("blob:")) {
      formData.set("profileImage", imageUrl);
    }
    formData.set("customSections", JSON.stringify(customSections));
    const res = await actionFn(prevState, formData);
    if (res.success) {
      setOpen(false);
    }
    return res;
  }, null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError(false);
    setUploadErrorMessage(null);
    try {
      const base64Data = await convertImageToBase64(file);
      setImageUrl(base64Data);
    } catch (err: any) {
      console.error("[MEMBER DIALOG BASE64 ERROR]:", err);
      setImageError(true);
      setUploadErrorMessage(err.message || "فشل معالجة الصورة في المتصفح.");
    } finally {
      setUploadingImage(false);
    }
  };

  const addCustomSection = () => {
    setCustomSections([...customSections, { title: "", content: "" }]);
  };

  const removeCustomSection = (index: number) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
  };

  const updateCustomSection = (index: number, key: "title" | "content", val: string) => {
    const updated = [...customSections];
    updated[index][key] = val;
    setCustomSections(updated);
  };

  return (
    <>
      {mode === "create" ? (
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md font-sans"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة عضو جديد</span>
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 gap-1.5 text-xs rounded-xl border-[#6B7280]/30 text-white hover:text-[#E84A0C]"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>تعديل</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <h3 className="font-display font-bold text-white text-lg">
                {mode === "edit" ? `تعديل ملف العضو: ${member?.fullName}` : "إضافة عضو جديد للكادر"}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-[#6B7280] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {(state?.error || uploadErrorMessage) && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{uploadErrorMessage || state?.error}</span>
              </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-4 text-xs font-sans">
              {mode === "edit" && <input type="hidden" name="id" value={member?.id} />}

              {/* Avatar Upload to Supabase 'avatars' Bucket */}
              <div className="space-y-2">
                <label className="block text-[#6B7280] font-medium">
                  الصورة الشخصية (Profile Picture / Avatar)
                </label>
                <div className="flex items-center gap-4">
                  {imageUrl && !imageError ? (
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#6B7280]/30 shrink-0">
                      <img
                        src={imageUrl}
                        alt="Avatar"
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#6B7280] shrink-0 font-mono text-xs">
                      No Img
                    </div>
                  )}

                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-white hover:border-[#E84A0C] transition-all">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" />
                        <span>جاري الرفع إلى Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#E84A0C]" />
                        <span>رفع صورة للملف الشخصي</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">
                  الاسم الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={member?.fullName || ""}
                  required
                  placeholder="مثال: د. محمد علي"
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              {/* Title / Role */}
              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">المسمى الوظيفي / الدور التطوعي</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={member?.title || ""}
                  placeholder="مثال: قائد فريق البرمجيات / باحث أكاديمي"
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">القسم التشغيلي</label>
                <select
                  name="departmentName"
                  defaultValue={member?.departmentName || "الهندسة البرمجية"}
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                >
                  <option value="الهندسة البرمجية">الهندسة البرمجية (Software Engineering)</option>
                  <option value="البحث العلمي">البحث العلمي (Scientific Research)</option>
                  <option value="التعليم والتطوير">التعليم والتطوير (Education)</option>
                  <option value="الموارد البشرية والعمليات">الموارد البشرية (HR & Operations)</option>
                  <option value="عام">عام (General)</option>
                </select>
              </div>

              {/* Hours & Status Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[#6B7280] font-medium">
                    {mode === "edit" ? "الساعات التطوعية" : "الساعات الأولية"}
                  </label>
                  <input
                    type={mode === "edit" ? "number" : "number"}
                    name={mode === "edit" ? "volunteerHours" : "initialHours"}
                    defaultValue={member?.volunteerHours || 0}
                    min="0"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[#6B7280] font-medium">حالة العضوية</label>
                  <select
                    name="status"
                    defaultValue={member?.status || "ACTIVE"}
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  >
                    <option value="ACTIVE">نشط (ACTIVE)</option>
                    <option value="INACTIVE">غير نشط (INACTIVE)</option>
                    <option value="ALUMNI">خريج متطوع (ALUMNI)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Custom Sections */}
              <div className="space-y-3 pt-3 border-t border-[#6B7280]/20">
                <div className="flex items-center justify-between">
                  <label className="block text-[#6B7280] font-medium">
                    أقسام مخصصة إضافية (Custom Profile Sections)
                  </label>
                  <Button
                    type="button"
                    onClick={addCustomSection}
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] gap-1 border-[#6B7280]/30 text-[#E84A0C] hover:bg-[#E84A0C]/10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة قسم</span>
                  </Button>
                </div>

                {customSections.map((sec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#1A2B4A]/50 border border-[#6B7280]/20 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="عنوان القسم (مثال: الإنجازات الأكاديمية)"
                        value={sec.title}
                        onChange={(e) => updateCustomSection(idx, "title", e.target.value)}
                        className="flex-1 h-8 px-2.5 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-lg text-white text-xs focus:outline-none focus:border-[#E84A0C]"
                      />
                      <Button
                        type="button"
                        onClick={() => removeCustomSection(idx)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="محتوى القسم التفصيلي..."
                      value={sec.content}
                      onChange={(e) => updateCustomSection(idx, "content", e.target.value)}
                      className="w-full p-2.5 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-lg text-white text-xs focus:outline-none focus:border-[#E84A0C]"
                    />
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#6B7280]/20">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  className="text-[#6B7280] hover:text-white"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || uploadingImage}
                  className="bg-[#E84A0C] hover:bg-[#D03E06] text-white gap-2 rounded-xl"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{mode === "edit" ? "حفظ التغييرات" : "إضافة العضو"}</span>
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
