"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Award, ArrowDownRight, Zap } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="Grade Transition Yield & Waste Analytics"
        subtitle="Historical performance metrics, off-spec waste reduction, and AI recommendation impact analysis."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <Card className="p-4 bg-white dark:bg-[#0e1424]/80 border-slate-200 dark:border-[#1e2945] shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-sans">AVG TRANSITION DURATION</div>
          <div className="text-3xl font-extrabold text-sky-700 dark:text-cyan-400 mt-1.5 font-mono">32.4 MINS</div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1 font-sans flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> 14% Faster vs Manual Baseline
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#0e1424]/80 border-slate-200 dark:border-[#1e2945] shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-sans">MONTHLY OFF-SPEC WASTE</div>
          <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1.5 font-mono">18.5 TONS</div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1 font-sans flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> 28.2 Tons Saved by AI
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#0e1424]/80 border-slate-200 dark:border-[#1e2945] shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-sans">AI ADVISORY ACCURACY</div>
          <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mt-1.5 font-mono">97.6%</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-sans">Based on 142 Grade Changes</div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#0e1424]/80 border-slate-200 dark:border-[#1e2945] shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-sans">ESTIMATED SHIFT COST SAVINGS</div>
          <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 mt-1.5 font-mono">$42,500</div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-1 font-sans">Energy & Fiber Recovery</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans text-slate-800 dark:text-slate-100">
            <BarChart3 className="w-4 h-4 text-sky-600 dark:text-cyan-400" /> MONTHLY TRANSITION EFFICIENCY & FIBER RECOVERY TREND
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-[#1e2945] bg-slate-50 dark:bg-[#070a11]/60 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-mono gap-2">
            <Zap className="w-8 h-8 text-sky-600 dark:text-cyan-400 opacity-60" />
            <span className="font-bold text-slate-800 dark:text-slate-300">HISTORICAL GRADE CHANGE EFFICIENCY & FIBER SAVINGS ANALYTICS</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Aggregated 30-day TimeSeries view of machine speed optimization & waste reduction</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
