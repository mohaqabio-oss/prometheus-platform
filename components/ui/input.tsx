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
          "flex h-10 w-full rounded-md border border-brand-dark-800 bg-brand-dark-950 px-3 py-2 text-xs text-white placeholder:text-brand-gray-500 focus:border-brand-orange focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-sans transition-colors",
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
