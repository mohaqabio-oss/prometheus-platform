"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "الأنشطة والدورات", href: "/activities" },
    { name: "المدونة", href: "/blog" },
    { name: "المجلة الأكاديمية", href: "/articles" },
    { name: "الهيئة التحريرية", href: "/editorial-board" },
    { name: "أخلاقيات النشر", href: "/publication-ethics" },
    { name: "فريقنا", href: "/members" },
    { name: "عن الفريق", href: "/#about" },
    { name: "تواصل معنا", href: "/contact" },
    { name: "انضم إلينا", href: "/join-us" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0F1D]/85 backdrop-blur-xl transition-all duration-300 shadow-2xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* Brand Logo & Slogan */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-[#0D1322] border border-white/15 group-hover:border-[#E84A0C]/80 shadow-lg transition-all duration-300">
            <Image
              src="/logo-dark.PNG"
              alt="فريق بروميثيوس التطوعي"
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-all duration-300"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-extrabold tracking-widest text-white leading-none">
              بروميثيوس
            </span>
            <span className="text-[10px] font-mono tracking-wider text-[#E84A0C] uppercase mt-1 font-semibold">
              فريق تطوعي
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-all duration-300 font-sans hover:text-[#E84A0C] py-1 px-2 rounded-lg",
                  isActive
                    ? "text-[#E84A0C] font-semibold bg-white/5 border border-white/10"
                    : "text-stone-300 hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-white/15 bg-white/5 text-white hover:text-[#E84A0C] hover:border-[#E84A0C]/40 text-xs rounded-xl transition-all duration-300 backdrop-blur-md"
            >
              <Shield className="w-3.5 h-3.5 text-[#E84A0C]" />
              <span>دخول الكادر</span>
            </Button>
          </Link>

          <Link href="/join-us">
            <Button size="sm" className="text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
              تقديم طلب انضمام
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#E84A0C] transition-all duration-300 rounded-xl border border-white/10 bg-white/5"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0A0F1D]/98 backdrop-blur-2xl px-6 py-6 space-y-5 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-stone-200 hover:text-[#E84A0C] py-1.5 transition-all duration-300 flex items-center justify-between border-b border-white/5"
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full justify-center gap-2 text-xs rounded-xl border-white/15 bg-white/5 text-white">
                <Shield className="w-3.5 h-3.5 text-[#E84A0C]" />
                <span>دخول الكادر</span>
              </Button>
            </Link>
            <Link href="/join-us" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md">
                تقديم طلب انضمام
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
