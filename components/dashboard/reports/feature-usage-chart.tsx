"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { BarChart3 } from "lucide-react";

export default function FeatureUsageChart({ data }: { data?: any[] }) {
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    return [];
  }, [data]);

  const hasData = chartData.some((item) => (item.value || 0) > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-600" />
          Feature Usage &amp; Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
            <BarChart3 className="h-8 w-8 mb-2 opacity-30" />
            <p>No feature engagement recorded yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                domain={[0, "auto"]}
              />
              <RechartsTooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
