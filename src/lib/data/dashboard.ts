import { createClient } from "@/lib/supabase/server";
import type { Programm } from "@/lib/types/database";

export interface ProgrammMitFortschritt extends Programm {
  sessionsGesamt: number;
  sessionsAbgeschlossen: number;
}

export async function getAktuelleAssistenz() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: assistenz } = await supabase
    .from("assistenzen")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return assistenz;
}

export async function getZugeordneteProgrammeMitFortschritt(
  assistenzId: string,
): Promise<ProgrammMitFortschritt[]> {
  const supabase = await createClient();

  const { data: zuordnungen } = await supabase
    .from("assistenz_programme")
    .select("programm_id, programme(*)")
    .eq("assistenz_id", assistenzId);

  const programme = (zuordnungen ?? [])
    .map((z) => z.programme)
    .filter((p): p is Programm => Boolean(p));

  const result: ProgrammMitFortschritt[] = [];
  for (const programm of programme) {
    const { data: sessions } = await supabase
      .from("sessions")
      .select("id")
      .eq("programm_id", programm.id)
      .eq("veroeffentlicht", true);

    const sessionIds = (sessions ?? []).map((s) => s.id);
    let abgeschlossen = 0;
    if (sessionIds.length > 0) {
      const { count } = await supabase
        .from("assistenz_status")
        .select("id", { count: "exact", head: true })
        .eq("assistenz_id", assistenzId)
        .eq("status", "abgeschlossen")
        .in("session_id", sessionIds);
      abgeschlossen = count ?? 0;
    }

    result.push({
      ...programm,
      sessionsGesamt: sessionIds.length,
      sessionsAbgeschlossen: abgeschlossen,
    });
  }

  return result.sort((a, b) => a.reihenfolge - b.reihenfolge);
}

export async function getTeaserProgramme(ausgeschlosseneIds: string[]): Promise<Programm[]> {
  const supabase = await createClient();
  let query = supabase.from("programme").select("*").eq("teaser_aktiv", true);

  if (ausgeschlosseneIds.length > 0) {
    query = query.not("id", "in", `(${ausgeschlosseneIds.join(",")})`);
  }

  const { data } = await query.order("reihenfolge");
  return data ?? [];
}
