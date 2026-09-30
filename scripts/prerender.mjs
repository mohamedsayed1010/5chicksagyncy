// Build-time prerender for the SPA (runs after `vite build` and the SSR build of src/entry-server.jsx).
//
// Content source: the published CMS content from Supabase when VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY are set (read-only, public key, same RLS as visitors), otherwise the
// migrated seed content (src/cms/seed.js).
//
// Output (served by vercel.json "cleanUrls"):
//   dist/index.html                    /
//   dist/services.html                 /services
//   dist/services/<slug>.html          /services/:slug  (published services)
//   dist/portfolio.html, dist/portfolio/<slug>.html, dist/contact.html
//   dist/spa.html                      fallback shell for every other route (/admin, new slugs)
//   dist/sitemap.xml                   published, canonical URLs with en/ar alternates
// Every page embeds the content snapshot it was rendered with, so the browser renders the same
// content instantly and then refreshes it from the CMS.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
const ssrDir = path.join(root, 'node_modules/.prerender');
const dist = path.join(root, 'dist');
const env = loadEnv('production', root, 'VITE_');
const SITE = (env.VITE_SITE_URL || 'https://5chicks.vercel.app').replace(/\/+$/, '');

// Minimal browser globals read by component state initialisers (default: English, motion allowed).
globalThis.window = globalThis;
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const ssr = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

async function loadContent() {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.log('CMS content: migrated seed (Supabase is not configured for this build)');
    return ssr.seedContent();
  }
  const tables = ['site_settings', 'pages', 'page_sections', 'services', 'service_items', 'sliders', 'slides', 'clients', 'projects', 'project_media'];
  const rows = {};
  for (const table of tables) {
    const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (!response.ok) throw new Error(`Supabase ${table}: ${response.status} ${await response.text()}`);
    rows[table] = await response.json();
  }
  console.log('CMS content: published content from Supabase');
  return ssr.normalizePublic(rows);
}

const content = await loadContent();
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
for (const marker of ['<!--seo-head-->', '<!--app-html-->', '<!--cms-snapshot-->'])
  if (!template.includes(marker)) throw new Error(`Missing ${marker} in dist/index.html`);

const snapshot = `<script id="cms-snapshot" type="application/json">${JSON.stringify(content)
  .replace(/</g, '\\u003c')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029')}</script>`;

// React adds <link rel="preload" as="image"> for every eager <img>. The images are already in the
// static HTML (the hero keeps fetchpriority="high"), so these hints would only make below-the-fold
// images compete with the hero image.
const stripImagePreloads = (html) => html.replace(/<link rel="preload" as="image"[^>]*\/>/g, '');

const fill = ({ head = '', html = '', title }) => {
  let page = template
    .replace('<!--seo-head-->', head)
    .replace('<!--app-html-->', stripImagePreloads(html))
    .replace('<!--cms-snapshot-->', snapshot);
  if (title) page = page.replace(/<title>[^<]*<\/title>/, `<title>${title.replace(/</g, '&lt;')}</title>`);
  return page;
};

const paths = ssr.publicPaths(content);
for (const route of paths) {
  const file = route === '/' ? 'index.html' : route.slice(1) + '.html';
  fs.mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
  fs.writeFileSync(path.join(dist, file), fill(ssr.renderPath(route, content)));
}
console.log(`Prerendered ${paths.length} routes: ${paths.join(', ')}`);

// Fallback shell: no page content, the app renders the route (and its SEO) in the browser.
fs.writeFileSync(path.join(dist, 'spa.html'), fill({ title: content.settings.site_name || '5CHICKS' }));

// Sitemap: only published content; English + Arabic URL for every page.
const alternates = (route) =>
  ['en', 'ar', 'x-default']
    .map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${ssr.pageUrl(lang === 'ar' ? 'ar' : 'en', route)}" />`)
    .join('\n');
const urls = paths.flatMap((route) =>
  ['en', 'ar'].map((lang) => `  <url>\n    <loc>${ssr.pageUrl(lang, route)}</loc>\n${alternates(route)}\n  </url>`)
);
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`sitemap.xml: ${urls.length} URLs; robots.txt written`);

fs.rmSync(ssrDir, { recursive: true, force: true });
