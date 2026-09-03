import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { deleteProjectAction } from "@/app/actions/project-actions";
import {
  FolderGit2, Plus, Users, FileText, CheckCircle2,
  Clock, Circle, Trash2, Edit3, Calendar, GraduationCap,
} from "lucide-react";

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PLANNED:     { label: "مخطط له",      icon: <Circle className="w-3 h-3" />,       color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  IN_PROGRESS: { label: "قيد التنفيذ",  icon: <Clock className="w-3 h-3" />,        color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  COMPLETED:   { label: "مكتمل",        icon: <CheckCircle2 className="w-3 h-3" />, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
};

const TYPE_LABEL_MAP: Record<string, string> = {
  PROJECT: "مشروع بحثي",
  COURSE: "دورة تعليمية",
  WORKSHOP: "ورشة عمل",
  LECTURE: "محاضرة علمية",
  BOOTCAMP: "معسكر تدريبي",
  SEMINAR: "ندوة حوارية",
};

export default async function AdminProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        sessions: true,
        _count: { select: { members: true, articles: true, sessions: true } },
      },
    });
  } catch {}

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo text-3xl font-extrabold text-white flex items-center gap-3">
            <FolderGit2 className="w-7 h-7 text-[#E84A0C]" />
            المشاريع والأنشطة
          </h1>
          <p className="text-sm text-[#6B7280] font-sans mt-1">
            إدارة المشاريع البحثية والأنشطة والدورات والورش العلمية وتعيين أطقم العمل واستخراج شهادات وبار كود QR للمشاركين.
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl">
            <Plus className="w-4 h-4" />
            إضافة مشروع / نشاط جديد
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-dashed border-[#6B7280]/30 bg-[#0D0D0D]">
          <FolderGit2 className="w-12 h-12 text-[#6B7280]/40 mx-auto mb-4" />
          <p className="text-[#6B7280] font-cairo text-lg font-bold">لا توجد مشاريع أو أنشطة بعد</p>
          <p className="text-sm text-[#6B7280]/60 mt-2">ابدأ بإنشاء أول مشروع بحثي أو ورشة علمية لبروميثيوس.</p>
          <Link href="/admin/projects/new">
            <Button className="mt-6 gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl">
              <Plus className="w-4 h-4" /> إنشاء مشروع جديد
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => {
            const st = STATUS_MAP[project.status] || STATUS_MAP.PLANNED;
            const typeLabel = TYPE_LABEL_MAP[project.type] || "مشروع بحثي";

            return (
              <div key={project.id}
                className="bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl overflow-hidden hover:border-[#E84A0C]/30 transition-all duration-200 group shadow-lg flex flex-col justify-between">
                <div>
                  {/* Cover */}
                  {project.coverImage ? (
                    <div className="h-40 overflow-hidden">
                      <img src={project.coverImage} alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-[#1A2B4A] to-[#0D0D0D] flex items-center justify-center">
                      <FolderGit2 className="w-12 h-12 text-[#6B7280]/30" />
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    {/* Status & Type Badges */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-fira px-2.5 py-0.5 rounded-full border font-semibold ${st.color}`}>
                        {st.icon} {st.label}
                      </span>
                      <span className="text-[10px] font-fira text-[#E84A0C] bg-[#E84A0C]/10 border border-[#E84A0C]/20 px-2 py-0.5 rounded-full">
                        {typeLabel}
                      </span>
                    </div>

                    <h2 className="font-cairo font-bold text-white text-lg leading-tight line-clamp-2">
                      {project.title}
                    </h2>

                    {project.description && (
                      <p className="text-xs text-[#6B7280] font-sans line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6B7280] font-fira pt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#E84A0C]" />
                        {project._count.members} أعضاء
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-[#E84A0C]" />
                        {project._count.sessions} جلسة
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#E84A0C]" />
                        {project._count.articles} مقالة
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-5 pt-0">
                  <div className="flex gap-2 pt-3 border-t border-[#6B7280]/20">
                    <Link href={`/admin/projects/${project.id}/edit`} className="flex-1">
                      <Button variant="ghost" size="sm"
                        className="w-full gap-1.5 text-xs text-[#6B7280] hover:text-white hover:bg-[#1A2B4A] rounded-xl">
                        <Edit3 className="w-3.5 h-3.5 text-[#E84A0C]" /> تعديل وإدارة الجلسات
                      </Button>
                    </Link>
                    <form action={async () => { "use server"; await deleteProjectAction(project.id); }}>
                      <Button type="submit" variant="ghost" size="sm"
                        className="gap-1.5 text-xs text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 rounded-xl">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
