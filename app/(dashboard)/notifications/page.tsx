"use client"

import { useState } from "react"
import { Send, Clock, FileText, Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const notificationSchema = z.object({
  title: z.string().min(2, "Title is required"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  status: z.enum(["sent", "scheduled", "draft"]),
  recipients: z.coerce.number().min(1).default(100),
})

type NotificationFormValues = z.infer<typeof notificationSchema>

const initialData = [
  { id: 1, title: "New Translation Added", message: "Spanish translation by Julio Cortés is now available", date: "2026-03-20", recipients: "15,420", status: "sent" as const },
  { id: 2, title: "Ramadan Feature", message: "Special Ramadan reading plan available now", date: "2026-03-25", recipients: "20,000", status: "scheduled" as const },
  { id: 3, title: "App Update v2.5", message: "New features and improvements in the latest update", date: "2026-03-15", recipients: "18,500", status: "sent" as const },
  { id: 4, title: "Weekend Reminder", message: "Don't forget to complete your daily reading goal", date: "—", recipients: "—", status: "draft" as const },
]

export default function PushNotificationsPage() {
  const [data, setData] = useState(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { status: "draft", recipients: 0 },
  })

  const onSubmit = (values: NotificationFormValues) => {
    const newEntry = {
      id: data.length + 1,
      title: values.title,
      message: values.message,
      date: values.status === "draft" ? "—" : new Date().toISOString().split("T")[0],
      recipients: values.status === "draft" ? "—" : values.recipients.toLocaleString(),
      status: values.status,
    }
    setData([newEntry, ...data])
    setIsModalOpen(false)
    reset()
    toast.success("Notification created successfully")
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge variant="default" className="bg-slate-950 text-slate-50 hover:bg-slate-900 border-transparent rounded-full px-3 py-0.5 gap-1.5 font-normal">
            <Send className="h-3 w-3" /> sent
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 rounded-full px-3 py-0.5 gap-1.5 font-normal">
            <Clock className="h-3 w-3" /> scheduled
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="text-slate-600 rounded-full px-3 py-0.5 gap-1.5 font-normal bg-white">
            <FileText className="h-3 w-3" /> draft
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Push Notification Management</h1>
          <p className="text-sm text-slate-500 mt-1">Send notifications to users about updates or new features</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-slate-950 hover:bg-slate-900 text-white rounded-md">
          <Plus className="mr-2 h-4 w-4" /> Create Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Send className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Sent Notifications</p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.filter((d) => d.status === "sent").length}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Scheduled</p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.filter((d) => d.status === "scheduled").length}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Drafts</p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.filter((d) => d.status === "draft").length}
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-slate-900">All Notifications</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Message</TableHead>
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium">Recipients</TableHead>
              <TableHead className="font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-700">{item.title}</TableCell>
                <TableCell className="text-slate-600">{item.message}</TableCell>
                <TableCell className="text-slate-600">{item.date}</TableCell>
                <TableCell className="text-slate-600">{item.recipients}</TableCell>
                <TableCell>
                  {renderStatusBadge(item.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Create Push Notification</h2>
                <p className="text-sm text-slate-500 mt-1">Send a notification to all app users or schedule it for later</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Notification Title *</label>
                <Input 
                  {...register("title")} 
                  placeholder="e.g., New Feature Available" 
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300 placeholder:text-slate-400"
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Message *</label>
                <textarea 
                  {...register("message")} 
                  className="flex min-h-[100px] w-full rounded-md bg-slate-50 px-3 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 resize-none"
                  placeholder="Enter your notification message..."
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Action</label>
                <select 
                  {...register("status")}
                  className="flex h-11 w-full rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
                >
                  <option value="sent">Send Now</option>
                  <option value="scheduled">Schedule</option>
                  <option value="draft">Save as Draft</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-lg font-medium">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#0B0F19] hover:bg-slate-800 text-white rounded-lg font-medium">Send Now</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
