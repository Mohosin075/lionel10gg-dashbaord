"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSendNotificationMutation } from "@/redux/features/notificationApi";
import { useGetNotificationManagementQuery } from "@/redux/features/dashboard/dashboardApi";
import { toast } from "sonner";
import { Bell, Send, CheckCircle } from "lucide-react";

export default function NotificationsPage() {
  const [sendNotification, { isLoading: isSending }] = useSendNotificationMutation();
  const { data: notifRes, refetch } = useGetNotificationManagementQuery();
  
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "user">("all");
  const [userId, setUserId] = useState("");

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    if (target === "user" && !userId.trim()) {
      toast.error("User ID is required for specific user target");
      return;
    }

    try {
      const payload: any = {
        title: title.trim(),
        message: message.trim(),
      };
      if (target === "user") {
        payload.userId = userId.trim();
      }

      await sendNotification(payload).unwrap();
      toast.success("Notification sent successfully");
      setTitle("");
      setMessage("");
      setUserId("");
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to send notification");
    }
  };

  const notificationStats = notifRes?.data || { sentNotifications: 0, notifications: [] };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Push Notifications"
        description="Broadcast notifications or send targeted reminders to app users"
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-950" />
              Compose Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Daily Quran Reminder"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter notification content here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={target} onValueChange={(val: any) => setTarget(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Active Users</SelectItem>
                    <SelectItem value="user">Specific User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {target === "user" && (
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input
                    placeholder="Enter MongoDB User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="bg-emerald-900 hover:bg-emerald-800 text-white w-full gap-2"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Broadcasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {notificationStats.sentNotifications || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Notifications successfully sent
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!notificationStats.notifications || notificationStats.notifications.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 text-center">
              No recent notifications found.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {notificationStats.notifications.map((notif: any) => (
                <div key={notif._id} className="p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-sm text-slate-900 block truncate">
                        {notif.title}
                      </span>
                      <span className="text-xs text-slate-500 shrink-0">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 break-words">
                      {notif.message}
                    </p>
                    <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full mt-2">
                      User: {notif.userId || "Global"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
