"use client";

import AllUsersTable from "@/components/dashboard/users/all-users-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { useGetUserManagementQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetSubscriptionAnalyticsQuery } from "@/redux/features/subscription/subscriptionApi";
import { Ban, Crown, ShieldAlert, UserCheck, Users } from "lucide-react";

export default function UsersPage() {
  const { data: managementRes } = useGetUserManagementQuery();
  const { data: subAnalyticsRes } = useGetSubscriptionAnalyticsQuery();

  const management = managementRes?.data;
  const subAnalytics = subAnalyticsRes?.data;

  const userStats = [
    {
      title: "Total Users",
      value: management?.totalUsers ?? "—",
      icon: Users,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-900",
    },
    {
      title: "Active Users",
      value: management?.activeUsers ?? "—",
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "Premium / Paid",
      value: subAnalytics?.activeSubscriptions ?? "—",
      icon: Crown,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: "Restricted",
      value: management?.restrictedUsers ?? "—",
      icon: ShieldAlert,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: "Banned",
      value: management?.bannedUsers ?? "—",
      icon: Ban,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="View registered users and free vs premium status"
      />

      <StatsCard data={userStats} />

      <AllUsersTable />
    </div>
  );
}
