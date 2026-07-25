"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TelemetryMetric } from "@/components/ui/telemetry-metric";
import { SensorGauge } from "@/components/ui/sensor-gauge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { RiskScoreGauge } from "@/components/ui/risk-score-gauge";
import { MachineHealthMeter } from "@/components/ui/machine-health-meter";
import { AnimatedTrendChart } from "@/components/charts/animated-trend-chart";
import { QualityControlChart } from "@/components/charts/quality-control-chart";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AlertTriangle, Lightbulb, Play, ArrowRight, Activity, ShieldAlert, Cpu, Sparkles, CheckCircle2, Zap } from "lucide-react";

export default function OverviewDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendationApplied, setRecommendationApplied] = useState(false);

  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="DCS Control Room • PM-01 Executive Dashboard"
        subtitle="Real-time grade change telemetry, predictive deviation risks, and prescriptive control advisory."
        actionText="EXECUTE GRADE CHANGE"
        onAction={() => setIsModalOpen(true)}
      />

      {/* Top Industrial Header Cards: Current Grade, Target Grade, Machine Health, Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Current Grade Card */}
        <Card className="border-sky-200 dark:border-[#1e2945] bg-white dark:bg-[#0e1424] shadow-xs">
          <CardContent className="p-4">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1 font-sans">CURRENT RUNNING GRADE</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">P-80GSM</div>
            <div className="text-[11px] text-sky-700 dark:text-sky-400 mt-1 font-semibold font-sans">Offset Fine Copy Paper (79.8 g/m²)</div>
            <div className="mt-2.5 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#1e2945] pt-2 flex justify-between font-mono">
              <span>TARGET MOISTURE:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">6.8%</span>
            </div>
          </CardContent>
        </Card>

        {/* Target Grade Card */}
        <Card className="border-sky-200 dark:border-[#1e2945] bg-white dark:bg-[#0e1424] shadow-xs">
          <CardContent className="p-4">
            <div className="text-[10px] text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wider mb-1 font-sans">TARGET GRADE (TRANSITION)</div>
            <div className="text-2xl font-extrabold text-sky-800 dark:text-sky-300 tracking-tight flex items-center gap-2 font-mono">
              L-120GSM <ArrowRight className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-semibold font-sans">Packaging Linerboard (120.0 g/m²)</div>
            <div className="mt-2.5 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#1e2945] pt-2 flex justify-between font-mono">
              <span>EST. COMPLETION:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">14:45 UTC</span>
            </div>
          </CardContent>
        </Card>

        {/* Machine Health Meter */}
        <MachineHealthMeter healthPercent={98.4} machineCode="PM-01" />

        {/* Risk Score Gauge */}
        <RiskScoreGauge score={24} label="PREDICTED QUALITY RISK SCORE" />
      </div>

      {/* Transition Progress Banner */}
      <Card className="border-sky-200 dark:border-[#1e2945] bg-gradient-to-r from-sky-50/70 via-white to-blue-50/50 dark:from-[#0b101d] dark:via-[#0e1424] dark:to-[#10172a] shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-xl text-sky-700 dark:text-sky-300 shadow-2xs">
              <Activity className="w-5 h-5 animate-spin text-sky-600 dark:text-sky-400" />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 font-bold mb-1.5 font-sans">
                <span>ACTIVE GRADE TRANSITION SEQUENCE (P-80GSM ➔ L-120GSM)</span>
                <span className="font-mono bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded text-[11px] text-sky-800 dark:text-sky-300">PROGRESS: 64%</span>
              </div>
              <div className="h-3 w-full md:w-96 bg-slate-100 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-full relative overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: "64%" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400 font-sans">Predicted Off-Spec Waste:</span>
            <span className="text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 rounded-lg shadow-2xs">1.2 TONS (-28% vs Manual)</span>
          </div>
        </CardContent>
      </Card>

      {/* Live DCS Sensor Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TelemetryMetric
          label="Reel Moisture"
          tag="TAG_MOIST_01"
          value={6.8}
          unit="%"
          target={6.8}
          status="CRITICAL"
          trend="up"
        />
        <TelemetryMetric
          label="Basis Weight"
          tag="TAG_BW_02"
          value={78.4}
          unit="g/m²"
          target={80.0}
          status="WARNING"
          trend="down"
        />
        <TelemetryMetric
          label="Machine Speed"
          tag="TAG_SPD_01"
          value={1150}
          unit="m/min"
          target={1200}
          status="NORMAL"
          trend="up"
        />
        <TelemetryMetric
          label="Dryer 3 Steam Press"
          tag="TAG_STM_03"
          value={3.82}
          unit="bar"
          target={3.6}
          status="NORMAL"
          trend="flat"
        />
      </div>

      {/* Animated Recharts Telemetry Curve & Prescriptive AI Advisory Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Recharts Multi-line Telemetry Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-slate-800 dark:text-slate-100">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              ANIMATED TELEMETRY TRANSITION CURVE (REAL-TIME DCS INGESTION)
            </CardTitle>
            <StatusIndicator status="NORMAL" label="INGESTION 100 Hz" />
          </CardHeader>
          <CardContent>
            <AnimatedTrendChart />
          </CardContent>
        </Card>

        {/* AI Prescriptive Control Panel (1 col) */}
        <Card className="border-amber-200 dark:border-amber-900/60 bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-amber-950/20 dark:via-[#0e1424] dark:to-[#0e1424]">
          <CardHeader className="bg-amber-50/80 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/60">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-sans">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              PRESCRIPTIVE CONTROL ADVISORY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-mono">
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-amber-900 dark:text-amber-200 font-bold">
                <span className="font-sans">PREDICTED MOISTURE OFFSET</span>
                <span className="text-[9px] bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 border border-red-200 dark:border-red-800 rounded-full font-mono font-semibold animate-pulse">HIGH RISK</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-sans">
                Moisture predicted to spike +1.4% above spec USL in 4 mins due to basis weight ramp sequence.
              </p>

              <div className="p-3 bg-white dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-lg text-slate-800 dark:text-slate-200 text-[11px] space-y-1.5 font-mono shadow-2xs">
                <div><strong>Action:</strong> Increase Steam Valve #3 by +0.25 bar</div>
                <div><strong>Current:</strong> 3.57 bar ➔ <strong>Target:</strong> 3.82 bar</div>
                <div><strong>AI Confidence:</strong> <span className="text-emerald-700 dark:text-emerald-400 font-bold">96.4%</span></div>
              </div>

              <div className="mt-3">
                {recommendationApplied ? (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-center font-bold text-[11px] rounded-lg flex items-center justify-center gap-2 font-sans shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> DISPATCHED TO OPC-UA CONTROLLER
                  </div>
                ) : (
                  <Button variant="warning" size="sm" className="w-full text-xs font-sans font-bold" onClick={() => setRecommendationApplied(true)}>
                    <Zap className="w-3.5 h-3.5 mr-1" /> DISPATCH ADVISORY TO DCS ➔
                  </Button>
                )}
              </div>
            </div>

            {/* Active Critical Alerts Mini-List */}
            <div className="p-3 bg-slate-50 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-xl space-y-2 font-mono">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase flex items-center justify-between font-sans">
                <span>ACTIVE ALERTS</span>
                <span className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800 font-bold">2 ACTIVE</span>
              </div>
              <div className="text-[11px] text-red-700 dark:text-red-400 border-l-2 border-red-500 pl-2 py-0.5 font-sans">
                Reel Moisture Sensor offset 8.2% vs target 6.8%.
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-400 border-l-2 border-amber-500 pl-2 py-0.5 font-sans">
                Pulp Feed Pump #2 flow rate fluctuating ±2.1%.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Gauges & SPC Bands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-slate-800 dark:text-slate-100">PAPER MACHINE SECTION GAUGES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-mono">
            <SensorGauge title="Wet End Vacuum #2" value={45.2} min={30} max={60} unit="kPa" status="NORMAL" />
            <SensorGauge title="Press Section Load #1" value={82.0} min={70} max={100} unit="kN/m" status="NORMAL" />
            <SensorGauge title="Caliper Reel Scanner" value={118} min={100} max={140} unit="µm" status="WARNING" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-slate-800 dark:text-slate-100">
              <ShieldAlert className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              STATISTICAL PROCESS CONTROL (SPC) SPECIFICATION BANDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QualityControlChart />
          </CardContent>
        </Card>
      </div>

      {/* Grade Change Execution Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="EXECUTE PAPER GRADE TRANSITION">
        <div className="space-y-4 text-xs font-sans text-slate-800 dark:text-slate-200">
          <p className="text-slate-600 dark:text-slate-400">
            Confirm execution of grade transition sequence on <strong>PM-01 Paper Machine</strong>:
          </p>
          <div className="p-4 bg-slate-50 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-xl space-y-1.5 font-mono text-slate-800 dark:text-slate-200">
            <div><strong>Source Grade:</strong> P-80GSM (Offset Copy Paper)</div>
            <div><strong>Target Grade:</strong> L-120GSM (Linerboard)</div>
            <div><strong>Est. Transition Time:</strong> 45 Minutes</div>
            <div><strong>AI Closed-Loop Safety:</strong> Bound within ±5% operator safety limit</div>
          </div>
          <div className="flex justify-end gap-2.5 pt-2 font-mono">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>CANCEL</Button>
            <Button variant="cyan" size="sm" onClick={() => setIsModalOpen(false)}>CONFIRM & START RAMP ➔</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
