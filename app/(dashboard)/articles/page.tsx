"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from "@/redux/features/knowledgeApi";
import { toast } from "sonner";
import {
  Pencil,
  Plus,
  Trash2,
  Eye,
  Search,
  Copy,
  Check,
  Clock,
  FileText,
  BookOpen,
  Code2,
} from "lucide-react";

const LANG = "de";

const CATEGORY_OPTIONS = [
  "Belief",
  "Worship",
  "Ethics",
  "Family",
  "History",
  "Quran",
  "Hadith",
  "Fiqh",
  "Dawah",
  "Other",
];

type KnowledgeArticle = {
  _id: string;
  articleId: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  readTime: number;
  imageUrl?: string;
  source?: "islamhouse" | "manual";
  isActive?: boolean;
};

type ArticleForm = {
  articleId: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  readTime: string;
  source: "islamhouse" | "manual";
  imageUrl: string;
};

const emptyArticle: ArticleForm = {
  articleId: "",
  slug: "",
  title: "",
  content: "",
  category: "Belief",
  readTime: "5",
  source: "manual",
  imageUrl: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripHtml(html?: string | null) {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

function hasHtmlTags(str?: string | null) {
  if (!str || typeof str !== "string") return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

export default function ArticlesPage() {
  const [category, setCategory] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Content Preview Modal State
  const [previewArticle, setPreviewArticle] = useState<KnowledgeArticle | null>(null);
  const [previewViewMode, setPreviewViewMode] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);

  // Editor live preview tab
  const [editTab, setEditTab] = useState<"edit" | "preview">("edit");

  const [articleForm, setArticleForm] = useState<ArticleForm>(emptyArticle);

  const { data: articlesRes, isLoading } = useGetArticlesQuery({
    lang: LANG,
    category: category === "all" ? undefined : category,
    page: 1,
    limit: 100,
  });

  const [createArticle, { isLoading: creating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: updating }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: deleting }] = useDeleteArticleMutation();

  const articles: KnowledgeArticle[] = articlesRes?.data || [];
  const saving = creating || updating;

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        !searchQuery.trim() ||
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.slug?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSource =
        sourceFilter === "all" || (a.source || "manual") === sourceFilter;

      return matchesSearch && matchesSource;
    });
  }, [articles, searchQuery, sourceFilter]);

  const openCreate = () => {
    setEditingId(null);
    setEditTab("edit");
    setArticleForm({
      ...emptyArticle,
      articleId: `art-${Date.now()}`,
    });
    setOpen(true);
  };

  const openEdit = (article: KnowledgeArticle) => {
    setEditingId(article._id);
    setEditTab("edit");
    setArticleForm({
      articleId: article.articleId,
      slug: article.slug,
      title: article.title,
      content: article.content,
      category: article.category,
      readTime: String(article.readTime || 5),
      source: article.source || "manual",
      imageUrl: article.imageUrl || "",
    });
    setPreviewArticle(null);
    setOpen(true);
  };

  const handleCopyContent = (text: string, asHtml = false) => {
    const toCopy = asHtml ? text : stripHtml(text);
    navigator.clipboard.writeText(toCopy);
    setCopied(true);
    toast.success(asHtml ? "Raw HTML copied to clipboard" : "Clean text copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    try {
      if (!articleForm.title.trim() || !articleForm.content.trim()) {
        toast.error("Title and content are required");
        return;
      }
      const payload = {
        articleId: articleForm.articleId || `art-${Date.now()}`,
        slug: articleForm.slug.trim() || slugify(articleForm.title),
        title: articleForm.title.trim(),
        content: articleForm.content,
        category: articleForm.category,
        readTime: Number(articleForm.readTime) || 5,
        lang: LANG,
        source: articleForm.source,
        imageUrl: articleForm.imageUrl || undefined,
      };

      if (editingId) {
        await updateArticle({ id: editingId, ...payload }).unwrap();
      } else {
        await createArticle(payload).unwrap();
      }
      toast.success("Article saved successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save article");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle(id).unwrap();
      toast.success("Article deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete article");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Articles Manager"
          description="Islamic articles, categorizations, and mobile app feed content"
        />
        <div className="flex items-center gap-2">
          <Link href="/knowledge-library">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5" />
              Open Knowledge Library
            </Button>
          </Link>
          <Button
            onClick={openCreate}
            className="bg-emerald-900 hover:bg-emerald-800 text-xs gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Article
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40 h-9 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-36 h-9 text-xs">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="islamhouse">IslamHouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search title, content, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-white"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-700" />
            Articles Feed ({filteredArticles.length})
          </CardTitle>
          <span className="text-xs text-slate-400">
            Click any row or &quot;View Content&quot; to read rendered HTML
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="w-[45%]">Title &amp; Snippet</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Read Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-sm text-slate-400">
                      Loading articles...
                    </TableCell>
                  </TableRow>
                ) : filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-sm text-slate-400">
                      No articles found matching filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow
                      key={article._id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setPreviewArticle(article)}
                    >
                      <TableCell className="py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            {article.title}
                          </span>
                          <span className="text-xs text-slate-500 line-clamp-1 max-w-lg">
                            {stripHtml(article?.content).slice(0, 110)}...
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /{article.slug}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {article.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-600 font-medium capitalize">
                          {article.source || "manual"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {article.readTime || 5} min
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={article.isActive === false ? "restricted" : "active"}>
                          {article.isActive === false ? "Inactive" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 px-2 text-xs gap-1"
                          onClick={() => setPreviewArticle(article)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Content
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-900"
                          onClick={() => openEdit(article)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={deleting}
                          onClick={() => handleDelete(article._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ARTICLE CONTENT PREVIEW MODAL WITH HTML RENDERING */}
      <Dialog
        open={Boolean(previewArticle)}
        onOpenChange={(openVal) => {
          if (!openVal) setPreviewArticle(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[88vh] flex flex-col p-0 overflow-hidden">
          <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    {previewArticle?.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-200 text-slate-700 capitalize">
                    Source: {previewArticle?.source || "manual"}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" />
                    {previewArticle?.readTime || 5} min read
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {previewArticle?.title}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Slug: /{previewArticle?.slug}
                </p>
              </div>

              {/* View Mode Toggle: Rendered vs Raw HTML */}
              <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewViewMode("rendered")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    previewViewMode === "rendered"
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Rendered
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewMode("raw")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                    previewViewMode === "raw"
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Code2 className="h-3 w-3" />
                  HTML
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {previewArticle?.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={previewArticle.imageUrl}
                  alt={previewArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {previewViewMode === "rendered" ? (
              hasHtmlTags(previewArticle?.content || "") ? (
                /* PROPERLY RENDERED HTML */
                <div
                  className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed font-sans bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs [&>p]:mb-3 [&>p:last-child]:mb-0 [&>h1]:text-lg [&>h1]:font-bold [&>h2]:text-base [&>h2]:font-bold [&>h3]:text-sm [&>h3]:font-semibold [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-500 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&_a]:text-emerald-700 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: previewArticle?.content || "" }}
                />
              ) : (
                /* Plain Text with line breaks */
                <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
                  {previewArticle?.content}
                </div>
              )
            ) : (
              /* Raw HTML View */
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed border border-slate-800">
                <code>{previewArticle?.content}</code>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-slate-600"
                onClick={() => handleCopyContent(previewArticle?.content || "", false)}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Clean Text
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-slate-500"
                onClick={() => handleCopyContent(previewArticle?.content || "", true)}
              >
                <Code2 className="h-3.5 w-3.5" /> Copy Raw HTML
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setPreviewArticle(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                className="bg-emerald-900 hover:bg-emerald-800 text-xs gap-1.5"
                onClick={() => {
                  if (previewArticle) openEdit(previewArticle);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Article
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Article" : "Add Article"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={articleForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setArticleForm((prev) => ({
                      ...prev,
                      title,
                      slug: prev.slug || slugify(title),
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={articleForm.slug}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, slug: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Read time (min)</Label>
                <Input
                  type="number"
                  min={1}
                  value={articleForm.readTime}
                  onChange={(e) =>
                    setArticleForm({
                      ...articleForm,
                      readTime: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={articleForm.imageUrl}
                  placeholder="https://..."
                  onChange={(e) =>
                    setArticleForm({
                      ...articleForm,
                      imageUrl: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={articleForm.category}
                  onValueChange={(value) =>
                    setArticleForm({ ...articleForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={articleForm.source}
                  onValueChange={(value: "islamhouse" | "manual") =>
                    setArticleForm({ ...articleForm, source: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="islamhouse">IslamHouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Editor Tabs: Edit Code vs Live Render Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Article Content</Label>
                <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setEditTab("edit")}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      editTab === "edit"
                        ? "bg-white text-slate-900 shadow-2xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Edit Code/HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTab("preview")}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      editTab === "preview"
                        ? "bg-white text-slate-900 shadow-2xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Live Render Preview
                  </button>
                </div>
              </div>

              {editTab === "edit" ? (
                <textarea
                  className="flex min-h-56 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-sans"
                  placeholder="Enter or paste formatted article text/HTML..."
                  value={articleForm.content}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, content: e.target.value })
                  }
                />
              ) : (
                <div
                  className="min-h-56 p-4 rounded-md border border-slate-200 bg-white text-sm text-slate-800 overflow-y-auto max-h-72 prose prose-slate [&>p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: articleForm.content || "<p className='text-slate-400 italic'>No content entered yet.</p>" }}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-900 hover:bg-emerald-800"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Saving..." : "Save Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
