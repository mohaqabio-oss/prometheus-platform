import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/app/actions/website-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { prisma } from "@/lib/db/prisma";
import { ShieldCheck, BookOpen, UserCheck, Award, GraduationCap, Globe, ExternalLink } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const ed = settings.pageHeaders.editorialBoard;
  return {
    title: `${ed.title} | مجلة وفريق بروميثيوس`,
    description: ed.subtitle,
  };
}

export default async function EditorialBoardPage() {
  const settings = await getSiteSettings();
  const ed = settings.pageHeaders.editorialBoard;

  let editorialMembers: any[] = [];
  try {
    editorialMembers = await prisma.editorialMember.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "asc" },
      ],
    });
  } catch (e) {
    console.error("Error fetching public editorial members:", e);
  }

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16 animate-fade-in">
      
      {/* Dynamic Header */}
      <SectionHeader
        badgeText={ed.badge || "الهيئة التحريرية والأكاديمية"}
        title={ed.title}
        description={ed.subtitle}
      />

      {/* Editorial Standards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-3 shadow-sm hover:border-[#E84A0C]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#E84A0C]" />
          </div>
          <h3 className="font-display text-base font-bold text-white">التحكيم الأكاديمي المزدوج</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            تخضع جميع الأوراق والمقالات العلمية المقدمة لمراجعة دقيقة من قبل اثنين من المحكمين الأكاديميين المستقلين ضماناً للحيادية والرصانة.
          </p>
        </Card>

        <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-3 shadow-sm hover:border-[#E84A0C]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#F5A623]" />
          </div>
          <h3 className="font-display text-base font-bold text-white">معايير النشر والاعتماد</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            التزام كامل بالهياكل التحريرية والتفهرس الرقمي المعتمد للمجلات والمنشورات العلمية الدورية والتخصصية.
          </p>
        </Card>

        <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-3 shadow-sm hover:border-[#E84A0C]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 flex items-center justify-center">
            <Award className="w-5 h-5 text-[#E84A0C]" />
          </div>
          <h3 className="font-display text-base font-bold text-white">الوصول الحر والشفافية</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            نشر مفتوح المصدر (Open Access) بتراخيص المشاع الإبداعي لدعم نشر المعرفة التقنية والأكاديمية بدون قيود.
          </p>
        </Card>
      </div>

      {/* Dynamic Editorial Board Members Grid */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[#6B7280]/20 pb-4">
          <UserCheck className="w-5 h-5 text-[#E84A0C]" />
          <h2 className="font-display text-xl font-bold text-white">أعضاء هيئة التحرير والمحكمون المعتمدون</h2>
        </div>

        {editorialMembers.length === 0 ? (
          <Card className="p-12 text-center bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4">
            <GraduationCap className="w-12 h-12 text-[#E84A0C] mx-auto opacity-80" />
            <h3 className="font-display text-lg font-bold text-white">سجل هيئة التحرير قيد التحديث الرقمي</h3>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
              يتم تحديث قائمة المحكمين الدوليين ورؤساء الأقسام الأكاديمية حالياً عبر لوحة التحكم المركزية.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editorialMembers.map((member) => (
              <Card
                key={member.id}
                className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:border-[#E84A0C]/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <Avatar src={member.avatarUrl} name={member.fullName} size="lg" />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-display text-lg font-bold text-white">
                        {member.fullName}
                      </h3>
                      {member.academicRank && (
                        <Badge variant="orange" className="text-[10px]">
                          {member.academicRank}
                        </Badge>
                      )}
                    </div>

                    {member.university && (
                      <p className="text-xs font-mono text-[#E84A0C] flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                        <span>{member.university}</span>
                      </p>
                    )}

                    {member.specialty && (
                      <p className="text-[11px] font-mono text-[#6B7280] flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>التخصص: {member.specialty}</span>
                      </p>
                    )}
                  </div>
                </div>

                {member.bio && (
                  <p className="text-xs text-[#6B7280] leading-relaxed border-t border-[#6B7280]/20 pt-4 font-sans">
                    {member.bio}
                  </p>
                )}

                {member.orcidUrl && (
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={member.orcidUrl}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E84A0C] hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>الملف الأكاديمي / ORCID</span>
                      <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                    </Link>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
