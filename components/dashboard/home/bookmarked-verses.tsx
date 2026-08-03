"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    mostBookmarkedVerses
} from "@/lib/dummy-data"
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts"


export default function BookmarkedVerses() {
  return (
    <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Bookmarked Verses</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={mostBookmarkedVerses}
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
                  domain={[0, 10000]}
                  ticks={[0, 2500, 5000, 7500, 10000]}
                />
                <YAxis
                  type="category"
                  dataKey="verse"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="bookmarks" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  )
}
