"use client";

import React from "react";
import { Cpu, Bell, Shield, User, ChevronDown, Activity, Factory } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { StatusIndicator } from "@/components/ui/status-indicator";

export function Header() {
  return (
    <header className="h-14 bg-gray-950 border-b border-industrial-border px-4 flex items-center justify-between font-mono select-none z-30">
      {/* Brand & Plant Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-blue-500 font-bold tracking-wider text-sm">
          <div className="p-1.5 bg-blue-950/80 border border-blue-500/50">
            <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <span className="text-white font-extrabold">{APP_CONFIG.appName}</span>
            <span className="text-[10px] block text-cyan-400 font-normal tracking-widest uppercase">
              Predictive Quality & DCS AI
            </span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-industrial-border mx-1" />

        {/* Paper Machine Selector */}
        <div className="flex items-center gap-2 bg-gray-900 border border-industrial-border px-3 py-1 text-xs">
          <Factory className="w-4 h-4 text-amber-400" />
          <span className="text-gray-300 font-semibold">{APP_CONFIG.activeLine}</span>
          <ChevronDown className="w-3 h-3 text-gray-400 ml-1 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Center Operational Alarm Banner */}
      <div className="hidden md:flex items-center gap-3">
        <StatusIndicator status="NORMAL" label="SYSTEM DCS ONLINE" />
        <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-500/40 px-3 py-1 text-xs text-amber-300">
          <Activity className="w-4 h-4 text-amber-400 animate-spin" />
          <span>GRADE CHANGE IN PROGRESS: <strong>P-80GSM ➔ L-120GSM</strong></span>
        </div>
      </div>

      {/* User & Alarm Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 bg-gray-900 border border-industrial-border text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-none animate-pulse">
            2
          </span>
        </button>

        <div className="flex items-center gap-3 bg-gray-900 border border-industrial-border px-3 py-1.5">
          <div className="w-6 h-6 bg-blue-900 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-200">
            OP
          </div>
          <div className="text-left text-[11px]">
            <div className="text-gray-200 font-bold leading-none">J. Miller (Process Lead)</div>
            <div className="text-gray-500 text-[9px] flex items-center gap-1 mt-0.5">
              <Shield className="w-2.5 h-2.5 text-emerald-400" />
              <span>Shift A • Pineville Mill</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
