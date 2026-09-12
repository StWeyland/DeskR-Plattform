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
      className="block overflow-hidden rounded-lg border border-surface-border bg-surface transition hover:border-accent"
    >
      {programm.bild_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={programm.bild_url} alt="" className="h-32 w-full object-cover" />
      )}
      <div className="p-5">
        <h3 className="font-serif text-lg text-burgundy">{programm.titel}</h3>
        {programm.untertitel && (
          <p className="mt-1 text-sm text-muted">{programm.untertitel}</p>
        )}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-border">
          <div className="h-full rounded-full bg-accent" style={{ width: `${prozent}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">
          {programm.sessionsAbgeschlossen} von {programm.sessionsGesamt} Sessions abgeschlossen
        </p>
      </div>
    </Link>
  );
}

export function TeaserCard({ programm }: { programm: Programm }) {
  return (
    <div className="relative block overflow-hidden rounded-lg border border-dashed border-surface-border bg-surface/50">
      {programm.bild_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={programm.bild_url}
          alt=""
          className="h-32 w-full object-cover opacity-70 grayscale"
        />
      )}
      <div className="p-5">
        <span className="eyebrow mb-2 inline-block">Nächste Stufe</span>
        <h3 className="font-serif text-lg text-muted">{programm.titel}</h3>
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
          className="mt-3 inline-block text-sm font-semibold text-accent underline underline-offset-2"
        >
          Mehr erfahren
        </a>
      </div>
    </div>
  );
}
