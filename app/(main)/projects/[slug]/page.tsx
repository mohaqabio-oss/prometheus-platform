import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import {
  FolderGit2, Users, FileText, Building2, ArrowLeft,
  CheckCircle2, Clock, Circle, Calendar, BookOpen,
} from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PLANNED:     { label: "مخطط له",      icon: <Circle className="w-4 h-4" />,       color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  IN_PROGRESS: { label: "قيد التنفيذ",  icon: <Clock className="w-4 h-4" />,        color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  COMPLETED:   { label: "مكتمل",        icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (project) {
      return {
        title: `${project.title} | مشاريع بروميثيوس`,
        description: project.description || "",
      };
    }
  } catch {}
  return { title: "مشروع | بروميثيوس" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  let project: any = null;
  try {
    project = await prisma.project.findUnique({
      where: { slug },
      include: {
        members: {
          include: { member: true },
          orderBy: { createdAt: "asc" },
        },
        articles: {
          include: {
            article: { include: { authors: true, category: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        partners: {
          include: { partner: true },
        },
      },
    });
  } catch {}

  if (!project) notFound();

  const st = STATUS_MAP[project.status] || STATUS_MAP.PLANNED;
  const academicArticles = project.articles.filter((pa: any) => pa.article.type === "ACADEMIC");
  const blogArticles = project.articles.filter((pa: any) => pa.article.type === "BLOG");

  return (
    <main className="min-h-screen bg-[#0A0F1D]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {project.coverImage ? (
          <div className="h-72 sm:h-96">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0F1D]/60 to-[#0A0F1D] z-10" />
            <img src={project.coverImage} alt={project.title}
              className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-[#141C2F] to-[#0A0F1D] border-b border-[#1E293B]" />
        )}

        <div className="relative z-20 max-w-5xl mx-auto px-4 pb-10 -mt-24">
          <Link href="/projects"
            className="inline-flex items-center gap-2 text-xs text-[#6B7280] hover:text-[#D49B4B] mb-6 transition-colors font-fira">
            <ArrowLeft className="w-4 h-4" />
            جميع المشاريع
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-fira font-semibold px-3 py-1.5 rounded-full border ${st.color}`}>
              {st.icon} {st.label}
            </span>
            <span className="text-[10px] text-[#6B7280] font-fira flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(project.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long" })}
            </span>
          </div>

          <h1 className="font-cairo text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            {project.title}
          </h1>

          {project.description && (
            <p className="text-[#94A3B8] font-sans text-lg leading-relaxed max-w-3xl">
              {project.description}
            </p>
          )}

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            <span className="flex items-center gap-2 text-[#6B7280] font-fira">
              <Users className="w-4 h-4 text-[#D49B4B]" />
              <strong className="text-white">{project.members.length}</strong> عضو في الفريق
            </span>
            <span className="flex items-center gap-2 text-[#6B7280] font-fira">
              <FileText className="w-4 h-4 text-[#D49B4B]" />
              <strong className="text-white">{project.articles.length}</strong> مقالة ومخرجات
            </span>
            <span className="flex items-center gap-2 text-[#6B7280] font-fira">
              <Building2 className="w-4 h-4 text-[#D49B4B]" />
              <strong className="text-white">{project.partners.length}</strong> شريك
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Team / Members */}
        {project.members.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-[#D49B4B]" />
              فريق المشروع
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {project.members.map((pr: any) => (
                <Link key={pr.member.id} href={`/members/${pr.member.id}`}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#141C2F] border border-[#1E293B] hover:border-[#D49B4B]/40 transition-all duration-200">
                  <div className="w-16 h-16 rounded-full bg-[#1E293B] overflow-hidden mb-3 border-2 border-[#D49B4B]/20 group-hover:border-[#D49B4B] transition-colors">
                    {pr.member.avatarUrl || pr.member.profileImage ? (
                      <img src={pr.member.avatarUrl || pr.member.profileImage} alt={pr.member.fullName}
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#D49B4B] font-cairo font-bold text-xl">
                        {pr.member.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="font-cairo font-bold text-white text-sm group-hover:text-[#D49B4B] transition-colors">
                    {pr.member.fullName}
                  </p>
                  <p className="text-[10px] font-fira text-[#D49B4B] mt-1 bg-[#D49B4B]/10 px-2 py-0.5 rounded-full">
                    {pr.roleName}
                  </p>
                  {pr.member.departmentName && (
                    <p className="text-[10px] text-[#6B7280] font-sans mt-1">{pr.member.departmentName}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Partners */}
        {project.partners.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[#D49B4B]" />
              الشركاء الداعمون
            </h2>
            <div className="flex flex-wrap gap-4">
              {project.partners.map((pp: any) => (
                <Link key={pp.partner.id} href={`/partners/${pp.partner.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#141C2F] border border-[#1E293B] hover:border-[#D49B4B]/40 transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden">
                    <img src={pp.partner.logoUrl} alt={pp.partner.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-cairo font-semibold text-white group-hover:text-[#D49B4B] transition-colors text-sm">
                    {pp.partner.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Academic Articles */}
        {academicArticles.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#D49B4B]" />
              الأبحاث الأكاديمية
              <span className="text-sm font-fira text-[#6B7280] bg-[#1E293B] px-2 py-0.5 rounded-full">
                {academicArticles.length}
              </span>
            </h2>
            <ArticleList articles={academicArticles.map((pa: any) => pa.article)} />
          </section>
        )}

        {/* Blog Articles */}
        {blogArticles.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#D49B4B]" />
              مقالات المدونة
              <span className="text-sm font-fira text-[#6B7280] bg-[#1E293B] px-2 py-0.5 rounded-full">
                {blogArticles.length}
              </span>
            </h2>
            <ArticleList articles={blogArticles.map((pa: any) => pa.article)} />
          </section>
        )}

      </div>
    </main>
  );
}

function ArticleList({ articles }: { articles: any[] }) {
  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <Link key={article.id} href={`/post/articles/${article.slug}`}
          className="group archival-card rounded-xl p-5 hover:shadow-lg transition-all duration-200">
          <div className="flex items-start gap-4">
            {article.coverImage && (
              <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-cairo font-bold text-white group-hover:text-[#D49B4B] transition-colors line-clamp-2 mb-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-xs text-[#6B7280] font-sans line-clamp-2 leading-relaxed">{article.excerpt}</p>
              )}
              <div className="flex items-center gap-3 mt-2 text-[10px] text-[#6B7280] font-fira">
                <Calendar className="w-3 h-3" />
                {new Date(article.createdAt).toLocaleDateString("ar-EG")}
                {article.category && <span>· {article.category.name}</span>}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
