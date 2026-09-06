"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const getInitials = (name?: string | null): string => {
  const trimmed = name?.trim() || "";
  if (!trimmed) return "P";
  const parts = trimmed.split(/\s+/);
  return parts.length === 1 
    ? parts[0].slice(0, 2).toUpperCase() 
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "custom";
  shape?: "circle" | "rounded";
  className?: string;
}

const sizeVariants = {
  xs: "w-8 h-8 text-xs",
  sm: "w-10 h-10 text-sm",
  md: "w-16 h-16 text-xl",
  lg: "w-24 h-24 text-2xl",
  xl: "w-32 h-32 text-3xl",
  custom: "",
};

export function Avatar({
  src,
  name,
  alt,
  size = "md",
  shape = "circle",
  className,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const hasImage = Boolean(
    src &&
    typeof src === "string" &&
    src.trim().length > 0 &&
    !src.startsWith("blob:") &&
    !imageError
  );

  const initials = getInitials(name);
  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded-2xl";
  const variantSizeClass = sizeVariants[size];

  if (!hasImage) {
    return (
      <div
        key={`avatar-fallback-${name || "anonymous"}`}
        aria-label={alt || name || "User Avatar"}
        className={cn(
          "bg-slate-800 text-amber-400 font-bold flex items-center justify-center select-none shadow-md shrink-0 border border-white/10",
          shapeClasses,
          variantSizeClass,
          className
        )}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      key={`avatar-img-${src}`}
      className={cn(
        "relative overflow-hidden bg-slate-800 border border-[#1E293B] shrink-0 shadow-md",
        shapeClasses,
        variantSizeClass,
        className
      )}
    >
      <img
        src={src!}
        alt={alt || name || "Avatar"}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export const MemberAvatar = Avatar;
