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
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Notification</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Title</label>
                <Input {...register("title")} placeholder="e.g. App Update" />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea 
                  {...register("message")} 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Notification content..."
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Recipients (approx)</label>
                <Input type="number" {...register("recipients")} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select 
                  {...register("status")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-950 text-white">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
