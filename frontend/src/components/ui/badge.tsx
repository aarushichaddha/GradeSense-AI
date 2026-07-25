import * as React from "react";
import { cn, getStatusBadgeColor } from "@/lib/utils";
import { StatusLevel } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusLevel;
  variant?: "default" | "cyan" | "outline";
}

export function Badge({ className, status, variant = "default", children, ...props }: BadgeProps) {
  if (status) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border rounded-none",
          getStatusBadgeColor(status),
          className
        )}
        {...props}
      >
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
        {children || status}
      </span>
    );
  }

  const variants = {
    default: "bg-blue-900/40 text-blue-300 border-blue-600/40",
    cyan: "bg-cyan-900/40 text-cyan-300 border-cyan-500/40",
    outline: "bg-transparent text-gray-400 border-gray-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border rounded-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
