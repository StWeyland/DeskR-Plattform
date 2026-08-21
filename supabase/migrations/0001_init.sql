-- DeskR-Plattform — Initial-Schema
-- Ausführung: manuell im Supabase-Dashboard (SQL Editor) einfügen und ausführen.
-- Region beim Projekt-Anlegen: EU (Frankfurt).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Hilfsfunktionen für RLS
-- ---------------------------------------------------------------------------

-- Admin-Kennzeichnung läuft über app_metadata.role = 'admin' im Auth-User
-- (wird per Service-Role-Key gesetzt, z. B. einmalig für Stefanies Account):
--   update auth.users set raw_app_meta_data =
--     raw_app_meta_data || '{"role":"admin"}'::jsonb
--   where email = 'stefanie@desk-revolution.de';
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Liefert die assistenzen.id des aktuell eingeloggten Users (falls vorhanden).
create or replace function public.current_assistenz_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.assistenzen where user_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Tabellen
-- ---------------------------------------------------------------------------

create table if not exists public.programme (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titel text not null,
  untertitel text,
  beschreibung text,
  status text not null default 'in_aufbau' check (status in ('aktiv', 'in_aufbau', 'kostenlos')),
  reihenfolge int not null default 0,
  -- Teaser: Programm wird nicht zugeordneten Assistenzen als Werbe-Kachel angezeigt
  teaser_aktiv boolean not null default false,
  preis_anzeigen boolean not null default false,
  preis_cent int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  programm_id uuid not null references public.programme(id) on delete cascade,
  titel text not null,
  beschreibung text,
  reihenfolge int not null default 0,
  veroeffentlicht boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sessions_programm_id_idx on public.sessions(programm_id);

create table if not exists public.session_material (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  typ text not null check (typ in ('video', 'workbook', 'datei', 'link')),
  titel text not null,
  url text,
  reihenfolge int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists session_material_session_id_idx on public.session_material(session_id);

create table if not exists public.assistenzen (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique,
  name text,
  eingeladen_am timestamptz not null default now(),
  erstellt_am timestamptz not null default now()
);

create table if not exists public.assistenz_programme (
  id uuid primary key default gen_random_uuid(),
  assistenz_id uuid not null references public.assistenzen(id) on delete cascade,
  programm_id uuid not null references public.programme(id) on delete cascade,
  zugeordnet_am timestamptz not null default now(),
  unique (assistenz_id, programm_id)
);
create index if not exists assistenz_programme_assistenz_id_idx on public.assistenz_programme(assistenz_id);
create index if not exists assistenz_programme_programm_id_idx on public.assistenz_programme(programm_id);

create table if not exists public.assistenz_status (
  id uuid primary key default gen_random_uuid(),
  assistenz_id uuid not null references public.assistenzen(id) on delete cascade,
  session_id uuid not null references public.sessions(id) on delete cascade,
  status text not null default 'offen' check (status in ('offen', 'in_bearbeitung', 'abgeschlossen')),
  aktualisiert_am timestamptz not null default now(),
  unique (assistenz_id, session_id)
);
create index if not exists assistenz_status_assistenz_id_idx on public.assistenz_status(assistenz_id);
create index if not exists assistenz_status_session_id_idx on public.assistenz_status(session_id);

-- ---------------------------------------------------------------------------
-- updated_at-Trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.programme;
create trigger set_updated_at before update on public.programme
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.sessions;
create trigger set_updated_at before update on public.sessions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.programme enable row level security;
alter table public.sessions enable row level security;
alter table public.session_material enable row level security;
alter table public.assistenzen enable row level security;
alter table public.assistenz_programme enable row level security;
alter table public.assistenz_status enable row level security;

-- programme: alle eingeloggten Nutzer dürfen lesen (Teaser-Kacheln brauchen
-- Titel/Preis auch für nicht zugeordnete Programme); nur Admin schreibt.
create policy "programme_select_authenticated" on public.programme
  for select to authenticated using (true);
create policy "programme_write_admin" on public.programme
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- sessions: sichtbar für Admin, oder für zugeordnete + veröffentlichte Sessions.
create policy "sessions_select" on public.sessions
  for select to authenticated using (
    public.is_admin()
    or (
      veroeffentlicht
      and exists (
        select 1 from public.assistenz_programme ap
        where ap.programm_id = sessions.programm_id
          and ap.assistenz_id = public.current_assistenz_id()
      )
    )
  );
create policy "sessions_write_admin" on public.sessions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- session_material: gleiche Sichtbarkeitsregel wie die zugehörige Session.
create policy "session_material_select" on public.session_material
  for select to authenticated using (
    public.is_admin()
    or exists (
      select 1 from public.sessions s
      join public.assistenz_programme ap on ap.programm_id = s.programm_id
      where s.id = session_material.session_id
        and s.veroeffentlicht
        and ap.assistenz_id = public.current_assistenz_id()
    )
  );
create policy "session_material_write_admin" on public.session_material
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- assistenzen: Admin sieht/verwaltet alle, Assistenz sieht nur sich selbst.
create policy "assistenzen_select_own_or_admin" on public.assistenzen
  for select to authenticated using (public.is_admin() or user_id = auth.uid());
create policy "assistenzen_update_own" on public.assistenzen
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "assistenzen_write_admin" on public.assistenzen
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- assistenz_programme: Admin verwaltet Zuordnungen, Assistenz sieht eigene.
create policy "assistenz_programme_select_own_or_admin" on public.assistenz_programme
  for select to authenticated using (
    public.is_admin() or assistenz_id = public.current_assistenz_id()
  );
create policy "assistenz_programme_write_admin" on public.assistenz_programme
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- assistenz_status: Assistenz verwaltet ihren eigenen Fortschritt, Admin sieht alles.
create policy "assistenz_status_select_own_or_admin" on public.assistenz_status
  for select to authenticated using (
    public.is_admin() or assistenz_id = public.current_assistenz_id()
  );
create policy "assistenz_status_write_own" on public.assistenz_status
  for insert to authenticated with check (assistenz_id = public.current_assistenz_id());
create policy "assistenz_status_update_own" on public.assistenz_status
  for update to authenticated using (assistenz_id = public.current_assistenz_id())
  with check (assistenz_id = public.current_assistenz_id());
create policy "assistenz_status_write_admin" on public.assistenz_status
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
