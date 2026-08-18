import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getAdminArticlesList } from "@/app/actions/article-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArticleWorkflowPanel } from "@/components/admin/article-workflow-panel";
import { ArticleStatus } from "@prisma/client";
import { ArrowLeft, User, Calendar, FileText } from "lucide-react";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const session = await getSession();
  const articles = await getAdminArticlesList();
  const article = articles.find((a) => a.id === id);

  if (!article || !session) {
    notFound();
  }

  const isAuthor = article.authorId === session.userId;
  const isEditorOrAdmin =
    session.roles.includes("POST_EDITOR") || session.roles.includes("ADMIN");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-dark-800">
        <Link href="/admin/articles">
          <button className="inline-flex items-center gap-2 text-xs font-mono text-brand-gray-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles List</span>
          </button>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-brand-gray-500">
          <span>Article ID: {article.id}</span>
        </div>
      </div>

      {/* Editor Grid Layout (Content Left, Workflow Panel Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Article Details & Content Textarea */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 sm:p-8 bg-brand-dark-900/90 border-brand-dark-800 space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="orange">{article.categoryName}</Badge>
                <span className="text-xs font-mono text-brand-gray-500">
                  Created {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {article.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-brand-gray-400 font-mono pt-2 border-t border-brand-dark-800">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-orange" />
                  Author: <strong className="text-white">{article.authorName}</strong>
                </span>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5 pt-4 border-t border-brand-dark-800">
              <label className="text-xs font-mono font-medium text-brand-gray-400 block">
                Summary / Excerpt
              </label>
              <p className="text-xs sm:text-sm text-brand-gray-300 bg-brand-dark-950 p-3 rounded-lg border border-brand-dark-800 leading-relaxed font-sans">
                {article.excerpt || "No summary provided."}
              </p>
            </div>

            {/* Article Content Display */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono font-medium text-brand-gray-400 block">
                Article Body Content
              </label>
              <div className="p-4 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-xs font-mono text-brand-gray-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {article.content}
              </div>
            </div>

          </Card>
        </div>

        {/* Right: Editorial Workflow Control Panel */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <ArticleWorkflowPanel
            articleId={article.id}
            currentStatus={article.status as ArticleStatus}
            editorNotes={article.editorNotes}
            authorId={article.authorId}
            authorName={article.authorName}
            currentUserId={session.userId}
            userRoles={session.roles}
          />
        </div>

      </div>

    </div>
  );
}
