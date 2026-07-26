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
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="sample" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <YAxis stroke="#9ca3af" domain={[74, 84]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#f3f4f6" }}
          />
          <ReferenceLine y={82.0} label="UCL (82.0 g/m²)" stroke="#ef4444" strokeWidth={1.5} />
          <ReferenceLine y={79.0} label="TARGET (79.0 g/m²)" stroke="#3b82f6" strokeWidth={1.5} />
          <ReferenceLine y={76.0} label="LCL (76.0 g/m²)" stroke="#ef4444" strokeWidth={1.5} />
          <Area
            type="monotone"
            dataKey="basisWeight"
            name="Basis Weight (g/m²)"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
