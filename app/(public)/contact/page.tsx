import React from "react";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Send, MessageSquare, BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "اتصل بنا والاستفسارات الأكاديمية | مجلة بروميثيوس",
  description:
    "تواصل مع الهيئة التحريرية لمجلة وفريق بروميثيوس للاستفسارات عن الترقيم الدولي ISSN، إيداع المقالات، والرعاية.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl space-y-16 animate-fade-in">
      
      {/* Header */}
      <SectionHeader
        badgeText="التواصل والاستفسارات الأكاديمية"
        title="تواصل مع الهيئة التحريرية"
        highlightedTitle="وإدارة المنصة"
        description="نرحب باستفسارات الباحثين والمؤسسات الأكاديمية بشأن النشر، معايير ISSN، والانضمام للكوادر التطوعية."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-6">
            <div className="space-y-2">
              <Badge variant="orange">المكتب التحريري الرسمى</Badge>
              <h3 className="font-display text-xl font-bold text-white">
                معلومات الاتصال والإيداع
              </h3>
              <p className="text-xs text-[#6B7280]">
                فريق ومجلة بروميثيوس التطوعية - قسم النشر الأكاديمي والبحوث.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-xs font-sans">
                <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-[#E84A0C]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">البريد الإلكتروني للتحرير</p>
                  <p className="text-[#6B7280] font-mono mt-0.5">editorial@prometheus-voluntary.org</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs font-sans">
                <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-[#F5A623]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">معايير الترقيم الدولي</p>
                  <p className="text-[#6B7280] font-mono mt-0.5">ISSN Online Registration (Pending Final Certification)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs font-sans">
                <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-[#E84A0C]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">ساعات استقبال الاستفسارات</p>
                  <p className="text-[#6B7280] font-mono mt-0.5">الأحد - الخميس (9:00 ص - 5:00 م)</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="p-8 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-white">
                إرسال رسالة مباشرة للهيئة التحريرية
              </h3>
              <p className="text-xs text-[#6B7280]">
                املأ النموذج وسنقوم بالرد عليك في غضون 48 ساعة عمل.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#6B7280] font-sans">الاسم الكامل</label>
                  <Input placeholder="الاسم الثلاثي..." className="text-xs" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#6B7280] font-sans">البريد الإلكتروني</label>
                  <Input type="email" placeholder="name@example.com" className="text-xs font-mono" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#6B7280] font-sans">موضوع الاستفسار</label>
                <Input placeholder="مثال: استفسار عن تحكيم ورقة بحثية..." className="text-xs" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#6B7280] font-sans">تفاصيل الرسالة</label>
                <textarea
                  rows={5}
                  placeholder="اكتب تفاصيل الرسالة الأكاديمية أو الاستفسار المباشر..."
                  className="w-full rounded-md border border-[#6B7280]/30 bg-[#0D0D0D] p-3 text-xs text-white placeholder:text-[#6B7280] focus:border-[#E84A0C] focus:outline-none font-sans"
                  required
                />
              </div>

              <Button type="button" className="w-full gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl py-3 text-xs font-bold">
                <Send className="w-4 h-4" />
                <span>إرسال الرسالة للهيئة التحريرية</span>
              </Button>
            </form>
          </Card>
        </div>

      </div>

    </div>
  );
}
