import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import {
  FolderGit2, Users, FileText, CheckCircle2, Clock, Circle, ChevronLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "المشاريع البحثية | بروميثيوس",
  description: "استعرض المشاريع البحثية والتقنية لفريق بروميثيوس التطوعي.",
};

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PLANNED:     { label: "مخطط له",      icon: <Circle className="w-3 h-3" />,       color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  IN_PROGRESS: { label: "قيد التنفيذ",  icon: <Clock className="w-3 h-3" />,        color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  COMPLETED:   { label: "مكتمل",        icon: <CheckCircle2 className="w-3 h-3" />, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
};

export default async function ProjectsPublicPage() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { members: true, articles: true } },
        partners: { include: { partner: true }, take: 3 },
      },
    });
  } catch {}

  return (
    <main className="min-h-screen bg-[#0A0F1D]">
      {/* Hero */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 radial-glow-amber pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-fira text-[#D49B4B] bg-[#D49B4B]/10 border border-[#D49B4B]/20 px-4 py-2 rounded-full mb-6">
            <FolderGit2 className="w-4 h-4" />
            مشاريع بروميثيوس
          </div>
          <h1 className="font-cairo text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            مشاريعنا البحثية
            <span className="block text-[#D49B4B]">والتقنية</span>
          </h1>
          <p className="text-[#94A3B8] font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            نعمل على مشاريع بحثية متعددة التخصصات تجمع بين الهندسة البرمجية والبحث العلمي والتطوير التقني.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {projects.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-[#1E293B] bg-[#141C2F]/40">
            <FolderGit2 className="w-12 h-12 text-[#6B7280]/40 mx-auto mb-4" />
            <p className="text-[#94A3B8] font-cairo text-xl font-bold">لا توجد مشاريع معلنة حالياً</p>
            <p className="text-sm text-[#6B7280] mt-2 font-sans">تابعنا قريباً للاطلاع على مشاريع الفريق.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => {
              const st = STATUS_MAP[project.status] || STATUS_MAP.PLANNED;
              return (
                <Link key={project.id} href={`/projects/${project.slug}`}
                  className="group archival-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Cover */}
                  {project.coverImage ? (
                    <div className="h-48 overflow-hidden">
                      <img src={project.coverImage} alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[#1A2B4A] to-[#0D0D0D] flex items-center justify-center">
                      <FolderGit2 className="w-16 h-16 text-[#6B7280]/30" />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    {/* Status */}
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-fira px-2.5 py-1 rounded-full border font-semibold ${st.color}`}>
                      {st.icon} {st.label}
                    </span>

                    <h2 className="font-cairo font-bold text-white text-xl group-hover:text-[#D49B4B] transition-colors line-clamp-2">
                      {project.title}
                    </h2>

                    {project.description && (
                      <p className="text-sm text-[#94A3B8] font-sans line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    {/* Partner logos */}
                    {project.partners.length > 0 && (
                      <div className="flex items-center gap-2">
                        {project.partners.map((pp: any) => (
                          <div key={pp.partner.id}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-[#1E293B] flex items-center justify-center overflow-hidden">
                            <img src={pp.partner.logoUrl} alt={pp.partner.name} className="w-5 h-5 object-contain" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-[11px] text-[#6B7280] font-fira pt-2 border-t border-[#1E293B]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#D49B4B]" />
                        {project._count.members}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#D49B4B]" />
                        {project._count.articles}
                      </span>
                      <span className="mr-auto flex items-center gap-1 text-[#D49B4B] group-hover:gap-2 transition-all text-xs font-cairo">
                        عرض المشروع <ChevronLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
