import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  aktiv: "Aktiv",
  in_aufbau: "In Aufbau",
  kostenlos: "Kostenlos",
};

export default async function AdminProgrammeListPage() {
  const supabase = await createClient();
  const { data: programme } = await supabase.from("programme").select("*").order("reihenfolge");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Programme</h1>
        <Link
          href="/admin/programme/neu"
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
        >
          Neues Programm
        </Link>
      </div>

      <div className="divide-y divide-surface-border rounded-lg border border-surface-border bg-surface">
        {(programme ?? []).map((p) => (
          <Link
            key={p.id}
            href={`/admin/programme/${p.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-background/40"
          >
            <div>
              <p className="font-medium">{p.titel}</p>
              <p className="text-sm text-muted">/{p.slug}</p>
            </div>
            <span className="text-xs text-muted">{STATUS_LABEL[p.status] ?? p.status}</span>
          </Link>
        ))}
        {(!programme || programme.length === 0) && (
          <p className="px-5 py-6 text-sm text-muted">Noch keine Programme angelegt.</p>
        )}
      </div>
    </div>
  );
}
