"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";

type ResetPasswordValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<ResetPasswordValues>();

  const onSubmit = async (data: ResetPasswordValues) => {
    const token = sessionStorage.getItem("resetToken");
    if (!token) {
      toast.error("Reset session expired. Please verify OTP again.");
      router.push("/forgot-password");
      return;
    }

    try {
      const res = await resetPassword({
        token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Password reset successfully");
        sessionStorage.removeItem("resetToken");
        router.push("/login");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full rounded-lg bg-white md:px-8 py-10 ">
      <h1 className="text-3xl font-semibold text-gray-900">Reset Password</h1>
      <p className="mt-2 text-base text-black">
        Please set your strong new password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-medium text-gray-700">
            New password
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="h-14 text-lg rounded-md pr-12"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium text-gray-700">
            Confirm new password
          </Label>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              className="h-14 text-lg! rounded-md pr-12"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-14 text-lg w-full rounded-lg bg-[#0F3D2E] text-white hover:bg-[#0c3326]"
        >
          {isLoading ? "Saving..." : "Set"}
        </Button>
      </form>
    </div>
  );
}
