import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/app/actions/website-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { prisma } from "@/lib/db/prisma";
import { ShieldCheck, BookOpen, UserCheck, Award } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const ed = settings.pageHeaders.editorialBoard;
  return {
    title: `${ed.title} | فريق ومجلة بروميثيوس`,
    description: ed.subtitle,
  };
}

interface EditorialMember {
  id: string;
  fullName: string;
  title: string;
  departmentName: string;
  bio: string;
  roleBadge: string;
  avatarUrl?: string;
}

const DEFAULT_EDITORIAL_BOARD: EditorialMember[] = [
  {
    id: "ed-1",
    fullName: "د. أسامة بن عبد الله",
    title: "رئيس الهيئة التحريرية ورئيس التحرير",
    departmentName: "البحث العلمي والتحليل",
    bio: "دكتوراه في علوم الحاسوب والهندسة البرمجية. مشرف على تقييم البحوث والأوراق المنشورة واعتماد النشر الأكاديمي.",
    roleBadge: "رئيس التحرير",
    avatarUrl: undefined,
  },
  {
    id: "ed-2",
    fullName: "م. سارة المحمود",
    title: "مديرة قسم الهندسة والتطوير التقني",
    departmentName: "الهندسة البرمجية والتطوير",
    bio: "ممرسة وباحثة في برمجيات الذكاء الاصطناعي والأنظمة الموزعة. تعنى بمراجعة المقالات المنهجية البرمجية.",
    roleBadge: "محرر تخصصي - هندسة برمجية",
    avatarUrl: undefined,
  },
  {
    id: "ed-3",
    fullName: "أ. علي الحسيني",
    title: "مسؤول المراجعة والتدقيق اللغوي",
    departmentName: "التعليم وصناعة المحتوى",
    bio: "ماجستير في اللغويات والتواصل الأكاديمي. مشرف على ضبط الصياغة وتنسيق الأوراق المعتمدة.",
    roleBadge: "محرر لغوي وأكاديمي",
    avatarUrl: undefined,
  },
  {
    id: "ed-4",
    fullName: "م. أحمد الزهراني",
    title: "مستشار التحكيم والنشر الرقمي",
    departmentName: "البحث العلمي والتحليل",
    bio: "متخصص في أمن المعلومات والأوراق البحثية المفتوحة المصدر.",
    roleBadge: "محكّم أكاديمي",
    avatarUrl: undefined,
  },
];

export default async function EditorialBoardPage() {
  const settings = await getSiteSettings();
  const ed = settings.pageHeaders.editorialBoard;

  let editorialMembers = DEFAULT_EDITORIAL_BOARD;

  try {
    const dbMembers = await prisma.member.findMany({
      where: {
        status: "ACTIVE",
      },
      take: 12,
      orderBy: { joinDate: "asc" },
    });

    if (dbMembers.length > 0) {
      editorialMembers = dbMembers.map((m, index) => ({
        id: m.id,
        fullName: m.fullName,
        title: m.title || "عضو الهيئة التحريرية",
        departmentName: m.departmentName || "البحث والتحرير",
        bio: m.bio || "عضو فاعل ومحكّم في الهيئة التحريرية لمجلة بروميثيوس التطوعية.",
        roleBadge: index === 0 ? "رئيس التحرير" : index % 2 === 0 ? "محرر أكاديمي" : "محكّم مستشار",
        avatarUrl: m.avatarUrl || m.profileImage || undefined,
      }));
    }
  } catch (e) {}

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16 animate-fade-in">
      
      {/* Dynamic Header */}
      <SectionHeader
        badgeText={ed.badge || "الهيئة التحريرية"}
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
            تخضع جميع الأوراق والمقالات العلمية المقدمة لمراجعة دقيقة من قبل اثنين من المحكمين المستقلين ضماناً للحيادية والرصانة.
          </p>
        </Card>

        <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-3 shadow-sm hover:border-[#E84A0C]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#F5A623]" />
          </div>
          <h3 className="font-display text-base font-bold text-white">معايير النشر والأكاديميا</h3>
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
            نشر مفتوح المصدر (Open Access) بتراخيص المشاع الإبداعي لدعم نشر المعرفة التقنية بدون قيود.
          </p>
        </Card>
      </div>

      {/* Members Grid */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[#6B7280]/20 pb-4">
          <UserCheck className="w-5 h-5 text-[#E84A0C]" />
          <h2 className="font-display text-xl font-bold text-white">أعضاء هيئة التحرير والمراجعة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {editorialMembers.map((member) => (
            <Card
              key={member.id}
              className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:border-[#E84A0C]/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <Avatar src={member.avatarUrl} name={member.fullName} size="lg" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg font-bold text-white">
                      {member.fullName}
                    </h3>
                    <Badge variant="orange">{member.roleBadge}</Badge>
                  </div>
                  <p className="text-xs font-mono text-[#E84A0C]">
                    {member.title}
                  </p>
                  <p className="text-[11px] font-mono text-[#6B7280]">
                    قسم {member.departmentName}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#6B7280] leading-relaxed border-t border-[#6B7280]/20 pt-4">
                {member.bio}
              </p>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
