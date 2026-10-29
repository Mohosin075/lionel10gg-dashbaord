"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportRange, Reports } from "@/lib/api-types";
import { reportToCsv, type ReportType } from "@/lib/report-csv";
import { DownloadCloud, FileText } from "lucide-react";
import { useState } from "react";
export default function GenerateReport({
  data,
  range,
  onRangeChange,
  loading,
}: {
  data?: Reports;
  range: ReportRange;
  onRangeChange: (range: ReportRange) => void;
  loading: boolean;
}) {
  const [reportType, setReportType] = useState<ReportType>("user-activity");
  const exportCsv = () => {
    if (!data) return;
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", reportToCsv(data, reportType)], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download =
      "quran_international_" +
      reportType +
      "_" +
      range +
      "_" +
      new Date().toISOString().slice(0, 10) +
      ".csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Card>
      <CardHeader>Generate Report</CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select
            value={reportType}
            onValueChange={(value) => setReportType(value as ReportType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user-activity">
                Registrations &amp; profile updates
              </SelectItem>
              <SelectItem value="content-usage">
                Content &amp; saved activity totals
              </SelectItem>
              <SelectItem value="system-performance">
                System overview
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Registration Date Range (UTC)
          </label>
          <Select
            value={range}
            onValueChange={(value) => onRangeChange(value as ReportRange)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Export</label>
          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={!data || loading}
              onClick={exportCsv}
            >
              <DownloadCloud className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              disabled={!data || loading}
              onClick={() => window.print()}
            >
              <FileText className="h-4 w-4 mr-2" />
              Print / PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
