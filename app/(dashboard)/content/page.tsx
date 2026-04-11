"use client"

import { useState } from "react"
import { Book, BookOpen, Edit, Plus, Trash2, X } from "lucide-react"
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

const translationSchema = z.object({
  language: z.string().min(2, "Language is required"),
  translator: z.string().min(2, "Translator is required"),
  verses: z.coerce.number().min(1, "Verses count must be greater than 0"),
  status: z.enum(["published", "draft"]),
})

type TranslationFormValues = z.infer<typeof translationSchema>

const initialData = [
  { id: 1, language: "English", translator: "Sahih International", verses: "6,236", lastUpdated: "2026-03-15", status: "published" as const },
  { id: 2, language: "English", translator: "Yusuf Ali", verses: "6,236", lastUpdated: "2026-02-20", status: "published" as const },
  { id: 3, language: "Urdu", translator: "Maulana Fateh Muhammad Jalandhry", verses: "6,236", lastUpdated: "2026-03-10", status: "published" as const },
  { id: 4, language: "French", translator: "Muhammad Hamidullah", verses: "6,236", lastUpdated: "2026-03-01", status: "published" as const },
  { id: 5, language: "Spanish", translator: "Julio Cortés", verses: "5,420", lastUpdated: "2026-02-15", status: "draft" as const },
]

export default function ContentManagementPage() {
  const [data, setData] = useState(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TranslationFormValues>({
    resolver: zodResolver(translationSchema),
    defaultValues: { status: "draft", verses: 6236 },
  })

  const onSubmit = (values: TranslationFormValues) => {
    const newEntry = {
      id: data.length + 1,
      language: values.language,
      translator: values.translator,
      verses: values.verses.toLocaleString(),
      lastUpdated: new Date().toISOString().split("T")[0],
      status: values.status,
    }
    setData([newEntry, ...data])
    setIsModalOpen(false)
    reset()
    toast.success("Translation added successfully")
  }

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id))
    toast.success("Translation removed")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Content Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage Quran translations and display settings</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-slate-950 hover:bg-slate-900 text-white rounded-md">
          <Plus className="mr-2 h-4 w-4" /> Add Translation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Book className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Translations</p>
            <p className="text-2xl font-semibold text-slate-900">{data.length}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Published</p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.filter((d) => d.status === "published").length}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <BookOpen className="h-6 w-6" />
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
          <h2 className="text-lg font-semibold text-slate-900">All Translations</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Language</TableHead>
              <TableHead className="font-medium">Translator</TableHead>
              <TableHead className="font-medium">Verses</TableHead>
              <TableHead className="font-medium">Last Updated</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-700">{item.language}</TableCell>
                <TableCell className="text-slate-600">{item.translator}</TableCell>
                <TableCell className="text-slate-600">{item.verses}</TableCell>
                <TableCell className="text-slate-600">{item.lastUpdated}</TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === "published" ? "default" : "secondary"}
                    className={
                      item.status === "published"
                        ? "bg-slate-950 text-slate-50 hover:bg-slate-900 border-transparent rounded-full px-3 py-0.5"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent rounded-full px-3 py-0.5"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Add New Translation</h2>
                <p className="text-sm text-slate-500 mt-1">Add a new Quran translation to the app</p>
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
                <label className="text-sm font-medium text-slate-900">Language *</label>
                <Input 
                  {...register("language")} 
                  placeholder="e.g., English, Arabic, Urdu" 
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300 placeholder:text-slate-400"
                />
                {errors.language && <p className="text-xs text-red-500">{errors.language.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Translator Name *</label>
                <Input 
                  {...register("translator")} 
                  placeholder="e.g., Sahih International" 
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300 placeholder:text-slate-400"
                />
                {errors.translator && <p className="text-xs text-red-500">{errors.translator.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Number of Verses *</label>
                <Input 
                  type="number" 
                  {...register("verses")} 
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300 placeholder:text-slate-400"
                />
                {errors.verses && <p className="text-xs text-red-500">{errors.verses.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Status</label>
                <select 
                  {...register("status")}
                  className="flex h-11 w-full rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-lg font-medium">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#0B0F19] hover:bg-slate-800 text-white rounded-lg font-medium">Add Translation</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
