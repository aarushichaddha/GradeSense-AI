"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Radio, Cpu, ShieldCheck } from "lucide-react";

export default function AdminSystemPage() {
  return (
    <div className="p-6 space-y-6 font-mono">
      <PageHeader
        title="DCS System Administration & Audit Logs"
        subtitle="Monitor database connection pools, OPC-UA telemetry throughput, AI inference engine health, and operator audit trails."
      />

      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>POSTGRES DB POOL</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">HEALTHY</div>
          <div className="text-[10px] text-gray-400 mt-1">4 Active / 20 Max Connections</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>INGESTION RATE</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400 mt-1">100 Hz</div>
          <div className="text-[10px] text-gray-400 mt-1">1,420 Active Tags Ingesting</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>AI ENGINE INFERENCE</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">ONLINE</div>
          <div className="text-[10px] text-gray-400 mt-1">XGBoost v2.4.1 • Latency: 14ms</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>FASTAPI SERVER UPTIME</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">720.5 HRS</div>
          <div className="text-[10px] text-emerald-400 mt-1">0 Critical Faults</div>
        </Card>
      </div>

      {/* Operator Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> SYSTEM AUDIT LOGS (OPERATOR ACTIONS & AI OVERRIDES)
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
                <TableCell className="font-bold text-blue-400">AUD-5501</TableCell>
                <TableCell>J. Miller (operator_01)</TableCell>
                <TableCell className="text-emerald-400 font-bold">APPLIED_AI_ADVISORY</TableCell>
                <TableCell>Recommendation #REC-401</TableCell>
                <TableCell className="text-gray-300">Increased Steam Valve #3 by +0.25 bar</TableCell>
                <TableCell>14:15:32 UTC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-gray-400">AUD-5500</TableCell>
                <TableCell>J. Miller (operator_01)</TableCell>
                <TableCell>EXECUTE_GRADE_CHANGE</TableCell>
                <TableCell>Transition #TR-2026-089</TableCell>
                <TableCell className="text-gray-300">Started transition P-80GSM ➔ L-120GSM</TableCell>
                <TableCell>14:00:00 UTC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-gray-400">AUD-5499</TableCell>
                <TableCell>S. Chen (engineer_01)</TableCell>
                <TableCell>UPDATE_RECIPE</TableCell>
                <TableCell>Recipe #50000000-01</TableCell>
                <TableCell className="text-gray-300">Updated dryer steam setpoints</TableCell>
                <TableCell>09:30:15 UTC</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
