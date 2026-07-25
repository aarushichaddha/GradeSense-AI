import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full font-mono text-xs">
        {label && (
          <label className="block uppercase font-sans font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-wider text-[10px]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-white dark:bg-[#0e1424] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#1e2945] px-3.5 py-2 text-xs focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 rounded-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-2xs font-sans font-medium",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-[10px] text-red-600 dark:text-red-400 font-sans">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
