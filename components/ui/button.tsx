import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E84A0C] disabled:pointer-events-none disabled:opacity-50 rounded-xl cursor-pointer select-none",
          {
            "bg-[#E84A0C] text-white hover:bg-[#D03E06] shadow-md shadow-[#E84A0C]/20 active:scale-[0.98]":
              variant === "default",
            "border border-[#6B7280]/30 bg-transparent text-white hover:border-[#E84A0C] hover:text-[#E84A0C] shadow-sm":
              variant === "outline",
            "bg-[#1A2B4A] text-white hover:bg-[#121A2B] border border-[#6B7280]/30 shadow-sm active:scale-[0.98]":
              variant === "secondary",
            "bg-transparent text-white hover:bg-[#0D0D0D] hover:text-[#E84A0C]":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 shadow-sm":
              variant === "destructive",
            "bg-transparent text-[#E84A0C] hover:underline p-0 h-auto":
              variant === "link",
          },
          {
            "h-8 px-3 text-xs gap-1.5": size === "sm",
            "h-10 px-4 text-sm gap-2": size === "md",
            "h-12 px-6 text-base gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
