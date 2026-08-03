"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const {
    register,
    handleSubmit,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",      
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const res = await forgetPassword({ email: data.email }).unwrap();
      if (res.success) {
        toast.success(res.message || "OTP sent to your email");
        router.push(`/otp-verify?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };


  return (
    <div className="w-full  rounded-lg bg-white md:px-8 py-10 ">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-900">
        Forgot Password
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-base text-black">
        Secure access to system administration
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label className="text-base font-medium text-gray-700">
            Email address
          </Label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-14 text-lg rounded-md"
            {...register("email", {
              required: "Email is required",
            })}
          />
        </div>
      

        {/* Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-14 text-lg w-full rounded-lg bg-[#0F3D2E] text-white hover:bg-[#0c3326]"
        >
          {isLoading ? "Sending..." : "Next"}
        </Button>
      </form>
    </div>
  );
}