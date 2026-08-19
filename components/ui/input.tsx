import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[#6B7280]/30 bg-[#0D0D0D] text-white px-3.5 py-2 text-xs placeholder:text-[#6B7280] focus:border-[#E84A0C] focus:ring-1 focus:ring-[#E84A0C] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-sans shadow-sm transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
