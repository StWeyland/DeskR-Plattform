import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "./actions";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-serif text-xl tracking-tight text-burgundy">
            Desk R.
          </Link>
          <form action={signOut}>
            <button type="submit" className="btn-ghost text-xs">
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
