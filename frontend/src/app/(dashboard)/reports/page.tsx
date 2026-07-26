"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FileText, Download, Printer, CheckCircle2, Loader2 } from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  type: string;
  author: string;
  date: string;
}

const INITIAL_REPORTS: ReportItem[] = [
  { id: "RPT-901", title: "Shift A Grade Transition Yield Summary", type: "SHIFT_YIELD", author: "J. Miller", date: "2026-07-25" },
  { id: "RPT-900", title: "Monthly Off-Spec Waste Reduction", type: "WASTE_REDUCTION", author: "S. Chen", date: "2026-07-24" },
  { id: "RPT-899", title: "AI Closed-Loop Advisory Compliance Log", type: "AI_COMPLIANCE", author: "R. Patel", date: "2026-07-22" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [reportType, setReportType] = useState("SHIFT_YIELD");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setLastGenerated(null);
    setTimeout(() => {
      const newId = `RPT-${Math.floor(900 + Math.random() * 99)}`;
      const titleMap: Record<string, string> = {
        SHIFT_YIELD: "Shift A Grade Transition Yield Summary",
        WASTE_REDUCTION: "Monthly Off-Spec Waste Reduction Report",
        AI_COMPLIANCE: "AI Closed-Loop Advisory Compliance Log",
      };
      const newReport: ReportItem = {
        id: newId,
        title: titleMap[reportType] || "Plant Quality Performance Report",
        type: reportType,
        author: "Shift Lead",
        date: new Date().toISOString().slice(0, 10),
      };

      setReports([newReport, ...reports]);
      setIsGenerating(false);
      setLastGenerated(`${newReport.id}_${newReport.type}.pdf`);
    }, 800);
  };

  const handleDownload = (rpt: ReportItem) => {
    const content = `GradeSense AI - Plant Performance Report\nReport ID: ${rpt.id}\nTitle: ${rpt.title}\nType: ${rpt.type}\nAuthor: ${rpt.author}\nDate: ${rpt.date}\nStatus: Verified On-Spec`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rpt.id}_${rpt.type}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="Plant Shift Reports & Transition Summaries"
        subtitle="Generate and export automated shift yield, grade change efficiency, and fiber savings reports."
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Report Generator Controls (col-span-4) */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Generate New Report
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-sans text-xs">
              <Select
                label="Select Report Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                options={[
                  { label: "Shift A Grade Transition Yield Summary", value: "SHIFT_YIELD" },
                  { label: "Monthly Off-Spec Waste Reduction Report", value: "WASTE_REDUCTION" },
                  { label: "AI Closed-Loop Advisory Compliance Log", value: "AI_COMPLIANCE" },
                ]}
              />

              <Select
                label="Paper Machine Line"
                options={[
                  { label: "PM-01 Paper Machine (Fine Writing)", value: "PM-01" },
                  { label: "PM-02 Paper Machine (Linerboard)", value: "PM-02" },
                ]}
              />

              <div className="pt-2">
                <Button
                  variant="default"
                  size="md"
                  className="w-full flex items-center justify-center gap-2 font-semibold shadow-sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" /> Generate Report PDF
                    </>
                  )}
                </Button>
              </div>

              {lastGenerated && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl space-y-2">
                  <div className="font-semibold flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Report Ready for Download
                  </div>
                  <div className="text-[11px] text-zinc-300 font-mono">{lastGenerated}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Generated Reports Table (col-span-8) */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Recent Generated Reports Archive
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 font-sans">
              <Table>
                <TableHeader>
                  <TableRow className="border-industrial-border">
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Report ID</TableHead>
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Title</TableHead>
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Type</TableHead>
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Date</TableHead>
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((rpt) => (
                    <TableRow key={rpt.id} className="border-industrial-border">
                      <TableCell className="text-xs font-bold text-blue-400">{rpt.id}</TableCell>
                      <TableCell className="text-xs text-zinc-200 font-medium">{rpt.title}</TableCell>
                      <TableCell className="text-xs text-zinc-400 font-mono">{rpt.type}</TableCell>
                      <TableCell className="text-xs text-zinc-400">{rpt.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Download Report File"
                            onClick={() => handleDownload(rpt)}
                            className="h-8 px-2.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Print Report"
                            onClick={handlePrint}
                            className="h-8 px-2.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
