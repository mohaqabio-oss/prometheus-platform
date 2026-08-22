import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean; specMargin?: boolean }
>(({ className, hoverable = true, specMargin = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-[#1E293B] bg-[#141C2F] text-[#F8FAFC] shadow-sm p-6 relative overflow-hidden transition-all duration-300",
      specMargin && "border-r-4 border-r-[#D49B4B]",
      hoverable && "hover:shadow-[0_12px_32px_-8px_rgba(212,155,75,0.15)] hover:border-[#D49B4B]/50 hover:-translate-y-0.5",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-serif text-xl font-bold leading-tight tracking-tight text-[#F8FAFC]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#94A3B8] leading-relaxed font-sans", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-[#1E293B] mt-4 text-xs text-[#94A3B8] font-mono", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
