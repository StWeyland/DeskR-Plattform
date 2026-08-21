"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error: string | null;
}

export async function signIn(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("signInWithPassword fehlgeschlagen:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  redirect("/dashboard");
}
