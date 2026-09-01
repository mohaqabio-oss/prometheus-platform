import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ShieldCheck, FileText, Mail, ArrowUpRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademicJournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#080C16] text-[#F8FAFC] selection:bg-[#E84A0C] selection:text-white font-sans">
      
      {/* Top Academic Sub-header Bar */}
      <div className="w-full bg-[#05080F] border-b border-white/5 py-2 px-4 text-[11px] font-mono text-stone-400">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#E84A0C] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#E84A0C] animate-pulse" />
              مجلة بروميثيوس الأكاديمية المحكمة
            </span>
            <span className="text-stone-600">|</span>
            <span>ISSN: 2958-8421 (Online)</span>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Open Access • CC BY 4.0</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://pmthiq.online"
              className="hover:text-white transition-colors flex items-center gap-1 text-stone-400"
            >
              <span>المنصة الرئيسية للفريق</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Journal Masthead Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080C16]/90 backdrop-blur-xl shadow-2xl">
        <div className="container mx-auto max-w-6xl flex h-20 items-center justify-between px-4 sm:px-6">
          
          {/* Journal Branding */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative flex items-center justify-center p-2 rounded-xl bg-[#0D1322] border border-white/15 group-hover:border-[#E84A0C] shadow-lg transition-all duration-300">
              <Image
                src="/logo-dark.PNG"
                alt="مجلة بروميثيوس الأكاديمية"
                width={36}
                height={36}
                className="w-8 h-8 object-contain group-hover:scale-105 transition-all"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-['Playfair_Display',serif] text-lg sm:text-xl font-bold tracking-tight text-white leading-none">
                THE PROMETHEUS POST
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#E84A0C] uppercase mt-1 font-semibold">
                المجلة الأكاديمية والبحوث المحكمة
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            <Link
              href="/"
              className="text-stone-300 hover:text-[#E84A0C] transition-colors py-1 font-sans"
            >
              الرئيسية
            </Link>
            <Link
              href="/articles"
              className="text-stone-300 hover:text-[#E84A0C] transition-colors py-1 font-sans"
            >
              الأرشيف والأوراق البحثية
            </Link>
            <Link
              href="/editorial-board"
              className="text-stone-300 hover:text-[#E84A0C] transition-colors py-1 font-sans"
            >
              الهيئة التحريرية
            </Link>
            <Link
              href="/publication-ethics"
              className="text-stone-300 hover:text-[#E84A0C] transition-colors py-1 font-sans"
            >
              أخلاقيات النشر
            </Link>
            <Link
              href="/contact"
              className="text-stone-300 hover:text-[#E84A0C] transition-colors py-1 font-sans"
            >
              تواصل مع التحرير
            </Link>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link href="/contact">
              <Button
                size="sm"
                className="gap-2 text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-lg transition-all"
              >
                <span>تقديم ورقة بحثية</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* Main Journal Content Area */}
      <main className="flex-1">{children}</main>

      {/* Dedicated Journal Footer */}
      <footer className="border-t border-white/10 bg-[#05080F] text-stone-400 py-12 px-4 sm:px-6 mt-20">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-dark.PNG"
                  alt="مجلة بروميثيوس"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
                <span className="font-['Playfair_Display',serif] text-base font-bold text-white">
                  THE PROMETHEUS POST
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed max-w-md font-sans">
                مجلة علمية أكاديمية دورية مفتوحة المصدر تعنى بنشر الأوراق والبحوث المنهجية والمراجعات التقنية المحكمة بإشراف هيئة تحريرية متخصصة.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider">
                سياسات المجلة
              </h4>
              <ul className="space-y-2 font-sans">
                <li>
                  <Link href="/publication-ethics" className="hover:text-[#E84A0C] transition-colors">
                    التحكيم الأكاديمي المزدوج
                  </Link>
                </li>
                <li>
                  <Link href="/publication-ethics" className="hover:text-[#E84A0C] transition-colors">
                    ترخيص الوصول الحر (CC BY 4.0)
                  </Link>
                </li>
                <li>
                  <Link href="/editorial-board" className="hover:text-[#E84A0C] transition-colors">
                    أعضاء هيئة التحرير
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider">
                المكتب التحريري
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                قسم النشر والتحكيم الأكاديمي
              </p>
              <p className="text-xs font-mono text-[#E84A0C]">
                editorial@prometheus-voluntary.org
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-stone-500 gap-4">
            <p>© {new Date().getFullYear()} مجلة بروميثيوس الأكاديمية. جميع الأبحاث خاضعة لترخيص المشاع الإبداعي CC BY 4.0.</p>
            <a href="https://pmthiq.online" className="text-stone-400 hover:text-white transition-colors">
              العودة للمنصة الأم pmthiq.online ←
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
