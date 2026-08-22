import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "amber" | "orange" | "cyan" | "highlight" | "secondary" | "outline" | "dark";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-300 rounded-xl font-mono",
        {
          "bg-[#D49B4B]/15 text-[#D49B4B] border border-[#D49B4B]/35":
            variant === "accent" || variant === "amber" || variant === "orange" || variant === "default",
          "bg-[#0284C7]/15 text-[#0284C7] border border-[#0284C7]/35":
            variant === "cyan" || variant === "highlight",
          "bg-[#141C2F] text-[#F8FAFC] border border-[#1E293B]":
            variant === "secondary",
          "border border-[#1E293B] bg-transparent text-[#94A3B8]":
            variant === "outline",
          "bg-[#0A0F1D] text-[#F8FAFC] border border-[#1E293B]":
            variant === "dark",
        },
        className
      )}
      {...props}
    />
  );
}
