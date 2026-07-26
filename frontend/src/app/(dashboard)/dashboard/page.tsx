"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RiskScoreGauge } from "@/components/ui/risk-score-gauge";
import { MachineHealthMeter } from "@/components/ui/machine-health-meter";
import { AnimatedTrendChart } from "@/components/charts/animated-trend-chart";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Lightbulb, ArrowRight, Activity, CheckCircle2, Cpu } from "lucide-react";

export default function OverviewDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendationApplied, setRecommendationApplied] = useState(false);

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Control Room Overview"
        subtitle="Real-time grade transition status, predictive quality risk assessment, and prescriptive control advisory."
        actionText="Start Grade Change"
        onAction={() => setIsModalOpen(true)}
      />

      {/* 12-Column Grid — Top 4 Essential KPI Cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Running Grade */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="h-full bg-industrial-card border-industrial-border p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Running Grade
              </span>
              <div className="text-3xl font-heading font-extrabold text-zinc-100 mt-1">
                P-80GSM
              </div>
            </div>
            <div className="text-xs text-blue-400 font-medium mt-3">
              Fine Copy Paper (79.8 g/m²)
            </div>
          </Card>
        </div>

        {/* Target Grade */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="h-full bg-industrial-card border-industrial-border p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Target Grade
              </span>
              <div className="text-3xl font-heading font-extrabold text-zinc-100 mt-1 flex items-center gap-2">
                L-120GSM <ArrowRight className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="text-xs text-zinc-400 font-medium mt-3">
              Linerboard Packaging (120.0 g/m²)
            </div>
          </Card>
        </div>

        {/* Machine Health */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MachineHealthMeter healthPercent={98.4} machineCode="PM-01" />
        </div>

        {/* Quality Risk Score */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <RiskScoreGauge score={24} label="Quality Risk Score" />
        </div>
      </div>

      {/* Grade Transition Sequence Progress Card (12 Cols) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <Card className="bg-industrial-card border-industrial-border p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl shrink-0">
                  <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between text-xs text-zinc-200 font-semibold mb-2">
                    <span className="flex items-center gap-2">
                      Active Transition Sequence: <strong className="text-zinc-100 font-bold">P-80GSM ➔ L-120GSM</strong>
                    </span>
                    <span className="text-blue-400 font-bold text-sm">64% Complete</span>
                  </div>

                  {/* Modern Timeline Progress Bar */}
                  <div className="h-2.5 w-full bg-industrial-bg border border-industrial-border rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: "64%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-300 bg-industrial-bg border border-industrial-border px-4 py-3 rounded-xl flex items-center gap-3 shrink-0">
                <span className="text-zinc-400">Est. Off-Spec Waste:</span>
                <strong className="text-emerald-400 font-bold text-sm">1.2 Tons (-28%)</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Operational View: 8 Cols Chart + 4 Cols Premium AI Advisory */}
      <div className="grid grid-cols-12 gap-6">
        {/* Real-time Telemetry Trend Chart (col-span-8) */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                Real-Time Telemetry Trends (100 Hz)
              </CardTitle>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Live DCS Sensors
              </span>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatedTrendChart />
            </CardContent>
          </Card>
        </div>

        {/* Premium AI Prescriptive Control Advisory Card (col-span-4) */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full bg-industrial-card border-amber-500/20 flex flex-col justify-between">
            <div>
              <CardHeader className="py-4 px-6 border-b border-amber-500/20 bg-amber-500/5">
                <CardTitle className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  AI Control Advisory
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-5 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-zinc-200">Recommended Adjustment</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      96.4% Confidence
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Increase Steam Valve #3 to prevent predicted +1.4% moisture spike during basis weight ramp.
                  </p>
                </div>

                <div className="p-4 bg-industrial-bg border border-industrial-border rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>Target Parameter:</span>
                    <strong className="text-zinc-100 font-semibold">Dryer Steam Pressure</strong>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Setpoint Adjustment:</span>
                    <span className="text-amber-400 font-bold">3.57 ➔ 3.82 bar (+0.25)</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-6 pt-0">
              {recommendationApplied ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-semibold text-xs flex items-center justify-center gap-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Dispatched to DCS Controller
                </div>
              ) : (
                <Button variant="warning" size="md" className="w-full font-bold shadow-sm" onClick={() => setRecommendationApplied(true)}>
                  Dispatch Advisory to DCS ➔
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Grade Change Execution Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Execute Paper Grade Transition">
        <div className="space-y-4 text-xs font-sans">
          <p className="text-zinc-300">
            Confirm grade transition sequence on <strong>PM-01 Paper Machine</strong>:
          </p>
          <div className="p-4 bg-industrial-bg border border-industrial-border space-y-2 text-zinc-300 rounded-xl">
            <div><strong>Source Grade:</strong> P-80GSM (Fine Copy Paper)</div>
            <div><strong>Target Grade:</strong> L-120GSM (Linerboard)</div>
            <div><strong>Est. Transition Time:</strong> 45 Minutes</div>
            <div><strong>AI Safety Bound:</strong> ±5% Operator Guardrail</div>
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="default" size="sm" onClick={() => setIsModalOpen(false)}>Start Ramp ➔</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
