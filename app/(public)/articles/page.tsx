"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, BookOpen } from "lucide-react";
import { getPublicArticlesAction } from "@/app/actions/article-actions";
import { getSiteSettings, PageHeaderConfig } from "@/app/actions/website-actions";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [articles, setArticles] = useState<any[]>([]);
  const [headerConfig, setHeaderConfig] = useState<PageHeaderConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [arts, settings] = await Promise.all([
          getPublicArticlesAction(),
          getSiteSettings(),
        ]);
        setArticles(arts || []);
        setHeaderConfig(settings.pageHeaders.articles);
      } catch (e) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ["الكل", "الهندسة البرمجية", "البحث العلمي", "التعليم والتطوير", "المهارات الناعمة"];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "الكل" || article.category === selectedCategory || article.categoryName === selectedCategory;
    const matchesSearch =
      (article.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
    }
    return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
  });

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16 relative">
      
      {/* Ambient Glowing Background Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#E84A0C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dynamic Header */}
      <SectionHeader
        badgeText={headerConfig?.badge || "منصة منشورات بروميثيوس"}
        title={headerConfig?.title || "المكتبة والأوراق البحثية المفتوحة"}
        description={headerConfig?.subtitle || "منصة تحريرية موجهة لنشر المقالات المنهجية، والمراجعات البحثية المصاغة بأعلى معايير الرصانة الأكاديمية."}
      />

      {/* Search & Category Filter Controls */}
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="ابحث عن عنوان مقالة أو موضوع بحثي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 ps-10 pe-4 bg-[#0D1322]/80 backdrop-blur-xl border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] font-sans transition-all duration-300 shadow-lg"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <span>الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "oldest")}
              className="bg-[#0D1322]/80 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#E84A0C] shadow-lg"
            >
              <option value="latest">الأحدث نشراً</option>
              <option value="oldest">الأقدم نشراً</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer backdrop-blur-md ${
                selectedCategory === cat
                  ? "bg-[#E84A0C] text-white font-bold shadow-lg"
                  : "bg-white/5 text-stone-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Cards Grid with Framer Motion 3D Hover Cards */}
      {loading ? (
        <div className="text-center py-16 text-xs font-mono text-stone-400">
          جاري تحميل منشورات بروميثيوس...
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="h-full"
            >
              <Card className="h-full p-6 bg-[#0D1322]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl hover:border-[#E84A0C]/50 transition-all duration-300 relative overflow-hidden group">
                
                {/* Subtle Ambient Card Glow */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#E84A0C]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E84A0C]/25 transition-all duration-500" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <Badge variant="orange" className="backdrop-blur-md">
                      {article.category || article.categoryName || "عام"}
                    </Badge>
                    <span className="text-[11px] font-mono text-stone-400">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ar-SA") : "جديد"}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-[#E84A0C] transition-all duration-300">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed font-sans">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400 relative z-10">
                  <span>{article.authorName || article.author?.name || "محرر بروميثيوس"}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E84A0C]" />
                    5 دقائق
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border border-dashed border-white/15 bg-[#0D1322]/80 backdrop-blur-xl space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-display text-base font-bold text-white">
            لا توجد مقالات حالياً
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            سيتم نشر المقالات والأوراق البحثية المعتمدة فور صدورها من قبل الهيئة التحريرية للفريق.
          </p>
        </Card>
      )}

    </div>
  );
}
