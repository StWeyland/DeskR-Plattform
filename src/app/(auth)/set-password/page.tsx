import { AuthSplitLayout } from "@/components/auth-split-layout";
import { SetPasswordForm } from "./set-password-form";

export default function SetPasswordPage() {
  return (
    <AuthSplitLayout>
      <SetPasswordForm />
    </AuthSplitLayout>
  );
}
