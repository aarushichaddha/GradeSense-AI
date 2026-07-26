"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { RefreshCw, Clock, ArrowRight, Play, CheckCircle2, Pause, Sparkles } from "lucide-react";

interface TransitionItem {
  id: string;
  source: string;
  target: string;
  time: string;
  duration: string;
  waste: string;
  status: "IN TRANSITION" | "SCHEDULED" | "COMPLETED";
}

const INITIAL_TRANSITIONS: TransitionItem[] = [
  { id: "TR-2026-089", source: "P-80GSM", target: "L-120GSM", time: "14:00 UTC", duration: "45 Mins", waste: "1.2 Tons", status: "IN TRANSITION" },
  { id: "TR-2026-090", source: "L-120GSM", target: "K-150GSM", time: "18:30 UTC", duration: "55 Mins", waste: "0.9 Tons", status: "SCHEDULED" },
  { id: "TR-2026-088", source: "N-70GSM", target: "P-80GSM", time: "08:15 UTC", duration: "38 Mins", waste: "0.8 Tons", status: "COMPLETED" },
];

export default function GradeTransitionsPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [transitions, setTransitions] = useState<TransitionItem[]>(INITIAL_TRANSITIONS);
  const [selectedTr, setSelectedTr] = useState<TransitionItem | null>(null);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleOptimize = () => {
    setIsOptimized(true);
    setTransitions((prev) =>
      prev.map((tr) => (tr.id === "TR-2026-089" ? { ...tr, waste: "0.7 Tons (-42%)" } : tr))
    );
  };

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="Grade Transition Execution & Planning"
        subtitle="Manage active paper grade change sequences, target specifications, and predicted transition duration."
        actionText="Schedule Transition"
        onAction={() => setSelectedTr(transitions[1])}
      />

      {/* Active Transition Status Banner */}
      <Card className="border-blue-500/30 bg-industrial-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl shrink-0">
              <RefreshCw className={`w-6 h-6 text-blue-400 ${isPaused ? "" : "animate-spin"}`} />
            </div>
            <div>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wider flex items-center gap-2">
                ACTIVE TRANSITION {isPaused ? "(PAUSED BY OPERATOR)" : "IN PROGRESS"}
              </div>
              <div className="text-lg font-bold text-zinc-100 flex items-center gap-2 mt-1">
                <span>P-80GSM (Fine Paper)</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <span>L-120GSM (Packaging Board)</span>
              </div>
              <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-4 mt-2">
                <span>Progress: <strong className="text-blue-400 font-bold">64%</strong></span>
                <span>Est. Completion: <strong className="text-zinc-200 font-semibold">14:45 UTC</strong></span>
                <span>Predicted Waste: <strong className="text-emerald-400 font-bold">{isOptimized ? "0.7 Tons (-42%)" : "1.2 Tons"}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant={isPaused ? "default" : "outline"}
              size="md"
              onClick={togglePause}
              className="font-semibold gap-1.5"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "Resume Ramp" : "Pause Ramp"}
            </Button>

            {isOptimized ? (
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Curve Optimized
              </div>
            ) : (
              <Button variant="default" size="md" onClick={handleOptimize} className="font-semibold gap-1.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-300" /> Optimize Transition Curve ➔
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Scheduled Grade Transitions Table */}
      <Card className="bg-industrial-card border-industrial-border">
        <CardHeader className="py-4 px-6 border-b border-industrial-border">
          <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Upcoming Grade Change Schedule (PM-01 Machine)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 font-sans">
          <Table>
            <TableHeader>
              <TableRow className="border-industrial-border">
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Transition ID</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Source Grade</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Target Grade</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Scheduled Start</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Est. Duration</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Predicted Waste</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Status</TableHead>
                <TableHead className="text-xs text-zinc-400 uppercase font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transitions.map((tr) => (
                <TableRow key={tr.id} className="border-industrial-border">
                  <TableCell className="text-xs font-bold text-blue-400">{tr.id}</TableCell>
                  <TableCell className="text-xs text-zinc-200 font-semibold">{tr.source}</TableCell>
                  <TableCell className="text-xs text-zinc-200 font-semibold">{tr.target}</TableCell>
                  <TableCell className="text-xs text-zinc-400">{tr.time}</TableCell>
                  <TableCell className="text-xs text-zinc-400">{tr.duration}</TableCell>
                  <TableCell className="text-xs font-bold text-amber-400">{tr.waste}</TableCell>
                  <TableCell>
                    <Badge variant={tr.status === "IN TRANSITION" ? "warning" : tr.status === "SCHEDULED" ? "default" : "success"}>
                      {tr.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTr(tr)}
                      className="h-8 px-2.5 text-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedTr && (
        <Modal isOpen={!!selectedTr} onClose={() => setSelectedTr(null)} title={`Transition Sequence — ${selectedTr.id}`}>
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 bg-industrial-bg border border-industrial-border rounded-xl space-y-2 text-zinc-300">
              <div><strong>Sequence:</strong> {selectedTr.source} ➔ {selectedTr.target}</div>
              <div><strong>Start Time:</strong> {selectedTr.time}</div>
              <div><strong>Duration:</strong> {selectedTr.duration}</div>
              <div><strong>Est. Waste:</strong> <span className="text-emerald-400 font-bold">{selectedTr.waste}</span></div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="default" size="sm" onClick={() => setSelectedTr(null)}>Confirm & Start Ramp</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
