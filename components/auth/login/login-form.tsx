"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { setUser } from "@/redux/slice/userSlice";
import { useDispatch } from "react-redux";

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await loginUser({
        email: data.email,
        password: data.password,
        rememberMe: data.remember,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Login successful");
        // Full API response so userSlice can read payload.data
        dispatch(setUser(res));
        const redirect = searchParams.get("redirect") || "/";
        router.push(redirect);
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full rounded-lg bg-white md:px-8 py-10 ">
      <h1 className="text-3xl font-semibold text-gray-900">Admin Login</h1>
      <p className="mt-2 text-base text-black">
        Enter your Credentials to access your dashboard
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
        <div className="space-y-2">
          <Label className="text-base font-medium text-gray-700">
            Email address
          </Label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-14 text-lg rounded-md"
            {...register("email", { required: "Email is required" })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium text-gray-700">
            Password
          </Label>
          <Input
            type="password"
            placeholder="Enter your password"
            className="h-14 text-lg rounded-md"
            {...register("password", { required: "Password is required" })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={watch("remember")}
              onCheckedChange={(value) => setValue("remember", !!value)}
            />
            <Label htmlFor="remember" className="text-base text-gray-600">
              Remember for 30 days
            </Label>
          </div>

          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-base text-blue-600 hover:underline"
          >
            forgot password
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-14 text-lg w-full rounded-lg bg-[#0F3D2E] text-white hover:bg-[#0c3326]"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
