"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedienDatei } from "@/lib/supabase/storage";
import type { ProgrammStatus, SessionMaterialTyp } from "@/lib/types/database";

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

export async function updateProgramm(programmId: string, formData: FormData) {
  const titel = String(formData.get("titel") ?? "").trim();
  const untertitel = String(formData.get("untertitel") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "in_aufbau") as ProgrammStatus;
  const teaserAktiv = formData.get("teaser_aktiv") === "on";
  const preisAnzeigen = formData.get("preis_anzeigen") === "on";
  const preisEuro = formData.get("preis_euro");
  const preisCent = preisEuro ? Math.round(Number(preisEuro) * 100) : null;

  if (!titel) return;

  const supabase = await createClient();
  const bild = formData.get("bild");
  const bildUrl =
    bild instanceof File ? await uploadMedienDatei(supabase, bild, "programme") : null;

  await supabase
    .from("programme")
    .update({
      titel,
      untertitel,
      status,
      teaser_aktiv: teaserAktiv,
      preis_anzeigen: preisAnzeigen,
      preis_cent: preisCent,
      ...(bildUrl ? { bild_url: bildUrl } : {}),
    })
    .eq("id", programmId);

  revalidatePath(`/admin/programme/${programmId}`);
  revalidatePath("/admin/programme");
  revalidatePath("/dashboard");
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

export async function updateSession(
  sessionId: string,
  programmId: string,
  formData: FormData,
) {
  const titel = String(formData.get("titel") ?? "").trim();
  const beschreibung = String(formData.get("beschreibung") ?? "").trim() || null;
  const veroeffentlicht = formData.get("veroeffentlicht") === "on";

  if (!titel) return;

  const supabase = await createClient();
  const bild = formData.get("bild");
  const bildUrl =
    bild instanceof File ? await uploadMedienDatei(supabase, bild, "sessions") : null;

  await supabase
    .from("sessions")
    .update({
      titel,
      beschreibung,
      veroeffentlicht,
      ...(bildUrl ? { bild_url: bildUrl } : {}),
    })
    .eq("id", sessionId);

  revalidatePath(`/admin/programme/${programmId}`);
}

export async function deleteSession(sessionId: string, programmId: string) {
  const supabase = await createClient();
  await supabase.from("sessions").delete().eq("id", sessionId);
  revalidatePath(`/admin/programme/${programmId}`);
}

export async function addMaterial(sessionId: string, programmId: string, formData: FormData) {
  const typ = String(formData.get("typ") ?? "link") as SessionMaterialTyp;
  const titel = String(formData.get("titel") ?? "").trim();
  const urlEingabe = String(formData.get("url") ?? "").trim() || null;

  if (!titel) return;

  const supabase = await createClient();

  // Hochgeladene Datei hat Vorrang vor der eingegebenen URL.
  const datei = formData.get("datei");
  const hochgeladeneUrl =
    datei instanceof File ? await uploadMedienDatei(supabase, datei, "material") : null;
  const url = hochgeladeneUrl ?? urlEingabe;

  const { count } = await supabase
    .from("session_material")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);

  await supabase.from("session_material").insert({
    session_id: sessionId,
    typ,
    titel,
    url,
    reihenfolge: count ?? 0,
  });

  revalidatePath(`/admin/programme/${programmId}`);
}

export async function deleteMaterial(materialId: string, programmId: string) {
  const supabase = await createClient();
  await supabase.from("session_material").delete().eq("id", materialId);
  revalidatePath(`/admin/programme/${programmId}`);
}
