"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PlatformDownloads({ data }: { data?: { android: number; ios: number } }) {
  const android = data?.android ?? 32450;
  const ios = data?.ios ?? 19650;
  const total = android + ios;
  const androidPercent = total > 0 ? Number(((android / total) * 100).toFixed(1)) : 0;
  const iosPercent = total > 0 ? Number(((ios / total) * 100).toFixed(1)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Downloads by Platform</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-500">Android</span>
            <span className="font-medium text-slate-900">
              {android.toLocaleString()} ({androidPercent}%)
            </span>
          </div>
          <Progress
            value={androidPercent}
            indicatorColor="bg-green-500"
            className="h-2 bg-slate-100"
          />
        </div>
        <div className="space-y-2">
          <div className="flex flex-row justify-between text-right text-sm">
            <span className="font-medium text-slate-500">iOS</span>
            <span className="font-medium text-slate-900">
              {ios.toLocaleString()} ({iosPercent}%)
            </span>
          </div>
          <Progress
            value={iosPercent}
            indicatorColor="bg-blue-600"
            className="h-2 bg-slate-100"
          />
        </div>
      </CardContent>
    </Card>
  );
}
