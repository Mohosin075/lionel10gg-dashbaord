"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DownloadCloud,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  HardDrive,
  FileCheck,
  Layers,
  Sparkles,
  ExternalLink,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetPacksQuery,
  useGeneratePackMutation,
  IOfflinePack,
} from "@/redux/features/offline-pack/offlinePackApi";
import { APP_LANGUAGES } from "@/lib/constants/languages";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type ModuleType = "all" | "hadith" | "dua" | "knowledge";

export default function OfflinePacksPage() {
  const { data: packsRes, isLoading, refetch, isFetching } = useGetPacksQuery();
  const [generatePack, { isLoading: isGenerating }] = useGeneratePackMutation();

  const [activeModule, setActiveModule] = useState<ModuleType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("bn");
  const [genModule, setGenModule] = useState<"hadith" | "dua" | "knowledge">("hadith");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);

  const packs = packsRes?.data || [];

  const filteredPacks = packs.filter((p) => {
    const matchesModule = activeModule === "all" || p.module === activeModule;
    const langObj = APP_LANGUAGES.find((l) => l.code === p.lang);
    const langName = langObj ? langObj.name.toLowerCase() : "";
    const matchesSearch =
      p.lang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      langName.includes(searchQuery.toLowerCase()) ||
      p.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const totalSizeMb = packs.reduce((acc, p) => acc + (p.packSizeMb || 0), 0);
  const totalRecords = packs.reduce((acc, p) => acc + (p.recordCount || 0), 0);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    toast.success("SHA-256 Checksum copied to clipboard!");
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleGenerate = async () => {
    try {
      const res = await generatePack({ module: genModule, lang: selectedLang }).unwrap();
      toast.success(res.message || `${genModule.toUpperCase()} pack for [${selectedLang}] generated successfully!`);
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to generate pack");
    }
  };

  const handleRegenerate = async (pack: IOfflinePack) => {
    try {
      toast.loading(`Regenerating ${pack.module.toUpperCase()} pack for ${pack.lang}...`, { id: "regen" });
      await generatePack({ module: pack.module, lang: pack.lang }).unwrap();
      toast.success(`Updated ${pack.module} pack for ${pack.lang} to new version!`, { id: "regen" });
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Regeneration failed", { id: "regen" });
    }
  };

  // Quick batch generator for top priority languages
  const handleQuickBatch = async (moduleName: "hadith" | "dua" | "knowledge") => {
    const topLangs = ["en", "bn", "ar", "ur", "tr", "id"];
    setIsBulkGenerating(true);
    toast.loading(`Generating ${moduleName} packs for top 6 languages...`, { id: "bulk" });
    try {
      for (const lang of topLangs) {
        await generatePack({ module: moduleName, lang }).unwrap();
      }
      toast.success(`All 6 ${moduleName} packs generated and uploaded to S3!`, { id: "bulk" });
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Bulk generation error", { id: "bulk" });
    } finally {
      setIsBulkGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl text-white shadow-sm">
              <DownloadCloud className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Offline Pack Manager
              </h1>
              <p className="text-sm text-slate-500">
                GZip Level 9 compression &amp; SHA-256 verified SQLite dumps streamed directly to mobile apps
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-900 hover:bg-emerald-800 text-white flex items-center gap-2 rounded-xl shadow cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Generate New Pack
          </Button>
        </div>
      </div>

      {/* Interactive 4-Step Pipeline Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            End-to-End Islamic Offline Delivery Pipeline
          </span>
          <span className="text-xs text-emerald-700 font-semibold">100% Automated</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/hadith"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">STEP 1</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">Ingest</span>
            </div>
            <p className="text-sm font-bold text-slate-800 mt-1 group-hover:text-emerald-950">Seed Core Collections</p>
            <p className="text-xs text-slate-400 mt-0.5">8 Hadith Books &amp; Hisn al-Muslim</p>
          </Link>

          <Link
            href="/translations"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">STEP 2</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">AI Batch</span>
            </div>
            <p className="text-sm font-bold text-slate-800 mt-1 group-hover:text-blue-950">OpenAI Batch Translate</p>
            <p className="text-xs text-slate-400 mt-0.5">109 Languages at 50% discount</p>
          </Link>

          <div className="p-3.5 rounded-xl border-2 border-emerald-900 bg-emerald-900 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">STEP 3</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/20 text-white rounded">Active</span>
            </div>
            <p className="text-sm font-bold text-white mt-1">Generate S3 Pack</p>
            <p className="text-xs text-emerald-200 mt-0.5">GZip L9 + SHA-256 Cryptography</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">STEP 4</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded">Mobile Sync</span>
            </div>
            <p className="text-sm font-bold text-slate-800 mt-1">Client Auto-Fetch</p>
            <p className="text-xs text-slate-400 mt-0.5">SQLite chunked bulk insertion</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500 font-medium">Total Packs Published</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900 flex items-center justify-between">
              {packs.length}
              <Layers className="h-6 w-6 text-emerald-600 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-emerald-600">S3 Synced &amp; Mobile Ready</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500 font-medium">Storage Bandwidth</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900 flex items-center justify-between">
              {totalSizeMb.toFixed(2)} <span className="text-lg text-slate-400 font-normal">MB</span>
              <HardDrive className="h-6 w-6 text-blue-600 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-blue-600">High-ratio GZip compressed (88% reduction)</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500 font-medium">Total Records Bundled</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900 flex items-center justify-between">
              {totalRecords.toLocaleString()}
              <FileCheck className="h-6 w-6 text-purple-600 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-purple-600">Hadith, Duas, Knowledge items</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500 font-medium">Integrity Standard</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900 flex items-center justify-between">
              SHA-256
              <ShieldCheck className="h-6 w-6 text-teal-600 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-teal-600">Cryptographically verified on phone</span>
          </CardContent>
        </Card>
      </div>

      {/* Quick Batch Actions & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {(["all", "hadith", "dua", "knowledge"] as ModuleType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveModule(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeModule === tab
                  ? "bg-emerald-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab === "all" ? "All Modules" : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by language code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />

          <Button
            variant="outline"
            size="sm"
            disabled={isBulkGenerating}
            onClick={() => handleQuickBatch("hadith")}
            className="text-xs rounded-xl text-emerald-900 border-emerald-200 hover:bg-emerald-50 whitespace-nowrap"
          >
            Batch Hadith (Top 6)
          </Button>
        </div>
      </div>

      {/* Packs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-900" />
            <p className="text-sm font-medium">Loading published offline packs...</p>
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
            <DownloadCloud className="h-12 w-12 text-slate-300" />
            <h3 className="text-base font-semibold text-slate-700">No Offline Packs Found</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Generate a pack using the button above to build and upload a production-ready SQLite-compatible gzip bundle.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs"
            >
              Generate First Pack
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Module</th>
                  <th className="py-4 px-6">Language</th>
                  <th className="py-4 px-6">Version</th>
                  <th className="py-4 px-6">Size / Records</th>
                  <th className="py-4 px-6">SHA-256 Checksum</th>
                  <th className="py-4 px-6">Generated Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPacks.map((pack) => {
                  const langItem = APP_LANGUAGES.find((l) => l.code === pack.lang);
                  const isCopied = copiedHash === pack.sha256;

                  return (
                    <tr key={pack._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">
                        <Badge
                          variant="outline"
                          className={`capitalize font-semibold text-xs rounded-lg ${
                            pack.module === "hadith"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : pack.module === "dua"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {pack.module}
                        </Badge>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {langItem ? langItem.name : pack.lang}
                          </span>
                          <span className="text-xs text-slate-400 font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                            {pack.lang}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <Badge className="bg-slate-900 text-white font-mono text-xs rounded-md">
                          v{pack.version}
                        </Badge>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">
                            {pack.packSizeMb} MB
                          </span>
                          <span className="text-xs text-slate-400">
                            {pack.recordCount.toLocaleString()} items
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs">
                        <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg w-fit transition-colors">
                          <span className="text-slate-600">
                            {pack.sha256.slice(0, 10)}...{pack.sha256.slice(-8)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyHash(pack.sha256)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                            title="Copy full SHA-256 hash"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(pack.generatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {pack.downloadUrl && (
                            <a
                              href={pack.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                              title="Download Presigned Pack"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegenerate(pack)}
                            className="text-xs rounded-xl hover:bg-emerald-50 hover:text-emerald-900 border-slate-200 cursor-pointer"
                          >
                            Re-generate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Pack Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Generate Offline Pack
            </DialogTitle>
            <DialogDescription>
              Select module and language to compile, compress (gzip level 9), compute SHA-256 hash, and upload directly to AWS S3.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                Target Module
              </label>
              <Select
                value={genModule}
                onValueChange={(val: "hadith" | "dua" | "knowledge") => setGenModule(val)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="hadith">Hadith Collection (8 Books)</SelectItem>
                  <SelectItem value="dua">Dua Collection (Hisn al-Muslim)</SelectItem>
                  <SelectItem value="knowledge">Knowledge Library (Articles &amp; Fatwas)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                Language (from 109 supported)
              </label>
              <Select value={selectedLang} onValueChange={setSelectedLang}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-60">
                  {APP_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name} ({lang.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/70 text-amber-900 text-xs flex items-start gap-2">
              <span className="font-bold">Notice:</span>
              <span>
                Generating a pack automatically increments the version in the database. Mobile apps calling <code>/check-sync</code> will immediately detect the update.
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isGenerating}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl shadow cursor-pointer"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Compiling &amp; Uploading...
                </div>
              ) : (
                "Compile & Upload to S3"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
