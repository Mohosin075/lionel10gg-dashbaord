"use client";

import { Clock, FileText, Plus, Send, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { StatsCard } from "@/components/shared/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialData = [
  {
    id: 1,
    title: "New Translation Added",
    message: "Spanish translation by Julio Cortés is now available",
    date: "2026-03-20",
    recipients: "15,420",
    status: "sent" as const,
  },
  {
    id: 2,
    title: "Ramadan Feature",
    message: "Special Ramadan reading plan available now",
    date: "2026-03-25",
    recipients: "20,000",
    status: "scheduled" as const,
  },
  {
    id: 3,
    title: "App Update v2.5",
    message: "New features and improvements in the latest update",
    date: "2026-03-15",
    recipients: "18,500",
    status: "sent" as const,
  },
  {
    id: 4,
    title: "Weekend Reminder",
    message: "Don't forget to complete your daily reading goal",
    date: "—",
    recipients: "—",
    status: "draft" as const,
  },
];

const renderStatusBadge = (status: string) => {
  switch (status) {
    case "sent":
      return (
        <Badge
          variant="default"
          className="bg-slate-950 text-slate-50 hover:bg-slate-900 border-transparent rounded-full px-3 py-0.5 gap-1.5 font-normal"
        >
          <Send className="h-3 w-3" /> sent
        </Badge>
      );
    case "scheduled":
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 rounded-full px-3 py-0.5 gap-1.5 font-normal"
        >
          <Clock className="h-3 w-3" /> scheduled
        </Badge>
      );
    case "draft":
      return (
        <Badge
          variant="outline"
          className="text-slate-600 rounded-full px-3 py-0.5 gap-1.5 font-normal bg-white"
        >
          <FileText className="h-3 w-3" /> draft
        </Badge>
      );
    default:
      return null;
  }
};

export default function NotificationsTable() {
  const [data, setData] = useState(initialData);
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-slate-900">
          All Notifications
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-medium">Title</TableHead>
            <TableHead className="font-medium">Message</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="font-medium">Recipients</TableHead>
            <TableHead className="font-medium">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50">
              <TableCell className="font-medium text-slate-700">
                {item.title}
              </TableCell>
              <TableCell className="text-slate-600">{item.message}</TableCell>
              <TableCell className="text-slate-600">{item.date}</TableCell>
              <TableCell className="text-slate-600">
                {item.recipients}
              </TableCell>
              <TableCell>{renderStatusBadge(item.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
