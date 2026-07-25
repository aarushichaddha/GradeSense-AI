"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, ArrowRight, Play, CheckCircle } from "lucide-react";

export default function GradeTransitionsPage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Grade Transition Execution & Planning"
        subtitle="Manage active paper grade change sequences, target specifications, and predicted transition duration."
        actionText="SCHEDULE TRANSITION"
      />

      {/* Active Transition Status Banner */}
      <Card className="border-blue-500/50 bg-blue-950/20">
        <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-900/60 border border-blue-500 text-blue-300">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
            </div>
            <div>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">ACTIVE TRANSITION IN PROGRESS</div>
              <div className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <span>P-80GSM (Offset Fine Paper)</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                <span>L-120GSM (Linear Packaging Board)</span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-3 mt-1">
                <span>Progress: <strong className="text-emerald-400">64%</strong></span>
                <span>Est. Completion: <strong className="text-gray-200">14:45 UTC</strong></span>
                <span>Predicted Waste: <strong className="text-amber-400">1.2 Tons</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">PAUSE RAMP</Button>
            <Button variant="cyan" size="sm">OPTIMIZE TRANSITION CURVE ➔</Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Grade Transitions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
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
                <TableCell className="font-bold text-blue-400">TR-2026-089</TableCell>
                <TableCell>P-80GSM</TableCell>
                <TableCell>L-120GSM</TableCell>
                <TableCell>14:00 UTC</TableCell>
                <TableCell>45 Mins</TableCell>
                <TableCell className="text-amber-400">1.2 Tons</TableCell>
                <TableCell><Badge status="WARNING">IN TRANSITION</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm"><Play className="w-3.5 h-3.5" /></Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-gray-300">TR-2026-090</TableCell>
                <TableCell>L-120GSM</TableCell>
                <TableCell>K-150GSM</TableCell>
                <TableCell>18:30 UTC</TableCell>
                <TableCell>55 Mins</TableCell>
                <TableCell className="text-emerald-400">0.9 Tons</TableCell>
                <TableCell><Badge status="STANDBY">SCHEDULED</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm"><Play className="w-3.5 h-3.5" /></Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-gray-400">TR-2026-088</TableCell>
                <TableCell>N-70GSM</TableCell>
                <TableCell>P-80GSM</TableCell>
                <TableCell>08:15 UTC</TableCell>
                <TableCell>38 Mins</TableCell>
                <TableCell className="text-gray-400">0.8 Tons</TableCell>
                <TableCell><Badge status="NORMAL">COMPLETED</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /></Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
