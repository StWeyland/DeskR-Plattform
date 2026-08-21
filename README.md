# Desk R. — Plattform

Kurs-/Mitgliederplattform für Desk Revolution (Stefanie Weyland). Next.js (App Router) +
Supabase, eigenständiges Setup (kein gemeinsames Projekt mit MRH-Coaching).

## Status

- [x] Next.js + Tailwind + Supabase-Grundgerüst
- [x] Auth-Flow (Login, Passwort setzen nach Einladung), Session-Refresh via Middleware/Proxy
- [x] Admin-Bereich: Programme anlegen, Sessions anlegen, Assistenzen einladen & zuordnen
- [x] Assistenz-Bereich: Dashboard mit Fortschritts-Ring, Programmkarten, Teaser-Kacheln,
      Programm-Detailseite mit Session-Akkordeon + eigenem Bearbeitungsstatus
- [x] SQL-Migration für die 6 Kern-Tabellen + RLS + Teaser-Felder
      (`supabase/migrations/0001_init.sql`)
- [x] Branding von desk-revolution.de: Farbpalette + Typografie (League Spartan / Playfair
      Display) 1:1 übernommen (`src/app/globals.css`), Porträtfoto extern eingebunden
      (`next.config.ts` erlaubt `desk-revolution.de` als Bildquelle)
- [ ] Supabase-Verbindungstest (Kickoff Abschnitt 0.1.3) — noch nicht von mir selbst
      verifiziert. Der Netzwerkzugriff aus dieser Entwicklungsumgebung war zum Testzeitpunkt
      für alle externen Domains blockiert (nicht nur Supabase) — vermutlich eine
      Session-übergreifende Egress-Policy, die erst bei einer neu gestarteten Session greift.
      Vercel-Deployment ist laut Rückmeldung grün; bitte bei Gelegenheit selbst gegenprüfen.
- [ ] SMTP (hallo@desk-revolution.de) — noch nicht eingerichtet
- [ ] Phase 2 (Stripe) — bewusst noch nicht begonnen

## Setup

```bash
npm install
cp .env.example .env.local   # Werte ausfüllen, siehe unten
npm run dev
```

### Umgebungsvariablen

Siehe `.env.example`. Exakte Namen, wie sie der Code erwartet:

| Variable | Verwendung |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Nur serverseitig — Assistenz-Invites, Admin-Aktionen |
| `NEXT_PUBLIC_APP_URL` | Basis-URL der App (für Invite-/Passwort-Links) |
| `SMTP_*` | Für spätere SMTP-Anbindung (hallo@desk-revolution.de) |

**Wichtig (bekannte MRH-Stolperfalle):** Alle Variablen in Vercel für **alle drei**
Umgebungen (Production, Preview, Development) hinterlegen.

### Datenbank

Migration liegt unter `supabase/migrations/0001_init.sql`. Bitte **manuell** im
Supabase-Dashboard (SQL Editor) ausführen — nicht automatisiert, wie im Kickoff-Auftrag
festgelegt.

Nach dem ersten Login von Stefanies eigenem Account muss dieser einmalig als Admin markiert
werden (Migration enthält den Hinweis dazu):

```sql
update auth.users set raw_app_meta_data =
  raw_app_meta_data || '{"role":"admin"}'::jsonb
where email = 'stefanie@desk-revolution.de'; -- echte Admin-E-Mail eintragen
```

### Supabase Auth-Einstellungen

Site URL und Redirect URLs im Supabase-Dashboard beim ersten Produktiv-Deployment auf die
echte Domain setzen (nicht auf localhost stehen lassen — bekannte MRH-Stolperfalle).

## Struktur

- `src/app/(auth)/` — Login, Passwort setzen (Zweispalten-Layout)
- `src/app/(app)/` — Assistenz-Bereich (Dashboard, Programm-Detail)
- `src/app/admin/` — Admin-Bereich (Programme, Sessions, Assistenzen)
- `src/lib/supabase/` — Browser-/Server-/Admin-Clients, Session-Refresh
- `src/lib/types/database.ts` — DB-Typen (spiegeln die Migration)
- `supabase/migrations/` — SQL-Migrationen, manuell auszuführen
