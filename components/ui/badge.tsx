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
          "bg-accent/10 text-accent border border-accent/30":
            variant === "accent" || variant === "orange" || variant === "default",
          "bg-highlight/15 text-amber-700 dark:text-highlight border border-highlight/30":
            variant === "highlight",
          "bg-secondary/10 text-secondary dark:text-white border border-secondary/30":
            variant === "secondary",
          "border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral dark:text-neutral-300":
            variant === "outline",
          "bg-neutral-800 text-white border border-neutral-700":
            variant === "dark",
        },
        className
      )}
      {...props}
    />
  );
}
