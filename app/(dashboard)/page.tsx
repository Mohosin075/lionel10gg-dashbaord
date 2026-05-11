"use client";

import BookmarkedVerses from "@/components/dashbaord/dash-home/bookmarked-verses";
import DashboardStatsCard from "@/components/dashbaord/dash-home/dashboard-stats-card";
import EngagementSummary from "@/components/dashbaord/dash-home/engagement-summary";
import MonthlyActiveUsers from "@/components/dashbaord/dash-home/monthly-active-users";
import MostSearchedVerses from "@/components/dashbaord/dash-home/most-searched-verses";
import { Activity, Download, MousePointerClick, Users } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "Total Users": <Users className="h-4 w-4 text-slate-400" />,
  "Active Users (7d)": <Activity className="h-4 w-4 text-slate-400" />,
  "App Downloads": <Download className="h-4 w-4 text-slate-400" />,
  "Daily Active Users": (
    <MousePointerClick className="h-4 w-4 text-slate-400" />
  ),
};

const dashboardCards = [
  {
    title: "Total Users",
    icon: <Users className="h-4 w-4 text-slate-400" />,
    value: "45,230",
    trend: "+12.5%",
    isPositive: true,
  },
  {
    title: "Active Users (7d)",
    icon: <Activity className="h-4 w-4 text-slate-400" />,
    value: "28,450",
    trend: "+8.3%",
    isPositive: true,
  },
  {
    title: "App Downloads",
    icon: <Download className="h-4 w-4 text-slate-400" />,
    value: "52,100",
    trend: "+15.7%",
    isPositive: true,
  },
  {
    title: "Daily Active Users",
    icon: <MousePointerClick className="h-4 w-4 text-slate-400" />,
    value: "12,340",
    trend: "+5.2%",
    isPositive: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">App Analytics</h1>
        <p className="text-sm text-slate-500">
          Track user activity and engagement metrics
        </p>
      </div>

      <DashboardStatsCard stats={dashboardCards} />

      <MonthlyActiveUsers />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <MostSearchedVerses />

        <BookmarkedVerses />
      </div>

      <EngagementSummary />
    </div>
  );
}
