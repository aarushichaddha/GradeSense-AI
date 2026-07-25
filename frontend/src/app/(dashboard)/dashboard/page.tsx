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
import { AlertTriangle, Lightbulb, Play, ArrowRight, Activity, ShieldAlert, Cpu, Sparkles } from "lucide-react";

export default function OverviewDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendationApplied, setRecommendationApplied] = useState(false);

  return (
    <div className="p-6 space-y-6 font-mono">
      <PageHeader
        title="DCS Control Room • PM-01 Executive Dashboard"
        subtitle="Real-time grade change telemetry, predictive deviation risks, and prescriptive control advisory."
        actionText="EXECUTE GRADE CHANGE"
        onAction={() => setIsModalOpen(true)}
      />

      {/* Top Industrial Header Cards: Current Grade, Target Grade, Machine Health, Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Grade Card */}
        <Card className="border-blue-500/40 bg-gray-900/60">
          <CardContent className="p-4">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">CURRENT RUNNING GRADE</div>
            <div className="text-xl font-bold text-white tracking-tight">P-80GSM</div>
            <div className="text-[11px] text-blue-400 mt-1 font-semibold">Offset Fine Copy Paper (79.8 g/m²)</div>
            <div className="mt-2 text-[10px] text-gray-400 border-t border-gray-800 pt-1.5 flex justify-between">
              <span>TARGET MOISTURE:</span>
              <span className="text-emerald-400 font-bold">6.8%</span>
            </div>
          </CardContent>
        </Card>

        {/* Target Grade Card */}
        <Card className="border-cyan-500/40 bg-gray-900/60">
          <CardContent className="p-4">
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">TARGET GRADE (TRANSITION)</div>
            <div className="text-xl font-bold text-cyan-300 tracking-tight flex items-center gap-2">
              L-120GSM <ArrowRight className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-[11px] text-gray-300 mt-1 font-semibold">Packaging Linerboard (120.0 g/m²)</div>
            <div className="mt-2 text-[10px] text-gray-400 border-t border-gray-800 pt-1.5 flex justify-between">
              <span>EST. COMPLETION:</span>
              <span className="text-gray-200 font-bold">14:45 UTC</span>
            </div>
          </CardContent>
        </Card>

        {/* Machine Health Meter */}
        <MachineHealthMeter healthPercent={98.4} machineCode="PM-01" />

        {/* Risk Score Gauge */}
        <RiskScoreGauge score={24} label="PREDICTED QUALITY RISK SCORE" />
      </div>

      {/* Transition Progress Banner */}
      <Card className="border-cyan-500/40 bg-cyan-950/20">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-2.5 bg-cyan-900/50 border border-cyan-500 text-cyan-300">
              <Activity className="w-5 h-5 animate-spin" />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
                <span>ACTIVE GRADE TRANSITION SEQUENCE (P-80GSM ➔ L-120GSM)</span>
                <span>PROGRESS: 64%</span>
              </div>
              <div className="h-3 w-full md:w-96 bg-gray-950 border border-gray-800 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-700 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                  style={{ width: "64%" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Predicted Off-Spec Waste:</span>
            <span className="text-amber-400 font-bold border border-amber-500/40 px-2 py-1 bg-amber-950/40">1.2 TONS (-28% vs Manual)</span>
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
        />
        <TelemetryMetric
          label="Basis Weight"
          tag="TAG_BW_02"
          value={78.4}
          unit="g/m²"
          target={80.0}
          status="WARNING"
        />
        <TelemetryMetric
          label="Machine Speed"
          tag="TAG_SPD_01"
          value={1150}
          unit="m/min"
          target={1200}
          status="NORMAL"
        />
        <TelemetryMetric
          label="Dryer 3 Steam Press"
          tag="TAG_STM_03"
          value={3.82}
          unit="bar"
          target={3.6}
          status="NORMAL"
        />
      </div>

      {/* Animated Recharts Telemetry Curve & Prescriptive AI Advisory Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Recharts Multi-line Telemetry Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              ANIMATED TELEMETRY TRANSITION CURVE (REAL-TIME DCS INGESTION)
            </CardTitle>
            <StatusIndicator status="NORMAL" label="INGESTION 100 Hz" />
          </CardHeader>
          <CardContent>
            <AnimatedTrendChart />
          </CardContent>
        </Card>

        {/* AI Prescriptive Control Panel (1 col) */}
        <Card className="border-amber-500/40">
          <CardHeader className="bg-amber-950/20">
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              PRESCRIPTIVE CONTROL ADVISORY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 bg-amber-950/30 border border-amber-500/30">
              <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                <span>PREDICTED MOISTURE OFFSET</span>
                <span className="text-[9px] bg-red-900/60 text-red-300 px-1.5 py-0.5 border border-red-500/40">HIGH RISK</span>
              </div>
              <p className="text-gray-300 text-[11px] mb-2">
                Moisture predicted to spike +1.4% above spec USL in 4 mins due to basis weight ramp.
              </p>

              <div className="p-2.5 bg-gray-950 border border-gray-800 text-gray-200 text-[11px] space-y-1">
                <div><strong>Action:</strong> Increase Steam Valve #3 by +0.25 bar</div>
                <div><strong>Current:</strong> 3.57 bar ➔ <strong>Target:</strong> 3.82 bar</div>
                <div><strong>AI Confidence:</strong> <span className="text-emerald-400 font-bold">96.4%</span></div>
              </div>

              <div className="mt-3">
                {recommendationApplied ? (
                  <div className="p-2 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-center font-bold text-[11px]">
                    ✓ ADVISORY DISPATCHED TO OPC-UA CONTROLLER
                  </div>
                ) : (
                  <Button variant="warning" size="sm" className="w-full" onClick={() => setRecommendationApplied(true)}>
                    DISPATCH ADVISORY TO DCS ➔
                  </Button>
                )}
              </div>
            </div>

            {/* Active Critical Alerts Mini-List */}
            <div className="p-3 bg-gray-900 border border-gray-800 space-y-2">
              <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center justify-between">
                <span>ACTIVE ALERTS</span>
                <span className="text-red-400">2 ACTIVE</span>
              </div>
              <div className="text-[11px] text-red-300 border-l-2 border-red-500 pl-2">
                Reel Moisture Sensor offset 8.2% vs target 6.8%.
              </div>
              <div className="text-[11px] text-amber-300 border-l-2 border-amber-500 pl-2">
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
            <CardTitle>PAPER MACHINE SECTION GAUGES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SensorGauge title="Wet End Vacuum #2" value={45.2} min={30} max={60} unit="kPa" status="NORMAL" />
            <SensorGauge title="Press Section Load #1" value={82.0} min={70} max={100} unit="kN/m" status="NORMAL" />
            <SensorGauge title="Caliper Reel Scanner" value={118} min={100} max={140} unit="µm" status="WARNING" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
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
        <div className="space-y-4 text-xs font-mono">
          <p className="text-gray-300">
            Confirm execution of grade transition sequence on <strong>PM-01 Paper Machine</strong>:
          </p>
          <div className="p-3 bg-gray-900 border border-industrial-border space-y-1">
            <div><strong>Source Grade:</strong> P-80GSM (Offset Copy Paper)</div>
            <div><strong>Target Grade:</strong> L-120GSM (Linerboard)</div>
            <div><strong>Est. Transition Time:</strong> 45 Minutes</div>
            <div><strong>AI Closed-Loop Safety:</strong> Bound within ±5% operator safety limit</div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>CANCEL</Button>
            <Button variant="cyan" size="sm" onClick={() => setIsModalOpen(false)}>CONFIRM & START RAMP ➔</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
