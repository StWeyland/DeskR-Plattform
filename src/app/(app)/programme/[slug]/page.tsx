import { notFound, redirect } from "next/navigation";
import { getAktuelleAssistenz } from "@/lib/data/dashboard";
import { getProgrammMitSessions } from "@/lib/data/programm-detail";
import { SessionAccordion } from "./session-accordion";

export default async function ProgrammDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const assistenz = await getAktuelleAssistenz();
  if (!assistenz) redirect("/login");

  const data = await getProgrammMitSessions(slug, assistenz.id);
  if (!data) notFound();

  const { programm, sessions } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-burgundy">{programm.titel}</h1>
        {programm.untertitel && <p className="mt-1 text-muted">{programm.untertitel}</p>}
      </div>
      {sessions.length === 0 ? (
        <p className="text-sm text-muted">
          Für dieses Programm sind noch keine Sessions veröffentlicht.
        </p>
      ) : (
        <SessionAccordion sessions={sessions} slug={slug} />
      )}
    </div>
  );
}
