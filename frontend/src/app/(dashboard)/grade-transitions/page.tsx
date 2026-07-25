"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransitionTrendChart } from "@/components/charts/transition-trend-chart";
import { RefreshCw, Play, ArrowRight, CheckCircle2, Clock, Activity, Zap } from "lucide-react";

export default function GradeTransitionsPage() {
  const [activeStep, setActiveStep] = useState(2); // Step 2 active

  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="Grade Change & Ramp Sequence Management"
        subtitle="Execute, monitor, and automate paper grade transitions with closed-loop AI setpoint advisories."
        actionText="START NEW TRANSITION"
      />

      {/* Active Transition Progress Banner */}
      <Card className="border-sky-200 dark:border-[#1e2945] bg-gradient-to-r from-sky-50/80 via-white to-blue-50/60 dark:from-[#0b101d] dark:via-[#0e1424] dark:to-[#10172a] shadow-xs">
        <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-xl text-sky-700 dark:text-sky-300">
              <RefreshCw className="w-6 h-6 animate-spin text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-sans">ACTIVE RAMP SEQUENCE #TR-2026-089</span>
                <Badge status="NORMAL">IN PROGRESS</Badge>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono flex items-center gap-4">
                <span>Progress: <strong className="text-emerald-700 dark:text-emerald-400">64%</strong></span>
                <span>Est. Completion: <strong className="text-slate-800 dark:text-slate-200">14:45 UTC</strong></span>
                <span>Predicted Waste: <strong className="text-amber-700 dark:text-amber-400">1.2 Tons</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-mono">
            <Button variant="outline" size="sm">PAUSE RAMP</Button>
            <Button variant="cyan" size="sm">OPTIMIZE TRANSITION CURVE ➔</Button>
          </div>
        </CardContent>
      </Card>


      {/* Transition Ramp Sequence Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans text-slate-800 dark:text-slate-100">
            <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            ACTIVE TRANSITION RAMP SEQUENCE STEPS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-300 font-bold font-sans">
                <span>STEP 1 • COMPLETED</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Stock Flow Adjustment</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">Ramped headbox dilution from 360 L/min to 385 L/min.</p>
            </div>

            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-400 dark:border-sky-500 rounded-xl space-y-1 shadow-2xs animate-pulse">
              <div className="flex items-center justify-between text-[10px] text-sky-800 dark:text-sky-300 font-bold font-sans">
                <span>STEP 2 • IN PROGRESS (64%)</span>
                <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-spin" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Steam Group #3 Ramp</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">Stepping steam pressure +0.25 bar to compensate basis weight.</p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-xl space-y-1 opacity-70">
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold font-sans">
                <span>STEP 3 • UPCOMING</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Machine Wire Speed Step</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">Decelerating wire speed to 825 m/min for caliper target.</p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-xl space-y-1 opacity-70">
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold font-sans">
                <span>STEP 4 • UPCOMING</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Quality Lock & Verification</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">Scanner verification & closed-loop lock on 120.0 g/m².</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Grade Transitions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans text-slate-800 dark:text-slate-100">
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            UPCOMING GRADE CHANGE SCHEDULE (PM-01 MACHINE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TRANSITION ID</TableHead>
                <TableHead>SOURCE GRADE</TableHead>
                <TableHead>TARGET GRADE</TableHead>
                <TableHead>SCHEDULED START</TableHead>
                <TableHead>EST. DURATION</TableHead>
                <TableHead>PREDICTED WASTE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-sky-700 dark:text-sky-400 font-mono">TR-2026-089</TableCell>
                <TableCell className="font-bold text-slate-800 dark:text-slate-200">P-80GSM</TableCell>
                <TableCell className="font-bold text-slate-900 dark:text-slate-100">L-120GSM</TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">14:00 UTC</TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">45 Mins</TableCell>
                <TableCell className="text-amber-700 dark:text-amber-400 font-bold font-mono">1.2 Tons</TableCell>
                <TableCell><Badge status="WARNING">IN TRANSITION</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm"><Play className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /></Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-slate-600 dark:text-slate-400 font-mono">TR-2026-090</TableCell>
                <TableCell className="text-slate-700 dark:text-slate-300">L-120GSM</TableCell>
                <TableCell className="text-slate-700 dark:text-slate-300">K-150GSM</TableCell>
                <TableCell className="font-mono text-slate-600 dark:text-slate-400">18:30 UTC</TableCell>
                <TableCell className="font-mono text-slate-600 dark:text-slate-400">55 Mins</TableCell>
                <TableCell className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">0.9 Tons</TableCell>
                <TableCell><Badge status="STANDBY">SCHEDULED</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm"><Play className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /></Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-slate-500 dark:text-slate-400 font-mono">TR-2026-088</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">N-70GSM</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">P-80GSM</TableCell>
                <TableCell className="font-mono text-slate-600 dark:text-slate-400">08:15 UTC</TableCell>
                <TableCell className="font-mono text-slate-600 dark:text-slate-400">38 Mins</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 font-mono">0.8 Tons</TableCell>
                <TableCell><Badge status="NORMAL">COMPLETED</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /></Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
