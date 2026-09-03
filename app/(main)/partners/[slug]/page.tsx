import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import {
  Globe, ArrowLeft, Building2, BookOpen, FolderGit2,
  Calendar, Users, ExternalLink,
} from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const partner = await prisma.partner.findUnique({ where: { slug } });
    if (partner) {
      return {
        title: `${partner.name} | شركاء بروميثيوس`,
        description: partner.description || partner.bio || "",
      };
    }
  } catch {}
  return { title: "شريك | بروميثيوس" };
}

export default async function PartnerProfilePage({ params }: Props) {
  const { slug } = await params;

  let partner: any = null;
  try {
    partner = await prisma.partner.findUnique({
      where: { slug },
      include: {
        articles: {
          include: {
            article: {
              include: { authors: true, category: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        projects: {
          include: {
            project: {
              include: { _count: { select: { members: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch {}

  if (!partner) notFound();

  const relatedArticles = partner.articles.map((pa: any) => ({
    ...pa.article,
    roleName: pa.roleName || "شريك إعلامي",
  }));

  const relatedProjects = partner.projects.map((pp: any) => ({
    ...pp.project,
    roleName: pp.roleName || "شريك استراتيجي",
  }));

  return (
    <main className="min-h-screen bg-[#0A0F1D] font-sans text-white">
      {/* Hero / Partner Header */}
      <section className="relative py-20 px-4 overflow-hidden border-b border-[#1E293B]">
        <div className="absolute inset-0 radial-glow-amber pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <Link href="/partners"
            className="inline-flex items-center gap-2 text-xs text-[#6B7280] hover:text-[#D49B4B] mb-8 transition-colors font-fira">
            <ArrowLeft className="w-4 h-4" />
            العودة إلى شبكة الشركاء
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-8">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-[#1E293B] flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
              <img src={partner.logoUrl} alt={partner.name} className="w-20 h-20 object-contain" />
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-fira text-[#D49B4B] bg-[#D49B4B]/10 border border-[#D49B4B]/20 px-3 py-1 rounded-full mb-3">
                <Building2 className="w-3.5 h-3.5" />
                شريك مؤسسي
              </div>
              <h1 className="font-cairo text-4xl sm:text-5xl font-extrabold text-white mb-3">
                {partner.name}
              </h1>
              {partner.description && (
                <p className="text-[#94A3B8] font-sans text-base leading-relaxed max-w-2xl">
                  {partner.description}
                </p>
              )}
              {partner.websiteUrl && (
                <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-[#D49B4B] hover:underline font-inter">
                  <Globe className="w-4 h-4" />
                  {partner.websiteUrl}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">

        {/* About / Bio */}
        {partner.bio && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-[#D49B4B] rounded-full inline-block" />
              عن المؤسسة الشريكة
            </h2>
            <div className="p-8 rounded-2xl bg-[#141C2F] border border-[#1E293B]">
              <p className="font-amiri text-[#CBD5E1] text-lg leading-loose italic">
                {partner.bio}
              </p>
            </div>
          </section>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#D49B4B]" />
              المقالات والأبحاث المشتركة
              <span className="text-sm font-fira text-[#6B7280] bg-[#1E293B] px-2 py-0.5 rounded-full">
                {relatedArticles.length}
              </span>
            </h2>
            <div className="grid gap-4">
              {relatedArticles.map((article: any) => (
                <Link key={article.id} href={`/post/articles/${article.slug}`}
                  className="group archival-card rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-fira px-2 py-0.5 rounded-full ${article.type === "ACADEMIC" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                          {article.type === "ACADEMIC" ? "بحث أكاديمي" : "مدونة"}
                        </span>
                        <span className="text-[10px] font-fira text-[#D49B4B] bg-[#D49B4B]/10 border border-[#D49B4B]/20 px-2 py-0.5 rounded-full">
                          {article.roleName}
                        </span>
                        {article.category && (
                          <span className="text-[10px] font-fira text-[#6B7280]">{article.category.name}</span>
                        )}
                      </div>
                      <h3 className="font-cairo font-bold text-white text-base group-hover:text-[#D49B4B] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-[#6B7280] font-sans line-clamp-2 mt-1 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                    {article.coverImage && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-[10px] text-[#6B7280] font-fira border-t border-[#1E293B] pt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.createdAt || Date.now()).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FolderGit2 className="w-6 h-6 text-[#D49B4B]" />
              المشاريع والأنشطة المشتركة
              <span className="text-sm font-fira text-[#6B7280] bg-[#1E293B] px-2 py-0.5 rounded-full">
                {relatedProjects.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProjects.map((project: any) => (
                <Link key={project.id} href={`/projects/${project.slug}`}
                  className="group archival-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
                  {project.coverImage && (
                    <div className="h-32 overflow-hidden">
                      <img src={project.coverImage} alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-fira text-[#D49B4B] bg-[#D49B4B]/10 border border-[#D49B4B]/20 px-2 py-0.5 rounded-full">
                      {project.roleName}
                    </span>
                    <h3 className="font-cairo font-bold text-white group-hover:text-[#D49B4B] transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-[#6B7280] font-sans line-clamp-2">{project.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-[10px] font-fira text-[#6B7280]">
                      <Users className="w-3 h-3 text-[#D49B4B]" />
                      {project._count?.members || 0} أعضاء
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
