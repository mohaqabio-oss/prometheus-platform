import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/article-editor";
import { updateArticleAction, getAdminArticlesList } from "@/app/actions/article-actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const articles = await getAdminArticlesList();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm" className="gap-2 text-[#6B7280] hover:text-white">
            <ArrowLeft className="w-4 h-4 text-[#E84A0C]" />
            <span>العودة للوحة تحكم المقالات والمجلة</span>
          </Button>
        </Link>
      </div>

      <ArticleEditor article={article} saveAction={updateArticleAction} />
    </div>
  );
}
