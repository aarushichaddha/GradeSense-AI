"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AlertTriangle, ShieldAlert, CheckSquare, CheckCircle2, Eye } from "lucide-react";

interface DeviationLog {
  id: string;
  parameter: string;
  specTarget: string;
  actual: string;
  rootCause: string;
  severity: "CRITICAL" | "WARNING";
  status: string;
  isAck: boolean;
}

const INITIAL_DEVIATIONS: DeviationLog[] = [
  {
    id: "DEV-9901",
    parameter: "MOISTURE REEL",
    specTarget: "6.8%",
    actual: "8.2% (+1.4%)",
    rootCause: "DCS_DRY_SECTION_3",
    severity: "CRITICAL",
    status: "ADVISORY PENDING",
    isAck: false,
  },
  {
    id: "DEV-9902",
    parameter: "BASIS WEIGHT",
    specTarget: "80.0 g/m²",
    actual: "78.4 g/m² (-1.6)",
    rootCause: "PULP_FEED_PUMP_02",
    severity: "WARNING",
    status: "MITIGATING",
    isAck: false,
  },
];

export default function QualityDeviationsPage() {
  const [logs, setLogs] = useState<DeviationLog[]>(INITIAL_DEVIATIONS);
  const [selectedLog, setSelectedLog] = useState<DeviationLog | null>(null);

  const handleAcknowledge = (id: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === id ? { ...log, isAck: true, status: "ACKNOWLEDGED & MITIGATING" } : log
      )
    );
  };

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="Quality Deviation & Defect Monitor"
        subtitle="Real-time predictive alerts for moisture, grammage, tensile strength, and caliper out-of-spec conditions."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <Card className="border-red-500/30 bg-industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-red-400 font-semibold uppercase tracking-wider block mb-1">
                Active Deviations
              </span>
              <div className="text-3xl font-heading font-extrabold text-red-400">
                {logs.filter((l) => !l.isAck).length} DEVIATIONS
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse shrink-0" />
          </div>
        </Card>

        <Card className="border-amber-500/30 bg-industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                Predicted Risks (Next 15m)
              </span>
              <div className="text-3xl font-heading font-extrabold text-amber-400">1 RISK</div>
            </div>
            <ShieldAlert className="w-8 h-8 text-amber-400 shrink-0" />
          </div>
        </Card>

        <Card className="border-emerald-500/30 bg-industrial-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                Prevented Waste This Shift
              </span>
              <div className="text-3xl font-heading font-extrabold text-emerald-400">4.8 TONS</div>
            </div>
            <CheckSquare className="w-8 h-8 text-emerald-400 shrink-0" />
          </div>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="bg-industrial-card border-industrial-border">
        <CardHeader className="py-4 px-6 border-b border-industrial-border">
          <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Active & Historical Deviation Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 font-sans">
          <Table>
            <TableHeader>
              <TableRow className="border-industrial-border">
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Log ID</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Parameter</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Spec Target</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Actual Value</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Root Cause Tag</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Severity</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Status</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-industrial-border">
                  <TableCell className={`text-xs font-bold ${log.severity === "CRITICAL" ? "text-red-400" : "text-amber-400"}`}>
                    {log.id}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-200 font-medium">{log.parameter}</TableCell>
                  <TableCell className="text-xs text-zinc-400">{log.specTarget}</TableCell>
                  <TableCell className={`text-xs font-bold ${log.severity === "CRITICAL" ? "text-red-400" : "text-amber-400"}`}>
                    {log.actual}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400 font-mono">{log.rootCause}</TableCell>
                  <TableCell>
                    <Badge variant={log.severity === "CRITICAL" ? "danger" : "warning"}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-zinc-300">{log.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="h-8 px-2 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Button>

                      {log.isAck ? (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ACK
                        </span>
                      ) : (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleAcknowledge(log.id)}
                          className="h-8 px-3 text-xs font-semibold"
                        >
                          ACK ➔
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Detail Modal */}
      {selectedLog && (
        <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title={`Root Cause Details — ${selectedLog.id}`}>
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 bg-industrial-bg border border-industrial-border rounded-xl space-y-2 text-zinc-300">
              <div><strong>Parameter:</strong> {selectedLog.parameter}</div>
              <div><strong>Spec Target:</strong> {selectedLog.specTarget}</div>
              <div><strong>Actual Value:</strong> <span className="text-red-400 font-bold">{selectedLog.actual}</span></div>
              <div><strong>Root Cause Sensor:</strong> <code className="text-blue-400">{selectedLog.rootCause}</code></div>
              <div><strong>Recommended Fix:</strong> Adjust Steam Valve #3 (+0.25 bar) to balance dryer heat profile.</div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="default" size="sm" onClick={() => setSelectedLog(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
