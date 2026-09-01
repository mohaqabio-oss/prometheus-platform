import React from "react";
import Link from "next/link";
import { getAdminActivitiesList } from "@/app/actions/activity-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityCoverImage } from "@/components/shared/activity-cover-image";
import { Button } from "@/components/ui/button";
import { ActivityFormDialog } from "@/components/admin/activities/activity-form-dialog";
import {
  GraduationCap,
  Plus,
  Users,
  Layers,
  Calendar,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const activities = await getAdminActivitiesList();

  const totalActivities = activities.length;
  const activeCount = activities.filter(
    (a) => a.status === "ONGOING" || a.status === "UPCOMING"
  ).length;
  const totalParticipants = activities.reduce(
    (acc, curr) => acc + (curr.participantsCount || 0),
    0
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 text-[#E84A0C]">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              إدارة الأنشطة والدورات التفاعلية
            </h1>
          </div>
          <p className="text-xs text-stone-400">
            إنشاء المعسكرات والدورات، إدارة جلسات المحاضرات، وتتبع الحضور المباشر عبر رمز QR.
          </p>
        </div>

        <ActivityFormDialog />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-[#0D1322] border border-[#1E293B] rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-xs text-stone-400 font-mono">إجمالي الفعاليات والدورات</p>
            <p className="text-2xl font-bold text-white font-mono">{totalActivities}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-[#E84A0C] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 bg-[#0D1322] border border-[#1E293B] rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-xs text-stone-400 font-mono">الأنشطة النشطة والقادمة</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 bg-[#0D1322] border border-[#1E293B] rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-xs text-stone-400 font-mono">إجمالي المشاركين المسجلين</p>
            <p className="text-2xl font-bold text-[#E84A0C] font-mono">+{totalParticipants}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 text-[#E84A0C] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Activities Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-white">قائمة الدورات والفعاليات</h2>

        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => {
              const statusBadge =
                act.status === "ONGOING" ? (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                    جارية حالياً
                  </Badge>
                ) : act.status === "COMPLETED" ? (
                  <Badge variant="dark" className="text-stone-400 text-[10px]">
                    مكتملة
                  </Badge>
                ) : (
                  <Badge variant="orange" className="text-[10px]">
                    قادمة
                  </Badge>
                );

              return (
                <Card
                  key={act.id}
                  className="p-6 bg-[#0D1322] border border-[#1E293B] rounded-2xl flex flex-col justify-between space-y-5 shadow-xl hover:border-[#E84A0C]/40 transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <ActivityCoverImage
                      src={act.coverImage}
                      alt={act.title}
                      type={act.type}
                      containerClassName="aspect-video w-full rounded-xl overflow-hidden bg-[#080C16] border border-[#1E293B]"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="flex items-center justify-between">
                      <Badge variant="dark" className="bg-[#1A2B4A] text-stone-300 border-white/10 text-[10px]">
                        {act.type}
                      </Badge>
                      {statusBadge}
                    </div>

                    <h3 className="font-display text-base font-bold text-white group-hover:text-[#E84A0C] transition-colors line-clamp-2">
                      {act.title}
                    </h3>

                    {act.description && (
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#1E293B]">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-stone-400">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#E84A0C]" />
                        {act.totalSessions} جلسات
                      </span>
                      <span className="flex items-center gap-1 justify-end">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        {act.participantsCount} مشارك
                      </span>
                    </div>

                    {act.location && (
                      <div className="flex items-center gap-1 text-[11px] text-stone-400 truncate">
                        <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                        <span className="truncate">{act.location}</span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-2">
                      <Link href={`/admin/activities/${act.id}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full gap-2 text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl font-bold"
                        >
                          <span>إدارة الحضور والجلسات</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Button>
                      </Link>

                      <Link href={`/activities/${act.slug}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-2.5 border-[#1E293B] text-stone-300 hover:text-white"
                          title="عرض في الموقع العام"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center bg-[#0D1322] border border-dashed border-[#1E293B] rounded-2xl space-y-4">
            <GraduationCap className="w-12 h-12 text-[#E84A0C] mx-auto opacity-80" />
            <h3 className="font-display text-lg font-bold text-white">
              لا توجد أنشطة أو دورات مضافة حالياً
            </h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              ابدأ بإضافة أول دورة تدريبية أو ورشة عمل لإنشاء جلسات الحضور وتوليد رموز الاستجابة السريعة (QR).
            </p>
            <ActivityFormDialog />
          </Card>
        )}
      </div>

    </div>
  );
}
