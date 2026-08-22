import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  title: string;
  highlightedTitle?: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}

export function SectionHeader({
  badgeText,
  title,
  highlightedTitle,
  description,
  align = "left",
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className
      )}
      {...props}
    >
      <div className={cn("space-y-3 max-w-2xl", align === "center" && "mx-auto")}>
        {badgeText && (
          <Badge variant="amber" className="mb-2">
            {badgeText}
          </Badge>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#F8FAFC]">
          {title}{" "}
          {highlightedTitle && (
            <span className="text-[#D49B4B]">{highlightedTitle}</span>
          )}
        </h2>
        {description && (
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed font-sans">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
