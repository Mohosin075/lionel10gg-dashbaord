"use client";

import React, { useState } from "react";
import {
  Heart,
  Plus,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Download,
  Volume2,
  Repeat,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetDuasQuery,
  useGetDuaCategoriesQuery,
  useCreateDuaMutation,
  useUpdateDuaMutation,
  useDeleteDuaMutation,
  useSyncEnglishDuasMutation,
  IDua,
} from "@/redux/features/dua/duaApi";
import { APP_LANGUAGES } from "@/lib/constants/languages";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

export default function DuasPage() {
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Queries
  const { data: catRes, isLoading: isLoadingCats } = useGetDuaCategoriesQuery({
    lang: selectedLang,
  });
  const { data: duasRes, isLoading: isLoadingDuas, refetch } = useGetDuasQuery({
    lang: selectedLang,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    page,
    limit: 10,
  });

  const [createDua, { isLoading: isCreating }] = useCreateDuaMutation();
  const [updateDua, { isLoading: isUpdating }] = useUpdateDuaMutation();
  const [deleteDua, { isLoading: isDeleting }] = useDeleteDuaMutation();
  const [syncEnglishDuas, { isLoading: isSyncing }] = useSyncEnglishDuasMutation();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentDua, setCurrentDua] = useState<IDua | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formArabic, setFormArabic] = useState("");
  const [formTranslation, setFormTranslation] = useState("");
  const [formTransliteration, setFormTransliteration] = useState("");
  const [formRepeat, setFormRepeat] = useState(1);
  const [formAudio, setFormAudio] = useState("");

  const categories = catRes?.data || [];
  const duas = duasRes?.data || [];
  const meta = duasRes?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleOpenEdit = (d: IDua) => {
    setCurrentDua(d);
    setFormTitle(d.title);
    setFormCategory(d.category);
    setFormArabic(d.arabic);
    setFormTranslation(d.translation);
    setFormTransliteration(d.transliteration || "");
    setFormRepeat(d.repeat || 1);
    setFormAudio(d.audio || "");
    setIsEditOpen(true);
  };

  const handleSaveDua = async () => {
    if (!formTitle || !formArabic || !formTranslation) {
      toast.error("Title, Arabic text, and Translation are required.");
      return;
    }

    try {
      if (currentDua) {
        await updateDua({
          id: currentDua._id,
          data: {
            title: formTitle,
            category: formCategory || formTitle,
            arabic: formArabic,
            translation: formTranslation,
            transliteration: formTransliteration,
            repeat: Number(formRepeat) || 1,
            audio: formAudio,
          },
        }).unwrap();
        toast.success("Dua updated successfully!");
        setIsEditOpen(false);
      } else {
        await createDua({
          title: formTitle,
          category: formCategory || formTitle,
          arabic: formArabic,
          translation: formTranslation,
          transliteration: formTransliteration,
          repeat: Number(formRepeat) || 1,
          audio: formAudio,
          lang: selectedLang,
          version: 1,
        }).unwrap();
        toast.success("Dua added successfully!");
        setIsAddOpen(false);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save Dua");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Dua?")) return;
    try {
      await deleteDua(id).unwrap();
      toast.success("Dua deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const handleSyncHisn = async () => {
    try {
      toast.loading("Syncing canonical Hisn al-Muslim English duas...", { id: "hisn" });
      const res = await syncEnglishDuas().unwrap();
      toast.success(
        `Ingested ${res.data?.createdCount || 0} new, updated ${res.data?.updatedCount || 0} duas!`,
        { id: "hisn" }
      );
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Sync failed", { id: "hisn" });
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-900">
              <Heart className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Dua Manager
              </h1>
              <p className="text-sm text-slate-500">
                Manage Islamic Supplications &amp; Invocations (Hisn al-Muslim) across languages
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncHisn}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-xl border-slate-200"
          >
            <Download className="h-4 w-4" />
            Sync Hisn al-Muslim (EN)
          </Button>

          <Button
            onClick={() => {
              setCurrentDua(null);
              setFormTitle("");
              setFormCategory(selectedCategory !== "all" ? selectedCategory : "General");
              setFormArabic("");
              setFormTranslation("");
              setFormTransliteration("");
              setFormRepeat(1);
              setFormAudio("");
              setIsAddOpen(true);
            }}
            className="bg-emerald-900 hover:bg-emerald-800 text-white flex items-center gap-2 rounded-xl shadow"
          >
            <Plus className="h-4 w-4" />
            Add New Dua
          </Button>
        </div>
      </div>

      {/* Filter & Category Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Language:
            </span>
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

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Category:
            </span>
            <Select value={selectedCategory} onValueChange={(val) => {
              setSelectedCategory(val);
              setPage(1);
            }}>
              <SelectTrigger className="w-48 h-8 text-xs rounded-lg">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="max-h-60 rounded-xl">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pagination & Count Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{selectedCategory === "all" ? "All Supplications" : selectedCategory}</span>
            <Badge variant="outline" className="text-xs font-normal">
              {meta.total.toLocaleString()} duas
            </Badge>
          </h2>
          <p className="text-xs text-slate-500">Showing page {meta.page} of {meta.totalPages || 1}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoadingDuas}
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
            disabled={page >= meta.totalPages || isLoadingDuas}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl text-xs"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Duas List */}
      {isLoadingDuas ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-900" />
          <p className="text-sm font-medium">Loading supplications...</p>
        </div>
      ) : duas.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <BookOpen className="h-12 w-12 text-slate-300" />
          <h3 className="text-base font-semibold text-slate-700">No Duas Found</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Click &quot;Sync Hisn al-Muslim (EN)&quot; to ingest the standard authentic collection from repository.
          </p>
          <Button
            onClick={handleSyncHisn}
            className="mt-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs"
          >
            Sync Hisn al-Muslim Now
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {duas.map((dua) => (
            <Card key={dua._id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-800 text-sm">{dua.title}</span>
                  <Badge variant="outline" className="text-xs font-semibold text-emerald-800 bg-emerald-50 border-emerald-200">
                    {dua.category}
                  </Badge>
                  {dua.repeat && dua.repeat > 1 && (
                    <Badge className="bg-amber-100 text-amber-900 border-amber-200 text-xs flex items-center gap-1">
                      <Repeat className="h-3 w-3" /> {dua.repeat}x
                    </Badge>
                  )}
                  {dua.audio && (
                    <span title="Audio available" className="text-emerald-600">
                      <Volume2 className="h-4 w-4" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(dua)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-slate-800 rounded-lg"
                    title="Edit Dua"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(dua._id)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Delete Dua"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                {/* Arabic */}
                <p className="text-right font-serif text-xl leading-loose text-slate-900 dir-rtl font-medium">
                  {dua.arabic}
                </p>

                {/* Transliteration */}
                {dua.transliteration && (
                  <p className="text-xs italic text-slate-500 font-serif">
                    {dua.transliteration}
                  </p>
                )}

                {/* Translation */}
                <p className="text-sm text-slate-700 leading-relaxed">
                  {dua.translation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dua Modal */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentDua ? "Edit Dua" : "Add New Dua"}
            </DialogTitle>
            <DialogDescription>
              Supplications will be included in the next Dua offline pack for [{selectedLang}].
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Title</label>
                <Input
                  type="text"
                  placeholder="e.g. When waking up"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                <Input
                  type="text"
                  placeholder="e.g. Morning & Evening"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Arabic Text</label>
              <textarea
                rows={3}
                dir="rtl"
                placeholder="Enter Arabic text..."
                value={formArabic}
                onChange={(e) => setFormArabic(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-900 font-serif"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Transliteration (Optional)</label>
              <Input
                type="text"
                placeholder="Alhamdu lillahil-lathee ahyana..."
                value={formTransliteration}
                onChange={(e) => setFormTransliteration(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Translation ({selectedLang})</label>
              <textarea
                rows={3}
                placeholder="Enter translated meaning..."
                value={formTranslation}
                onChange={(e) => setFormTranslation(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Repeat Count</label>
                <Input
                  type="number"
                  min={1}
                  value={formRepeat}
                  onChange={(e) => setFormRepeat(Number(e.target.value))}
                  className="rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Audio URL (Optional)</label>
                <Input
                  type="text"
                  placeholder="https://..."
                  value={formAudio}
                  onChange={(e) => setFormAudio(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>
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
              onClick={handleSaveDua}
              disabled={isCreating || isUpdating}
              className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl shadow"
            >
              {isCreating || isUpdating ? "Saving..." : "Save Dua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
