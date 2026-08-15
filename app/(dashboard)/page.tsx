"use client";

import BookmarkedVerses from "@/components/dashboard/home/bookmarked-verses";
import EngagementSummary from "@/components/dashboard/home/engagement-summary";
import MonthlyActiveUsers from "@/components/dashboard/home/monthly-active-users";
import MostSearchedVerses from "@/components/dashboard/home/most-searched-verses";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { useGetAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetSubscriptionAnalyticsQuery } from "@/redux/features/subscription/subscriptionApi";
import {
  Activity,
  Crown,
  Download,
  MousePointerClick,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const { data: analyticsRes, isLoading } = useGetAnalyticsQuery();
  const { data: subAnalyticsRes } = useGetSubscriptionAnalyticsQuery();

  const analytics = analyticsRes?.data;
  const subAnalytics = subAnalyticsRes?.data;

  const dashboardStats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers?.toLocaleString?.() ?? "—",
      icon: Users,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-400",
    },
    {
      title: "Active Users (7d)",
      value: analytics?.activeUsers7d?.toLocaleString?.() ?? "—",
      icon: Activity,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-400",
    },
    {
      title: "Paid Subscribers",
      value: subAnalytics?.activeSubscriptions?.toLocaleString?.() ?? "—",
      icon: Crown,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: "Daily Active Users",
      value: analytics?.dailyActiveUsers?.toLocaleString?.() ?? "—",
      icon: MousePointerClick,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-400",
    },
    {
      title: "App Downloads",
      value: analytics?.appDownloads?.toLocaleString?.() ?? "—",
      icon: Download,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-400",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="App Analytics"
        description="Track user activity, engagement, and subscription overview"
      />

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading analytics...</p>
      ) : (
        <StatsCard data={dashboardStats} />
      )}

      <MonthlyActiveUsers
        monthlyActiveUsers={analytics?.monthlyActiveUsersChart}
        mostViewedTranslations={analytics?.mostViewedTranslations}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <MostSearchedVerses data={analytics?.mostSearchedVerses} />
        <BookmarkedVerses data={analytics?.mostBookmarkedVerses} />
      </div>

      <EngagementSummary
        totalBookmarks={analytics?.engagementSummary?.totalBookmarks}
        totalHighlights={analytics?.engagementSummary?.totalHighlights}
        totalVerseViews={analytics?.engagementSummary?.totalVerseViews}
      />
    </div>
  );
}
