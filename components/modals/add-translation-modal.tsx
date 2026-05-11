// "use client";

// import { X } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// type FormValues = {
//   language: string;
//   translator: string;
//   verses: number;
//   status: "draft" | "published";
// };

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
// };

// export default function AddTranslationModal({ isOpen, onClose }: Props) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       status: "draft",
//       verses: 6236,
//     },
//   });

//   if (!isOpen) return null;

//   const onSubmit = (data: FormValues) => {
//     console.log("Form Data:", data);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
//         {/* Header */}
//         <div className="flex justify-between mb-6">
//           <h2 className="text-xl font-semibold">Add Translation</h2>
//           <button onClick={onClose}>
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <Input
//             placeholder="Language"
//             {...register("language", { required: "Language is required" })}
//           />
//           {errors.language && (
//             <p className="text-red-500 text-sm">{errors.language.message}</p>
//           )}

//           <Input
//             placeholder="Translator"
//             {...register("translator", { required: "Translator is required" })}
//           />
//           {errors.translator && (
//             <p className="text-red-500 text-sm">{errors.translator.message}</p>
//           )}

//           <Input
//             type="number"
//             {...register("verses", {
//               required: true,
//               min: { value: 1, message: "Must be greater than 0" },
//             })}
//           />
//           {errors.verses && (
//             <p className="text-red-500 text-sm">{errors.verses.message}</p>
//           )}

//           <select {...register("status")} className="w-full border p-2 rounded">
//             <option value="draft">Draft</option>
//             <option value="published">Published</option>
//           </select>

//           <div className="flex justify-end gap-2">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit">Add</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormValues = {
  language: string;
  translator: string;
  verses: number;
  status: "draft" | "published";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTranslationModal({ isOpen, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      status: "draft",
      verses: 6236,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-none w-auto">
        {/* Overlay-style container (same as your design) */}
        <div className="w-full fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          {/* Modal Box */}
          <div className="min-w-xl rounded-xl bg-white p-6 shadow-xl border border-slate-100">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Add New Translation
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Add a new Quran translation to the app
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Language *
                </label>
                <Input
                  {...register("language", {
                    required: "Language is required",
                  })}
                  placeholder="e.g., English, Arabic, Urdu"
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300 placeholder:text-slate-400"
                />
                {errors.language && (
                  <p className="text-xs text-red-500">
                    {errors.language.message}
                  </p>
                )}
              </div>

              {/* Translator */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Translator Name *
                </label>
                <Input
                  {...register("translator", {
                    required: "Translator is required",
                  })}
                  placeholder="e.g., Sahih International"
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300 placeholder:text-slate-400"
                />
                {errors.translator && (
                  <p className="text-xs text-red-500">
                    {errors.translator.message}
                  </p>
                )}
              </div>

              {/* Verses */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Number of Verses *
                </label>
                <Input
                  type="number"
                  {...register("verses", {
                    required: "Verses required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Must be greater than 0",
                    },
                  })}
                  className="bg-slate-50 border-0 h-11 focus-visible:ring-1 focus-visible:ring-slate-300"
                />
                {errors.verses && (
                  <p className="text-xs text-red-500">
                    {errors.verses.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="flex h-11 w-full rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1em",
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-lg font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0B0F19] hover:bg-slate-800 text-white rounded-lg font-medium"
                >
                  Add Translation
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
