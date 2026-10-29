"use client";
import FeatureUsageChart from "@/components/dashboard/reports/feature-usage-chart";
import GenerateReport from "@/components/dashboard/reports/generate-report";
import PlatformDownloads from "@/components/dashboard/reports/platform-downloads";
import ReportSummary from "@/components/dashboard/reports/report-summary";
import UserActivityChart from "@/components/dashboard/reports/user-activity-chart";
import { PageHeader } from "@/components/shared/page-header";
import { QueryError } from "@/components/shared/query-error";
import { StatsCard } from "@/components/shared/stats-card";
import type { ReportRange } from "@/lib/api-types";
import { useGetReportsQuery } from "@/redux/features/dashboard/dashboardApi";
import { Activity, Calendar, Download, FileText } from "lucide-react";
import { useState } from "react";
export default function ReportsPage() {
  const [range, setRange] = useState<ReportRange>("7d");
  const { currentData, isFetching, isError, refetch } =
    useGetReportsQuery(range);
  const reports = currentData?.data;
  const stats = [
    {
      title: "Active users",
      value: reports?.activeUsers?.toLocaleString() ?? "Not tracked",
      icon: Activity,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "App installs",
      value: reports?.totalDownloads?.toLocaleString() ?? "Not tracked",
      icon: Download,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "New users (selected range)",
      value: reports?.newUsers7d?.toLocaleString() ?? "?",
      icon: Calendar,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      title: "Average session time",
      value: reports?.avgSessionTime ?? "Not tracked",
      icon: FileText,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Registration trends and saved content totals. Session and install telemetry are not collected."
      />
      <GenerateReport
        data={reports}
        range={range}
        onRangeChange={setRange}
        loading={isFetching}
      />
      {isError ? (
        <QueryError retry={refetch} />
      ) : !reports ? (
        <p>Loading reports...</p>
      ) : (
        <>
          <StatsCard data={stats} />
          <p className="text-sm text-slate-500">
            {reports.range.label}. Content totals below are cumulative.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <UserActivityChart data={reports.userActivityLast7Days} />
            <FeatureUsageChart data={reports.featureUsageStats} />
          </div>
          <PlatformDownloads data={reports.downloadsByPlatform} />
          <ReportSummary data={reports.reportSummary} />
        </>
      )}
    </div>
  );
}
