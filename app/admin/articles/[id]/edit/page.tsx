import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/article-editor";
import { prisma } from "@/lib/db/prisma";
import {
  updateArticleAction,
  getMembersForSelectAction,
  getPartnersForSelectAction,
} from "@/app/actions/article-actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  let article: any = null;
  let availableMembers: any[] = [];
  let availablePartners: any[] = [];

  try {
    [article, availableMembers, availablePartners] = await Promise.all([
      prisma.article.findUnique({
        where: { id },
        include: {
          author: true,
          authors: true,
          category: true,
          partners: { include: { partner: true } },
        },
      }),
      getMembersForSelectAction(),
      getPartnersForSelectAction(),
    ]);
  } catch (e) {}

  if (!article) {
    notFound();
  }

  const articleForEditor = {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || "",
    content: article.content,
    categoryName: article.category?.name || "عام",
    coverImage: article.coverImage || undefined,
    status: article.status,
    type: article.type,
    sources: article.sources || [],
    guestAuthors: article.guestAuthors || [],
    authors: article.authors?.map((a: any) => ({
      id: a.id,
      name: a.name,
      title: a.role || "مؤلف مشارك",
    })) || [],
    partners: article.partners?.map((p: any) => ({
      id: p.partner.id,
      name: p.partner.name,
      logoUrl: p.partner.logoUrl,
    })) || [],
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm" className="gap-2 text-[#6B7280] hover:text-white">
            <ArrowLeft className="w-4 h-4 text-[#E84A0C]" />
            <span>العودة لوحة تحكم المقالات والمجلة</span>
          </Button>
        </Link>
      </div>

      <ArticleEditor
        article={articleForEditor}
        availableMembers={availableMembers}
        availablePartners={availablePartners}
        saveAction={updateArticleAction}
      />
    </div>
  );
}
