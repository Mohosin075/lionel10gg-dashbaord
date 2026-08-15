"use client";

import { useMemo, useState } from "react";
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
  type KnowledgeArticle,
} from "@/redux/features/knowledge/knowledgeApi";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

const LANG_OPTIONS = [
  { value: "de", label: "German" },
  { value: "en", label: "English" },
  { value: "tr", label: "Turkish" },
  { value: "ar", label: "Arabic" },
  { value: "fr", label: "French" },
];

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

type ArticleForm = {
  articleId: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  readTime: string;
  lang: string;
  source: "islamhouse" | "manual";
  imageUrl: string;
  isActive: boolean;
};

const emptyForm: ArticleForm = {
  articleId: "",
  slug: "",
  title: "",
  content: "",
  category: "Belief",
  readTime: "5",
  lang: "de",
  source: "manual",
  imageUrl: "",
  isActive: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ArticlesPage() {
  const [lang, setLang] = useState("de");
  const [category, setCategory] = useState<string>("all");
  const { data, isLoading } = useGetArticlesQuery({
    lang,
    category: category === "all" ? undefined : category,
    page: 1,
    limit: 50,
  });
  const [createArticle, { isLoading: creating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: updating }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: deleting }] = useDeleteArticleMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<KnowledgeArticle | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);

  const articles: KnowledgeArticle[] = data?.data || [];

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      lang,
      articleId: `art-${Date.now()}`,
    });
    setOpen(true);
  };

  const openEdit = (article: KnowledgeArticle) => {
    setEditing(article);
    setForm({
      articleId: article.articleId,
      slug: article.slug,
      title: article.title,
      content: article.content,
      category: article.category,
      readTime: String(article.readTime || 5),
      lang: article.lang || "de",
      source: article.source || "manual",
      imageUrl: article.imageUrl || "",
      isActive: article.isActive !== false,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    const slug = form.slug.trim() || slugify(form.title);
    const payload = {
      articleId: form.articleId || `art-${Date.now()}`,
      slug,
      title: form.title.trim(),
      content: form.content,
      category: form.category,
      readTime: Number(form.readTime) || 5,
      lang: form.lang,
      source: form.source,
      imageUrl: form.imageUrl || undefined,
      isActive: form.isActive,
    };

    try {
      if (editing) {
        await updateArticle({ id: editing._id, ...payload }).unwrap();
        toast.success("Article updated");
      } else {
        await createArticle(payload).unwrap();
        toast.success("Article created");
      }
      setOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to save article");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try {
      await deleteArticle(id).unwrap();
      toast.success("Article deleted");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to delete article");
    }
  };

  const langLabel = useMemo(
    () => LANG_OPTIONS.find((l) => l.value === lang)?.label || lang,
    [lang],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Library & Articles"
          description="Manage clean HTML/text articles with language, category, and source tags"
        />
        <Button
          onClick={openCreate}
          className="bg-emerald-900 hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {LANG_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Articles ({langLabel}) — {articles.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="p-6 text-sm text-slate-500">Loading articles...</p>
          ) : articles.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No articles found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Lang</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article._id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {article.title}
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell className="capitalize">{article.source}</TableCell>
                    <TableCell className="uppercase">{article.lang}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          article.isActive === false ? "restricted" : "active"
                        }
                      >
                        {article.isActive === false ? "Inactive" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(article)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        disabled={deleting}
                        onClick={() => handleDelete(article._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit article" : "Add article"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((prev) => ({
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
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Article ID</Label>
                <Input
                  value={form.articleId}
                  onChange={(e) =>
                    setForm({ ...form, articleId: e.target.value })
                  }
                  disabled={!!editing}
                />
              </div>
              <div className="space-y-2">
                <Label>Read time (min)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.readTime}
                  onChange={(e) =>
                    setForm({ ...form, readTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={form.lang}
                  onValueChange={(value) => setForm({ ...form, lang: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANG_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm({ ...form, category: value })
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
                  value={form.source}
                  onValueChange={(value: "islamhouse" | "manual") =>
                    setForm({ ...form, source: value })
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
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Content (clean HTML or text)</Label>
              <textarea
                className="flex min-h-48 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="<p>Article content...</p>"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-900 hover:bg-emerald-800"
              disabled={creating || updating}
              onClick={handleSave}
            >
              {creating || updating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
