import { AuthSplitLayout } from "@/components/auth-split-layout";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
}
