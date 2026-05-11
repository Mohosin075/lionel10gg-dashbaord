"use client";

import { Clock, FileText, Plus, Send } from "lucide-react";
import { useState } from "react";

import NotificationsTable from "@/components/dashbaord/notifications/notifications-table";
import CreateNotificationModal from "@/components/modals/create-notification-modal";
import { StatsCard } from "@/components/shared/stats-card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Sent Notifications",
    value: 10,
    key: "sent",
    icon: Send,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Scheduled",
    value: 10,
    key: "scheduled",
    icon: Clock,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Drafts",
    value: 10,
    key: "draft",
    icon: FileText,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    title: "Drafts",
    value: 10,
    key: "draft",
    icon: FileText,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

export default function PushNotificationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Push Notification Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Send notifications to users about updates or new features
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-950 hover:bg-slate-900 text-white rounded-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCard data={stats} />

      {/* Table Section */}
      <NotificationsTable />

      {/* Simple Modal */}
      <CreateNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
