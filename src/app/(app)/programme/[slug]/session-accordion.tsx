"use client";

import { useTransition } from "react";
import type { SessionMitMaterial } from "@/lib/data/programm-detail";
import type { AssistenzStatusWert } from "@/lib/types/database";
import { setSessionStatus } from "./actions";

const STATUS_LABEL: Record<AssistenzStatusWert, string> = {
  offen: "Offen",
  in_bearbeitung: "In Bearbeitung",
  abgeschlossen: "Abgeschlossen",
};

const MATERIAL_LABEL: Record<string, string> = {
  video: "Video",
  workbook: "Workbook",
  datei: "Datei",
  link: "Link",
};

export function SessionAccordion({
  sessions,
  slug,
}: {
  sessions: SessionMitMaterial[];
  slug: string;
}) {
  return (
    <div className="divide-y divide-surface-border rounded-lg border border-surface-border bg-surface">
      {sessions.map((session) => (
        <details key={session.id} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <span className="font-medium">{session.titel}</span>
            <span className="text-xs text-muted">{STATUS_LABEL[session.status]}</span>
          </summary>
          <div className="mt-3 space-y-3">
            {session.beschreibung && (
              <p className="text-sm text-muted">{session.beschreibung}</p>
            )}
            {session.material.length > 0 && (
              <ul className="space-y-1">
                {session.material.map((m) => (
                  <li key={m.id} className="text-sm">
                    <a
                      href={m.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-2"
                    >
                      {MATERIAL_LABEL[m.typ] ?? m.typ}: {m.titel}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <StatusSelect sessionId={session.id} status={session.status} slug={slug} />
          </div>
        </details>
      ))}
    </div>
  );
}

function StatusSelect({
  sessionId,
  status,
  slug,
}: {
  sessionId: string;
  status: AssistenzStatusWert;
  slug: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as AssistenzStatusWert;
        startTransition(() => {
          void setSessionStatus(sessionId, next, slug);
        });
      }}
      className="rounded-md border border-surface-border bg-background px-2 py-1 text-sm"
    >
      {Object.entries(STATUS_LABEL).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
