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
    <div className="bg-gray-900/60 border-b border-industrial-border px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
      <div>
        <h1 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-none inline-block" />
          {title}
        </h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> REFRESH DCS
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="w-3 h-3" /> EXPORT LOG
        </Button>
        {actionText && (
          <Button variant="cyan" size="sm" onClick={onAction} className="flex items-center gap-1">
            <Play className="w-3 h-3" /> {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
