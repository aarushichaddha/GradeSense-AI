"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, CheckSquare } from "lucide-react";

export default function QualityDeviationsPage() {
  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="Quality Deviation & Defect Monitor"
        subtitle="Real-time predictive alerts for moisture, grammage, tensile strength, and caliper out-of-spec conditions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <Card className="border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 shadow-xs">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-red-700 dark:text-red-400 font-bold uppercase font-sans">ACTIVE ALARMS</div>
              <div className="text-2xl font-extrabold text-red-700 dark:text-red-400 font-mono mt-1">2 DEVIATIONS</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 animate-pulse" />
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase font-sans">PREDICTED RISKS (NEXT 15 MINS)</div>
              <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 font-mono mt-1">1 DEVIATION</div>
            </div>
            <ShieldAlert className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </CardContent>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase font-sans">PREVENTED WASTE THIS SHIFT</div>
              <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-1">4.8 TONS</div>
            </div>
            <CheckSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-slate-800 dark:text-slate-100">ACTIVE & HISTORICAL DEVIATION LOGS</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>LOG ID</TableHead>
                <TableHead>PARAMETER</TableHead>
                <TableHead>SPEC TARGET</TableHead>
                <TableHead>PREDICTED / ACTUAL</TableHead>
                <TableHead>ROOT CAUSE TAG</TableHead>
                <TableHead>SEVERITY</TableHead>
                <TableHead>ACTION STATUS</TableHead>
                <TableHead>ACKNOWLEDGE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-red-700 dark:text-red-400 font-mono">DEV-9901</TableCell>
                <TableCell className="font-bold text-slate-800 dark:text-slate-200">MOISTURE REEL</TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">6.8%</TableCell>
                <TableCell className="text-red-700 dark:text-red-400 font-bold font-mono">8.2% (+1.4%)</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 font-mono">DCS_DRY_SECTION_3</TableCell>
                <TableCell><Badge status="CRITICAL">CRITICAL</Badge></TableCell>
                <TableCell className="text-amber-700 dark:text-amber-400 font-semibold font-mono">ADVISORY PENDING</TableCell>
                <TableCell><Button variant="warning" size="sm">ACK ➔</Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-amber-700 dark:text-amber-400 font-mono">DEV-9902</TableCell>
                <TableCell className="font-bold text-slate-800 dark:text-slate-200">BASIS WEIGHT</TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">80.0 g/m²</TableCell>
                <TableCell className="text-amber-700 dark:text-amber-400 font-bold font-mono">78.4 g/m² (-1.6)</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 font-mono">PULP_FEED_PUMP_02</TableCell>
                <TableCell><Badge status="WARNING">WARNING</Badge></TableCell>
                <TableCell className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">MITIGATING</TableCell>
                <TableCell><Button variant="outline" size="sm">VIEW</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
