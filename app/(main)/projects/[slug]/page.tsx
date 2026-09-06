import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { getInitials } from "@/components/ui/avatar";
import {
  Users, FileText, Building2, ArrowLeft,
  CheckCircle2, Clock, Circle, Calendar, BookOpen, UserPlus,
  MapPin, ExternalLink, Sparkles, Check, Globe
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PLANNED:     { label: "مخطط له",      icon: <Circle className="w-4 h-4" />,       color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  IN_PROGRESS: { label: "قيد التنفيذ",  icon: <Clock className="w-4 h-4" />,        color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  COMPLETED:   { label: "مكتمل",        icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
};

const TYPE_MAP: Record<string, string> = {
  PROJECT: "مشروع بحثي",
  COURSE: "دورة تعليمية",
  WORKSHOP: "ورشة عمل",
  LECTURE: "محاضرة علمية",
  BOOTCAMP: "معسكر تدريبي",
  SEMINAR: "ندوة حوارية",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({ where: { slug: decodeURIComponent(slug) } });
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
  const decodedSlug = decodeURIComponent(slug);

  let project: any = null;
  try {
    project = await prisma.project.findUnique({
      where: { slug: decodedSlug },
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
        sessions: {
          include: {
            attendanceRecords: {
              select: { id: true, participantId: true },
            },
          },
          orderBy: { sessionNumber: "asc" },
        },
      },
    });
  } catch (err) {
    console.error("Failed to load project details:", err);
  }

  if (!project) notFound();

  const st = STATUS_MAP[project.status] || STATUS_MAP.PLANNED;
  const typeLabel = TYPE_MAP[project.type] || "مشروع";
  const academicArticles = project.articles.filter((pa: any) => pa.article?.type === "ACADEMIC");
  const blogArticles = project.articles.filter((pa: any) => pa.article?.type === "BLOG");

  // Task 2: Calculate Live Attendance Counters
  const uniqueParticipantIds = new Set<string>();
  let totalAttendanceSum = 0;
  project.sessions?.forEach((s: any) => {
    const records = s.attendanceRecords || [];
    records.forEach((r: any) => {
      uniqueParticipantIds.add(r.participantId);
      totalAttendanceSum++;
    });
  });
  const attendeesCount = uniqueParticipantIds.size > 0 ? uniqueParticipantIds.size : totalAttendanceSum;

  // Blog Article URL calculation
  const blogArticleSlug = project.articleSlug
    ? (project.articleSlug.startsWith("http") || project.articleSlug.startsWith("/")
        ? project.articleSlug
        : `/blog/${project.articleSlug}`)
    : (blogArticles.length > 0 ? `/blog/${blogArticles[0].article.slug}` : null);

  return (
    <main className="min-h-screen bg-[#0A0F1D] text-white">
      {/* ── Hero & Header Section (Task 1: Clean responsive non-clashing flow) ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#141C2F] via-[#0A0F1D] to-[#0A0F1D] border-b border-[#1E293B]">
        {/* Cover image banner container */}
        {project.coverImage ? (
          <div className="relative w-full h-56 sm:h-72 lg:h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-[#0A0F1D]/50 to-transparent z-10" />
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-24 sm:h-32 bg-gradient-to-r from-[#141C2F] to-[#0A0F1D] border-b border-[#1E293B]" />
        )}

        {/* Content container in natural relative flow with z-20 */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs text-[#6B7280] hover:text-[#D49B4B] mb-6 transition-colors font-fira"
          >
            <ArrowLeft className="w-4 h-4" />
            جميع المشاريع والأنشطة
          </Link>

          {/* Main header row: Responsive flex-col on mobile, flex-row on desktop */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative">
            <div className="flex-1 min-w-0 space-y-4">
              {/* Badges bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-fira font-semibold px-3 py-1.5 rounded-full border ${st.color}`}>
                  {st.icon} {st.label}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-fira text-[#D49B4B] bg-[#D49B4B]/10 border border-[#D49B4B]/30 px-3 py-1.5 rounded-full">
                  {typeLabel}
                </span>

                {/* Task 2: Live Attendance Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Users className="w-3.5 h-3.5" />
                  {attendeesCount} مسجل
                </span>

                <span className="text-xs text-[#6B7280] font-fira flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(project.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long" })}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-cairo text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {project.title}
              </h1>

              {/* Description */}
              {project.description && (
                <p className="text-[#94A3B8] font-sans text-base sm:text-lg leading-relaxed max-w-3xl">
                  {project.description}
                </p>
              )}

              {/* Quick stats pills */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 text-[#94A3B8] font-fira">
                  <Users className="w-4 h-4 text-[#D49B4B]" />
                  <strong className="text-white">{project.members.length}</strong> عضو في الفريق
                </span>
                {project.guestAuthors && project.guestAuthors.length > 0 && (
                  <span className="flex items-center gap-1.5 text-[#94A3B8] font-fira">
                    <UserPlus className="w-4 h-4 text-[#D49B4B]" />
                    <strong className="text-white">{project.guestAuthors.length}</strong> مساهم خارجي
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-[#94A3B8] font-fira">
                  <FileText className="w-4 h-4 text-[#D49B4B]" />
                  <strong className="text-white">{project.articles.length}</strong> مخرجات ومقالات
                </span>
                {project.partners.length > 0 && (
                  <span className="flex items-center gap-1.5 text-[#94A3B8] font-fira">
                    <Building2 className="w-4 h-4 text-[#D49B4B]" />
                    <strong className="text-white">{project.partners.length}</strong> شريك
                  </span>
                )}
              </div>
            </div>

            {/* Sidebar quick info card */}
            <div className="w-full lg:w-72 bg-[#141C2F]/80 backdrop-blur-md rounded-2xl border border-[#1E293B] p-5 space-y-4 shrink-0 shadow-lg">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                  <span className="text-[#6B7280]">حالة الفعالية:</span>
                  <span className="font-bold text-white">{st.label}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                  <span className="text-[#6B7280]">نوع النشاط:</span>
                  <span className="font-bold text-white">{typeLabel}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                  <span className="text-[#6B7280]">عدد الجلسات:</span>
                  <span className="font-bold text-white">{project.totalSessions || project.sessions?.length || 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">المقر / المنصة:</span>
                  <span className="font-bold text-white truncate max-w-[140px]" title={project.location || "Google Meet"}>
                    {project.location || "Google Meet"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* Task 2: Impact / Archival Metrics Grid */}
        <section className="bg-gradient-to-r from-[#141C2F] to-[#0D1322] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2.5 mb-6">
            <Sparkles className="w-5 h-5 text-[#D49B4B]" />
            <h2 className="font-cairo text-xl sm:text-2xl font-bold text-white">مؤشرات الأثر والأرقام القياسية</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-[#1E293B] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280] font-sans">إجمالي الحضور والتسجيل</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-fira">
                {attendeesCount}+
              </div>
              <p className="text-[11px] text-[#94A3B8]">حاضر ومشارك موثق</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-[#1E293B] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280] font-sans">الجلسات والوحدات</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-fira">
                {project.totalSessions || project.sessions?.length || 1}
              </div>
              <p className="text-[11px] text-[#94A3B8]">جلسات / محاضرات علمية</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-[#1E293B] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280] font-sans">طريقة التنفيذ</span>
                <Globe className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-base sm:text-lg font-bold text-white truncate pt-1">
                {project.location || "عبر منصة افتراضية"}
              </div>
              <p className="text-[11px] text-[#94A3B8]">مباشر وتفاعلي</p>
            </div>
          </div>
        </section>

        {/* Task 3: Blog Article Association (Public CTA) */}
        {blogArticleSlug && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#141C2F] to-[#0A0F1D] border-2 border-[#D49B4B]/30 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D49B4B]/20 text-[#D49B4B] border border-[#D49B4B]/40">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>التقرير والتوثيق الأكاديمي</span>
                </div>
                <h3 className="font-cairo text-xl sm:text-2xl font-bold text-white">
                  اقرأ التقرير والتوثيق الأكاديمي الكامل على مجلة بروميثيوس
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  تصفح النتائج البحثية، التوصيات، والتحليل التوثيقي الكامل الصادر عن هذه الفعالية عبر المجلة الأكاديمية والمدونة الرسمية.
                </p>
              </div>

              <Link
                href={blogArticleSlug}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#E84A0C] hover:bg-[#D03E06] text-white font-cairo font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 shrink-0"
              >
                <span>قراءة التقرير الكامل</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Sessions Section with Live Attendance Counter Badges */}
        {project.sessions && project.sessions.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#D49B4B]" />
              جلسات ومحاضرات البرنامج ({project.sessions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.sessions.map((sess: any) => {
                const sCount = sess.attendanceRecords?.length || 0;
                return (
                  <div
                    key={sess.id}
                    className="p-5 rounded-2xl bg-[#141C2F] border border-[#1E293B] flex flex-col justify-between space-y-4 hover:border-[#D49B4B]/40 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-[#D49B4B] bg-[#D49B4B]/10 px-2.5 py-1 rounded-lg border border-[#D49B4B]/20">
                          الجلسة #{sess.sessionNumber}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Users className="w-3.5 h-3.5" />
                          {sCount} مسجل
                        </span>
                      </div>
                      <h3 className="font-cairo font-bold text-white text-base">
                        {sess.title}
                      </h3>
                      {sess.description && (
                        <p className="text-xs text-[#94A3B8] font-sans line-clamp-2 leading-relaxed">
                          {sess.description}
                        </p>
                      )}
                    </div>

                    {sess.formStatus === "OPEN" && (
                      <div className="pt-2 border-t border-[#1E293B]">
                        <Link
                          href={`/attendance/${sess.id}`}
                          className="inline-flex items-center gap-1.5 text-xs text-[#E84A0C] hover:text-[#D03E06] font-bold font-cairo"
                        >
                          <span>تسجيل الحضور الآن في الجلسة</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Team / Members (Task 4: Strict Avatar check & isolated initials fallback) */}
        {project.members.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-[#D49B4B]" />
              فريق المشروع
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {project.members.map((pr: any) => {
                const photoUrl = pr.member.avatarUrl || pr.member.profileImage;
                const hasImage = Boolean(photoUrl && typeof photoUrl === "string" && photoUrl.trim().length > 0);
                const initials = getInitials(pr.member.fullName);

                return (
                  <Link
                    key={pr.member.id}
                    href={`/members/${pr.member.id}`}
                    className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#141C2F] border border-[#1E293B] hover:border-[#D49B4B]/40 transition-all duration-200"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#D49B4B]/20 group-hover:border-[#D49B4B] transition-colors shrink-0">
                      {hasImage ? (
                        <img
                          src={photoUrl}
                          alt={pr.member.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          key={`initials-${pr.member.id}`}
                          className="w-full h-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center rounded-full text-lg select-none"
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                    <p className="font-cairo font-bold text-white text-sm group-hover:text-[#D49B4B] transition-colors line-clamp-1">
                      {pr.member.fullName}
                    </p>
                    <p className="text-[10px] font-fira text-[#D49B4B] mt-1 bg-[#D49B4B]/10 px-2 py-0.5 rounded-full">
                      {pr.roleName}
                    </p>
                    {pr.member.departmentName && (
                      <p className="text-[10px] text-[#6B7280] font-sans mt-1 line-clamp-1">
                        {pr.member.departmentName}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Guest Authors / External Contributors */}
        {project.guestAuthors && project.guestAuthors.length > 0 && (
          <section>
            <h2 className="font-cairo text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <UserPlus className="w-6 h-6 text-[#D49B4B]" />
              المساهمون والباحثون الخارجيون
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.guestAuthors.map((author: string, idx: number) => {
                const initials = getInitials(author);
                return (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-[#141C2F] border border-[#1E293B]">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-[#D49B4B]/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-cairo font-bold text-white text-sm truncate">{author}</p>
                      <span className="text-[11px] text-[#6B7280] font-sans">باحث / مساهم خارجي</span>
                    </div>
                  </div>
                );
              })}
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
                <Link
                  key={pp.partner.id}
                  href={`/partners/${pp.partner.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#141C2F] border border-[#1E293B] hover:border-[#D49B4B]/40 transition-all duration-200 group"
                >
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
        <Link
          key={article.id}
          href={`/post/articles/${article.slug}`}
          className="group archival-card rounded-xl p-5 hover:shadow-lg transition-all duration-200"
        >
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
