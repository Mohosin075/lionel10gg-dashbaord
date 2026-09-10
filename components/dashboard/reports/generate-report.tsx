"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DownloadCloud, FileText, CheckCircle2 } from "lucide-react";
import { useGetReportsQuery } from "@/redux/features/dashboard/dashboardApi";

export default function GenerateReport() {
  const { data: reportsRes } = useGetReportsQuery();
  const [reportType, setReportType] = useState("user-activity");
  const [downloaded, setDownloaded] = useState(false);

  const handleExportCSV = () => {
    const data = reportsRes?.data;
    if (!data) return;

    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "user-activity") {
      csvContent += "Date,Active Users,New Users\n";
      (data.userActivity || []).forEach((row: any) => {
        csvContent += `${row.date},${row.activeUsers},${row.newUsers}\n`;
      });
    } else if (reportType === "content-usage") {
      csvContent += "Metric,Count\n";
      (data.featureUsage || []).forEach((row: any) => {
        csvContent += `${row.name},${row.value}\n`;
      });
    } else {
      csvContent += "Metric,Value\n";
      csvContent += `Total App Users,${data.totalAppUsers || 0}\n`;
      csvContent += `Total Verse Views,${data.totalVerseViews || 0}\n`;
      csvContent += `Total Bookmarks,${data.totalBookmarksCreated || 0}\n`;
      csvContent += `Total Highlights,${data.totalHighlightsCreated || 0}\n`;
      csvContent += `Avg Daily Active Users,${data.avgDailyActiveUsers || 0}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quran_international_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader className="pb-3 text-base font-semibold">
        Generate Live Report
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user-activity">User Activity</SelectItem>
              <SelectItem value="content-usage">Content Engagement</SelectItem>
              <SelectItem value="system-performance">
                System Overview
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Select defaultValue="last-7-days">
            <SelectTrigger>
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days (Live MongoDB)</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Real Data</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
              onClick={handleExportCSV}
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Exported!
                </>
              ) : (
                <>
                  <DownloadCloud className="h-4 w-4" /> Export CSV
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handlePrintPDF}
            >
              <FileText className="h-4 w-4" /> Print / PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
