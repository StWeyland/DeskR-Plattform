import Link from "next/link";
import type { ProgrammMitFortschritt } from "@/lib/data/dashboard";
import type { Programm } from "@/lib/types/database";

export function ProgrammCard({ programm }: { programm: ProgrammMitFortschritt }) {
  const prozent =
    programm.sessionsGesamt > 0
      ? Math.round((programm.sessionsAbgeschlossen / programm.sessionsGesamt) * 100)
      : 0;

  return (
    <Link
      href={`/programme/${programm.slug}`}
      className="block rounded-lg border border-surface-border bg-surface p-5 transition hover:border-accent"
    >
      <h3 className="font-medium">{programm.titel}</h3>
      {programm.untertitel && (
        <p className="mt-1 text-sm text-muted">{programm.untertitel}</p>
      )}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-border">
        <div className="h-full rounded-full bg-accent" style={{ width: `${prozent}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted">
        {programm.sessionsAbgeschlossen} von {programm.sessionsGesamt} Sessions abgeschlossen
      </p>
    </Link>
  );
}

export function TeaserCard({ programm }: { programm: Programm }) {
  return (
    <div className="relative block rounded-lg border border-dashed border-surface-border bg-surface/50 p-5">
      <span className="mb-2 inline-block rounded-full bg-surface-border px-2 py-0.5 text-xs text-muted">
        Nächste Stufe
      </span>
      <h3 className="font-medium text-muted">{programm.titel}</h3>
      {programm.untertitel && (
        <p className="mt-1 text-sm text-muted/70">{programm.untertitel}</p>
      )}
      {programm.preis_anzeigen && programm.preis_cent != null && (
        <p className="mt-3 text-sm">
          {(programm.preis_cent / 100).toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
          })}
        </p>
      )}
      <a
        href={`https://desk-revolution.de/${programm.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-accent underline underline-offset-2"
      >
        Mehr erfahren
      </a>
    </div>
  );
}
