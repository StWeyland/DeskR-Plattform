import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "../actions";

export default async function AdminProgrammDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: programm } = await supabase.from("programme").select("*").eq("id", id).maybeSingle();
  if (!programm) notFound();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("programm_id", id)
    .order("reihenfolge");

  const createSessionForProgramm = createSession.bind(null, id);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-burgundy">{programm.titel}</h1>
        <p className="mt-1 text-sm text-muted">/{programm.slug}</p>
      </div>

      <section className="space-y-4">
        <h2 className="eyebrow">Sessions</h2>
        <div className="divide-y divide-surface-border rounded-lg border border-surface-border bg-surface">
          {(sessions ?? []).map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3">
              <span>{s.titel}</span>
              <span className="text-xs text-muted">
                {s.veroeffentlicht ? "Veröffentlicht" : "Entwurf"}
              </span>
            </div>
          ))}
          {(!sessions || sessions.length === 0) && (
            <p className="px-5 py-4 text-sm text-muted">Noch keine Sessions.</p>
          )}
        </div>

        <form action={createSessionForProgramm} className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-sm text-muted" htmlFor="titel">
              Neue Session
            </label>
            <input
              id="titel"
              name="titel"
              required
              className="rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" name="veroeffentlicht" className="accent-accent" />
            Sofort veröffentlichen
          </label>
          <button type="submit" className="btn-primary">
            Hinzufügen
          </button>
        </form>
      </section>
    </div>
  );
}
