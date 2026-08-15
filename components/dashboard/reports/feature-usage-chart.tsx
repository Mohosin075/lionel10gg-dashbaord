"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportsFeatureUsage } from "@/lib/dummy-data";
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

export default function FeatureUsageChart({ data }: { data?: any[] }) {
  const chartData = useMemo(() => {
    if (!data) return reportsFeatureUsage;
    return data.map((item) => ({
      name: item.label,
      value: item.count,
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Feature Usage Statistics</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            barSize={40}
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
              domain={[0, 320000]}
              ticks={[0, 80000, 160000, 240000, 320000]}
            />
            <RechartsTooltip cursor={{ fill: "transparent" }} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
