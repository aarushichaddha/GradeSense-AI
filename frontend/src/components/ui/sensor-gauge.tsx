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
    STANDBY: "bg-zinc-500",
  };

  return (
    <div className="bg-industrial-card border border-industrial-border p-4 font-sans rounded-xl">
      <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-2">
        <span className="truncate">{title}</span>
        <span className="text-zinc-100 font-heading font-bold shrink-0 ml-2">{value} {unit}</span>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full bg-industrial-bg border border-industrial-border relative overflow-hidden rounded-full">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", barColor[status])}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-zinc-500 mt-1.5 font-medium">
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
}
