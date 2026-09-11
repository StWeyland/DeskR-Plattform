"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function inviteAssistenz(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;
  if (!email) return;

  const admin = createAdminClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/set-password`;

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (error) {
    // Nutzer existiert evtl. schon im Auth-System — trotzdem in assistenzen anlegen,
    // falls noch kein zugehöriger Eintrag existiert.
    console.error("Invite fehlgeschlagen:", error.message);
    return;
  }

  const supabase = await createClient();
  await supabase.from("assistenzen").insert({
    email,
    name,
    user_id: data.user?.id ?? null,
  });

  revalidatePath("/admin/assistenzen");
}

export async function resendInvite(email: string) {
  const admin = createAdminClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/set-password`;
  await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
  revalidatePath("/admin/assistenzen");
}

export async function deleteAssistenz(assistenzId: string, userId: string | null) {
  const supabase = await createClient();
  await supabase.from("assistenzen").delete().eq("id", assistenzId);

  if (userId) {
    const admin = createAdminClient();
    await admin.auth.admin.deleteUser(userId);
  }

  revalidatePath("/admin/assistenzen");
}

export async function assignProgramm(assistenzId: string, formData: FormData) {
  const programmId = String(formData.get("programm_id") ?? "");
  if (!programmId) return;

  const supabase = await createClient();
  await supabase
    .from("assistenz_programme")
    .upsert(
      { assistenz_id: assistenzId, programm_id: programmId },
      { onConflict: "assistenz_id,programm_id" },
    );

  revalidatePath("/admin/assistenzen");
}
