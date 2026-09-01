"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

interface HeroSectionProps {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  isSpecsEnabled: boolean;
  academicSpecs: any;
}

export function HeroSection({
  heroBadge,
  heroSubtitle,
}: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-grid-pattern border-b border-[#1E293B]">
      
      {/* Huge Glowing Ambient Radial Orbs behind container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#E84A0C]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl relative z-10">
        
        {/* 3D Floating Glassmorphism Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: [0, -15, 0] }}
          transition={{
            y: {
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            opacity: { duration: 0.8 },
          }}
          className="relative backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden text-center space-y-8"
        >
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E84A0C]/40 bg-[#E84A0C]/10 px-4 py-1.5 text-xs font-mono text-[#E84A0C] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E84A0C]" />
            <span>{heroBadge}</span>
          </div>

          {/* Prominent Large Prometheus Logo */}
          <div className="flex justify-center my-2">
            <div className="relative p-4 sm:p-6 rounded-3xl bg-[#0D1322]/90 border border-white/15 shadow-2xl backdrop-blur-xl group hover:border-[#E84A0C]/60 transition-all duration-500">
              <Image
                src="/logo-dark.PNG"
                alt="Prometheus Logo"
                width={120}
                height={120}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain filter drop-shadow-[0_10px_25px_rgba(232,74,12,0.35)] group-hover:scale-105 transition-all duration-500"
                priority
              />
            </div>
          </div>

          {/* MASSIVE BRANDING SLOGAN */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-serif font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[1.1] bg-gradient-to-r from-amber-100 via-amber-300 via-orange-400 to-white bg-clip-text text-transparent drop-shadow-sm">
              Prometheus, the vision of youth, the mindset of scientists
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-[#94A3B8] leading-relaxed font-sans max-w-2xl mx-auto font-normal pt-2">
              {heroSubtitle || "رؤية الشباب بأسلوب وشغف العلماء — منصة بروميثيوس العلمية والتطوعية للبحث والابتكار."}
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/activities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold bg-[#E84A0C] hover:bg-[#d03e06] text-white rounded-xl shadow-xl transition-all duration-300 h-12 px-6"
            >
              <span>تصفح أنشطة ودورات بروميثيوس</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/join-us"
              className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-medium border border-white/15 bg-white/5 text-white hover:text-[#E84A0C] hover:border-[#E84A0C]/50 rounded-xl transition-all duration-300 h-12 px-6 backdrop-blur-md"
            >
              <span>تقديم طلب انضمام</span>
            </Link>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
