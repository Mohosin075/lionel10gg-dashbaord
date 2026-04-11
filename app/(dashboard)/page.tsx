"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Activity, Download, MousePointerClick } from "lucide-react"
import {
  dashboardCards,
  monthlyActiveUsers,
  mostViewedTranslations,
  mostSearchedVerses,
  mostBookmarkedVerses,
} from "@/lib/dummy-data"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from "recharts"

const iconMap: Record<string, React.ReactNode> = {
  "Total Users": <Users className="h-4 w-4 text-slate-400" />,
  "Active Users (7d)": <Activity className="h-4 w-4 text-slate-400" />,
  "App Downloads": <Download className="h-4 w-4 text-slate-400" />,
  "Daily Active Users": <MousePointerClick className="h-4 w-4 text-slate-400" />
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">App Analytics</h1>
        <p className="text-sm text-slate-500">Track user activity and engagement metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{card.title}</CardTitle>
              {iconMap[card.title]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs ${card.isPositive ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1 mt-1`}>
                {card.trend.startsWith('+') ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-3 w-3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                ) : null}
                {card.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Active Users</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyActiveUsers} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 60000]} ticks={[0, 15000, 30000, 45000, 60000]} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: "#fff", stroke: "#22c55e" }} activeDot={{ r: 6 }} name="Active Users" />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
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
                  data={mostViewedTranslations}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value, index }) => 
                     name 
                  }
                  labelLine={false}
                >
                  {mostViewedTranslations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
                <Tooltip cursor={{fill: 'transparent'}} />
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
                <Tooltip cursor={{fill: 'transparent'}} />
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
