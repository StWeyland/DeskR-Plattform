"use client";

import { useActionState } from "react";
import { setPassword, type SetPasswordState } from "./actions";

const initialState: SetPasswordState = { error: null };

export function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(setPassword, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-xl font-medium">Passwort festlegen</h1>
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
          className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
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
          className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? "Speichern…" : "Passwort speichern"}
      </button>
    </form>
  );
}
