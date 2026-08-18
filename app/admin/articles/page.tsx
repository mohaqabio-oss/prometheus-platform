import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getAdminArticlesList } from "@/app/actions/article-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleStatus } from "@prisma/client";
import {
  PlusCircle,
  Edit,
  AlertTriangle,
} from "lucide-react";

export default async function AdminArticlesPage() {
  const session = await getSession();
  const articles = await getAdminArticlesList();

  const isAuthorOnly =
    session?.roles.includes("AUTHOR") &&
    !session?.roles.includes("POST_EDITOR") &&
    !session?.roles.includes("ADMIN");

  const getStatusBadge = (status: ArticleStatus) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="dark" className="bg-zinc-800 text-zinc-300 border-zinc-700">مسودة</Badge>;
      case "SUBMITTED":
        return <Badge variant="dark" className="bg-blue-500/15 text-blue-400 border-blue-500/30">مقدمة للمراجعة</Badge>;
      case "IN_REVIEW":
        return <Badge variant="dark" className="bg-purple-500/15 text-purple-400 border-purple-500/30">قيد المراجعة التحريرية</Badge>;
      case "CHANGES_REQUESTED":
        return <Badge variant="dark" className="bg-amber-500/15 text-amber-400 border-amber-500/30">مطلوب تعديلات</Badge>;
      case "PUBLISHED":
        return <Badge variant="dark" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">منشورة رسمياً</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <SectionHeader
        badgeText="إدارة التحرير والنشر"
        title="إدارة مقالات"
        highlightedTitle="منشورات بروميثيوس"
        description={
          isAuthorOnly
            ? "إدارة المقالات والمسودات الخاصة بك وتقديمها لهيئة التحرير للمراجعة والنشر."
            : "مراجعة المقالات المقدمة، طلب التعديلات التحريرية، واعتماد النشر الرسمي."
        }
        action={
          <Link href="/admin/articles/new">
            <Button size="sm" className="gap-1.5 text-xs">
              <PlusCircle className="w-4 h-4" />
              <span>كتابة مقالة جديدة</span>
            </Button>
          </Link>
        }
      />

      {/* Role Notice Banner */}
      <div className="p-4 rounded-xl bg-brand-dark-900 border border-brand-dark-800 flex items-center justify-between text-xs font-mono">
        <span className="text-brand-gray-300">
          مسجل الدخول باسم <strong className="text-white">{session?.fullName}</strong> ({session?.roles.join(", ")})
        </span>
        <span className="text-brand-orange">
          {isAuthorOnly ? "عرض الكاتب (مقالاتك الشخصية فقط)" : "عرض هيئة التحرير (جميع المقالات)"}
        </span>
      </div>

      {/* Data Table Container */}
      <Card className="p-0 bg-brand-dark-900/80 border-brand-dark-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            {/* Table Header */}
            <thead className="bg-brand-dark-850 border-b border-brand-dark-800 text-brand-gray-400 font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">عنوان المقالة والملخص</th>
                <th className="p-4">الكاتب</th>
                <th className="p-4">التصنيف</th>
                <th className="p-4">حالة التحرير والنشر</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4 text-left">الإجراءات</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-brand-dark-800/60">
              {articles.length > 0 ? (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-brand-dark-850/50 transition-colors">
                    
                    {/* Title */}
                    <td className="p-4 max-w-xs sm:max-w-sm">
                      <p className="font-display font-bold text-white text-sm hover:text-brand-orange transition-colors">
                        <Link href={`/admin/articles/${art.id}/edit`}>
                          {art.title}
                        </Link>
                      </p>
                      {art.excerpt && (
                        <p className="text-brand-gray-400 text-[11px] line-clamp-1 mt-0.5 font-sans">
                          {art.excerpt}
                        </p>
                      )}
                      {art.editorNotes && art.status === "CHANGES_REQUESTED" && (
                        <p className="text-amber-400 text-[10px] font-mono mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          ملاحظة المحرر: {art.editorNotes}
                        </p>
                      )}
                    </td>

                    {/* Author */}
                    <td className="p-4 font-medium text-brand-gray-300">
                      {art.authorName}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-brand-dark-850 text-brand-gray-400 border border-brand-dark-800">
                        {art.categoryName}
                      </span>
                    </td>

                    {/* Workflow Status */}
                    <td className="p-4">
                      {getStatusBadge(art.status as ArticleStatus)}
                    </td>

                    {/* Date */}
                    <td className="p-4 font-mono text-brand-gray-500 text-[11px]">
                      {new Date(art.createdAt).toLocaleDateString("ar-EG")}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-left">
                      <Link href={`/admin/articles/${art.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1">
                          <Edit className="w-3.5 h-3.5" />
                          <span>المراجعة والتحرير</span>
                        </Button>
                      </Link>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-brand-gray-500 font-mono">
                    لا توجد مقالات في المسار الحالي.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </Card>

    </div>
  );
}
