import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Github, Twitter, Linkedin, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0A0F1D] text-white text-xs transition-all duration-300">
      
      {/* Ambient Glowing Background Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E84A0C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Organization Summary & Brand Slogan */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex p-1.5 items-center justify-center rounded-xl bg-[#0D1322] border border-white/15 shadow-lg">
                <Image
                  src="/logo-dark.PNG"
                  alt="Prometheus Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="font-display text-base font-extrabold tracking-wider text-white">
                بروميثيوس
              </span>
            </Link>

            {/* Brand Slogan */}
            <p className="text-xs font-mono bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent font-semibold">
              "Prometheus, the vision of youth, the mindset of scientists"
            </p>

            <p className="text-stone-400 leading-relaxed font-sans text-xs">
              منظمة تطوعية أكاديمية تهدف لبناء المنصات البرمجية الحديثة، نشر البحوث الأكاديمية المفتوحة المصدر، وتدريب الكوادر الشبابية.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/10 text-stone-400 hover:text-[#E84A0C] hover:border-[#E84A0C]/50 transition-all duration-300 backdrop-blur-md" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/10 text-stone-400 hover:text-[#E84A0C] hover:border-[#E84A0C]/50 transition-all duration-300 backdrop-blur-md" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/10 text-stone-400 hover:text-[#E84A0C] hover:border-[#E84A0C]/50 transition-all duration-300 backdrop-blur-md" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 border border-white/10 text-stone-400 hover:text-[#E84A0C] hover:border-[#E84A0C]/50 transition-all duration-300 backdrop-blur-md" aria-label="Telegram">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <p className="font-mono text-white uppercase tracking-wider text-[11px] font-bold">
              الروابط السريعة
            </p>
            <ul className="space-y-2 text-stone-400 font-sans">
              <li><Link href="/" className="hover:text-[#E84A0C] transition-all duration-300">الرئيسية</Link></li>
              <li><Link href="/activities" className="hover:text-[#E84A0C] transition-all duration-300">الأنشطة والدورات</Link></li>
              <li><Link href="/blog" className="hover:text-[#E84A0C] transition-all duration-300">المدونة العامة</Link></li>
              <li><Link href="/members" className="hover:text-[#E84A0C] transition-all duration-300">فريقنا والتخصصات</Link></li>
              <li><Link href="/join-us" className="hover:text-[#E84A0C] transition-all duration-300">تقديم طلب انضمام</Link></li>
            </ul>
          </div>

          {/* Col 3: Institutional Pillars */}
          <div className="space-y-3">
            <p className="font-mono text-white uppercase tracking-wider text-[11px] font-bold">
              الأقسام التطوعية
            </p>
            <ul className="space-y-2 text-stone-400 font-sans">
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
              <p className="text-stone-400 mt-2 leading-relaxed text-xs">
                بوابة دخول خاصة بأعضاء الكادر الإداري والمحررين لإدارة المحتوى والأعضاء.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/login" className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-[#E84A0C] transition-all duration-300">
                <Shield className="w-3.5 h-3.5 text-[#E84A0C]" />
                <span>دخول الكادر الإداري ←</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 font-mono text-[11px]">
          <span>© 2026 فريق بروميثيوس التطوعي. جميع الحقوق محفوظة.</span>
          <span className="bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent font-bold">
            Prometheus Platform
          </span>
        </div>
      </div>
    </footer>
  );
}
