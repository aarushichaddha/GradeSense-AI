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
    <div className="p-6 space-y-6">
      <PageHeader
        title="Quality Deviation & Defect Monitor"
        subtitle="Real-time predictive alerts for moisture, grammage, tensile strength, and caliper out-of-spec conditions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-500/50 bg-red-950/20">
          <CardContent className="p-4 flex items-center justify-between font-mono">
            <div>
              <div className="text-[10px] text-red-400 font-bold uppercase">ACTIVE ALARMS</div>
              <div className="text-2xl font-bold text-red-400">2 DEVIATIONS</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
          </CardContent>
        </Card>

        <Card className="border-amber-500/50 bg-amber-950/20">
          <CardContent className="p-4 flex items-center justify-between font-mono">
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase">PREDICTED RISKS (NEXT 15 MINS)</div>
              <div className="text-2xl font-bold text-amber-400">1 DEVIATION</div>
            </div>
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </CardContent>
        </Card>

        <Card className="border-emerald-500/50 bg-emerald-950/20">
          <CardContent className="p-4 flex items-center justify-between font-mono">
            <div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase">PREVENTED WASTE THIS SHIFT</div>
              <div className="text-2xl font-bold text-emerald-400">4.8 TONS</div>
            </div>
            <CheckSquare className="w-8 h-8 text-emerald-400" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ACTIVE & HISTORICAL DEVIATION LOGS</CardTitle>
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
                <TableCell className="font-bold text-red-400">DEV-9901</TableCell>
                <TableCell>MOISTURE REEL</TableCell>
                <TableCell>6.8%</TableCell>
                <TableCell className="text-red-400 font-bold">8.2% (+1.4%)</TableCell>
                <TableCell className="text-gray-300">DCS_DRY_SECTION_3</TableCell>
                <TableCell><Badge status="CRITICAL">CRITICAL</Badge></TableCell>
                <TableCell className="text-amber-400">ADVISORY PENDING</TableCell>
                <TableCell><Button variant="warning" size="sm">ACK ➔</Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-amber-400">DEV-9902</TableCell>
                <TableCell>BASIS WEIGHT</TableCell>
                <TableCell>80.0 g/m²</TableCell>
                <TableCell className="text-amber-400 font-bold">78.4 g/m² (-1.6)</TableCell>
                <TableCell className="text-gray-300">PULP_FEED_PUMP_02</TableCell>
                <TableCell><Badge status="WARNING">WARNING</Badge></TableCell>
                <TableCell className="text-emerald-400">MITIGATING</TableCell>
                <TableCell><Button variant="outline" size="sm">VIEW</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
