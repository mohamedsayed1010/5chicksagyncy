-- 5CHICKS CMS — Storage
-- One public bucket, "media". Files are readable by anyone through their public URL
-- (images, videos and PDFs shown on the website); only admins can upload, replace or delete.
-- Folder layout used by the dashboard:
--   media/images/<uuid>-<name>.webp   (JPG/PNG are converted to WebP in the browser before upload)
--   media/videos/<uuid>-<name>.mp4
--   media/documents/<uuid>-<name>.pdf

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  209715200, -- 200 MB per file
  array['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/avif',
        'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "admins list media objects" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());

create policy "admins upload media objects" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

create policy "admins update media objects" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "admins delete media objects" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
