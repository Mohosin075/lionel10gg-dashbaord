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
  Code,
  FileCode2,
  Eye,
  Columns,
  Sparkles,
  HelpCircle,
  Check,
  ChevronDown,
} from "lucide-react";

interface PolicyRichEditorProps {
  content: string;
  onChange: (html: string) => void;
  editorMode: "split" | "visual" | "code";
  onModeChange: (mode: "split" | "visual" | "code") => void;
}

export default function PolicyRichEditor({
  content,
  onChange,
  editorMode,
  onModeChange,
}: PolicyRichEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showSnippetMenu, setShowSnippetMenu] = useState(false);

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
          "prose prose-slate max-w-none focus:outline-none min-h-[420px] px-6 py-5 text-sm sm:text-base leading-relaxed text-slate-800 " +
          "[&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:mb-3 [&_h1]:tracking-tight " +
          "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:pb-1.5 [&_h2]:border-b [&_h2]:border-slate-200 " +
          "[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_h3]:mb-1 " +
          "[&_p]:mb-3 [&_p]:text-slate-600 [&_p]:leading-relaxed " +
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:mb-3 [&_ul]:text-slate-600 " +
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:mb-3 [&_ol]:text-slate-600 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:bg-emerald-50/70 [&_blockquote]:p-3.5 [&_blockquote]:rounded-r-xl [&_blockquote]:text-slate-700 [&_blockquote]:italic",
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
      <div className="h-96 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400">
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

    const formatted = linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("mailto:")
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
      <div className="bg-slate-50/90 border-b border-slate-200/80 p-2.5 flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200">
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
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
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
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
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
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
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
          <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200 relative">
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

            {/* Link Popover */}
            {showLinkModal && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 space-y-2">
                <span className="text-[11px] font-bold text-slate-800 block">
                  Insert Link URL
                </span>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
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
                    className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={setLink}
                    className="px-3 py-1 text-xs font-bold bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg shadow-xs cursor-pointer"
                  >
                    Apply Link
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Compliance Snippets Dropdown */}
          <div className="relative">
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
              <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1 text-xs">
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

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => onModeChange("visual")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              editorMode === "visual"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Visual WYSIWYG Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            Visual
          </button>
          <button
            type="button"
            onClick={() => onModeChange("code")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              editorMode === "code"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="HTML Source Code Mode"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            HTML Code
          </button>
          <button
            type="button"
            onClick={() => onModeChange("split")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              editorMode === "split"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Split (Editor & Live Preview)"
          >
            <Columns className="w-3.5 h-3.5" />
            Split
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {editorMode === "code" ? (
        <div className="p-4 bg-slate-900">
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={22}
            className="w-full font-mono text-xs text-emerald-400 bg-transparent focus:outline-none resize-y leading-relaxed"
            placeholder="Type raw HTML here..."
          />
        </div>
      ) : (
        <div className="p-2 sm:p-4 min-h-[460px] cursor-text">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}

