"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  FileCode2,
  Eye,
  Columns,
  Sparkles,
  ChevronDown,
  PenLine,
  Smartphone,
  Monitor,
} from "lucide-react";

export type EditorMode = "visual" | "preview" | "code" | "split";

interface PolicyRichEditorProps {
  content: string;
  onChange: (html: string) => void;
  editorMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  documentTitle?: string;
}

export default function PolicyRichEditor({
  content,
  onChange,
  editorMode,
  onModeChange,
  documentTitle,
}: PolicyRichEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showSnippetMenu, setShowSnippetMenu] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-emerald-700 underline underline-offset-4 font-semibold hover:text-emerald-900",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[380px] sm:min-h-[460px] px-3.5 py-4 sm:px-6 sm:py-5 text-sm sm:text-base leading-relaxed text-slate-800 " +
          "[&_h1]:text-xl sm:[&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:mb-3 [&_h1]:tracking-tight " +
          "[&_h2]:text-base sm:[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-5 sm:[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:pb-1.5 [&_h2]:border-b [&_h2]:border-slate-200 " +
          "[&_h3]:text-sm sm:[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_h3]:mb-1 " +
          "[&_p]:mb-3 [&_p]:text-slate-600 [&_p]:leading-relaxed " +
          "[&_ul]:list-disc [&_ul]:pl-5 sm:[&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:mb-3 [&_ul]:text-slate-600 " +
          "[&_ol]:list-decimal [&_ol]:pl-5 sm:[&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:mb-3 [&_ol]:text-slate-600 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:bg-emerald-50/70 [&_blockquote]:p-3 sm:[&_blockquote]:p-3.5 [&_blockquote]:rounded-r-xl [&_blockquote]:text-slate-700 [&_blockquote]:italic",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes if editor doesn't match
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="h-72 sm:h-96 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400">
        Loading interactive editor...
      </div>
    );
  }

  const setLink = () => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkModal(false);
      return;
    }

    const formatted =
      linkUrl.startsWith("http://") ||
      linkUrl.startsWith("https://") ||
      linkUrl.startsWith("mailto:")
        ? linkUrl
        : `https://${linkUrl}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: formatted })
      .run();

    setShowLinkModal(false);
    setLinkUrl("");
  };

  const insertSnippet = (snippetHtml: string) => {
    editor.chain().focus().insertContent(snippetHtml).run();
    setShowSnippetMenu(false);
  };

  return (
    <div className="flex flex-col border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
      {/* Top Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200/80 p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 select-none">
        {/* Mode Switcher Tabs - On mobile placed at top of toolbar with full width grid */}
        <div className="order-first sm:order-last grid grid-cols-4 sm:flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => onModeChange("visual")}
            className={`justify-center px-1.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition cursor-pointer ${
              editorMode === "visual"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Edit Document (Full Width)"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("preview")}
            className={`justify-center px-1.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition cursor-pointer ${
              editorMode === "preview"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Live Store Preview (Full Width)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("code")}
            className={`justify-center px-1.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition cursor-pointer ${
              editorMode === "code"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="HTML Source Code"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("split")}
            className={`justify-center px-1.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition cursor-pointer ${
              editorMode === "split"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Split (Editor & Live Preview Side-by-Side)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
        </div>

        {/* Left Side: Mode-dependent controls */}
        {editorMode === "preview" ? (
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/70 text-xs font-bold">
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden xs:inline">Store</span>
                <span>Preview</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                Live
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Back to Edit Button */}
              <button
                type="button"
                onClick={() => onModeChange("visual")}
                className="px-2.5 sm:px-3 py-1 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <PenLine className="w-3 h-3" />
                <span>Edit Document</span>
              </button>

              {/* Device View Toggle (desktop/tablet) */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-200/60 p-0.5 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                    previewDevice === "desktop"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Full</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                    previewDevice === "mobile"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phone</span>
                </button>
              </div>
            </div>
          </div>
        ) : editorMode === "code" ? (
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-200/70 text-slate-800 rounded-xl text-xs font-bold">
              <FileCode2 className="w-3.5 h-3.5 text-slate-700" />
              <span>HTML Source Code</span>
            </div>
            <button
              type="button"
              onClick={() => onModeChange("visual")}
              className="px-2.5 sm:px-3 py-1 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Visual Editor</span>
            </button>
          </div>
        ) : (
          /* Visual or Split Mode: Swipeable Horizontal Toolbar on Mobile, Wrapped on Desktop */
          <div className="w-full sm:w-auto overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex items-center gap-1 py-1 -mx-0.5 px-0.5 sm:flex-wrap">
            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Heading Levels */}
            <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`p-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  editor.isActive("heading", { level: 1 })
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Heading 1"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`p-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  editor.isActive("heading", { level: 2 })
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Heading 2 (Creates Table of Contents Anchor)"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`p-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  editor.isActive("heading", { level: 3 })
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Heading 3"
              >
                <Heading3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Text Style: Bold, Italic, Underline, Strike */}
            <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive("bold")
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive("italic")
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive("underline")
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive("strike")
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lists & Blockquote */}
            <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive("bulletList")
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive("orderedList")
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive("blockquote")
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Blockquote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200/70 transition cursor-pointer"
                title="Horizontal Divider"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Link Control */}
            <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 shrink-0 relative">
              <button
                type="button"
                onClick={() => {
                  const prev = editor.getAttributes("link").href || "";
                  setLinkUrl(prev);
                  setShowLinkModal(!showLinkModal);
                }}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive("link")
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/70"
                }`}
                title="Insert or Edit Link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>

              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                  title="Remove Link"
                >
                  <Unlink className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Link Popover - Mobile Centered or Dropdown */}
              {showLinkModal && (
                <div className="fixed sm:absolute inset-x-4 top-1/4 sm:inset-x-auto sm:left-0 sm:top-full mt-2 w-auto sm:w-72 bg-white rounded-2xl shadow-2xl sm:shadow-xl border border-slate-200 p-3.5 z-50 space-y-2">
                  <span className="text-[11px] font-bold text-slate-800 block">
                    Insert Link URL
                  </span>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setLink();
                      }
                    }}
                  />
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(false)}
                      className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={setLink}
                      className="px-3.5 py-1.5 text-xs font-bold bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg shadow-xs cursor-pointer"
                    >
                      Apply Link
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Compliance Snippets Dropdown */}
            <div className="shrink-0 relative">
              <button
                type="button"
                onClick={() => setShowSnippetMenu(!showSnippetMenu)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/90 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Insert Clause</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showSnippetMenu && (
                <div className="fixed sm:absolute inset-x-4 top-1/4 sm:inset-x-auto sm:left-0 sm:top-full mt-2 w-auto sm:w-80 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-2xl sm:shadow-xl border border-slate-200 p-2 z-50 space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        `<div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 my-4"><strong>Store Notice:</strong> Quran International strictly safeguards user data privacy and complies with Google Play Data Safety and Apple App Store Guideline 5.1.1.</div>`
                      )
                    }
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition cursor-pointer"
                  >
                    <strong className="block text-emerald-900">
                      Store Compliance Callout
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Highlighted box for store privacy compliance.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        `<p><strong>Location Permission (Prayer Times):</strong> With your consent, we access your device GPS strictly to compute accurate local Islamic prayer schedules and Qibla direction. Your location is never shared, stored on external ad servers, or sold.</p>`
                      )
                    }
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition cursor-pointer"
                  >
                    <strong className="block text-slate-900">
                      Location &amp; Prayer Times Clause
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Required for Google Play location disclosure.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        `<h3>How to Request Account Deletion</h3><p>Users can delete their account inside the app via <em>Settings &gt; Profile &gt; Delete Account</em> or by emailing <a href="mailto:support@quraninternational.com?subject=Account%20Deletion%20Request">support@quraninternational.com</a>.</p>`
                      )
                    }
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition cursor-pointer"
                  >
                    <strong className="block text-slate-900">
                      Account Deletion Steps
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      In-app and email deletion instructions.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        `<p><strong>Support &amp; Contact:</strong> For inquiries or corrections, reach us at <a href="mailto:support@quraninternational.com">support@quraninternational.com</a>. We respond within 24–48 hours.</p>`
                      )
                    }
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition cursor-pointer"
                  >
                    <strong className="block text-slate-900">
                      Support Contact Information
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Official email and response timeframe.
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Editor Body Area */}
      {editorMode === "preview" ? (
        /* Full Width Preview Mode */
        <div className="p-2 sm:p-8 bg-slate-50/60 min-h-[380px] sm:min-h-[520px] max-h-[750px] overflow-y-auto">
          <div
            className={`mx-auto transition-all ${
              previewDevice === "mobile"
                ? "max-w-sm bg-white border-2 border-slate-300 rounded-[2rem] p-4 sm:p-6 shadow-xl ring-4 sm:ring-8 ring-slate-100"
                : "w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-10 shadow-xs"
            }`}
          >
            {documentTitle && (
              <div className="pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Public Store Preview
                </span>
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {documentTitle}
                </h1>
              </div>
            )}

            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="policy-mirror-preview text-slate-700 leading-relaxed
                [&_h1]:text-xl sm:[&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:mb-3 sm:[&_h1]:mb-4 [&_h1]:tracking-tight
                [&_h2]:text-base sm:[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 sm:[&_h2]:mt-8 [&_h2]:mb-2 sm:[&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-slate-200
                [&_h3]:text-xs sm:[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 sm:[&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:text-xs sm:[&_p]:text-base [&_p]:text-slate-600 [&_p]:mb-3 sm:[&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 sm:[&_ul]:pl-6 [&_ul]:space-y-1.5 sm:[&_ul]:space-y-2 [&_ul]:mb-3 sm:[&_ul]:mb-4 [&_ul]:text-xs sm:[&_ul]:text-base [&_ul]:text-slate-600
                [&_ol]:list-decimal [&_ol]:pl-5 sm:[&_ol]:pl-6 [&_ol]:space-y-1.5 sm:[&_ol]:space-y-2 [&_ol]:mb-3 sm:[&_ol]:mb-4 [&_ol]:text-xs sm:[&_ol]:text-base [&_ol]:text-slate-600
                [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:bg-emerald-50/70 [&_blockquote]:p-3 sm:[&_blockquote]:p-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:text-slate-700 [&_blockquote]:italic [&_blockquote]:my-3 sm:[&_blockquote]:my-4
                [&_a]:text-emerald-700 [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-emerald-900"
            />
          </div>
        </div>
      ) : editorMode === "code" ? (
        /* Full Width HTML Code Editor */
        <div className="p-3 sm:p-4 bg-slate-900">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span>Direct HTML Source Editor</span>
            <span>{content.length} characters</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={18}
            className="w-full font-mono text-xs text-emerald-400 bg-transparent focus:outline-none resize-y leading-relaxed"
            placeholder="Type raw HTML here..."
          />
        </div>
      ) : editorMode === "split" ? (
        /* Side by Side Split Mode */
        <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-200">
          <div className="p-3 sm:p-5 min-h-[380px] sm:min-h-[480px] cursor-text">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">
              Visual Editor
            </div>
            <EditorContent editor={editor} />
          </div>

          <div className="p-3 sm:p-4 bg-slate-50/50 min-h-[380px] sm:min-h-[480px] max-h-[650px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Live Mirror Preview
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Synchronized
              </span>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="policy-mirror-preview space-y-3
              [&_h1]:text-lg sm:[&_h1]:text-xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:mb-3
              [&_h2]:text-sm sm:[&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:pb-1.5 [&_h2]:border-b [&_h2]:border-slate-200
              [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_h3]:mb-1
              [&_p]:text-xs sm:[&_p]:text-sm [&_p]:text-slate-600 [&_p]:mb-3
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-3 [&_ul]:text-xs sm:[&_ul]:text-sm [&_ul]:text-slate-600
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:mb-3 [&_ol]:text-xs sm:[&_ol]:text-sm [&_ol]:text-slate-600
              [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:bg-emerald-50/70 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:text-slate-700 [&_blockquote]:italic
              [&_a]:text-emerald-700 [&_a]:underline"
            />
          </div>
        </div>
      ) : (
        /* Full Width Visual Editor Mode (Default) */
        <div className="p-2.5 sm:p-6 min-h-[380px] sm:min-h-[500px] cursor-text">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}
