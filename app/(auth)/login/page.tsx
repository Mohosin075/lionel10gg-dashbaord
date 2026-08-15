import { Suspense } from "react";
import LoginForm from "@/components/auth/login/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
