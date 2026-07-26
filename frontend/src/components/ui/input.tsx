import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full font-sans text-xs">
        {label && (
          <label className="block text-zinc-300 mb-1.5 font-medium text-xs">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-industrial-bg text-industrial-text border border-industrial-border px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500/80 rounded-lg placeholder:text-industrial-muted font-sans transition-all",
            error && "border-red-500/80 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-[11px] text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
