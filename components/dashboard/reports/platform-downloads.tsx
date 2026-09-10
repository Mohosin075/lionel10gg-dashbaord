"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Smartphone } from "lucide-react";

export default function PlatformDownloads({ data }: { data?: { android: number; ios: number } }) {
  const android = data?.android ?? 0;
  const ios = data?.ios ?? 0;
  const total = android + ios;
  const androidPercent = total > 0 ? Number(((android / total) * 100).toFixed(1)) : 0;
  const iosPercent = total > 0 ? Number(((ios / total) * 100).toFixed(1)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-blue-600" />
          Downloads by Platform
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {total === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            <p className="font-medium text-slate-600">0 Downloads Tracked</p>
            <p className="text-xs text-slate-400 mt-1">
              Google Play &amp; App Store telemetry events will populate here upon sync.
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
