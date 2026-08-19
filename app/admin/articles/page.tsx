import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getAdminArticlesList } from "@/app/actions/article-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDeleteArticleButton } from "@/components/admin/admin-delete-article-button";
import { ArticleStatus } from "@prisma/client";
import {
  PlusCircle,
  Edit,
  AlertTriangle,
  FileText,
  Eye,
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
        return <Badge variant="dark" className="bg-[#1A2B4A] text-[#6B7280] border-[#6B7280]/30">مسودة</Badge>;
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
        title="إدارة مجلة ومقالات"
        highlightedTitle="بروميثيوس"
        description={
          isAuthorOnly
            ? "إدارة المقالات والمسودات الخاصة بك وتقديمها لهيئة التحرير للمراجعة والنشر."
            : "لوحة تحكم المجلة العلمية: كتابة المقالات بمحرر غني، التحرير، حذف المقالات، واعتماد النشر الرسمي."
        }
        action={
          <Link href="/admin/articles/new">
            <Button size="sm" className="gap-1.5 text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md">
              <PlusCircle className="w-4 h-4" />
              <span>كتابة مقالة جديدة (WordPress Editor)</span>
            </Button>
          </Link>
        }
      />

      {/* Role Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B7280]/20 flex items-center justify-between text-xs font-mono">
        <span className="text-[#6B7280]">
          مسجل الدخول باسم <strong className="text-white">{session?.fullName}</strong> ({session?.roles.join(", ")})
        </span>
        <span className="text-[#E84A0C]">
          {isAuthorOnly ? "عرض الكاتب (مقالاتك الشخصية)" : "عرض هيئة التحرير (جميع المقالات)"}
        </span>
      </div>

      {/* Data Table Container */}
      <Card className="p-0 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            {/* Table Header */}
            <thead className="bg-[#1A2B4A] border-b border-[#6B7280]/20 text-[#6B7280] font-mono uppercase tracking-wider">
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
            <tbody className="divide-y divide-[#6B7280]/20">
              {articles.length > 0 ? (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#1A2B4A]/40 transition-colors">
                    
                    {/* Title */}
                    <td className="p-4 max-w-xs sm:max-w-sm">
                      <p className="font-display font-bold text-white text-sm hover:text-[#E84A0C] transition-colors">
                        <Link href={`/admin/articles/${art.id}/edit`}>
                          {art.title}
                        </Link>
                      </p>
                      {art.excerpt && (
                        <p className="text-[#6B7280] text-[11px] line-clamp-1 mt-0.5 font-sans">
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
                    <td className="p-4 font-medium text-white">
                      {art.authorName}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-xl font-mono text-[10px] bg-[#1A2B4A] text-white border border-[#6B7280]/30">
                        {art.categoryName}
                      </span>
                    </td>

                    {/* Workflow Status */}
                    <td className="p-4">
                      {getStatusBadge(art.status as ArticleStatus)}
                    </td>

                    {/* Date */}
                    <td className="p-4 font-mono text-[#6B7280] text-[11px]">
                      {new Date(art.createdAt).toLocaleDateString("ar-SA")}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        {art.status === "PUBLISHED" && (
                          <Link href={`/articles/${art.slug}`} target="_blank">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs rounded-xl border-[#6B7280]/30 text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/articles/${art.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 rounded-xl border-[#6B7280]/30 text-white hover:text-[#E84A0C]">
                            <Edit className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </Button>
                        </Link>
                        <AdminDeleteArticleButton articleId={art.id} articleTitle={art.title} />
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#6B7280] font-mono space-y-2">
                    <FileText className="w-8 h-8 text-[#6B7280] mx-auto mb-2" />
                    <p className="text-white font-bold">لا توجد مقالات في المسار الحالي</p>
                    <p className="text-xs">اضغط على زر "كتابة مقالة جديدة" لإنشاء أول مقالة بمحرر WordPress.</p>
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
