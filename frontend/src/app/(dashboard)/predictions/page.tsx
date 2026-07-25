"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  RefreshCw,
  Info,
  ShieldAlert,
  Layers,
} from "lucide-react";

// ─── Hardcoded XAI sample response (mirrors POST /api/v1/predictions/explain) ──

const SAMPLE_EXPLANATION = {
  off_spec_probability: 0.74,
  risk_label: "CRITICAL",
  confidence_score: 0.48,
  shap_base_value: 0.28,
  model_name: "XGBoost",
  model_version: "xgboost_v1",
  explanation_latency_ms: 38.4,
  status: "OK",
  narrative:
    "The AI model has identified a HIGH probability (74%) that this grade transition will produce off-specification paper. The primary drivers are Drying Capacity Adequacy, Machine Wire Speed, and Steam Pressure (Dryer Section). These factors combine to create conditions where the paper machine cannot reliably meet the target quality specifications for this grade change.",
  key_reasons: [
    "🌡️ Drying Capacity Adequacy (0.006 ratio — below normal range of 0.65–2.50 ratio): Dryer section does not have enough thermal capacity to dry this basis weight at the current machine speed. Sheet will leave wet.",
    "⚡ Machine Wire Speed (900.0 m/min — above normal range of 500–1000 m/min): Machine speed is higher than the historical average for this grade change. The sheet passes through the dryer too quickly to be fully dried.",
    "🔥 Steam Pressure (Dryer Section) (5.5 bar — below normal range of 6.0–10.5 bar): Steam pressure is below the minimum needed to dry the sheet at this machine speed. The sheet will exit the dryer section too wet.",
    "📈 Transition Rate of Change (3.2 g/m²/min — above normal range of 0–2.0 g/m²/min): Grade change is happening too fast for the dryer section to respond.",
    "📊 Grade Basis Weight Change (40.0 g/m² — above normal range of -30–30 g/m²): The grade jump in basis weight is very large.",
    "✅ Sheet Caliper / Thickness (140.0 µm): Sheet caliper is within target specification.",
    "✅ Headbox Stock Flow (350.0 L/min): Headbox stock flow is adequate for the current machine speed.",
  ],
  top_contributions: [
    {
      feature_name: "drying_adequacy_ratio",
      operator_name: "Drying Capacity Adequacy",
      unit: "ratio",
      category: "DRYING",
      icon: "🌡️",
      current_value: 0.006,
      shap_value: 0.21,
      contribution_pct: 24.1,
      direction: "INCREASES_RISK",
      operator_message: "Dryer section does not have enough thermal capacity to dry this basis weight at the current machine speed. Sheet will leave wet.",
      normal_range_low: 0.65,
      normal_range_high: 2.5,
      normal_label: "Normal: above 0.65",
      historical_status: "BELOW_NORMAL",
      historical_deviation_pct: -120.4,
    },
    {
      feature_name: "machine_speed_mpm",
      operator_name: "Machine Wire Speed",
      unit: "m/min",
      category: "SPEED",
      icon: "⚡",
      current_value: 900.0,
      shap_value: 0.18,
      contribution_pct: 20.6,
      direction: "INCREASES_RISK",
      operator_message: "Machine speed is higher than the historical average for this grade change. The sheet passes through the dryer too quickly to be fully dried.",
      normal_range_low: 500.0,
      normal_range_high: 1000.0,
      normal_label: "Normal: 500 – 1000 m/min",
      historical_status: "ABOVE_NORMAL",
      historical_deviation_pct: 60.0,
    },
    {
      feature_name: "steam_pressure_bar",
      operator_name: "Steam Pressure (Dryer Section)",
      unit: "bar",
      category: "DRYING",
      icon: "🔥",
      current_value: 5.5,
      shap_value: 0.14,
      contribution_pct: 16.1,
      direction: "INCREASES_RISK",
      operator_message: "Steam pressure is below the minimum needed to dry the sheet at this machine speed. The sheet will exit the dryer section too wet.",
      normal_range_low: 6.0,
      normal_range_high: 10.5,
      normal_label: "Normal: 6.0 – 10.5 bar",
      historical_status: "BELOW_NORMAL",
      historical_deviation_pct: -22.2,
    },
    {
      feature_name: "transition_momentum",
      operator_name: "Transition Rate of Change",
      unit: "g/m²/min",
      category: "SPEED",
      icon: "📈",
      current_value: 3.2,
      shap_value: 0.09,
      contribution_pct: 10.3,
      direction: "INCREASES_RISK",
      operator_message: "Grade change is happening too fast for the dryer section to respond. The rapid recipe change outpaces machine thermal response time.",
      normal_range_low: 0.0,
      normal_range_high: 2.0,
      normal_label: "Normal: below 2.0 g/m²/min",
      historical_status: "ABOVE_NORMAL",
      historical_deviation_pct: 220.0,
    },
    {
      feature_name: "delta_basis_weight",
      operator_name: "Grade Basis Weight Change",
      unit: "g/m²",
      category: "RECIPE",
      icon: "📊",
      current_value: 40.0,
      shap_value: 0.08,
      contribution_pct: 9.2,
      direction: "INCREASES_RISK",
      operator_message: "The grade jump in basis weight is very large — jumping from a light to a heavy grade in a short window.",
      normal_range_low: -30.0,
      normal_range_high: 30.0,
      normal_label: "Small change: ±30 g/m²",
      historical_status: "ABOVE_NORMAL",
      historical_deviation_pct: 33.3,
    },
    {
      feature_name: "moisture_pct",
      operator_name: "Sheet Moisture",
      unit: "%",
      category: "MOISTURE",
      icon: "💧",
      current_value: 7.2,
      shap_value: 0.06,
      contribution_pct: 6.9,
      direction: "INCREASES_RISK",
      operator_message: "Sheet moisture is rising above the acceptable limit. Paper leaving the machine is too wet.",
      normal_range_low: 5.0,
      normal_range_high: 7.0,
      normal_label: "Normal: 5.0 – 7.0 %",
      historical_status: "ABOVE_NORMAL",
      historical_deviation_pct: 20.0,
    },
    {
      feature_name: "recipe_similarity_score",
      operator_name: "Recipe Similarity",
      unit: "score",
      category: "RECIPE",
      icon: "🎯",
      current_value: 0.31,
      shap_value: 0.05,
      contribution_pct: 5.7,
      direction: "INCREASES_RISK",
      operator_message: "The source and target grades are very different — this is a large, complex grade change with high transition risk.",
      normal_range_low: 0.4,
      normal_range_high: 1.0,
      normal_label: "Normal: above 0.40",
      historical_status: "BELOW_NORMAL",
      historical_deviation_pct: -38.0,
    },
    {
      feature_name: "caliper_um",
      operator_name: "Sheet Caliper / Thickness",
      unit: "µm",
      category: "STOCK",
      icon: "📏",
      current_value: 140.0,
      shap_value: -0.04,
      contribution_pct: 4.6,
      direction: "DECREASES_RISK",
      operator_message: "Sheet caliper is within target specification.",
      normal_range_low: 80.0,
      normal_range_high: 180.0,
      normal_label: "Normal: 80 – 180 µm",
      historical_status: "WITHIN_NORMAL",
      historical_deviation_pct: 0.0,
    },
    {
      feature_name: "stock_flow_lpm",
      operator_name: "Headbox Stock Flow",
      unit: "L/min",
      category: "STOCK",
      icon: "🌊",
      current_value: 350.0,
      shap_value: -0.02,
      contribution_pct: 2.5,
      direction: "DECREASES_RISK",
      operator_message: "Headbox stock flow is adequate for the current machine speed.",
      normal_range_low: 250.0,
      normal_range_high: 500.0,
      normal_label: "Normal: 250 – 500 L/min",
      historical_status: "WITHIN_NORMAL",
      historical_deviation_pct: -6.7,
    },
  ],
};

// ─── Custom Tooltip for SHAP Bar Chart ───────────────────────────────────────
const SHAPTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] p-3 text-[10px] font-mono max-w-xs rounded-lg shadow-xl text-slate-800 dark:text-slate-200">
      <div className="font-bold text-slate-900 dark:text-slate-100 mb-1">{d.icon} {d.operator_name}</div>
      <div className="text-slate-500 dark:text-slate-400">Value: <span className="text-sky-700 dark:text-cyan-300 font-bold">{d.current_value.toFixed(2)} {d.unit}</span></div>
      <div className="text-slate-500 dark:text-slate-400">SHAP: <span className={d.shap_value > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>{d.shap_value > 0 ? "+" : ""}{d.shap_value.toFixed(4)}</span></div>
      <div className="text-slate-500 dark:text-slate-400">Contribution: <span className="text-amber-700 dark:text-amber-300 font-bold">{d.contribution_pct.toFixed(1)}%</span></div>
      <div className={`mt-1 font-bold ${d.direction === "INCREASES_RISK" ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
        {d.direction === "INCREASES_RISK" ? "▲ Increases Off-Spec Risk" : "▼ Reduces Off-Spec Risk"}
      </div>
      <div className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{d.operator_message.substring(0, 100)}...</div>
    </div>
  );
};

const HistoricalStatusBadge = ({ status }: { status: string }) => {
  if (status === "ABOVE_NORMAL") return (
    <span className="flex items-center gap-1 text-red-700 dark:text-red-400 text-[10px] font-bold font-mono">
      <TrendingUp className="w-3 h-3" /> ABOVE NORMAL
    </span>
  );
  if (status === "BELOW_NORMAL") return (
    <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 text-[10px] font-bold font-mono">
      <TrendingDown className="w-3 h-3" /> BELOW NORMAL
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold font-mono">
      <Minus className="w-3 h-3" /> WITHIN NORMAL
    </span>
  );
};

export default function PredictionExplainPage() {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(SAMPLE_EXPLANATION);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  // Prepare chart data — horizontal SHAP waterfall
  const chartData = explanation.top_contributions.map((c) => ({
    ...c,
    displayName: c.operator_name.length > 26 ? c.operator_name.substring(0, 24) + "…" : c.operator_name,
    value: c.contribution_pct,
    fill: c.direction === "INCREASES_RISK" ? "#ef4444" : "#10b981",
  }));

  const riskColors = {
    CRITICAL: { text: "text-red-700 dark:text-red-400", bg: "bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]", badge: "CRITICAL" },
    WARNING:  { text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]", badge: "WARNING" },
    NORMAL:   { text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/40", badge: "NORMAL" },
  };
  const riskStyle = riskColors[explanation.risk_label as keyof typeof riskColors] || riskColors.NORMAL;

  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="Explainable AI Prediction Engine"
        subtitle="SHAP-powered transparency — every prediction explained in plain operator language with contribution charts and historical comparisons."
      />

      {/* ── Verdict Banner ────────────────────────────────────────────────── */}
      <Card className={`p-5 border rounded-xl ${riskStyle.bg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 border rounded-xl ${riskStyle.bg}`}>
              <Brain className={`w-8 h-8 ${riskStyle.text}`} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest font-sans">AI QUALITY DEVIATION VERDICT</div>
              <div className={`text-3xl font-extrabold font-mono ${riskStyle.text}`}>
                {Math.round(explanation.off_spec_probability * 100)}% OFF-SPEC PROBABILITY
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Model: <span className="text-sky-700 dark:text-cyan-300 font-bold">{explanation.model_name}</span> •
                Version: <span className="text-slate-700 dark:text-slate-300">{explanation.model_version}</span> •
                Confidence: <span className="text-amber-700 dark:text-amber-300 font-bold">{Math.round(explanation.confidence_score * 100)}%</span> •
                Latency: <span className="text-slate-500 dark:text-slate-400">{explanation.explanation_latency_ms}ms</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <Badge status={explanation.risk_label as any}>{explanation.risk_label} ALERT</Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="flex items-center gap-1.5">
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />}
              REFRESH
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Narrative + Key Reasons ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
        <Card className="border-slate-200 dark:border-[#1e2945] bg-white dark:bg-[#0e1424]">
          <CardHeader className="bg-slate-50 dark:bg-[#0a0f1c]/80 border-b border-slate-200 dark:border-[#1e2945]">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-sans">
              <ShieldAlert className="w-4 h-4" /> WHY DID THE AI PREDICT FAILURE?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5 font-sans">
            <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed bg-amber-50/50 dark:bg-[#070a11] p-3.5 border-l-2 border-amber-500 rounded-r-lg">
              {explanation.narrative}
            </p>
            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase font-mono tracking-wider">KEY CONTRIBUTING FACTORS</div>
              {explanation.key_reasons.map((reason, i) => (
                <div
                  key={i}
                  className={`p-2.5 text-[11px] leading-relaxed border-l-2 rounded-r-lg ${
                    reason.startsWith("✅")
                      ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                      : "border-red-500 bg-red-50/60 dark:bg-red-950/20 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {reason}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SHAP base value & probability build-up */}
        <Card className="border-slate-200 dark:border-[#1e2945] bg-white dark:bg-[#0e1424]">
          <CardHeader className="bg-slate-50 dark:bg-[#0a0f1c]/80 border-b border-slate-200 dark:border-[#1e2945]">
            <CardTitle className="flex items-center gap-2 text-sky-800 dark:text-cyan-400 font-sans">
              <Layers className="w-4 h-4" /> SHAP PROBABILITY BUILD-UP
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold font-sans">How each factor shifts prediction from baseline</div>

            {/* Baseline */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-lg text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400 font-sans">📐 Model Baseline (Training Avg)</span>
              <span className="font-bold text-slate-900 dark:text-slate-200">{Math.round(explanation.shap_base_value * 100)}% off-spec</span>
            </div>

            {/* Top 5 SHAP deltas */}
            {explanation.top_contributions.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 border border-slate-200 dark:border-[#1e2945] rounded-lg text-[11px] font-mono">
                <span className="text-slate-800 dark:text-slate-300 font-sans">{c.icon} {c.operator_name}</span>
                <div className="flex items-center gap-2">
                  <div className={`h-2 rounded-full ${c.direction === "INCREASES_RISK" ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"}`}
                    style={{ width: `${Math.max(c.contribution_pct * 2, 8)}px` }}
                  />
                  <span className={`font-bold text-xs ${c.direction === "INCREASES_RISK" ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                    {c.direction === "INCREASES_RISK" ? "+" : "-"}{c.contribution_pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}

            {/* Final probability */}
            <div className={`flex items-center justify-between p-3 font-bold border rounded-lg text-sm font-mono ${riskStyle.bg} ${riskStyle.text}`}>
              <span className="font-sans">🎯 FINAL PREDICTION</span>
              <span>{Math.round(explanation.off_spec_probability * 100)}% OFF-SPEC</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── SHAP Contribution Bar Chart ───────────────────────────────────── */}
      <Card className="border-slate-200 dark:border-[#1e2945] bg-white dark:bg-[#0e1424]">
        <CardHeader className="bg-slate-50 dark:bg-[#0a0f1c]/80 border-b border-slate-200 dark:border-[#1e2945]">
          <CardTitle className="flex items-center gap-2 text-sky-800 dark:text-cyan-400 font-sans">
            <Zap className="w-4 h-4" /> FEATURE IMPORTANCE CHART — SHAP CONTRIBUTION (%)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-2 font-mono">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-4 font-sans">
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-red-500 rounded-sm inline-block" /> Increases off-spec risk</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-emerald-500 rounded-sm inline-block" /> Reduces off-spec risk</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 50, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 30]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                axisLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                width={200}
                tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<SHAPTooltip />} />
              <ReferenceLine x={0} stroke="#cbd5e1" />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Detailed Feature Cards with Historical Comparison ─────────────── */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 font-sans">
          DETAILED FACTOR ANALYSIS — CURRENT VALUE vs HISTORICAL NORMAL RANGE
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 font-mono">
          {explanation.top_contributions.map((c, i) => {
            const rangePct = Math.min(
              Math.max(
                ((c.current_value - c.normal_range_low) / (c.normal_range_high - c.normal_range_low)) * 100,
                0
              ),
              100
            );
            const isRisk = c.direction === "INCREASES_RISK";
            return (
              <Card
                key={i}
                className={`p-4 space-y-3 border rounded-xl text-xs transition-all ${
                  isRisk ? "border-red-200 dark:border-red-500/40 bg-white dark:bg-[#0e1424]" : "border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-[#0e1424]"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.icon}</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-tight font-sans">{c.operator_name}</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono">{c.category}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <HistoricalStatusBadge status={c.historical_status} />
                    <span className={`font-bold text-xs ${isRisk ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                      {c.contribution_pct.toFixed(1)}% impact
                    </span>
                  </div>
                </div>

                {/* Current Value */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Current Value</span>
                  <span className={`font-bold font-mono ${isRisk ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>
                    {c.current_value.toFixed(2)} {c.unit}
                  </span>
                </div>

                {/* Normal Range Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-mono">
                    <span>{c.normal_range_low}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-sans">{c.normal_label}</span>
                    <span>{c.normal_range_high}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-[#070a11] border border-slate-200 dark:border-[#1e2945] rounded-full relative overflow-hidden">
                    {/* Normal range shading */}
                    <div className="absolute inset-0 bg-emerald-100/60 dark:bg-emerald-950/40" />
                    {/* Current value marker */}
                    <div
                      className={`absolute top-0 bottom-0 w-1 rounded-full ${isRisk ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"}`}
                      style={{ left: `${Math.min(Math.max(rangePct, 2), 98)}%` }}
                    />
                  </div>
                </div>

                {/* SHAP Value + Operator Message */}
                <div className={`text-[10px] leading-relaxed p-2.5 border-l-2 rounded-r-lg font-sans ${isRisk ? "border-red-500 bg-red-50/60 dark:bg-red-950/20 text-slate-800 dark:text-slate-300" : "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"}`}>
                  {c.operator_message}
                </div>

                {/* SHAP value */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#1e2945] pt-2 font-mono">
                  <span>SHAP Value</span>
                  <span className={`font-bold ${isRisk ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                    {c.shap_value > 0 ? "+" : ""}{c.shap_value.toFixed(4)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
