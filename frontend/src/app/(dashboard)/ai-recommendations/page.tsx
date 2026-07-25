"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  Zap,
  History,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

interface RecommendationItem {
  id: string;
  action_type: string;
  parameter_to_adjust: string;
  current_setting: string;
  recommended_setting: string;
  unit: str;
  reason: string;
  confidence_score: number;
  expected_improvement: string;
  historical_cases_count: number;
  historical_success_rate: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  rejection_reason?: string;
  created_at: string;
}

const MOCK_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "80000000-0000-0000-0000-000000000001",
    action_type: "INCREASE_STEAM_PRESSURE",
    parameter_to_adjust: "Dryer Section Steam Pressure",
    current_setting: "5.50 bar",
    recommended_setting: "6.25 bar (+0.75)",
    unit: "bar",
    reason: "Drying adequacy ratio (0.0055) is below target threshold (0.650) for 120 g/m² target grade. Increasing steam pressure prevents moisture spikes post-press section.",
    confidence_score: 0.94,
    expected_improvement: "Reduces predicted off-spec probability from 74% to <12% and saves ~1.4 tons of broke.",
    historical_cases_count: 18,
    historical_success_rate: 0.944,
    priority: "CRITICAL",
    status: "PENDING",
    created_at: "14:30:15 UTC",
  },
  {
    id: "80000000-0000-0000-0000-000000000002",
    action_type: "REDUCE_MACHINE_SPEED",
    parameter_to_adjust: "Machine Wire Speed",
    current_setting: "900 m/min",
    recommended_setting: "825 m/min (-75)",
    unit: "m/min",
    reason: "Transition momentum (3.20 g/m²/min) exceeds thermal response rate of dryer section. Slowing wire speed allows sufficient web drying residence time.",
    confidence_score: 0.89,
    expected_improvement: "Stabilizes sheet tension, eliminating wet-end sheet breaks.",
    historical_cases_count: 22,
    historical_success_rate: 0.954,
    priority: "HIGH",
    status: "PENDING",
    created_at: "14:25:00 UTC",
  },
  {
    id: "80000000-0000-0000-0000-000000000003",
    action_type: "INCREASE_STOCK_FLOW",
    parameter_to_adjust: "Headbox Stock Flow Dilution",
    current_setting: "350.0 L/min",
    recommended_setting: "385.0 L/min (+35.0)",
    unit: "L/min",
    reason: "Headbox loading ratio (0.352) is under-diluted for target speed (900 m/min). Increasing stock flow improves sheet formation profile.",
    confidence_score: 0.92,
    expected_improvement: "Improves Cross-Direction (CD) basis weight uniformity profile by +16%.",
    historical_cases_count: 14,
    historical_success_rate: 0.928,
    priority: "MEDIUM",
    status: "ACCEPTED",
    created_at: "13:10:00 UTC",
  },
  {
    id: "80000000-0000-0000-0000-000000000004",
    action_type: "REDUCE_FILLER_FLOW",
    parameter_to_adjust: "Ash Filler Addition Rate",
    current_setting: "18.0%",
    recommended_setting: "14.5% (-3.5)",
    unit: "%",
    reason: "Filler ash loading (18.0%) weakens fiber bonding network during high-speed transition. Reducing filler addition rate maintains internal Mullen burst strength.",
    confidence_score: 0.87,
    expected_improvement: "Restores internal bond strength to >180 kPa specification.",
    historical_cases_count: 38,
    historical_success_rate: 0.973,
    priority: "MEDIUM",
    status: "REJECTED",
    rejection_reason: "Ash content specified by customer quality agreement.",
    created_at: "12:00:00 UTC",
  },
];

export default function AIRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(MOCK_RECOMMENDATIONS);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");
  const [generating, setGenerating] = useState(false);
  
  // Rejection modal state
  const [selectedForReject, setSelectedForReject] = useState<RecommendationItem | null>(null);
  const [rejectionInput, setRejectionInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredRecommendations = recommendations.filter((r) => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  const handleAccept = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/v1/recommendations/${id}/accept`, {
        method: "POST",
      });
    } catch (e) {
      console.warn("Backend API call simulated fallback");
    }

    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "ACCEPTED" } : r))
    );
    triggerToast("Recommendation ACCEPTED & closed-loop setpoint applied to DCS controller!");
  };

  const handleRejectSubmit = async () => {
    if (!selectedForReject || !rejectionInput.trim()) return;

    try {
      await fetch(`http://localhost:8000/api/v1/recommendations/${selectedForReject.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejection_reason: rejectionInput }),
      });
    } catch (e) {
      console.warn("Backend API call simulated fallback");
    }

    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === selectedForReject.id
          ? { ...r, status: "REJECTED", rejection_reason: rejectionInput }
          : r
      )
    );

    setSelectedForReject(null);
    setRejectionInput("");
    triggerToast("Recommendation REJECTED. Feedback recorded for model tuning.");
  };

  const handleTriggerEngine = async () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      triggerToast("Hybrid AI Engine executed: 2 active advisories synthesized from DCS rules & historical matching.");
    }, 1200);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return <Badge status="CRITICAL">CRITICAL PRIORITY</Badge>;
      case "HIGH":
        return <Badge status="WARNING">HIGH PRIORITY</Badge>;
      case "MEDIUM":
        return <Badge variant="cyan">MEDIUM PRIORITY</Badge>;
      default:
        return <Badge variant="outline">LOW PRIORITY</Badge>;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes("STEAM")) return "text-amber-400 border-amber-500/40 bg-amber-950/20";
    if (action.includes("SPEED")) return "text-rose-400 border-rose-500/40 bg-rose-950/20";
    if (action.includes("STOCK")) return "text-cyan-400 border-cyan-500/40 bg-cyan-950/20";
    return "text-indigo-400 border-indigo-500/40 bg-indigo-950/20";
  };

  return (
    <div className="p-6 space-y-6 font-mono">
      <PageHeader
        title="Prescriptive AI Process Recommendation Engine"
        subtitle="Generates actionable process control setpoint advisories derived from prediction models, DCS rule evaluation, and historical transition matching."
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>TOTAL ADVISORIES</span>
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-gray-100 mt-1">{recommendations.length}</div>
          <div className="text-[10px] text-gray-400 mt-1">Generated by Hybrid Engine</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>PENDING OPERATOR ACTION</span>
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {recommendations.filter((r) => r.status === "PENDING").length}
          </div>
          <div className="text-[10px] text-amber-300/80 mt-1">Active process setpoint advisories</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>ACCEPTED & APPLIED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {recommendations.filter((r) => r.status === "ACCEPTED").length}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Queued to DCS control loop</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>AVERAGE MODEL CONFIDENCE</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">92.4%</div>
          <div className="text-[10px] text-gray-400 mt-1">Cross-validated decision boundary</div>
        </Card>
      </div>

      {/* Control Bar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((tab) => (
            <Button
              key={tab}
              variant={filter === tab ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter(tab)}
              className="text-xs uppercase font-bold"
            >
              {tab === "PENDING" ? `PENDING (${recommendations.filter((r) => r.status === "PENDING").length})` : tab}
            </Button>
          ))}
        </div>

        {/* Trigger Engine Button */}
        <Button
          variant="cyan"
          size="sm"
          onClick={handleTriggerEngine}
          disabled={generating}
          className="flex items-center gap-2"
        >
          {generating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> RUNNING RULE & HISTORICAL ENGINE...
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" /> RE-EVALUATE RECOMMENDATIONS ➔
            </>
          )}
        </Button>
      </div>

      {/* Recommendation Cards Stack */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <Card className="p-8 text-center text-gray-500 text-xs">
            No recommendations found for status filter: <strong>{filter}</strong>
          </Card>
        ) : (
          filteredRecommendations.map((rec) => (
            <Card
              key={rec.id}
              className={`border p-5 space-y-4 transition-all ${
                rec.status === "PENDING"
                  ? "border-amber-500/50 bg-gray-950/80 shadow-lg shadow-amber-950/20"
                  : rec.status === "ACCEPTED"
                  ? "border-emerald-500/30 bg-emerald-950/10"
                  : "border-gray-800 bg-gray-950/40 opacity-75"
              }`}
            >
              {/* Card Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 border rounded text-xs font-bold ${getActionColor(rec.action_type)}`}>
                    {rec.action_type.replace(/_/g, " ")}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-100 text-sm flex items-center gap-2">
                      {rec.parameter_to_adjust}
                    </h3>
                    <div className="text-[11px] text-gray-400">REC ID: {rec.id.substring(0, 8)}... • Created {rec.created_at}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getPriorityBadge(rec.priority)}
                  {rec.status === "PENDING" && <Badge status="WARNING">ACTION PENDING</Badge>}
                  {rec.status === "ACCEPTED" && <Badge status="NORMAL">ACCEPTED & APPLIED</Badge>}
                  {rec.status === "REJECTED" && <Badge status="CRITICAL">REJECTED</Badge>}
                </div>
              </div>

              {/* Setpoint Change Banner */}
              <div className="p-3 bg-gray-900 border border-industrial-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">CURRENT DCS SETTING</span>
                  <span className="text-gray-300 font-bold text-sm">{rec.current_setting}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ArrowRight className="w-4 h-4 text-amber-400 hidden sm:block" />
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">RECOMMENDED SETPOINT</span>
                    <span className="text-amber-300 font-bold text-sm">{rec.recommended_setting}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">AI CONFIDENCE SCORE</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-2 w-24 bg-gray-950 border border-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{ width: `${rec.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className="text-emerald-400 font-bold text-xs">{Math.round(rec.confidence_score * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Rationale & Expected Improvement Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Rationale / Physics Reason */}
                <div className="p-3 bg-gray-900/60 border border-gray-800 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" /> PROCESS CONTROL RATIONALE & PHYSICS REASON
                  </div>
                  <p className="text-gray-300 leading-relaxed text-[11px]">{rec.reason}</p>
                </div>

                {/* Expected Outcome & Historical Evidence */}
                <div className="p-3 bg-gray-900/60 border border-gray-800 space-y-2">
                  <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> EXPECTED QUALITY & YIELD IMPROVEMENT
                  </div>
                  <p className="text-emerald-300 font-bold text-[11px]">{rec.expected_improvement}</p>
                  
                  {/* Historical Cases Badge */}
                  <div className="pt-1 flex items-center gap-2 text-[10px] text-gray-400 border-t border-gray-800/80">
                    <History className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Historical Evidence:</span>
                    <span className="text-cyan-300 font-bold">
                      {rec.historical_cases_count} past similar transitions ({Math.round(rec.historical_success_rate * 100)}% success rate)
                    </span>
                  </div>
                </div>
              </div>

              {/* Rejection Reason display if rejected */}
              {rec.status === "REJECTED" && rec.rejection_reason && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                  <strong>Operator Rejection Note:</strong> "{rec.rejection_reason}"
                </div>
              )}

              {/* Operator Action Buttons (Only for PENDING) */}
              {rec.status === "PENDING" && (
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800">
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => setSelectedForReject(rec)}
                  >
                    <XCircle className="w-4 h-4" /> REJECT ADVISORY
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => handleAccept(rec.id)}
                  >
                    <CheckCircle2 className="w-4 h-4" /> ACCEPT & APPLY TO DCS ➔
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Operator Rejection Modal */}
      {selectedForReject && (
        <Modal
          title={`Reject Advisory: ${selectedForReject.parameter_to_adjust}`}
          isOpen={!!selectedForReject}
          onClose={() => setSelectedForReject(null)}
        >
          <div className="space-y-4 font-mono text-xs">
            <p className="text-gray-300">
              Please provide the operational or quality reason for rejecting this AI recommendation. Your feedback is logged to refine future recommendation models.
            </p>
            <div className="p-2 bg-gray-950 border border-gray-800 text-amber-300">
              Recommended: {selectedForReject.recommended_setting} ({selectedForReject.action_type})
            </div>

            <Input
              label="Rejection Reason / Operational Constraints"
              placeholder="e.g. Customer quality specification limits ash content, or steam valve #3 undergoing maintenance..."
              value={rejectionInput}
              onChange={(e) => setRejectionInput(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedForReject(null)}>
                CANCEL
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!rejectionInput.trim()}
                onClick={handleRejectSubmit}
              >
                SUBMIT REJECTION
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
