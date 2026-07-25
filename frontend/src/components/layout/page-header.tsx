import React from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Play } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export function PageHeader({ title, subtitle, actionText, onAction }: PageHeaderProps) {
  return (
    <div className="bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs transition-colors duration-200">
      <div>
        <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5 font-sans">
          <span className="w-2.5 h-2.5 bg-sky-600 dark:text-sky-400 rounded-full inline-block animate-pulse" />
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 font-mono">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> REFRESH DCS
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> EXPORT LOG
        </Button>
        {actionText && (
          <Button variant="cyan" size="sm" onClick={onAction} className="flex items-center gap-1.5 text-xs font-bold">
            <Play className="w-3.5 h-3.5 text-white fill-white" /> {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
