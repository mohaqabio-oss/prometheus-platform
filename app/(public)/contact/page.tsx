import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/app/actions/website-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, BookOpen, Clock } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const contact = settings.pageHeaders.contact;
  return {
    title: `${contact.title} | فريق ومجلة بروميثيوس`,
    description: contact.subtitle,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const contact = settings.pageHeaders.contact;

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl space-y-16 animate-fade-in">
      
      {/* Dynamic Header */}
      <SectionHeader
        badgeText={contact.badge || "التواصل والاستفسارات الأكاديمية"}
        title={contact.title}
        description={contact.subtitle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dynamic Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-6 shadow-xl">
            <div className="space-y-2">
              <Badge variant="orange">المكتب التحريري الرسمي</Badge>
              <h3 className="font-display text-xl font-bold text-white">
                معلومات الاتصال والإيداع
              </h3>
              <p className="text-xs text-[#6B7280]">
                {contact.officeInfo || "فريق ومجلة بروميثيوس التطوعية - قسم النشر الأكاديمي والبحوث."}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-xs font-sans">
                <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-[#E84A0C]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">البريد الإلكتروني للتحرير</p>
                  <p className="text-[#6B7280] font-mono mt-0.5">
                    {contact.email || "editorial@prometheus-voluntary.org"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs font-sans">
                <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-[#F5A623]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">قسم النشر والبحوث</p>
                  <p className="text-[#6B7280] font-mono mt-0.5">منصة إيداع المنشورات والأوراق البحثية</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs font-sans">
                <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-[#E84A0C]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">ساعات استقبال الاستفسارات</p>
                  <p className="text-[#6B7280] font-mono mt-0.5">
                    {contact.hours || "الأحد - الخميس (9:00 ص - 5:00 م)"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="p-8 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-6 shadow-xl">
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

              <Button type="button" className="w-full gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl py-3 text-xs font-bold shadow-md">
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
