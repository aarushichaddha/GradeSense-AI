"use client";

import React from "react";
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

const ANIMATED_DCS_DATA = [
  { time: "14:00", actualMoisture: 5.2, targetMoisture: 6.8, basisWeight: 78.0, steamPressure: 3.2 },
  { time: "14:05", actualMoisture: 5.6, targetMoisture: 6.8, basisWeight: 78.4, steamPressure: 3.4 },
  { time: "14:10", actualMoisture: 6.1, targetMoisture: 6.8, basisWeight: 79.1, steamPressure: 3.6 },
  { time: "14:15", actualMoisture: 6.5, targetMoisture: 6.8, basisWeight: 79.8, steamPressure: 3.8 },
  { time: "14:20", actualMoisture: 6.8, targetMoisture: 6.8, basisWeight: 80.0, steamPressure: 3.82 },
  { time: "14:25", actualMoisture: 6.7, targetMoisture: 6.8, basisWeight: 80.2, steamPressure: 3.80 },
  { time: "14:30", actualMoisture: 6.8, targetMoisture: 6.8, basisWeight: 80.0, steamPressure: 3.82 },
];

export function AnimatedTrendChart() {
  return (
    <div className="w-full h-72 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={ANIMATED_DCS_DATA} margin={{ top: 15, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#475569", fontSize: 10 }} />
          <YAxis yAxisId="left" stroke="#94a3b8" domain={[4, 9]} tick={{ fill: "#475569", fontSize: 10 }} />
          <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" domain={[70, 90]} tick={{ fill: "#475569", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#0f172a", fontSize: "11px", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          <ReferenceLine yAxisId="left" y={6.8} label={{ value: "SP Target (6.8%)", fill: "#059669", fontSize: 10 }} stroke="#059669" strokeDasharray="4 4" />
          
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="actualMoisture"
            name="Reel Moisture (%)"
            stroke="#0284c7"
            fill="url(#moistureGradient)"
            strokeWidth={2.5}
            isAnimationActive={true}
            animationDuration={1500}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="basisWeight"
            name="Basis Weight (g/m²)"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4, fill: "#2563eb" }}
            isAnimationActive={true}
            animationDuration={1500}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="steamPressure"
            name="Steam Pressure (bar)"
            stroke="#d97706"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            isAnimationActive={true}
            animationDuration={1500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}


