import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Github, Twitter, Linkedin, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#6B7280]/20 bg-[#1A2B4A] text-white text-xs transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Organization Summary */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex p-1 items-center justify-center rounded-xl bg-[#0D0D0D] border border-[#6B7280]/20">
                <Image
                  src="/logo-dark.PNG"
                  alt="Prometheus Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-display text-sm font-bold tracking-wider text-white">
                فريق بروميثيوس التطوعي
              </span>
            </Link>

            <p className="text-[#6B7280] leading-relaxed font-sans text-xs">
              منظمة تطوعية أكاديمية تهدف لبناء المنصات البرمجية الحديثة، نشر البحوث الأكاديمية المفتوحة المصدر، وتدريب الكوادر الشبابية.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-xl bg-[#0D0D0D] border border-[#6B7280]/20 text-[#6B7280] hover:text-[#E84A0C] transition-all duration-300" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-[#0D0D0D] border border-[#6B7280]/20 text-[#6B7280] hover:text-[#E84A0C] transition-all duration-300" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-[#0D0D0D] border border-[#6B7280]/20 text-[#6B7280] hover:text-[#E84A0C] transition-all duration-300" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-[#0D0D0D] border border-[#6B7280]/20 text-[#6B7280] hover:text-[#E84A0C] transition-all duration-300" aria-label="Telegram">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <p className="font-mono text-white uppercase tracking-wider text-[11px] font-bold">
              الروابط السريعة
            </p>
            <ul className="space-y-2 text-[#6B7280] font-sans">
              <li><Link href="/" className="hover:text-[#E84A0C] transition-all duration-300">الرئيسية</Link></li>
              <li><Link href="/articles" className="hover:text-[#E84A0C] transition-all duration-300">منشورات بروميثيوس</Link></li>
              <li><Link href="/members" className="hover:text-[#E84A0C] transition-all duration-300">فريقنا والتخصصات</Link></li>
              <li><Link href="/join-us" className="hover:text-[#E84A0C] transition-all duration-300">تقديم طلب انضمام</Link></li>
            </ul>
          </div>

          {/* Col 3: Institutional Pillars */}
          <div className="space-y-3">
            <p className="font-mono text-white uppercase tracking-wider text-[11px] font-bold">
              الأقسام التطوعية
            </p>
            <ul className="space-y-2 text-[#6B7280] font-sans">
              <li>قسم الهندسة البرمجية والتطوير</li>
              <li>قسم البحث العلمي والتحليل</li>
              <li>قسم التعليم وصناعة المحتوى</li>
              <li>قسم الموارد البشرية والعمليات</li>
            </ul>
          </div>

          {/* Col 4: Staff Authentication Link */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <p className="font-mono text-white uppercase tracking-wider text-[11px] font-bold">
                بوابة الإدارة
              </p>
              <p className="text-[#6B7280] mt-2 leading-relaxed text-xs">
                بوابة دخول خاصة بأعضاء الكادر الإداري والمحررين لإدارة المحتوى والأعضاء.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/login" className="inline-flex items-center gap-2 text-xs font-mono text-[#6B7280] hover:text-[#E84A0C] transition-all duration-300">
                <Shield className="w-3.5 h-3.5 text-[#E84A0C]" />
                <span>دخول الكادر الإداري ←</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-[#6B7280]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#6B7280] font-mono text-[11px]">
          <span>© 2026 فريق بروميثيوس التطوعي. جميع الحقوق محفوظة.</span>
          <span>منصة مؤسسية مفتوحة المصدر</span>
        </div>
      </div>
    </footer>
  );
}
