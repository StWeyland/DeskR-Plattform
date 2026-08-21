import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ count: programmeCount }, { count: assistenzenCount }] = await Promise.all([
    supabase.from("programme").select("id", { count: "exact", head: true }),
    supabase.from("assistenzen").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-burgundy">Übersicht</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/programme"
          className="rounded-lg border border-surface-border bg-surface p-5 hover:border-accent"
        >
          <p className="text-sm text-muted">Programme</p>
          <p className="mt-1 text-3xl font-semibold">{programmeCount ?? 0}</p>
        </Link>
        <Link
          href="/admin/assistenzen"
          className="rounded-lg border border-surface-border bg-surface p-5 hover:border-accent"
        >
          <p className="text-sm text-muted">Assistenzen</p>
          <p className="mt-1 text-3xl font-semibold">{assistenzenCount ?? 0}</p>
        </Link>
      </div>
    </div>
  );
}
