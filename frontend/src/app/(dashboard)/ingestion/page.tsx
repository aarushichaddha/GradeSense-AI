"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, CheckCircle2, Play } from "lucide-react";

export default function DataIngestionPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFileName(f.name);
      setFileSize(`${(f.size / 1024).toFixed(1)} KB`);
      setCompleted(false);
    }
  };

  const handleUseSample = () => {
    setFileName("opc_ua_telemetry_pm01_sample.csv");
    setFileSize("2,480 KB");
    setCompleted(false);
  };

  const handleUpload = () => {
    if (!fileName) return;
    setUploading(true);
    setCompleted(false);
    setProgress(20);
    setStatusMsg("Parsing raw CSV dataset...");

    setTimeout(() => {
      setProgress(60);
      setStatusMsg("Removing duplicate timestamps & filtering outliers...");
    }, 800);

    setTimeout(() => {
      setProgress(100);
      setStatusMsg("ETL Pipeline complete. 1,420 process samples ingested.");
      setUploading(false);
      setCompleted(true);
    }, 1800);
  };

  return (
    <div className="p-8 space-y-8 font-sans max-w-7xl mx-auto">
      <PageHeader
        title="Data Ingestion & Automated ETL Pipeline"
        subtitle="Upload historical telemetry CSV/Excel datasets or connect high-frequency sensor streams."
      />

      {/* 12-Column Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Drag & Drop File Upload Box (col-span-4) */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-400" />
                Upload Telemetry File
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs font-sans">
              <div className="border-2 border-dashed border-industrial-border hover:border-blue-500/50 p-6 text-center rounded-xl transition-colors bg-industrial-bg relative">
                <FileSpreadsheet className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <p className="text-zinc-200 font-semibold mb-1">Drag and drop CSV or Excel file</p>
                <p className="text-xs text-zinc-400 mb-4 font-normal">Supports .csv, .xlsx up to 50MB</p>

                <div className="flex flex-col gap-2 items-center justify-center">
                  <label className="cursor-pointer bg-industrial-panel border border-industrial-border text-zinc-200 px-4 py-2 rounded-xl hover:border-zinc-500 transition-colors inline-block text-xs font-semibold">
                    Browse Files
                    <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="text-xs text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Or use sample DCS dataset
                  </button>
                </div>
              </div>

              {fileName && (
                <div className="p-4 bg-industrial-bg border border-industrial-border rounded-xl space-y-3 font-sans">
                  <div className="flex justify-between items-center text-zinc-200 font-semibold">
                    <span className="truncate">{fileName}</span>
                    <span className="text-zinc-400 text-xs font-normal">{fileSize}</span>
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-industrial-panel rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-blue-400 font-medium">{statusMsg}</span>
                    </div>
                  )}

                  {completed && (
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {statusMsg}
                    </div>
                  )}

                  {!uploading && !completed && (
                    <Button variant="default" size="md" className="w-full mt-2 font-semibold shadow-sm gap-2" onClick={handleUpload}>
                      <Play className="w-3.5 h-3.5" /> Run ETL & Ingest ➔
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Ingestion History (col-span-8) */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-full bg-industrial-card border-industrial-border">
            <CardHeader className="py-4 px-6 border-b border-industrial-border">
              <CardTitle className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Recent Telemetry Ingestions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 font-sans">
              <Table>
                <TableHeader>
                  <TableRow className="border-industrial-border">
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Dataset Name</TableHead>
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Records</TableHead>
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Cleaned Outliers</TableHead>
                    <TableHead className="text-xs text-zinc-400 uppercase font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-industrial-border">
                    <TableCell className="text-xs font-semibold text-zinc-200">pm01_transition_oct2025.csv</TableCell>
                    <TableCell className="text-xs text-zinc-400 font-normal">12,450</TableCell>
                    <TableCell className="text-xs text-emerald-400 font-semibold">142 Cleaned</TableCell>
                    <TableCell className="text-xs text-emerald-400 font-semibold">Success</TableCell>
                  </TableRow>
                  <TableRow className="border-industrial-border">
                    <TableCell className="text-xs font-semibold text-zinc-200">linerboard_ramp_telemetry.xlsx</TableCell>
                    <TableCell className="text-xs text-zinc-400 font-normal">8,200</TableCell>
                    <TableCell className="text-xs text-emerald-400 font-semibold">89 Cleaned</TableCell>
                    <TableCell className="text-xs text-emerald-400 font-semibold">Success</TableCell>
                  </TableRow>
                  <TableRow className="border-industrial-border">
                    <TableCell className="text-xs font-semibold text-zinc-200">opc_ua_live_stream_batch4.csv</TableCell>
                    <TableCell className="text-xs text-zinc-400 font-normal">45,100</TableCell>
                    <TableCell className="text-xs text-emerald-400 font-semibold">312 Cleaned</TableCell>
                    <TableCell className="text-xs text-emerald-400 font-semibold">Success</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
