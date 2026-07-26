"use client";

import React, { useState } from "react";
import { Cpu, Bell, Factory, ShieldCheck, Sun, Moon, Check, AlertTriangle, Info, X } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { useTheme } from "@/context/theme-context";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "warning" | "info" | "critical";
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Quality Risk Warning",
    desc: "Predicted moisture spike +1.4% during basis weight ramp.",
    time: "2 mins ago",
    type: "critical",
    read: false,
  },
  {
    id: "n2",
    title: "OPC-UA Tag Stream Active",
    desc: "Connected to PM-01 DCS controller. 1,420 tags stream @ 100 Hz.",
    time: "15 mins ago",
    type: "info",
    read: false,
  },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className="h-14 bg-industrial-bg border-b border-industrial-border px-6 flex items-center justify-between font-sans select-none z-30 transition-colors relative">
      {/* Brand & Line */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600/10 border border-blue-500/20 rounded-lg">
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-zinc-100 font-heading font-bold text-base tracking-tight">{APP_CONFIG.appName}</span>
        </div>

        <div className="h-4 w-[1px] bg-industrial-border mx-1" />

        {/* Machine Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-industrial-card border border-industrial-border px-3 py-1 text-xs rounded-lg text-zinc-300 font-medium">
          <Factory className="w-3.5 h-3.5 text-amber-400" />
          <span>{APP_CONFIG.activeLine}</span>
        </div>
      </div>

      {/* Active Transition Status Indicator */}
      <div className="hidden lg:flex items-center gap-2.5 bg-industrial-card border border-industrial-border px-3.5 py-1 text-xs text-zinc-300 rounded-full font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>Grade Change: <strong className="text-zinc-100 font-semibold">P-80GSM ➔ L-120GSM</strong></span>
      </div>

      {/* Theme Toggle & Actions */}
      <div className="flex items-center gap-3">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 bg-industrial-card border border-industrial-border text-zinc-300 hover:text-white transition-colors rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Dark</span>
            </>
          )}
        </button>

        {/* Notification Bell with Interactive Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 bg-industrial-card border border-industrial-border text-zinc-400 hover:text-white transition-colors rounded-xl cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-industrial-card border border-industrial-border rounded-xl shadow-2xl z-50 p-4 space-y-3 font-sans animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-industrial-border pb-2">
                <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  DCS Alerts ({notifications.length})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4">No active notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-lg border text-xs relative flex items-start gap-2.5 ${
                        n.read
                          ? "bg-industrial-bg/50 border-industrial-border text-zinc-400 opacity-70"
                          : n.type === "critical"
                          ? "bg-red-500/10 border-red-500/30 text-zinc-200"
                          : "bg-blue-500/10 border-blue-500/30 text-zinc-200"
                      }`}
                    >
                      {n.type === "critical" ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-0.5 pr-4">
                        <div className="font-bold text-zinc-100 flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-zinc-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-snug">{n.desc}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(n.id)}
                        className="text-zinc-500 hover:text-zinc-300 p-0.5 absolute top-2 right-2 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-industrial-card border border-industrial-border px-3 py-1 text-xs rounded-xl text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-zinc-200">Shift Lead</span>
        </div>
      </div>
    </header>
  );
}
