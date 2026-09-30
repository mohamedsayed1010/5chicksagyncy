-- 5CHICKS CMS — schema
-- Structured tables for every content type. Repeatable content (service items, project media,
-- slides) lives in child tables, so there is no fixed number of items anywhere.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admins & helpers
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- True when the signed-in user is listed in admin_users. SECURITY DEFINER so RLS policies can call it
-- without granting read access to admin_users itself.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Slugs: lowercase words separated by single hyphens.
create domain public.slug as text check (value ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

-- ---------------------------------------------------------------------------
-- Global settings (single row)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default '5CHICKS',
  logo_url text,
  favicon_url text,
  phone text,
  phone_display text,
  email text,
  -- International format without "+" or spaces, e.g. 201004066939 (validated again in the app).
  whatsapp_number text check (whatsapp_number is null or whatsapp_number ~ '^[1-9][0-9]{7,14}$'),
  whatsapp_message_en text,
  whatsapp_message_ar text,
  whatsapp_label_en text,
  whatsapp_label_ar text,
  whatsapp_aria_en text,
  whatsapp_aria_ar text,
  social_links jsonb not null default '[]'::jsonb check (jsonb_typeof(social_links) = 'array'),
  default_seo_title_en text,
  default_seo_title_ar text,
  default_seo_description_en text,
  default_seo_description_ar text,
  og_image_url text,
  og_image_alt_en text,
  og_image_alt_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Pages and independently editable sections
-- ---------------------------------------------------------------------------
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug public.slug not null unique,
  title_en text not null,
  title_ar text not null,
  seo_title_en text,
  seo_title_ar text,
  seo_description_en text,
  seo_description_ar text,
  og_image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- content_en / content_ar: translatable text; settings: language-independent values.
-- Each section has its own shape (defined by the dashboard's section schemas).
create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug public.slug not null references public.pages (slug) on update cascade on delete cascade,
  key public.slug not null,
  sort_order integer not null default 0,
  enabled boolean not null default true,
  content_en jsonb not null default '{}'::jsonb check (jsonb_typeof(content_en) = 'object'),
  content_ar jsonb not null default '{}'::jsonb check (jsonb_typeof(content_ar) = 'object'),
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_slug, key)
);
create index page_sections_page_order on public.page_sections (page_slug, sort_order);

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug public.slug not null unique,
  sort_order integer not null default 0,
  published boolean not null default false,
  name_en text not null,
  name_ar text not null,
  tagline_en text,
  tagline_ar text,
  description_en text,
  description_ar text,
  overview_en text,
  overview_ar text,
  color text not null default '#00ff87' check (color ~ '^#[0-9a-fA-F]{6}$'),
  icon_url text,
  hero_image_url text,
  work_link text,
  whatsapp_message_en text,
  whatsapp_message_ar text,
  seo_title_en text,
  seo_title_ar text,
  seo_description_en text,
  seo_description_ar text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index services_order on public.services (sort_order);

create type public.service_item_kind as enum ('deliverable', 'process', 'value', 'faq');

-- Unlimited deliverables, process steps, "why it matters" points and FAQs per service.
create table public.service_items (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  kind public.service_item_kind not null,
  sort_order integer not null default 0,
  title_en text not null default '',
  title_ar text not null default '',
  body_en text not null default '',
  body_ar text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index service_items_service_kind_order on public.service_items (service_id, kind, sort_order);

-- ---------------------------------------------------------------------------
-- Projects / portfolio
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug public.slug not null unique,
  sort_order integer not null default 0,
  published boolean not null default false,
  title_en text not null,
  title_ar text not null,
  description_en text,
  description_ar text,
  client text,
  category text,
  cover_url text,
  external_url text,
  service_id uuid references public.services (id) on delete set null,
  tags text[] not null default '{}',
  seo_title_en text,
  seo_title_ar text,
  seo_description_en text,
  seo_description_ar text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_order on public.projects (sort_order);
create index projects_service on public.projects (service_id);

create type public.media_kind as enum ('image', 'video', 'document');

-- Unlimited, ordered images and videos per project.
create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  sort_order integer not null default 0,
  kind public.media_kind not null check (kind in ('image', 'video')),
  url text not null,
  poster_url text,
  alt_en text,
  alt_ar text,
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index project_media_project_order on public.project_media (project_id, sort_order);

-- ---------------------------------------------------------------------------
-- Sliders / carousels (the Work collections)
-- ---------------------------------------------------------------------------
create table public.sliders (
  id uuid primary key default gen_random_uuid(),
  key public.slug not null unique,
  sort_order integer not null default 0,
  enabled boolean not null default true,
  title_en text not null,
  title_ar text not null,
  nav_label_en text,
  nav_label_ar text,
  description_en text,
  description_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.slides (
  id uuid primary key default gen_random_uuid(),
  slider_id uuid not null references public.sliders (id) on delete cascade,
  sort_order integer not null default 0,
  enabled boolean not null default true,
  title_en text not null default '',
  title_ar text not null default '',
  description_en text not null default '',
  description_ar text not null default '',
  label_en text not null default '',
  label_ar text not null default '',
  video_url text not null default '',
  image_url text not null default '',
  poster_url text not null default '',
  cta_label_en text not null default '',
  cta_label_ar text not null default '',
  cta_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slides_have_media check (video_url <> '' or image_url <> '')
);
create index slides_slider_order on public.slides (slider_id, sort_order);

-- ---------------------------------------------------------------------------
-- Clients
-- ---------------------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  enabled boolean not null default true,
  name_en text not null,
  name_ar text not null,
  logo_url text,
  url text,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index clients_order on public.clients (sort_order);

-- ---------------------------------------------------------------------------
-- Media library (metadata only — files live in Supabase Storage or the site's static /assets)
-- ---------------------------------------------------------------------------
create table public.media (
  id uuid primary key default gen_random_uuid(),
  -- 'media' for Storage uploads; 'static' for files shipped with the website under /assets.
  source text not null default 'media' check (source in ('media', 'static')),
  path text not null,
  url text not null,
  filename text not null,
  mime_type text,
  kind public.media_kind not null,
  width integer,
  height integer,
  size_bytes bigint,
  duration_seconds numeric,
  alt text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, path)
);
create index media_kind_created on public.media (kind, created_at desc);

-- ---------------------------------------------------------------------------
-- Activity log ("recent changes" on the dashboard)
-- ---------------------------------------------------------------------------
create table public.activity_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id text,
  action text not null,
  summary text,
  actor uuid,
  created_at timestamptz not null default now()
);
create index activity_log_created on public.activity_log (created_at desc);

create or replace function public.log_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rec jsonb := to_jsonb(coalesce(new, old));
begin
  insert into public.activity_log (table_name, record_id, action, summary, actor)
  values (
    tg_table_name,
    coalesce(rec ->> 'id', ''),
    lower(tg_op),
    coalesce(rec ->> 'name_en', rec ->> 'title_en', rec ->> 'key', rec ->> 'slug', rec ->> 'filename', rec ->> 'site_name'),
    auth.uid()
  );
  return coalesce(new, old);
end;
$$;

-- updated_at + activity triggers on every content table
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'pages', 'page_sections', 'services', 'service_items', 'projects',
    'project_media', 'sliders', 'slides', 'clients', 'media'
  ] loop
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
    execute format('create trigger %I_activity after insert or update or delete on public.%I for each row execute function public.log_activity()', t, t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin RPCs (run with the caller's rights, so RLS still applies; they also check is_admin()).
-- ---------------------------------------------------------------------------

-- Persist a new order for rows of an orderable table in one call.
create or replace function public.reorder_rows(p_table text, p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if p_table not in ('page_sections', 'services', 'service_items', 'projects', 'project_media', 'sliders', 'slides', 'clients') then
    raise exception 'table % cannot be reordered', p_table;
  end if;
  execute format(
    'update public.%I t set sort_order = o.ord - 1 from unnest($1) with ordinality as o(id, ord) where t.id = o.id',
    p_table
  ) using p_ids;
end;
$$;

-- Returns slug, slug-copy, slug-copy-2, ... whichever is free in the given table.
create or replace function public.next_free_slug(p_table text, p_slug text)
returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  candidate text := p_slug || '-copy';
  n integer := 1;
  taken boolean;
begin
  loop
    execute format('select exists (select 1 from public.%I where slug = $1)', p_table) into taken using candidate;
    exit when not taken;
    n := n + 1;
    candidate := p_slug || '-copy-' || n;
  end loop;
  return candidate;
end;
$$;

-- Copy a service and all of its items as an unpublished draft.
create or replace function public.duplicate_service(p_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_id uuid := gen_random_uuid();
begin
  if not public.is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  insert into public.services (
    id, slug, sort_order, published, name_en, name_ar, tagline_en, tagline_ar, description_en, description_ar,
    overview_en, overview_ar, color, icon_url, hero_image_url, work_link, whatsapp_message_en, whatsapp_message_ar,
    seo_title_en, seo_title_ar, seo_description_en, seo_description_ar, og_image_url
  )
  select new_id, public.next_free_slug('services', slug), (select coalesce(max(sort_order), 0) + 1 from public.services), false,
    name_en || ' (copy)', name_ar || ' (نسخة)', tagline_en, tagline_ar, description_en, description_ar,
    overview_en, overview_ar, color, icon_url, hero_image_url, work_link, whatsapp_message_en, whatsapp_message_ar,
    seo_title_en, seo_title_ar, seo_description_en, seo_description_ar, og_image_url
  from public.services where id = p_id;
  insert into public.service_items (service_id, kind, sort_order, title_en, title_ar, body_en, body_ar)
  select new_id, kind, sort_order, title_en, title_ar, body_en, body_ar from public.service_items where service_id = p_id;
  return new_id;
end;
$$;

-- Copy a project and all of its media as an unpublished draft.
create or replace function public.duplicate_project(p_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_id uuid := gen_random_uuid();
begin
  if not public.is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  insert into public.projects (
    id, slug, sort_order, published, title_en, title_ar, description_en, description_ar, client, category, cover_url,
    external_url, service_id, tags, seo_title_en, seo_title_ar, seo_description_en, seo_description_ar, og_image_url
  )
  select new_id, public.next_free_slug('projects', slug), (select coalesce(max(sort_order), 0) + 1 from public.projects), false,
    title_en || ' (copy)', title_ar || ' (نسخة)', description_en, description_ar, client, category, cover_url,
    external_url, service_id, tags, seo_title_en, seo_title_ar, seo_description_en, seo_description_ar, og_image_url
  from public.projects where id = p_id;
  insert into public.project_media (project_id, sort_order, kind, url, poster_url, alt_en, alt_ar, width, height)
  select new_id, sort_order, kind, url, poster_url, alt_en, alt_ar, width, height from public.project_media where project_id = p_id;
  return new_id;
end;
$$;

grant execute on function public.reorder_rows(text, uuid[]) to authenticated;
grant execute on function public.duplicate_service(uuid) to authenticated;
grant execute on function public.duplicate_project(uuid) to authenticated;
grant execute on function public.next_free_slug(text, text) to authenticated;
