import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getAdminActivityById,
  deleteActivityAction,
} from "@/app/actions/activity-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SessionManager } from "@/components/admin/activities/session-manager";
import { AttendeesTable } from "@/components/admin/activities/attendees-table";
import { ActivityFormDialog } from "@/components/admin/activities/activity-form-dialog";
import {
  ArrowRight,
  GraduationCap,
  Layers,
  Users,
  Calendar,
  MapPin,
  ExternalLink,
  Trash2,
  Settings,
  Sparkles,
} from "lucide-react";

interface ActivityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;
  const activity = await getAdminActivityById(id);

  if (!activity) {
    notFound();
  }

  const handleDelete = async () => {
    "use server";
    await deleteActivityAction(id);
    redirect("/admin/activities");
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div className="space-y-2">
          <Link
            href="/admin/activities"
            className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-[#E84A0C]" />
            <span>العودة لقائمة الأنشطة والدورات</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {activity.title}
            </h1>
            <Badge variant="orange">{activity.type}</Badge>
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
              {activity.status}
            </Badge>
          </div>

          {activity.location && (
            <p className="text-xs text-stone-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{activity.location}</span>
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link href={`/activities/${activity.slug}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs border-[#1E293B] text-stone-300 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
              <span>صفحة المعاينة العامة</span>
            </Button>
          </Link>

          <ActivityFormDialog
            activity={activity}
            triggerButton={
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs border-[#1E293B] text-stone-300 hover:text-white"
              >
                <Settings className="w-4 h-4 text-[#E84A0C]" />
                <span>تعديل النشاط</span>
              </Button>
            }
          />

          <form action={handleDelete}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="gap-2 text-xs border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#0D1322] border border-[#1E293B] rounded-2xl space-y-1">
          <p className="text-[11px] font-mono text-stone-400">إجمالي الجلسات</p>
          <p className="text-2xl font-bold font-mono text-white">
            {activity.totalSessions} جلسات
          </p>
        </Card>

        <Card className="p-4 bg-[#0D1322] border border-[#1E293B] rounded-2xl space-y-1">
          <p className="text-[11px] font-mono text-stone-400">المشاركون المسجلون</p>
          <p className="text-2xl font-bold font-mono text-[#E84A0C]">
            {activity.participants.length} مشارك
          </p>
        </Card>

        <Card className="p-4 bg-[#0D1322] border border-[#1E293B] rounded-2xl space-y-1">
          <p className="text-[11px] font-mono text-stone-400">الجلسات المفتوحة حالياً</p>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            {activity.sessions.filter((s) => s.formStatus === "OPEN").length} مفتوحة
          </p>
        </Card>

        <Card className="p-4 bg-[#0D1322] border border-[#1E293B] rounded-2xl space-y-1">
          <p className="text-[11px] font-mono text-stone-400">نسبة الإكمال (75%+)</p>
          <p className="text-2xl font-bold font-mono text-amber-400">
            {
              activity.participants.filter((p) => p.attendancePercentage >= 75).length
            }{" "}
            مؤهل للشهادة
          </p>
        </Card>
      </div>

      {/* Section 1: Sessions & Live Attendance Form Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E84A0C]" />
            <h2 className="font-display text-lg font-bold text-white">
              جلسات الحضور المباشرة (Live Session Toggles & QR)
            </h2>
          </div>
          <p className="text-xs text-stone-400">
            انقر على "فتح استمارة" أو "رمز QR" لعرض رمز المسح أثناء إلقاء المحاضرة.
          </p>
        </div>

        <SessionManager
          activityId={activity.id}
          activityTitle={activity.title}
          sessions={activity.sessions}
        />
      </div>

      {/* Section 2: Attendees List & Attendance Ratios */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-lg font-bold text-white">
              سجل المشاركين المسجلين ونسب الحضور التراكمية
            </h2>
          </div>
          <p className="text-xs text-stone-400">
            حساب نسب الحضور التلقائي لكل مشارك مع إمكانية التصدير إلى Excel/CSV.
          </p>
        </div>

        <AttendeesTable
          activityTitle={activity.title}
          totalSessions={activity.totalSessions}
          participants={activity.participants}
        />
      </div>

    </div>
  );
}
