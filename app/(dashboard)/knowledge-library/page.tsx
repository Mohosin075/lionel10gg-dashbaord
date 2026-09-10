"use client";

import { useState, useMemo } from "react";
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
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetFatwasQuery,
  useCreateFatwaMutation,
  useUpdateFatwaMutation,
  useDeleteFatwaMutation,
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
  BookOpen,
  FileText,
  HelpCircle,
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

type Tab = "articles" | "books" | "fatwas";

type KnowledgeArticle = {
  _id: string;
  articleId: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  readTime: number;
  imageUrl?: string;
  audioUrl?: string;
  source?: "islamhouse" | "manual";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

type BookForm = {
  bookId: string;
  title: string;
  author: string;
  content: string;
};

type FatwaForm = {
  fatwaId: string;
  question: string;
  answer: string;
  scholar: string;
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

export default function KnowledgeLibraryPage() {
  const [tab, setTab] = useState<Tab>("articles");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Content Preview Modal State
  const [previewItem, setPreviewItem] = useState<{
    type: "article" | "book" | "fatwa";
    title: string;
    subtitle?: string;
    category?: string;
    source?: string;
    readTime?: number;
    imageUrl?: string;
    content: string;
    rawItem: any;
  } | null>(null);

  const [previewViewMode, setPreviewViewMode] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);

  // Edit modal live preview tab
  const [editTab, setEditTab] = useState<"edit" | "preview">("edit");

  const [articleForm, setArticleForm] = useState<ArticleForm>(emptyArticle);
  const [bookForm, setBookForm] = useState<BookForm>({
    bookId: "",
    title: "",
    author: "",
    content: "",
  });
  const [fatwaForm, setFatwaForm] = useState<FatwaForm>({
    fatwaId: "",
    question: "",
    answer: "",
    scholar: "",
  });

  const { data: articlesRes, isLoading: loadingArticles } = useGetArticlesQuery({
    lang: LANG,
    category: category === "all" ? undefined : category,
    page: 1,
    limit: 100,
  });
  const { data: booksRes, isLoading: loadingBooks } = useGetBooksQuery({
    lang: LANG,
    page: 1,
    limit: 100,
  });
  const { data: fatwasRes, isLoading: loadingFatwas } = useGetFatwasQuery({
    lang: LANG,
    page: 1,
    limit: 100,
  });

  const [createArticle, { isLoading: creatingArticle }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: updatingArticle }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: deletingArticle }] = useDeleteArticleMutation();
  const [createBook, { isLoading: creatingBook }] = useCreateBookMutation();
  const [updateBook, { isLoading: updatingBook }] = useUpdateBookMutation();
  const [deleteBook, { isLoading: deletingBook }] = useDeleteBookMutation();
  const [createFatwa, { isLoading: creatingFatwa }] = useCreateFatwaMutation();
  const [updateFatwa, { isLoading: updatingFatwa }] = useUpdateFatwaMutation();
  const [deleteFatwa, { isLoading: deletingFatwa }] = useDeleteFatwaMutation();

  const articles: KnowledgeArticle[] = articlesRes?.data || [];
  const books = booksRes?.data || [];
  const fatwas = fatwasRes?.data || [];

  const saving =
    creatingArticle ||
    updatingArticle ||
    creatingBook ||
    updatingBook ||
    creatingFatwa ||
    updatingFatwa;

  // Filtered lists based on search
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.content?.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.toLowerCase();
    return books.filter(
      (b: any) =>
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.content?.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  const filteredFatwas = useMemo(() => {
    if (!searchQuery.trim()) return fatwas;
    const q = searchQuery.toLowerCase();
    return fatwas.filter(
      (f: any) =>
        f.question?.toLowerCase().includes(q) ||
        f.scholar?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q)
    );
  }, [fatwas, searchQuery]);

  const openCreate = () => {
    setEditingId(null);
    setEditTab("edit");
    const now = Date.now();
    if (tab === "articles") {
      setArticleForm({
        ...emptyArticle,
        articleId: `art-${now}`,
      });
    } else if (tab === "books") {
      setBookForm({
        bookId: `book-${now}`,
        title: "",
        author: "",
        content: "",
      });
    } else {
      setFatwaForm({
        fatwaId: `fatwa-${now}`,
        question: "",
        answer: "",
        scholar: "",
      });
    }
    setOpen(true);
  };

  const openEditArticle = (article: KnowledgeArticle) => {
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
    setPreviewItem(null);
    setOpen(true);
  };

  const openEditBook = (book: any) => {
    setEditingId(book._id);
    setEditTab("edit");
    setBookForm({
      bookId: book.bookId,
      title: book.title,
      author: book.author || "",
      content: book.content,
    });
    setPreviewItem(null);
    setOpen(true);
  };

  const openEditFatwa = (fatwa: any) => {
    setEditingId(fatwa._id);
    setEditTab("edit");
    setFatwaForm({
      fatwaId: fatwa.fatwaId,
      question: fatwa.question,
      answer: fatwa.answer,
      scholar: fatwa.scholar || "",
    });
    setPreviewItem(null);
    setOpen(true);
  };

  const handleCopyContent = (text: string, asHtml = false) => {
    const toCopy = asHtml ? text : stripHtml(text);
    navigator.clipboard.writeText(toCopy);
    setCopied(true);
    toast.success(asHtml ? "Raw HTML copied" : "Clean text copied");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    try {
      const now = Date.now();
      if (tab === "articles") {
        if (!articleForm.title.trim() || !articleForm.content.trim()) {
          toast.error("Title and content are required");
          return;
        }
        const payload = {
          articleId: articleForm.articleId || `art-${now}`,
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
      } else if (tab === "books") {
        if (!bookForm.title.trim() || !bookForm.content.trim()) {
          toast.error("Title and content are required");
          return;
        }
        const payload = {
          bookId: bookForm.bookId || `book-${now}`,
          title: bookForm.title.trim(),
          author: bookForm.author.trim() || undefined,
          content: bookForm.content,
          lang: LANG,
        };
        if (editingId) {
          await updateBook({ id: editingId, ...payload }).unwrap();
        } else {
          await createBook(payload).unwrap();
        }
      } else {
        if (!fatwaForm.question.trim() || !fatwaForm.answer.trim()) {
          toast.error("Question and answer are required");
          return;
        }
        const payload = {
          fatwaId: fatwaForm.fatwaId || `fatwa-${now}`,
          question: fatwaForm.question.trim(),
          answer: fatwaForm.answer,
          scholar: fatwaForm.scholar.trim() || undefined,
          lang: LANG,
        };
        if (editingId) {
          await updateFatwa({ id: editingId, ...payload }).unwrap();
        } else {
          await createFatwa(payload).unwrap();
        }
      }
      toast.success("Saved successfully");
      setOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      if (tab === "articles") await deleteArticle(id).unwrap();
      else if (tab === "books") await deleteBook(id).unwrap();
      else await deleteFatwa(id).unwrap();
      toast.success("Deleted");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Knowledge Library & Articles"
          description="Manage Islamic articles, books, and fatwas synced with the mobile app"
        />
        <Button
          onClick={openCreate}
          className="bg-emerald-900 hover:bg-emerald-800 self-start sm:self-auto gap-2"
        >
          <Plus className="h-4 w-4" />
          Add {tab === "articles" ? "Article" : tab === "books" ? "Book" : "Fatwa"}
        </Button>
      </div>

      {/* Tabs, Search & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setTab("articles")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                tab === "articles"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Articles ({articles.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("books")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                tab === "books"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Books ({books.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("fatwas")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                tab === "fatwas"
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Fatwas ({fatwas.length})
            </button>
          </div>

          {tab === "articles" && (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40 h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-white"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold capitalize flex items-center gap-2">
            {tab === "articles" && <FileText className="h-4 w-4 text-emerald-700" />}
            {tab === "books" && <BookOpen className="h-4 w-4 text-emerald-700" />}
            {tab === "fatwas" && <HelpCircle className="h-4 w-4 text-emerald-700" />}
            {tab} Manager
          </CardTitle>
          <span className="text-xs text-slate-400">
            Click any row or &quot;View Content&quot; to read full rendered text
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {tab === "articles" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70">
                    <TableHead className="w-[42%]">Article Title &amp; Snippet</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Read Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingArticles ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-sm text-slate-400">
                        Loading articles...
                      </TableCell>
                    </TableRow>
                  ) : filteredArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-sm text-slate-400">
                        No articles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredArticles.map((article) => (
                      <TableRow
                        key={article._id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => {
                          setPreviewItem({
                            type: "article",
                            title: article.title,
                            subtitle: `Slug: /${article.slug}`,
                            category: article.category,
                            source: article.source || "manual",
                            readTime: article.readTime || 5,
                            imageUrl: article.imageUrl,
                            content: article.content,
                            rawItem: article,
                          });
                        }}
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
                            title="Read full article content"
                            onClick={() => {
                              setPreviewItem({
                                type: "article",
                                title: article.title,
                                subtitle: `Slug: /${article.slug}`,
                                category: article.category,
                                source: article.source || "manual",
                                readTime: article.readTime || 5,
                                imageUrl: article.imageUrl,
                                content: article.content,
                                rawItem: article,
                              });
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Content
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            title="Edit Article"
                            onClick={() => openEditArticle(article)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Article"
                            disabled={deletingArticle}
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
          )}

          {tab === "books" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70">
                    <TableHead className="w-[50%]">Book Title &amp; Snippet</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingBooks ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-sm text-slate-400">
                        Loading books...
                      </TableCell>
                    </TableRow>
                  ) : filteredBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-sm text-slate-400">
                        No books found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooks.map((book: any) => (
                      <TableRow
                        key={book._id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => {
                          setPreviewItem({
                            type: "book",
                            title: book.title,
                            subtitle: book.author ? `Author: ${book.author}` : undefined,
                            content: book.content,
                            rawItem: book,
                          });
                        }}
                      >
                        <TableCell className="py-3.5">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              {book.title}
                            </span>
                            <span className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                              {stripHtml(book?.content).slice(0, 110)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 font-medium">
                          {book.author || "—"}
                        </TableCell>
                        <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 px-2 text-xs gap-1"
                            onClick={() => {
                              setPreviewItem({
                                type: "book",
                                title: book.title,
                                subtitle: book.author ? `Author: ${book.author}` : undefined,
                                content: book.content,
                                rawItem: book,
                              });
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Content
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            onClick={() => openEditBook(book)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingBook}
                            onClick={() => handleDelete(book._id)}
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
          )}

          {tab === "fatwas" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70">
                    <TableHead className="w-[50%]">Question &amp; Answer Preview</TableHead>
                    <TableHead>Scholar</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingFatwas ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-sm text-slate-400">
                        Loading fatwas...
                      </TableCell>
                    </TableRow>
                  ) : filteredFatwas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-sm text-slate-400">
                        No fatwas found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFatwas.map((fatwa: any) => (
                      <TableRow
                        key={fatwa._id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => {
                          setPreviewItem({
                            type: "fatwa",
                            title: fatwa.question,
                            subtitle: fatwa.scholar ? `Scholar: ${fatwa.scholar}` : undefined,
                            content: fatwa.answer,
                            rawItem: fatwa,
                          });
                        }}
                      >
                        <TableCell className="py-3.5">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                              <HelpCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              {fatwa.question}
                            </span>
                            <span className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                              {stripHtml(fatwa?.answer).slice(0, 110)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 font-medium">
                          {fatwa.scholar || "—"}
                        </TableCell>
                        <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 px-2 text-xs gap-1"
                            onClick={() => {
                              setPreviewItem({
                                type: "fatwa",
                                title: fatwa.question,
                                subtitle: fatwa.scholar ? `Scholar: ${fatwa.scholar}` : undefined,
                                content: fatwa.answer,
                                rawItem: fatwa,
                              });
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Content
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            onClick={() => openEditFatwa(fatwa)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingFatwa}
                            onClick={() => handleDelete(fatwa._id)}
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
          )}
        </CardContent>
      </Card>

      {/* RICH CONTENT PREVIEW / VIEWER MODAL WITH HTML RENDERING */}
      <Dialog
        open={Boolean(previewItem)}
        onOpenChange={(openVal) => {
          if (!openVal) setPreviewItem(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[88vh] flex flex-col p-0 overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2">
                  {previewItem?.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      {previewItem.category}
                    </span>
                  )}
                  {previewItem?.source && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-200 text-slate-700 capitalize">
                      Source: {previewItem.source}
                    </span>
                  )}
                  {previewItem?.readTime && (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" />
                      {previewItem.readTime} min read
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {previewItem?.title}
                </h2>
                {previewItem?.subtitle && (
                  <p className="text-xs text-slate-500 font-mono">{previewItem.subtitle}</p>
                )}
              </div>

              {/* View Mode Switcher: Rendered vs Raw HTML */}
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

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {previewItem?.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={previewItem.imageUrl}
                  alt={previewItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {previewViewMode === "rendered" ? (
              hasHtmlTags(previewItem?.content || "") ? (
                /* PROPERLY RENDERED HTML */
                <div
                  className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed font-sans bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs [&>p]:mb-3 [&>p:last-child]:mb-0 [&>h1]:text-lg [&>h1]:font-bold [&>h2]:text-base [&>h2]:font-bold [&>h3]:text-sm [&>h3]:font-semibold [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-500 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&_a]:text-emerald-700 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: previewItem?.content || "" }}
                />
              ) : (
                /* Plain Text with line breaks */
                <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
                  {previewItem?.content}
                </div>
              )
            ) : (
              /* Raw HTML Code View */
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed border border-slate-800">
                <code>{previewItem?.content}</code>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-slate-600"
                onClick={() => handleCopyContent(previewItem?.content || "", false)}
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
                onClick={() => handleCopyContent(previewItem?.content || "", true)}
              >
                <Code2 className="h-3.5 w-3.5" /> Copy Raw HTML
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setPreviewItem(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                className="bg-emerald-900 hover:bg-emerald-800 text-xs gap-1.5"
                onClick={() => {
                  if (!previewItem) return;
                  if (previewItem.type === "article") openEditArticle(previewItem.rawItem);
                  else if (previewItem.type === "book") openEditBook(previewItem.rawItem);
                  else openEditFatwa(previewItem.rawItem);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit {previewItem?.type === "article" ? "Article" : previewItem?.type === "book" ? "Book" : "Fatwa"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit" : "Add"}{" "}
              {tab === "articles" ? "Article" : tab === "books" ? "Book" : "Fatwa"}
            </DialogTitle>
          </DialogHeader>

          {tab === "articles" && (
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

              {/* Editor Tabs: Edit vs Live Preview */}
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
          )}

          {tab === "books" && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={bookForm.title}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={bookForm.author}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, author: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Full Book Content</Label>
                <textarea
                  className="flex min-h-56 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-sans"
                  value={bookForm.content}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, content: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {tab === "fatwas" && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={fatwaForm.question}
                  onChange={(e) =>
                    setFatwaForm({ ...fatwaForm, question: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Scholar</Label>
                <Input
                  value={fatwaForm.scholar}
                  onChange={(e) =>
                    setFatwaForm({ ...fatwaForm, scholar: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <textarea
                  className="flex min-h-56 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-sans"
                  value={fatwaForm.answer}
                  onChange={(e) =>
                    setFatwaForm({ ...fatwaForm, answer: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-900 hover:bg-emerald-800"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
