-- DeskR-Plattform — Bild- und Datei-Upload
-- Ausführung: manuell im Supabase-Dashboard (SQL Editor), nach 0001_init.sql und
-- 0002_seed_programme.sql.
-- Hinweis: ursprünglich als "0002_medien_upload.sql" angefordert, aber 0002 ist
-- bereits durch die Seed-Migration belegt — daher 0003.

alter table public.programme add column if not exists bild_url text;
alter table public.sessions add column if not exists bild_url text;

-- ---------------------------------------------------------------------------
-- Storage: öffentlicher Bucket für Programm-/Session-Bilder und Session-Material
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('programm-medien', 'programm-medien', true)
on conflict (id) do nothing;

-- storage.objects hat RLS bereits standardmäßig aktiviert (Supabase-Vorgabe).

create policy "programm_medien_select_public" on storage.objects
  for select using (bucket_id = 'programm-medien');

create policy "programm_medien_insert_admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'programm-medien' and public.is_admin());

create policy "programm_medien_update_admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'programm-medien' and public.is_admin())
  with check (bucket_id = 'programm-medien' and public.is_admin());

create policy "programm_medien_delete_admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'programm-medien' and public.is_admin());
