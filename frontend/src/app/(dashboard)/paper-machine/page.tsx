"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SensorGauge } from "@/components/ui/sensor-gauge";
import { Gauge, Cpu, Flame } from "lucide-react";

export default function PaperMachinePage() {
  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="PM-01 Paper Machine DCS Telemetry Detail"
        subtitle="Live sensor readouts from Wet End, Press Section, Dryer Group, and Reel Scanner."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <Card className="bg-white dark:bg-[#0e1424] border-slate-200 dark:border-[#1e2945] shadow-xs">
          <CardHeader className="bg-slate-50 dark:bg-[#0b101d] border-b border-slate-200 dark:border-[#1e2945]">
            <CardTitle className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-sans">
              <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" /> WET END & HEADBOX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 p-5">
            <SensorGauge title="Headbox Total Pressure" value={142} min={100} max={180} unit="kPa" status="NORMAL" />
            <SensorGauge title="Slice Opening" value={24.5} min={20} max={30} unit="mm" status="NORMAL" />
            <SensorGauge title="Stock Consistency" value={0.85} min={0.6} max={1.2} unit="%" status="NORMAL" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0e1424] border-slate-200 dark:border-[#1e2945] shadow-xs">
          <CardHeader className="bg-slate-50 dark:bg-[#0b101d] border-b border-slate-200 dark:border-[#1e2945]">
            <CardTitle className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-sans">
              <Gauge className="w-4 h-4 text-sky-600 dark:text-sky-400" /> PRESS SECTION DEWATERING
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 p-5">
            <SensorGauge title="Press #1 Linear Load" value={78} min={60} max={100} unit="kN/m" status="NORMAL" />
            <SensorGauge title="Press #2 Shoe Vacuum" value={45.2} min={35} max={55} unit="kPa" status="NORMAL" />
            <SensorGauge title="Sheet Solids Pre-Dryer" value={42.0} min={38} max={46} unit="%" status="NORMAL" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#0e1424] border-slate-200 dark:border-[#1e2945] shadow-xs">
          <CardHeader className="bg-slate-50 dark:bg-[#0b101d] border-b border-slate-200 dark:border-[#1e2945]">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-sans">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" /> DRYER SECTION & CANOPY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 p-5">
            <SensorGauge title="Dryer Group 1 Steam" value={2.1} min={1.5} max={3.0} unit="bar" status="NORMAL" />
            <SensorGauge title="Dryer Group 3 Steam" value={3.82} min={3.0} max={4.0} unit="bar" status="WARNING" />
            <SensorGauge title="Pocket Ventilation Air Temp" value={115} min={90} max={130} unit="°C" status="NORMAL" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
