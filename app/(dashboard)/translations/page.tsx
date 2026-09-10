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

  const [searchLang, setSearchLang] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("bn");
  const [selectedModule, setSelectedModule] = useState<"hadith" | "dua" | "knowledge">("hadith");
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

    const hadithJob = jobs.find((j) => j.targetLang === code && j.module === "hadith");
    const duaJob = jobs.find((j) => j.targetLang === code && j.module === "dua");
    const knowledgeJob = jobs.find((j) => j.targetLang === code && j.module === "knowledge");

    return {
      hadithCount: langCoverage.hadithCount || 0,
      duaCount: langCoverage.duaCount || 0,
      knowledgeCount: langCoverage.knowledgeCount || 0,
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
    if (stats.hadithCount === 0 && !stats.hadithPack) {
      setSelectedModule("hadith");
    } else if (stats.duaCount === 0 && !stats.duaPack) {
      setSelectedModule("dua");
    } else if (stats.knowledgeCount === 0 && !stats.knowledgePack) {
      setSelectedModule("knowledge");
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
        `OpenAI Batch job started for ${selectedModule.toUpperCase()} [${selectedLang}]! Estimated completion: ${
          res.data?.estimatedMinutes || 20
        } mins`
      );
      setIsModalOpen(false);
      refetchJobs();
      refetchCoverage();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to start batch translation");
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
              className={`h-3.5 w-3.5 ${
                isFetchingJobs || isFetchingCoverage ? "animate-spin" : ""
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
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Job ID: {job.batchId} • {job.processedCount} / {job.recordCount} items
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {job.status === "in_progress" && (
                      <div className="w-40">
                        <Progress value={progressPct} className="h-2" />
                      </div>
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
                <th className="py-4 px-6">Language</th>
                <th className="py-4 px-6">ISO Code</th>
                <th className="py-4 px-6">Hadith Collection</th>
                <th className="py-4 px-6">Dua Collection</th>
                <th className="py-4 px-6">Knowledge Library</th>
                <th className="py-4 px-6">Cost Estimate</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLanguages.map((lang) => {
                const stats = getLangStats(lang.code);
                const isEng = stats.isSource;

                // Check overall readiness
                const allModulesReady =
                  (stats.hadithCount > 0 || stats.hadithPack) &&
                  (stats.duaCount > 0 || stats.duaPack) &&
                  (stats.knowledgeCount > 0 || stats.knowledgePack);

                const hasActiveJob =
                  (stats.hadithJob && (stats.hadithJob.status === "in_progress" || stats.hadithJob.status === "completed")) ||
                  (stats.duaJob && (stats.duaJob.status === "in_progress" || stats.duaJob.status === "completed")) ||
                  (stats.knowledgeJob && (stats.knowledgeJob.status === "in_progress" || stats.knowledgeJob.status === "completed"));

                return (
                  <tr key={lang.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {lang.name}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                        {lang.code}
                      </span>
                    </td>

                    {/* HADITH MODULE */}
                    <td className="py-4 px-6">
                      {isEng ? (
                        <Badge className="bg-slate-100 text-slate-700 text-xs font-medium">
                          Source (36,432)
                        </Badge>
                      ) : stats.hadithPack ? (
                        <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs flex items-center gap-1 w-fit">
                          <Check className="h-3 w-3" /> Pack v{stats.hadithPack.version} Live
                        </Badge>
                      ) : stats.hadithCount > 0 ? (
                        <div className="space-y-0.5">
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {stats.hadithCount} in DB
                          </Badge>
                          <Link href="/offline-packs" className="text-[11px] text-emerald-700 font-semibold hover:underline block">
                            Create Pack →
                          </Link>
                        </div>
                      ) : stats.hadithJob?.status === "in_progress" ? (
                        <Badge className="bg-amber-100 text-amber-900 border-amber-200 text-xs animate-pulse">
                          ⏳ Translating
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">Not Translated</span>
                      )}
                    </td>

                    {/* DUA MODULE */}
                    <td className="py-4 px-6">
                      {isEng ? (
                        <Badge className="bg-slate-100 text-slate-700 text-xs font-medium">
                          Source (264)
                        </Badge>
                      ) : stats.duaPack ? (
                        <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs flex items-center gap-1 w-fit">
                          <Check className="h-3 w-3" /> Pack v{stats.duaPack.version} Live
                        </Badge>
                      ) : stats.duaCount > 0 ? (
                        <div className="space-y-0.5">
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {stats.duaCount} in DB
                          </Badge>
                          <Link href="/offline-packs" className="text-[11px] text-emerald-700 font-semibold hover:underline block">
                            Create Pack →
                          </Link>
                        </div>
                      ) : stats.duaJob?.status === "in_progress" ? (
                        <Badge className="bg-amber-100 text-amber-900 border-amber-200 text-xs animate-pulse">
                          ⏳ Translating
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">Not Translated</span>
                      )}
                    </td>

                    {/* KNOWLEDGE MODULE */}
                    <td className="py-4 px-6">
                      {isEng ? (
                        <Badge className="bg-slate-100 text-slate-700 text-xs font-medium">
                          Source
                        </Badge>
                      ) : stats.knowledgePack ? (
                        <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs flex items-center gap-1 w-fit">
                          <Check className="h-3 w-3" /> Pack v{stats.knowledgePack.version} Live
                        </Badge>
                      ) : stats.knowledgeCount > 0 ? (
                        <div className="space-y-0.5">
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {stats.knowledgeCount} in DB
                          </Badge>
                          <Link href="/offline-packs" className="text-[11px] text-emerald-700 font-semibold hover:underline block">
                            Create Pack →
                          </Link>
                        </div>
                      ) : stats.knowledgeJob?.status === "in_progress" ? (
                        <Badge className="bg-amber-100 text-amber-900 border-amber-200 text-xs animate-pulse">
                          ⏳ Translating
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">Not Translated</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      ~৳18 <span className="text-slate-400">($0.15)</span>
                    </td>

                    {/* ACTION COLUMN */}
                    <td className="py-4 px-6 text-right">
                      {isEng ? (
                        <span className="text-xs font-medium text-slate-400">
                          Source Language
                        </span>
                      ) : hasActiveJob ? (
                        <Badge className="bg-amber-100 text-amber-900 text-xs animate-pulse">
                          Translating...
                        </Badge>
                      ) : allModulesReady ? (
                        <Link
                          href="/offline-packs"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <Package className="h-3.5 w-3.5" /> All Ready
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModalForLang(lang.code)}
                          className="text-xs rounded-xl hover:bg-emerald-50 hover:text-emerald-900 border-slate-200 cursor-pointer"
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
                      (lStats.hadithCount > 0 ? 1 : 0) +
                      (lStats.duaCount > 0 ? 1 : 0) +
                      (lStats.knowledgeCount > 0 ? 1 : 0);

                    return (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center justify-between w-full gap-3">
                          <span>
                            {lang.name} ({lang.code})
                          </span>
                          {doneCount > 0 && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                              {doneCount}/3 Done
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
                onValueChange={(val: "hadith" | "dua" | "knowledge") => {
                  setSelectedModule(val);
                  setConfirmRetranslate(false);
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="hadith">
                    <div className="flex items-center justify-between gap-4">
                      <span>Hadith Collection</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.hadithCount > 0
                          ? `✓ ${currentModalStats.hadithCount} in DB (Done)`
                          : "Untranslated (0 in DB)"}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dua">
                    <div className="flex items-center justify-between gap-4">
                      <span>Dua Collection</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.duaCount > 0
                          ? `✓ ${currentModalStats.duaCount} in DB (Done)`
                          : "Untranslated (0 in DB)"}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="knowledge">
                    <div className="flex items-center justify-between gap-4">
                      <span>Knowledge Library</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {currentModalStats.knowledgeCount > 0
                          ? `✓ ${currentModalStats.knowledgeCount} in DB (Done)`
                          : "Untranslated (0 in DB)"}
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
              className={`rounded-xl shadow cursor-pointer text-white font-medium ${
                isSelectedModuleAlreadyDone
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
