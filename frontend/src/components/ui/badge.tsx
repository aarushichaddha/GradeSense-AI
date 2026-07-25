import * as React from "react";
import { cn, getStatusBadgeColor } from "@/lib/utils";
import { StatusLevel } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusLevel;
  variant?: "default" | "cyan" | "outline" | "violet";
}

export function Badge({ className, status, variant = "default", children, ...props }: BadgeProps) {
  if (status) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border rounded-full shadow-2xs",
          getStatusBadgeColor(status),
          className
        )}
        {...props}
      >
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />
        {children || status}
      </span>
    );
  }

  const variants = {
    default: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 shadow-2xs font-bold",
    cyan: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 shadow-2xs font-bold",
    violet: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 shadow-2xs font-bold",
    outline: "bg-white dark:bg-[#0e1424] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#1e2945] font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border rounded-full shadow-2xs",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
