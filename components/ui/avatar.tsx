"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "P";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  const first = words[0].charAt(0).toUpperCase();
  const last = words[words.length - 1].charAt(0).toUpperCase();
  return `${first} ${last}`;
}

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

  const initials = getInitials(name);
  const isValidUrl =
    typeof src === "string" &&
    src.trim() !== "" &&
    !src.startsWith("blob:") &&
    !imageError;

  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded-2xl";
  const variantSizeClass = sizeVariants[size];

  if (!isValidUrl) {
    return (
      <div
        dir="rtl"
        aria-label={alt || name || "User Avatar"}
        className={cn(
          "bg-gradient-to-br from-[#141C2F] via-[#1A253B] to-[#0A0F1D]",
          "border border-[#D49B4B]/40 text-[#D49B4B]",
          "font-mono font-bold flex items-center justify-center select-none shadow-md shrink-0",
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
      className={cn(
        "relative overflow-hidden bg-[#141C2F] border border-[#1E293B] shrink-0 shadow-md",
        shapeClasses,
        variantSizeClass,
        className
      )}
    >
      <img
        src={src}
        alt={alt || name || "Avatar"}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
