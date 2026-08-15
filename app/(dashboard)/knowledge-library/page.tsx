"use client";

import { useState } from "react";
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
import { Pencil, Plus, Trash2 } from "lucide-react";

const LANG = "en";

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

export default function KnowledgeLibraryPage() {
  const [tab, setTab] = useState<Tab>("articles");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    limit: 50,
  });
  const { data: booksRes, isLoading: loadingBooks } = useGetBooksQuery({
    lang: LANG,
    page: 1,
    limit: 50,
  });
  const { data: fatwasRes, isLoading: loadingFatwas } = useGetFatwasQuery({
    lang: LANG,
    page: 1,
    limit: 50,
  });

  const [createArticle, { isLoading: creatingArticle }] =
    useCreateArticleMutation();
  const [updateArticle, { isLoading: updatingArticle }] =
    useUpdateArticleMutation();
  const [deleteArticle, { isLoading: deletingArticle }] =
    useDeleteArticleMutation();
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

  const openCreate = () => {
    setEditingId(null);
    if (tab === "articles") {
      setArticleForm({
        ...emptyArticle,
        articleId: `art-${Date.now()}`,
      });
    } else if (tab === "books") {
      setBookForm({
        bookId: `book-${Date.now()}`,
        title: "",
        author: "",
        content: "",
      });
    } else {
      setFatwaForm({
        fatwaId: `fatwa-${Date.now()}`,
        question: "",
        answer: "",
        scholar: "",
      });
    }
    setOpen(true);
  };

  const openEditArticle = (article: KnowledgeArticle) => {
    setEditingId(article._id);
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
    setOpen(true);
  };

  const openEditBook = (book: {
    _id: string;
    bookId: string;
    title: string;
    author?: string;
    content: string;
  }) => {
    setEditingId(book._id);
    setBookForm({
      bookId: book.bookId,
      title: book.title,
      author: book.author || "",
      content: book.content,
    });
    setOpen(true);
  };

  const openEditFatwa = (fatwa: {
    _id: string;
    fatwaId: string;
    question: string;
    answer: string;
    scholar?: string;
  }) => {
    setEditingId(fatwa._id);
    setFatwaForm({
      fatwaId: fatwa.fatwaId,
      question: fatwa.question,
      answer: fatwa.answer,
      scholar: fatwa.scholar || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (tab === "articles") {
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
      } else if (tab === "books") {
        if (!bookForm.title.trim() || !bookForm.content.trim()) {
          toast.error("Title and content are required");
          return;
        }
        const payload = {
          bookId: bookForm.bookId || `book-${Date.now()}`,
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
          fatwaId: fatwaForm.fatwaId || `fatwa-${Date.now()}`,
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
      toast.success("Saved");
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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Knowledge Library"
          description="Articles, books, and fatwas — one library the app syncs"
        />
        <Button
          onClick={openCreate}
          className="bg-emerald-900 hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {tab === "articles" ? "article" : tab === "books" ? "book" : "fatwa"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full bg-slate-100 p-1">
          {(["articles", "books", "fatwas"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                tab === item
                  ? "bg-emerald-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        {tab === "articles" && (
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
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base capitalize">{tab}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {tab === "articles" && (
            <LibraryTable
              loading={loadingArticles}
              empty="No articles found."
              columns={["Title", "Category", "Source", "Status", ""]}
              rows={articles.map((article) => ({
                id: article._id,
                cells: [
                  article.title,
                  article.category,
                  article.source || "manual",
                  article.isActive === false ? "Inactive" : "Active",
                ],
                inactive: article.isActive === false,
                onEdit: () => openEditArticle(article),
                onDelete: () => handleDelete(article._id),
                deleting: deletingArticle,
              }))}
            />
          )}
          {tab === "books" && (
            <LibraryTable
              loading={loadingBooks}
              empty="No books found."
              columns={["Title", "Author", ""]}
              rows={books.map(
                (book: {
                  _id: string;
                  bookId: string;
                  title: string;
                  author?: string;
                  content: string;
                }) => ({
                  id: book._id,
                  cells: [book.title, book.author || "—"],
                  onEdit: () => openEditBook(book),
                  onDelete: () => handleDelete(book._id),
                  deleting: deletingBook,
                }),
              )}
            />
          )}
          {tab === "fatwas" && (
            <LibraryTable
              loading={loadingFatwas}
              empty="No fatwas found."
              columns={["Question", "Scholar", ""]}
              rows={fatwas.map(
                (fatwa: {
                  _id: string;
                  fatwaId: string;
                  question: string;
                  answer: string;
                  scholar?: string;
                }) => ({
                  id: fatwa._id,
                  cells: [fatwa.question, fatwa.scholar || "—"],
                  onEdit: () => openEditFatwa(fatwa),
                  onDelete: () => handleDelete(fatwa._id),
                  deleting: deletingFatwa,
                }),
              )}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit" : "Add"}{" "}
              {tab === "articles" ? "article" : tab === "books" ? "book" : "fatwa"}
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
              <div className="space-y-2">
                <Label>Content</Label>
                <textarea
                  className="flex min-h-48 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={articleForm.content}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, content: e.target.value })
                  }
                />
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
                <Label>Content</Label>
                <textarea
                  className="flex min-h-48 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
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
                  className="flex min-h-48 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
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

function LibraryTable({
  loading,
  empty,
  columns,
  rows,
}: {
  loading: boolean;
  empty: string;
  columns: string[];
  rows: {
    id: string;
    cells: string[];
    inactive?: boolean;
    onEdit: () => void;
    onDelete: () => void;
    deleting?: boolean;
  }[];
}) {
  if (loading) {
    return <p className="p-6 text-sm text-slate-500">Loading...</p>;
  }
  if (rows.length === 0) {
    return <p className="p-6 text-sm text-slate-500">{empty}</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column || "actions"}
              className={column === "" ? "text-right" : undefined}
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {row.cells.map((cell, index) => (
              <TableCell
                key={`${row.id}-${index}`}
                className={index === 0 ? "font-medium max-w-xs truncate" : undefined}
              >
                {index === row.cells.length - 1 &&
                (cell === "Active" || cell === "Inactive") ? (
                  <Badge variant={row.inactive ? "restricted" : "active"}>
                    {cell}
                  </Badge>
                ) : (
                  cell
                )}
              </TableCell>
            ))}
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={row.onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500"
                disabled={row.deleting}
                onClick={row.onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
