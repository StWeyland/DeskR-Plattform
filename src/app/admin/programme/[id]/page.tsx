import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import {
  addMaterial,
  createSession,
  deleteMaterial,
  deleteSession,
  updateProgramm,
  updateSession,
} from "../actions";

const MATERIAL_LABEL: Record<string, string> = {
  video: "Video",
  workbook: "Workbook",
  datei: "Datei",
  link: "Link",
};

export default async function AdminProgrammDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: programm } = await supabase.from("programme").select("*").eq("id", id).maybeSingle();
  if (!programm) notFound();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, session_material(*)")
    .eq("programm_id", id)
    .order("reihenfolge");

  const createSessionForProgramm = createSession.bind(null, id);
  const updateProgrammForProgramm = updateProgramm.bind(null, id);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-burgundy">{programm.titel}</h1>
        <p className="mt-1 text-sm text-muted">/{programm.slug}</p>
      </div>

      <details className="rounded-lg border border-surface-border bg-surface">
        <summary className="cursor-pointer px-5 py-3 text-sm font-medium">
          Programm bearbeiten
        </summary>
        <form action={updateProgrammForProgramm} className="space-y-4 px-5 pb-5 pt-2">
          <Field label="Titel" name="titel" defaultValue={programm.titel} required />
          <Field label="Untertitel" name="untertitel" defaultValue={programm.untertitel ?? ""} />
          <div className="space-y-1">
            <label className="text-sm text-muted" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={programm.status}
              className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm"
            >
              <option value="in_aufbau">In Aufbau</option>
              <option value="aktiv">Aktiv</option>
              <option value="kostenlos">Kostenlos</option>
            </select>
          </div>
          <Field
            label="Preis in Euro (optional)"
            name="preis_euro"
            type="number"
            defaultValue={programm.preis_cent != null ? String(programm.preis_cent / 100) : ""}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="teaser_aktiv"
              defaultChecked={programm.teaser_aktiv}
              className="accent-accent"
            />
            Als Teaser für nicht zugeordnete Assistenzen anzeigen
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="preis_anzeigen"
              defaultChecked={programm.preis_anzeigen}
              className="accent-accent"
            />
            Preis auf dem Teaser anzeigen
          </label>
          <button type="submit" className="btn-primary">
            Speichern
          </button>
        </form>
      </details>

      <section className="space-y-4">
        <h2 className="eyebrow">Sessions</h2>
        <div className="space-y-3">
          {(sessions ?? []).map((s) => {
            const updateSessionForSession = updateSession.bind(null, s.id, id);
            const deleteSessionForSession = deleteSession.bind(null, s.id, id);
            const addMaterialForSession = addMaterial.bind(null, s.id, id);

            return (
              <details
                key={s.id}
                className="rounded-lg border border-surface-border bg-surface"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-3">
                  <span className="text-sm font-medium">{s.titel}</span>
                  <span className="text-xs text-muted">
                    {s.veroeffentlicht ? "Veröffentlicht" : "Entwurf"}
                  </span>
                </summary>
                <div className="space-y-5 px-5 pb-5 pt-2">
                  <form action={updateSessionForSession} className="space-y-3">
                    <Field label="Titel" name="titel" defaultValue={s.titel} required />
                    <div className="space-y-1">
                      <label className="text-sm text-muted" htmlFor={`beschreibung-${s.id}`}>
                        Beschreibung
                      </label>
                      <textarea
                        id={`beschreibung-${s.id}`}
                        name="beschreibung"
                        defaultValue={s.beschreibung ?? ""}
                        rows={2}
                        className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="veroeffentlicht"
                        defaultChecked={s.veroeffentlicht}
                        className="accent-accent"
                      />
                      Veröffentlicht
                    </label>
                    <div className="flex items-center gap-4">
                      <button type="submit" className="btn-primary">
                        Speichern
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2 border-t border-surface-border pt-4">
                    <p className="text-xs font-medium text-muted">Material</p>
                    <ul className="space-y-1">
                      {(s.session_material ?? []).map((m) => {
                        const deleteMaterialForMaterial = deleteMaterial.bind(null, m.id, id);
                        return (
                          <li key={m.id} className="flex items-center justify-between text-sm">
                            <span>
                              {MATERIAL_LABEL[m.typ] ?? m.typ}: {m.titel}
                            </span>
                            <form action={deleteMaterialForMaterial}>
                              <button
                                type="submit"
                                className="text-xs text-red-700 underline underline-offset-2"
                              >
                                Entfernen
                              </button>
                            </form>
                          </li>
                        );
                      })}
                      {(!s.session_material || s.session_material.length === 0) && (
                        <li className="text-sm text-muted">Noch kein Material.</li>
                      )}
                    </ul>
                    <form
                      action={addMaterialForSession}
                      className="flex flex-wrap items-end gap-2 pt-2"
                    >
                      <select
                        name="typ"
                        defaultValue="link"
                        className="rounded-md border border-surface-border bg-background px-2 py-1.5 text-xs"
                      >
                        <option value="video">Video</option>
                        <option value="workbook">Workbook</option>
                        <option value="datei">Datei</option>
                        <option value="link">Link</option>
                      </select>
                      <input
                        name="titel"
                        placeholder="Titel"
                        required
                        className="rounded-md border border-surface-border bg-background px-2 py-1.5 text-xs"
                      />
                      <input
                        name="url"
                        placeholder="URL"
                        className="min-w-[14rem] flex-1 rounded-md border border-surface-border bg-background px-2 py-1.5 text-xs"
                      />
                      <button
                        type="submit"
                        className="text-xs text-accent underline underline-offset-2"
                      >
                        Hinzufügen
                      </button>
                    </form>
                  </div>

                  <form action={deleteSessionForSession} className="border-t border-surface-border pt-4">
                    <ConfirmSubmitButton
                      confirmMessage={`Session "${s.titel}" wirklich löschen? Damit werden auch alle Materialien und der Fortschritt der Assistenzen für diese Session gelöscht.`}
                      className="text-xs text-red-700 underline underline-offset-2"
                    >
                      Session löschen
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </details>
            );
          })}
          {(!sessions || sessions.length === 0) && (
            <p className="text-sm text-muted">Noch keine Sessions.</p>
          )}
        </div>

        <form action={createSessionForProgramm} className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-sm text-muted" htmlFor="titel">
              Neue Session
            </label>
            <input
              id="titel"
              name="titel"
              required
              className="rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" name="veroeffentlicht" className="accent-accent" />
            Sofort veröffentlichen
          </label>
          <button type="submit" className="btn-primary">
            Hinzufügen
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
