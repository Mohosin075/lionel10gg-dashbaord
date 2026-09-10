"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";

export default function ReportSummary({ data }: { data?: any }) {
  const summaryItems = [
    { label: "Total App Users", value: (data?.totalAppUsers ?? 0).toLocaleString() },
    { label: "Total Verse Views / Last Reads", value: (data?.totalVerseViews ?? 0).toLocaleString() },
    { label: "Total Bookmarks Created", value: (data?.totalBookmarksCreated ?? 0).toLocaleString() },
    { label: "Total Highlights Created", value: (data?.totalHighlightsCreated ?? 0).toLocaleString() },
    { label: "Average Daily Active Users (7d)", value: (data?.avgDailyActiveUsers ?? 0).toLocaleString() },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          Report Summary (Real Database Metrics)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="flex justify-between py-4 text-sm"
            >
              <span className="text-slate-500">{item.label}</span>
              <span className="font-semibold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
