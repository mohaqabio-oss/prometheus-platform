import React from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { incrementArticleViewCount } from "@/app/actions/article-actions";
import { getArticlePublicUrl } from "@/lib/routes";
import { NewspaperArticleView } from "@/components/shared/newspaper-article-view";

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
        title: `${article.title} | The Prometheus Post`,
        description: article.excerpt || "مقال من مدونة فريق بروميثيوس التطوعي.",
      };
    }
  } catch (e) {}

  return {
    title: "The Prometheus Post | التدوينات العامة",
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
        authors: true,
        category: true,
        partners: { include: { partner: true } },
      },
    });

    if (article) {
      // Subdomain Routing Rule: Academic articles must redirect to canonical academic URL
      if (article.type === "ACADEMIC") {
        const canonicalUrl = getArticlePublicUrl(article.slug, article.type);
        redirect(canonicalUrl);
      }

      // Increment views count in background
      incrementArticleViewCount(article.id).catch(() => {});

      recentPosts = await prisma.article.findMany({
        where: {
          slug: { not: decodedSlug },
          status: "PUBLISHED",
          type: "BLOG",
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) {
      throw e; // Re-throw Next.js redirect errors
    }
    console.error("Error loading blog article:", e);
  }

  if (!article) {
    notFound();
  }

  return (
    <NewspaperArticleView
      article={article}
      latestArticles={recentPosts}
      backLinkHref="/blog"
      backLinkLabel="العودة إلى المدونة العامة"
    />
  );
}
