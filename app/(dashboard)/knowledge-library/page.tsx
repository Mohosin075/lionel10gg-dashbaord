"use client";

import React, { useState } from "react";
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
import { Trash2, Edit3, Plus, Search, BookOpen, AlertCircle } from "lucide-react";

export default function KnowledgeLibraryPage() {
  const [activeTab, setActiveTab] = useState<"articles" | "books" | "fatwas">("articles");
  const [searchTerm, setSearchTerm] = useState("");
  const [lang, setLang] = useState("de");
  const [page, setPage] = useState(1);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Articles");
  const [author, setAuthor] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Queries
  const { data: articlesData, isLoading: loadingArticles } = useGetArticlesQuery(
    { lang, page, limit: 10, category: searchTerm },
    { skip: activeTab !== "articles" }
  );

  const { data: booksData, isLoading: loadingBooks } = useGetBooksQuery(
    { lang, page, limit: 10 },
    { skip: activeTab !== "books" }
  );

  const { data: fatwasData, isLoading: loadingFatwas } = useGetFatwasQuery(
    { lang, page, limit: 10 },
    { skip: activeTab !== "fatwas" }
  );

  // Mutations
  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  const [createFatwa] = useCreateFatwaMutation();
  const [updateFatwa] = useUpdateFatwaMutation();
  const [deleteFatwa] = useDeleteFatwaMutation();

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setContent("");
    setCategory("Articles");
    setAuthor("");
    setQuestion("");
    setAnswer("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    if (activeTab === "articles") {
      setTitle(item.title);
      setContent(item.content);
      setCategory(item.category);
    } else if (activeTab === "books") {
      setTitle(item.title);
      setContent(item.content);
      setAuthor(item.author || "");
    } else {
      setQuestion(item.question);
      setAnswer(item.answer);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        if (activeTab === "articles") {
          await deleteArticle(id).unwrap();
        } else if (activeTab === "books") {
          await deleteBook(id).unwrap();
        } else {
          await deleteFatwa(id).unwrap();
        }
      } catch (err) {
        alert("Failed to delete item");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "articles") {
        const payload = {
          title,
          content,
          category,
          lang,
          articleId: editingItem?.articleId || `art_${Date.now()}`,
          slug: editingItem?.slug || title.toLowerCase().replace(/ /g, "-"),
        };
        if (editingItem) {
          await updateArticle({ id: editingItem._id, ...payload }).unwrap();
        } else {
          await createArticle(payload).unwrap();
        }
      } else if (activeTab === "books") {
        const payload = {
          title,
          content,
          author,
          lang,
          bookId: editingItem?.bookId || `book_${Date.now()}`,
        };
        if (editingItem) {
          await updateBook({ id: editingItem._id, ...payload }).unwrap();
        } else {
          await createBook(payload).unwrap();
        }
      } else {
        const payload = {
          question,
          answer,
          lang,
          fatwaId: editingItem?.fatwaId || `fatwa_${Date.now()}`,
        };
        if (editingItem) {
          await updateFatwa({ id: editingItem._id, ...payload }).unwrap();
        } else {
          await createFatwa(payload).unwrap();
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save changes");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="text-emerald-800" /> Knowledge Library Manager
          </h1>
          <p className="text-sm text-slate-500">
            Create and organize premium articles, ebooks, and verified fatwas.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-950 text-white font-medium rounded-full px-5 py-3 transition-colors shadow"
        >
          <Plus size={18} /> Add New {activeTab === "articles" ? "Article" : activeTab === "books" ? "Book" : "Fatwa"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(["articles", "books", "fatwas"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`px-6 py-3 font-semibold border-b-2 text-sm capitalize transition-colors ${
              activeTab === tab
                ? "border-emerald-800 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label className="text-sm font-medium text-slate-600">Language:</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border border-slate-200 rounded-full px-4 py-2 text-sm outline-none bg-slate-50"
          >
            <option value="de">German (Deutsch)</option>
            <option value="en">English</option>
            <option value="tr">Turkish (Türkçe)</option>
            <option value="hu">Hungarian (Magyar)</option>
            <option value="bs">Bosnian</option>
          </select>
        </div>

        {activeTab === "articles" && (
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2 w-full border border-slate-200 rounded-full text-sm outline-none"
            />
          </div>
        )}
      </div>

      {/* Content Table / Lists */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {activeTab === "articles" && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Language</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingArticles ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">Loading articles...</td>
                </tr>
              ) : articlesData?.data?.length ? (
                articlesData.data.map((item: any) => (
                  <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                    <td className="p-4 font-medium text-slate-900">{item.title}</td>
                    <td className="p-4 text-slate-500">{item.category}</td>
                    <td className="p-4 text-slate-500 uppercase">{item.lang}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-full transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">No articles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === "books" && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Language</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingBooks ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">Loading books...</td>
                </tr>
              ) : booksData?.data?.length ? (
                booksData.data.map((item: any) => (
                  <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                    <td className="p-4 font-medium text-slate-900">{item.title}</td>
                    <td className="p-4 text-slate-500">{item.author || "Unknown"}</td>
                    <td className="p-4 text-slate-500 uppercase">{item.lang}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-full transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">No books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === "fatwas" && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
                <th className="p-4">Question</th>
                <th className="p-4">Language</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingFatwas ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">Loading fatwas...</td>
                </tr>
              ) : fatwasData?.data?.length ? (
                fatwasData.data.map((item: any) => (
                  <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                    <td className="p-4 font-medium text-slate-900 max-w-lg truncate">{item.question}</td>
                    <td className="p-4 text-slate-500 uppercase">{item.lang}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-full transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">No fatwas found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-slate-900">
              {editingItem ? "Edit" : "Create"}{" "}
              {activeTab === "articles" ? "Article" : activeTab === "books" ? "Book" : "Fatwa"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "articles" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Article Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border border-slate-200 rounded-lg px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="border border-slate-200 rounded-lg px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">HTML Rich Text Content</label>
                    <textarea
                      required
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="border border-slate-200 rounded-lg p-3 outline-none font-mono text-sm"
                      placeholder="<p>Write content in rich text HTML format...</p>"
                    />
                  </div>
                </>
              )}

              {activeTab === "books" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Book Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border border-slate-200 rounded-lg px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="border border-slate-200 rounded-lg px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">HTML Text Content</label>
                    <textarea
                      required
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="border border-slate-200 rounded-lg p-3 outline-none font-mono text-sm"
                      placeholder="<p>Book chapters in HTML format...</p>"
                    />
                  </div>
                </>
              )}

              {activeTab === "fatwas" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Question</label>
                    <input
                      type="text"
                      required
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="border border-slate-200 rounded-lg px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Answer HTML</label>
                    <textarea
                      required
                      rows={10}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="border border-slate-200 rounded-lg p-3 outline-none font-mono text-sm"
                      placeholder="<p>Answer details in HTML...</p>"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-950 text-white text-sm font-medium shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
