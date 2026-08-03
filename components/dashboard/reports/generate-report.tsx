"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DownloadCloud, FileText } from "lucide-react";

export default function GenerateReport() {
  return (
    <Card>
      <CardHeader className="pb-3 text-base font-semibold">
        Generate Report
      </CardHeader>
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
              <SelectItem value="system-performance">
                System Performance
              </SelectItem>
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
  );
}
