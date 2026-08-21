"use client";

import { useActionState } from "react";
import { setPassword, type SetPasswordState } from "./actions";

const initialState: SetPasswordState = { error: null };

export function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(setPassword, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="eyebrow mb-2">Willkommen bei Desk R.</p>
        <h1 className="font-serif text-3xl text-burgundy">Passwort festlegen</h1>
      </div>
      <p className="text-sm text-muted">
        Lege dein Passwort fest, um deinen Zugang zur Desk R.-Plattform zu aktivieren.
      </p>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm text-muted">
          Neues Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password_confirm" className="text-sm text-muted">
          Passwort bestätigen
        </label>
        <input
          id="password_confirm"
          name="password_confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Speichern…" : "Passwort speichern"}
      </button>
    </form>
  );
}
