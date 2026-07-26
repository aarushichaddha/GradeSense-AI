"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Play, CheckCircle2 } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export function PageHeader({ title, subtitle, actionText, onAction }: PageHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("DCS Telemetry Refreshed — 1,420 OPC-UA Tags Active (100 Hz)");
    }, 600);
  };

  const handleExport = () => {
    // Generate sample telemetry CSV
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Timestamp,Tag_ID,Parameter,Value,Unit,Status\n" +
      `${new Date().toISOString()},PM01_MOIST_01,Moisture Reel,6.8,%,NORMAL\n` +
      `${new Date().toISOString()},PM01_BW_01,Basis Weight,80.0,g/m²,NORMAL\n` +
      `${new Date().toISOString()},PM01_STEAM_03,Dryer Group 3 Steam,3.82,bar,WARNING\n` +
      `${new Date().toISOString()},PM01_SPEED_01,Wire Speed,900,m/min,NORMAL\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gradesense_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Telemetry CSV log exported successfully");
  };

  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 font-sans">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="absolute -top-10 right-0 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-heading font-extrabold tracking-tight text-zinc-100 dark:text-zinc-100 flex items-center gap-3">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-zinc-400 mt-1 font-normal leading-relaxed">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 font-medium text-xs rounded-xl"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh DCS"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-1.5 font-medium text-xs rounded-xl"
        >
          <Download className="w-3.5 h-3.5" />
          Export Log
        </Button>

        {actionText && (
          <Button
            variant="default"
            size="sm"
            onClick={onAction}
            className="flex items-center gap-1.5 font-semibold text-xs rounded-xl shadow-sm"
          >
            <Play className="w-3.5 h-3.5" /> {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
