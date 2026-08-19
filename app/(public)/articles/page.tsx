"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Clock, BookOpen } from "lucide-react";
import { getPublicArticlesAction } from "@/app/actions/article-actions";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await getPublicArticlesAction();
        setArticles(data || []);
      } catch (e) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
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
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16">
      
      {/* Header */}
      <SectionHeader
        badgeText="منصة منشورات بروميثيوس"
        title="المكتبة والأوراق البحثية"
        highlightedTitle="المفتوحة"
        description="منصة تحريرية موجهة لنشر المقالات المنهجية، والمراجعات البحثية المصاغة بأعلى معايير الرصانة الأكاديمية."
      />

      {/* Search & Category Filter Controls */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="ابحث عن عنوان مقالة أو موضوع بحثي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 ps-10 pe-4 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-sans transition-all duration-300"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280]">
            <span>الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "oldest")}
              className="bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#E84A0C]"
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
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#E84A0C] text-white font-bold shadow-md"
                  : "bg-[#0D0D0D] text-[#6B7280] hover:text-white border border-[#6B7280]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Cards Grid or Clean Empty State */}
      {loading ? (
        <div className="text-center py-16 text-xs font-mono text-[#6B7280]">
          جاري تحميل منشورات بروميثيوس...
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:border-[#E84A0C]/40 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="orange">{article.category || article.categoryName || "عام"}</Badge>
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ar-SA") : "جديد"}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white hover:text-[#E84A0C] transition-all duration-300">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed font-sans">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#6B7280]/20 flex items-center justify-between text-xs font-mono text-[#6B7280]">
                <span>{article.authorName || article.author?.name || "محرر بروميثيوس"}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E84A0C]" />
                  5 دقائق
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border border-dashed border-[#6B7280]/30 bg-[#0D0D0D] space-y-3">
          <BookOpen className="w-10 h-10 text-[#6B7280] mx-auto" />
          <h3 className="font-display text-base font-bold text-white">
            لا توجد مقالات حالياً
          </h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            سيتم نشر المقالات والأوراق البحثية المعتمدة فور صدورها من قبل الهيئة التحريرية للفريق.
          </p>
        </Card>
      )}

    </div>
  );
}
