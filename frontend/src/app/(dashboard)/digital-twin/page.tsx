"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { Cpu, Sliders, RotateCcw } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export default function DigitalTwinPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Slider Controls State
  const [machineSpeed, setMachineSpeed] = useState<number>(850);
  const [steamPressure, setSteamPressure] = useState<number>(6.5);
  const [stockFlow, setStockFlow] = useState<number>(380);
  const [moisture, setMoisture] = useState<number>(6.8);
  const [basisWeight, setBasisWeight] = useState<number>(120);

  // Simulated Outputs State
  const [riskScore, setRiskScore] = useState<number>(22.4);
  const [qualityIndex, setQualityIndex] = useState<number>(91.5);
  const [stabilizationTime, setStabilizationTime] = useState<number>(13.5);
  const [wasteTons, setWasteTons] = useState<number>(1.12);

  // Physics simulation logic
  useEffect(() => {
    const speedRatio = machineSpeed / 800.0;
    const dryingCapacity = steamPressure / (basisWeight * machineSpeed * 1e-4);
    
    const rawRisk = Math.min(
      92.0,
      Math.max(8.0, speedRatio * 32.0 + (1.0 / Math.max(dryingCapacity, 0.1)) * 7.5 + (moisture > 7.5 ? 18.0 : 0.0) - 14.0)
    );

    const calcRisk = Math.round(rawRisk * 10) / 10;
    setRiskScore(calcRisk);
    setQualityIndex(Math.round(Math.max(40.0, 100.0 - calcRisk * 0.65) * 10) / 10);
    
    const timeCalc = Math.round((11.5 + calcRisk * 0.14 + speedRatio * 2.5) * 10) / 10;
    setStabilizationTime(timeCalc);
    
    const wasteCalc = Math.round((machineSpeed * 5.8 * (basisWeight * 1e-6) * timeCalc * (0.5 + calcRisk / 100)) * 100) / 100;
    setWasteTons(wasteCalc);
  }, [machineSpeed, steamPressure, stockFlow, moisture, basisWeight]);

  // Presets
  const setOptimal = () => {
    setMachineSpeed(820);
    setSteamPressure(7.2);
    setStockFlow(375);
    setMoisture(6.5);
    setBasisWeight(120);
  };

  const setEco = () => {
    setMachineSpeed(750);
    setSteamPressure(6.2);
    setStockFlow(350);
    setMoisture(6.4);
    setBasisWeight(120);
  };

  const setMaxSpeed = () => {
    setMachineSpeed(1050);
    setSteamPressure(5.5);
    setStockFlow(420);
    setMoisture(7.8);
    setBasisWeight(120);
  };

  // Trajectory chart data generator
  const generateTrajectoryData = () => {
    const data = [];
    for (let min = 0; min <= 30; min += 2) {
      const settleFactor = Math.exp(-min / (stabilizationTime / 2.2));
      const moistVal = +(moisture + (7.8 - moisture) * settleFactor).toFixed(2);
      const weightVal = +(basisWeight + (80 - basisWeight) * settleFactor).toFixed(1);
      data.push({
        time: `${min}m`,
        moisture: moistVal,
        basisWeight: weightVal,
        targetMoisture: 6.8,
        targetWeight: basisWeight,
      });
    }
    return data;
  };

  const trajectoryData = generateTrajectoryData();

  const gridColor = isLight ? "#cbd5e1" : "#272a34";
  const textColor = isLight ? "#475569" : "#8e95a5";
  const tooltipBg = isLight ? "#ffffff" : "#14171f";
  const tooltipBorder = isLight ? "#cbd5e1" : "#272a34";
  const tooltipText = isLight ? "#0f172a" : "#f4f4f5";

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="Digital Twin Simulator & What-If Sandbox"
        subtitle="Simulate grade transition outcomes in real time before sending setpoints to physical DCS."
      />

      {/* 12-Column Grid — Simulated Outcome Cards */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="bg-industrial-card border-industrial-border p-6 text-center">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Quality Index</div>
            <div className="text-3xl font-heading font-extrabold text-emerald-400 mt-1">{qualityIndex}%</div>
            <div className="text-xs text-zinc-400 mt-2 font-medium">Expected On-Spec Output</div>
          </Card>
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="bg-industrial-card border-industrial-border p-6 text-center">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Off-Spec Risk</div>
            <div className={`text-3xl font-heading font-extrabold mt-1 ${riskScore > 50 ? "text-red-400" : riskScore > 25 ? "text-amber-400" : "text-emerald-400"}`}>
              {riskScore}%
            </div>
            <div className="text-xs text-zinc-400 mt-2 font-medium">Predicted Deviation Risk</div>
          </Card>
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="bg-industrial-card border-industrial-border p-6 text-center">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Stabilization Time</div>
            <div className="text-3xl font-heading font-extrabold text-blue-400 mt-1">{stabilizationTime} min</div>
            <div className="text-xs text-zinc-400 mt-2 font-medium">Machine Settling Duration</div>
          </Card>
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <Card className="bg-industrial-card border-industrial-border p-6 text-center">
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Predicted Waste</div>
            <div className="text-3xl font-heading font-extrabold text-zinc-100 mt-1">{wasteTons} Tons</div>
            <div className="text-xs text-zinc-400 mt-2 font-medium">Off-Spec Paper Waste</div>
          </Card>
        </div>
      </div>

      {/* Main Workspace: 4 Cols Sliders + 8 Cols Trajectory Graph */}
      <div className="grid grid-cols-12 gap-6">
        {/* Slider Controls Panel (col-span-4) */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Setpoint Controls
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={setOptimal} className="h-7 text-xs px-2.5 text-blue-400 font-semibold">
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-5 text-xs">
              {/* Presets Bar */}
              <div className="grid grid-cols-3 gap-2 border-b border-industrial-border pb-4">
                <button onClick={setOptimal} className="py-2 px-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors">
                  AI Optimal
                </button>
                <button onClick={setEco} className="py-2 px-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg cursor-pointer hover:bg-emerald-500/20 transition-colors">
                  Eco Energy
                </button>
                <button onClick={setMaxSpeed} className="py-2 px-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg cursor-pointer hover:bg-amber-500/20 transition-colors">
                  Max Speed
                </button>
              </div>

              {/* Sliders */}
              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-zinc-400">Machine Speed:</span>
                  <span className="text-zinc-100 font-bold">{machineSpeed} m/min</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1300"
                  step="10"
                  value={machineSpeed}
                  onChange={(e) => setMachineSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-industrial-bg rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-zinc-400">Steam Pressure:</span>
                  <span className="text-zinc-100 font-bold">{steamPressure} bar</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="11.0"
                  step="0.1"
                  value={steamPressure}
                  onChange={(e) => setSteamPressure(Number(e.target.value))}
                  className="w-full h-2 bg-industrial-bg rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-zinc-400">Stock Flow:</span>
                  <span className="text-zinc-100 font-bold">{stockFlow} L/min</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="600"
                  step="5"
                  value={stockFlow}
                  onChange={(e) => setStockFlow(Number(e.target.value))}
                  className="w-full h-2 bg-industrial-bg rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-zinc-400">Target Moisture:</span>
                  <span className="text-zinc-100 font-bold">{moisture}%</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full h-2 bg-industrial-bg rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-zinc-400">Target Basis Weight:</span>
                  <span className="text-zinc-100 font-bold">{basisWeight} g/m²</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="240"
                  step="5"
                  value={basisWeight}
                  onChange={(e) => setBasisWeight(Number(e.target.value))}
                  className="w-full h-2 bg-industrial-bg rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trajectory Settling Timeline Chart (col-span-8) */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                Settling Trajectory Timeline (30-Minute Forecast)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 font-sans">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trajectoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="time" stroke={textColor} tick={{ fontSize: 11, fill: textColor }} />
                    <YAxis yAxisId="left" stroke="#3b82f6" tick={{ fontSize: 11, fill: textColor }} domain={[4, 10]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#a855f7" tick={{ fontSize: 11, fill: textColor }} domain={[60, 200]} />
                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontSize: "11px", borderRadius: "8px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: textColor }} />
                    <Line yAxisId="left" type="monotone" dataKey="moisture" name="Moisture (%)" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="basisWeight" name="Basis Weight (g/m²)" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                    <ReferenceLine yAxisId="left" y={6.8} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Target Moisture", fill: "#10b981", fontSize: 10 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
