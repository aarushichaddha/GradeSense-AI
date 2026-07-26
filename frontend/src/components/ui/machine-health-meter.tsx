import React from "react";
import { cn } from "@/lib/utils";
import { Cpu, Activity } from "lucide-react";

interface MachineHealthMeterProps {
  healthPercent: number; // e.g. 98.4
  machineCode?: string;
}

export function MachineHealthMeter({ healthPercent, machineCode = "PM-01" }: MachineHealthMeterProps) {
  return (
    <div className="p-6 bg-industrial-card border border-industrial-border font-sans relative overflow-hidden rounded-xl shadow-card h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-2">
          <span className="flex items-center gap-2 text-blue-400 font-bold">
            <Cpu className="w-4 h-4" /> Machine Health ({machineCode})
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> 100% Online
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <p className="font-heading font-extrabold tracking-tight text-zinc-100 leading-none">
            <span className="text-4xl">{healthPercent}</span><span className="text-xl font-bold text-emerald-400 ml-0.5">%</span>
          </p>
          <span className="text-xs text-zinc-400 font-medium">DCS OEE: 89.2%</span>
        </div>
      </div>

      {/* Multi-segment Health Bar */}
      <div className="mt-4 flex gap-1.5 h-2">
        <div className="flex-1 bg-emerald-500 rounded-full" />
        <div className="flex-1 bg-emerald-500 rounded-full" />
        <div className="flex-1 bg-emerald-500 rounded-full" />
        <div className="flex-1 bg-emerald-500 rounded-full" />
        <div className="flex-1 bg-amber-500/80 rounded-full" />
      </div>
    </div>
  );
}
