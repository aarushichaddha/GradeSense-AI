"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, Sliders, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 font-mono">
      <PageHeader
        title="Plant Threshold & AI Sensitivity Configuration"
        subtitle="Configure quality tolerance bands, closed-loop safety boundaries, and OPC-UA DCS connectivity settings."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> QUALITY TOLERANCE THRESHOLDS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" /> CLOSED-LOOP AI OVERRIDE BOUNDARIES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div className="pt-2">
              <Button variant="cyan" size="sm" className="flex items-center gap-1.5">
                <Save className="w-4 h-4" /> SAVE CONFIGURATION
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
