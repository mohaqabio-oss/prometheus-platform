import React from "react";
import type { Metadata } from "next";
import { getEditorialMembers } from "@/app/actions/editorial-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  ShieldCheck,
  BookOpen,
  UserCheck,
  Award,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الهيئة التحريرية والأكاديمية | Prometheus Post",
  description: "أعضاء الهيئة التحريرية والمحكمون المعتمدون في مجلة بروميثيوس الأكاديمية (The Prometheus Post).",
};

export default async function PrometheusPostEditorialBoardPage() {
  const editorialMembers = await getEditorialMembers();

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16 animate-fade-in">
      
      {/* Dynamic Header */}
      <SectionHeader
        badgeText="الهيئة التحريرية والأكاديمية"
        title="أعضاء هيئة تحرير"
        highlightedTitle="مجلة Prometheus Post"
        description="نخبة من الأكاديميين والمحكمين المعتمدين والمشرفين على ضبط الرصانة والنزاهة العلمية للأوراق المنشورة."
      />

      {/* Editorial Standards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-3 shadow-sm hover:border-[#E84A0C]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#E84A0C]" />
          </div>
          <h3 className="font-display text-base font-bold text-white">التحكيم المزدوج التعمية</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            تخضع كافة الأوراق العلمية للتقييم الأكاديمي المستقل لضمان الحيادية والصرامة المنهجية الكاملة.
          </p>
        </Card>

        <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-3 shadow-sm hover:border-[#E84A0C]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#F5A623]" />
          </div>
          <h3 className="font-display text-base font-bold text-white">معايير الفهرسة والتوثيق</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            التزام بمعايير ISSN والترميز الرقمي والتفهرس للمقالات والمراجعات التخصصية.
          </p>
        </Card>

        <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-3 shadow-sm hover:border-[#E84A0C]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 flex items-center justify-center">
            <Award className="w-5 h-5 text-[#E84A0C]" />
          </div>
          <h3 className="font-display text-base font-bold text-white">الوصول الحر والشفافية</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            نشر مفتوح المصدر (Open Access) بترخيص CC BY 4.0 لدعم المحتوى العلمي العربي المفتوح.
          </p>
        </Card>
      </div>

      {/* Dynamic Editorial Board Members Grid */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[#6B7280]/20 pb-4">
          <UserCheck className="w-5 h-5 text-[#E84A0C]" />
          <h2 className="font-display text-xl font-bold text-white">
            قائمة أعضاء هيئة التحرير والمحكمين المعتمدين ({editorialMembers.length})
          </h2>
        </div>

        {editorialMembers.length === 0 ? (
          <Card className="p-12 text-center bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4">
            <GraduationCap className="w-12 h-12 text-[#E84A0C] mx-auto opacity-80" />
            <h3 className="font-display text-lg font-bold text-white">سجل هيئة التحرير قيد التحديث</h3>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
              يمكن لإدارة المجلة إضافة وتعديل أعضاء هيئة التحرير عبر لوحة الإدارة.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editorialMembers.map((member) => {
              const memName = member.name || member.fullName || "عضو هيئة التحرير";
              const memRole = member.role || member.academicRank || "محرر";
              const memInst = member.institution || member.university;

              return (
                <Card
                  key={member.id}
                  className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:border-[#E84A0C]/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <Avatar src={member.avatarUrl} name={memName} size="lg" />
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-display text-lg font-bold text-white">
                          {memName}
                        </h3>
                        <Badge variant="orange" className="text-[10px]">
                          {memRole}
                        </Badge>
                      </div>

                      {memInst && (
                        <p className="text-xs font-mono text-[#E84A0C] flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          <span>{memInst}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-xs text-[#6B7280] leading-relaxed border-t border-[#6B7280]/20 pt-4 font-sans">
                      {member.bio}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
