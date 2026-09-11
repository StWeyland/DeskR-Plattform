-- DeskR-Plattform — Seed: die vier Programme aus Kickoff Abschnitt 2.1
-- Ausführung: manuell im Supabase-Dashboard (SQL Editor), nach 0001_init.sql.
-- Idempotent: mehrfaches Ausführen überschreibt nur die Basisfelder, keine Duplikate.

insert into public.programme (slug, titel, untertitel, status, reihenfolge, teaser_aktiv, preis_anzeigen)
values
  ('ki-neuling', 'KI-Neuling', 'KI-Kompass', 'kostenlos', 0, false, false),
  ('ki-anwender', 'KI-Anwender', 'Digitales Team Starter Kit', 'in_aufbau', 1, true, false),
  ('ki-team-builder', 'KI-Team Builder', 'Build Your AI Team', 'in_aufbau', 2, true, false),
  ('premium', 'Premium', 'AI Chief of Staff', 'in_aufbau', 3, true, false)
on conflict (slug) do update set
  titel = excluded.titel,
  untertitel = excluded.untertitel,
  status = excluded.status,
  reihenfolge = excluded.reihenfolge;

-- Hinweis: preis_cent und preis_anzeigen bewusst noch leer/false — Preisentscheidungen
-- stehen laut Kickoff Abschnitt 8 erst mit Phase 2 (Stripe) an. teaser_aktiv ist für
-- KI-Anwender/KI-Team Builder/Premium gesetzt, damit nicht zugeordnete Assistenzen sie
-- als "nächste Stufe" sehen; KI-Neuling ist die Einstiegsstufe und wird nicht beworben.
