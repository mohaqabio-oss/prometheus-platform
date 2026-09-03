import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { prisma } from "@/lib/db/prisma";
import {
  ArrowLeft, Clock, BookOpen, FolderGit2, Microscope, Calendar,
  FileText, Users, Award, ChevronLeft,
} from "lucide-react";

interface MemberProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MemberProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (member) {
      return {
        title: `${member.fullName} | فريق بروميثيوس`,
        description: member.bio || `${member.fullName} — ${member.title || "عضو"} في ${member.departmentName || "الفريق"}`,
      };
    }
  } catch {}
  return { title: "ملف العضو | بروميثيوس" };
}

export default async function SingleMemberProfilePage({ params }: MemberProfilePageProps) {
  const { id } = await params;
  let member: any = null;
  let articles: any[] = [];

  try {
    [member] = await Promise.all([
      prisma.member.findUnique({
        where: { id },
        include: {
          certificates: { orderBy: { issuedAt: "desc" } },
          projectRoles: {
            include: {
              project: {
                include: {
                  _count: { select: { members: true, articles: true } },
                  partners: { include: { partner: true }, take: 3 },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    ]);

    if (member) {
      articles = await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { memberRoles: { some: { memberId: member.id } } },
            { authors: { some: { name: member.fullName } } },
          ],
        },
        include: {
          authors: true,
          memberRoles: { include: { member: true } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch {}

  if (!member) notFound();

  const projectRoles = member.projectRoles || [];
  const academicArticles = articles.filter((a: any) => a.type === "ACADEMIC");
  const blogArticles = articles.filter((a: any) => a.type === "BLOG");

  return (
    <main className="py-12 sm:py-20 bg-[#0A0F1D] min-h-screen text-white animate-fade-in font-sans">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl space-y-10">

        {/* Back Navigation */}
        <Link href="/members"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#D49B4B] transition-colors font-sans">
          <ArrowLeft className="w-4 h-4 text-[#D49B4B]" />
          العودة إلى دليل الكادر
        </Link>

        {/* MEMBER PROFILE HEADER */}
        <div className="p-8 sm:p-12 rounded-2xl border border-[#1E293B] bg-[#141C2F] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 radial-glow-amber pointer-events-none opacity-40" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
            <Avatar
              src={member.avatarUrl || member.profileImage}
              name={member.fullName}
              size="xl"
              shape="rounded"
              className="border-4 border-[#D49B4B]/30 shadow-2xl"
            />

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="orange">{member.departmentName || "عام"}</Badge>
                <Badge variant="dark"
                  className={`${member.status === "ACTIVE" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-[#6B7280] border-[#6B7280]/30 bg-[#6B7280]/10"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${member.status === "ACTIVE" ? "bg-emerald-400 animate-pulse" : "bg-[#6B7280]"} mr-1`} />
                  {member.status === "ACTIVE" ? "نشط" : member.status === "ALUMNI" ? "خريج" : "غير نشط"}
                </Badge>
                {member.leadershipTier && member.leadershipTier !== "Regular" && (
                  <Badge variant="dark" className="text-[#D49B4B] border-[#D49B4B]/30 bg-[#D49B4B]/10">
                    {member.leadershipTier}
                  </Badge>
                )}
              </div>

              <h1 className="font-cairo text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {member.fullName}
              </h1>

              <p className="text-[#D49B4B] text-base font-ibm font-medium">
                {member.title || "متطوع في فريق بروميثيوس"}
              </p>

              <div className="flex items-center gap-4 text-xs font-fira text-[#6B7280] pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  انضم {new Date(member.joinDate || member.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long" })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STATISTICS METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Clock className="w-5 h-5" />, value: `${member.volunteerHours || 0}h`, label: "ساعات التطوع" },
            { icon: <FileText className="w-5 h-5" />, value: academicArticles.length + blogArticles.length, label: "مقالات منشورة" },
            { icon: <FolderGit2 className="w-5 h-5" />, value: projectRoles.length, label: "مشاريع مشارك بها" },
            { icon: <Award className="w-5 h-5" />, value: member.certificates?.length || 0, label: "شهادات مكتسبة" },
          ].map((stat, i) => (
            <Card key={i} className="p-5 bg-[#141C2F] border border-[#1E293B] rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D49B4B]/10 border border-[#D49B4B]/20 flex items-center justify-center text-[#D49B4B] shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold font-fira text-white">{stat.value}</p>
                  <p className="text-xs text-[#6B7280] font-sans">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* BIOGRAPHY */}
        {member.bio && member.bio.trim() !== "" && (
          <section className="space-y-4">
            <h2 className="font-cairo text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1 h-6 bg-[#D49B4B] rounded-full" />
              نبذة عن العضو
            </h2>
            <Card className="p-8 bg-[#141C2F] border border-[#1E293B] rounded-2xl">
              <p className="font-amiri text-[#CBD5E1] text-lg leading-loose italic">{member.bio}</p>
            </Card>
          </section>
        )}

        {/* PROJECT ROLES */}
        {projectRoles.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-cairo text-2xl font-bold text-white flex items-center gap-3">
              <FolderGit2 className="w-6 h-6 text-[#D49B4B]" />
              المشاريع والأنشطة
              <span className="text-sm font-fira text-[#6B7280] bg-[#1E293B] px-2 py-0.5 rounded-full">
                {projectRoles.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectRoles.map((pr: any) => (
                <Link key={pr.project.id} href={`/projects/${pr.project.slug}`}
                  className="group archival-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  {pr.project.coverImage && (
                    <div className="h-28 overflow-hidden">
                      <img src={pr.project.coverImage} alt={pr.project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-fira text-[#D49B4B] bg-[#D49B4B]/10 border border-[#D49B4B]/20 px-2 py-0.5 rounded-full">
                      {pr.roleName}
                    </span>
                    <h3 className="font-cairo font-bold text-white group-hover:text-[#D49B4B] transition-colors text-base line-clamp-2">
                      {pr.project.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-fira text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#D49B4B]" />
                        {pr.project._count?.members || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#D49B4B]" />
                        {pr.project._count?.articles || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ACADEMIC ARTICLES */}
        {academicArticles.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-cairo text-2xl font-bold text-white flex items-center gap-3">
              <Microscope className="w-6 h-6 text-[#D49B4B]" />
              الأبحاث والمقالات الأكاديمية
              <span className="text-sm font-fira text-[#6B7280] bg-[#1E293B] px-2 py-0.5 rounded-full">
                {academicArticles.length}
              </span>
            </h2>
            <div className="space-y-3">
              {academicArticles.map((article: any) => (
                <ArticleCard key={article.id} article={article} memberId={member.id} type="ACADEMIC" />
              ))}
            </div>
          </section>
        )}

        {/* BLOG ARTICLES */}
        {blogArticles.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-cairo text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#D49B4B]" />
              مقالات المدونة
              <span className="text-sm font-fira text-[#6B7280] bg-[#1E293B] px-2 py-0.5 rounded-full">
                {blogArticles.length}
              </span>
            </h2>
            <div className="space-y-3">
              {blogArticles.map((article: any) => (
                <ArticleCard key={article.id} article={article} memberId={member.id} type="BLOG" />
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATES */}
        {member.certificates?.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-cairo text-2xl font-bold text-white flex items-center gap-3">
              <Award className="w-6 h-6 text-[#D49B4B]" />
              الشهادات والإنجازات
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {member.certificates.map((cert: any) => (
                <Card key={cert.id} className="p-5 bg-[#141C2F] border border-[#1E293B] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D49B4B] shrink-0" />
                    <h3 className="font-cairo font-bold text-white text-sm">{cert.title}</h3>
                  </div>
                  {cert.description && (
                    <p className="text-xs text-[#6B7280] font-sans leading-relaxed">{cert.description}</p>
                  )}
                  <p className="text-[10px] font-fira text-[#D49B4B]">
                    {new Date(cert.issuedAt).toLocaleDateString("ar-EG")}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

function ArticleCard({ article, memberId, type }: { article: any; memberId: string; type: string }) {
  const memberRole = article.memberRoles?.find((mr: any) => mr.memberId === memberId)?.roleName || "مؤلف مشارك";

  return (
    <Link href={`/post/articles/${article.slug}`}
      className="group archival-card rounded-xl p-5 flex items-start gap-4 hover:shadow-lg transition-all duration-200">
      {article.coverImage && (
        <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
          <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-fira px-2 py-0.5 rounded-full border ${type === "ACADEMIC" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
            {type === "ACADEMIC" ? "بحث أكاديمي" : "مدونة"}
          </span>
          <span className="text-[10px] font-fira text-[#D49B4B] bg-[#D49B4B]/10 border border-[#D49B4B]/20 px-2 py-0.5 rounded-full">
            {memberRole}
          </span>
          {article.category && (
            <span className="text-[10px] text-[#6B7280] font-fira">{article.category.name}</span>
          )}
        </div>
        <h3 className="font-cairo font-bold text-white group-hover:text-[#D49B4B] transition-colors text-base line-clamp-2 mb-1">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-xs text-[#6B7280] font-sans line-clamp-2 leading-relaxed">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-2 mt-2 text-[10px] font-fira text-[#6B7280]">
          <Calendar className="w-3 h-3" />
          {new Date(article.createdAt).toLocaleDateString("ar-EG")}
        </div>
      </div>
      <ChevronLeft className="w-4 h-4 text-[#6B7280] group-hover:text-[#D49B4B] transition-colors shrink-0 mt-1" />
    </Link>
  );
}
