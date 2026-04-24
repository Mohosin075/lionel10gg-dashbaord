import { AuthLayout } from "@/components/auth/auth-layout";
import ForgotPasswordForm from "@/components/auth/ForgotPassword/ForgotPasswordForm";
import React from "react";

export default function ForgotPassword() {
  return (
    <div>
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </div>
  );
}
