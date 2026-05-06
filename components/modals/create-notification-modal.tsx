"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormValues = {
  title: string;
  message: string;
  status: "sent" | "scheduled" | "draft";
  recipients: number;
};

export default function CreateNotificationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      status: "draft",
      recipients: 100,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("NEW NOTIFICATION:", values); // 🔥 replace later with API

    toast.success("Notification created successfully");
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Create Push Notification
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Send a notification to all users or schedule it
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input {...register("title")} placeholder="Notification title" />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium">Message *</label>
            <textarea
              {...register("message")}
              className="w-full rounded-md bg-slate-50 p-3 text-sm"
              placeholder="Write message..."
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Action</label>
            <select
              {...register("status")}
              className="w-full h-11 rounded-md bg-slate-50 px-3"
            >
              <option value="sent">Send Now</option>
              <option value="scheduled">Schedule</option>
              <option value="draft">Save as Draft</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
