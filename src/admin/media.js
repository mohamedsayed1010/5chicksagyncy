// Media uploads: files go to Supabase Storage (bucket "media"); only metadata and the public URL
// are stored in the database. JPG/PNG images are converted to WebP in the browser first (keeping
// the original when WebP would not be smaller), matching the site's existing WebP optimisation.

const kindOf = (type) => (type.startsWith('image/') ? 'image' : type.startsWith('video/') ? 'video' : 'document');

const safeName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-(?=\.)/g, '');

async function toWebp(file, quality = 0.9) {
  const bitmap = await createImageBitmap(file);
  const canvas = Object.assign(document.createElement('canvas'), { width: bitmap.width, height: bitmap.height });
  canvas.getContext('2d').drawImage(bitmap, 0, 0);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  bitmap.close?.();
  return blob && blob.type === 'image/webp' ? blob : null;
}

async function imageSize(blob) {
  const bitmap = await createImageBitmap(blob);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close?.();
  return size;
}

function videoInfo(blob) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(blob);
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth || null, height: video.videoHeight || null, duration_seconds: Math.round(video.duration * 10) / 10 || null });
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      resolve({ width: null, height: null, duration_seconds: null });
      URL.revokeObjectURL(url);
    };
    video.src = url;
  });
}

// Prepares a file for upload: optional WebP conversion + metadata.
async function prepare(file, { convertImages = true } = {}) {
  let blob = file;
  let name = file.name;
  let type = file.type || 'application/octet-stream';
  const kind = kindOf(type);
  if (kind === 'image' && convertImages && /^image\/(jpeg|png)$/.test(type)) {
    const webp = await toWebp(file).catch(() => null);
    if (webp && webp.size < file.size) {
      blob = webp;
      type = 'image/webp';
      name = name.replace(/\.(jpe?g|png)$/i, '') + '.webp';
    }
  }
  const info = kind === 'image' ? await imageSize(blob).catch(() => ({})) : kind === 'video' ? await videoInfo(blob) : {};
  return { file: new File([blob], name, { type }), name, type, kind, info };
}

export async function uploadMedia(api, file, options) {
  const { file: upload, name, type, kind, info } = await prepare(file, options);
  const path = `${kind}s/${crypto.randomUUID()}-${safeName(name)}`;
  const url = await api.storage.upload(upload, path);
  return api.db.insert('media', {
    source: 'media',
    path,
    url,
    filename: name,
    mime_type: type,
    kind,
    width: info.width ?? null,
    height: info.height ?? null,
    duration_seconds: info.duration_seconds ?? null,
    size_bytes: upload.size
  });
}

// Replaces the file behind an existing library item, keeping its path (and therefore its URL), so
// every page that uses it shows the new file. Browsers/CDN may cache the old file for up to an hour.
export async function replaceMedia(api, item, file) {
  if (item.source !== 'media') throw new Error('Files shipped with the website cannot be replaced here. Upload a new file instead.');
  const { file: upload, type, kind, info } = await prepare(file, { convertImages: /\.webp$/i.test(item.path) });
  if (kind !== item.kind) throw new Error(`Choose a ${item.kind} file to replace this ${item.kind}.`);
  const url = await api.storage.upload(upload, item.path, { upsert: true });
  return api.db.update('media', item.id, {
    url,
    mime_type: type,
    width: info.width ?? null,
    height: info.height ?? null,
    duration_seconds: info.duration_seconds ?? null,
    size_bytes: upload.size
  });
}

export async function deleteMedia(api, item) {
  if (item.source === 'media') await api.storage.remove(item.path);
  await api.db.remove('media', item.id);
}

// Where a URL is used across the CMS (to warn before deleting).
export async function findUsage(api, url) {
  const tables = ['site_settings', 'page_sections', 'services', 'projects', 'project_media', 'slides', 'clients'];
  const usage = [];
  for (const table of tables) {
    const rows = await api.db.list(table, { order: null });
    for (const row of rows)
      if (JSON.stringify(row).includes(JSON.stringify(url).slice(1, -1)))
        usage.push(`${table}: ${row.name_en || row.title_en || row.key || row.site_name || row.id}`);
  }
  return usage;
}

export const formatBytes = (bytes) =>
  bytes == null ? '—' : bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
