"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { Activity } from "lucide-react";

export default function UserActivityChart({ data }: { data?: any[] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      date: item.date,
      ActiveUsers: item.activeUsers ?? 0,
      NewUsers: item.newUsers ?? 0,
    }));
  }, [data]);

  const hasData = chartData.some((d) => d.ActiveUsers > 0 || d.NewUsers > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-600" />
          User Activity (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        {chartData.length === 0 || !hasData ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
            <Activity className="h-8 w-8 mb-2 opacity-30" />
            <p>No user telemetry activity recorded in the past 7 days</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
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
              <RechartsTooltip />
              <Line
                type="monotone"
                dataKey="ActiveUsers"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Active Users"
              />
              <Line
                type="monotone"
                dataKey="NewUsers"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
