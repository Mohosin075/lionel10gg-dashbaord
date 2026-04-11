"use client"

import { useState } from "react"
import { Globe, Info, Plus, Edit, Trash2, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const languageSchema = z.object({
  language: z.string().min(2, "Language is required"),
  code: z.string().min(2, "Code is required").max(3),
  direction: z.enum(["LTR", "RTL"]),
  translations: z.coerce.number().min(0).default(0),
  status: z.boolean().default(true),
})

type LanguageFormValues = z.infer<typeof languageSchema>

const initialData = [
  { id: 1, language: "English", code: "en", direction: "LTR", translations: 15, status: true },
  { id: 2, language: "Arabic", code: "ar", direction: "RTL", translations: 8, status: true },
  { id: 3, language: "Urdu", code: "ur", direction: "RTL", translations: 12, status: true },
  { id: 4, language: "French", code: "fr", direction: "LTR", translations: 6, status: true },
  { id: 5, language: "Spanish", code: "es", direction: "LTR", translations: 4, status: true },
  { id: 6, language: "Turkish", code: "tr", direction: "LTR", translations: 5, status: true },
  { id: 7, language: "Indonesian", code: "id", direction: "LTR", translations: 7, status: true },
  { id: 8, language: "German", code: "de", direction: "LTR", translations: 3, status: false },
]

export default function LanguageSettingsPage() {
  const [data, setData] = useState(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { direction: "LTR", translations: 0, status: true },
  })

  // Watch status to make the custom Switch work with react-hook-form
  const statusValue = watch("status")

  const onSubmit = (values: LanguageFormValues) => {
    const newEntry = {
      id: data.length + 1,
      language: values.language,
      code: values.code,
      direction: values.direction,
      translations: values.translations,
      status: values.status,
    }
    setData([newEntry, ...data])
    setIsModalOpen(false)
    reset()
    toast.success("Language added successfully")
  }

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id))
    toast.success("Language removed")
  }

  const toggleStatus = (id: number) => {
    setData(data.map((item) => 
      item.id === id ? { ...item, status: !item.status } : item
    ))
    toast.success("Status updated")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Language Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage languages and translation files</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-slate-950 hover:bg-slate-900 text-white rounded-md">
          <Plus className="mr-2 h-4 w-4" /> Add Language
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Languages</p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.length}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Enabled Languages</p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.filter((d) => d.status).length}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">RTL Languages</p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.filter((d) => d.direction === "RTL").length}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Translations</p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.reduce((acc, curr) => acc + curr.translations, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-slate-900">All Languages</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Language</TableHead>
              <TableHead className="font-medium">Code</TableHead>
              <TableHead className="font-medium">Direction</TableHead>
              <TableHead className="font-medium">Translations</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-700 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  {item.language}
                </TableCell>
                <TableCell>
                  <span className="bg-slate-100 text-slate-600 text-xs font-mono px-2 py-1 rounded-md">
                    {item.code}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-slate-600 border-slate-200 bg-white">
                    {item.direction}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600">{item.translations}</TableCell>
                <TableCell>
                  <Switch 
                    checked={item.status}
                    onCheckedChange={() => toggleStatus(item.id)}
                  />
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

      {/* Info Notice */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 flex gap-4">
        <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Globe className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Managing Translation Files</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Use the "Upload Translations" button to add or update translation files for each language. 
            Supported formats include JSON and CSV. Each translation file should contain all 6,236 verses 
            of the Quran with their respective translations.
          </p>
        </div>
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Add New Language</h2>
                <p className="text-sm text-slate-500 mt-1">Add a new language to the app</p>
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
                <label className="text-sm font-medium text-slate-900">Language Name *</label>
                <Input 
                  {...register("language")} 
                  placeholder="e.g., English, Arabic, French" 
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300 placeholder:text-slate-400"
                />
                {errors.language && <p className="text-xs text-red-500">{errors.language.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Language Code *</label>
                <Input 
                  {...register("code")} 
                  placeholder="e.g., en, ar, fr" 
                  maxLength={3} 
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300 placeholder:text-slate-400"
                />
                {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Text Direction</label>
                <select 
                  {...register("direction")}
                  className="flex h-11 w-full rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
                >
                  <option value="LTR">Left to Right (LTR)</option>
                  <option value="RTL">Right to Left (RTL)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between mt-2 p-4 rounded-xl bg-slate-50 border border-transparent">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-slate-900">Enable Language</label>
                  <p className="text-sm text-slate-500">Make this language available in the app</p>
                </div>
                <Switch 
                  checked={statusValue} 
                  onCheckedChange={(val) => setValue("status", val)} 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-lg font-medium">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#0B0F19] hover:bg-slate-800 text-white rounded-lg font-medium">Add Language</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
