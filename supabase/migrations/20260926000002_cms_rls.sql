-- 5CHICKS CMS — Row Level Security
-- Visitors (anon) and signed-in non-admins can only READ published/enabled content.
-- Only users listed in public.admin_users (checked by public.is_admin()) can create, update or delete.
-- The browser only ever uses the anon/publishable key; these policies are the real security boundary.

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.services enable row level security;
alter table public.service_items enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.sliders enable row level security;
alter table public.slides enable row level security;
alter table public.clients enable row level security;
alter table public.media enable row level security;
alter table public.activity_log enable row level security;

-- Admin list: admins may see it; nobody can change it through the API (manage it with SQL).
create policy "admins read admin list" on public.admin_users
  for select to authenticated using (public.is_admin());

-- Public read policies ---------------------------------------------------------
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);

create policy "public read published pages" on public.pages
  for select to anon, authenticated using (published or public.is_admin());

create policy "public read enabled sections" on public.page_sections
  for select to anon, authenticated using (
    (enabled and exists (select 1 from public.pages p where p.slug = page_slug and p.published))
    or public.is_admin()
  );

create policy "public read published services" on public.services
  for select to anon, authenticated using (published or public.is_admin());

create policy "public read items of published services" on public.service_items
  for select to anon, authenticated using (
    exists (select 1 from public.services s where s.id = service_id and s.published) or public.is_admin()
  );

create policy "public read published projects" on public.projects
  for select to anon, authenticated using (published or public.is_admin());

create policy "public read media of published projects" on public.project_media
  for select to anon, authenticated using (
    exists (select 1 from public.projects p where p.id = project_id and p.published) or public.is_admin()
  );

create policy "public read enabled sliders" on public.sliders
  for select to anon, authenticated using (enabled or public.is_admin());

create policy "public read enabled slides" on public.slides
  for select to anon, authenticated using (
    (enabled and exists (select 1 from public.sliders s where s.id = slider_id and s.enabled)) or public.is_admin()
  );

create policy "public read enabled clients" on public.clients
  for select to anon, authenticated using (enabled or public.is_admin());

-- Media library metadata and the activity log are admin-only.
create policy "admins read media" on public.media
  for select to authenticated using (public.is_admin());
create policy "admins read activity" on public.activity_log
  for select to authenticated using (public.is_admin());

-- Admin write policies -----------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'pages', 'page_sections', 'services', 'service_items', 'projects',
    'project_media', 'sliders', 'slides', 'clients', 'media'
  ] loop
    execute format('create policy "admins insert %1$s" on public.%1$I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admins update %1$s" on public.%1$I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admins delete %1$s" on public.%1$I for delete to authenticated using (public.is_admin())', t);
  end loop;
end;
$$;

-- The settings row can be edited but never deleted.
drop policy "admins delete site_settings" on public.site_settings;
