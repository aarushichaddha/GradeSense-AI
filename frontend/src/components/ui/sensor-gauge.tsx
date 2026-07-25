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
    NORMAL: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    WARNING: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    CRITICAL: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse",
    STANDBY: "bg-gray-500",
  };

  return (
    <div className="bg-industrial-card border border-industrial-border p-3 font-mono">
      <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-widest mb-2">
        <span>{title}</span>
        <span className="text-gray-300 font-bold">{value} {unit}</span>
      </div>

      {/* Progress Track */}
      <div className="h-3 w-full bg-gray-950 border border-gray-800 relative overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", barColor[status])}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[9px] text-gray-500 mt-1">
        <span>MIN: {min}</span>
        <span>MAX: {max}</span>
      </div>
    </div>
  );
}
