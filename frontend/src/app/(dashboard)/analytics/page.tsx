"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Award } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6 font-mono">
      <PageHeader
        title="Grade Transition Yield & Waste Analytics"
        subtitle="Historical performance metrics, off-spec waste reduction, and AI recommendation impact analysis."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="text-[10px] text-gray-400 font-bold uppercase">AVG TRANSITION DURATION</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">32.4 MINS</div>
          <div className="text-[10px] text-emerald-400 mt-1">↓ 14% Faster vs Manual Baseline</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="text-[10px] text-gray-400 font-bold uppercase">MONTHLY OFF-SPEC WASTE</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">18.5 TONS</div>
          <div className="text-[10px] text-emerald-400 mt-1">↓ 28.2 Tons Saved by AI</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="text-[10px] text-gray-400 font-bold uppercase">AI RECOMMENDATION ACCURACY</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">97.6%</div>
          <div className="text-[10px] text-gray-400 mt-1">Based on 142 Grade Changes</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="text-[10px] text-gray-400 font-bold uppercase">ESTIMATED SHIFT COST SAVINGS</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">$42,500</div>
          <div className="text-[10px] text-amber-400 mt-1">Energy & Fiber Recovery</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" /> MONTHLY TRANSITION EFFICIENCY TREND
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center border border-dashed border-gray-800 text-gray-500 text-xs">
            [HISTORICAL GRADE CHANGE EFFICIENCY & FIBER SAVINGS ANALYTICS]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
