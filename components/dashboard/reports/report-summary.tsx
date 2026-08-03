"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const summaryItems = [
  { label: "Total App Users", value: "45,230" },
  { label: "Total Verse Views", value: "423,567" },
  { label: "Total Bookmarks Created", value: "89,234" },
  { label: "Total Highlights Created", value: "156,891" },
  { label: "Average Daily Active Users", value: "12,636" },
];

export default function ReportSummary() {
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
