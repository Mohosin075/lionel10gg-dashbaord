import { AuthLayout } from "@/components/auth/auth-layout";
import OtpVerify from "@/components/auth/otp-verify/otp-verify-form";

export default function page() {
  return <div><AuthLayout>
    <OtpVerify />
    </AuthLayout></div>;
}