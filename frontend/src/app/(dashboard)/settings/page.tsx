"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sliders, Shield, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="Plant Settings & AI Thresholds"
        subtitle="Configure quality tolerance limits, safety bounds, and AI advisory execution modes."
      />

      {/* 12-Column Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Quality Tolerances (col-span-6) */}
        <div className="col-span-12 md:col-span-6">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Quality Tolerances
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-sans">
              <Input label="Max Moisture Tolerance (%)" defaultValue="1.5" />
              <Input label="Max Basis Weight Offset (g/m²)" defaultValue="2.0" />
              <Select
                label="Alarm Delay"
                options={[
                  { label: "Immediate (0 min)", value: "0" },
                  { label: "2 Minutes", value: "2" },
                  { label: "5 Minutes", value: "5" },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Safety Boundaries (col-span-6) */}
        <div className="col-span-12 md:col-span-6">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Safety Guardrails
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-sans">
              <Input label="Max Steam Adjustment Delta (bar)" defaultValue="0.3" />
              <Select
                label="Advisory Execution Mode"
                options={[
                  { label: "Operator Approval Required (Recommended)", value: "MANUAL" },
                  { label: "Semi-Autonomous (Auto >95% Confidence)", value: "SEMI" },
                ]}
              />
              <div className="pt-3 flex items-center justify-between">
                <Button variant="default" size="md" onClick={handleSave} className="gap-2 font-semibold shadow-sm">
                  <Save className="w-4 h-4" /> Save Settings
                </Button>
                {saved && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Saved Successfully
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
