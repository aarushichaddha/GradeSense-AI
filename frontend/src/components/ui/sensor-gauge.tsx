import React from "react";
import { cn } from "@/lib/utils";
import { StatusLevel } from "@/types";

interface SensorGaugeProps {
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  status?: StatusLevel;
}

export function SensorGauge({ title, value, min, max, unit, status = "NORMAL" }: SensorGaugeProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const barColor = {
    NORMAL: "bg-emerald-500",
    WARNING: "bg-amber-500",
    CRITICAL: "bg-red-500 animate-pulse",
    STANDBY: "bg-slate-400",
  };

  return (
    <div className="bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] rounded-xl p-3.5 font-mono shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 font-sans font-semibold">
        <span className="text-slate-800 dark:text-slate-200 font-bold">{title}</span>
        <span className="text-slate-900 dark:text-slate-100 font-bold font-mono bg-slate-100 dark:bg-[#141c30] px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#1e2945]">
          {value} {unit}
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-2.5 w-full bg-slate-100 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-full relative overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", barColor[status])}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
        <span>MIN: {min}</span>
        <span>MAX: {max}</span>
      </div>
    </div>
  );
}
