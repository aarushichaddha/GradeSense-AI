import React from "react";
import { cn, getStatusColor } from "@/lib/utils";
import { StatusLevel } from "@/types";

interface StatusIndicatorProps {
  status: StatusLevel;
  label?: string;
  className?: string;
  showDot?: boolean;
}

export function StatusIndicator({ status, label, className, showDot = true }: StatusIndicatorProps) {
  return (
    <div className={cn("inline-flex items-center px-3 py-1 border text-xs font-mono font-bold uppercase tracking-wider rounded-full shadow-2xs", getStatusColor(status), className)}>
      {showDot && (
        <span
          className={cn(
            "w-2 h-2 rounded-full mr-2",
            status === "NORMAL" && "bg-emerald-600 dark:bg-emerald-400 animate-pulse",
            status === "WARNING" && "bg-amber-600 dark:bg-amber-400 animate-pulse",
            status === "CRITICAL" && "bg-red-600 dark:bg-red-400 animate-ping",
            status === "STANDBY" && "bg-slate-500 dark:bg-slate-400"
          )}
        />
      )}
      <span>{label || status}</span>
    </div>
  );
}
