"use client";

import React, { useState, useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createEditorialMemberAction, updateEditorialMemberAction } from "@/app/actions/editorial-actions";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import {
  UserPlus,
  Edit3,
  X,
  Upload,
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface EditorialMemberDialogProps {
  mode: "create" | "edit";
  member?: {
    id: string;
    fullName: string;
    academicRank?: string | null;
    university?: string | null;
    specialty?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    orcidUrl?: string | null;
    order?: number;
  } | null;
}

export function EditorialMemberDialog({ mode, member }: EditorialMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(member?.avatarUrl || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAvatarUrl(member?.avatarUrl || "");
    setImageError(false);
    setUploadErrorMessage(null);
  }, [member]);

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
    setUploadErrorMessage(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "avatars");
      if (publicUrl && !publicUrl.startsWith("blob:")) {
        setAvatarUrl(publicUrl);
      }
    } catch (err: any) {
      console.error("[EDITORIAL AVATAR UPLOAD ERROR]:", err);
      setImageError(true);
      setUploadErrorMessage(err.message || "فشل رفع الصورة إلى Supabase");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <h3 className="font-display font-bold text-white text-lg">
                {mode === "edit" ? `تعديل المحكم الأكاديمي: ${member?.fullName}` : "إضافة عضو جديد لهيئة التحرير الأكاديمية"}
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

              {/* Avatar Upload */}
              <div className="space-y-2">
                <label className="block text-[#6B7280] font-medium">
                  الصورة الشخصية الأكاديمية (Avatar)
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
                        <span>جاري الرفع...</span>
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

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">
                  الاسم الثلاثي والألقاب الأكاديمية <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={member?.fullName || ""}
                  required
                  placeholder="مثال: أ.د. عبد الله الشمري"
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              {/* Academic Rank & University Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[#6B7280] font-medium">الرتبة الأكاديمية</label>
                  <input
                    type="text"
                    name="academicRank"
                    defaultValue={member?.academicRank || ""}
                    placeholder="مثال: أستاذ دكتور / رئيس تحرير"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[#6B7280] font-medium">الجامعة / المؤسسة</label>
                  <input
                    type="text"
                    name="university"
                    defaultValue={member?.university || ""}
                    placeholder="مثال: جامعة الملك سعود / Oxford"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>
              </div>

              {/* Specialty & ORCID Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[#6B7280] font-medium">التخصص الدقيق</label>
                  <input
                    type="text"
                    name="specialty"
                    defaultValue={member?.specialty || ""}
                    placeholder="مثال: الذكاء الاصطناعي والأمن السيبراني"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[#6B7280] font-medium">رابط الملف الأكاديمي (ORCID)</label>
                  <input
                    type="url"
                    name="orcidUrl"
                    defaultValue={member?.orcidUrl || ""}
                    placeholder="https://orcid.org/0000-0002-1825-0097"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>
              </div>

              {/* Order */}
              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">ترتيب الظهور (Order)</label>
                <input
                  type="number"
                  name="order"
                  defaultValue={member?.order || 0}
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">النبذة التعريفية والتسلسل الأكاديمي</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={member?.bio || ""}
                  placeholder="موجز عن المسيرة الأكاديمية والاهتمامات البحثية..."
                  className="w-full p-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
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
