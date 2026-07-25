import React from "react";
import { cn } from "@/lib/utils";
import { Cpu, Activity } from "lucide-react";

interface MachineHealthMeterProps {
  healthPercent: number; // e.g. 98.4
  machineCode?: string;
}

export function MachineHealthMeter({ healthPercent, machineCode = "PM-01" }: MachineHealthMeterProps) {
  return (
    <div className="p-4 bg-industrial-card border border-industrial-border font-mono relative overflow-hidden">
      <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-widest mb-1">
        <span className="flex items-center gap-1.5 text-blue-400 font-bold">
          <Cpu className="w-3.5 h-3.5" /> MACHINE HEALTH ({machineCode})
        </span>
        <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
          <Activity className="w-3 h-3 animate-pulse" /> 100% ONLINE
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-3xl font-extrabold tracking-tight text-white">
          {healthPercent}<span className="text-sm font-semibold text-emerald-400">%</span>
        </span>
        <span className="text-[10px] text-gray-400 uppercase">DCS OVERALL EFFECTIVENESS (OEE: 89.2%)</span>
      </div>

      {/* Multi-segment Health Bar */}
      <div className="mt-3 flex gap-1 h-2">
        <div className="flex-1 bg-emerald-500 rounded-none shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        <div className="flex-1 bg-emerald-500 rounded-none" />
        <div className="flex-1 bg-emerald-500 rounded-none" />
        <div className="flex-1 bg-emerald-500 rounded-none" />
        <div className="flex-1 bg-amber-500/80 rounded-none" />
      </div>
    </div>
  );
}
