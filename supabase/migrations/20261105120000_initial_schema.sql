-- ============================================================================
-- Portfolio Wilair Joseph — schéma, sécurité (RLS) et stockage des médias
--
-- Règle générale :
--   * le public lit uniquement ce qui est publié ;
--   * le public peut seulement ENVOYER un message de contact ;
--   * tout le reste est réservé aux comptes listés dans `admin_users`.
-- Être connecté ne suffit pas : un compte absent de `admin_users` n'a aucun droit.
-- ============================================================================

-- --- Administrateurs ---------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER : lit admin_users sans dépendre des droits de l'appelant.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --- Profil (une seule ligne) ------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique check (singleton),
  full_name text not null,
  first_name text not null,
  last_name text not null,
  specialties jsonb not null default '[]',
  location text not null default '',
  short_intro text not null default '',
  biography jsonb not null default '[]',
  focus_areas jsonb not null default '[]',
  hero_image_url text,
  hero_image_alt text,
  profile_image_url text,
  profile_image_alt text,
  phone text not null default '',
  whatsapp_number text not null default '',
  whatsapp_message text not null default '',
  email text not null default '',
  social_links jsonb not null default '[]',
  contact_invitation text not null default '',
  experiences jsonb not null default '[]',
  collaborations jsonb not null default '[]',
  education jsonb not null default '[]',
  skills jsonb not null default '[]',
  tools jsonb not null default '[]',
  languages jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- --- Services ----------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null default '',
  items jsonb not null default '[]',
  image_url text,
  image_alt text,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_public_idx on public.services (is_published, display_order);

-- --- Réalisations ------------------------------------------------------------
-- `category` n'a pas de contrainte : la liste vit dans src/data/categoriesData.js
-- et peut évoluer sans migration.
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null,
  excerpt text not null default '',
  description text not null default '',
  cover_image_url text,
  cover_image_alt text,
  video_url text,
  project_date date,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  is_archived boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_public_idx on public.projects (is_published, is_archived, category);

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image')),
  alt_text text not null default '',
  width integer check (width > 0),
  height integer check (height > 0),
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index project_media_project_idx on public.project_media (project_id, display_order);

-- --- Audios ------------------------------------------------------------------
create table public.audio_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  category text not null,
  description text not null default '',
  audio_url text not null,
  duration_seconds integer check (duration_seconds >= 0),
  recorded_on date,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index audio_tracks_public_idx on public.audio_tracks (is_published, category);

-- --- Messages de contact -----------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null check (length(trim(sender_name)) between 2 and 120),
  sender_email text not null check (length(sender_email) <= 254 and sender_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  subject text not null check (length(trim(subject)) between 3 and 160),
  message text not null check (length(trim(message)) between 20 and 5000),
  is_read boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_inbox_idx on public.contact_messages (is_archived, created_at desc);

-- --- updated_at automatique --------------------------------------------------
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger audio_tracks_updated_at before update on public.audio_tracks
  for each row execute function public.set_updated_at();

-- --- Droits d'accès aux tables -----------------------------------------------
-- On part de zéro, puis on accorde le strict nécessaire. RLS filtre ensuite les lignes.
revoke all on all tables in schema public from anon, authenticated;

grant select on public.profiles, public.services, public.projects, public.project_media, public.audio_tracks
  to anon, authenticated;
grant insert, update, delete on public.profiles, public.services, public.projects, public.project_media, public.audio_tracks
  to authenticated;

-- Le public ne peut renseigner que le contenu du message, jamais is_read / is_archived.
grant insert (sender_name, sender_email, subject, message) on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;

grant select on public.admin_users to authenticated;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- --- Row Level Security ------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.audio_tracks enable row level security;
alter table public.contact_messages enable row level security;

-- admin_users : chacun peut seulement vérifier sa propre ligne. Aucune écriture via l'API :
-- un administrateur s'ajoute depuis le SQL Editor de Supabase (voir docs/ADMIN.md).
create policy "admin_users_read_own" on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Profil : public en lecture.
create policy "profiles_public_read" on public.profiles
  for select to anon, authenticated using (true);
create policy "profiles_admin_insert" on public.profiles
  for insert to authenticated with check ((select public.is_admin()));
create policy "profiles_admin_update" on public.profiles
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "profiles_admin_delete" on public.profiles
  for delete to authenticated using ((select public.is_admin()));

-- Services : le public ne voit que les services publiés.
create policy "services_read" on public.services
  for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "services_admin_insert" on public.services
  for insert to authenticated with check ((select public.is_admin()));
create policy "services_admin_update" on public.services
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "services_admin_delete" on public.services
  for delete to authenticated using ((select public.is_admin()));

-- Réalisations : publiées et non archivées uniquement.
create policy "projects_read" on public.projects
  for select to anon, authenticated
  using ((is_published and not is_archived) or (select public.is_admin()));
create policy "projects_admin_insert" on public.projects
  for insert to authenticated with check ((select public.is_admin()));
create policy "projects_admin_update" on public.projects
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "projects_admin_delete" on public.projects
  for delete to authenticated using ((select public.is_admin()));

-- Médias d'un projet : mêmes règles que le projet parent (la sous-requête applique sa RLS).
create policy "project_media_read" on public.project_media
  for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id));
create policy "project_media_admin_insert" on public.project_media
  for insert to authenticated with check ((select public.is_admin()));
create policy "project_media_admin_update" on public.project_media
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "project_media_admin_delete" on public.project_media
  for delete to authenticated using ((select public.is_admin()));

-- Audios : le public ne voit que les audios publiés.
create policy "audio_tracks_read" on public.audio_tracks
  for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "audio_tracks_admin_insert" on public.audio_tracks
  for insert to authenticated with check ((select public.is_admin()));
create policy "audio_tracks_admin_update" on public.audio_tracks
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "audio_tracks_admin_delete" on public.audio_tracks
  for delete to authenticated using ((select public.is_admin()));

-- Messages : tout le monde peut écrire, seul l'administrateur peut lire.
create policy "contact_messages_public_insert" on public.contact_messages
  for insert to anon, authenticated with check (true);
create policy "contact_messages_admin_read" on public.contact_messages
  for select to authenticated using ((select public.is_admin()));
create policy "contact_messages_admin_update" on public.contact_messages
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "contact_messages_admin_delete" on public.contact_messages
  for delete to authenticated using ((select public.is_admin()));

-- --- Stockage des médias -----------------------------------------------------
-- Espaces publics en lecture ; type et taille contrôlés par Supabase à l'envoi.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio-images', 'portfolio-images', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp']),
  ('portfolio-audio', 'portfolio-audio', true, 52428800,
    array['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg']),
  ('portfolio-video', 'portfolio-video', true, 52428800,
    array['video/mp4', 'video/webm'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "portfolio_media_admin_read" on storage.objects
  for select to authenticated
  using (bucket_id in ('portfolio-images', 'portfolio-audio', 'portfolio-video') and (select public.is_admin()));
create policy "portfolio_media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('portfolio-images', 'portfolio-audio', 'portfolio-video') and (select public.is_admin()));
create policy "portfolio_media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('portfolio-images', 'portfolio-audio', 'portfolio-video') and (select public.is_admin()))
  with check (bucket_id in ('portfolio-images', 'portfolio-audio', 'portfolio-video') and (select public.is_admin()));
create policy "portfolio_media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('portfolio-images', 'portfolio-audio', 'portfolio-video') and (select public.is_admin()));
