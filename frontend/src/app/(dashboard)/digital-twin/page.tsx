"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  Cpu,
  Zap,
  Gauge,
  Sliders,
  TrendingDown,
  TrendingUp,
  Clock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Flame,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function DigitalTwinPage() {
  // Interactive What-If Slider State
  const [machineSpeed, setMachineSpeed] = useState<number>(825);
  const [steamPressure, setSteamPressure] = useState<number>(6.25);
  const [stockFlow, setStockFlow] = useState<number>(385);
  const [moisture, setMoisture] = useState<number>(6.8);
  const [basisWeight, setBasisWeight] = useState<number>(120);
  const [sourceGrade, setSourceGrade] = useState<string>("Fine Copy 80g");
  const [targetGrade, setTargetGrade] = useState<string>("Linerboard 120g");

  // Simulated Outputs State
  const [simulating, setSimulating] = useState(false);
  const [riskScore, setRiskScore] = useState<number>(24.5);
  const [riskLabel, setRiskLabel] = useState<"NORMAL" | "WARNING" | "CRITICAL">("NORMAL");
  const [qualityIndex, setQualityIndex] = useState<number>(89.2);
  const [stabilizationTime, setStabilizationTime] = useState<number>(14.2);
  const [wasteTons, setWasteTons] = useState<number>(1.18);

  // Recalculate Simulation Outputs dynamically whenever sliders change
  useEffect(() => {
    // Real-time calculation logic based on paper machine physics
    const speedFactor = machineSpeed / 800.0;
    const steamRatio = steamPressure / (basisWeight * machineSpeed * 1e-4);
    
    // Higher speed + low steam = higher risk
    const rawRisk = Math.min(
      95.0,
      Math.max(8.0, (speedFactor * 35.0) + (1.0 / max(steamRatio, 0.1) * 8.0) + (moisture > 7.5 ? 20.0 : 0.0) - 15.0)
    );

    const calcRisk = Math.round(rawRisk * 10) / 10;
    setRiskScore(calcRisk);
    setRiskLabel(calcRisk > 65 ? "CRITICAL" : calcRisk > 35 ? "WARNING" : "NORMAL");
    setQualityIndex(Math.round(Math.max(35.0, 100.0 - calcRisk * 0.7) * 10) / 10);
    
    const timeCalc = Math.round((12.0 + (calcRisk * 0.15) + (speedFactor * 3.0)) * 10) / 10;
    setStabilizationTime(timeCalc);
    
    const wasteCalc = Math.round((machineSpeed * 6.0 * (basisWeight * 1e-6) * timeCalc * (0.5 + (calcRisk / 100))) * 100) / 100;
    setWasteTons(wasteCalc);
  }, [machineSpeed, steamPressure, stockFlow, moisture, basisWeight]);

  function max(a: number, b: number) {
    return a > b ? a : b;
  }

  // Presets handlers
  const handlePresetEco = () => {
    setMachineSpeed(750);
    setSteamPressure(6.5);
    setStockFlow(360);
    setMoisture(6.4);
    setBasisWeight(120);
  };

  const handlePresetThroughput = () => {
    setMachineSpeed(1050);
    setSteamPressure(5.2);
    setStockFlow(420);
    setMoisture(7.8);
    setBasisWeight(120);
  };

  const handlePresetOptimal = () => {
    setMachineSpeed(825);
    setSteamPressure(6.25);
    setStockFlow(385);
    setMoisture(6.8);
    setBasisWeight(120);
  };

  // Generate 30-min trajectory points
  const timelineData = Array.from({ length: 16 }, (_, i) => {
    const t = i * 2;
    const progress = Math.min(1.0, t / max(1.0, stabilizationTime));
    const decay = Math.exp(-3.2 * progress);
    const mVal = Math.round((6.2 + (moisture - 6.2) * decay + (riskScore > 50 ? 0.8 * (1 - progress) : 0.0)) * 100) / 100;
    const bwVal = Math.round((basisWeight + (80.0 - basisWeight) * decay) * 10) / 10;

    return {
      time: `${t}m`,
      timeOffset: t,
      moisture: mVal,
      basisWeight: bwVal,
      targetMoistureUpper: 6.6,
      targetMoistureLower: 5.8,
    };
  });

  // Calculate paper machine section thermal/process loads
  const dryingLoad = Math.min(100, Math.round((machineSpeed * basisWeight * 1e-4) / (steamPressure * 0.15) * 65));
  const headboxLoad = Math.min(100, Math.round((stockFlow / 450) * 78));
  const pressLoad = Math.min(100, Math.round((machineSpeed / 1000) * 82));
  const reelLoad = Math.min(100, Math.round((machineSpeed / 1100) * 72));

  const sections = [
    { name: "HEADBOX & DILUTION", load: headboxLoad, temp: "48°C", icon: "🚿" },
    { name: "FOURDRINIER WIRE", load: headboxLoad, temp: "52°C", icon: "🌀" },
    { name: "PRESS DEWATERING", load: pressLoad, temp: "65°C", icon: "⚙️" },
    { name: "DRYER GROUP 1", load: dryingLoad, temp: "145°C", icon: "🔥" },
    { name: "DRYER GROUP 2", load: Math.min(100, dryingLoad + 6), temp: "168°C", icon: "♨️" },
    { name: "CALENDER & REEL", load: reelLoad, temp: "35°C", icon: "📜" },
  ];

  return (
    <div className="p-6 space-y-6 font-mono">
      <PageHeader
        title="Digital Twin Real-Time Simulator & What-If Sandbox"
        subtitle="Interactive process parameter tuning, live quality trajectory simulation, section load heatmaps, and waste prediction."
      />

      {/* Preset Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-900 border border-industrial-border">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>WHAT-IF PRESET CONFIGURATIONS:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePresetEco} className="text-xs">
            🌿 ECO ENERGY (LOW SPEED / EFFICIENT)
          </Button>
          <Button variant="outline" size="sm" onClick={handlePresetThroughput} className="text-xs">
            🚀 MAX THROUGHPUT (HIGH SPEED / HIGH RISK)
          </Button>
          <Button variant="cyan" size="sm" onClick={handlePresetOptimal} className="text-xs">
            🎯 AI RECOMMENDED OPTIMAL (BALANCED)
          </Button>
        </div>
      </div>

      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>OFF-SPEC RISK SCORE</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-bold ${riskScore > 65 ? "text-red-400" : riskScore > 35 ? "text-amber-400" : "text-emerald-400"}`}>
              {riskScore}
            </span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
          <div className="mt-1">
            <Badge status={riskLabel}>{riskLabel} RISK</Badge>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>EXPECTED QUALITY INDEX</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">{qualityIndex}%</div>
          <div className="w-full h-1.5 bg-gray-950 border border-gray-800 mt-2 overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${qualityIndex}%` }} />
          </div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>PREDICTED STABILIZATION TIME</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-cyan-300 mt-1">{stabilizationTime} min</div>
          <div className="text-[10px] text-gray-400 mt-1">Time to reach target specification</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>PREDICTED BROKE / WASTE</span>
            <Trash2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-rose-400 mt-1">{wasteTons} Tons</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -0.92 Tons saved vs baseline setup
          </div>
        </Card>
      </div>

      {/* Main Sandbox Grid: Left Controls (1 col), Right Visualizations (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive Parameter Control Panel */}
        <Card className="border-cyan-500/40">
          <CardHeader className="bg-cyan-950/20">
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Sliders className="w-4 h-4" /> WHAT-IF PROCESS PARAMETERS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-xs">
            {/* Grade Selection */}
            <div className="space-y-3 pb-3 border-b border-gray-800">
              <Select
                label="Source Grade (Currently Running)"
                value={sourceGrade}
                onChange={(e) => setSourceGrade(e.target.value)}
                options={[
                  { label: "Fine Copy Paper 80g", value: "Fine Copy 80g" },
                  { label: "Kraft Linerboard 100g", value: "Kraft Liner 100g" },
                  { label: "Specialty Offset 70g", value: "Specialty Offset 70g" },
                ]}
              />
              <Select
                label="Target Grade (Transition Destination)"
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                options={[
                  { label: "Linerboard 120g", value: "Linerboard 120g" },
                  { label: "Heavy Fluting 140g", value: "Fluting 140g" },
                  { label: "Coated Art 100g", value: "Coated Art 100g" },
                ]}
              />
            </div>

            {/* Slider 1: Machine Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-gray-300">Machine Wire Speed</span>
                <span className="text-cyan-400">{machineSpeed} m/min</span>
              </div>
              <input
                type="range"
                min="400"
                max="1300"
                step="10"
                value={machineSpeed}
                onChange={(e) => setMachineSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-gray-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>400 m/min</span>
                <span>Normal: 800 m/min</span>
                <span>1300 m/min</span>
              </div>
            </div>

            {/* Slider 2: Steam Pressure */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-gray-300">Dryer Steam Pressure</span>
                <span className="text-amber-400">{steamPressure.toFixed(2)} bar</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="11.0"
                step="0.25"
                value={steamPressure}
                onChange={(e) => setSteamPressure(Number(e.target.value))}
                className="w-full accent-amber-400 bg-gray-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>3.0 bar</span>
                <span>Normal: 6.5 bar</span>
                <span>11.0 bar</span>
              </div>
            </div>

            {/* Slider 3: Stock Flow */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-gray-300">Headbox Stock Flow</span>
                <span className="text-emerald-400">{stockFlow} L/min</span>
              </div>
              <input
                type="range"
                min="200"
                max="600"
                step="5"
                value={stockFlow}
                onChange={(e) => setStockFlow(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-gray-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>200 L/min</span>
                <span>Normal: 380 L/min</span>
                <span>600 L/min</span>
              </div>
            </div>

            {/* Slider 4: Moisture */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-gray-300">Initial Sheet Moisture</span>
                <span className="text-blue-400">{moisture.toFixed(1)} %</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="10.0"
                step="0.1"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full accent-blue-400 bg-gray-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>4.0 %</span>
                <span>Target: 6.2 %</span>
                <span>10.0 %</span>
              </div>
            </div>

            {/* Slider 5: Basis Weight Target */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-gray-300">Target Basis Weight</span>
                <span className="text-purple-400">{basisWeight} g/m²</span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                step="5"
                value={basisWeight}
                onChange={(e) => setBasisWeight(Number(e.target.value))}
                className="w-full accent-purple-400 bg-gray-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>50 g/m²</span>
                <span>Target: 120 g/m²</span>
                <span>180 g/m²</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Visualizations (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Animated 2D Paper Machine Section Thermal Loads */}
          <Card>
            <CardHeader className="bg-gray-900/60 border-b border-industrial-border">
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Flame className="w-4 h-4" /> ANIMATED PAPER MACHINE SECTION THERMAL & PROCESS LOADS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                {sections.map((sec, i) => (
                  <div
                    key={i}
                    className={`p-3 border space-y-2 transition-all ${
                      sec.load > 85
                        ? "border-red-500/50 bg-red-950/20"
                        : sec.load > 75
                        ? "border-amber-500/50 bg-amber-950/20"
                        : "border-gray-800 bg-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>{sec.icon} {sec.name}</span>
                      <span className="text-cyan-300">{sec.temp}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-300">LOAD</span>
                      <span className={`font-bold text-sm ${sec.load > 85 ? "text-red-400" : sec.load > 75 ? "text-amber-400" : "text-emerald-400"}`}>
                        {sec.load}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-950 border border-gray-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          sec.load > 85 ? "bg-red-400" : sec.load > 75 ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                        style={{ width: `${sec.load}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Trajectory Timeline Chart */}
          <Card>
            <CardHeader className="bg-gray-900/60 border-b border-industrial-border">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-cyan-400">
                  <Activity className="w-4 h-4" /> SIMULATED MOISTURE & BASIS WEIGHT SETTLING TIMELINE
                </span>
                <Badge status="NORMAL">STABILIZES IN {stabilizationTime} MIN</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-2">
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <YAxis yAxisId="left" domain={[4, 10]} stroke="#6b7280" tick={{ fontSize: 10, fill: "#9ca3af" }} label={{ value: "Moisture (%)", angle: -90, position: "insideLeft", fill: "#38bdf8", fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[60, 140]} stroke="#6b7280" tick={{ fontSize: 10, fill: "#9ca3af" }} label={{ value: "Basis Wt (g/m²)", angle: 90, position: "insideRight", fill: "#c084fc", fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#374151", fontSize: "11px", fontFamily: "monospace" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                  <ReferenceLine yAxisId="left" y={6.2} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Target Moisture (6.2%)", fill: "#10b981", fontSize: 9 }} />
                  <Line yAxisId="left" type="monotone" dataKey="moisture" name="Sheet Moisture (%)" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="basisWeight" name="Basis Weight (g/m²)" stroke="#c084fc" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
