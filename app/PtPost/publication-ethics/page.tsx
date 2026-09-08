import React from "react";
import type { Metadata } from "next";
import { getJournalSetting } from "@/app/actions/journal-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Scale, Sparkles, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "أخلاقيات وسياسات النشر الأكاديمي | Prometheus Post",
  description: "دليل النزاهة العلمية وقواعد السلوك المهني والتحكيم المزدوج في مجلة Prometheus Post الأكاديمية.",
};

export default async function PrometheusPostPublicationEthicsPage() {
  const setting = await getJournalSetting("publication_ethics");

  // Parse markdown content by major sections (##)
  const rawSections = setting.content
    .split(/\n(?=##\s+)/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl space-y-16 animate-fade-in">
      
      {/* Dynamic Header */}
      <SectionHeader
        badgeText="سياسات ومعايير النشر"
        title="أخلاقيات النشر"
        highlightedTitle="والنزاهة العلمية"
        description="المعايير المنهجية وقواعد التحكيم والأمانة العلمية المعتمدة في مجلة Prometheus Post الأكاديمية."
      />

      {/* Main Ethos Card */}
      <Card className="p-8 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-[#E84A0C] font-mono text-xs">
          <Sparkles className="w-4 h-4" />
          <span>ميثاق النزاهة والشفافية التحريرية</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-white">
          {setting.title}
        </h2>
        <p className="text-xs text-[#6B7280] font-mono">
          تم التحديث بتاريخ: {new Date(setting.updatedAt).toLocaleDateString("ar-SA")}
        </p>
      </Card>

      {/* Structured Policy Sections */}
      <div className="space-y-6">
        {rawSections.map((sectionText, idx) => {
          const lines = sectionText.split("\n").map((l) => l.trim()).filter(Boolean);
          const headerLine = lines[0]?.replace(/^##\s*/, "") || `القسم ${idx + 1}`;
          const bodyLines = lines.slice(1);

          return (
            <Card
              key={idx}
              className="p-6 sm:p-8 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-sm hover:border-[#E84A0C]/40 transition-all"
            >
              <div className="flex items-center gap-3 border-b border-[#6B7280]/20 pb-4">
                <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 text-[#E84A0C]">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {headerLine}
                </h3>
              </div>

              <div className="space-y-3 pt-2">
                {bodyLines.map((line, i) => {
                  const isBullet = line.startsWith("- ") || line.startsWith("* ");
                  const cleanText = line.replace(/^[-*]\s*/, "");

                  if (isBullet) {
                    return (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#E84A0C] shrink-0 mt-0.5" />
                        <span>{cleanText}</span>
                      </div>
                    );
                  }

                  return (
                    <p key={i} className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-sans">
                      {cleanText}
                    </p>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
