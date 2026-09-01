import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublicActivities } from "@/app/actions/activity-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityCoverImage } from "@/components/shared/activity-cover-image";
import {
  GraduationCap,
  Layers,
  Calendar,
  MapPin,
  ArrowLeft,
  Users,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الأنشطة والدورات التدريبية | فريق بروميثيوس",
  description: "استكشف المعسكرات البرمجية، الورش التدريبية، والمحاضرات التخصصية لفريق بروميثيوس التطوعي.",
};

export default async function PublicActivitiesPage() {
  const activities = await getPublicActivities();

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16 animate-fade-in font-sans">
      
      {/* Page Header */}
      <SectionHeader
        badgeText="البرامج التدريبية والفعاليات"
        title="الأنشطة والدورات والمعسكرات العلمية"
        description="مبادرات تعليمية وورش عمل تطبيقية تهدف لبناء وتطوير مهارات الشباب في مجالات الهندسة البرمجية والبحث العلمي مجاناً."
      />

      {/* Activities Grid */}
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
                className="p-6 bg-[#0D1322] border border-[#1E293B] rounded-2xl flex flex-col justify-between space-y-5 shadow-xl hover:border-[#E84A0C]/50 hover:shadow-2xl transition-all duration-300 group"
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

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-[#E84A0C] transition-colors line-clamp-2">
                    <Link href={`/activities/${act.slug}`}>{act.title}</Link>
                  </h3>

                  {act.description && (
                    <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">
                      {act.description}
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-[#1E293B]">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#E84A0C]" />
                      {act.totalSessions} جلسات تدريبية
                    </span>
                    {act.startDate && (
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        {new Date(act.startDate).toLocaleDateString("ar-SA")}
                      </span>
                    )}
                  </div>

                  {act.location && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 truncate">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                  )}

                  <Link href={`/activities/${act.slug}`}>
                    <Button
                      size="sm"
                      className="w-full gap-2 text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl font-bold shadow-md"
                    >
                      <span>استعراض المحتوى وسجل الحضور</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center bg-[#0D1322] border border-dashed border-[#1E293B] rounded-2xl space-y-4">
          <GraduationCap className="w-12 h-12 text-[#E84A0C] mx-auto opacity-80" />
          <h3 className="font-display text-lg font-bold text-white">
            لا توجد دورات أو فعاليات معلنة حالياً
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
            يتم تجهيز وإطلاق ورش العمل والمعسكرات القادمة تباعاً. تابع منصاتنا لمعرفة مواعيد التسجيل.
          </p>
        </Card>
      )}

    </div>
  );
}
