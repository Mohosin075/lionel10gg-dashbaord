"use client";

import Link from "next/link";
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
  DownloadCloud,
  Languages,
  BookText,
  Heart,
  ArrowUpRight,
  Settings,
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Quran International Command Center"
        description="Real-time telemetry, offline pack publishing, 109-language AI translation, and subscriber metrics"
      />

      {/* Quick Action & Content Sync Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/offline-packs"
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white shadow-md hover:shadow-lg transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-emerald-800/80 rounded-xl">
              <DownloadCloud className="h-5 w-5 text-emerald-200" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold block">
              {analytics?.totalOfflinePacks?.toLocaleString?.() ?? 0}
            </span>
            <span className="text-xs text-emerald-200 font-medium">Offline Packs Published</span>
          </div>
        </Link>

        <Link
          href="/translations"
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-950 text-white shadow-md hover:shadow-lg transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-blue-800/80 rounded-xl">
              <Languages className="h-5 w-5 text-blue-200" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold block">
              109 Lng
            </span>
            <span className="text-xs text-blue-200 font-medium">
              {analytics?.activeBatchJobs ? `${analytics.activeBatchJobs} jobs active` : "Batch AI Translations"}
            </span>
          </div>
        </Link>

        <Link
          href="/hadith"
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-900 to-amber-950 text-white shadow-md hover:shadow-lg transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-amber-800/80 rounded-xl">
              <BookText className="h-5 w-5 text-amber-200" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold block">
              {analytics?.totalHadiths?.toLocaleString?.() ?? "8 Books"}
            </span>
            <span className="text-xs text-amber-200 font-medium">Hadiths in Database</span>
          </div>
        </Link>

        <Link
          href="/duas"
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-900 to-purple-950 text-white shadow-md hover:shadow-lg transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-purple-800/80 rounded-xl">
              <Heart className="h-5 w-5 text-purple-200" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold block">
              {analytics?.totalDuas?.toLocaleString?.() ?? "Hisn al-Muslim"}
            </span>
            <span className="text-xs text-purple-200 font-medium">Supplications &amp; Duas</span>
          </div>
        </Link>
      </div>

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
