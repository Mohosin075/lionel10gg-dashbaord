"use client";

import React, { useState } from "react";
import {
  useGetBenefitsQuery,
  useCreateBenefitMutation,
  useUpdateBenefitMutation,
  useDeleteBenefitMutation,
} from "@/redux/features/benefitApi";
import { Award, Plus, Trash2, Edit3, Sparkles } from "lucide-react";

export default function PremiumBenefitsPage() {
  const { data: benefits, isLoading } = useGetBenefitsQuery({});
  const [createBenefit] = useCreateBenefitMutation();
  const [updateBenefit] = useUpdateBenefitMutation();
  const [deleteBenefit] = useDeleteBenefitMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [serialNumber, setSerialNumber] = useState(1);
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingItem(null);
    setSerialNumber(benefits ? benefits.length + 1 : 1);
    setText("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setSerialNumber(item.serialNumber);
    setText(item.text);
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this benefit?")) {
      try {
        await deleteBenefit(id).unwrap();
      } catch (err) {
        alert("Failed to delete benefit.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        serialNumber,
        text,
        isActive,
      };

      if (editingItem) {
        await updateBenefit({ id: editingItem._id, ...payload }).unwrap();
      } else {
        await createBenefit(payload).unwrap();
      }

      setIsModalOpen(false);
      alert("Benefit saved successfully!");
    } catch (err) {
      alert("Failed to save benefit.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="text-emerald-800" /> Premium Benefits Editor
          </h1>
          <p className="text-sm text-slate-500">
            Define and manage the premium feature benefit points list displayed dynamically on the mobile app's Premium supporter screen.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-950 text-white font-medium rounded-full px-5 py-3 transition-colors shadow"
        >
          <Plus size={18} /> Add Premium Benefit
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
              <th className="p-4 w-20">#</th>
              <th className="p-4">Benefit Text Point</th>
              <th className="p-4 w-32">Status</th>
              <th className="p-4 text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">Loading premium benefits...</td>
              </tr>
            ) : benefits?.length ? (
              benefits.map((item: any) => (
                <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                  <td className="p-4 font-semibold text-slate-900">{item.serialNumber}</td>
                  <td className="p-4 text-slate-900 font-medium">{item.text}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
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
                <td colSpan={4} className="p-8 text-center text-slate-400">No premium benefits configured.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-emerald-800" size={20} /> {editingItem ? "Edit" : "Create"} Premium Benefit
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">Serial Number</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">Benefit Description Point</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Choose Your Own Subscription Amount"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-emerald-800 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Display point on Premium supporter screen
                </label>
              </div>

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
                  Save Point
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
