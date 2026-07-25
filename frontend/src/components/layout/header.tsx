"use client";

import React, { useState } from "react";
import { Cpu, Bell, Shield, User, ChevronDown, Activity, Factory, Check, X, Sun, Moon, AlertTriangle } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { useTheme } from "@/context/theme-context";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [activeLine, setActiveLine] = useState("PM-01 (Pineville Mill)");
  const [isLineMenuOpen, setIsLineMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadAlarms, setUnreadAlarms] = useState([
    { id: 1, text: "Reel Moisture offset +1.4% USL", time: "2m ago", severity: "HIGH" },
    { id: 2, text: "Steam Valve #3 pressure variance", time: "8m ago", severity: "MEDIUM" },
  ]);

  const removeAlarm = (id: number) => {
    setUnreadAlarms(prev => prev.filter(a => a.id !== id));
  };

  return (
    <header className="h-14 bg-white dark:bg-[#0b101d] border-b border-slate-200 dark:border-[#1e2945] px-4 flex items-center justify-between font-sans select-none z-30 shadow-xs relative transition-colors duration-200">
      {/* Brand & Plant Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-lg shadow-xs">
            <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 dark:text-slate-100 font-extrabold tracking-tight text-sm">
                {APP_CONFIG.appName}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded font-mono font-semibold">
                DCS v3.4
              </span>
            </div>
            <span className="text-[10px] block text-sky-600 dark:text-sky-400 font-mono tracking-wider uppercase font-semibold">
              Honeywell Predictive Quality AI
            </span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* Paper Machine Line Selector Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setIsLineMenuOpen(!isLineMenuOpen)}
            className="flex items-center gap-2 bg-slate-50 dark:bg-[#141c30] hover:bg-slate-100 dark:hover:bg-[#1e2945] border border-slate-200 dark:border-[#1e2945] hover:border-sky-300 px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer font-mono text-slate-800 dark:text-slate-200"
          >
            <Factory className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold">{activeLine}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </button>

          {isLineMenuOpen && (
            <div className="absolute top-full mt-2 left-0 w-56 bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] rounded-xl shadow-xl z-50 p-1.5 font-mono text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-[#1e2945]">Select Paper Line</div>
              <button
                onClick={() => { setActiveLine("PM-01 (Pineville Mill)"); setIsLineMenuOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 flex items-center justify-between font-sans"
              >
                <span>PM-01 (Pineville)</span>
                {activeLine.includes("PM-01") && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>
              <button
                onClick={() => { setActiveLine("PM-02 (Canton Mill)"); setIsLineMenuOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 flex items-center justify-between font-sans"
              >
                <span>PM-02 (Canton Mill)</span>
                {activeLine.includes("PM-02") && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center Operational Status Banner */}
      <div className="hidden lg:flex items-center gap-3">
        <StatusIndicator status="NORMAL" label="DCS INGESTION 100Hz" />
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3.5 py-1.5 rounded-full text-xs text-amber-900 dark:text-amber-200 font-mono shadow-xs">
          <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
          <span>GRADE RAMP: <strong className="text-amber-950 dark:text-amber-300 font-extrabold">P-80GSM ➔ L-120GSM</strong> (64%)</span>
        </div>
      </div>

      {/* User & Alarm & Theme Actions */}
      <div className="flex items-center gap-3 font-mono">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-[#141c30] hover:bg-slate-100 dark:hover:bg-[#1e2945] border border-slate-200 dark:border-[#1e2945] rounded-lg text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs text-xs font-mono"
        >
          {theme === "light" ? (
            <>
              <Moon className="w-4 h-4 text-sky-600" />
              <span className="hidden md:inline text-[11px] font-bold text-slate-700">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline text-[11px] font-bold text-amber-300">Light Mode</span>
            </>
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 bg-slate-50 dark:bg-[#141c30] hover:bg-slate-100 dark:hover:bg-[#1e2945] border border-slate-200 dark:border-[#1e2945] rounded-lg text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            {unreadAlarms.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-xs animate-pulse">
                {unreadAlarms.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] rounded-xl shadow-xl z-50 p-3.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1e2945] mb-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-sans">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> UNREAD ALARMS ({unreadAlarms.length})
                </span>
                <button onClick={() => setUnreadAlarms([])} className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-sky-600">Clear All</button>
              </div>

              {unreadAlarms.length === 0 ? (
                <div className="py-4 text-center text-slate-500 dark:text-slate-400 text-xs font-sans">No unread alarms. Systems nominal.</div>
              ) : (
                <div className="space-y-2">
                  {unreadAlarms.map((alarm) => (
                    <div key={alarm.id} className="p-2.5 bg-slate-50 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-lg flex items-start justify-between">
                      <div>
                        <div className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold font-sans">{alarm.text}</div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{alarm.time} • {alarm.severity} RISK</div>
                      </div>
                      <button onClick={() => removeAlarm(alarm.id)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Operator Profile Card */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-[#141c30] border border-slate-200 dark:border-[#1e2945] px-3 py-1.5 rounded-lg shadow-xs">
          <div className="w-7 h-7 bg-sky-100 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 rounded-md flex items-center justify-center text-xs font-bold text-sky-700 dark:text-sky-300">
            OP
          </div>
          <div className="text-left text-[11px] hidden sm:block">
            <div className="text-slate-900 dark:text-slate-100 font-bold leading-none font-sans">J. Miller</div>
            <div className="text-slate-500 dark:text-slate-400 text-[9px] flex items-center gap-1 mt-0.5 font-mono">
              <Shield className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
              <span>Shift A • Process Lead</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
