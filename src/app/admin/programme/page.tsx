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
        <h1 className="font-serif text-3xl text-burgundy">Programme</h1>
        <Link href="/admin/programme/neu" className="btn-primary">
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
              <p className="font-serif text-lg text-burgundy">{p.titel}</p>
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
