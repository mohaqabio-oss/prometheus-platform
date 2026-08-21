import React from "react";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ShieldAlert, Scale, CheckCircle2, Lock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "أخلاقيات النشر والمعايير الأكاديمية | مجلة بروميثيوس",
  description:
    "قواعد وسلوكيات النشر الأكاديمي، سياسة منع الانتحال، حقوق الطبع والنشر، وضوابط التحكيم العلمي بمجلة بروميثيوس وفق الترقيم الدولي ISSN.",
};

export default function PublicationEthicsPage() {
  const sections = [
    {
      icon: <Scale className="w-5 h-5 text-[#E84A0C]" />,
      title: "1. مسؤوليات الباحثين والمؤلفين",
      points: [
        "التأكد من أصالة الورقة والبحث وعدم تقديم أعمال منسوخة أو منتحلة بأي صورة.",
        "الإفصاح الكامل عن أي تضارب في المصالح أو جهات تمويل داعمة للبحث.",
        "توثيق كافة المصادر والمراجع المستخدمة وفق قواعد الاقتباس الأكاديمي الصارمة.",
        "الموافقة الجماعية لجميع المشاركين في كتابة البحث قبل إرساله للهيئة التحريرية.",
      ],
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#F5A623]" />,
      title: "2. سياسة التحكيم والمراجعة الأقران (Peer Review)",
      points: [
        "تعتمد المجلة نظام التحكيم المزدوج التعمية (Double-Blind Peer Review) لضمان التجرد التام.",
        "تقييم المقالات بناءً على الرصانة العلمية، الجدة، والوضوح المنهجي فقط دون النظر لخلفية المؤلف.",
        "الحفاظ على السرية التامة للمخطوطات والبحوث أثناء فترة التحكيم والتعديل.",
        "يحظر على المحكمين استخدام نتائج الأبحاث المودعة لأغراض شخصية قبل نشرها رسمياً.",
      ],
    },
    {
      icon: <Lock className="w-5 h-5 text-[#E84A0C]" />,
      title: "3. حقوق النشر والوصول الحر (Open Access & CC BY)",
      points: [
        "جميع المقالات والأبحاث تنشر تحت ترخيص المشاع الإبداعي Creative Commons (CC BY 4.0).",
        "يحتفظ الباحث بحقوق الملكية الفكرية مع منح المجلة حق النشر الأول والرقمي.",
        "يُتاح المحتوى مجاناً وبدون اشتراكات لدعم المحتوى العلمي العربي المفتوح المصدر.",
        "يسمح بإعادة استخدام وتوزيع المادة بشرط العزو الصريح والموثق للمؤلف والمجلة.",
      ],
    },
    {
      icon: <FileText className="w-5 h-5 text-[#F5A623]" />,
      title: "4. سياسة مكافحة الانتحال والنزاهة العلمية",
      points: [
        "تستخدم المجلة برمجيات متقدمة لفحص نسب التشابه والسرقة العلمية قبل إحالة البحث للمحكمين.",
        "أي ورقة تثبت بها نسبة انتحال غير مقبولة تستبعد فوراً من مسار النشر.",
        "في حال اكتشاف خطأ جوهري بعد النشر، تلتزم المجلة بإصدار توضيح أو تصويب رسمي.",
        "تتعامل الهيئة التحريرية بحزم مع أي بلاغات تشكك في نزاهة البيانات أو التجارب المعروضة.",
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl space-y-16 animate-fade-in">
      
      {/* Header */}
      <SectionHeader
        badgeText="سياسات ومعايير ISSN"
        title="أخلاقيات النشر والمعايير"
        highlightedTitle="الأكاديمية"
        description="دليل النزاهة العلمية وقواعد السلوك المهني المعتمدة لدى مجلة بروميثيوس التطوعية لضمان جودة الأبحاث المنشورة."
      />

      {/* Intro Ethos Card */}
      <Card className="p-8 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-[#E84A0C] font-mono text-xs">
          <Sparkles className="w-4 h-4" />
          <span>ميثاق الشفافية العلمية</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-white">
          التزامنا بالمعايير الدولية للنشر العلمي
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
          تلتزم مجلة فريق بروميثيوس بكافة المبادئ التوجيهية الصادرة عن لجنة أخلاقيات النشر (COPE) ومعايير الترقيم الدولي الموحد للدوريات (ISSN). نهدف لبناء منبر عربي موثوق يجمع بين الرصانة الأكاديمية وروح العمل التطوعي المفتوح.
        </p>
      </Card>

      {/* Policy Sections List */}
      <div className="space-y-6">
        {sections.map((sec, idx) => (
          <Card
            key={idx}
            className="p-6 sm:p-8 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-sm hover:border-[#E84A0C]/40 transition-all"
          >
            <div className="flex items-center gap-3 border-b border-[#6B7280]/20 pb-4">
              <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20">
                {sec.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                {sec.title}
              </h3>
            </div>

            <ul className="space-y-3 pt-2">
              {sec.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#6B7280] font-sans">
                  <CheckCircle2 className="w-4 h-4 text-[#E84A0C] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

    </div>
  );
}
