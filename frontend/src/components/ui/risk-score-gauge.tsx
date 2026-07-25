import React from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface RiskScoreGaugeProps {
  score: number; // 0 to 100
  label?: string;
}

export function RiskScoreGauge({ score, label = "PREDICTED QUALITY RISK SCORE" }: RiskScoreGaugeProps) {
  const getRiskLevel = (val: number) => {
    if (val < 30) return { level: "LOW RISK", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60" };
    if (val < 70) return { level: "MODERATE RISK", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500", border: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60" };
    return { level: "HIGH ALARM RISK", color: "text-red-700 dark:text-red-400", bg: "bg-red-500", border: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 animate-pulse" };
  };

  const risk = getRiskLevel(score);

  return (
    <div className="p-4 bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] rounded-xl font-mono relative overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
        <span className="font-sans font-bold text-slate-800 dark:text-slate-200">{label}</span>
        {score < 50 ? (
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className={cn("text-3xl font-extrabold tracking-tight font-mono", risk.color)}>
          {score}<span className="text-xs font-normal text-slate-500 dark:text-slate-400">/100</span>
        </span>
        <span className={cn("text-[10px] font-bold uppercase px-2.5 py-0.5 border rounded-full font-mono", risk.color, risk.border)}>
          {risk.level}
        </span>
      </div>

      {/* Progress Track */}
      <div className="mt-3.5 h-2 w-full bg-slate-100 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-700 rounded-full", risk.bg)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
