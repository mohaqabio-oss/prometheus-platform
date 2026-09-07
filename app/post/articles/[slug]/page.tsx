import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { incrementArticleViewCount } from "@/app/actions/article-actions";
import { NewspaperArticleView } from "@/components/shared/newspaper-article-view";

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
  } catch (e) {}

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
      incrementArticleViewCount(article.id).catch(() => {});
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
  } catch (e) {}

  if (!article) {
    notFound();
  }

  return (
    <NewspaperArticleView
      article={article}
      latestArticles={latestArticles}
      backLinkHref="/articles"
      backLinkLabel="العودة إلى المجلة الأكاديمية"
    />
  );
}
