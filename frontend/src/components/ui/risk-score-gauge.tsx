import React from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface RiskScoreGaugeProps {
  score: number; // 0 to 100
  label?: string;
}

export function RiskScoreGauge({ score, label = "Quality Risk Score" }: RiskScoreGaugeProps) {
  const getRiskLevel = (val: number) => {
    if (val < 30) return { level: "Low Risk", color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30", badgeBg: "bg-emerald-500/10" };
    if (val < 70) return { level: "Moderate Risk", color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/30", badgeBg: "bg-amber-500/10" };
    return { level: "High Alarm Risk", color: "text-red-400", bg: "bg-red-500", border: "border-red-500/40 animate-pulse", badgeBg: "bg-red-500/10" };
  };

  const risk = getRiskLevel(score);

  return (
    <div className="p-6 bg-industrial-card border border-industrial-border font-sans relative overflow-hidden rounded-xl shadow-card h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-2">
          <span>{label}</span>
          {score < 50 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
          )}
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <p className="font-heading font-extrabold tracking-tight leading-none">
            <span className={cn("text-4xl", risk.color)}>{score}</span
            ><span className="text-base font-semibold text-zinc-400 ml-0.5">/100</span>
          </p>
          <span className={cn("text-xs font-semibold px-2.5 py-0.5 border rounded-full", risk.color, risk.border, risk.badgeBg)}>
            {risk.level}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-4 h-2 w-full bg-industrial-bg border border-industrial-border relative overflow-hidden rounded-full">
        <div
          className={cn("h-full transition-all duration-700 rounded-full", risk.bg)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
