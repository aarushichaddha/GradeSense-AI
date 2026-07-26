"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Brain, AlertTriangle, CheckCircle2, Zap, Play } from "lucide-react";
import { useTheme } from "@/context/theme-context";

// Sample SHAP Explanation Data
const SAMPLE_EXPLANATION = {
  off_spec_probability: 0.74,
  risk_label: "CRITICAL",
  confidence_score: 0.94,
  model_name: "XGBoost + LightGBM Ensemble",
  narrative:
    "The AI model predicts a 74% off-spec risk during this transition window. The primary driver is an imbalance between Machine Speed (900 m/min) and Dryer Steam Pressure (5.5 bar), leading to insufficient sheet drying capacity.",
  top_contributions: [
    { name: "Drying Capacity Ratio", shap: +0.21, pct: "+24%", risk: true, val: "0.006 (Low)" },
    { name: "Machine Speed", shap: +0.18, pct: "+21%", risk: true, val: "900 m/min" },
    { name: "Steam Pressure", shap: +0.14, pct: "+16%", risk: true, val: "5.5 bar (Low)" },
    { name: "Stock Flow", shap: -0.09, pct: "-10%", risk: false, val: "350 L/min (Safe)" },
  ],
};

export default function PredictionsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [speed, setSpeed] = useState(900);
  const [steam, setSteam] = useState(5.5);
  const [stockFlow, setStockFlow] = useState(350);
  const [basisWeight, setBasisWeight] = useState(120);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(SAMPLE_EXPLANATION);

  const handlePredict = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const riskRatio = (speed / 1000) * (6.0 / (steam || 1));
      const offSpecProb = Math.min(0.95, Math.max(0.12, riskRatio * 0.45));
      const isCritical = offSpecProb > 0.6;
      const isWarning = offSpecProb > 0.35;

      setPrediction({
        off_spec_probability: parseFloat(offSpecProb.toFixed(2)),
        risk_label: isCritical ? "CRITICAL" : isWarning ? "WARNING" : "SAFE",
        confidence_score: 0.94,
        model_name: "XGBoost + LightGBM Ensemble",
        narrative: isCritical
          ? `High off-spec risk (${(offSpecProb * 100).toFixed(0)}%) detected. High machine speed (${speed} m/min) relative to steam pressure (${steam} bar) reduces moisture evaporation time.`
          : isWarning
          ? `Moderate off-spec risk (${(offSpecProb * 100).toFixed(0)}%). Process parameters are near boundary bounds.`
          : `Process parameters within safe bounds (${(offSpecProb * 100).toFixed(0)}% off-spec risk). High probability of on-spec transition.`,
        top_contributions: [
          { name: "Machine Speed", shap: speed > 900 ? +0.22 : -0.08, pct: speed > 900 ? "+22%" : "-8%", risk: speed > 900, val: `${speed} m/min` },
          { name: "Steam Pressure", shap: steam < 6.0 ? +0.19 : -0.12, pct: steam < 6.0 ? "+19%" : "-12%", risk: steam < 6.0, val: `${steam} bar` },
          { name: "Stock Flow", shap: -0.08, pct: "-9%", risk: false, val: `${stockFlow} L/min` },
          { name: "Target Basis Weight", shap: basisWeight > 100 ? +0.10 : -0.05, pct: basisWeight > 100 ? "+10%" : "-5%", risk: basisWeight > 100, val: `${basisWeight} g/m²` },
        ],
      });
      setIsAnalyzing(false);
    }, 400);
  };

  const chartData = prediction.top_contributions.map((c) => ({
    name: c.name,
    shap: c.shap,
    risk: c.risk,
    pct: c.pct,
    val: c.val,
  }));

  const gridColor = isLight ? "#cbd5e1" : "#272a34";
  const textColor = isLight ? "#475569" : "#8e95a5";
  const tooltipBg = isLight ? "#ffffff" : "#14171f";
  const tooltipBorder = isLight ? "#cbd5e1" : "#272a34";
  const tooltipText = isLight ? "#0f172a" : "#f4f4f5";

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="AI Quality Predictor & SHAP Explainer"
        subtitle="Predict off-spec quality risks before grade changes and understand key feature drivers."
      />

      {/* Input Parameters Bar (12 Cols) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <Card className="bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                Live Process Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input
                  label="Machine Speed (m/min)"
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                />
                <Input
                  label="Steam Pressure (bar)"
                  type="number"
                  step="0.1"
                  value={steam}
                  onChange={(e) => setSteam(Number(e.target.value))}
                />
                <Input
                  label="Stock Flow (L/min)"
                  type="number"
                  value={stockFlow}
                  onChange={(e) => setStockFlow(Number(e.target.value))}
                />
                <Input
                  label="Target Basis Weight (g/m²)"
                  type="number"
                  value={basisWeight}
                  onChange={(e) => setBasisWeight(Number(e.target.value))}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="default"
                  size="md"
                  onClick={handlePredict}
                  disabled={isAnalyzing}
                  className="gap-2 font-semibold shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isAnalyzing ? "Running Model Inference..." : "Run AI Prediction"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Prediction Output & SHAP Drivers (12 Cols) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Risk Score & Summary (col-span-4) */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-400" />
                Prediction Output
              </CardTitle>
              <Badge
                variant={
                  prediction.risk_label === "CRITICAL"
                    ? "danger"
                    : prediction.risk_label === "WARNING"
                    ? "warning"
                    : "success"
                }
              >
                {prediction.risk_label}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-xs">
              <div className="p-6 bg-industrial-bg border border-industrial-border rounded-xl text-center">
                <div className="text-xs text-zinc-400 font-medium uppercase mb-1">
                  Predicted Off-Spec Risk
                </div>
                <div
                  className={`text-4xl font-heading font-extrabold ${
                    prediction.risk_label === "CRITICAL"
                      ? "text-red-400"
                      : prediction.risk_label === "WARNING"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {(prediction.off_spec_probability * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-zinc-400 mt-2 font-medium">
                  Model Confidence: <strong className="text-zinc-200">94%</strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-zinc-400 font-semibold uppercase">
                  AI Explanation Summary
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed p-4 bg-industrial-bg border border-industrial-border rounded-xl font-sans">
                  {prediction.narrative}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SHAP Feature Contribution Chart (col-span-8) */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                SHAP Feature Contribution (Risk Drivers)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-56 w-full font-sans">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                    <XAxis type="number" stroke={textColor} tick={{ fontSize: 11, fill: textColor }} />
                    <YAxis type="category" dataKey="name" stroke={textColor} tick={{ fontSize: 11, fill: textColor }} width={140} />
                    <Tooltip
                      contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontSize: "11px", borderRadius: "8px" }}
                      formatter={(val: number) => [`${val > 0 ? "+" : ""}${val.toFixed(2)} SHAP`, "Contribution"]}
                    />
                    <Bar dataKey="shap" radius={[0, 6, 6, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.risk ? "#ef4444" : "#10b981"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Key Drivers List */}
              <div className="mt-6 pt-4 border-t border-industrial-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                {prediction.top_contributions.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-industrial-bg border border-industrial-border rounded-xl">
                    <div className="flex items-center gap-2.5">
                      {c.risk ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span className="text-zinc-200 font-semibold">{c.name}</span>
                    </div>
                    <span className={c.risk ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                      {c.pct}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
