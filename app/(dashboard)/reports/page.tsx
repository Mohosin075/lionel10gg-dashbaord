"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Download, Calendar, FileText, DownloadCloud } from "lucide-react"
import { reportsUserActivity, reportsFeatureUsage } from "@/lib/dummy-data"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts"

export default function ReportsPage() {
  const cards = [
    { title: "Active Users", value: "28,450", icon: <Activity className="h-5 w-5 text-blue-500" />, iconBg: "bg-blue-50" },
    { title: "Total Downloads", value: "52,100", icon: <Download className="h-5 w-5 text-emerald-500" />, iconBg: "bg-emerald-50" },
    { title: "New Users (7d)", value: "3,495", icon: <Calendar className="h-5 w-5 text-purple-500" />, iconBg: "bg-purple-50" },
    { title: "Avg. Session Time", value: "12m", icon: <FileText className="h-5 w-5 text-orange-500" />, iconBg: "bg-orange-50" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-slate-500">Generate and download usage statistics and analytics reports</p>
      </div>

      <Card>
        <CardHeader className="pb-3 text-base font-semibold">Generate Report</CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select defaultValue="user-activity">
              <SelectTrigger>
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user-activity">User Activity</SelectItem>
                <SelectItem value="content-usage">Content Usage</SelectItem>
                <SelectItem value="system-performance">System Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select defaultValue="last-7-days">
              <SelectTrigger>
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex-1 gap-2">
                <FileText className="h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <DownloadCloud className="h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <DownloadCloud className="h-4 w-4" /> Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${card.iconBg}`}>
                {card.icon}
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">{card.title}</div>
                <div className="text-2xl font-semibold">{card.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportsUserActivity} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 14000]} ticks={[0, 3500, 7000, 10500, 14000]} />
                <RechartsTooltip />
                <Line type="smooth" dataKey="ActiveUsers" stroke="#22c55e" strokeWidth={2} dot={false} name="Active Users" />
                <Line type="smooth" dataKey="NewUsers" stroke="#8b5cf6" strokeWidth={2} dot={false} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feature Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportsFeatureUsage} margin={{ top: 5, right: 10, left: 10, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 320000]} ticks={[0, 80000, 160000, 240000, 320000]} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Downloads by Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-500">Android</span>
              <span className="text-slate-900 font-medium">32,450 (62.3%)</span>
            </div>
            <Progress value={62.3} indicatorColor="bg-green-500" className="h-2 bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm flex-row text-right">
               <span className="font-medium text-slate-500">iOS</span>
              <span className="text-slate-900 font-medium">19,650 (37.7%)</span>
            </div>
            <Progress value={37.7} indicatorColor="bg-blue-600" className="h-2 bg-slate-100" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            <div className="flex justify-between py-4 text-sm">
              <span className="text-slate-500">Total App Users</span>
              <span className="font-medium">45,230</span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-slate-500">Total Verse Views</span>
              <span className="font-medium">423,567</span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-slate-500">Total Bookmarks Created</span>
              <span className="font-medium">89,234</span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-slate-500">Total Highlights Created</span>
              <span className="font-medium">156,891</span>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <span className="text-slate-500">Average Daily Active Users</span>
              <span className="font-medium">12,636</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <br/>
    </div>
  )
}
