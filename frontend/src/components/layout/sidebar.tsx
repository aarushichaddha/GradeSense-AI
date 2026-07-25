"use client";

import React, { useState } from "react";
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
  ChevronLeft,
  BellRing,
  Brain,
  Cpu,
  Activity,
  Layers,
} from "lucide-react";

interface NavGroup {
  category: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    badgeVariant?: "red" | "blue" | "emerald" | "amber" | "violet";
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: "CORE OPERATIONS",
    items: [
      { label: "Control Room", href: "/dashboard", icon: LayoutDashboard },
      { label: "Digital Twin Simulator", href: "/digital-twin", icon: Cpu, badge: "SIM 3D", badgeVariant: "violet" },
      { label: "Grade Transitions", href: "/grade-transitions", icon: RefreshCw, badge: "ACTIVE", badgeVariant: "blue" },
      { label: "Machine Overview", href: "/paper-machine", icon: Gauge },
    ],
  },
  {
    category: "PREDICTIVE QUALITY AI",
    items: [
      { label: "Quality Deviations", href: "/quality-deviations", icon: AlertTriangle, badge: "2 ALARMS", badgeVariant: "red" },
      { label: "AI Recommendations", href: "/ai-recommendations", icon: Lightbulb, badge: "3 NEW", badgeVariant: "amber" },
      { label: "AI Predictions & XAI", href: "/predictions", icon: Brain, badge: "XAI", badgeVariant: "violet" },
      { label: "Alerts Center", href: "/alerts", icon: BellRing },
    ],
  },
  {
    category: "DATA & ANALYTICS",
    items: [
      { label: "Data Ingestion & ETL", href: "/ingestion", icon: UploadCloud, badge: "ETL", badgeVariant: "emerald" },
      { label: "Historical Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Shift Reports", href: "/reports", icon: FileText },
    ],
  },
  {
    category: "SYSTEM ADMINISTRATION",
    items: [
      { label: "Plant Config", href: "/settings", icon: Settings },
      { label: "System Admin", href: "/admin", icon: Server },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-white dark:bg-[#0b101d] border-r border-slate-200 dark:border-[#1e2945] flex flex-col justify-between font-sans select-none z-20 shrink-0 transition-all duration-300 relative shadow-xs",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Top Collapse Toggle */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-[#1e2945] bg-slate-50/80 dark:bg-[#070a11]/80">
        {!collapsed && (
          <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-bold tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> DCS NAV MATRIX
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-md border border-transparent transition-all ml-auto cursor-pointer"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-sky-600 dark:text-sky-400" /> : <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="py-2.5 overflow-y-auto flex-1 space-y-4">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-4 text-[9px] uppercase font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 pt-1">
                {group.category}
              </div>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2 text-xs font-semibold tracking-wide transition-all border-l-4 relative group",
                      isActive
                        ? "bg-sky-50/80 dark:bg-sky-950/50 border-sky-600 dark:border-sky-400 text-sky-800 dark:text-sky-300 font-bold shadow-xs"
                        : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-[#141c30]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-all",
                          isActive ? "text-sky-600 dark:text-sky-400 scale-105" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge ? (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 border font-mono font-bold rounded-full shadow-2xs",
                          item.badgeVariant === "red"
                            ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                            : item.badgeVariant === "amber"
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                            : item.badgeVariant === "violet"
                            ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                            : item.badgeVariant === "emerald"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      !collapsed && isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer System Status Info */}
      {!collapsed && (
        <div className="p-3.5 border-t border-slate-200 dark:border-[#1e2945] bg-slate-50/80 dark:bg-[#070a11]/80 text-[10px] font-mono text-slate-600 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-sans">AI INFERENCE ENGINE:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> ONLINE
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-sans">
            <span>OPC-UA LATENCY:</span>
            <span className="text-sky-700 dark:text-sky-400 font-semibold font-mono">14ms</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-sans">
            <span>MODEL CONFIDENCE:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">98.4%</span>
          </div>
        </div>
      )}
    </aside>
  );
}
