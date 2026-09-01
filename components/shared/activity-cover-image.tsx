"use client";

import React, { useState } from "react";
import { GraduationCap, Sparkles } from "lucide-react";

interface ActivityCoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  type?: string;
}

export function ActivityCoverImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "aspect-video w-full rounded-xl overflow-hidden bg-[#080C16] border border-[#1E293B] relative",
  type,
}: ActivityCoverImageProps) {
  const [hasError, setHasError] = useState(false);

  // If no source or failed to load, render stylish fallback
  if (!src || hasError) {
    return (
      <div
        className={`${containerClassName} flex flex-col items-center justify-center bg-gradient-to-br from-[#080C16] via-[#0D1322] to-[#1A2B4A]/40 text-center p-4`}
      >
        <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/10 border border-[#E84A0C]/30 text-[#E84A0C] flex items-center justify-center mb-2 shadow-sm">
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-mono text-stone-400 font-medium line-clamp-1">
          {type || "برنامج تدريبي"}
        </span>
        <span className="text-[10px] text-stone-500 font-sans mt-0.5">
          فريق بروميثيوس التطوعي
        </span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className={className}
        loading="lazy"
      />
    </div>
  );
}
