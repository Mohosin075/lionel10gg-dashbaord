"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    toast.success("Login submitted");
    console.log(data);
  };

  return (
    <div className="w-full  rounded-lg bg-white md:px-8 py-10 ">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-900">
        Admin Login
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-base text-black">
        Enter your Credentials to access your dashboard
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

        {/* Password */}
        <div className="space-y-2">
          <Label className="text-base font-medium text-gray-700">
            Password
          </Label>
          <Input
            type="password"
            placeholder="Enter your password"
            className="h-14 text-lg rounded-md"
            {...register("password", {
              required: "Password is required",
            })}
          />
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" {...register("remember")} />
            <Label
              htmlFor="remember"
              className="text-base text-gray-600"
            >
              Remember for 30 days
            </Label>
          </div>

          <button
            type="button"
            className="text-base text-blue-600 hover:underline"
          >
            forgot password
          </button>
        </div>

        {/* Button */}
        <Button
          type="submit"
          className="mt-2 h-14 text-lg w-full rounded-lg bg-[#0F3D2E] text-white hover:bg-[#0c3326]"
        >
          Login
        </Button>
      </form>
    </div>
  );
}