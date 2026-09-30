# 5CHICKS CMS — Supabase setup

The website is a React SPA whose content (pages/sections, services, projects, sliders, clients,
media, settings, SEO) lives in Supabase. Until Supabase is configured the site renders the migrated
seed content that is bundled with the app, so it keeps working exactly as before.

## 1. Create the project

1. Create a project at <https://supabase.com> (any region close to your visitors).
2. **Settings → API**: copy the **Project URL** and the **anon / publishable** key.
   Do **not** use or share the `service_role` / secret key anywhere in this project.

## 2. Run the migrations (in this order)

Either paste each file into **SQL Editor → New query → Run**, or use the Supabase CLI
(`supabase link --project-ref <ref>` then `supabase db push`):

1. `migrations/20260926000001_cms_schema.sql` — tables, triggers, activity log, admin RPCs
2. `migrations/20260926000002_cms_rls.sql` — Row Level Security (public read of published content, admin-only writes)
3. `migrations/20260926000003_cms_storage.sql` — the public `media` storage bucket and its admin-only write policies
4. `seed.sql` — the current website content (generated; safe to run more than once)

`seed.sql` is generated from the existing site content by `node scripts/cms/generate-seed-sql.mjs`.
It inserts 4 pages, 12 sections, 5 services (75 items), 3 sliders (69 slides), 19 clients and
170 media-library entries for the files already shipped in `public/assets`.

## 3. Dashboard configuration

- **Authentication → Providers → Email**: enabled (email + password).
- **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up" — admins are
  created by you (below); nobody should be able to register.
- **Authentication → URL Configuration**: set **Site URL** to `https://5chicks.vercel.app` (or your domain)
  and add it to Redirect URLs (used by password-reset emails).
- **Storage**: the `media` bucket is created by migration 3 (public read, 200 MB per file).

## 4. Create the first admin user

1. **Authentication → Users → Add user → Create new user**: enter the admin's email and a strong
   password, tick **Auto Confirm User**.
2. **SQL Editor**, run (with that email):

   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'admin@your-domain.com';
   ```

Only users listed in `public.admin_users` can change content. A signed-in user who is not in that
table can read published content like any visitor and is refused by the database for every write.
To remove an admin: `delete from public.admin_users where email = '…';`

## 5. Environment variables

Local: copy `.env.example` to `.env.local`. Vercel: **Project → Settings → Environment Variables**:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon / publishable key |
| `VITE_SITE_URL` | optional, defaults to `https://5chicks.vercel.app` |

Redeploy after setting them. The build (`npm run build`) then prerenders every **published** page
from Supabase and generates `sitemap.xml` from published content only.

## 6. Publishing workflow

- Saving in the dashboard updates Supabase immediately; visitors get the new content on their next
  page load or navigation (the site refetches published content in the background).
- Search engines and social previews read the prerendered HTML, which is refreshed on every deploy.
  After adding new services/projects, trigger a redeploy (Vercel → Deployments → Redeploy, or a
  Vercel Deploy Hook) so they are prerendered and added to the sitemap. Until then they still work
  for visitors through the SPA fallback.

## Security model (summary)

- Browser code only uses the anon key; there is no service-role key in the repository.
- `is_admin()` (SECURITY DEFINER) checks `public.admin_users`; every insert/update/delete policy and
  every storage write policy requires it. The admin RPCs (`reorder_rows`, `duplicate_service`,
  `duplicate_project`) run with the caller's rights and check `is_admin()` as well.
- Public reads are limited to published/enabled rows; drafts, the media table and the activity log
  are admin-only.
