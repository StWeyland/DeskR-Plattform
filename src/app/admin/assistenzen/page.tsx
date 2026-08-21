import { createClient } from "@/lib/supabase/server";
import { assignProgramm, inviteAssistenz } from "./actions";

export default async function AdminAssistenzenPage() {
  const supabase = await createClient();

  const [{ data: assistenzen }, { data: programme }, { data: zuordnungen }] = await Promise.all([
    supabase.from("assistenzen").select("*").order("erstellt_am", { ascending: false }),
    supabase.from("programme").select("*").order("reihenfolge"),
    supabase.from("assistenz_programme").select("*"),
  ]);

  const programmeById = new Map((programme ?? []).map((p) => [p.id, p]));

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-3xl text-burgundy">Assistenzen</h1>

      <form action={inviteAssistenz} className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-sm text-muted" htmlFor="email">
            E-Mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted" htmlFor="name">
            Name (optional)
          </label>
          <input
            id="name"
            name="name"
            className="rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary">
          Einladen
        </button>
      </form>

      <div className="divide-y divide-surface-border rounded-lg border border-surface-border bg-surface">
        {(assistenzen ?? []).map((a) => {
          const zugeordnetIds = (zuordnungen ?? [])
            .filter((z) => z.assistenz_id === a.id)
            .map((z) => z.programm_id);
          const assignProgrammForAssistenz = assignProgramm.bind(null, a.id);

          return (
            <div key={a.id} className="space-y-2 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-lg text-burgundy">{a.name ?? a.email}</p>
                  <p className="text-sm text-muted">{a.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {zugeordnetIds.map((pid) => (
                  <span
                    key={pid}
                    className="rounded-full bg-surface-border px-2 py-0.5 text-xs"
                  >
                    {programmeById.get(pid)?.titel ?? pid}
                  </span>
                ))}
                <form action={assignProgrammForAssistenz} className="flex items-center gap-2">
                  <select
                    name="programm_id"
                    className="rounded-md border border-surface-border bg-background px-2 py-1 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Programm zuordnen…
                    </option>
                    {(programme ?? [])
                      .filter((p) => !zugeordnetIds.includes(p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.titel}
                        </option>
                      ))}
                  </select>
                  <button type="submit" className="text-xs text-accent underline underline-offset-2">
                    Zuordnen
                  </button>
                </form>
              </div>
            </div>
          );
        })}
        {(!assistenzen || assistenzen.length === 0) && (
          <p className="px-5 py-6 text-sm text-muted">Noch keine Assistenzen eingeladen.</p>
        )}
      </div>
    </div>
  );
}
