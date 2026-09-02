import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { prisma } from "@/lib/db/prisma";
import { incrementArticleViewCount } from "@/app/actions/article-actions";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  Newspaper,
  Flame,
  Building2,
  UserPlus,
} from "lucide-react";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  try {
    const article = await prisma.article.findUnique({
      where: { slug: decodedSlug },
    });
    if (article) {
      return {
        title: `${article.title} | The Prometheus Post`,
        description: article.excerpt || "",
      };
    }
  } catch (e) { }

  return {
    title: "The Prometheus Post | Academic Publications",
  };
}

export default async function SingleAcademicArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  let article: any = null;
  let latestArticles: any[] = [];

  try {
    article = await prisma.article.findUnique({
      where: { slug: decodedSlug },
      include: {
        author: true,
        authors: true,
        category: true,
        partners: { include: { partner: true } },
      },
    });

    if (article) {
      incrementArticleViewCount(article.id).catch(() => { });
    }

    latestArticles = await prisma.article.findMany({
      where: {
        slug: { not: decodedSlug },
        type: "ACADEMIC",
        status: "PUBLISHED",
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) { }

  if (!article) {
    notFound();
  }

  const authorsList =
    article.authors && article.authors.length > 0
      ? article.authors
      : article.author
        ? [article.author]
        : [
          {
            id: "default-author",
            fullName: "محرر بروميثيوس",
            title: "عضو الهيئة التحريرية",
            departmentName: "البحث والتحرير",
            avatarUrl: null,
            bio: "عضو فاعل ومساهم في إعداد المنشورات والبحوث لدى فريق بروميثيوس التطوعي.",
          },
        ];

  const currentDateFormatted = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <article className="py-10 sm:py-16 bg-[#FCFBF9] min-h-screen !text-stone-900 animate-fade-in font-sans selection:bg-red-200 selection:!text-red-900">
      
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&display=swap"
      />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">

        <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-4">
          <Link href="/articles">
            <Button variant="ghost" size="sm" className="gap-2 !text-stone-700 hover:!text-black hover:bg-stone-200/50 transition-colors">
              <ArrowLeft className="w-4 h-4 !text-[#E84A0C]" />
              <span className="font-semibold">العودة إلى المجلة الأكاديمية</span>
            </Button>
          </Link>

          <span className="text-[11px] font-mono !text-stone-600 uppercase tracking-widest hidden sm:inline-block font-bold">
            The Prometheus Post • Academic Publishing Engine
          </span>
        </div>

        <header className="mb-12 text-center">
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono uppercase tracking-widest !text-stone-700 pb-2 border-b-2 border-black font-bold">
            <span>VOL. IV • NO. 2026</span>
            <span>{currentDateFormatted}</span>
            <span>INTERNATIONAL EDITION • FREE OPEN ACCESS</span>
          </div>

          <div className="py-8 my-1 bg-transparent">
            <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight !text-black select-none">
              THE PROMETHEUS POST
            </h1>
            <p className="text-xs font-mono tracking-widest !text-red-800 uppercase mt-3 font-bold">
              The Official Academic Journal & Technology Chronicle of Prometheus Platform
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono uppercase tracking-widest !text-stone-700 pt-2 border-t-2 border-black font-bold">
            <span>PEER-REVIEWED RESEARCH</span>
            <span>ATHENS & RIYADH</span>
            <span>ISSN 2026-7890</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          <main className="lg:col-span-8 space-y-10">

            <div className="border-b border-stone-300 pb-8">
              <span className="bg-red-800 !text-white px-3 py-1 text-[11px] uppercase font-bold tracking-widest inline-block font-mono mb-6 shadow-sm">
                {article.category?.name || "FEATURED ACADEMIC JOURNAL"}
              </span>

              <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl lg:text-6xl leading-[1.15] font-black !text-black tracking-tight mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="font-['Merriweather',serif] italic text-lg sm:text-xl !text-stone-800 leading-relaxed border-l-4 border-red-800 pl-5 py-2 mb-8 bg-stone-100/50">
                  {article.excerpt}
                </p>
              )}

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono !text-stone-600 font-bold">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                    {authorsList.map((au: any, index: number) => (
                      <Avatar
                        key={au.id || index}
                        src={au.avatarUrl || au.profileImage}
                        name={au.fullName}
                        size="sm"
                        className="ring-2 ring-[#FCFBF9]"
                      />
                    ))}
                  </div>
                  <div>
                    <span>BY </span>
                    <strong className="!text-black font-bold uppercase tracking-wider">
                      {[...authorsList.map((au: any) => au.fullName), ...(article.guestAuthors || [])].join(" & ")}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 !text-red-800" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ar-SA") : "2026"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 !text-red-800" />
                    5 MIN READ
                  </span>
                </div>
              </div>
            </div>

            {article.coverImage && (
              <figure className="mb-10">
                <div className="border border-stone-300 bg-white p-1 shadow-sm">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-auto max-h-[550px] object-cover grayscale-[20%] contrast-[1.05]"
                  />
                </div>
                <figcaption className="mt-3 text-[11px] font-mono !text-stone-600 flex justify-between items-center border-b border-stone-200 pb-3 font-bold">
                  <span>FIGURE 1.0 — OFFICIAL PUBLICATION GRAPHIC</span>
                  <span>PROMETHEUS MEDIA ARCHIVE</span>
                </figcaption>
              </figure>
            )}

            <div className="article-body font-['Merriweather',serif] !text-stone-900 leading-relaxed text-base sm:text-lg space-y-6">
              {article.content.includes("<") ? (
                <div
                  className="prose prose-stone max-w-none prose-lg [&_p]:leading-[2.2] [&_p]:!text-stone-900 [&_h1]:!text-black [&_h2]:!text-black [&_h3]:!text-black [&_h4]:!text-black [&_strong]:!text-black [&_li]:!text-stone-900 [&_img]:border [&_img]:border-stone-300 [&_img]:p-1 [&_img]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-red-800 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:bg-stone-100/50 [&_blockquote]:py-2 [&_h2]:font-['Playfair_Display',serif] [&_h2]:text-3xl [&_h2]:mt-10 [&_h3]:font-['Playfair_Display',serif] [&_h3]:text-2xl"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="space-y-6">
                  {article.content.split("\n\n").map((paragraph: string, idx: number) => (
                    <p key={idx} className="leading-[2.2] !text-stone-900">{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            {/* ── SOURCES & REFERENCES BOX ── */}
            {article.sources && article.sources.length > 0 && (
              <div className="sources-box mt-12">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block" style={{color:'#D49B4B'}}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  المصادر والمراجع
                </h3>
                <ol>
                  {article.sources.map((src: string, i: number) => (
                    <li key={i}>
                      {src.startsWith("http") ? (
                        <a href={src} target="_blank" rel="noopener noreferrer">{src}</a>
                      ) : src}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* ── ABOUT THE AUTHORS ── */}
            <div className="pt-10 mt-10 border-t-4 border-black space-y-6">
              <h3 className="font-['Playfair_Display',serif] text-2xl font-black uppercase tracking-wider !text-black flex items-center gap-2">
                <Users className="w-5 h-5 !text-red-800" />
                <span>ABOUT THE AUTHORS</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {authorsList.map((author: any, index: number) => (
                  <Card
                    key={author.id || index}
                    className="p-6 bg-white border border-stone-300 rounded-none shadow-sm space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={author.avatarUrl || author.profileImage}
                        name={author.fullName}
                        size="md"
                        className="rounded-none border border-stone-300"
                      />
                      <div className="space-y-1">
                        <h4 className="font-['Playfair_Display',serif] text-lg font-bold !text-black">
                          {author.fullName}
                        </h4>
                        <p className="text-[11px] font-mono !text-red-800 uppercase font-bold">
                          {author.title || "PROMETHEUS CONTRIBUTOR"}
                        </p>
                        <p className="text-[11px] font-mono !text-stone-600 font-bold">
                          {author.departmentName || "General Department"}
                        </p>
                      </div>
                    </div>

                    {author.bio && (
                      <p className="text-sm !text-stone-800 leading-relaxed font-serif border-t border-stone-100 pt-3">
                        {author.bio}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* ── EXTERNAL CONTRIBUTORS / GUEST AUTHORS ── */}
            {article.guestAuthors && article.guestAuthors.length > 0 && (
              <div className="pt-6 border-t-2 border-stone-200 space-y-4">
                <h3 className="font-['Playfair_Display',serif] text-xl font-black uppercase tracking-wider !text-black flex items-center gap-2">
                  <UserPlus className="w-5 h-5 !text-red-800" />
                  <span>EXTERNAL CONTRIBUTORS • الباحثون والمؤلفون الخارجيون</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.guestAuthors.map((guest: string, index: number) => (
                    <Card
                      key={index}
                      className="p-4 bg-stone-50 border border-stone-300 rounded-none shadow-sm flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-700 font-mono text-sm shrink-0">
                        {guest.trim().charAt(0) || "G"}
                      </div>
                      <div>
                        <h4 className="font-['Playfair_Display',serif] text-base font-bold !text-black">
                          {guest}
                        </h4>
                        <p className="text-[10px] font-mono !text-red-800 uppercase font-bold">
                          GUEST AUTHOR / مساهم خارجي
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── PARTNER INSTITUTIONS ── */}
            {article.partners && article.partners.length > 0 && (
              <div className="pt-6 border-t-2 border-stone-200 space-y-4">
                <h3 className="font-['Playfair_Display',serif] text-xl font-black uppercase tracking-wider !text-black flex items-center gap-2">
                  <Building2 className="w-5 h-5 !text-red-800" />
                  <span>AFFILIATED INSTITUTIONS • الشركاء والجهات الداعمة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {article.partners.map((pa: any) => (
                    <Link
                      key={pa.partner.id}
                      href={`/partners/${pa.partner.slug}`}
                      className="p-4 bg-white border border-stone-300 hover:border-black transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 bg-stone-50 border border-stone-200 p-1 flex items-center justify-center shrink-0">
                        <img src={pa.partner.logoUrl} alt={pa.partner.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-['Playfair_Display',serif] text-sm font-bold !text-black group-hover:!text-red-800 transition-colors truncate">
                          {pa.partner.name}
                        </h4>
                        <p className="text-[10px] font-mono !text-stone-500 uppercase font-bold">
                          PARTNER ORGANIZATION
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </main>

          <aside className="lg:col-span-4 space-y-10">

            <div className="border-t-4 border-black pt-4">
              <div className="flex items-center justify-between mb-6 border-b-2 border-stone-200 pb-3">
                <h2 className="font-['Playfair_Display',serif] text-xl font-black uppercase tracking-wider !text-black flex items-center gap-2">
                  <Flame className="w-5 h-5 !text-red-800" />
                  <span>THE LATEST</span>
                </h2>
                <span className="text-[10px] font-mono !text-stone-600 uppercase font-bold">ARCHIVE</span>
              </div>

              <div className="space-y-6">
                {latestArticles.length > 0 ? (
                  latestArticles.map((item: any) => (
                    <article key={item.id} className="border-b border-stone-200 pb-6 space-y-2 group">
                      <div className="flex items-center gap-2 text-[10px] font-mono !text-stone-600 uppercase font-bold">
                        <span className="!text-red-800">{item.categoryName || "ACADEMIC ESSAY"}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>

                      <h3 className="font-['Playfair_Display',serif] text-lg font-bold !text-black group-hover:!text-red-800 transition-colors leading-snug">
                        <Link href={`/articles/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h3>

                      {item.excerpt && (
                        <p className="font-serif text-sm !text-stone-700 line-clamp-3 leading-relaxed">
                          {item.excerpt}
                        </p>
                      )}
                    </article>
                  ))
                ) : (
                  <p className="text-sm font-serif !text-stone-600 italic">No further publications available.</p>
                )}
              </div>
            </div>

            <Card className="p-6 bg-stone-100 border border-stone-300 rounded-none text-center space-y-4 shadow-sm">
              <Newspaper className="w-10 h-10 !text-red-800 mx-auto" />
              <h4 className="font-['Playfair_Display',serif] text-base font-black uppercase !text-black">
                PROMETHEUS ACADEMIC PRESS
              </h4>
              <p className="text-xs !text-stone-700 font-serif leading-relaxed">
                All articles published under Creative Commons Attribution licenses for open scholarly dissemination. Ensuring high-quality research accessibility.
              </p>
            </Card>

          </aside>

        </div>
      </div>
    </article>
  );
}
