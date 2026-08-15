"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6"];

type Props = {
  monthlyActiveUsers?: { month: string; activeUsers: number }[];
  mostViewedTranslations?: { label: string; value: number }[];
};

export default function MonthlyActiveUsers({
  monthlyActiveUsers = [],
  mostViewedTranslations = [],
}: Props) {
  const lineData = monthlyActiveUsers.map((item) => ({
    month: item.month,
    users: item.activeUsers,
  }));

  const pieData = mostViewedTranslations.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Active Users</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, fill: "#fff", stroke: "#22c55e" }}
                activeDot={{ r: 6 }}
                name="Active Users"
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Most Viewed Translations</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                dataKey="value"
                label={({ name }) => name}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
