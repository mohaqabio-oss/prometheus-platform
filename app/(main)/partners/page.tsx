import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { Building2, Globe, ChevronLeft, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "شركاء بروميثيوس",
  description: "تعرف على الشركاء والمؤسسات المتعاونة مع فريق بروميثيوس التطوعي في المشاريع البحثية والمقالات الأكاديمية.",
};

export const dynamic = "force-dynamic";

export default async function PartnersPublicPage() {
  let partners: any[] = [];
  try {
    partners = await prisma.partner.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { articles: true, projects: true } },
      },
    });
  } catch {}

  return (
    <main className="min-h-screen bg-[#0A0F1D]">
      {/* Hero */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 radial-glow-amber pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-fira text-[#D49B4B] bg-[#D49B4B]/10 border border-[#D49B4B]/20 px-4 py-2 rounded-full mb-6">
            <Building2 className="w-4 h-4" />
            شركاء بروميثيوس
          </div>
          <h1 className="font-cairo text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            شبكة الشراكات
            <span className="block text-[#D49B4B]">المؤسسية والأكاديمية</span>
          </h1>
          <p className="text-[#94A3B8] font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            نتعاون مع مؤسسات ومنظمات متخصصة لإنتاج أبحاث عالية الجودة ومشاريع تقنية متميزة.
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {partners.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-[#1E293B] bg-[#141C2F]/40">
            <Building2 className="w-12 h-12 text-[#6B7280]/40 mx-auto mb-4" />
            <p className="text-[#94A3B8] font-cairo text-xl font-bold">لا توجد شراكات مُعلنة حالياً</p>
            <p className="text-sm text-[#6B7280] mt-2 font-sans">تابعنا قريباً للاطلاع على شركاء الفريق.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <Link key={partner.id} href={`/partners/${partner.slug}`}
                className="group archival-card rounded-2xl overflow-hidden p-6 hover:shadow-2xl transition-all duration-300">
                {/* Logo */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-[#1E293B] flex items-center justify-center overflow-hidden shrink-0">
                    <img src={partner.logoUrl} alt={partner.name}
                      className="w-12 h-12 object-contain" />
                  </div>
                  {partner.websiteUrl && (
                    <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#6B7280] hover:text-[#D49B4B] p-1.5 rounded-lg hover:bg-[#D49B4B]/10 transition-colors">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <h2 className="font-cairo text-xl font-bold text-white mb-2 group-hover:text-[#D49B4B] transition-colors">
                  {partner.name}
                </h2>

                {partner.description && (
                  <p className="text-sm text-[#94A3B8] font-sans line-clamp-3 leading-relaxed mb-4">
                    {partner.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-[#6B7280] font-fira pt-3 border-t border-[#1E293B]">
                  {partner._count.articles > 0 && (
                    <span>{partner._count.articles} مقالة مشتركة</span>
                  )}
                  {partner._count.projects > 0 && (
                    <span>{partner._count.projects} مشروع مشترك</span>
                  )}
                  <span className="mr-auto flex items-center gap-1 text-[#D49B4B] group-hover:gap-2 transition-all">
                    عرض <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
