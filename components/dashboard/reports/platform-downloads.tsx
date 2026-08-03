"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PlatformDownloads() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Downloads by Platform</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-500">Android</span>
            <span className="font-medium text-slate-900">32,450 (62.3%)</span>
          </div>
          <Progress
            value={62.3}
            indicatorColor="bg-green-500"
            className="h-2 bg-slate-100"
          />
        </div>
        <div className="space-y-2">
          <div className="flex flex-row justify-between text-right text-sm">
            <span className="font-medium text-slate-500">iOS</span>
            <span className="font-medium text-slate-900">19,650 (37.7%)</span>
          </div>
          <Progress
            value={37.7}
            indicatorColor="bg-blue-600"
            className="h-2 bg-slate-100"
          />
        </div>
      </CardContent>
    </Card>
  );
}
