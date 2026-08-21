"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAktuelleAssistenz } from "@/lib/data/dashboard";
import type { AssistenzStatusWert } from "@/lib/types/database";

export async function setSessionStatus(
  sessionId: string,
  status: AssistenzStatusWert,
  slug: string,
) {
  const assistenz = await getAktuelleAssistenz();
  if (!assistenz) return;

  const supabase = await createClient();
  await supabase
    .from("assistenz_status")
    .upsert(
      { assistenz_id: assistenz.id, session_id: sessionId, status },
      { onConflict: "assistenz_id,session_id" },
    );

  revalidatePath(`/programme/${slug}`);
  revalidatePath("/dashboard");
}
