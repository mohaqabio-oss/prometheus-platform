import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "orange" | "outline" | "dark";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-full font-mono",
        {
          "bg-brand-orange/15 text-brand-orange border border-brand-orange/30":
            variant === "orange" || variant === "default",
          "border border-brand-dark-800 bg-brand-dark-900/60 text-brand-gray-300":
            variant === "outline",
          "bg-brand-dark-850 text-brand-gray-300 border border-brand-dark-800":
            variant === "dark",
        },
        className
      )}
      {...props}
    />
  );
}
