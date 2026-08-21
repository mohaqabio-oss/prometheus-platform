import React from "react";
import Link from "next/link";
import { ArticleEditor } from "@/components/admin/article-editor";
import { createArticleDraftAction, getMembersForSelectAction } from "@/app/actions/article-actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewArticlePage() {
  const availableMembers = await getMembersForSelectAction();

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

      <ArticleEditor availableMembers={availableMembers} saveAction={createArticleDraftAction} />
    </div>
  );
}
