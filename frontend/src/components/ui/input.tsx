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
          <label className="block uppercase text-gray-400 mb-1 tracking-wider text-[10px]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-gray-950 text-gray-100 border border-industrial-border px-3 py-2 text-xs focus:outline-none focus:border-blue-500 rounded-none placeholder:text-gray-600",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-[10px] text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
