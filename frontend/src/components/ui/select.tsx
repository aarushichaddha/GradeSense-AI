import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="w-full font-mono text-xs">
        {label && (
          <label className="block uppercase font-sans font-bold text-slate-700 dark:text-slate-300 mb-1.5 tracking-wider text-[10px]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-white dark:bg-[#0e1424] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#1e2945] px-3.5 py-2 text-xs focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 rounded-lg cursor-pointer transition-all shadow-2xs font-sans font-medium",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0e1424] text-slate-800 dark:text-slate-200 font-sans">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";
