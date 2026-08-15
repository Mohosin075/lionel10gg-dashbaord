"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data?: { label: string; count: number }[];
};

export default function MostSearchedVerses({ data = [] }: Props) {
  const chartData = data.map((item) => ({
    verse: item.label,
    searches: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Most Searched Verses</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 10, left: 30, bottom: 0 }}
            barSize={20}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={true}
              stroke="#f1f5f9"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              type="category"
              dataKey="verse"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              width={110}
            />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar dataKey="searches" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
