import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { prisma } from "@/lib/db/prisma";
import {
  ArrowLeft,
  Clock,
  Calendar,
  ExternalLink,
  BookOpen,
  Users,
  Building2,
  Newspaper,
  Flame,
} from "lucide-react";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
    });
    if (article) {
      return {
        title: `${article.title} | The Prometheus Post`,
        description: article.excerpt || "",
      };
    }
  } catch (e) {}

  return {
    title: "The Prometheus Post | Academic Publications",
  };
}

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let article: any = null;
  let latestArticles: any[] = [];

  try {
    article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        authors: true,
        sources: true,
      },
    });

    latestArticles = await prisma.article.findMany({
      where: {
        slug: { not: slug },
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {}

  if (!article) {
    notFound();
  }

  // Determine assigned authors list
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
    <article className="py-10 sm:py-16 bg-[#0A0F1D] min-h-screen text-stone-200 animate-fade-in font-sans">
      
      {/* Import Google Serif Font Specifically For This Article Page */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&display=swap"
      />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        
        {/* Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/articles">
            <Button variant="ghost" size="sm" className="gap-2 text-stone-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 text-[#E84A0C]" />
              <span>العودة لجميع المقالات والمنشورات</span>
            </Button>
          </Link>

          <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest hidden sm:inline-block">
            Prometheus Academic Publishing Engine
          </span>
        </div>

        {/* 2. THE NEWSPAPER HEADER (THE PROMETHEUS POST) */}
        <header className="mb-10 text-center">
          {/* Top Newspaper Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono uppercase tracking-widest text-stone-400 pb-2 border-b border-stone-800">
            <span>VOL. IV • NO. 2026</span>
            <span>{currentDateFormatted}</span>
            <span>INTERNATIONAL EDITION • FREE OPEN ACCESS</span>
          </div>

          {/* Centered Massive Serif Header */}
          <div className="border-y-2 border-stone-700 py-6 my-3 bg-[#0D1322]">
            <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-stone-100 select-none drop-shadow-md">
              THE PROMETHEUS POST
            </h1>
            <p className="text-xs font-mono tracking-widest text-[#E84A0C] uppercase mt-2 font-semibold">
              The Official Academic Journal & Technology Chronicle of Prometheus Platform
            </p>
          </div>

          {/* Bottom Sub-Bar */}
          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono uppercase tracking-widest text-stone-500 pt-1 border-t border-stone-800">
            <span>PEER-REVIEWED RESEARCH</span>
            <span>ATHENS & RIYADH</span>
            <span>ISSN 2026-7890</span>
          </div>
        </header>

        {/* 3. THE GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* 4. LEFT COLUMN (MAIN CONTENT - SPAN 8) */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Category Red Highlight Tag */}
            <div>
              <span className="bg-red-700 text-white px-2.5 py-1 text-xs uppercase font-bold tracking-widest inline-block font-mono mb-3 shadow-sm">
                {article.categoryName || "FEATURED JOURNAL"}
              </span>

              {/* Dynamic Article Title in Massive Serif Font */}
              <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl lg:text-6xl uppercase leading-tight font-black text-stone-100 tracking-tight mb-6">
                {article.title}
              </h1>

              {/* Excerpt in Editorial Serif Style */}
              {article.excerpt && (
                <p className="font-['Merriweather',serif] italic text-base sm:text-xl text-stone-300 leading-relaxed border-l-4 border-red-700 pl-4 py-1 mb-6 bg-[#0D1322]/60 p-3 rounded-r-lg">
                  {article.excerpt}
                </p>
              )}

              {/* Byline & Author Meta Bar */}
              <div className="py-4 border-y border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-400">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                    {authorsList.map((au: any, index: number) => (
                      <Avatar
                        key={au.id || index}
                        src={au.avatarUrl || au.profileImage}
                        name={au.fullName}
                        size="sm"
                        className="ring-2 ring-[#0A0F1D]"
                      />
                    ))}
                  </div>
                  <div>
                    <span className="text-stone-500">BY </span>
                    <strong className="text-stone-200 font-semibold uppercase tracking-wider">
                      {authorsList.map((au: any) => au.fullName).join(" & ")}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E84A0C]" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ar-SA") : "2026"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E84A0C]" />
                    5 MIN READ
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Article Image with Sharp Edges */}
            {article.coverImage && (
              <div className="rounded-none overflow-hidden border border-stone-800 shadow-xl bg-black">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded-none filter contrast-[1.05]"
                />
                <div className="p-2 bg-[#0D1322] border-t border-stone-800 text-[11px] font-mono text-stone-500 flex justify-between items-center">
                  <span>FIGURE 1.0 — OFFICIAL PUBLICATION GRAPHIC</span>
                  <span>PROMETHEUS MEDIA ARCHIVE</span>
                </div>
              </div>
            )}

            {/* Article Content Body */}
            <div className="bg-[#0D1322] border border-stone-800/80 p-6 sm:p-10 rounded-none shadow-xl">
              {article.content.includes("<") ? (
                <div
                  className="article-body font-['Merriweather',serif] text-stone-200 leading-relaxed text-base sm:text-lg space-y-6 prose prose-invert prose-stone max-w-none [&_p]:leading-loose [&_img]:rounded-none [&_img]:border [&_img]:border-stone-800 [&_img]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-red-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:font-serif [&_h2]:font-['Playfair_Display',serif] [&_h2]:uppercase [&_h2]:text-2xl [&_h3]:font-['Playfair_Display',serif] [&_h3]:uppercase [&_h3]:text-xl"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="article-body font-['Merriweather',serif] text-stone-200 leading-relaxed text-base sm:text-lg space-y-6">
                  {article.content.split("\n\n").map((paragraph: string, idx: number) => (
                    <p key={idx} className="leading-loose">{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Author Biographies Attribution Box */}
            <div className="pt-6 border-t-2 border-stone-800 space-y-4">
              <h3 className="font-['Playfair_Display',serif] text-lg font-black uppercase tracking-wider text-stone-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-700" />
                <span>ABOUT THE AUTHORS</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {authorsList.map((author: any, index: number) => (
                  <Card
                    key={author.id || index}
                    className="p-5 bg-[#0D1322] border border-stone-800 rounded-none space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={author.avatarUrl || author.profileImage}
                        name={author.fullName}
                        size="md"
                        className="rounded-none border border-stone-700"
                      />
                      <div className="space-y-1">
                        <h4 className="font-['Playfair_Display',serif] text-base font-bold text-stone-100">
                          {author.fullName}
                        </h4>
                        <p className="text-[11px] font-mono text-red-600 uppercase">
                          {author.title || "PROMETHEUS CONTRIBUTOR"}
                        </p>
                        <p className="text-[10px] font-mono text-stone-500">
                          {author.departmentName || "General Department"}
                        </p>
                      </div>
                    </div>

                    {author.bio && (
                      <p className="text-xs text-stone-400 leading-relaxed font-serif border-t border-stone-800/60 pt-2.5">
                        {author.bio}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Academic References */}
            {article.sources && article.sources.length > 0 && (
              <Card className="p-6 bg-[#0D1322] border border-stone-800 rounded-none space-y-3">
                <h3 className="font-['Playfair_Display',serif] text-base font-black uppercase text-stone-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-700" />
                  <span>REFERENCES & CITATIONS</span>
                </h3>

                <ul className="space-y-2 text-xs font-serif text-stone-400">
                  {article.sources.map((src: any) => (
                    <li key={src.id} className="flex items-center justify-between gap-4 border-b border-stone-800/40 pb-2">
                      <span>[{src.id.substring(0, 4)}] {src.title}</span>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-600 hover:underline font-mono text-[11px] shrink-0 inline-flex items-center gap-1"
                        >
                          <span>LINK</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

          </main>

          {/* 5. RIGHT COLUMN (SIDEBAR - SPAN 4) */}
          <aside className="lg:col-span-4 space-y-8">
            
            <div className="border-t-4 border-red-700 pt-3">
              
              <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-2">
                <h2 className="font-['Playfair_Display',serif] text-xl font-black uppercase tracking-wider text-stone-100 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-700" />
                  <span>THE LATEST</span>
                </h2>
                <span className="text-[10px] font-mono text-stone-500 uppercase">ARCHIVE</span>
              </div>

              {/* Vertical List of Latest Articles */}
              <div className="space-y-4">
                {latestArticles.length > 0 ? (
                  latestArticles.map((item: any) => (
                    <article key={item.id} className="border-b border-stone-800 pb-4 space-y-2 group">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500 uppercase">
                        <span className="text-red-600 font-bold">{item.categoryName || "ESSAY"}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>

                      <h3 className="font-['Playfair_Display',serif] text-base font-bold text-stone-200 group-hover:text-red-500 transition-colors leading-snug">
                        <Link href={`/articles/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h3>

                      {item.excerpt && (
                        <p className="font-serif text-xs text-stone-400 line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      )}
                    </article>
                  ))
                ) : (
                  <>
                    <article className="border-b border-stone-800 pb-4 space-y-2">
                      <span className="text-red-600 font-mono text-[10px] uppercase font-bold">RESEARCH</span>
                      <h3 className="font-['Playfair_Display',serif] text-base font-bold text-stone-200">
                        Formalizing Open Access Standards in Modern Academic Networks
                      </h3>
                      <p className="font-serif text-xs text-stone-400 line-clamp-2">
                        An analysis of peer-review methodologies and decentralized scholarly distribution.
                      </p>
                    </article>

                    <article className="border-b border-stone-800 pb-4 space-y-2">
                      <span className="text-red-600 font-mono text-[10px] uppercase font-bold">ENGINEERING</span>
                      <h3 className="font-['Playfair_Display',serif] text-base font-bold text-stone-200">
                        Scalable Architecture Patterns for High-Throughput Volunteer Teams
                      </h3>
                      <p className="font-serif text-xs text-stone-400 line-clamp-2">
                        Building responsive digital systems for non-profit and community computing.
                      </p>
                    </article>

                    <article className="border-b border-stone-800 pb-4 space-y-2">
                      <span className="text-red-600 font-mono text-[10px] uppercase font-bold">ETHICS</span>
                      <h3 className="font-['Playfair_Display',serif] text-base font-bold text-stone-200">
                        Ethical Frameworks in Open Source AI & Algorithmic Transparency
                      </h3>
                      <p className="font-serif text-xs text-stone-400 line-clamp-2">
                        Examining the impact of open weights and reproducible research models.
                      </p>
                    </article>
                  </>
                )}
              </div>

            </div>

            {/* Newspaper Journal Badge Box */}
            <Card className="p-5 bg-[#0D1322] border border-stone-800 rounded-none text-center space-y-3">
              <Newspaper className="w-8 h-8 text-red-700 mx-auto opacity-80" />
              <h4 className="font-['Playfair_Display',serif] text-sm font-bold uppercase text-stone-100">
                PROMETHEUS ACADEMIC PRESS
              </h4>
              <p className="text-xs text-stone-400 font-serif leading-relaxed">
                All articles published under Creative Commons Attribution licenses for open scholarly dissemination.
              </p>
            </Card>

          </aside>

        </div>

      </div>
    </article>
  );
}
