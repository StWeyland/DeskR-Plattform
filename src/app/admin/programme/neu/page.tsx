import { createProgramm } from "../actions";

export default function NeuesProgrammPage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-serif text-3xl text-burgundy">Neues Programm</h1>
      <form action={createProgramm} className="space-y-4">
        <Field label="Titel" name="titel" required />
        <Field label="Slug (URL)" name="slug" required placeholder="ki-anwender" />
        <Field label="Untertitel" name="untertitel" />

        <div className="space-y-1">
          <label className="text-sm text-muted" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue="in_aufbau"
            className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
          >
            <option value="in_aufbau">In Aufbau</option>
            <option value="aktiv">Aktiv</option>
            <option value="kostenlos">Kostenlos</option>
          </select>
        </div>

        <Field label="Preis in Euro (optional)" name="preis_euro" type="number" />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="teaser_aktiv" className="accent-accent" />
          Als Teaser für nicht zugeordnete Assistenzen anzeigen
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="preis_anzeigen" className="accent-accent" />
          Preis auf dem Teaser anzeigen
        </label>

        <button type="submit" className="btn-primary">
          Programm anlegen
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
