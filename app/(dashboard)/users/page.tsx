"use client";

import AllUsersTable from "@/components/dashboard/users/all-users-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Ban, ShieldAlert, UserCheck, Users } from "lucide-react";

const userStats = [
  {
    title: "Total Users",
    value: 5,
    icon: Users,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-900",
  },
  {
    title: "Active Users",
    value: 3,
    icon: UserCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    title: "Restricted Users",
    value: 1,
    icon: ShieldAlert,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    title: "Banned Users",
    value: 1,
    icon: Ban,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="View and manage user registration details"
      />

      <StatsCard data={userStats} />

      <AllUsersTable />
    </div>
  );
}
