import { createClient } from "@/lib/supabase/server";
import type { AssistenzStatusWert, SessionMaterial } from "@/lib/types/database";

export interface SessionMitMaterial {
  id: string;
  titel: string;
  beschreibung: string | null;
  reihenfolge: number;
  bild_url: string | null;
  material: SessionMaterial[];
  status: AssistenzStatusWert;
}

export async function getProgrammMitSessions(slug: string, assistenzId: string) {
  const supabase = await createClient();

  const { data: programm } = await supabase
    .from("programme")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!programm) return null;

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, session_material(*)")
    .eq("programm_id", programm.id)
    .eq("veroeffentlicht", true)
    .order("reihenfolge");

  const { data: statusRows } = await supabase
    .from("assistenz_status")
    .select("*")
    .eq("assistenz_id", assistenzId);

  const statusMap = new Map(statusRows?.map((s) => [s.session_id, s.status]));

  const sessionsMitMaterial: SessionMitMaterial[] = (sessions ?? []).map((s) => ({
    id: s.id,
    titel: s.titel,
    beschreibung: s.beschreibung,
    reihenfolge: s.reihenfolge,
    bild_url: s.bild_url,
    material: (s.session_material ?? []) as SessionMaterial[],
    status: (statusMap.get(s.id) as AssistenzStatusWert) ?? "offen",
  }));

  return { programm, sessions: sessionsMitMaterial };
}
