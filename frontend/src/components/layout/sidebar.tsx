"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Brain,
  Cpu,
  Lightbulb,
  UploadCloud,
  Settings,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Gauge,
} from "lucide-react";

// Minimal, streamlined primary navigation (Core 6)
const PRIMARY_NAV = [
  { label: "Control Room", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Quality & XAI", href: "/predictions", icon: Brain },
  { label: "Digital Twin", href: "/digital-twin", icon: Cpu },
  { label: "AI Recommendations", href: "/ai-recommendations", icon: Lightbulb },
  { label: "Data Ingestion", href: "/ingestion", icon: UploadCloud },
  { label: "Plant Settings", href: "/settings", icon: Settings },
];

const SECONDARY_NAV = [
  { label: "Machine Telemetry", href: "/paper-machine", icon: Gauge },
  { label: "Alerts & History", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-industrial-bg border-r border-industrial-border flex flex-col justify-between font-sans select-none z-20 shrink-0">
      <div className="py-5 px-3 space-y-6">
        {/* Core Navigation */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Core Operations
          </div>
          <nav className="space-y-1">
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 text-xs rounded-lg transition-all duration-150",
                    isActive
                      ? "bg-industrial-panel text-zinc-100 font-semibold border-l-2 border-blue-500 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-industrial-card font-medium"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-zinc-500")} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary Monitoring */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Monitoring
          </div>
          <nav className="space-y-1">
            {SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 text-xs rounded-lg transition-all duration-150",
                    isActive
                      ? "bg-industrial-panel text-zinc-100 font-semibold border-l-2 border-blue-500 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-industrial-card font-medium"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-zinc-500")} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-industrial-border bg-industrial-bg text-xs text-zinc-400 flex items-center justify-between font-medium">
        <span>AI Engine</span>
        <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> Online
        </span>
      </div>
    </aside>
  );
}
