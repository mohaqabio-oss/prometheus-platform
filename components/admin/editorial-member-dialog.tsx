"use client";

import React, { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  createEditorialMemberAction,
  updateEditorialMemberAction,
  EditorialMemberRecord,
} from "@/app/actions/editorial-actions";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import { UserPlus, Edit3, X, AlertCircle, Upload, Loader2, Award, GraduationCap, Globe } from "lucide-react";

export interface EditorialMemberDialogProps {
  member?: EditorialMemberRecord | null;
  mode?: "create" | "edit";
}

export function EditorialMemberDialog({ member, mode = "create" }: EditorialMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(member?.avatarUrl || "");

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const actionFn = mode === "edit" ? updateEditorialMemberAction : createEditorialMemberAction;
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (avatarUrl && !avatarUrl.startsWith("blob:")) {
      formData.set("avatarUrl", avatarUrl);
    }
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
    try {
      const publicUrl = await uploadImageToSupabase(file, "avatars");
      if (publicUrl && !publicUrl.startsWith("blob:")) {
        setAvatarUrl(publicUrl);
      }
    } catch (err) {
      console.error("Editorial avatar upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
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
          <span>إضافة عضو هيئة تحرير</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <h3 className="font-display font-bold text-white text-lg">
                {mode === "edit" ? `تعديل المحرر: ${member?.fullName}` : "إضافة عضو جديد لهيئة التحرير"}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-[#6B7280] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {state?.error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-4 text-xs font-sans">
              {mode === "edit" && <input type="hidden" name="id" value={member?.id} />}

              {/* Avatar Upload */}
              <div className="space-y-2">
                <label className="block text-[#6B7280] font-medium">
                  الصورة الشخصية (Academic Avatar)
                </label>
                <div className="flex items-center gap-4">
                  {avatarUrl && !imageError ? (
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#6B7280]/30 shrink-0">
                      <img
                        src={avatarUrl}
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
                        <span>رفع صورة أكاديمية</span>
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

              {/* Full Name & Academic Rank */}
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
                    placeholder="مثال: د. محمد علي الحكيم"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] font-medium mb-1">
                    الرتبة الأكاديمية (Academic Rank)
                  </label>
                  <input
                    type="text"
                    name="academicRank"
                    defaultValue={member?.academicRank || ""}
                    placeholder="مثال: أستاذ دكتور / رئيس تحرير"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>
              </div>

              {/* University & Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6B7280] font-medium mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#E84A0C]" />
                    <span>الجامعة / المؤسسة (University/Institution)</span>
                  </label>
                  <input
                    type="text"
                    name="university"
                    defaultValue={member?.university || ""}
                    placeholder="مثال: جامعة بغداد"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] font-medium mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#E84A0C]" />
                    <span>التخصص (Specialty/Field)</span>
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    defaultValue={member?.specialty || ""}
                    placeholder="مثال: معالجة اللغات الطبيعية"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>
              </div>

              {/* ORCID & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6B7280] font-medium mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-[#E84A0C]" />
                    <span>معرف ORCID (أو رابط الملف الأكاديمي)</span>
                  </label>
                  <input
                    type="text"
                    name="orcidUrl"
                    defaultValue={member?.orcidUrl || ""}
                    placeholder="https://orcid.org/0000-0002-1825-0097"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-mono focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] font-medium mb-1">
                    ترتيب الظهور (Display Order)
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={member?.order ?? 0}
                    placeholder="0"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-mono focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[#6B7280] font-medium mb-1">
                  السيرة الذاتية والأبحاث (Academic Bio)
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={member?.bio || ""}
                  placeholder="نبذة عن الأبحاث المنشورة والخبرات الأكاديمية..."
                  className="w-full p-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
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
                  className="bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md font-sans"
                >
                  {isPending ? "جاري الحفظ..." : mode === "edit" ? "تحديث المحرر" : "حفظ إضافة المحرر"}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
