import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AssistenzStatusWert } from "@/lib/types/database";

const STATUS_LABEL: Record<AssistenzStatusWert, string> = {
  offen: "Offen",
  in_bearbeitung: "In Bearbeitung",
  abgeschlossen: "Abgeschlossen",
};

export default async function AdminAssistenzDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: assistenz } = await supabase
    .from("assistenzen")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!assistenz) notFound();

  const { data: zuordnungen } = await supabase
    .from("assistenz_programme")
    .select("programm_id, programme(*)")
    .eq("assistenz_id", id);

  const { data: statusRows } = await supabase
    .from("assistenz_status")
    .select("session_id, status")
    .eq("assistenz_id", id);
  const statusBySession = new Map(statusRows?.map((s) => [s.session_id, s.status]));

  const programme = (zuordnungen ?? [])
    .map((z) => z.programme)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const sessionsByProgramm = new Map<string, { id: string; titel: string; reihenfolge: number }[]>();
  if (programme.length > 0) {
    const { data: sessions } = await supabase
      .from("sessions")
      .select("id, titel, reihenfolge, programm_id")
      .in(
        "programm_id",
        programme.map((p) => p.id),
      )
      .order("reihenfolge");
    for (const s of sessions ?? []) {
      const list = sessionsByProgramm.get(s.programm_id) ?? [];
      list.push(s);
      sessionsByProgramm.set(s.programm_id, list);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-burgundy">{assistenz.name ?? assistenz.email}</h1>
        <p className="mt-1 text-sm text-muted">{assistenz.email}</p>
      </div>

      {programme.length === 0 && (
        <p className="text-sm text-muted">Noch keinem Programm zugeordnet.</p>
      )}

      {programme.map((p) => {
        const sessions = sessionsByProgramm.get(p.id) ?? [];
        const abgeschlossen = sessions.filter(
          (s) => statusBySession.get(s.id) === "abgeschlossen",
        ).length;

        return (
          <section key={p.id} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl text-burgundy">{p.titel}</h2>
              <span className="text-sm text-muted">
                {abgeschlossen} von {sessions.length} abgeschlossen
              </span>
            </div>
            <div className="divide-y divide-surface-border rounded-lg border border-surface-border bg-surface">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm">{s.titel}</span>
                  <span className="text-xs text-muted">
                    {STATUS_LABEL[(statusBySession.get(s.id) as AssistenzStatusWert) ?? "offen"]}
                  </span>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="px-5 py-4 text-sm text-muted">Noch keine Sessions.</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
