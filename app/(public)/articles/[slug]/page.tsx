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
        title: article.title,
        description: article.excerpt || "",
      };
    }
  } catch (e) {}

  return {
    title: "Article | Prometheus Voluntary Team",
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
        category: true,
        sources: true,
      },
    });
  } catch (e) {}

  if (!article) {
    notFound();
  }

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
            <Badge variant="orange">{article.category?.name || "عام"}</Badge>
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

          {/* Author info bar */}
          <div className="pt-4 border-t border-[#6B7280]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={article.author?.avatarUrl}
                name={article.author?.fullName || "محرر بروميثيوس"}
                size="md"
              />
              <div>
                <p className="text-sm font-bold text-white leading-none">
                  {article.author?.fullName || "محرر بروميثيوس"}
                </p>
                <p className="text-xs font-mono text-[#6B7280] mt-0.5">
                  {article.author?.title || "عضو فريق بروميثيوس"}
                </p>
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

        {/* Main Article Content */}
        <Card className="p-8 sm:p-12 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl shadow-xl">
          {article.content.includes("<") ? (
            <div
              className="article-body font-sans text-white leading-relaxed space-y-4 prose prose-invert max-w-none [&_img]:rounded-xl [&_img]:border [&_img]:border-[#6B7280]/20 [&_img]:my-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_blockquote]:border-r-4 [&_blockquote]:border-[#E84A0C] [&_blockquote]:pr-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pr-6 [&_ol]:list-decimal [&_ol]:pr-6"
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
