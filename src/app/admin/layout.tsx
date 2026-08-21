import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/data/admin-guard";
import { signOut } from "@/app/(app)/actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-semibold tracking-tight">
              Desk R. Admin
            </Link>
            <Link href="/admin/programme" className="text-sm text-muted hover:text-foreground">
              Programme
            </Link>
            <Link href="/admin/assistenzen" className="text-sm text-muted hover:text-foreground">
              Assistenzen
            </Link>
          </nav>
          <form action={signOut}>
            <button type="submit" className="text-sm text-muted hover:text-foreground">
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
