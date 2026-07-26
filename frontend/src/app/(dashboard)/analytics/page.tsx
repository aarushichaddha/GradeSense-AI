"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="Grade Transition Yield & Waste Analytics"
        subtitle="Historical performance metrics, off-spec waste reduction, and AI recommendation impact analysis."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-industrial-card border-industrial-border">
          <div className="text-xs text-zinc-400 font-semibold uppercase">AVG TRANSITION DURATION</div>
          <div className="text-3xl font-heading font-extrabold text-blue-400 mt-1">32.4 MINS</div>
          <div className="text-xs text-emerald-400 mt-2 font-medium">↓ 14% Faster vs Manual Baseline</div>
        </Card>

        <Card className="p-6 bg-industrial-card border-industrial-border">
          <div className="text-xs text-zinc-400 font-semibold uppercase">MONTHLY OFF-SPEC WASTE</div>
          <div className="text-3xl font-heading font-extrabold text-emerald-400 mt-1">18.5 TONS</div>
          <div className="text-xs text-emerald-400 mt-2 font-medium">↓ 28.2 Tons Saved by AI</div>
        </Card>

        <Card className="p-6 bg-industrial-card border-industrial-border">
          <div className="text-xs text-zinc-400 font-semibold uppercase">AI RECOMMENDATION ACCURACY</div>
          <div className="text-3xl font-heading font-extrabold text-blue-400 mt-1">97.6%</div>
          <div className="text-xs text-zinc-400 mt-2 font-medium">Based on 142 Grade Changes</div>
        </Card>

        <Card className="p-6 bg-industrial-card border-industrial-border">
          <div className="text-xs text-zinc-400 font-semibold uppercase">ESTIMATED SHIFT COST SAVINGS</div>
          <div className="text-3xl font-heading font-extrabold text-amber-400 mt-1">$42,500</div>
          <div className="text-xs text-amber-400 mt-2 font-medium">Energy & Fiber Recovery</div>
        </Card>
      </div>

      <Card className="bg-industrial-card border-industrial-border">
        <CardHeader className="py-4 px-6 border-b border-industrial-border">
          <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" /> MONTHLY TRANSITION EFFICIENCY TREND
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-48 flex items-center justify-center border border-dashed border-industrial-border text-zinc-500 text-xs font-sans rounded-xl">
            [HISTORICAL GRADE CHANGE EFFICIENCY & FIBER SAVINGS ANALYTICS]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
