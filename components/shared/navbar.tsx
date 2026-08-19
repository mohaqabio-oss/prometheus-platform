"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Menu, X, Shield, ArrowLeft } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full border-b border-brand-dark-800 bg-background/90 dark:bg-brand-dark-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center p-1 rounded-lg bg-brand-dark-900 border border-brand-dark-700 group-hover:border-brand-orange/60 transition-colors">
            <Image
              src="/logo.svg"
              alt="فريق بروميثيوس التطوعي"
              width={32}
              height={32}
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-widest text-foreground dark:text-white leading-none">
              بروميثيوس
            </span>
            <span className="text-[9px] font-mono tracking-wider text-brand-orange uppercase mt-0.5">
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
                  "transition-colors hover:text-white font-sans",
                  isActive ? "text-brand-orange font-semibold" : "text-brand-gray-300"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-brand-dark-700 text-brand-gray-300 hover:text-white hover:border-brand-orange/40 text-xs"
            >
              <Shield className="w-3.5 h-3.5 text-brand-orange" />
              <span>دخول الكادر</span>
            </Button>
          </Link>

          <Link href="/join-us">
            <Button size="sm" className="text-xs">
              تقديم طلب انضمام
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-gray-300 hover:text-white"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-dark-800 bg-brand-dark-900/95 backdrop-blur-lg px-4 py-6 space-y-4 animate-fade-in">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-brand-gray-300 hover:text-brand-orange py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-brand-dark-800 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full justify-center gap-2 text-xs">
                <Shield className="w-3.5 h-3.5 text-brand-orange" />
                <span>دخول الكادر</span>
              </Button>
            </Link>
            <Link href="/join-us" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full text-xs">
                تقديم طلب انضمام
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
