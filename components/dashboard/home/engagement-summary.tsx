"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  totalBookmarks?: number;
  totalHighlights?: number;
  totalVerseViews?: number;
};

export default function EngagementSummary({
  totalBookmarks = 0,
  totalHighlights = 0,
  totalVerseViews = 0,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Engagement Summary</CardTitle>
      </CardHeader>
      <CardContent className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-x divide-slate-100">
          <div>
            <div className="text-3xl font-light mb-2">
              {totalBookmarks.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">
              Total Bookmarks
            </div>
          </div>
          <div>
            <div className="text-3xl font-light mb-2">
              {totalHighlights.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">
              Total Highlights
            </div>
          </div>
          <div>
            <div className="text-3xl font-light mb-2">
              {totalVerseViews.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">
              Total Verse Views
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
