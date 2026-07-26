import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "cyan" | "outline" | "success" | "warning" | "danger";
  status?: string;
}

export function Badge({ className, variant, status, children, ...props }: BadgeProps) {
  let effectiveVariant = variant || "default";
  if (!variant && status) {
    const s = status.toUpperCase();
    if (s === "CRITICAL" || s === "DANGER" || s === "ERROR") effectiveVariant = "danger";
    else if (s === "WARNING") effectiveVariant = "warning";
    else if (s === "SUCCESS" || s === "NORMAL" || s === "OK") effectiveVariant = "success";
    else effectiveVariant = "default";
  }

  const variants = {
    default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    cyan: "bg-zinc-800/80 text-zinc-200 border-zinc-700/60",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    outline: "bg-transparent text-zinc-400 border-zinc-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-sans font-semibold border rounded-md transition-colors",
        variants[effectiveVariant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
