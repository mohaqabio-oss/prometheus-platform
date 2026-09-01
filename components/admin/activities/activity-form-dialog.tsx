"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  createActivityAction,
  updateActivityAction,
  ActivityRecord,
} from "@/app/actions/activity-actions";
import {
  Plus,
  Edit2,
  X,
  Layers,
  Calendar,
  MapPin,
  Image as ImageIcon,
  GraduationCap,
  UploadCloud,
  Trash2,
  Link2,
} from "lucide-react";

interface ActivityFormDialogProps {
  activity?: ActivityRecord;
  triggerButton?: React.ReactNode;
  onSuccess?: () => void;
}

export function ActivityFormDialog({
  activity,
  triggerButton,
  onSuccess,
}: ActivityFormDialogProps) {
  const isEditing = !!activity;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(activity?.title || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [location, setLocation] = useState(activity?.location || "");
  const [type, setType] = useState<string>(activity?.type || "COURSE");
  const [status, setStatus] = useState<string>(activity?.status || "UPCOMING");
  const [totalSessions, setTotalSessions] = useState<number>(
    activity?.totalSessions || 1
  );
  const [startDate, setStartDate] = useState(
    activity?.startDate ? activity.startDate.split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    activity?.endDate ? activity.endDate.split("T")[0] : ""
  );

  // Cover Image State: File vs URL
  const [imageMode, setImageMode] = useState<"file" | "url">("file");
  const [coverImageUrl, setCoverImageUrl] = useState(activity?.coverImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    activity?.coverImage || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCoverImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    if (isEditing && activity) {
      formData.set("id", activity.id);
    }
    formData.set("title", title);
    formData.set("description", description);
    formData.set("location", location);
    formData.set("type", type);
    formData.set("status", status);
    formData.set("totalSessions", totalSessions.toString());
    if (startDate) formData.set("startDate", startDate);
    if (endDate) formData.set("endDate", endDate);

    // Attach cover image
    if (imageMode === "file" && selectedFile) {
      formData.set("coverImageFile", selectedFile);
    } else if (imageMode === "url" && coverImageUrl) {
      formData.set("coverImage", coverImageUrl);
    } else if (previewUrl && !selectedFile) {
      // Keep existing image if not changed
      formData.set("coverImage", previewUrl);
    }

    try {
      const res = isEditing
        ? await updateActivityAction(null, formData)
        : await createActivityAction(null, formData);

      if (res?.error) {
        setError(res.error);
      } else {
        setOpen(false);
        if (!isEditing) {
          setTitle("");
          setDescription("");
          setCoverImageUrl("");
          setSelectedFile(null);
          setPreviewUrl(null);
          setLocation("");
          setTotalSessions(1);
          setStartDate("");
          setEndDate("");
        }
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setOpen(true)}>{triggerButton}</div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white text-xs rounded-xl shadow-lg"
        >
          {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isEditing ? "تعديل بيانات النشاط" : "إضافة نشاط / دورة جديدة"}</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-xl sm:max-w-2xl bg-[#0D1322] border border-[#1E293B] rounded-2xl shadow-2xl p-5 sm:p-7 space-y-6 max-h-[92vh] overflow-y-auto overflow-x-hidden box-border my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 text-[#E84A0C] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base sm:text-lg font-bold text-white truncate">
                    {isEditing ? "تعديل بيانات النشاط" : "إنشاء نشاط / دورة جديدة"}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-400 truncate">
                    {isEditing
                      ? "تحديث التفاصيل ومزامنة الجلسات المعتمدة"
                      : "سيتم إنشاء جلسات الحضور تلقائياً بناءً على عدد الجلسات."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-xs font-sans">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                  <span>عنوان الدورة أو الفعالية</span>
                  <span className="text-red-400">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: معسكر هندسة وتطوير الويب الحديث Next.js 15"
                  className="w-full bg-[#080C16] border-[#1E293B] text-white focus:border-[#E84A0C] text-xs h-10"
                  required
                />
              </div>

              {/* Type, Status & Sessions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                <div className="space-y-1.5 min-w-0">
                  <label className="text-stone-300 font-semibold block truncate">نوع النشاط</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-10 bg-[#080C16] border border-[#1E293B] rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E84A0C] box-border"
                  >
                    <option value="COURSE">دورة تدريبية (Course)</option>
                    <option value="WORKSHOP">ورشة عمل (Workshop)</option>
                    <option value="BOOTCAMP">معسكر برمجي (Bootcamp)</option>
                    <option value="LECTURE">محاضرة علمية (Lecture)</option>
                    <option value="SEMINAR">ندوة تفاعلية (Seminar)</option>
                  </select>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label className="text-stone-300 font-semibold block truncate">حالة الفعالية</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 bg-[#080C16] border border-[#1E293B] rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E84A0C] box-border"
                  >
                    <option value="UPCOMING">قادمة (Upcoming)</option>
                    <option value="ONGOING">جارية حالياً (Ongoing)</option>
                    <option value="COMPLETED">مكتملة (Completed)</option>
                    <option value="ARCHIVED">مؤرشفة (Archived)</option>
                  </select>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label className="text-stone-300 font-semibold flex items-center gap-1 truncate">
                    <Layers className="w-3.5 h-3.5 text-[#E84A0C] shrink-0" />
                    <span>عدد الجلسات</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={totalSessions}
                    onChange={(e) => setTotalSessions(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#080C16] border-[#1E293B] text-white focus:border-[#E84A0C] text-xs h-10 font-mono"
                    required
                  />
                </div>

              </div>

              {/* Location & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5 min-w-0 sm:col-span-2">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>مكان الإقامة / الرابط الافتراضي</span>
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="مثال: عبر منصة Google Meet / قاعة التدريب الرئيسية"
                    className="w-full bg-[#080C16] border-[#1E293B] text-white text-xs h-10"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>تاريخ البدء</span>
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#080C16] border-[#1E293B] text-white text-xs h-10 font-mono"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>تاريخ الانتهاء</span>
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#080C16] border-[#1E293B] text-white text-xs h-10 font-mono"
                  />
                </div>
              </div>

              {/* Cover Image Upload (Device File Upload + URL Toggle) */}
              <div className="space-y-2 p-3.5 rounded-xl bg-[#080C16] border border-[#1E293B]">
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#E84A0C]" />
                    <span>صورة الغلاف (Cover Image)</span>
                  </label>

                  <div className="flex items-center gap-1.5 bg-[#0D1322] p-0.5 rounded-lg border border-[#1E293B]">
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${
                        imageMode === "file"
                          ? "bg-[#E84A0C] text-white font-bold"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      رفع ملف
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${
                        imageMode === "url"
                          ? "bg-[#E84A0C] text-white font-bold"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      رابط مباشر
                    </button>
                  </div>
                </div>

                {/* Preview Banner if image exists */}
                {previewUrl && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#1E293B] group bg-black/40">
                    <img
                      src={previewUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف الصورة</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* File Upload Box */}
                {imageMode === "file" && !previewUrl && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#1E293B] hover:border-[#E84A0C]/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-[#0D1322]/50 hover:bg-[#0D1322]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 text-[#E84A0C] mx-auto mb-2 opacity-80" />
                    <p className="text-xs text-stone-200 font-medium">
                      اضغط لاختيار صورة من جهازك
                    </p>
                    <p className="text-[10px] text-stone-500 mt-1">
                      يدعم صيغ PNG, JPG, WebP بحجم حتى 5 ميغابايت
                    </p>
                  </div>
                )}

                {/* URL Input Box */}
                {imageMode === "url" && (
                  <div className="space-y-1.5 pt-1">
                    <Input
                      value={coverImageUrl}
                      onChange={(e) => {
                        setCoverImageUrl(e.target.value);
                        setPreviewUrl(e.target.value || null);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-[#0D1322] border-[#1E293B] text-white text-xs h-10 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold">نبذة وشرح عن الدورة / الفعالية</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب أهداف الدورة والمحاور التعليمية الرئيسية..."
                  className="w-full rounded-xl border border-[#1E293B] bg-[#080C16] p-3 text-xs text-white placeholder:text-stone-500 focus:border-[#E84A0C] focus:outline-none leading-relaxed box-border"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="border-[#1E293B] bg-transparent text-stone-300 hover:text-white"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white font-bold"
                >
                  <span>{loading ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات" : "إنشاء النشاط"}</span>
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
