"use client";

import AllUsersTable from "@/components/dashbaord/users/all-users-table";
import { StatsCard } from "@/components/shared/stats-card";

export default function UsersPage() {
  const userStats = [
    {
      title: "Total Users",
      value: 5,
      trend: null,
      isPositive: null,
      color: "text-slate-900",
    },
    {
      title: "Active Users",
      value: 3,
      trend: null,
      isPositive: true,
      color: "text-emerald-500",
    },
    {
      title: "Restricted Users",
      value: 1,
      trend: null,
      isPositive: false,
      color: "text-amber-500",
    },
    {
      title: "Banned Users",
      value: 1,
      trend: null,
      isPositive: false,
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-slate-500">
          View and manage user registration details
        </p>
      </div>

      <StatsCard data={userStats} />

      <AllUsersTable />
    </div>
  );
}
