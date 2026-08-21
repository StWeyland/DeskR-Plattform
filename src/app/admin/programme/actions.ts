"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProgrammStatus } from "@/lib/types/database";

export async function createProgramm(formData: FormData) {
  const titel = String(formData.get("titel") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const untertitel = String(formData.get("untertitel") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "in_aufbau") as ProgrammStatus;
  const teaserAktiv = formData.get("teaser_aktiv") === "on";
  const preisAnzeigen = formData.get("preis_anzeigen") === "on";
  const preisEuro = formData.get("preis_euro");
  const preisCent = preisEuro ? Math.round(Number(preisEuro) * 100) : null;

  if (!titel || !slug) return;

  const supabase = await createClient();
  await supabase.from("programme").insert({
    titel,
    slug,
    untertitel,
    status,
    teaser_aktiv: teaserAktiv,
    preis_anzeigen: preisAnzeigen,
    preis_cent: preisCent,
  });

  revalidatePath("/admin/programme");
  redirect("/admin/programme");
}

export async function createSession(programmId: string, formData: FormData) {
  const titel = String(formData.get("titel") ?? "").trim();
  const beschreibung = String(formData.get("beschreibung") ?? "").trim() || null;
  const veroeffentlicht = formData.get("veroeffentlicht") === "on";

  if (!titel) return;

  const supabase = await createClient();
  const { count } = await supabase
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("programm_id", programmId);

  await supabase.from("sessions").insert({
    programm_id: programmId,
    titel,
    beschreibung,
    veroeffentlicht,
    reihenfolge: count ?? 0,
  });

  revalidatePath(`/admin/programme/${programmId}`);
}
