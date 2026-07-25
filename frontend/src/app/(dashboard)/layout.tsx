import React from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StatusBar } from "@/components/layout/status-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-[#070a11] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Navigation */}
        <Sidebar />

        {/* Dynamic Operational Content View */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#070a11] light-grid-pattern relative">
          {children}
        </main>
      </div>

      {/* Bottom Telemetry & Status Bar */}
      <StatusBar />
    </div>
  );
}
