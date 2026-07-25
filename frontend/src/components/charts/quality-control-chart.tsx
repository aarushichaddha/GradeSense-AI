"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const MOCK_SPC_DATA = [
  { sample: "S-101", basisWeight: 79.2, ucl: 82.0, lcl: 76.0, target: 79.0 },
  { sample: "S-102", basisWeight: 78.8, ucl: 82.0, lcl: 76.0, target: 79.0 },
  { sample: "S-103", basisWeight: 80.5, ucl: 82.0, lcl: 76.0, target: 79.0 },
  { sample: "S-104", basisWeight: 81.8, ucl: 82.0, lcl: 76.0, target: 79.0 },
  { sample: "S-105", basisWeight: 82.4, ucl: 82.0, lcl: 76.0, target: 79.0 }, // Out of spec sample
  { sample: "S-106", basisWeight: 79.5, ucl: 82.0, lcl: 76.0, target: 79.0 },
];

export function QualityControlChart() {
  return (
    <div className="w-full h-64 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={MOCK_SPC_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="sample" stroke="#94a3b8" tick={{ fill: "#475569", fontSize: 10 }} />
          <YAxis stroke="#94a3b8" domain={[74, 84]} tick={{ fill: "#475569", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#0f172a", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
          />
          <ReferenceLine y={82.0} label={{ value: "UCL (82.0 g/m²)", fill: "#dc2626", fontSize: 10 }} stroke="#dc2626" strokeWidth={1.5} />
          <ReferenceLine y={79.0} label={{ value: "TARGET (79.0 g/m²)", fill: "#2563eb", fontSize: 10 }} stroke="#2563eb" strokeWidth={1.5} />
          <ReferenceLine y={76.0} label={{ value: "LCL (76.0 g/m²)", fill: "#dc2626", fontSize: 10 }} stroke="#dc2626" strokeWidth={1.5} />
          <Area
            type="monotone"
            dataKey="basisWeight"
            name="Basis Weight (g/m²)"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.15}
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


