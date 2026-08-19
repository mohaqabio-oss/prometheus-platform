import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "orange" | "highlight" | "secondary" | "outline" | "dark";
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
          "bg-[#E84A0C]/15 text-[#E84A0C] border border-[#E84A0C]/30":
            variant === "accent" || variant === "orange" || variant === "default",
          "bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30":
            variant === "highlight",
          "bg-[#1A2B4A] text-white border border-[#6B7280]/30":
            variant === "secondary",
          "border border-[#6B7280]/30 bg-transparent text-[#6B7280]":
            variant === "outline",
          "bg-[#0D0D0D] text-white border border-[#6B7280]/30":
            variant === "dark",
        },
        className
      )}
      {...props}
    />
  );
}
