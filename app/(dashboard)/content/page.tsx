"use client";

import { Book, BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import TranslationsTable from "@/components/dashbaord/content/translations-table";
import { Button } from "@/components/ui/button";
import AddTranslationModal from "@/components/modals/add-translation-modal";
import { StatsCard } from "@/components/shared/stats-card";

export const initialData = [
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

export const statsData = [
  {
    title: "Total Translations",
    value: 5,
    icon: Book,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Published",
    value: 4,
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Drafts",
    value: 1,
    icon: BookOpen,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export default function ContentManagementPage() {
  const [isOpen, setIsOpen] = useState(false);

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
          onClick={() => setIsOpen(true)}
          className="bg-slate-950 hover:bg-slate-900 text-white rounded-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Translation
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCard data={statsData} />

      <TranslationsTable />
      <AddTranslationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
