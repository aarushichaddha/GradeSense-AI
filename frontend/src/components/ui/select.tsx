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
          <label className="block uppercase text-gray-400 mb-1 tracking-wider text-[10px]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-gray-950 text-gray-100 border border-industrial-border px-3 py-2 text-xs focus:outline-none focus:border-blue-500 rounded-none cursor-pointer",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-gray-900 text-gray-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";
