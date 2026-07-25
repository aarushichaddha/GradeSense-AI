"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Radio, Cpu, ShieldCheck } from "lucide-react";

export default function AdminSystemPage() {
  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="DCS System Administration & Audit Logs"
        subtitle="Monitor database connection pools, OPC-UA telemetry throughput, AI inference engine health, and operator audit trails."
      />

      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <Card className="p-4 bg-white dark:bg-[#0e1424]/80 border-slate-200 dark:border-[#1e2945] shadow-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-sans">
            <span>POSTGRES DB POOL</span>
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1.5 font-mono">HEALTHY</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-sans">4 Active / 20 Max Connections</div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#0e1424]/80 border-slate-200 dark:border-[#1e2945] shadow-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-sans">
            <span>INGESTION RATE</span>
            <Radio className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-sky-700 dark:text-cyan-400 mt-1.5 font-mono">100 Hz</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-sans">1,420 Active Tags Ingesting</div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#0e1424]/80 border-slate-200 dark:border-[#1e2945] shadow-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-sans">
            <span>AI ENGINE INFERENCE</span>
            <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1.5 font-mono">ONLINE</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-sans">XGBoost v2.4.1 • Latency: 14ms</div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#0e1424]/80 border-slate-200 dark:border-[#1e2945] shadow-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-sans">
            <span>FASTAPI SERVER UPTIME</span>
            <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1.5 font-mono">720.5 HRS</div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1 font-sans">0 Critical Faults</div>
        </Card>
      </div>

      {/* Operator Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans text-slate-800 dark:text-slate-100">
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-cyan-400" /> SYSTEM AUDIT LOGS (OPERATOR ACTIONS & AI OVERRIDES)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>LOG ID</TableHead>
                <TableHead>OPERATOR / USER</TableHead>
                <TableHead>ACTION PERFORMED</TableHead>
                <TableHead>TARGET ENTITY</TableHead>
                <TableHead>DETAILS</TableHead>
                <TableHead>TIMESTAMP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-sky-700 dark:text-cyan-400 font-mono">AUD-5501</TableCell>
                <TableCell className="font-sans font-semibold text-slate-800 dark:text-slate-200">J. Miller (operator_01)</TableCell>
                <TableCell><Badge status="NORMAL">APPLIED_AI_ADVISORY</Badge></TableCell>
                <TableCell className="font-mono text-slate-600 dark:text-slate-300">Recommendation #REC-401</TableCell>
                <TableCell className="text-slate-700 dark:text-slate-300 font-sans">Increased Steam Valve #3 by +0.25 bar</TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">14:15:32 UTC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-slate-500 dark:text-slate-400 font-mono">AUD-5500</TableCell>
                <TableCell className="font-sans text-slate-700 dark:text-slate-300">J. Miller (operator_01)</TableCell>
                <TableCell><Badge status="WARNING">EXECUTE_GRADE_CHANGE</Badge></TableCell>
                <TableCell className="font-mono text-slate-500 dark:text-slate-400">Transition #TR-2026-089</TableCell>
                <TableCell className="text-slate-700 dark:text-slate-300 font-sans">Started transition P-80GSM ➔ L-120GSM</TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">14:00:00 UTC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-slate-500 dark:text-slate-400 font-mono">AUD-5499</TableCell>
                <TableCell className="font-sans text-slate-700 dark:text-slate-300">S. Chen (engineer_01)</TableCell>
                <TableCell><Badge variant="outline">UPDATE_RECIPE</Badge></TableCell>
                <TableCell className="font-mono text-slate-500 dark:text-slate-400">Recipe #50000000-01</TableCell>
                <TableCell className="text-slate-700 dark:text-slate-300 font-sans">Updated dryer steam setpoints</TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">09:30:15 UTC</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
