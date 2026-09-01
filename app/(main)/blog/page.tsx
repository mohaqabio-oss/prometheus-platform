"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, FileText, Sparkles, Calendar, User } from "lucide-react";
import { getPublicArticlesAction } from "@/app/actions/article-actions";
import { getSiteSettings } from "@/app/actions/website-actions";
import { ArticleType } from "@prisma/client";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [arts] = await Promise.all([
          getPublicArticlesAction(ArticleType.BLOG),
          getSiteSettings(),
        ]);
        setArticles(arts || []);
      } catch (e) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ["الكل", "الهندسة البرمجية", "التفكير والتطوير", "أنشطة الفريق", "المهارات الناعمة"];

  const filteredArticles = articles
    .filter((article) => {
      const matchesCategory =
        selectedCategory === "الكل" ||
        article.category === selectedCategory ||
        article.categoryName === selectedCategory;
      const matchesSearch =
        (article.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      }
      return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
    });

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16 relative">
      
      {/* Ambient Glowing Background Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#E84A0C]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Blog Page Section Header */}
      <SectionHeader
        badgeText="مدونة بروميثيوس العامة"
        title="المدونة والتغوصات والمعرفة التطوعية"
        description="فضاء تفاعلي لنشر المنشورات العامة، المقالات التوعوية، خبرات الأعضاء والتجارب التقنية والهندسية لفريق بروميثيوس."
      />

      {/* Search & Category Filter Controls */}
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="ابحث عن عنوان تدوينة أو موضوع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 ps-10 pe-4 bg-[#0D1322]/80 backdrop-blur-xl border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-sky-500 font-sans transition-all duration-300 shadow-lg"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <span>الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "oldest")}
              className="bg-[#0D1322]/80 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 shadow-lg"
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
                  ? "bg-sky-600 text-white font-bold shadow-lg"
                  : "bg-white/5 text-stone-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-16 text-xs font-mono text-stone-400">
          جاري تحميل مدونة بروميثيوس...
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
              <Card className="h-full p-6 bg-[#0D1322]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl hover:border-sky-500/50 transition-all duration-300 relative overflow-hidden group">
                
                {/* Image if available */}
                {article.coverImage && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-2 border border-white/10">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                )}

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <Badge variant="dark" className="bg-sky-500/15 text-sky-400 border-sky-500/30">
                      {article.categoryName || "تدوينات"}
                    </Badge>
                    <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-sky-400" />
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ar-SA") : "جديد"}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-sky-400 transition-all duration-300 leading-snug">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed font-sans">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400 relative z-10">
                  <span className="flex items-center gap-1 text-stone-300">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    {article.authorName || article.author?.name || "محرر بروميثيوس"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    3 دقائق
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border border-dashed border-white/15 bg-[#0D1322]/80 backdrop-blur-xl space-y-3">
          <FileText className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-display text-base font-bold text-white">
            لا توجد تدوينات في المدونة حالياً
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            سيتم إتاحة التدوينات المنشورة العامة فور تحريرها ونشرها من قبل كادر الفريق.
          </p>
        </Card>
      )}

    </div>
  );
}
