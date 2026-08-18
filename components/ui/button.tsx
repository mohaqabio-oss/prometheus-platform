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
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange disabled:pointer-events-none disabled:opacity-50 rounded-md cursor-pointer select-none",
          {
            "bg-brand-orange text-white hover:bg-brand-orange-600 shadow-md shadow-brand-orange/10 active:scale-[0.98]":
              variant === "default",
            "border border-brand-dark-800 bg-transparent text-foreground hover:bg-brand-dark-900 hover:border-brand-orange/40 hover:text-white":
              variant === "outline",
            "bg-brand-dark-850 text-foreground hover:bg-brand-dark-800 border border-brand-dark-800 hover:text-white":
              variant === "secondary",
            "bg-transparent hover:bg-brand-dark-900 text-brand-gray-300 hover:text-white":
              variant === "ghost",
            "bg-red-600/90 text-white hover:bg-red-600":
              variant === "destructive",
            "bg-transparent text-brand-orange hover:underline p-0 h-auto":
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
