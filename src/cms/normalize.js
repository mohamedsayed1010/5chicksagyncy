// Shapes raw CMS rows (from Supabase, the mock backend or the seed) into the public content model.
// Public content only ever contains published/enabled rows — even when an admin is signed in and RLS
// would allow drafts to be read.
import { SEED } from './seed.js';

const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

export function normalizePublic(rows) {
  const pages = rows.pages.filter((p) => p.published);
  const pageSlugs = new Set(pages.map((p) => p.slug));
  const services = rows.services
    .filter((s) => s.published)
    .sort(bySort)
    .map((s) => ({ ...s, items: rows.service_items.filter((i) => i.service_id === s.id).sort(bySort) }));
  const serviceIds = new Set(services.map((s) => s.id));
  const sliders = rows.sliders
    .filter((s) => s.enabled)
    .sort(bySort)
    .map((s) => ({ ...s, slides: rows.slides.filter((x) => x.slider_id === s.id && x.enabled).sort(bySort) }));
  const projects = rows.projects
    .filter((p) => p.published)
    .sort(bySort)
    .map((p) => ({
      ...p,
      service_id: serviceIds.has(p.service_id) ? p.service_id : null,
      media: rows.project_media.filter((m) => m.project_id === p.id && m.url).sort(bySort)
    }));
  return {
    settings: rows.site_settings[0] || SEED.settings,
    pages: Object.fromEntries(pages.map((p) => [p.slug, p])),
    sections: rows.page_sections.filter((s) => s.enabled && pageSlugs.has(s.page_slug)).sort(bySort),
    services,
    sliders,
    clients: rows.clients.filter((c) => c.enabled).sort(bySort),
    projects
  };
}

// The seed as flat table rows (the same shape the database returns).
export function seedRows() {
  return {
    site_settings: [SEED.settings],
    pages: SEED.pages,
    page_sections: SEED.sections,
    services: SEED.services.map(({ items, ...row }) => row),
    service_items: SEED.services.flatMap((s) => s.items),
    sliders: SEED.sliders.map(({ slides, ...row }) => row),
    slides: SEED.sliders.flatMap((s) => s.slides),
    clients: SEED.clients,
    projects: SEED.projects.map(({ media, ...row }) => row),
    project_media: SEED.projects.flatMap((p) => p.media || [])
  };
}

export const seedContent = () => normalizePublic(seedRows());
