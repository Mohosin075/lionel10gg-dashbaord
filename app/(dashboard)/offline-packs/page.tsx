"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Download,
  Zap,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetPacksQuery,
  useGeneratePackMutation,
  useGetCoverageQuery,
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

type ModuleType = "all" | "quran" | "tafsir" | "hadith" | "dua" | "knowledge" | "book" | "fatwa";

export default function OfflinePacksPage() {
  const { data: packsRes, isLoading, refetch, isFetching } = useGetPacksQuery();
  const { data: coverageRes, refetch: refetchCoverage } = useGetCoverageQuery();
  const [generatePack, { isLoading: isGenerating }] = useGeneratePackMutation();

  const [activeModule, setActiveModule] = useState<ModuleType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [genModule, setGenModule] = useState<"hadith" | "dua" | "knowledge" | "quran" | "tafsir" | "book" | "fatwa">("hadith");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);

  const packs = packsRes?.data || [];
  const coverage = coverageRes?.data || {};

  // Find which languages have data in MongoDB for a specific module
  const getLangsWithData = (mod: "hadith" | "dua" | "knowledge" | "quran" | "tafsir" | "book" | "fatwa") => {
    return Object.entries(coverage)
      .filter(([_, data]) => {
        if (mod === "hadith") return (data.hadithCount || 0) > 0;
        if (mod === "dua") return (data.duaCount || 0) > 0;
        if (mod === "knowledge") return (data.knowledgeCount || 0) > 0;
        if (mod === "quran") return (data.quranCount || 0) > 0;
        if (mod === "tafsir") return (data.tafsirCount || 0) > 0;
        if (mod === "book") return (data.bookCount || 0) > 0;
        if (mod === "fatwa") return (data.fatwaCount || 0) > 0;
        return false;
      })
      .map(([lang, data]) => ({
        lang,
        count:
          mod === "hadith"
            ? data.hadithCount
            : mod === "dua"
              ? data.duaCount
              : mod === "quran"
                ? data.quranCount
                : mod === "tafsir"
                  ? data.tafsirCount
                  : mod === "book"
                    ? data.bookCount
                    : mod === "fatwa"
                      ? data.fatwaCount
                      : data.knowledgeCount,
      }));
  };

  // Sort languages for the modal dropdown: ones with DB data first
  const sortedLanguagesForModal = useMemo(() => {
    return [...APP_LANGUAGES].sort((a, b) => {
      const aData = coverage[a.code];
      const bData = coverage[b.code];
      const aCount =
        genModule === "hadith"
          ? aData?.hadithCount || 0
          : genModule === "dua"
            ? aData?.duaCount || 0
            : aData?.knowledgeCount || 0;
      const bCount =
        genModule === "hadith"
          ? bData?.hadithCount || 0
          : genModule === "dua"
            ? bData?.duaCount || 0
            : bData?.knowledgeCount || 0;

      if (aCount > 0 && bCount === 0) return -1;
      if (bCount > 0 && aCount === 0) return 1;
      if (aCount !== bCount) return bCount - aCount;
      return a.name.localeCompare(b.name);
    });
  }, [coverage, genModule]);

  // When genModule changes, auto-pick the first available language with records
  useEffect(() => {
    const available = sortedLanguagesForModal.find((l) => {
      const cov = coverage[l.code];
      const cnt =
        genModule === "hadith"
          ? cov?.hadithCount || 0
          : genModule === "dua"
            ? cov?.duaCount || 0
            : genModule === "quran"
              ? cov?.quranCount || 0
              : genModule === "tafsir"
                ? cov?.tafsirCount || 0
                : genModule === "book"
                  ? cov?.bookCount || 0
                  : genModule === "fatwa"
                    ? cov?.fatwaCount || 0
                    : cov?.knowledgeCount || 0;
      return cnt > 0;
    });
    if (available) {
      setSelectedLang(available.code);
    }
  }, [genModule, sortedLanguagesForModal, coverage]);

  const selectedLangDbCount = useMemo(() => {
    const cov = coverage[selectedLang];
    if (genModule === "hadith") return cov?.hadithCount || 0;
    if (genModule === "dua") return cov?.duaCount || 0;
    if (genModule === "quran") return cov?.quranCount || 0;
    if (genModule === "tafsir") return cov?.tafsirCount || 0;
    if (genModule === "book") return cov?.bookCount || 0;
    if (genModule === "fatwa") return cov?.fatwaCount || 0;
    return cov?.knowledgeCount || 0;
  }, [coverage, selectedLang, genModule]);

  const selectedLangObj = APP_LANGUAGES.find((l) => l.code === selectedLang);

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
    if (selectedLangDbCount === 0) {
      toast.error(`Cannot generate pack: ${selectedLangObj?.name || selectedLang} has 0 records in MongoDB.`);
      return;
    }

    try {
      const res = await generatePack({ module: genModule, lang: selectedLang }).unwrap();
      toast.success(res.message || `${genModule.toUpperCase()} pack for [${selectedLang}] generated successfully!`);
      setIsModalOpen(false);
      refetch();
      refetchCoverage();
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
      refetchCoverage();
    } catch (err: any) {
      toast.error(err?.data?.message || "Regeneration failed", { id: "regen" });
    }
  };

  // Safe dynamic batch generator: only targets languages with > 0 records in MongoDB
  const handleQuickBatch = async () => {
    let targets: { module: "hadith" | "dua" | "knowledge" | "quran" | "tafsir" | "book" | "fatwa"; lang: string }[] = [];

    if (activeModule === "all") {
      const hadithLangs = getLangsWithData("hadith");
      const duaLangs = getLangsWithData("dua");
      const knowLangs = getLangsWithData("knowledge");
      const quranLangs = getLangsWithData("quran");
      const tafsirLangs = getLangsWithData("tafsir");
      const bookLangs = getLangsWithData("book");
      const fatwaLangs = getLangsWithData("fatwa");
      targets = [
        ...hadithLangs.map((l) => ({ module: "hadith" as const, lang: l.lang })),
        ...duaLangs.map((l) => ({ module: "dua" as const, lang: l.lang })),
        ...knowLangs.map((l) => ({ module: "knowledge" as const, lang: l.lang })),
        ...quranLangs.map((l) => ({ module: "quran" as const, lang: l.lang })),
        ...tafsirLangs.map((l) => ({ module: "tafsir" as const, lang: l.lang })),
        ...bookLangs.map((l) => ({ module: "book" as const, lang: l.lang })),
        ...fatwaLangs.map((l) => ({ module: "fatwa" as const, lang: l.lang })),
      ];
    } else {
      const langs = getLangsWithData(activeModule);
      targets = langs.map((l) => ({ module: activeModule, lang: l.lang }));
    }

    if (targets.length === 0) {
      toast.info("No languages with active database records found to batch.");
      return;
    }

    setIsBulkGenerating(true);
    toast.loading(`Compiling and publishing ${targets.length} packs...`, { id: "bulk" });

    let successCount = 0;
    let errorCount = 0;

    for (const t of targets) {
      try {
        await generatePack({ module: t.module, lang: t.lang }).unwrap();
        successCount++;
      } catch (err: any) {
        console.error(`Pack generation failed for ${t.module}_${t.lang}:`, err);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully published ${successCount} offline packs!`, { id: "bulk" });
    } else {
      toast.error(`Batch generation failed for ${errorCount} packs.`, { id: "bulk" });
    }

    setIsBulkGenerating(false);
    refetch();
    refetchCoverage();
  };

  // Get active batch button label
  const getBatchButtonLabel = () => {
    if (activeModule === "all") {
      const totalAvailable =
        getLangsWithData("quran").length +
        getLangsWithData("tafsir").length +
        getLangsWithData("hadith").length +
        getLangsWithData("dua").length +
        getLangsWithData("knowledge").length +
        getLangsWithData("book").length +
        getLangsWithData("fatwa").length;
      return `Batch All Available (${totalAvailable})`;
    }
    const count = getLangsWithData(activeModule).length;
    const modLabel = activeModule.charAt(0).toUpperCase() + activeModule.slice(1);
    return `Batch ${modLabel} (${count} Available)`;
  };

  const getModuleBadgeCount = (mod: ModuleType) => {
    if (mod === "all") return packs.length;
    return packs.filter((p) => p.module === mod).length;
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || "http://localhost:5005";

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
            onClick={() => {
              refetch();
              refetchCoverage();
            }}
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

      {/* Quick Batch Actions & Filter Bar (Dropdown Design) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          {/* Module Filter Dropdown */}
          <div className="w-full sm:w-64">
            <Select
              value={activeModule}
              onValueChange={(val: any) => setActiveModule(val)}
            >
              <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-xs font-semibold h-10 px-3 cursor-pointer">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-400 font-normal">Filter:</span>
                  <SelectValue placeholder="Select Module" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span className="font-semibold">All Modules</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full font-bold">
                      {getModuleBadgeCount("all")}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="quran">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span>📖 Quran (Ayahs)</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full font-bold">
                      {getModuleBadgeCount("quran")}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="tafsir">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span>📜 Tafsir (Exegesis)</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full font-bold">
                      {getModuleBadgeCount("tafsir")}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="hadith">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span>📚 Hadith (8 Books)</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full font-bold">
                      {getModuleBadgeCount("hadith")}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="dua">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span>🤲 Dua (Hisnul Muslim)</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full font-bold">
                      {getModuleBadgeCount("dua")}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="knowledge">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span>🧠 Knowledge Articles</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full font-bold">
                      {getModuleBadgeCount("knowledge")}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="book">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span>📚 Islamic Books</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full font-bold">
                      {getModuleBadgeCount("book")}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="fatwa">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span>⚖️ Islamic Fatwas</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full font-bold">
                      {getModuleBadgeCount("fatwa")}
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by language code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800 transition-all"
            />
          </div>
        </div>

        {/* Batch Action Button */}
        <div className="w-full sm:w-auto flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={isBulkGenerating}
            onClick={handleQuickBatch}
            className="w-full sm:w-auto h-10 text-xs rounded-xl text-emerald-900 border-emerald-300 hover:bg-emerald-50 whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer font-semibold shadow-sm px-4"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isBulkGenerating ? "animate-spin text-emerald-600" : "text-emerald-600"}`} />
            {isBulkGenerating ? "Batching..." : getBatchButtonLabel()}
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
              {activeModule === "all"
                ? "No offline packs generated yet. Use the button below to compile and publish your first pack."
                : `No offline packs found for the ${activeModule} module. Generate one now from available database records.`}
            </p>
            <Button
              onClick={() => {
                if (activeModule !== "all") setGenModule(activeModule);
                setIsModalOpen(true);
              }}
              className="mt-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs cursor-pointer"
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
                  const downloadUrl = pack.downloadUrl
                    ? pack.downloadUrl.startsWith("http")
                      ? pack.downloadUrl
                      : `${baseUrl}${pack.downloadUrl}`
                    : `${baseUrl}/api/v1/offline-pack/download/${pack.module}?lang=${pack.lang}`;

                  return (
                    <tr key={pack._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">
                        <Badge
                          variant="outline"
                          className={`capitalize font-semibold text-xs rounded-lg ${pack.module === "quran"
                              ? "bg-teal-50 text-teal-800 border-teal-200"
                              : pack.module === "tafsir"
                                ? "bg-cyan-50 text-cyan-800 border-cyan-200"
                                : pack.module === "hadith"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : pack.module === "dua"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : pack.module === "book"
                                      ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                                      : pack.module === "fatwa"
                                        ? "bg-violet-50 text-violet-800 border-violet-200"
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
                          <a
                            href={downloadUrl}
                            download
                            className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                            title="Download Gzip Bundle (.json.gz)"
                          >
                            <Download className="h-4 w-4" />
                          </a>

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
              Select module and language to compile, compress (gzip level 9), compute SHA-256 hash, and deploy bundle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                Target Module
              </label>
              <Select
                value={genModule}
                onValueChange={(val: any) => setGenModule(val)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="quran">Quran (114 Surahs / 6,236 Ayahs)</SelectItem>
                  <SelectItem value="tafsir">Tafsir (Exegesis)</SelectItem>
                  <SelectItem value="hadith">Hadith Collection (8 Books)</SelectItem>
                  <SelectItem value="dua">Dua Collection (Hisn al-Muslim)</SelectItem>
                  <SelectItem value="knowledge">Knowledge Library (Articles)</SelectItem>
                  <SelectItem value="book">Islamic Books (IslamHouse)</SelectItem>
                  <SelectItem value="fatwa">Fatwas (IslamHouse)</SelectItem>
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
                  {sortedLanguagesForModal.map((lang) => {
                    const cov = coverage[lang.code];
                    const count =
                      genModule === "hadith"
                        ? cov?.hadithCount || 0
                        : genModule === "dua"
                          ? cov?.duaCount || 0
                          : cov?.knowledgeCount || 0;

                    return (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>
                            {lang.name} ({lang.code})
                          </span>
                          {count > 0 ? (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {count.toLocaleString()} items
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              0 items
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Live Database Readiness Notice */}
            {selectedLangDbCount === 0 ? (
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-800">No Records in MongoDB for {selectedLangObj?.name || selectedLang}</p>
                  <p className="mt-0.5 text-rose-700">
                    This language currently has 0 {genModule} items in the database. Please run AI translations first on the Translations page before creating an offline pack.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-800">
                    {selectedLangDbCount.toLocaleString()} {genModule} items ready
                  </p>
                  <p className="mt-0.5 text-emerald-700">
                    Bundle will be compressed with Level 9 Gzip and indexed with SHA-256 cryptographic checksum.
                  </p>
                </div>
              </div>
            )}
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
              disabled={isGenerating || selectedLangDbCount === 0}
              className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Compiling &amp; Bundling...
                </div>
              ) : (
                "Compile & Publish Pack"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
