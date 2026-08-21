import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "./actions";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            Desk R.
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-sm text-muted hover:text-foreground">
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
