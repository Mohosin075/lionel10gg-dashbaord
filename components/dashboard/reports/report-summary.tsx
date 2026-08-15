"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportSummary({ data }: { data?: any }) {
  const summaryItems = [
    { label: "Total App Users", value: data?.totalAppUsers?.toLocaleString?.() ?? "45,230" },
    { label: "Total Verse Views", value: data?.totalVerseViews?.toLocaleString?.() ?? "423,567" },
    { label: "Total Bookmarks Created", value: data?.totalBookmarksCreated?.toLocaleString?.() ?? "89,234" },
    { label: "Total Highlights Created", value: data?.totalHighlightsCreated?.toLocaleString?.() ?? "156,891" },
    { label: "Average Daily Active Users", value: data?.avgDailyActiveUsers?.toLocaleString?.() ?? "12,636" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Report Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="flex justify-between py-4 text-sm"
            >
              <span className="text-slate-500">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
