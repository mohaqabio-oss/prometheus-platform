import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_COLLECTIONS } from "@/lib/data/mock-articles";
import { Layers, ArrowLeft, BookOpen } from "lucide-react";

export default function CollectionsIndexPage() {
  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-12">
      
      {/* Header */}
      <SectionHeader
        badgeText="السلاسل والمجموعات التحريرية"
        title="المجموعات الأكاديمية"
        highlightedTitle="المختارة"
        description="سلاسل مقالات موضوعية تدرس مجالات محددة في الهندسة البرمجية والبحث العلمي بتسلسل منهجي."
      />

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_COLLECTIONS.map((col) => (
          <Card key={col.id} className="p-8 bg-brand-dark-900/90 border-brand-dark-800 space-y-6 card-hover-border flex flex-col justify-between">
            
            <div className="space-y-4">
              {col.coverImage && (
                <div className="rounded-xl overflow-hidden border border-brand-dark-800 aspect-video">
                  <img
                    src={col.coverImage}
                    alt={col.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge variant="orange" className="font-mono text-[10px] gap-1">
                  <Layers className="w-3 h-3" />
                  <span>سلسلة أكاديمية</span>
                </Badge>
                <span className="text-xs font-mono text-brand-gray-500">{col.publishedAt}</span>
              </div>

              <h2 className="font-display text-xl font-bold text-white hover:text-brand-orange transition-colors">
                <Link href={`/collections/${col.slug}`}>
                  {col.title}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-brand-gray-400 leading-relaxed font-sans">
                {col.description}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-dark-800 flex items-center justify-between">
              <span className="text-xs font-mono text-brand-gray-400">
                تضم {col.articlesCount} مقالات علمية
              </span>

              <Link href={`/collections/${col.slug}`}>
                <Button size="sm" variant="outline" className="gap-2 text-xs">
                  <span>تصفح السلسلة</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-brand-orange" />
                </Button>
              </Link>
            </div>

          </Card>
        ))}
      </div>

    </div>
  );
}
