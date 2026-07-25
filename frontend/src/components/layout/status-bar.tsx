"use client";

import React, { useState, useEffect } from "react";
import { Activity, Server, Radio, Database, Volume2, VolumeX } from "lucide-react";

export function StatusBar() {
  const [time, setTime] = useState<string>("");
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

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
    <footer className="h-7 bg-slate-100 dark:bg-[#0b101d] border-t border-slate-200 dark:border-[#1e2945] px-4 flex items-center justify-between font-mono text-[10px] text-slate-600 dark:text-slate-400 select-none z-30 shadow-xs transition-colors duration-200">
      {/* Telemetry Heartbeat */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
          <span>OPC-UA INGESTION: 100 Hz</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-800" />

        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hidden sm:flex">
          <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>TIMESCALEDB: CONNECTED</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hidden md:flex">
          <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>ACTIVE SENSOR TAGS: 1,420</span>
        </div>
      </div>

      {/* Model & System Clock */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer font-sans font-semibold"
          title={isAudioMuted ? "Unmute Alarm Chime" : "Mute Alarm Chime"}
        >
          {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
          <span className="hidden sm:inline">{isAudioMuted ? "AUDIO MUTED" : "ALARM AUDIO ON"}</span>
        </button>

        <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-800" />

        <div className="flex items-center gap-1 text-sky-700 dark:text-sky-400 font-semibold hidden sm:flex">
          <Server className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>FASTAPI AI ENGINE v2.4</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-800 hidden sm:block" />

        <span className="text-slate-800 dark:text-slate-200 font-bold tracking-widest bg-white dark:bg-[#141c30] border border-slate-200 dark:border-[#1e2945] px-2 py-0.5 rounded-md text-[9.5px] shadow-2xs">
          {time || "2026-07-25 16:36:21 UTC"}
        </span>
      </div>
    </footer>
  );
}
