"use client";

import { Book, BookOpen, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import AddTranslationModal from "@/components/modals/add-translation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialData = [
  {
    id: 1,
    language: "English",
    translator: "Sahih International",
    verses: 6236,
    lastUpdated: "2026-03-15",
    status: "published" as const,
  },
  {
    id: 2,
    language: "English",
    translator: "Yusuf Ali",
    verses: 6236,
    lastUpdated: "2026-02-20",
    status: "published" as const,
  },
  {
    id: 3,
    language: "Urdu",
    translator: "Maulana Fateh Muhammad Jalandhry",
    verses: 6236,
    lastUpdated: "2026-03-10",
    status: "published" as const,
  },
  {
    id: 4,
    language: "French",
    translator: "Muhammad Hamidullah",
    verses: 6236,
    lastUpdated: "2026-03-01",
    status: "published" as const,
  },
  {
    id: 5,
    language: "Spanish",
    translator: "Julio Cortés",
    verses: 5420,
    lastUpdated: "2026-02-15",
    status: "draft" as const,
  },
];

export default function ContentManagementPage() {
  const [data, setData] = useState(initialData);

  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    toast.success("Translation removed");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Content Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage Quran translations and display settings
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          className="bg-slate-950 hover:bg-slate-900 text-white rounded-md"
        >
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
            <p className="text-sm font-medium text-slate-500">
              Total Translations
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {data.length}
            </p>
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
          <h2 className="text-lg font-semibold text-slate-900">
            All Translations
          </h2>
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
                <TableCell className="font-medium text-slate-700">
                  {item.language}
                </TableCell>
                <TableCell className="text-slate-600">
                  {item.translator}
                </TableCell>
                <TableCell className="text-slate-600">
                  {item.verses.toLocaleString()}
                </TableCell>
                <TableCell className="text-slate-600">
                  {item.lastUpdated}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "published" ? "default" : "secondary"
                    }
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

      <AddTranslationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
