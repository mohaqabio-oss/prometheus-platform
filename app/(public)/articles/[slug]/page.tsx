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
        title: `${article.title} | مجلة بروميثيوس الأكاديمية`,
        description: article.excerpt || "",
      };
    }
  } catch (e) {}

  return {
    title: "منشورات بروميثيوس | فريق بروميثيوس التطوعي",
  };
}

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let article: any = null;

  try {
    article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        authors: true,
        sources: true,
      },
    });
  } catch (e) {}

  if (!article) {
    notFound();
  }

  // Determine assigned authors (NYT / Nature style multi-author list)
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

  return (
    <article className="py-12 sm:py-20 bg-[#1A2B4A] min-h-screen text-white animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl space-y-12">
        
        {/* Back Link */}
        <Link href="/articles">
          <Button variant="ghost" size="sm" className="gap-2 text-[#6B7280] hover:text-white">
            <ArrowLeft className="w-4 h-4 text-[#E84A0C]" />
            <span>العودة لمنشورات بروميثيوس</span>
          </Button>
        </Link>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="orange">{article.categoryName || "عام"}</Badge>
            <span className="text-xs font-mono text-[#6B7280] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ar-SA") : "جديد"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base sm:text-xl text-[#6B7280] leading-relaxed font-sans">
              {article.excerpt}
            </p>
          )}

          {/* Authors Summary Line & Read Time Bar */}
          <div className="pt-4 border-t border-[#6B7280]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                {authorsList.map((au: any, index: number) => (
                  <Avatar
                    key={au.id || index}
                    src={au.avatarUrl || au.profileImage}
                    name={au.fullName}
                    size="sm"
                    className="ring-2 ring-[#1A2B4A]"
                  />
                ))}
              </div>
              <div className="text-xs font-sans">
                <span className="text-[#6B7280]">بقلم: </span>
                <strong className="text-white font-semibold">
                  {authorsList.map((au: any) => au.fullName).join("، ")}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280]">
              <Clock className="w-4 h-4 text-[#E84A0C]" />
              <span>5 دقائق قراءة</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="rounded-2xl overflow-hidden border border-[#6B7280]/20 aspect-video shadow-2xl">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Article Body Container */}
        <Card className="p-8 sm:p-12 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl shadow-xl">
          {article.content.includes("<") ? (
            <div
              className="article-body font-sans text-white leading-relaxed space-y-4 prose prose-invert max-w-none [&_img]:rounded-xl [&_img]:border [&_img]:border-[#6B7280]/20 [&_img]:my-6 [&_blockquote]:border-r-4 [&_blockquote]:border-[#E84A0C] [&_blockquote]:pr-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pr-6 [&_ol]:list-decimal [&_ol]:pr-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="article-body font-sans text-white leading-relaxed space-y-6">
              {article.content.split("\n\n").map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}
        </Card>

        {/* ELEGANT MULTI-AUTHOR ATTRIBUTION SECTION (NYT / Nature Style) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#E84A0C] font-mono text-xs">
            <Users className="w-4 h-4" />
            <span>عن المؤلفين والمشاركين في البحث</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorsList.map((author: any, index: number) => (
              <Card
                key={author.id || index}
                className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-md hover:border-[#E84A0C]/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <Avatar
                    src={author.avatarUrl || author.profileImage}
                    name={author.fullName}
                    size="lg"
                  />
                  <div className="space-y-1">
                    <h4 className="font-display text-lg font-bold text-white">
                      {author.fullName}
                    </h4>
                    <p className="text-xs font-mono text-[#E84A0C]">
                      {author.title || "عضو فريق بروميثيوس"}
                    </p>
                    <p className="text-[11px] font-mono text-[#6B7280] flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>قسم {author.departmentName || "عام"}</span>
                    </p>
                  </div>
                </div>

                {author.bio && (
                  <p className="text-xs text-[#6B7280] leading-relaxed border-t border-[#6B7280]/20 pt-3">
                    {author.bio}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* References & Sources */}
        {article.sources && article.sources.length > 0 && (
          <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#E84A0C]" />
              <span>المصادر والمراجع الأكاديمية</span>
            </h3>

            <ul className="space-y-2 text-xs font-sans text-[#6B7280]">
              {article.sources.map((src: any) => (
                <li key={src.id} className="flex items-center justify-between gap-4">
                  <span>{src.title}</span>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#E84A0C] hover:underline inline-flex items-center gap-1 font-mono shrink-0"
                    >
                      <span>رابط المصدر</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}

      </div>
    </article>
  );
}
