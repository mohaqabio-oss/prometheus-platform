"use client";

import React, { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createMemberAction, updateMemberAction } from "@/app/actions/hr-actions";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import { UserPlus, Edit3, X, AlertCircle, Upload, Plus, Trash2, Loader2 } from "lucide-react";

export interface CustomSectionItem {
  title: string;
  content: string;
}

export interface MemberDialogProps {
  member?: {
    id: string;
    fullName: string;
    email?: string;
    title?: string | null;
    departmentName?: string | null;
    volunteerHours?: number;
    status?: string;
    avatarUrl?: string | null;
    profileImage?: string | null;
    customSections?: any;
  } | null;
  mode?: "create" | "edit";
}

export function MemberDialog({ member, mode = "create" }: MemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(
    member?.profileImage || member?.avatarUrl || ""
  );

  const initialSections: CustomSectionItem[] = Array.isArray(member?.customSections)
    ? member.customSections
    : [];
  const [customSections, setCustomSections] = useState<CustomSectionItem[]>(initialSections);

  const actionFn = mode === "edit" ? updateMemberAction : createMemberAction;
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (imageUrl) {
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
    try {
      const publicUrl = await uploadImageToSupabase(file, "avatars");
      setImageUrl(publicUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
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
          className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md"
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
            {state?.error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{state.error}</span>
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
                  {imageUrl ? (
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#6B7280]/30 shrink-0">
                      <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover" />
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

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6B7280] font-medium mb-1">
                    الاسم الكامل (Full Name) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={member?.fullName || ""}
                    required
                    placeholder="مثال: أحمد حسن"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                {mode === "create" && (
                  <div>
                    <label className="block text-[#6B7280] font-medium mb-1">
                      البريد الإلكتروني (Email Address) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={member?.email || ""}
                      required
                      placeholder="user@prometheus-voluntary.org"
                      className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-mono focus:outline-none focus:border-[#E84A0C]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[#6B7280] font-medium mb-1">
                    المسمى الوظيفي (Title / Role)
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={member?.title || ""}
                    placeholder="مثال: Software Engineer"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] font-medium mb-1">
                    القسم التخصصي (Department)
                  </label>
                  <input
                    type="text"
                    name="departmentName"
                    defaultValue={member?.departmentName || ""}
                    placeholder="اكتب اسم القسم (مثال: الهندسة البرمجية)"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] font-medium mb-1">
                    ساعات التطوع الموثقة (Logged Hours)
                  </label>
                  <input
                    type="number"
                    name={mode === "edit" ? "volunteerHours" : "initialHours"}
                    defaultValue={member?.volunteerHours || 0}
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-mono focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                {mode === "edit" && (
                  <div>
                    <label className="block text-[#6B7280] font-medium mb-1">
                      حالة العضو (Status)
                    </label>
                    <select
                      name="status"
                      defaultValue={member?.status || "ACTIVE"}
                      className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                    >
                      <option value="ACTIVE">ACTIVE (عضو فاعل)</option>
                      <option value="INACTIVE">INACTIVE (غير نشط)</option>
                      <option value="ALUMNI">ALUMNI (خريج كادر)</option>
                      <option value="ON_LEAVE">ON_LEAVE (إجازة مؤقتة)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Dynamic Custom Sections (Custom Titled Text Details) */}
              <div className="pt-4 border-t border-[#6B7280]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-white font-bold">
                    الأقسام والخبرات المخصصة (Dynamic Custom Sections)
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomSection}
                    className="gap-1 text-xs h-7 px-2 rounded-xl border-[#6B7280]/30 text-[#E84A0C]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة قسم مخصص</span>
                  </Button>
                </div>

                {customSections.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-[#1A2B4A] border border-[#6B7280]/20 rounded-xl space-y-2 relative">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="عنوان القسم (مثال: الإنجازات الأكاديمية)"
                        value={sec.title}
                        onChange={(e) => updateCustomSection(idx, "title", e.target.value)}
                        className="w-full h-8 px-2.5 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-lg text-white font-bold focus:outline-none focus:border-[#E84A0C]"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomSection(idx)}
                        className="p-1 text-[#6B7280] hover:text-rose-400"
                        title="حذف هذا القسم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="تفاصيل ومحتوى هذا القسم المخصص..."
                      value={sec.content}
                      onChange={(e) => updateCustomSection(idx, "content", e.target.value)}
                      className="w-full p-2 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-lg text-white focus:outline-none focus:border-[#E84A0C] font-sans text-xs"
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#6B7280]/20">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border-[#6B7280]/30 text-white"
                >
                  إلغاء
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || uploadingImage}
                  className="bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md"
                >
                  {isPending ? "جاري الحفظ..." : mode === "edit" ? "تحديث بيانات العضو" : "تأكيد وإضافة العضو"}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
