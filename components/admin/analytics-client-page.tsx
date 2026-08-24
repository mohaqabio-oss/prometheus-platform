"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnalyticsData } from "@/app/actions/article-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  BookOpen,
  FileText,
  Users,
  Award,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Sparkles,
  Flame,
} from "lucide-react";

interface AnalyticsClientPageProps {
  analytics: AnalyticsData;
  userRole: string;
}

export function AnalyticsClientPage({ analytics, userRole }: AnalyticsClientPageProps) {
  const maxViews = Math.max(...analytics.topArticles.map((a) => a.viewCount), 1);

  const statsCards = [
    {
      title: "إجمالي القراءات والمشاهدات",
      value: analytics.totalViews.toLocaleString("ar-EG"),
      numericValue: analytics.totalViews,
      subtitle: "مجموع زيارات الأوراق والمقالات",
      icon: <Eye className="w-6 h-6 text-[#E84A0C]" />,
      color: "from-orange-500/20 via-amber-500/10 to-transparent",
      borderColor: "border-[#E84A0C]/40",
      textColor: "text-[#E84A0C]",
    },
    {
      title: "المقالات والأبحاث المنشورة",
      value: analytics.publishedArticlesCount.toLocaleString("ar-EG"),
      numericValue: analytics.publishedArticlesCount,
      subtitle: "بحوث معتمدة ومتاحة للعموم",
      icon: <BookOpen className="w-6 h-6 text-sky-400" />,
      color: "from-sky-500/20 via-blue-500/10 to-transparent",
      borderColor: "border-sky-500/40",
      textColor: "text-sky-400",
    },
    {
      title: "المسودات قيد التحرير",
      value: analytics.draftArticlesCount.toLocaleString("ar-EG"),
      numericValue: analytics.draftArticlesCount,
      subtitle: "أوراق عمل ومراجعات تحريرية",
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      color: "from-amber-500/20 via-yellow-500/10 to-transparent",
      borderColor: "border-amber-500/40",
      textColor: "text-amber-400",
    },
    {
      title: "الكوادر والأعضاء الفاعلون",
      value: analytics.activeMembersCount.toLocaleString("ar-EG"),
      numericValue: analytics.activeMembersCount,
      subtitle: "عضو متطوع في مختلف الأقسام",
      icon: <Users className="w-6 h-6 text-purple-400" />,
      color: "from-purple-500/20 via-indigo-500/10 to-transparent",
      borderColor: "border-purple-500/40",
      textColor: "text-purple-400",
    },
    {
      title: "الشهادات الأكاديمية الصادرة",
      value: analytics.certificatesIssuedCount.toLocaleString("ar-EG"),
      numericValue: analytics.certificatesIssuedCount,
      subtitle: "وثيقة تطوعية معتمدة وموثقة",
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "border-emerald-500/40",
      textColor: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-white max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#6B7280]/20 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="orange" className="text-xs">
              مركز التحليلات والإحصائيات
            </Badge>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              تحديث حي ومباشر
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            لوحة تحليلات المنصة والأثر الأكاديمي
          </h1>
          <p className="text-xs text-[#6B7280] font-sans">
            عرض متكامل لإحصائيات القراءة والتفاعل مع المنشورات والأوراق البحثية المنشورة.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-xs font-mono text-stone-300 flex items-center gap-2 shadow-lg">
            <TrendingUp className="w-4 h-4 text-[#E84A0C]" />
            <span>إجمالي المشاهدات: <strong className="text-white font-bold">{analytics.totalViews}</strong></span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statsCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03, y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className={`p-5 bg-gradient-to-br ${card.color} bg-[#0D1322]/90 backdrop-blur-xl border ${card.borderColor} rounded-2xl space-y-3 relative overflow-hidden shadow-xl group`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#6B7280] font-medium">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-[#0A0F1D] border border-[#6B7280]/20 shadow-md">
                  {card.icon}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <p className={`font-mono text-3xl font-extrabold ${card.textColor}`}>
                  {card.value}
                </p>
                <p className="text-[11px] font-sans text-[#6B7280]">
                  {card.subtitle}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top 5 Most Viewed Articles Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Ranking List */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-6 bg-[#0D1322]/90 backdrop-blur-xl border border-[#6B7280]/20 rounded-2xl shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 text-[#E84A0C]">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    أكثر المقالات والأبحاث قراءة (Top 5 Most Viewed Articles)
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    قائمة بالأوراق البحثية الأعلى تفاعلاً وقراءة من قِبل الزوار والمجتمع.
                  </p>
                </div>
              </div>

              <Badge variant="orange" className="text-[10px] font-mono">
                TOP RANKING
              </Badge>
            </div>

            {/* Articles Progress Chart List */}
            <div className="space-y-5">
              {analytics.topArticles.length === 0 ? (
                <div className="py-8 text-center text-[#6B7280] font-mono text-xs">
                  لا توجد إحصائيات قراءة مسجلة بعد. قم بزيارة صفحات المقالات لزيادة العداد!
                </div>
              ) : (
                analytics.topArticles.map((article, index) => {
                  const percentage = Math.round((article.viewCount / maxViews) * 100);
                  return (
                    <div key={article.id} className="space-y-2 group">
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#1A2B4A] border border-[#6B7280]/30 font-mono font-bold text-[11px] text-[#E84A0C] flex items-center justify-center shrink-0">
                            #{index + 1}
                          </span>
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="font-bold text-white group-hover:text-[#E84A0C] transition-colors flex items-center gap-1.5"
                          >
                            <span>{article.title}</span>
                            <ExternalLink className="w-3 h-3 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>

                        <div className="flex items-center gap-3 font-mono shrink-0">
                          <Badge variant="dark" className="text-[10px] bg-white/5 border-white/10 text-stone-400">
                            {article.categoryName}
                          </Badge>
                          <span className="text-[#E84A0C] font-bold">
                            {article.viewCount.toLocaleString("ar-EG")} مشاهدة
                          </span>
                        </div>
                      </div>

                      {/* Visual Animated Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-[#1A2B4A] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#E84A0C] via-orange-400 to-amber-400 rounded-full"
                        />
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </Card>
        </div>

        {/* Sidebar Summary & Highlights */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-[#0D1322]/90 backdrop-blur-xl border border-[#6B7280]/20 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
              <BarChart3 className="w-5 h-5 text-[#E84A0C]" />
              <h4 className="font-display text-base font-bold text-white">ملخص التفاعل</h4>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-[#1A2B4A]/60 border border-[#6B7280]/20 space-y-2">
                <div className="flex items-center justify-between text-[#6B7280] font-mono">
                  <span>متوسط القراءات للمقالة:</span>
                  <strong className="text-white font-bold">
                    {analytics.publishedArticlesCount > 0
                      ? Math.round(analytics.totalViews / analytics.publishedArticlesCount)
                      : 0}{" "}
                    مشاهدة
                  </strong>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0D0D0D] overflow-hidden">
                  <div className="w-3/4 h-full bg-[#E84A0C] rounded-full" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1A2B4A]/60 border border-[#6B7280]/20 space-y-2">
                <div className="flex items-center justify-between text-[#6B7280] font-mono">
                  <span>نسبة المقالات المنشورة:</span>
                  <strong className="text-emerald-400 font-bold">
                    {analytics.totalArticles > 0
                      ? Math.round((analytics.publishedArticlesCount / analytics.totalArticles) * 100)
                      : 0}%
                  </strong>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0D0D0D] overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{
                      width: `${
                        analytics.totalArticles > 0
                          ? Math.round((analytics.publishedArticlesCount / analytics.totalArticles) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1A2B4A]/60 border border-[#6B7280]/20 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px]">
                  <Sparkles className="w-4 h-4" />
                  <span>تنبيه لمنشئي المحتوى</span>
                </div>
                <p className="text-[#6B7280] text-[11px] leading-relaxed">
                  يتم تحديث عداد المشاهدات تلقائياً عند قيام أي زائر بتصفح المقالة المنشورة على الموقع العام.
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
