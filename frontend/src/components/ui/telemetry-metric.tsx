import React from "react";
import { cn } from "@/lib/utils";
import { StatusLevel } from "@/types";

interface TelemetryMetricProps {
  label: string;
  tag: string;
  value: number | string;
  unit: string;
  target?: number | string;
  status?: StatusLevel;
  className?: string;
}

export function TelemetryMetric({
  label,
  tag,
  value,
  unit,
  target,
  status = "NORMAL",
  className,
}: TelemetryMetricProps) {
  const statusBorder = {
    NORMAL: "border-emerald-500/40 hover:border-emerald-500",
    WARNING: "border-amber-500/50 hover:border-amber-500 bg-amber-950/10",
    CRITICAL: "border-red-500/70 hover:border-red-500 bg-red-950/20",
    STANDBY: "border-gray-700",
  };

  return (
    <div
      className={cn(
        "p-3 bg-industrial-card border font-mono transition-all relative overflow-hidden",
        statusBorder[status],
        className
      )}
    >
      <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-widest mb-1">
        <span>{label}</span>
        <span className="text-gray-500 text-[9px]">{tag}</span>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span
          className={cn(
            "text-2xl font-bold tracking-tight",
            status === "NORMAL" && "text-emerald-400",
            status === "WARNING" && "text-amber-400",
            status === "CRITICAL" && "text-red-400",
            status === "STANDBY" && "text-gray-300"
          )}
        >
          {value}
        </span>
        <span className="text-xs text-gray-400 uppercase font-semibold">{unit}</span>
      </div>

      {target !== undefined && (
        <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between border-t border-gray-800 pt-1.5">
          <span>SP Target:</span>
          <span className="text-gray-200 font-bold">{target} {unit}</span>
        </div>
      )}
    </div>
  );
}
