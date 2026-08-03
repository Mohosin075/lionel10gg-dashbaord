"use client";

import BookmarkedVerses from "@/components/dashboard/home/bookmarked-verses";
import EngagementSummary from "@/components/dashboard/home/engagement-summary";
import MonthlyActiveUsers from "@/components/dashboard/home/monthly-active-users";
import MostSearchedVerses from "@/components/dashboard/home/most-searched-verses";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import {
  Activity,
  Download,
  MousePointerClick,
  Users,
} from "lucide-react";

const dashboardStats = [
  {
    title: "Total Users",
    value: "45,230",
    icon: Users,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-400",
    trend: "+12.5%",
    isPositive: true,
  },
  {
    title: "Active Users (7d)",
    value: "28,450",
    icon: Activity,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-400",
    trend: "+8.3%",
    isPositive: true,
  },
  {
    title: "App Downloads",
    value: "52,100",
    icon: Download,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-400",
    trend: "+15.7%",
    isPositive: true,
  },
  {
    title: "Daily Active Users",
    value: "12,340",
    icon: MousePointerClick,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-400",
    trend: "+5.2%",
    isPositive: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="App Analytics"
        description="Track user activity and engagement metrics"
      />

      <StatsCard data={dashboardStats} />

      <MonthlyActiveUsers />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <MostSearchedVerses />
        <BookmarkedVerses />
      </div>

      <EngagementSummary />
    </div>
  );
}
