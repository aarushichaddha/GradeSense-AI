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
    <div className={cn("inline-flex items-center px-2 py-1 border text-xs font-mono font-semibold uppercase tracking-wider", getStatusColor(status), className)}>
      {showDot && (
        <span
          className={cn(
            "w-2 h-2 rounded-full mr-2",
            status === "NORMAL" && "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
            status === "WARNING" && "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
            status === "CRITICAL" && "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)] animate-ping",
            status === "STANDBY" && "bg-gray-400"
          )}
        />
      )}
      <span>{label || status}</span>
    </div>
  );
}
