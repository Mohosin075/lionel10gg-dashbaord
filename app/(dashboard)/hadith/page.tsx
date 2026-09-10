"use client";

import React, { useState } from "react";
import {
  BookText,
  Plus,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Download,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetCollectionsQuery,
  useGetHadithsQuery,
  useCreateHadithMutation,
  useUpdateHadithMutation,
  useDeleteHadithMutation,
  useSyncExternalHadithMutation,
  IHadith,
} from "@/redux/features/hadith/hadithApi";
import { APP_LANGUAGES } from "@/lib/constants/languages";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HadithPage() {
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedSource, setSelectedSource] = useState("Sahih al-Bukhari");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Queries & Mutations
  const { data: colRes, isLoading: isLoadingCols, refetch: refetchCols } = useGetCollectionsQuery({
    lang: selectedLang,
  });
  const { data: hadithRes, isLoading: isLoadingHadiths, refetch: refetchHadiths } = useGetHadithsQuery({
    source: selectedSource,
    lang: selectedLang,
    page,
    limit: 10,
  });

  const [createHadith, { isLoading: isCreating }] = useCreateHadithMutation();
  const [updateHadith, { isLoading: isUpdating }] = useUpdateHadithMutation();
  const [deleteHadith, { isLoading: isDeleting }] = useDeleteHadithMutation();
  const [syncExternal, { isLoading: isSyncing }] = useSyncExternalHadithMutation();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [currentHadith, setCurrentHadith] = useState<IHadith | null>(null);

  // Form states
  const [formHadithNo, setFormHadithNo] = useState<number>(1);
  const [formChapter, setFormChapter] = useState("");
  const [formArabic, setFormArabic] = useState("");
  const [formTranslation, setFormTranslation] = useState("");
  const [formAuthenticity, setFormAuthenticity] = useState("Sahih");

  // Sync form
  const [syncEdition, setSyncEdition] = useState("eng-bukhari");
  const [syncFrom, setSyncFrom] = useState(1);
  const [syncTo, setSyncTo] = useState(100);

  const collections = colRes?.data || [];
  const hadiths = hadithRes?.data || [];
  const meta = hadithRes?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleOpenEdit = (h: IHadith) => {
    setCurrentHadith(h);
    setFormHadithNo(h.hadithNo);
    setFormChapter(h.chapter || "");
    setFormArabic(h.arabicText);
    setFormTranslation(h.translation);
    setFormAuthenticity(h.authenticity || "Sahih");
    setIsEditOpen(true);
  };

  const handleSaveHadith = async () => {
    if (!formArabic || !formTranslation) {
      toast.error("Arabic text and translation are required.");
      return;
    }

    try {
      if (currentHadith) {
        await updateHadith({
          id: currentHadith._id,
          data: {
            hadithNo: Number(formHadithNo),
            chapter: formChapter,
            arabicText: formArabic,
            translation: formTranslation,
            authenticity: formAuthenticity,
          },
        }).unwrap();
        toast.success("Hadith updated successfully!");
        setIsEditOpen(false);
      } else {
        await createHadith({
          hadithNo: Number(formHadithNo),
          source: selectedSource,
          chapter: formChapter,
          arabicText: formArabic,
          translation: formTranslation,
          authenticity: formAuthenticity,
          lang: selectedLang,
          isActive: true,
        }).unwrap();
        toast.success("Hadith created successfully!");
        setIsAddOpen(false);
      }
      refetchHadiths();
      refetchCols();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save hadith");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Hadith?")) return;
    try {
      await deleteHadith(id).unwrap();
      toast.success("Hadith deleted successfully!");
      refetchHadiths();
      refetchCols();
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const handleSyncExternal = async () => {
    try {
      toast.loading("Syncing Hadiths from global API...", { id: "sync" });
      const res = await syncExternal({
        edition: syncEdition,
        from: Number(syncFrom),
        to: Number(syncTo),
      }).unwrap();
      toast.success(
        `Seeded ${res.data?.createdCount || 0} new, updated ${res.data?.updatedCount || 0} hadiths!`,
        { id: "sync" }
      );
      setIsSyncOpen(false);
      refetchHadiths();
      refetchCols();
    } catch (err: any) {
      toast.error(err?.data?.message || "Sync failed", { id: "sync" });
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-900">
              <BookText className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Hadith Manager
              </h1>
              <p className="text-sm text-slate-500">
                Browse, edit, seed, and publish 8 canonical Hadith collections across languages
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSyncOpen(true)}
            className="flex items-center gap-2 rounded-xl border-slate-200"
          >
            <Download className="h-4 w-4" />
            Seed / Sync External
          </Button>

          <Button
            onClick={() => {
              setCurrentHadith(null);
              setFormHadithNo(hadiths.length + 1);
              setFormChapter("");
              setFormArabic("");
              setFormTranslation("");
              setFormAuthenticity("Sahih");
              setIsAddOpen(true);
            }}
            className="bg-emerald-900 hover:bg-emerald-800 text-white flex items-center gap-2 rounded-xl shadow"
          >
            <Plus className="h-4 w-4" />
            Add Hadith
          </Button>
        </div>
      </div>

      {/* 8 Collections Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Canonical Collections (8 Books)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Language:</span>
            <Select value={selectedLang} onValueChange={setSelectedLang}>
              <SelectTrigger className="w-36 h-8 text-xs rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 rounded-xl">
                {APP_LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {collections.map((col) => {
            const isSelected = selectedSource === col.name;
            return (
              <button
                key={col.key}
                onClick={() => {
                  setSelectedSource(col.name);
                  setPage(1);
                }}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-900 text-white border-amber-900 shadow"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <span className="text-xs font-bold line-clamp-1">{col.name.replace("Sahih ", "").replace("Sunan ", "")}</span>
                <span className={`text-[11px] mt-1.5 font-mono ${isSelected ? "text-amber-200" : "text-slate-500"}`}>
                  {col.count.toLocaleString()} hadiths
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hadith List Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{selectedSource}</span>
            <Badge variant="outline" className="text-xs font-normal">
              {meta.total.toLocaleString()} total
            </Badge>
          </h2>
          <p className="text-xs text-slate-500">Showing page {meta.page} of {meta.totalPages}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoadingHadiths}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-xl text-xs"
          >
            Previous
          </Button>
          <span className="text-xs text-slate-600 font-medium px-2">
            Page {page} / {meta.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages || isLoadingHadiths}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl text-xs"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Hadith Cards */}
      {isLoadingHadiths ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-900" />
          <p className="text-sm font-medium">Loading hadiths from {selectedSource}...</p>
        </div>
      ) : hadiths.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <BookOpen className="h-12 w-12 text-slate-300" />
          <h3 className="text-base font-semibold text-slate-700">No Hadiths Found in Database</h3>
          <p className="text-xs text-slate-400 max-w-md">
            No hadiths found for {selectedSource} in &apos;{selectedLang}&apos;. Click &quot;Seed / Sync External&quot; to ingest from the global repository.
          </p>
          <Button
            onClick={() => setIsSyncOpen(true)}
            className="mt-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs"
          >
            Sync Collection Now
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {hadiths.map((h) => (
            <Card key={h._id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg">
                    #{h.hadithNo}
                  </span>
                  {h.chapter && (
                    <span className="text-xs text-slate-500 font-medium line-clamp-1">
                      Chapter: {h.chapter}
                    </span>
                  )}
                  {h.authenticity && (
                    <Badge variant="outline" className="text-xs font-semibold text-emerald-800 bg-emerald-50 border-emerald-200">
                      {h.authenticity}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(h)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-slate-800 rounded-lg"
                    title="Edit Hadith"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(h._id)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Delete Hadith"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                {/* Arabic */}
                <p className="text-right font-serif text-lg leading-loose text-slate-900 dir-rtl font-medium">
                  {h.arabicText}
                </p>

                {/* Translation */}
                <p className="text-sm text-slate-700 leading-relaxed">
                  {h.translation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Hadith Modal */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentHadith ? "Edit Hadith" : `Add Hadith to ${selectedSource}`}
            </DialogTitle>
            <DialogDescription>
              Changes are immediately reflected in MongoDB and will be included in the next offline pack generation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Hadith Number</label>
                <Input
                  type="number"
                  value={formHadithNo}
                  onChange={(e) => setFormHadithNo(Number(e.target.value))}
                  className="rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Authenticity / Grade</label>
                <Select value={formAuthenticity} onValueChange={setFormAuthenticity}>
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Sahih">Sahih (Authentic)</SelectItem>
                    <SelectItem value="Hasan">Hasan (Good)</SelectItem>
                    <SelectItem value="Da'if">Da&apos;if (Weak)</SelectItem>
                    <SelectItem value="Mutawatir">Mutawatir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Chapter Name</label>
              <Input
                type="text"
                placeholder="e.g. Book of Revelation"
                value={formChapter}
                onChange={(e) => setFormChapter(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Arabic Text</label>
              <textarea
                rows={3}
                dir="rtl"
                placeholder="Enter Arabic Hadith text..."
                value={formArabic}
                onChange={(e) => setFormArabic(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-900 font-serif"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Translation ({selectedLang})</label>
              <textarea
                rows={3}
                placeholder="Enter translated text..."
                value={formTranslation}
                onChange={(e) => setFormTranslation(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-900"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveHadith}
              disabled={isCreating || isUpdating}
              className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl shadow"
            >
              {isCreating || isUpdating ? "Saving..." : "Save Hadith"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync External Modal */}
      <Dialog open={isSyncOpen} onOpenChange={setIsSyncOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Download className="h-5 w-5 text-amber-700" />
              Sync from Global Hadith Repository
            </DialogTitle>
            <DialogDescription>
              Fetch canonical editions from github.com/fawazahmed0/hadith-api directly into your database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Target Edition</label>
              <Select value={syncEdition} onValueChange={setSyncEdition}>
                <SelectTrigger className="rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="eng-bukhari">Sahih al-Bukhari (eng-bukhari)</SelectItem>
                  <SelectItem value="eng-muslim">Sahih Muslim (eng-muslim)</SelectItem>
                  <SelectItem value="eng-abudawud">Sunan Abi Dawud (eng-abudawud)</SelectItem>
                  <SelectItem value="eng-tirmidhi">Jami at-Tirmidhi (eng-tirmidhi)</SelectItem>
                  <SelectItem value="eng-nasai">Sunan an-Nasai (eng-nasai)</SelectItem>
                  <SelectItem value="eng-ibnmajah">Sunan Ibn Majah (eng-ibnmajah)</SelectItem>
                  <SelectItem value="eng-malik">Muwatta Malik (eng-malik)</SelectItem>
                  <SelectItem value="eng-nawawi">Forty Hadith Nawawi (eng-nawawi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">From Hadith #</label>
                <Input
                  type="number"
                  value={syncFrom}
                  onChange={(e) => setSyncFrom(Number(e.target.value))}
                  className="rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">To Hadith #</label>
                <Input
                  type="number"
                  value={syncTo}
                  onChange={(e) => setSyncTo(Number(e.target.value))}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSyncExternal}
              disabled={isSyncing}
              className="bg-amber-900 hover:bg-amber-800 text-white rounded-xl shadow"
            >
              {isSyncing ? "Seeding..." : "Start Ingestion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
