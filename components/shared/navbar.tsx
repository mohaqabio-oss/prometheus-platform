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
    { name: "منشورات بروميثيوس", href: "/articles" },
    { name: "فريقنا", href: "/members" },
    { name: "عن الفريق", href: "/#about" },
    { name: "انضم إلينا", href: "/join-us" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#6B7280]/20 bg-[#1A2B4A]/95 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center p-1 rounded-xl bg-[#0D0D0D] border border-[#6B7280]/20 group-hover:border-[#E84A0C]/60 transition-all duration-300">
            <Image
              src="/logo-dark.PNG"
              alt="فريق بروميثيوس التطوعي"
              width={32}
              height={32}
              className="w-8 h-8 object-contain group-hover:scale-105 transition-all duration-300"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-widest text-white leading-none">
              بروميثيوس
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[#E84A0C] uppercase mt-0.5">
              فريق تطوعي
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-all duration-300 font-sans hover:text-[#E84A0C]",
                  isActive
                    ? "text-[#E84A0C] font-semibold"
                    : "text-white/90"
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
              className="gap-2 border-[#6B7280]/30 text-white hover:text-[#E84A0C] hover:border-[#E84A0C]/40 text-xs rounded-xl transition-all duration-300"
            >
              <Shield className="w-3.5 h-3.5 text-[#E84A0C]" />
              <span>دخول الكادر</span>
            </Button>
          </Link>

          <Link href="/join-us">
            <Button size="sm" className="text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-sm transition-all duration-300">
              تقديم طلب انضمام
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#E84A0C] transition-all duration-300"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#6B7280]/20 bg-[#1A2B4A]/98 backdrop-blur-lg px-4 py-6 space-y-4 animate-fade-in">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-[#E84A0C] py-1 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#6B7280]/20 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full justify-center gap-2 text-xs rounded-xl border-[#6B7280]/30 text-white">
                <Shield className="w-3.5 h-3.5 text-[#E84A0C]" />
                <span>دخول الكادر</span>
              </Button>
            </Link>
            <Link href="/join-us" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl">
                تقديم طلب انضمام
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
