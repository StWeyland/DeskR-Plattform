"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="eyebrow mb-2">Mitglieder-Login</p>
        <h1 className="font-serif text-3xl text-burgundy">Anmelden</h1>
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-muted">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm text-muted">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Anmelden…" : "Anmelden"}
      </button>
    </form>
  );
}
