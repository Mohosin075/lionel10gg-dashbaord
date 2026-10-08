"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Languages,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
  Database,
  Calculator,
  Search,
  Check,
  Coins,
  AlertTriangle,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetBatchJobsQuery,
  useStartBatchTranslationMutation,
  useProcessBatchResultMutation,
  useCancelBatchJobMutation,
  useGetPacksQuery,
  useGetCoverageQuery,
} from "@/redux/features/offline-pack/offlinePackApi";
import { APP_LANGUAGES } from "@/lib/constants/languages";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

export default function TranslationsPage() {
  const {
    data: jobsRes,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
    isFetching: isFetchingJobs,
  } = useGetBatchJobsQuery(undefined, { pollingInterval: 15000 });

  const { data: packsRes, refetch: refetchPacks } = useGetPacksQuery();

  const {
    data: coverageRes,
    refetch: refetchCoverage,
    isFetching: isFetchingCoverage,
  } = useGetCoverageQuery(undefined, { pollingInterval: 15000 });

  const [startBatch, { isLoading: isStartingBatch }] = useStartBatchTranslationMutation();
  const [processBatch, { isLoading: isProcessingBatch }] = useProcessBatchResultMutation();
  const [cancelBatch, { isLoading: isCancellingBatch }] = useCancelBatchJobMutation();

  const [searchLang, setSearchLang] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("bn");
  const [selectedModule, setSelectedModule] = useState<"hadith" | "dua" | "knowledge" | "quran" | "tafsir" | "book" | "fatwa">("hadith");
  const [confirmRetranslate, setConfirmRetranslate] = useState(false);

  const jobs = jobsRes?.data || [];
  const packs = packsRes?.data || [];
  const coverage = coverageRes?.data || {};

  const activeJobs = jobs.filter(
    (j) => j.status === "in_progress" || j.status === "completed"
  );
  const completedJobs = jobs.filter((j) => j.status === "processed");

  const filteredLanguages = useMemo(() => {
    return APP_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(searchLang.toLowerCase()) ||
        l.code.toLowerCase().includes(searchLang.toLowerCase())
    );
  }, [searchLang]);

  // Check language module coverage helper
  const getLangStats = (code: string) => {
    const langCoverage = coverage[code] || {
      hadithCount: 0,
      duaCount: 0,
      knowledgeCount: 0,
    };

    const hadithPack = packs.find((p) => p.module === "hadith" && p.lang === code);
    const duaPack = packs.find((p) => p.module === "dua" && p.lang === code);
    const knowledgePack = packs.find((p) => p.module === "knowledge" && p.lang === code);
    const quranPack = packs.find((p) => p.module === "quran" && p.lang === code);
    const tafsirPack = packs.find((p) => p.module === "tafsir" && p.lang === code);
    const bookPack = packs.find((p) => p.module === "book" && p.lang === code);
    const fatwaPack = packs.find((p) => p.module === "fatwa" && p.lang === code);

    const hadithJob = jobs.find((j) => j.targetLang === code && j.module === "hadith");
    const duaJob = jobs.find((j) => j.targetLang === code && j.module === "dua");
    const knowledgeJob = jobs.find((j) => j.targetLang === code && j.module === "knowledge");
    const quranJob = jobs.find((j) => j.targetLang === code && j.module === "quran");
    const tafsirJob = jobs.find((j) => j.targetLang === code && j.module === "tafsir");
    const bookJob = jobs.find((j) => j.targetLang === code && j.module === "book");
    const fatwaJob = jobs.find((j) => j.targetLang === code && j.module === "fatwa");

    return {
      hadithCount: langCoverage.hadithCount || 0,
      duaCount: langCoverage.duaCount || 0,
      knowledgeCount: langCoverage.knowledgeCount || 0,
      quranCount: langCoverage.quranCount || 0,
      tafsirCount: langCoverage.tafsirCount || 0,
      bookCount: langCoverage.bookCount || 0,
      fatwaCount: langCoverage.fatwaCount || 0,
      quranPack,
      tafsirPack,
      bookPack,
      fatwaPack,
      quranJob,
      tafsirJob,
      bookJob,
      fatwaJob,
      hadithPack,
      duaPack,
      knowledgePack,
      hadithJob,
      duaJob,
      knowledgeJob,
      isSource: code.toLowerCase() === "en",
    };
  };

  const openModalForLang = (langCode: string) => {
    if (langCode.toLowerCase() === "en") {
      toast.info("English is the primary source language and does not require translation.");
      return;
    }
    setSelectedLang(langCode);
    setConfirmRetranslate(false);

    // Automatically pick the first untranslated module
    const stats = getLangStats(langCode);
    if (stats.quranCount === 0 && !stats.quranPack) {
      setSelectedModule("quran");
    } else if (stats.tafsirCount === 0 && !stats.tafsirPack) {
      setSelectedModule("tafsir");
    } else if (stats.hadithCount === 0 && !stats.hadithPack) {
      setSelectedModule("hadith");
    } else if (stats.duaCount === 0 && !stats.duaPack) {
      setSelectedModule("dua");
    } else if (stats.knowledgeCount === 0 && !stats.knowledgePack) {
      setSelectedModule("knowledge");
    } else if (stats.bookCount === 0 && !stats.bookPack) {
      setSelectedModule("book");
    } else if (stats.fatwaCount === 0 && !stats.fatwaPack) {
      setSelectedModule("fatwa");
    } else {
      setSelectedModule("hadith");
    }

    setIsModalOpen(true);
  };

  const handleRefreshAll = () => {
    refetchJobs();
    refetchPacks();
    refetchCoverage();
    toast.success("Synchronizing status with OpenAI & MongoDB...");
  };

  const handleStartBatch = async () => {
    try {
      const res = await startBatch({ module: selectedModule, targetLang: selectedLang }).unwrap();
      toast.success(
        `OpenAI Batch job started for ${selectedModule.toUpperCase()} [${selectedLang}]! Estimated completion: ${res.data?.estimatedMinutes || 20
        } mins`
      );
      setIsModalOpen(false);
      refetchJobs();
      refetchCoverage();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to start batch translation");
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      toast.loading("Cancelling batch job on OpenAI...", { id: "cancel-job" });
      await cancelBatch(jobId).unwrap();
      toast.success("Batch translation job cancelled successfully!", { id: "cancel-job" });
      refetchJobs();
      refetchCoverage();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to cancel batch job", { id: "cancel-job" });
    }
  };

  const handleProcessJob = async (jobId: string) => {
    try {
      toast.loading("Processing batch results and saving to MongoDB...", { id: jobId });
      const res = await processBatch(jobId).unwrap();
      toast.success(
        `Success! Saved ${res.data?.savedCount || 0} translated records to database.`,
        { id: jobId }
      );
      refetchJobs();
      refetchCoverage();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to process results", { id: jobId });
    }
  };

  // Check if current selection in modal is already translated
  const currentModalStats = getLangStats(selectedLang);
  const isSelectedModuleAlreadyDone =
    selectedModule === "hadith"
      ? currentModalStats.hadithCount > 0 || Boolean(currentModalStats.hadithPack)
      : selectedModule === "dua"
        ? currentModalStats.duaCount > 0 || Boolean(currentModalStats.duaPack)
        : currentModalStats.knowledgeCount > 0 || Boolean(currentModalStats.knowledgePack);

  const selectedModuleCount =
    selectedModule === "hadith"
      ? currentModalStats.hadithCount
      : selectedModule === "dua"
        ? currentModalStats.duaCount
        : selectedModule === "quran"
          ? currentModalStats.quranCount
          : selectedModule === "tafsir"
            ? currentModalStats.tafsirCount
            : selectedModule === "book"
              ? currentModalStats.bookCount
              : selectedModule === "fatwa"
                ? currentModalStats.fatwaCount
                : currentModalStats.knowledgeCount;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-800 to-blue-950 rounded-2xl text-white shadow-sm">
              <Languages className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Batch Translation Manager
              </h1>
              <p className="text-sm text-slate-500">
                109-language AI translation matrix with live MongoDB sync and OpenAI Batch API
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingJobs || isFetchingCoverage}
            className="flex items-center gap-2 rounded-xl text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetchingJobs || isFetchingCoverage ? "animate-spin" : ""
                }`}
            />
            Refresh Status
          </Button>

          <Button
            onClick={() => openModalForLang("bn")}
            className="bg-emerald-900 hover:bg-emerald-800 text-white flex items-center gap-2 rounded-xl shadow cursor-pointer text-xs"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            Start New Translation
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500 font-medium">Supported Languages</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900 flex items-center justify-between">
              109
              <Languages className="h-6 w-6 text-blue-600 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-blue-600">Global ISO 639 Coverage</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500 font-medium">Active Batch Jobs</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900 flex items-center justify-between">
              {activeJobs.length}
              <Clock className="h-6 w-6 text-amber-600 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-amber-600">
              {activeJobs.length === 0 ? "No active jobs running" : "OpenAI auto-polling active"}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500 font-medium">Completed &amp; Ingested</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900 flex items-center justify-between">
              {completedJobs.length}
              <CheckCircle2 className="h-6 w-6 text-emerald-600 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-emerald-600">Saved to MongoDB</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500 font-medium">Avg Cost per Lang</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900 flex items-center justify-between">
              ~৳18 <span className="text-sm font-normal text-slate-400">($0.15)</span>
              <Calculator className="h-6 w-6 text-purple-600 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-purple-600">GPT-4o-mini Batch API Rate</span>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs Section */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Recent OpenAI Batch Jobs
              </h2>
              <p className="text-xs text-slate-500">Live progress tracking via OpenAI Batch auto-sync</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Auto-refreshes every 15s</span>
          </div>

          <div className="divide-y divide-slate-100">
            {jobs.slice(0, 5).map((job) => {
              const langObj = APP_LANGUAGES.find((l) => l.code === job.targetLang);
              const progressPct =
                job.recordCount > 0
                  ? Math.min(100, Math.round((job.processedCount / job.recordCount) * 100))
                  : 0;

              return (
                <div
                  key={job._id}
                  className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">
                        {langObj ? langObj.name : job.targetLang}
                      </span>
                      <Badge variant="outline" className="uppercase font-mono text-xs">
                        {job.targetLang}
                      </Badge>
                      <Badge className="bg-slate-100 text-slate-700 capitalize text-xs">
                        {job.module}
                      </Badge>

                      {job.status === "in_progress" && (
                        <Badge className="bg-amber-100 text-amber-900 border-amber-200 animate-pulse text-xs">
                          In Progress ({progressPct}%)
                        </Badge>
                      )}
                      {job.status === "completed" && (
                        <Badge className="bg-blue-100 text-blue-900 border-blue-200 text-xs">
                          Ready to Process
                        </Badge>
                      )}
                      {job.status === "processed" && (
                        <Badge className="bg-emerald-100 text-emerald-900 border-emerald-200 text-xs">
                          Saved to MongoDB
                        </Badge>
                      )}
                      {job.status === "failed" && (
                        <Badge className="bg-red-100 text-red-900 border-red-200 text-xs">
                          Failed
                        </Badge>
                      )}
                      {(job.status === "cancelled" || job.status === "cancelling") && (
                        <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs">
                          Cancelled
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Job ID: {job.batchId} • {job.processedCount} / {job.recordCount} items
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {job.status === "in_progress" && (
                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <Progress value={progressPct} className="h-2" />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelJob(job.batchId)}
                          disabled={isCancellingBatch}
                          className="h-7 px-2.5 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    {job.status === "validating" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelJob(job.batchId)}
                        disabled={isCancellingBatch}
                        className="h-7 px-2.5 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </Button>
                    )}

                    {job.status === "completed" && (
                      <Button
                        size="sm"
                        onClick={() => handleProcessJob(job.batchId)}
                        disabled={isProcessingBatch}
                        className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer"
                      >
                        <Database className="h-3.5 w-3.5" />
                        Process &amp; Save to MongoDB
                      </Button>
                    )}

                    {job.status === "processed" && (
                      <Link
                        href="/offline-packs"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Generate Pack <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 109 Languages Coverage Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">109 Languages Coverage Matrix</h2>
            <p className="text-xs text-slate-500">
              Live status from MongoDB &amp; S3. Completed modules are highlighted so you never duplicate translations.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search language or code..."
              value={searchLang}
              onChange={(e) => setSearchLang(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Language</th>
                <th className="py-4 px-3">ISO</th>
                <th className="py-4 px-3">Quran</th>
                <th className="py-4 px-3">Tafsir</th>
                <th className="py-4 px-3">Hadith</th>
                <th className="py-4 px-3">Dua</th>
                <th className="py-4 px-3">Knowledge</th>
                <th className="py-4 px-3">Books</th>
                <th className="py-4 px-3">Fatwas</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLanguages.map((lang) => {
                const stats = getLangStats(lang.code);
                const isEng = stats.isSource;

                // Check overall readiness
                const allModulesReady =
                  (stats.quranCount > 0 || stats.quranPack) &&
                  (stats.tafsirCount > 0 || stats.tafsirPack) &&
                  (stats.hadithCount > 0 || stats.hadithPack) &&
                  (stats.duaCount > 0 || stats.duaPack) &&
                  (stats.knowledgeCount > 0 || stats.knowledgePack) &&
                  (stats.bookCount > 0 || stats.bookPack) &&
                  (stats.fatwaCount > 0 || stats.fatwaPack);

                const hasActiveJob = [
                  stats.quranJob,
                  stats.tafsirJob,
                  stats.hadithJob,
                  stats.duaJob,
                  stats.knowledgeJob,
                  stats.bookJob,
                  stats.fatwaJob,
                ].some((j) => j && (j.status === "in_progress" || j.status === "completed"));

                return (
                  <tr key={lang.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                      {lang.name}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[11px] text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                        {lang.code}
                      </span>
                    </td>

                    {/* QURAN */}
                    <td className="py-3.5 px-3">
                      {isEng || stats.quranCount > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Ready</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending</span>
                      )}
                    </td>

                    {/* TAFSIR */}
                    <td className="py-3.5 px-3">
                      {isEng || stats.tafsirCount > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Ready</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending</span>
                      )}
                    </td>

                    {/* HADITH */}
                    <td className="py-3.5 px-3">
                      {isEng || stats.hadithCount > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Ready</span>
                      ) : stats.hadithJob?.status === "in_progress" ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">⏳ Translating</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending</span>
                      )}
                    </td>

                    {/* DUA */}
                    <td className="py-3.5 px-3">
                      {isEng || stats.duaCount > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Ready</span>
                      ) : stats.duaJob?.status === "in_progress" ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">⏳ Translating</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending</span>
                      )}
                    </td>

                    {/* KNOWLEDGE */}
                    <td className="py-3.5 px-3">
                      {isEng || stats.knowledgeCount > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Ready</span>
                      ) : stats.knowledgeJob?.status === "in_progress" ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">⏳ Translating</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending</span>
                      )}
                    </td>

                    {/* BOOKS */}
                    <td className="py-3.5 px-3">
                      {isEng || stats.bookCount > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Ready</span>
                      ) : stats.bookJob?.status === "in_progress" ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">⏳ Translating</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending</span>
                      )}
                    </td>

                    {/* FATWAS */}
                    <td className="py-3.5 px-3">
                      {isEng || stats.fatwaCount > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Ready</span>
                      ) : stats.fatwaJob?.status === "in_progress" ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">⏳ Translating</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending</span>
                      )}
                    </td>

                    {/* ACTION COLUMN */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isEng ? (
                        <span className="text-[11px] font-medium text-slate-400">
                          Source
                        </span>
                      ) : hasActiveJob ? (
                        <Badge className="bg-amber-100 text-amber-900 text-[11px] animate-pulse">
                          Translating...
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModalForLang(lang.code)}
                          className="text-xs h-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-900 border-slate-200 cursor-pointer"
                        >
                          Translate
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Batch Translation Modal with Redundancy Protection */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Start OpenAI Batch Translation
            </DialogTitle>
            <DialogDescription>
              Launch an asynchronous batch translation job via OpenAI GPT-4o-mini at 50% discount.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Target Language */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                Target Language
              </label>
              <Select
                value={selectedLang}
                onValueChange={(val) => {
                  setSelectedLang(val);
                  setConfirmRetranslate(false);
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Target Language" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-60">
                  {APP_LANGUAGES.filter((l) => l.code.toLowerCase() !== "en").map((lang) => {
                    const lStats = getLangStats(lang.code);
                    const doneCount =
                      (lStats.quranCount > 0 ? 1 : 0) +
                      (lStats.tafsirCount > 0 ? 1 : 0) +
                      (lStats.hadithCount > 0 ? 1 : 0) +
                      (lStats.duaCount > 0 ? 1 : 0) +
                      (lStats.knowledgeCount > 0 ? 1 : 0) +
                      (lStats.bookCount > 0 ? 1 : 0) +
                      (lStats.fatwaCount > 0 ? 1 : 0);

                    return (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center justify-between w-full gap-3">
                          <span>
                            {lang.name} ({lang.code})
                          </span>
                          {doneCount > 0 && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                              {doneCount}/7 Done
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Module Selector with Database Status */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                Module to Translate
              </label>
              <Select
                value={selectedModule}
                onValueChange={(val: any) => {
                  setSelectedModule(val);
                  setConfirmRetranslate(false);
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="quran">
                    <div className="flex items-center justify-between gap-4">
                      <span>📖 Quran (114 Surahs / Ayahs)</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.quranCount > 0
                          ? `✓ ${currentModalStats.quranCount} in DB`
                          : "Untranslated"}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="tafsir">
                    <div className="flex items-center justify-between gap-4">
                      <span>📜 Tafsir (Exegesis)</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.tafsirCount > 0
                          ? `✓ ${currentModalStats.tafsirCount} in DB`
                          : "Untranslated"}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hadith">
                    <div className="flex items-center justify-between gap-4">
                      <span>📚 Hadith Collection</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.hadithCount > 0
                          ? `✓ ${currentModalStats.hadithCount} in DB`
                          : "Untranslated"}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dua">
                    <div className="flex items-center justify-between gap-4">
                      <span>🤲 Dua Collection</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.duaCount > 0
                          ? `✓ ${currentModalStats.duaCount} in DB`
                          : "Untranslated"}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="knowledge">
                    <div className="flex items-center justify-between gap-4">
                      <span>🧠 Knowledge Library (Articles)</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.knowledgeCount > 0
                          ? `✓ ${currentModalStats.knowledgeCount} in DB`
                          : "Untranslated"}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="book">
                    <div className="flex items-center justify-between gap-4">
                      <span>📚 Islamic Books (IslamHouse)</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.bookCount > 0
                          ? `✓ ${currentModalStats.bookCount} in DB`
                          : "Untranslated"}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="fatwa">
                    <div className="flex items-center justify-between gap-4">
                      <span>⚖️ Fatwas (IslamHouse)</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.fatwaCount > 0
                          ? `✓ ${currentModalStats.fatwaCount} in DB`
                          : "Untranslated"}
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* REDUNDANCY WARNING BANNER IF ALREADY TRANSLATED */}
            {isSelectedModuleAlreadyDone ? (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      {selectedModule.toUpperCase()} is already translated in MongoDB ({selectedModuleCount} records)!
                    </p>
                    <p className="text-amber-700 text-[11px] mt-0.5">
                      You do <strong>not</strong> need to translate it again. Translating again will consume OpenAI tokens and overwrite existing database records.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1 text-amber-950 font-semibold text-[11px]">
                  <input
                    type="checkbox"
                    checked={confirmRetranslate}
                    onChange={(e) => setConfirmRetranslate(e.target.checked)}
                    className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Yes, I want to re-translate and overwrite existing translations</span>
                </label>
              </div>
            ) : (
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200/70 text-blue-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5" />
                  Estimated Batch Cost: ~৳18 BDT ($0.15 USD)
                </p>
                <p className="text-blue-700 text-[11px]">
                  Preserves Islamic terms (Allah, Sahih, Hadith). Once completed by OpenAI, it will automatically save into MongoDB.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isStartingBatch}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onClick={handleStartBatch}
              disabled={isStartingBatch || (isSelectedModuleAlreadyDone && !confirmRetranslate)}
              className={`rounded-xl shadow cursor-pointer text-white font-medium ${isSelectedModuleAlreadyDone
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-900 hover:bg-emerald-800"
                }`}
            >
              {isStartingBatch ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Starting Batch Job...
                </div>
              ) : isSelectedModuleAlreadyDone ? (
                "Re-translate & Overwrite"
              ) : (
                "Launch OpenAI Batch Job"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
