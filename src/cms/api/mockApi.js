// DEVELOPMENT-ONLY in-memory backend (VITE_CMS_MOCK=true with `npm run dev`).
// It mirrors the Supabase API so the dashboard can be exercised without a database.
// It is NOT a database: data lives in this browser tab's sessionStorage and uploaded files are
// temporary blob: URLs. It is excluded from production builds (see config.js / api/index.js).
import { seedRows } from '../normalize.js';

const STORAGE_KEY = 'cms-mock-db-v1';
// Test credentials for the local mock only (never used with Supabase).
const MOCK_EMAIL = import.meta.env.VITE_CMS_MOCK_EMAIL || 'admin@5chicks.test';
const MOCK_PASSWORD = import.meta.env.VITE_CMS_MOCK_PASSWORD || 'mock-admin';

const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

// Library entries for the site's own files referenced by the content (like supabase/seed.sql).
function staticMedia(rows) {
  const urls = new Set(['assets/5chicks-portfolio.pdf']);
  (function collect(value) {
    if (typeof value === 'string' && /^assets\/.+\.[a-z0-9]+$/i.test(value)) urls.add(value);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  })(rows);
  return [...urls].sort().map((url) => {
    const ext = url.split('.').pop().toLowerCase();
    const kind = ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : ext === 'pdf' ? 'document' : 'image';
    return {
      id: uuid(), source: 'static', path: url, url, filename: url.split('/').pop(), kind,
      mime_type: { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', mp4: 'video/mp4', pdf: 'application/pdf' }[ext] || null,
      width: null, height: null, size_bytes: null, created_at: now(), updated_at: now()
    };
  });
}

function load() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const rows = structuredClone(seedRows());
  return {
    ...rows,
    media: staticMedia(rows),
    activity_log: [],
    session: null
  };
}

export function createMockApi() {
  const db = load();
  const listeners = new Set();
  const persist = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {}
  };
  const table = (name) => (db[name] ||= []);
  const requireAdmin = () => {
    if (!db.session) throw Object.assign(new Error('Not authorized'), { code: '42501' });
  };
  const log = (name, action, row) => {
    db.activity_log.unshift({
      id: Date.now() + Math.random(),
      table_name: name,
      record_id: row?.id,
      action,
      summary: row?.name_en || row?.title_en || row?.key || row?.slug || row?.filename || row?.site_name || '',
      created_at: now()
    });
    db.activity_log.length = Math.min(db.activity_log.length, 200);
  };
  const assertUniqueSlug = (name, row, id) => {
    if (row.slug && table(name).some((r) => r.slug === row.slug && r.id !== id))
      throw Object.assign(new Error(`duplicate key value violates unique constraint "${name}_slug_key"`), { code: '23505' });
  };

  const api = {
    mode: 'mock',
    mockCredentials: { email: MOCK_EMAIL, password: MOCK_PASSWORD },

    async fetchPublicRows() {
      await delay(60);
      return structuredClone({
        site_settings: db.site_settings, pages: db.pages, page_sections: db.page_sections,
        services: db.services, service_items: db.service_items, sliders: db.sliders, slides: db.slides,
        clients: db.clients, projects: db.projects, project_media: db.project_media
      });
    },

    auth: {
      async getSession() {
        return db.session;
      },
      async signIn(email, password) {
        await delay();
        if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) throw new Error('Invalid login credentials');
        db.session = { user: { id: 'mock-admin', email } };
        persist();
        listeners.forEach((cb) => cb(db.session));
        return db.session;
      },
      async signOut() {
        db.session = null;
        persist();
        listeners.forEach((cb) => cb(null));
      },
      onChange(callback) {
        listeners.add(callback);
        return () => listeners.delete(callback);
      },
      async isAdmin() {
        return Boolean(db.session);
      }
    },

    db: {
      async list(name, { order = 'sort_order', ascending = true, filter, limit } = {}) {
        await delay(40);
        if (name !== 'site_settings' && name !== 'pages' && name !== 'page_sections') requireAdmin();
        let rows = table(name).filter((row) => !filter || Object.entries(filter).every(([k, v]) => row[k] === v));
        if (order) rows = [...rows].sort((a, b) => ((a[order] > b[order]) - (a[order] < b[order])) * (ascending ? 1 : -1));
        return structuredClone(limit ? rows.slice(0, limit) : rows);
      },
      async get(name, id) {
        return structuredClone(table(name).find((row) => row.id === id) || null);
      },
      async insert(name, row) {
        await delay();
        requireAdmin();
        assertUniqueSlug(name, row);
        const created = { id: uuid(), sort_order: table(name).length, created_at: now(), updated_at: now(), ...row };
        table(name).push(created);
        log(name, 'insert', created);
        persist();
        return structuredClone(created);
      },
      async update(name, id, patch) {
        await delay();
        requireAdmin();
        assertUniqueSlug(name, patch, id);
        const row = table(name).find((r) => r.id === id);
        if (!row) throw new Error('Row not found');
        Object.assign(row, patch, { updated_at: now() });
        log(name, 'update', row);
        persist();
        return structuredClone(row);
      },
      async remove(name, id) {
        await delay();
        requireAdmin();
        const children = { services: ['service_items', 'service_id'], projects: ['project_media', 'project_id'], sliders: ['slides', 'slider_id'] }[name];
        if (children) db[children[0]] = table(children[0]).filter((r) => r[children[1]] !== id);
        const row = table(name).find((r) => r.id === id);
        db[name] = table(name).filter((r) => r.id !== id);
        log(name, 'delete', row);
        persist();
      },
      async reorder(name, ids) {
        await delay();
        requireAdmin();
        ids.forEach((id, index) => {
          const row = table(name).find((r) => r.id === id);
          if (row) row.sort_order = index;
        });
        log(name, 'update', { key: `reorder ${name}` });
        persist();
      },
      async duplicate(name, id) {
        await delay();
        requireAdmin();
        const source = table(name).find((r) => r.id === id);
        let slug = `${source.slug}-copy`;
        for (let n = 2; table(name).some((r) => r.slug === slug); n++) slug = `${source.slug}-copy-${n}`;
        const copy = {
          ...structuredClone(source), id: uuid(), slug, published: false,
          sort_order: Math.max(...table(name).map((r) => r.sort_order)) + 1,
          created_at: now(), updated_at: now()
        };
        if (name === 'services') { copy.name_en += ' (copy)'; copy.name_ar += ' (نسخة)'; }
        else { copy.title_en += ' (copy)'; copy.title_ar += ' (نسخة)'; }
        table(name).push(copy);
        const [childTable, key] = name === 'services' ? ['service_items', 'service_id'] : ['project_media', 'project_id'];
        table(childTable).filter((r) => r[key] === id).forEach((r) => table(childTable).push({ ...structuredClone(r), id: uuid(), [key]: copy.id }));
        log(name, 'insert', copy);
        persist();
        return copy.id;
      },
      async count(name, filter) {
        return (await api.db.list(name, { filter, order: null })).length;
      }
    },

    storage: {
      async upload(file) {
        await delay(200);
        requireAdmin();
        return URL.createObjectURL(file);
      },
      async remove() {
        requireAdmin();
      }
    }
  };
  return api;
}
