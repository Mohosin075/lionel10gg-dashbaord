"use client"

import DashboardStatsCard from "@/components/dashbaord/dash-home/dashboard-stats-card"
import MonthlyActiveUsers from "@/components/dashbaord/dash-home/monthly-active-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  monthlyActiveUsers,
  mostBookmarkedVerses,
  mostSearchedVerses,
  mostViewedTranslations
} from "@/lib/dummy-data"
import { Activity, Download, MousePointerClick, Users } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell, Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from "recharts"

const iconMap: Record<string, React.ReactNode> = {
  "Total Users": <Users className="h-4 w-4 text-slate-400" />,
  "Active Users (7d)": <Activity className="h-4 w-4 text-slate-400" />,
  "App Downloads": <Download className="h-4 w-4 text-slate-400" />,
  "Daily Active Users": <MousePointerClick className="h-4 w-4 text-slate-400" />
}

const dashboardCards = [
  { title: "Total Users", icon: <Users className="h-4 w-4 text-slate-400" />, value: "45,230", trend: "+12.5%", isPositive: true },
  { title: "Active Users (7d)", icon: <Activity className="h-4 w-4 text-slate-400" />, value: "28,450", trend: "+8.3%", isPositive: true },
  { title: "App Downloads", icon: <Download className="h-4 w-4 text-slate-400" />, value: "52,100", trend: "+15.7%", isPositive: true },
  { title: "Daily Active Users", icon: <MousePointerClick className="h-4 w-4 text-slate-400" />, value: "12,340", trend: "+5.2%", isPositive: true },
];

export default function DashboardPage() {



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">App Analytics</h1>
        <p className="text-sm text-slate-500">Track user activity and engagement metrics</p>
      </div>

      <DashboardStatsCard stats={dashboardCards} />

      <MonthlyActiveUsers />
      

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Searched Verses</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={mostSearchedVerses} margin={{ top: 5, right: 10, left: 30, bottom: 0 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 16000]} ticks={[0, 4000, 8000, 12000, 16000]} />
                <YAxis type="category" dataKey="verse" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="searches" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Bookmarked Verses</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={mostBookmarkedVerses} margin={{ top: 5, right: 10, left: 30, bottom: 0 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 10000]} ticks={[0, 2500, 5000, 7500, 10000]} />
                <YAxis type="category" dataKey="verse" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="bookmarks" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Engagement Summary</CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-x divide-slate-100">
            <div>
              <div className="text-3xl font-light mb-2">89,234</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Total Bookmarks</div>
            </div>
            <div>
              <div className="text-3xl font-light mb-2">156,891</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Total Highlights</div>
            </div>
            <div>
              <div className="text-3xl font-light mb-2">423,567</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Total Verse Views</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
