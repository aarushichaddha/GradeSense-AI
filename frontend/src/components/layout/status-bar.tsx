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
    <footer className="h-7 bg-gray-950 border-t border-industrial-border px-4 flex items-center justify-between font-mono text-[10px] text-gray-400 select-none z-30">
      {/* Telemetry Heartbeat */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>DCS INGESTION: 100 Hz</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-800" />

        <div className="flex items-center gap-1 text-gray-300">
          <Database className="w-3 h-3 text-blue-400" />
          <span>POSTGRES DB: CONNECTED</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-800" />

        <div className="flex items-center gap-1 text-gray-300">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>OPC-UA TELEMETRY TAGS: 1,420 ACTIVE</span>
        </div>
      </div>

      {/* Model & System Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-cyan-300">
          <Server className="w-3 h-3" />
          <span>PREDICTIVE ENGINE v2.4 (FASTAPI)</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-800" />

        <span className="text-gray-200 font-bold tracking-widest">{time || "2026-07-25 16:36:21 UTC"}</span>
      </div>
    </footer>
  );
}
