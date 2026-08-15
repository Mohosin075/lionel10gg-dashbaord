"use client";

import FeatureUsageChart from "@/components/dashboard/reports/feature-usage-chart";
import GenerateReport from "@/components/dashboard/reports/generate-report";
import PlatformDownloads from "@/components/dashboard/reports/platform-downloads";
import ReportSummary from "@/components/dashboard/reports/report-summary";
import UserActivityChart from "@/components/dashboard/reports/user-activity-chart";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import {
  Activity,
  Calendar,
  Download,
  FileText,
} from "lucide-react";

const reportStats = [
  {
    title: "Active Users",
    value: "28,450",
    icon: Activity,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Total Downloads",
    value: "52,100",
    icon: Download,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    title: "New Users (7d)",
    value: "3,495",
    icon: Calendar,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "Avg. Session Time",
    value: "12m",
    icon: FileText,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

import { useGetReportsQuery } from "@/redux/features/dashboard/dashboardApi";

export default function ReportsPage() {
  const { data: reportsRes, isLoading } = useGetReportsQuery();
  const reports = reportsRes?.data;

  const dynamicStats = [
    {
      title: "Active Users",
      value: reports?.activeUsers?.toLocaleString?.() ?? "28,450",
      icon: Activity,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Total Downloads",
      value: reports?.totalDownloads?.toLocaleString?.() ?? "52,100",
      icon: Download,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "New Users (7d)",
      value: reports?.newUsers7d?.toLocaleString?.() ?? "3,495",
      icon: Calendar,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      title: "Avg. Session Time",
      value: reports?.avgSessionTime ?? "12m",
      icon: FileText,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download usage statistics and analytics reports"
      />

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading reports...</p>
      ) : (
        <>
          <StatsCard data={dynamicStats} />

          <GenerateReport />

          <div className="grid gap-4 md:grid-cols-2">
            <UserActivityChart data={reports?.userActivityLast7Days} />
            <FeatureUsageChart data={reports?.featureUsageStats} />
          </div>

          <PlatformDownloads data={reports?.downloadsByPlatform} />
          <ReportSummary data={reports?.reportSummary} />
        </>
      )}
    </div>
  );
}
