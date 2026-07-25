import React from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StatusBar } from "@/components/layout/status-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-industrial-bg text-gray-100 font-mono dcs-scanline">
      {/* Top DCS Header */}
      <Header />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Control Navigation */}
        <Sidebar />

        {/* Dynamic Operational Content View */}
        <main className="flex-1 overflow-y-auto bg-industrial-bg dcs-grid-pattern relative">
          {children}
        </main>
      </div>

      {/* Bottom Telemetry & Status Bar */}
      <StatusBar />
    </div>
  );
}
