"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, Sliders, Shield, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <PageHeader
        title="Plant Threshold & AI Sensitivity Configuration"
        subtitle="Configure quality tolerance bands, closed-loop safety boundaries, and OPC-UA DCS connectivity settings."
      />

      {saved && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-xs animate-bounce font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Configuration parameters successfully updated and pushed to DCS controller memory!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        <Card className="border-slate-200 dark:border-[#1e2945] bg-white dark:bg-[#0e1424] shadow-xs">
          <CardHeader className="bg-slate-50 dark:bg-[#0b101d] border-b border-slate-200 dark:border-[#1e2945]">
            <CardTitle className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-sans">
              <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" /> QUALITY TOLERANCE THRESHOLDS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 font-sans">
            <Input label="Max Permissible Moisture Offset (%)" defaultValue="1.5" />
            <Input label="Max Permissible Basis Weight Dev (g/m²)" defaultValue="2.0" />
            <Input label="Tensile Strength Minimum Threshold (kN/m)" defaultValue="4.5" />
            <Select
              label="Default Alarm Escalation Delay"
              options={[
                { label: "Immediate (0 mins)", value: "0" },
                { label: "2 Minutes", value: "2" },
                { label: "5 Minutes", value: "5" },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-[#1e2945] bg-white dark:bg-[#0e1424] shadow-xs">
          <CardHeader className="bg-slate-50 dark:bg-[#0b101d] border-b border-slate-200 dark:border-[#1e2945]">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-sans">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" /> CLOSED-LOOP AI OVERRIDE BOUNDARIES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 font-sans">
            <Input label="Max Steam Valve Delta Per Adjustment (bar)" defaultValue="0.3" />
            <Input label="Max Press Pressure Delta (kN/m)" defaultValue="5.0" />
            <Select
              label="AI Advisory Execution Mode"
              options={[
                { label: "Operator In-The-Loop (Manual Approval)", value: "MANUAL" },
                { label: "Semi-Autonomous (Auto-apply High Confidence >95%)", value: "SEMI" },
                { label: "Full Closed-Loop Control", value: "AUTO" },
              ]}
            />
            <div className="pt-2 font-mono">
              <Button variant="cyan" size="sm" onClick={handleSave} className="flex items-center gap-2 font-mono font-bold">
                <Save className="w-4 h-4 text-white" /> SAVE CONFIGURATION ➔
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
