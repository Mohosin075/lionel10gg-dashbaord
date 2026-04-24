import { AuthLayout } from "@/components/auth/auth-layout";
import LoginForm from "@/components/auth/login/login-form";

export default function page() {
  return (
    <div>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </div>
  );
}
