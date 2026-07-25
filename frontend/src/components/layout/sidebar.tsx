"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UploadCloud,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  Gauge,
  BarChart3,
  Settings,
  FileText,
  ShieldCheck,
  Server,
  ChevronRight,
  BellRing,
  Brain,
  Cpu,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Control Room", href: "/dashboard", icon: LayoutDashboard },
  { label: "Digital Twin Simulator", href: "/digital-twin", icon: Cpu, badge: "TWIN" },
  { label: "Data Ingestion & ETL", href: "/ingestion", icon: UploadCloud, badge: "ETL" },
  { label: "Machine Overview", href: "/paper-machine", icon: Gauge },
  { label: "Grade Transitions", href: "/grade-transitions", icon: RefreshCw, badge: "ACTIVE" },
  { label: "Quality Deviations", href: "/quality-deviations", icon: AlertTriangle, badge: "2 ALARMS" },
  { label: "Alerts Center", href: "/alerts", icon: BellRing },
  { label: "AI Predictions", href: "/predictions", icon: Brain, badge: "XAI" },
  { label: "AI Recommendations", href: "/ai-recommendations", icon: Lightbulb, badge: "3 NEW" },
  { label: "Historical Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Shift Reports", href: "/reports", icon: FileText },
  { label: "Plant Config", href: "/settings", icon: Settings },
  { label: "System Admin", href: "/admin", icon: Server },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-950 border-r border-industrial-border flex flex-col justify-between font-mono select-none z-20 shrink-0">
      {/* Navigation Section */}
      <div className="py-3">
        <div className="px-4 mb-2 text-[10px] uppercase text-gray-500 font-bold tracking-widest">
          DCS Control Navigation
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-l-2",
                  isActive
                    ? "bg-blue-950/60 border-blue-500 text-blue-300"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-gray-900/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-gray-400")} />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 border font-bold",
                      item.badge.includes("ALARMS")
                        ? "bg-red-950 text-red-400 border-red-500/50 animate-pulse"
                        : "bg-blue-950 text-blue-300 border-blue-500/40"
                    )}
                  >
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3 h-3 text-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Info */}
      <div className="p-4 border-t border-industrial-border bg-gray-900/40 text-[10px] text-gray-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>PREDICTIVE AI ENGINE:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> ONLINE
          </span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span>OPC-UA LATENCY:</span>
          <span className="text-gray-300 font-mono">14ms</span>
        </div>
      </div>
    </aside>
  );
}
