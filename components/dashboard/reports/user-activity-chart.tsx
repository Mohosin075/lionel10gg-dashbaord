"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportsUserActivity } from "@/lib/dummy-data";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function UserActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">User Activity (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={reportsUserActivity}
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
              domain={[0, 14000]}
              ticks={[0, 3500, 7000, 10500, 14000]}
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
      </CardContent>
    </Card>
  );
}
