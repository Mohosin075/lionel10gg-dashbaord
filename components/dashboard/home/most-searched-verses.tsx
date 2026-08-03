"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    mostSearchedVerses
} from "@/lib/dummy-data";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export default function MostSearchedVerses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Most Searched Verses</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={mostSearchedVerses}
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
              domain={[0, 16000]}
              ticks={[0, 4000, 8000, 12000, 16000]}
            />
            <YAxis
              type="category"
              dataKey="verse"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
            />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar dataKey="searches" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
