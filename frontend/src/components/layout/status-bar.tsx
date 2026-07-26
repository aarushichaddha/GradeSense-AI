"use client";

import React, { useState, useEffect } from "react";
import { Activity, Server, Radio, Database } from "lucide-react";

export function StatusBar() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-8 bg-industrial-bg border-t border-industrial-border px-6 flex items-center justify-between font-sans text-xs text-zinc-400 select-none z-30 transition-colors">
      {/* Telemetry Heartbeat */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>DCS Ingestion: 100 Hz</span>
        </div>

        <div className="h-3 w-[1px] bg-industrial-border" />

        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>PostgreSQL: Connected</span>
        </div>

        <div className="h-3 w-[1px] bg-industrial-border" />

        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span>OPC-UA Tags: 1,420 Active</span>
        </div>
      </div>

      {/* Model & System Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-blue-400 font-medium">
          <Server className="w-3.5 h-3.5" />
          <span>FastAPI ML Engine v2.4</span>
        </div>

        <div className="h-3 w-[1px] bg-industrial-border" />

        <span className="text-zinc-400 font-mono text-[11px] font-medium">{time || "2026-07-26 19:22:00 UTC"}</span>
      </div>
    </footer>
  );
}
