import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicActivityBySlug } from "@/app/actions/activity-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Layers,
  Calendar,
  MapPin,
  ArrowRight,
  Users,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface PublicActivityDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PublicActivityDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getPublicActivityBySlug(slug);

  if (!activity) {
    return {
      title: "الفعالية غير موجودة | فريق بروميثيوس",
    };
  }

  return {
    title: `${activity.title} | أنشطة بروميثيوس`,
    description: activity.description || "دورة تدريبية وورشة عمل من فريق بروميثيوس التطوعي.",
  };
}

export default async function PublicActivityDetailPage({
  params,
}: PublicActivityDetailPageProps) {
  const { slug } = await params;
  const activity = await getPublicActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const isCompleted = activity.status === "COMPLETED";

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl space-y-16 animate-fade-in font-sans">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <Link
          href="/activities"
          className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-[#E84A0C]" />
          <span>العودة لدليل الأنشطة والدورات</span>
        </Link>

        <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest hidden sm:inline">
          Prometheus Academy & Workshops
        </span>
      </div>

      {/* Hero Card */}
      <Card className="p-8 sm:p-12 bg-[#0D1322] border border-[#1E293B] rounded-3xl shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Cover Image if available */}
        {activity.coverImage && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#080C16] border border-[#1E293B] max-h-96">
            <img
              src={activity.coverImage}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="orange">{activity.type}</Badge>
            <Badge className="bg-[#1A2B4A] text-stone-300 border-white/10 text-xs">
              {activity.status === "ONGOING"
                ? "دورة جارية حالياً"
                : activity.status === "COMPLETED"
                ? "دورة مكتملة"
                : "دورة قادمة"}
            </Badge>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            {activity.title}
          </h1>

          {activity.description && (
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans max-w-3xl">
              {activity.description}
            </p>
          )}

          {/* Quick Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#1E293B] text-xs font-mono text-stone-300">
            <div className="p-4 rounded-xl bg-[#080C16] border border-[#1E293B] space-y-1">
              <span className="text-stone-500 block">إجمالي عدد الجلسات</span>
              <p className="text-lg font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#E84A0C]" />
                <span>{activity.totalSessions} جلسات</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080C16] border border-[#1E293B] space-y-1">
              <span className="text-stone-500 block">المشاركون المسجلون</span>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{activity.attendees.length} مسجل</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080C16] border border-[#1E293B] space-y-1">
              <span className="text-stone-500 block">الموقع / المنصة</span>
              <p className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">{activity.location || "عبر الإنترنت (Online)"}</span>
              </p>
            </div>
          </div>
        </div>

      </Card>

      {/* Curriculum Sessions Roadmap */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
          <BookOpen className="w-5 h-5 text-[#E84A0C]" />
          <h2 className="font-display text-xl font-bold text-white">
            محاور وجلسات الدورة التدريبية ({activity.sessions.length} جلسة)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activity.sessions.map((s) => (
            <Card
              key={s.id}
              className="p-5 bg-[#0D1322] border border-[#1E293B] rounded-2xl space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-[#E84A0C]">
                <span>جلسة رقم {s.sessionNumber}</span>
                <span className="text-stone-500">حضور إلكتروني</span>
              </div>
              <h3 className="font-display text-sm font-bold text-white">{s.title}</h3>
              {s.description && (
                <p className="text-xs text-stone-400 line-clamp-2">{s.description}</p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Public Attendees List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                سجل الحضور والمشاركين المعتمدين ({activity.attendees.length} مشارك)
              </h2>
              <p className="text-xs text-stone-400">
                قائمة معلنة للمشاركين المسجلين ونسب حضورهم الموثقة رقمياً عبر المنصة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>توثيق QR رسمي</span>
          </div>
        </div>

        {activity.attendees.length > 0 ? (
          <Card className="p-0 bg-[#0D1322] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#080C16] border-b border-[#1E293B] text-stone-400 font-mono text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">اسم المشارك</th>
                    <th className="py-3.5 px-4 font-bold">English Name</th>
                    <th className="py-3.5 px-4 font-bold">نسبة الحضور التراكمية</th>
                    <th className="py-3.5 px-4 font-bold">حالة الإكمال</th>
                    <th className="py-3.5 px-4 font-bold text-center">رمز التوثيق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] font-sans">
                  {activity.attendees.map((attendee, index) => {
                    const isPassed = attendee.attendancePercentage >= 75;

                    return (
                      <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white text-sm">
                          {attendee.nameAr}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-stone-300">
                          {attendee.nameEn}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold text-white">
                              {attendee.attendanceRatio} جلسات ({attendee.attendancePercentage}%)
                            </span>
                            <div className="w-24 h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isPassed ? "bg-emerald-400" : "bg-[#E84A0C]"
                                }`}
                                style={{ width: `${attendee.attendancePercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {isPassed ? (
                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                              مؤهل لشهادة المشاركة
                            </Badge>
                          ) : (
                            <Badge variant="dark" className="text-stone-400 text-[10px]">
                              حضور جزئي
                            </Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Link
                            href={`/verify/${attendee.uniqueCode}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-mono text-[#E84A0C] hover:underline"
                          >
                            <span>{attendee.uniqueCode}</span>
                            <ExternalLink className="w-3 h-3 text-stone-500" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-10 text-center bg-[#0D1322] border border-dashed border-[#1E293B] rounded-2xl space-y-3">
            <Users className="w-10 h-10 text-stone-500 mx-auto" />
            <h3 className="font-display text-base font-bold text-white">
              لا توجد سجلات حضور مسجلة بعد
            </h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              سيتم إدراج أسماء الحاضرين تلقائياً فور تسجيلهم في جلسات الدورة التفاعلية.
            </p>
          </Card>
        )}
      </div>

    </div>
  );
}
