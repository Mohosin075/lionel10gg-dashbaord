"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EngagementSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Engagement Summary</CardTitle>
      </CardHeader>
      <CardContent className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-x divide-slate-100">
          <div>
            <div className="text-3xl font-light mb-2">89,234</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">
              Total Bookmarks
            </div>
          </div>
          <div>
            <div className="text-3xl font-light mb-2">156,891</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">
              Total Highlights
            </div>
          </div>
          <div>
            <div className="text-3xl font-light mb-2">423,567</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">
              Total Verse Views
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
