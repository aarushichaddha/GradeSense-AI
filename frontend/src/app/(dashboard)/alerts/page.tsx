"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AlertsCenterPage() {
  const [acknowledgedList, setAcknowledgedList] = useState<string[]>([]);

  const handleAcknowledge = (id: string) => {
    setAcknowledgedList((prev) => [...prev, id]);
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="DCS Alarm Management & Alerts Center"
        subtitle="Centralized industrial alarm lifecycle manager: DETECTED ➔ ACKNOWLEDGED ➔ MITIGATED."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <Card className="border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 shadow-xs">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-red-700 dark:text-red-400 font-bold uppercase font-sans">UNACKNOWLEDGED ALARMS</div>
              <div className="text-2xl font-extrabold text-red-700 dark:text-red-400 font-mono mt-1">1 ALARM</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 animate-pulse" />
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase font-sans">WARNING ALERTS</div>
              <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 font-mono mt-1">1 ALERT</div>
            </div>
            <BellRing className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </CardContent>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs">
          <CardContent className="p-4.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase font-sans">ACKNOWLEDGED TODAY</div>
              <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-1">14 ALARMS</div>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-slate-800 dark:text-slate-100">ACTIVE DCS ALARM LOG TABLE</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ALARM ID</TableHead>
                <TableHead>SEVERITY</TableHead>
                <TableHead>PARAMETER NAME</TableHead>
                <TableHead>ALARM MESSAGE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>DETECTION TIME</TableHead>
                <TableHead>OPERATOR ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-red-700 dark:text-red-400 font-mono">ALT-8801</TableCell>
                <TableCell><Badge status="CRITICAL">CRITICAL</Badge></TableCell>
                <TableCell className="font-mono font-semibold text-slate-800 dark:text-slate-200">MOISTURE_REEL</TableCell>
                <TableCell className="text-slate-800 dark:text-slate-200 font-sans">Reel moisture deviation predicted +1.4% above spec USL in 4 mins.</TableCell>
                <TableCell>
                  {acknowledgedList.includes("ALT-8801") ? (
                    <Badge status="WARNING">ACKNOWLEDGED</Badge>
                  ) : (
                    <Badge status="CRITICAL">DETECTED</Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">14:12:05 UTC</TableCell>
                <TableCell>
                  {acknowledgedList.includes("ALT-8801") ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> ACKNOWLEDGED
                    </span>
                  ) : (
                    <Button variant="warning" size="sm" onClick={() => handleAcknowledge("ALT-8801")}>
                      ACK ALARM ➔
                    </Button>
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold text-amber-700 dark:text-amber-400 font-mono">ALT-8802</TableCell>
                <TableCell><Badge status="WARNING">WARNING</Badge></TableCell>
                <TableCell className="font-mono font-semibold text-slate-800 dark:text-slate-200">BASIS_WEIGHT</TableCell>
                <TableCell className="text-slate-800 dark:text-slate-200 font-sans">Basis weight offset -1.6 g/m² detected at scanner.</TableCell>
                <TableCell>
                  {acknowledgedList.includes("ALT-8802") ? (
                    <Badge status="WARNING">ACKNOWLEDGED</Badge>
                  ) : (
                    <Badge status="WARNING">DETECTED</Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-slate-700 dark:text-slate-300">14:08:22 UTC</TableCell>
                <TableCell>
                  {acknowledgedList.includes("ALT-8802") ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> ACKNOWLEDGED
                    </span>
                  ) : (
                    <Button variant="warning" size="sm" onClick={() => handleAcknowledge("ALT-8802")}>
                      ACK ALARM ➔
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
