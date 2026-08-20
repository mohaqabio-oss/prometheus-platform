import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { Layers, ArrowLeft, Clock } from "lucide-react";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SingleCollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  let collection: any = null;

  try {
    collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        articles: {
          include: {
            article: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });
  } catch (e) {}

  if (!collection) {
    notFound();
  }

  const collectionArticles = collection.articles.map((item: any) => item.article);

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl space-y-12">
      
      {/* Back Button */}
      <div>
        <Link href="/articles">
          <Button variant="ghost" size="sm" className="gap-2 text-[#6B7280] hover:text-white">
            <ArrowLeft className="w-4 h-4 rotate-180 text-[#E84A0C]" />
            <span>العودة لمنشورات بروميثيوس</span>
          </Button>
        </Link>
      </div>

      {/* Collection Header Card */}
      <div className="p-8 sm:p-12 rounded-2xl border border-[#6B7280]/20 bg-[#0D0D0D] space-y-6 shadow-2xl">
        <div className="flex items-center gap-2">
          <Badge variant="orange" className="font-mono text-[10px] gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>سلسلة تحريرية موضوعية</span>
          </Badge>
          <span className="text-xs font-mono text-[#6B7280]">
            {new Date(collection.createdAt).toLocaleDateString("ar-SA")}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          {collection.title}
        </h1>

        {collection.description && (
          <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed max-w-3xl">
            {collection.description}
          </p>
        )}

        <div className="pt-4 border-t border-[#6B7280]/20 flex items-center gap-4 text-xs font-mono text-[#6B7280]">
          <span>تضم هذه السلسلة {collectionArticles.length} مقالات أكاديمية</span>
        </div>
      </div>

      {/* Collection Articles Feed */}
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold text-white">المقالات المدرجة في هذه السلسلة</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collectionArticles.map((article: any, idx: number) => (
            <Card key={article.id} className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#E84A0C]/40 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#E84A0C] font-bold">الجزء #{idx + 1}</span>
                  <Badge variant="orange">{article.category?.name || "عام"}</Badge>
                </div>

                <h3 className="font-display text-base font-bold text-white hover:text-[#E84A0C] transition-all duration-300">
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#6B7280]/20 flex items-center justify-between text-xs font-mono text-[#6B7280]">
                <span>{article.author?.fullName || "محرر بروميثيوس"}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E84A0C]" />
                  5 دقائق
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
