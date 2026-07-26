"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

const MOCK_TRANSITION_DATA = [
  { time: "14:00", actualMoisture: 5.2, targetMoisture: 6.8, predictedMoisture: 5.3, steamBar: 3.2 },
  { time: "14:05", actualMoisture: 5.5, targetMoisture: 6.8, predictedMoisture: 5.6, steamBar: 3.4 },
  { time: "14:10", actualMoisture: 6.0, targetMoisture: 6.8, predictedMoisture: 6.1, steamBar: 3.6 },
  { time: "14:15", actualMoisture: 6.4, targetMoisture: 6.8, predictedMoisture: 6.5, steamBar: 3.8 },
  { time: "14:20", actualMoisture: 6.8, targetMoisture: 6.8, predictedMoisture: 6.8, steamBar: 3.8 },
  { time: "14:25", actualMoisture: 6.7, targetMoisture: 6.8, predictedMoisture: 6.8, steamBar: 3.8 },
];

export function TransitionTrendChart() {
  return (
    <div className="w-full h-64 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MOCK_TRANSITION_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <YAxis stroke="#9ca3af" domain={[4, 8]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#f3f4f6" }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          <ReferenceLine y={6.8} label="SP Target (6.8%)" stroke="#10b981" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="actualMoisture"
            name="Actual Reel Moisture (%)"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="predictedMoisture"
            name="AI Predicted Curve (%)"
            stroke="#06b6d4"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
