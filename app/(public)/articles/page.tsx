"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_ARTICLES, MOCK_COLLECTIONS } from "@/lib/data/mock-articles";
import { Search, Clock, Eye, Calendar, Layers, ArrowLeft, BookOpen } from "lucide-react";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");

  const categories = ["الكل", "الهندسة البرمجية", "البحث العلمي", "التعليم والتطوير", "المهارات الناعمة"];
  const featuredCollection = MOCK_COLLECTIONS[0];

  const filteredArticles = MOCK_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === "الكل" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
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

      {/* Featured Collection Banner */}
      {featuredCollection && (
        <section className="relative rounded-2xl overflow-hidden border border-brand-dark-800 bg-brand-dark-900 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="orange" className="gap-1 font-mono text-[10px]">
                  <Layers className="w-3 h-3" />
                  <span>مجموعة مختارة</span>
                </Badge>
                <span className="text-xs font-mono text-brand-gray-500">{featuredCollection.publishedAt}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {featuredCollection.title}
              </h2>

              <p className="text-xs sm:text-sm text-brand-gray-300 leading-relaxed font-sans">
                {featuredCollection.description}
              </p>

              <div className="pt-2">
                <Link href={`/collections/${featuredCollection.slug}`}>
                  <Button size="sm" className="gap-2 text-xs">
                    <span>استكشف السلسلة الكاملة ({featuredCollection.articlesCount} مقالات)</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {featuredCollection.coverImage && (
              <div className="lg:col-span-5 rounded-xl overflow-hidden border border-brand-dark-800 aspect-video">
                <img
                  src={featuredCollection.coverImage}
                  alt={featuredCollection.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

          </div>
        </section>
      )}

      {/* Search & Category Filter Controls */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-brand-gray-500" />
            <input
              type="text"
              placeholder="ابحث عن عنوان مقالة أو موضوع بحثي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 ps-10 pe-4 bg-brand-dark-900 border border-brand-dark-800 rounded-xl text-sm text-white placeholder:text-brand-gray-500 focus:outline-none focus:border-brand-orange/60 font-sans"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono text-brand-gray-400">
            <span>الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "oldest")}
              className="bg-brand-dark-900 border border-brand-dark-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-orange/60"
            >
              <option value="latest">الأحدث نكراً</option>
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
                  ? "bg-brand-orange text-white font-bold shadow-md"
                  : "bg-brand-dark-900 text-brand-gray-400 hover:text-white border border-brand-dark-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Cards Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="p-6 bg-brand-dark-900/80 border-brand-dark-800 card-hover-border flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="orange">{article.category}</Badge>
                  <span className="text-[11px] font-mono text-brand-gray-500">
                    {article.publishedAt}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white hover:text-brand-orange transition-colors">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs text-brand-gray-400 line-clamp-3 leading-relaxed font-sans">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-dark-800 flex items-center justify-between text-xs font-mono text-brand-gray-500">
                <span>{article.author.name}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed border-brand-dark-800 bg-brand-dark-900/40">
          <BookOpen className="w-10 h-10 text-brand-gray-600 mx-auto mb-3" />
          <h3 className="font-display text-base font-bold text-white mb-1">
            لم يتم العثور على مقالات مطابقة
          </h3>
          <p className="text-xs text-brand-gray-500">
            جرب البحث بكلمات أخرى أو اختر تصنيفاً آخر.
          </p>
        </Card>
      )}

    </div>
  );
}
