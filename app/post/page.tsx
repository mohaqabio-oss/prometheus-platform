import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ArticleType } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import {
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  Award,
  FileCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Prometheus Post | مجلة بروميثيوس الأكاديمية المحكمة",
  description: "المجلة العلمية المفتوحة المصدر والأوراق البحثية المحكمة لفريق بروميثيوس.",
};

export default async function AcademicJournalHomePage() {
  // Query ONLY articles with type === "ACADEMIC" and status === "PUBLISHED"
  const academicArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      type: ArticleType.ACADEMIC,
    },
    include: {
      author: true,
      authors: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 9,
  });

  const totalAcademicCount = await prisma.article.count({
    where: {
      status: "PUBLISHED",
      type: ArticleType.ACADEMIC,
    },
  });

  const totalReviewersCount = await prisma.editorialMember.count();

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16 relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#E84A0C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Official Newspaper Masthead Header Banner */}
      <div className="text-center space-y-4 relative z-10 border-b border-stone-800 pb-10">
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono uppercase tracking-widest text-stone-400 pb-3 border-b border-stone-800">
          <span>VOL. IV • ISSUE 02</span>
          <span>THE PROMETHEUS POST</span>
          <span>DOUBLE-BLIND PEER REVIEWED</span>
        </div>

        <div className="border-y-2 border-stone-700 py-8 my-3 bg-[#0D1322]/80 backdrop-blur-xl rounded-2xl shadow-xl">
          <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-stone-100 select-none drop-shadow-md">
            THE PROMETHEUS POST
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-[#E84A0C] uppercase mt-3 font-semibold">
            مجلة الأوراق البحثية والمراجعات الأكاديمية المحكمة
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-stone-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#E84A0C]" />
            تحكيم أكاديمي مستقل
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            ترخيص المشاع الإبداعي (CC BY 4.0)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            فهرسة رقمية مفتوحة
          </span>
        </div>
      </div>

      {/* 2. Journal Highlights & Volume Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        <Card className="p-5 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-center space-y-1">
          <p className="text-3xl font-mono font-bold text-[#E84A0C]">+{totalAcademicCount}</p>
          <p className="text-xs text-stone-400 font-sans">ورقة بحثية منشورة</p>
        </Card>
        <Card className="p-5 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-center space-y-1">
          <p className="text-3xl font-mono font-bold text-amber-500">+{totalReviewersCount}</p>
          <p className="text-xs text-stone-400 font-sans">محكماً أكاديمياً معتمداً</p>
        </Card>
        <Card className="p-5 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-center space-y-1">
          <p className="text-3xl font-mono font-bold text-white">100%</p>
          <p className="text-xs text-stone-400 font-sans">وصول حر ومجاني</p>
        </Card>
        <Card className="p-5 bg-[#0D1322]/80 border border-white/10 rounded-2xl text-center space-y-1">
          <p className="text-3xl font-mono font-bold text-emerald-400">Vol. 4</p>
          <p className="text-xs text-stone-400 font-sans">الإصدار الدوري الحالي</p>
        </Card>
      </div>

      {/* 3. Published Academic Papers Grid */}
      <div className="space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <SectionHeader
            badgeText="جديد النشر الأكاديمي"
            title="الأوراق البحثية والمراجعات المعتمدة"
            description="جميع الأبحاث المنشورة خضعت لبروتوكول التحكيم المزدوج التعمية والتدقيق المنهجي الصارم."
          />
          <Link href="/articles" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs rounded-xl border-white/15 bg-white/5 text-white hover:text-[#E84A0C]"
            >
              <span>استعراض أرشيف الأعداد</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {academicArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicArticles.map((article) => {
              const authorsText =
                article.authors && article.authors.length > 0
                  ? article.authors.map((a) => a.name).join("، ")
                  : article.author?.fullName || "هيئة تحرير بروميثيوس";

              return (
                <Card
                  key={article.id}
                  className="p-6 bg-[#0D1322]/90 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:border-[#E84A0C]/60 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="orange">
                        {article.category?.name || "بحث أكاديمي"}
                      </Badge>
                      <span className="text-[11px] font-mono text-stone-400">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString("ar-SA")
                          : new Date(article.createdAt).toLocaleDateString("ar-SA")}
                      </span>
                    </div>

                    <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-white group-hover:text-[#E84A0C] transition-colors leading-snug">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {article.excerpt && (
                      <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed font-sans">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
                    <span className="truncate max-w-[180px]">{authorsText}</span>
                    <span className="flex items-center gap-1 text-[#E84A0C]">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>قراءة البحث</span>
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center border border-dashed border-white/15 bg-[#0D1322]/80 space-y-3">
            <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد أوراق أكاديمية منشورة حالياً</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              تخضع الأوراق البحثية المودعة لمرحلة التحكيم المزدوج، وستتاح فور اعتمادها للنشر في هذا العدد.
            </p>
          </Card>
        )}
      </div>

      {/* 4. Call to Action / Submission Box */}
      <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#141C2F] to-[#0A0F1D] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative z-10">
        <div className="space-y-2 text-center md:text-right">
          <Badge variant="orange">إيداع الأبحاث</Badge>
          <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-white">
            هل ترغب في نشر ورقتك البحثية في مجلة بروميثيوس؟
          </h2>
          <p className="text-xs text-stone-400 max-w-xl font-sans">
            نستقبل الأوراق والمقالات المنهجية في مجالات الهندسة البرمجية، الذكاء الاصطناعي، والعلوم الحاسوبية وفق معايير النشر المعتمدة.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/publication-ethics">
            <Button variant="outline" size="sm" className="text-xs border-white/15 bg-white/5 text-white hover:text-[#E84A0C]">
              دليل أخلاقيات النشر
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="sm" className="text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white font-bold shadow-lg">
              إرسال ورقة للتحكيم
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
