import React from "react";
import { cn } from "@/lib/utils";
import { Cpu, Activity, ShieldCheck } from "lucide-react";

interface MachineHealthMeterProps {
  healthPercent: number; // e.g. 98.4
  machineCode?: string;
}

export function MachineHealthMeter({ healthPercent, machineCode = "PM-01" }: MachineHealthMeterProps) {
  return (
    <div className="p-4 bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] rounded-xl font-mono relative overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
        <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold font-sans">
          <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> MACHINE HEALTH ({machineCode})
        </span>
        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <Activity className="w-3 h-3 animate-pulse text-emerald-600 dark:text-emerald-400" /> 100% ONLINE
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
          {healthPercent}<span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">%</span>
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-semibold">OEE: 89.2% (OPTIMAL)</span>
      </div>

      {/* Multi-segment Health Bar */}
      <div className="mt-3.5 flex gap-1.5 h-2">
        <div className="flex-1 bg-emerald-500 rounded-full" />
        <div className="flex-1 bg-emerald-500 rounded-full" />
        <div className="flex-1 bg-emerald-500 rounded-full" />
        <div className="flex-1 bg-emerald-500 rounded-full" />
        <div className="flex-1 bg-amber-400 rounded-full" />
      </div>
    </div>
  );
}
