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
          "inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 rounded-xl cursor-pointer select-none",
          {
            "bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/20 active:scale-[0.98]":
              variant === "default",
            "border border-neutral-300 dark:border-neutral-700 bg-transparent text-foreground hover:border-accent hover:text-accent shadow-sm":
              variant === "outline",
            "bg-secondary text-white hover:bg-secondary-hover shadow-sm shadow-secondary/20 active:scale-[0.98]":
              variant === "secondary",
            "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral hover:text-foreground":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 shadow-sm":
              variant === "destructive",
            "bg-transparent text-accent hover:underline p-0 h-auto":
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
