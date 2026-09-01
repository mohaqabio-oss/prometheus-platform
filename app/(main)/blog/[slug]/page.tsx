import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { incrementArticleViewCount } from "@/app/actions/article-actions";
import {
  ArrowRight,
  Clock,
  Calendar,
  User,
  Share2,
  BookOpen,
  Sparkles,
  Eye,
} from "lucide-react";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const article = await prisma.article.findUnique({
      where: { slug: decodedSlug },
    });
    if (article) {
      return {
        title: `${article.title} | مدونة بروميثيوس`,
        description: article.excerpt || "مقال من مدونة فريق بروميثيوس التطوعي.",
      };
    }
  } catch (e) {}

  return {
    title: "مدونة بروميثيوس العامة",
  };
}

export default async function SingleBlogPostPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let article: any = null;
  let recentPosts: any[] = [];

  try {
    article = await prisma.article.findUnique({
      where: { slug: decodedSlug },
      include: {
        author: true,
        category: true,
      },
    });

    if (article) {
      // Increment views count in background
      incrementArticleViewCount(article.id).catch(() => {});

      recentPosts = await prisma.article.findMany({
        where: {
          id: { not: article.id },
          status: "PUBLISHED",
          type: "BLOG",
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (e) {
    console.error("Error loading blog article:", e);
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl space-y-12 animate-fade-in font-sans">
      
      {/* Top Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-[#E84A0C]" />
          <span>العودة إلى المدونة العامة</span>
        </Link>

        <Badge variant="dark" className="bg-sky-500/10 text-sky-400 border-sky-500/30 text-[10px]">
          {article.category?.name || "تدوينات"}
        </Badge>
      </div>

      {/* Article Header */}
      <div className="space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-sans">
            {article.excerpt}
          </p>
        )}

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#1E293B] text-xs font-mono text-stone-400">
          <span className="flex items-center gap-1.5 text-stone-200">
            <User className="w-4 h-4 text-[#E84A0C]" />
            <span>{article.author?.name || "محرر بروميثيوس"}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-stone-500" />
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("ar-SA")
                : new Date(article.createdAt).toLocaleDateString("ar-SA")}
            </span>
          </span>

          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>{article.readTime || "4 دقائق قراءة"}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-stone-500" />
            <span>{article.viewsCount || 1} مشاهدة</span>
          </span>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#080C16] border border-[#1E293B] shadow-2xl">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content Article Body */}
      <Card className="p-8 sm:p-12 bg-[#0D1322] border border-[#1E293B] rounded-3xl shadow-xl">
        <div className="prose prose-invert max-w-none text-stone-200 text-sm sm:text-base leading-relaxed space-y-6 font-sans">
          {article.content ? (
            <div
              className="whitespace-pre-line leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-stone-400 italic">محتوى المقال قيد المراجعة والاعتماد.</p>
          )}
        </div>
      </Card>

      {/* More from Blog */}
      {recentPosts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-[#1E293B]">
          <h2 className="font-display text-xl font-bold text-white">تدوينات أخرى قد تهمك</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <Card
                key={post.id}
                className="p-5 bg-[#0D1322] border border-[#1E293B] rounded-2xl space-y-3 hover:border-[#E84A0C]/40 transition-colors group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <Badge variant="dark" className="text-[10px] text-stone-400">
                    تدوينة
                  </Badge>
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-[#E84A0C] transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-stone-500">
                  {new Date(post.createdAt).toLocaleDateString("ar-SA")}
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
