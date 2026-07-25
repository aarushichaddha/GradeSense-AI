import React from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface RiskScoreGaugeProps {
  score: number; // 0 to 100
  label?: string;
}

export function RiskScoreGauge({ score, label = "DEVIATION RISK SCORE" }: RiskScoreGaugeProps) {
  const getRiskLevel = (val: number) => {
    if (val < 30) return { level: "LOW RISK", color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/40" };
    if (val < 70) return { level: "MODERATE RISK", color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/40" };
    return { level: "HIGH ALARM RISK", color: "text-red-400", bg: "bg-red-500", border: "border-red-500/60 animate-pulse" };
  };

  const risk = getRiskLevel(score);

  return (
    <div className={cn("p-4 bg-industrial-card border font-mono relative overflow-hidden", risk.border)}>
      <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-widest mb-1">
        <span>{label}</span>
        {score < 50 ? (
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        ) : (
          <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className={cn("text-3xl font-extrabold tracking-tight", risk.color)}>
          {score}<span className="text-xs font-normal text-gray-400">/100</span>
        </span>
        <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 border", risk.color, risk.border)}>
          {risk.level}
        </span>
      </div>

      {/* Progress Track */}
      <div className="mt-3 h-2 w-full bg-gray-950 border border-gray-800 relative overflow-hidden">
        <div
          className={cn("h-full transition-all duration-700", risk.bg)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
