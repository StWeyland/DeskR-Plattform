import { redirect } from "next/navigation";
import { ProgressRing } from "@/components/progress-ring";
import { ProgrammCard, TeaserCard } from "@/components/programm-card";
import {
  getAktuelleAssistenz,
  getTeaserProgramme,
  getZugeordneteProgrammeMitFortschritt,
} from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const assistenz = await getAktuelleAssistenz();
  if (!assistenz) redirect("/login");

  const programme = await getZugeordneteProgrammeMitFortschritt(assistenz.id);
  const teaser = await getTeaserProgramme(programme.map((p) => p.id));

  const gesamtSessions = programme.reduce((sum, p) => sum + p.sessionsGesamt, 0);
  const gesamtAbgeschlossen = programme.reduce((sum, p) => sum + p.sessionsAbgeschlossen, 0);
  const gesamtProzent = gesamtSessions > 0 ? (gesamtAbgeschlossen / gesamtSessions) * 100 : 0;

  return (
    <div className="space-y-10">
      <section className="flex items-center justify-between rounded-lg border border-surface-border bg-surface p-6">
        <div>
          <p className="text-sm text-muted">Willkommen zurück</p>
          <h1 className="mt-1 text-2xl font-semibold">
            {assistenz.name ?? assistenz.email}
          </h1>
        </div>
        <ProgressRing prozent={gesamtProzent} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
          Deine Programme
        </h2>
        {programme.length === 0 ? (
          <p className="text-sm text-muted">
            Dir ist noch kein Programm zugeordnet. Melde dich bei deinem Ansprechpartner.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {programme.map((p) => (
              <ProgrammCard key={p.id} programm={p} />
            ))}
          </div>
        )}
      </section>

      {teaser.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
            Der nächste Schritt
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {teaser.map((p) => (
              <TeaserCard key={p.id} programm={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
