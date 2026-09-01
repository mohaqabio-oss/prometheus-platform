"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  const [coverImage, setCoverImage] = useState(activity?.coverImage || "");
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
    formData.set("coverImage", coverImage);
    formData.set("location", location);
    formData.set("type", type);
    formData.set("status", status);
    formData.set("totalSessions", totalSessions.toString());
    if (startDate) formData.set("startDate", startDate);
    if (endDate) formData.set("endDate", endDate);

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
          setCoverImage("");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0D1322] border border-[#1E293B] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 text-[#E84A0C] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {isEditing ? "تعديل بيانات النشاط" : "إنشاء نشاط / دورة جديدة"}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {isEditing
                      ? "تحديث التفاصيل ومزامنة عدد الجلسات المسجلة"
                      : "سيتم إنشاء جلسات الحضور تلقائياً بناءً على إجمالي الجلسات المحدد."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
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
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
              
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
                  className="bg-[#080C16] border-[#1E293B] text-white focus:border-[#E84A0C] text-xs h-10"
                  required
                />
              </div>

              {/* Type & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold">نوع النشاط</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-10 bg-[#080C16] border border-[#1E293B] rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                  >
                    <option value="COURSE">دورة تدريبية (Course)</option>
                    <option value="WORKSHOP">ورشة عمل (Workshop)</option>
                    <option value="BOOTCAMP">معسكر برمجي (Bootcamp)</option>
                    <option value="LECTURE">محاضرة علمية (Lecture)</option>
                    <option value="SEMINAR">ندوة تفاعلية (Seminar)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold">حالة الفعالية</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 bg-[#080C16] border border-[#1E293B] rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                  >
                    <option value="UPCOMING">قادمة (Upcoming)</option>
                    <option value="ONGOING">جارية حالياً (Ongoing)</option>
                    <option value="COMPLETED">مكتملة (Completed)</option>
                    <option value="ARCHIVED">مؤرشفة (Archived)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#E84A0C]" />
                    <span>إجمالي عدد الجلسات</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={totalSessions}
                    onChange={(e) => setTotalSessions(parseInt(e.target.value, 10) || 1)}
                    className="bg-[#080C16] border-[#1E293B] text-white focus:border-[#E84A0C] text-xs h-10 font-mono"
                    required
                  />
                </div>

              </div>

              {/* Location & Cover Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>مكان الإقامة / الرابط الافتراضي</span>
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="مثال: عبر منصة Google Meet / قاعة التدريب الرئيسية"
                    className="bg-[#080C16] border-[#1E293B] text-white text-xs h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
                    <span>رابط صورة الغلاف (Cover Image)</span>
                  </label>
                  <Input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-[#080C16] border-[#1E293B] text-white text-xs h-10 font-mono"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>تاريخ البدء</span>
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-[#080C16] border-[#1E293B] text-white text-xs h-10 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>تاريخ الانتهاء</span>
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-[#080C16] border-[#1E293B] text-white text-xs h-10 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold">نبذة وشرح عن الدورة / الفعالية</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب أهداف الدورة والمحاور التعليمية الرئيسية..."
                  className="w-full rounded-xl border border-[#1E293B] bg-[#080C16] p-3 text-xs text-white placeholder:text-stone-500 focus:border-[#E84A0C] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3">
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
