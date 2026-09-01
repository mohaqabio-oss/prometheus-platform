import React from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { Layers, ArrowLeft, BookOpen } from "lucide-react";

export default async function CollectionsIndexPage() {
  let collections: any[] = [];
  try {
    collections = await prisma.collection.findMany({
      include: {
        articles: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {}

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-12">
      
      {/* Header */}
      <SectionHeader
        badgeText="السلاسل والمجموعات التحريرية"
        title="المجموعات الأكاديمية"
        highlightedTitle="المختارة"
        description="سلاسل مقالات موضوعية تدرس مجالات محددة في الهندسة البرمجية والبحث العلمي بتسلسل منهجي."
      />

      {/* Collections Grid or Clean Empty State */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <Card key={col.id} className="p-8 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#E84A0C]/40 transition-all duration-300">
              
              <div className="space-y-4">
                {col.coverImage && (
                  <div className="rounded-xl overflow-hidden border border-[#6B7280]/20 aspect-video">
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
                  <span className="text-xs font-mono text-[#6B7280]">
                    {new Date(col.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>

                <h2 className="font-display text-xl font-bold text-white hover:text-[#E84A0C] transition-all duration-300">
                  <Link href={`/collections/${col.slug}`}>
                    {col.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-sans">
                  {col.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#6B7280]/20 flex items-center justify-between">
                <span className="text-xs font-mono text-[#6B7280]">
                  تضم {col.articles.length} مقالات علمية
                </span>

                <Link href={`/collections/${col.slug}`}>
                  <Button size="sm" variant="outline" className="gap-2 text-xs rounded-xl border-[#6B7280]/30 text-white">
                    <span>تصفح السلسلة</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-[#E84A0C]" />
                  </Button>
                </Link>
              </div>

            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border border-dashed border-[#6B7280]/30 bg-[#0D0D0D] space-y-3">
          <BookOpen className="w-10 h-10 text-[#6B7280] mx-auto" />
          <h3 className="font-display text-base font-bold text-white">
            لا توجد مجموعات تحريرية حالياً
          </h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            سيتم إنشاء السلاسل والمجموعات البحثية فور اعتماد المقالات وتجميعها من قبل الكادر التحريري.
          </p>
        </Card>
      )}

    </div>
  );
}
