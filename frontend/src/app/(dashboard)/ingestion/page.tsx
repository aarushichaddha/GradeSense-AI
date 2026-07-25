"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { UploadCloud, FileSpreadsheet, Radio, Database, CheckCircle, RefreshCw, AlertCircle, Cpu } from "lucide-react";

export default function DataIngestionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cleaningStatus, setCleaningStatus] = useState("");
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSimulatedUpload = () => {
    if (!file) return;
    setUploading(true);
    setUploadCompleted(false);
    setProgress(15);
    setCleaningStatus("Extracting raw dataframe via Format Adapter...");

    setTimeout(() => {
      setProgress(45);
      setCleaningStatus("Removing duplicate (tag, timestamp) records...");
    }, 1000);

    setTimeout(() => {
      setProgress(75);
      setCleaningStatus("Executing Z-Score 3σ outlier detection & value normalization...");
    }, 2000);

    setTimeout(() => {
      setProgress(100);
      setCleaningStatus("ETL Pipeline completed. Data stored in partitioned PostgreSQL table.");
      setUploading(false);
      setUploadCompleted(true);
    }, 3200);
  };

  return (
    <div className="p-6 space-y-6 font-mono">
      <PageHeader
        title="DCS Telemetry Ingestion & Automated ETL Pipeline"
        subtitle="Upload CSV/Excel telemetry or monitor high-frequency streams from Sensor REST API, MQTT, and OPC-UA DCS servers."
      />

      {/* Protocol Adapters Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>FILE ADAPTER (CSV / EXCEL)</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">ACTIVE</div>
          <div className="text-[10px] text-gray-400 mt-1">Parses .csv, .xlsx, .xls</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>SENSOR REST API</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400 mt-1">ONLINE</div>
          <div className="text-[10px] text-gray-400 mt-1">POST /api/v1/ingestion/stream</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>MQTT BROKER ADAPTER</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1">READY</div>
          <div className="text-[10px] text-gray-400 mt-1">Topic: dcs/telemetry/#</div>
        </Card>

        <Card className="p-4 bg-gray-900 border-industrial-border">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>OPC-UA DCS ADAPTER</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-indigo-300 mt-1">CONNECTED</div>
          <div className="text-[10px] text-gray-400 mt-1">opc.tcp://experion-dcs:4840</div>
        </Card>
      </div>

      {/* Main Ingestion & Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Box & ETL Progress (1 col) */}
        <Card className="border-cyan-500/40">
          <CardHeader className="bg-cyan-950/20">
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <UploadCloud className="w-4 h-4" /> TELEMETRY FILE INGESTION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <Select
              label="Target Paper Machine"
              options={[
                { label: "PM-01 Paper Machine (Fine Writing)", value: "PM-01" },
                { label: "PM-02 Paper Machine (Linerboard)", value: "PM-02" },
              ]}
            />

            {/* Drag and Drop Zone */}
            <div className="border-2 border-dashed border-gray-700 bg-gray-950/60 p-6 text-center space-y-2 hover:border-cyan-500 transition-colors">
              <FileSpreadsheet className="w-8 h-8 text-cyan-400 mx-auto" />
              <div className="text-gray-300 font-bold">
                {file ? file.name : "Drag & Drop CSV or Excel (.xlsx) file here"}
              </div>
              <p className="text-[10px] text-gray-500">Maximum file size: 50 MB per batch upload</p>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input">
                <Button variant="outline" size="sm" type="button" className="mt-2 cursor-pointer">
                  BROWSE FILE
                </Button>
              </label>
            </div>

            {/* Upload Button */}
            <Button
              variant="cyan"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              disabled={!file || uploading}
              onClick={handleSimulatedUpload}
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> EXECUTING ETL CLEANING...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" /> START AUTOMATED ETL PIPELINE ➔
                </>
              )}
            </Button>

            {/* Live Progress Bar */}
            {uploading && (
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-cyan-400 font-mono">{cleaningStatus}</span>
                  <span className="text-gray-200">{progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-950 border border-gray-800 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadCompleted && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> ETL PIPELINE EXECUTED SUCCESSFULLY
                </div>
                <div>• Total Rows Processed: <strong>14,200</strong></div>
                <div>• Duplicates Cleaned: <strong>15</strong></div>
                <div>• Outliers Trimmed (3σ Z-score): <strong>8</strong></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload History Table (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>TELEMETRY UPLOAD & DATA QUALITY HISTORY</span>
              <Badge status="NORMAL">DATA QUALITY INDEX: 99.8%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FILENAME / SOURCE</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead>TOTAL ROWS</TableHead>
                  <TableHead>CLEANED</TableHead>
                  <TableHead>OUTLIERS TRIMMED</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>TIMESTAMP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold text-cyan-400 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" /> Pineville_PM01_ShiftA_Telemetry.csv
                  </TableCell>
                  <TableCell><Badge variant="cyan">CSV</Badge></TableCell>
                  <TableCell>14,200</TableCell>
                  <TableCell className="text-emerald-400 font-bold">14,185</TableCell>
                  <TableCell className="text-amber-400">15</TableCell>
                  <TableCell><Badge status="NORMAL">COMPLETED</Badge></TableCell>
                  <TableCell>14:30:15 UTC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-gray-300 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" /> Dryer_Group3_Steam_Batch.xlsx
                  </TableCell>
                  <TableCell><Badge variant="outline">EXCEL</Badge></TableCell>
                  <TableCell>8,500</TableCell>
                  <TableCell className="text-emerald-400 font-bold">8,492</TableCell>
                  <TableCell className="text-amber-400">8</TableCell>
                  <TableCell><Badge status="NORMAL">COMPLETED</Badge></TableCell>
                  <TableCell>12:15:00 UTC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-gray-400 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" /> SENSOR_REST_API_STREAM
                  </TableCell>
                  <TableCell><Badge variant="default">REST API</Badge></TableCell>
                  <TableCell>104,200</TableCell>
                  <TableCell className="text-emerald-400 font-bold">104,200</TableCell>
                  <TableCell className="text-emerald-400">0</TableCell>
                  <TableCell><Badge status="NORMAL">COMPLETED</Badge></TableCell>
                  <TableCell>10:00:00 UTC</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
