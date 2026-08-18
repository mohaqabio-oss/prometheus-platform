import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_COLLECTIONS, MOCK_ARTICLES } from "@/lib/data/mock-articles";
import { Layers, ArrowLeft, Clock, BookOpen } from "lucide-react";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SingleCollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  const collectionArticles = MOCK_ARTICLES.filter((a) =>
    collection.articleSlugs?.includes(a.slug)
  );

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl space-y-12">
      
      {/* Back Button */}
      <div>
        <Link href="/articles">
          <Button variant="ghost" size="sm" className="gap-2 text-brand-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>العودة لمنشورات بروميثيوس</span>
          </Button>
        </Link>
      </div>

      {/* Collection Header Card */}
      <div className="p-8 sm:p-12 rounded-2xl border border-brand-dark-800 bg-brand-dark-900/90 space-y-6 shadow-2xl">
        <div className="flex items-center gap-2">
          <Badge variant="orange" className="font-mono text-[10px] gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>سلسلة تحريرية موضوعية</span>
          </Badge>
          <span className="text-xs font-mono text-brand-gray-500">{collection.publishedAt}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          {collection.title}
        </h1>

        <p className="text-sm sm:text-base text-brand-gray-300 leading-relaxed max-w-3xl">
          {collection.description}
        </p>

        <div className="pt-4 border-t border-brand-dark-800 flex items-center gap-4 text-xs font-mono text-brand-gray-400">
          <span>تضم هذه السلسلة {collection.articlesCount} مقالات أكاديمية</span>
        </div>
      </div>

      {/* Collection Articles Feed */}
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold text-white">المقالات المدرجة في هذه السلسلة</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collectionArticles.map((article, idx) => (
            <Card key={article.id} className="p-6 bg-brand-dark-900/80 border-brand-dark-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand-orange font-bold">الجزء #{idx + 1}</span>
                  <Badge variant="orange">{article.category}</Badge>
                </div>

                <h3 className="font-display text-base font-bold text-white hover:text-brand-orange transition-colors">
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="text-xs text-brand-gray-400 line-clamp-2 leading-relaxed">
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
      </div>

    </div>
  );
}
