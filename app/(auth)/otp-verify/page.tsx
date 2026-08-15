import { Suspense } from "react";
import OtpVerifyForm from "@/components/auth/otp-verify/otp-verify-form";

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <OtpVerifyForm />
    </Suspense>
  );
}
