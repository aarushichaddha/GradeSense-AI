import React from "react";
import { cn } from "@/lib/utils";
import { StatusLevel } from "@/types";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

interface TelemetryMetricProps {
  label: string;
  tag: string;
  value: number | string;
  unit: string;
  target?: number | string;
  status?: StatusLevel;
  trend?: "up" | "down" | "flat";
  className?: string;
}

export function TelemetryMetric({
  label,
  tag,
  value,
  unit,
  target,
  status = "NORMAL",
  trend = "up",
  className,
}: TelemetryMetricProps) {
  const statusBorder = {
    NORMAL: "border-slate-200 dark:border-[#1e2945] hover:border-emerald-300 dark:hover:border-emerald-500 bg-white dark:bg-[#0e1424] shadow-xs",
    WARNING: "border-amber-200 dark:border-amber-800/80 hover:border-amber-400 bg-amber-50/40 dark:bg-amber-950/30 shadow-xs",
    CRITICAL: "border-red-300 dark:border-red-800/80 hover:border-red-400 bg-red-50/50 dark:bg-red-950/30 shadow-xs animate-pulse",
    STANDBY: "border-slate-200 dark:border-[#1e2945] bg-slate-50 dark:bg-[#0b101d]",
  };

  return (
    <div
      className={cn(
        "p-3.5 border rounded-xl font-mono transition-all duration-200 relative overflow-hidden group",
        statusBorder[status],
        className
      )}
    >
      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
        <span className="font-sans font-bold text-slate-800 dark:text-slate-200 truncate">{label}</span>
        <span className="text-slate-500 dark:text-slate-400 text-[9px] bg-slate-100 dark:bg-[#141c30] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#1e2945] font-mono">{tag}</span>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "text-2xl font-extrabold tracking-tight font-mono",
              status === "NORMAL" && "text-emerald-700 dark:text-emerald-400",
              status === "WARNING" && "text-amber-700 dark:text-amber-400",
              status === "CRITICAL" && "text-red-700 dark:text-red-400",
              status === "STANDBY" && "text-slate-600 dark:text-slate-400"
            )}
          >
            {value}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{unit}</span>
        </div>

        {/* Trend Indicator Icon */}
        <div className="flex items-center gap-1 text-[10px]">
          {trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
          {trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          {trend === "flat" && <Minus className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />}
        </div>
      </div>

      {target !== undefined && (
        <div className="mt-2.5 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-[#1e2945] pt-1.5 font-sans">
          <span>Target Setpoint:</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold font-mono">{target} {unit}</span>
        </div>
      )}
    </div>
  );
}
