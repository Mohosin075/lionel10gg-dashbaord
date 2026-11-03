"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Save,
  Globe,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Database,
  Smartphone,
  Eye,
  PenLine,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetPublicPolicyQuery,
  useUpdatePublicPolicyMutation,
  useListPublicPoliciesQuery,
} from "@/redux/features/public/publicApi";
import {
  POLICY_DEFINITIONS,
  PolicyDefinition,
  findPolicyDefinition,
} from "@/lib/policyTemplates";
import PolicyRichEditor, { EditorMode } from "@/components/policy/PolicyRichEditor";

export default function PoliciesDashboardPage() {
  const [selectedType, setSelectedType] = useState<string>("privacy-policy");
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "mandatory" | "published" | "templates"
  >("all");
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Queries & Mutations
  const { data: listRes, refetch: refetchList } = useListPublicPoliciesQuery();
  const {
    data: currentPolicyRes,
    isLoading: isPolicyLoading,
    refetch: refetchCurrent,
  } = useGetPublicPolicyQuery(selectedType);
  const [updatePolicy, { isLoading: isSaving }] = useUpdatePublicPolicyMutation();

  const activeDefinition: PolicyDefinition = useMemo(() => {
    return findPolicyDefinition(selectedType);
  }, [selectedType]);

  // Sync content when API data changes or policy changes
  useEffect(() => {
    if (currentPolicyRes?.data) {
      setContent(currentPolicyRes.data.content || activeDefinition.defaultContent);
      setTitle(currentPolicyRes.data.title || activeDefinition.title);
      setHasUnsavedChanges(false);
    } else if (!isPolicyLoading) {
      setContent(activeDefinition.defaultContent);
      setTitle(activeDefinition.title);
      setHasUnsavedChanges(false);
    }
  }, [currentPolicyRes, activeDefinition, isPolicyLoading]);

  // Public URL
  const publicUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/policies/${selectedType}`;
    }
    return `/policies/${selectedType}`;
  }, [selectedType]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      toast.success("Public Policy URL copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleResetToTemplate = () => {
    if (
      window.confirm(
        `Are you sure you want to restore the standard Google Play & App Store compliant template for "${activeDefinition.title}"? Any custom modifications will be replaced.`
      )
    ) {
      setContent(activeDefinition.defaultContent);
      setTitle(activeDefinition.title);
      setHasUnsavedChanges(true);
      toast.info("Standard template loaded. Click 'Save & Publish' to push live.");
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Policy content cannot be empty.");
      return;
    }

    try {
      const res = await updatePolicy({
        type: selectedType,
        content,
        title: title || activeDefinition.title,
      }).unwrap();

      toast.success(
        res?.message || `${activeDefinition.title} published successfully!`
      );
      setHasUnsavedChanges(false);
      refetchCurrent();
      refetchList();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to save public policy."
      );
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = POLICY_DEFINITIONS.length;
    let publishedCount = 0;
    if (listRes?.data) {
      publishedCount = listRes.data.filter((d) => !d.isDefault).length;
    }
    return {
      total,
      published: publishedCount,
      templates: total - publishedCount,
    };
  }, [listRes]);

  // Filtered definitions
  const filteredPolicies = useMemo(() => {
    return POLICY_DEFINITIONS.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const dbRecord = listRes?.data?.find(
        (d) =>
          d.type === p.type ||
          (p.type.includes("terms") && d.type.includes("terms")) ||
          (p.type.includes("deletion") && d.type.includes("deletion"))
      );
      const isCustomized = dbRecord && !dbRecord.isDefault;

      if (categoryFilter === "mandatory") {
        return p.badge.toLowerCase().includes("mandatory");
      }
      if (categoryFilter === "published") {
        return isCustomized;
      }
      if (categoryFilter === "templates") {
        return !isCustomized;
      }
      return true;
    });
  }, [searchQuery, categoryFilter, listRes]);

  const wordCount = useMemo(() => {
    const textOnly = content.replace(/<[^>]*>/g, " ").trim();
    return textOnly ? textOnly.split(/\s+/).length : 0;
  }, [content]);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Banner Card with Stats */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Store Publishing Compliance Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Legal &amp; Public Policy Pages
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              Dynamically author, preview, and deploy official legal documents
              required by the{" "}
              <strong className="text-white">Google Play Store</strong> and{" "}
              <strong className="text-white">Apple App Store</strong>. Powered by
              our full WYSIWYG rich text editor with real-time public synchronization.
            </p>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-md shrink-0">
            <div className="text-center px-2 py-1">
              <span className="block text-xl font-black text-white">
                {stats.total}
              </span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                Total Policies
              </span>
            </div>
            <div className="text-center px-2 py-1 border-x border-white/15">
              <span className="block text-xl font-black text-emerald-300">
                {stats.published}
              </span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                Live on DB
              </span>
            </div>
            <div className="text-center px-2 py-1">
              <span className="block text-xl font-black text-amber-300">
                {stats.templates}
              </span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                Templates
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Policy Navigator & Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter & Policies List */}
        {!isSidebarCollapsed && (
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policies (e.g. privacy, deletion)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  categoryFilter === "all"
                    ? "bg-emerald-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({POLICY_DEFINITIONS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("mandatory")}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  categoryFilter === "mandatory"
                    ? "bg-emerald-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Mandatory
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("published")}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  categoryFilter === "published"
                    ? "bg-emerald-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Live on DB ({stats.published})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("templates")}
                className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                  categoryFilter === "templates"
                    ? "bg-emerald-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Templates ({stats.templates})
              </button>
            </div>

            {/* List of Policies */}
            <div className="space-y-2 max-h-[calc(100vh-360px)] overflow-y-auto pr-1">
              {filteredPolicies.map((policy) => {
                const isSelected = policy.type === selectedType;
                const dbItem = listRes?.data?.find(
                  (d) =>
                    d.type === policy.type ||
                    (policy.type.includes("terms") && d.type.includes("terms")) ||
                    (policy.type.includes("deletion") && d.type.includes("deletion"))
                );
                const isCustomized = dbItem && !dbItem.isDefault;

                return (
                  <button
                    key={policy.type}
                    type="button"
                    onClick={() => {
                      if (
                        hasUnsavedChanges &&
                        !window.confirm(
                          "You have unsaved edits on the current document. Switch anyway?"
                        )
                      ) {
                        return;
                      }
                      setSelectedType(policy.type);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-900/10"
                        : "bg-slate-50/70 hover:bg-slate-100/90 text-slate-700 border-slate-200/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm leading-snug">
                        {policy.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          isSelected
                            ? "bg-white/20 text-white border-white/30"
                            : policy.badgeColor
                        }`}
                      >
                        {policy.badge}
                      </span>
                    </div>

                    <p
                      className={`text-xs line-clamp-2 leading-relaxed ${
                        isSelected ? "text-emerald-100" : "text-slate-500"
                      }`}
                    >
                      {policy.description}
                    </p>

                    <div
                      className={`flex items-center gap-1.5 mt-2.5 pt-2 border-t text-[11px] font-semibold ${
                        isSelected
                          ? "border-emerald-800/80 text-emerald-200"
                          : "border-slate-200/60 text-slate-500"
                      }`}
                    >
                      {isCustomized ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <Database className="w-3 h-3" />
                          Customized on DB
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600">
                          <FileText className="w-3 h-3" />
                          Standard Template
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredPolicies.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  No policies match your search.
                </div>
              )}
            </div>
          </div>

          {/* Store Review Guidance Tip Card */}
          <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-200/80 text-emerald-950 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
              Store Listing Submission Tips
            </div>
            <p className="leading-relaxed text-emerald-800 text-[11px]">
              {activeDefinition.storeNotice}
            </p>
            <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-700 flex items-center justify-between">
              <span>Google Play &amp; Apple StoreKit compliant</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
        </div>
        )}

        {/* Right Column: Dynamic Editor & Live Preview */}
        <div
          className={`${
            isSidebarCollapsed ? "lg:col-span-12" : "lg:col-span-8"
          } space-y-4 transition-all`}
        >
          {/* Active Policy Header Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {activeDefinition.category}
                  </span>
                  {hasUnsavedChanges && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Unsaved Changes
                    </span>
                  )}
                </div>

                {/* Editable Document Title */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="text-xl font-black text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-600 focus:outline-none w-full transition"
                  placeholder="Document Title"
                />
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-start shrink-0">
                {/* Full Width Preview Toggle Button */}
                <button
                  type="button"
                  onClick={() =>
                    setEditorMode(editorMode === "preview" ? "visual" : "preview")
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    editorMode === "preview"
                      ? "bg-emerald-900 text-white border-emerald-900 shadow-xs"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                  }`}
                  title={
                    editorMode === "preview"
                      ? "Switch to Full-Width Editor"
                      : "Switch to Full-Width Preview"
                  }
                >
                  {editorMode === "preview" ? (
                    <>
                      <PenLine className="w-3.5 h-3.5" />
                      <span>Edit Document</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Preview</span>
                    </>
                  )}
                </button>

                {/* Collapse / Expand Policy List */}
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs transition hidden lg:flex items-center gap-1.5 cursor-pointer"
                  title={isSidebarCollapsed ? "Show Policy Navigation" : "Full Screen Editor Workspace"}
                >
                  {isSidebarCollapsed ? (
                    <>
                      <PanelLeftOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Show List</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />
                      <span>Full Width</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetToTemplate}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200/80 transition flex items-center gap-1.5 cursor-pointer"
                  title="Reset to App Store Standard Template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Template</span>
                </button>
              </div>
            </div>

            {/* Public Link Bar with Instant Copy */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-600 text-xs shrink-0 pl-1 font-semibold">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>Store Public URL:</span>
              </div>
              <div className="flex-1 font-mono text-xs text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 overflow-x-auto whitespace-nowrap select-all">
                {publicUrl}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Copy Link for Store Listing"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => window.open(publicUrl, "_blank")}
                  className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition cursor-pointer"
                  title="Open live public URL in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Rich Text Editor Container */}
          <div className="space-y-4">
            <PolicyRichEditor
              content={content}
              onChange={(newHtml) => {
                setContent(newHtml);
                setHasUnsavedChanges(true);
              }}
              editorMode={editorMode}
              onModeChange={(mode) => setEditorMode(mode)}
              documentTitle={title || activeDefinition.title}
            />

            {/* Bottom Actions Bar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Last saved:{" "}
                  <strong>
                    {currentPolicyRes?.data?.lastUpdated || currentPolicyRes?.data?.updatedAt
                      ? new Date(
                          currentPolicyRes.data.lastUpdated || currentPolicyRes.data.updatedAt!
                        ).toLocaleString()
                      : "Default Template"}
                  </strong>
                </span>
                <span>&bull;</span>
                <span>
                  {wordCount} words &bull; {content.length} chars
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setEditorMode(editorMode === "preview" ? "visual" : "preview")
                  }
                  className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {editorMode === "preview" ? (
                    <>
                      <PenLine className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Back to Editor</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Full Preview</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => window.open(publicUrl, "_blank")}
                  className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Live Page
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {isSaving ? "Publishing to API..." : "Save & Publish Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
