"use client";

import React, { useState } from "react";
import {
  useGetSheikhContentsQuery,
  useCreateSheikhContentMutation,
  useUpdateSheikhContentMutation,
  useDeleteSheikhContentMutation,
} from "@/redux/features/sheikhApi";
import { Trash2, Plus, Video, Link2, ExternalLink } from "lucide-react";

export default function SheikhMediaPage() {
  const { data: sheikhContents, isLoading } = useGetSheikhContentsQuery({});
  const [createSheikhContent] = useCreateSheikhContentMutation();
  const [deleteSheikhContent] = useDeleteSheikhContentMutation();

  const [speakerName, setSpeakerName] = useState("Pierre Vogel");
  const [type, setType] = useState<"video" | "audio_travel">("video");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSheikhContent({
        speakerName,
        type,
        title,
        url,
        isActive: true,
      }).unwrap();
      
      // Reset form
      setTitle("");
      setUrl("");
      alert("Media content added successfully!");
    } catch (err) {
      alert("Failed to add media content. Make sure the YouTube URL is valid.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this media content?")) {
      try {
        await deleteSheikhContent(id).unwrap();
      } catch (err) {
        alert("Failed to delete media content.");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Video className="text-emerald-800" /> Sheikh Media Manager
        </h1>
        <p className="text-sm text-slate-500">
          Add YouTube channel playlist links or video URLs. The backend automatically parses YouTube video/playlist IDs for the in-app player.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="bg-white rounded-xl p-6 shadow space-y-4 h-fit">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Plus size={18} /> Add Media URL
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Speaker / Scholar</label>
              <select
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none bg-slate-50"
              >
                <option value="Abu Alia">Sheikh Abu Alia</option>
                <option value="Abul Baraa">Sheikh Abul Baraa</option>
                <option value="Pierre Vogel">Pierre Vogel</option>
                <option value="One Message Foundation">One Message Foundation</option>
                <option value="Alim Hamza">Alim Hamza</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Content Type</label>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="video"
                    checked={type === "video"}
                    onChange={() => setType("video")}
                    className="accent-emerald-800"
                  />
                  Video Lecture
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="audio_travel"
                    checked={type === "audio_travel"}
                    onChange={() => setType("audio_travel")}
                    className="accent-emerald-800"
                  />
                  Audio Hörreisen
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. The Purpose of Life"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">YouTube Video/Playlist URL</label>
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-medium rounded-full py-2.5 text-sm shadow transition-colors"
            >
              Parse & Save Content
            </button>
          </form>
        </div>

        {/* Media List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
                <th className="p-4">Speaker</th>
                <th className="p-4">Type</th>
                <th className="p-4">Title / Video</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">Loading media contents...</td>
                </tr>
              ) : sheikhContents?.length ? (
                sheikhContents.map((item: any) => (
                  <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                    <td className="p-4 font-semibold text-slate-900">{item.speakerName}</td>
                    <td className="p-4 text-slate-500">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                        item.type === "video" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                      }`}>
                        {item.type === "video" ? "Video" : "Audio"}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 truncate">{item.title}</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-800 hover:underline flex items-center gap-1 mt-1"
                        >
                          <Link2 size={12} /> View Link <ExternalLink size={10} />
                        </a>
                      </div>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">No sheikh media content found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
