"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Recommendation {
  id: string;
  parameter: string;
  current: string;
  recommended: string;
  reason: string;
  impact: string;
  confidence: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-1",
    parameter: "Dryer Section Steam Pressure",
    current: "5.50 bar",
    recommended: "6.25 bar (+0.75)",
    reason: "Low thermal drying capacity for 120 g/m² target grade. Prevents post-press moisture spikes.",
    impact: "Reduces predicted off-spec risk from 74% to <12%. Saves ~1.4 tons of paper waste.",
    confidence: 94,
    priority: "CRITICAL",
    status: "PENDING",
  },
  {
    id: "rec-2",
    parameter: "Machine Wire Speed",
    current: "900 m/min",
    recommended: "825 m/min (-75)",
    reason: "Transition momentum exceeds dryer response rate. Lowering speed ensures web drying residence time.",
    impact: "Eliminates wet-end sheet break risk during basis weight ramp.",
    confidence: 89,
    priority: "HIGH",
    status: "PENDING",
  },
  {
    id: "rec-3",
    parameter: "Headbox Stock Flow Dilution",
    current: "350 L/min",
    recommended: "385 L/min (+35)",
    reason: "Headbox loading ratio is under-diluted. Increasing stock flow improves sheet formation.",
    impact: "Improves Cross-Direction (CD) basis weight uniformity profile by +16%.",
    confidence: 92,
    priority: "MEDIUM",
    status: "ACCEPTED",
  },
];

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPTED">("ALL");

  const handleAction = (id: string, newStatus: "ACCEPTED" | "REJECTED") => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredRecs = recommendations.filter((r) =>
    filter === "ALL" ? true : r.status === filter
  );

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="AI Prescriptive Setpoint Recommendations"
        subtitle="AI-generated setpoint adjustments to minimize stabilization time and eliminate paper waste."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-industrial-border pb-4">
        {(["ALL", "PENDING", "ACCEPTED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === tab
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-industrial-card"
            }`}
          >
            {tab === "ALL" ? "All Recommendations" : tab === "PENDING" ? "Pending Approval" : "Accepted & Dispatched"} ({recommendations.filter((r) => tab === "ALL" ? true : r.status === tab).length})
          </button>
        ))}
      </div>

      {/* Recommendation List */}
      <div className="space-y-6 font-sans">
        {filteredRecs.map((rec) => (
          <Card
            key={rec.id}
            className={`border-industrial-border ${
              rec.status === "ACCEPTED" ? "bg-industrial-card/50 opacity-80" : "bg-industrial-card"
            }`}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-industrial-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg shrink-0">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-base font-heading font-bold text-zinc-100">{rec.parameter}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={rec.priority === "CRITICAL" ? "danger" : rec.priority === "HIGH" ? "warning" : "default"}>
                    {rec.priority}
                  </Badge>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {rec.confidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Setpoint change details */}
              <div className="p-4 bg-industrial-bg border border-industrial-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-zinc-400 font-medium block uppercase mb-0.5">Current Setpoint</span>
                    <span className="text-zinc-200 font-bold text-sm">{rec.current}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-xs text-blue-400 font-medium block uppercase mb-0.5">Recommended</span>
                    <span className="text-blue-300 font-bold text-sm">{rec.recommended}</span>
                  </div>
                </div>

                {/* Status or Actions */}
                {rec.status === "PENDING" ? (
                  <div className="flex items-center gap-2.5">
                    <Button variant="danger" size="sm" onClick={() => handleAction(rec.id, "REJECTED")} className="rounded-lg">
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                    <Button variant="success" size="sm" onClick={() => handleAction(rec.id, "ACCEPTED")} className="rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept & Dispatch
                    </Button>
                  </div>
                ) : (
                  <span className={`text-xs font-semibold flex items-center gap-1.5 ${rec.status === "ACCEPTED" ? "text-emerald-400" : "text-red-400"}`}>
                    {rec.status === "ACCEPTED" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {rec.status === "ACCEPTED" ? "Dispatched to DCS" : "Rejected"}
                  </span>
                )}
              </div>

              {/* Rationale & Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
                <div className="p-4 bg-industrial-bg/60 border border-industrial-border rounded-xl leading-relaxed">
                  <strong className="text-zinc-400 block text-xs font-semibold uppercase mb-1">AI Rationale:</strong>
                  {rec.reason}
                </div>
                <div className="p-4 bg-industrial-bg/60 border border-industrial-border rounded-xl leading-relaxed">
                  <strong className="text-emerald-400 block text-xs font-semibold uppercase mb-1">Expected Impact:</strong>
                  {rec.impact}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
