// Page metadata built from CMS content. Used at runtime (route/language changes) and at build time
// (static <head> written into the prerendered HTML by scripts/prerender.mjs).
import { SITE_URL } from '../cms/config.js';
import { pick } from '../cms/resolve.js';

export { SITE_URL };

const LOCALE = { en: 'en_US', ar: 'ar_EG' };

// English is the default version of a page; Arabic is the same page served with ?lang=ar.
export const pageUrl = (lang, path = '/') =>
  lang === 'ar' ? `${SITE_URL}${path}?lang=ar` : `${SITE_URL}${path}`;

// Site-relative ("assets/x.png", "/x.png") → absolute URL for crawlers and social cards.
export function absoluteUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${SITE_URL}/${url.replace(/^\/+/, '')}`;
}

const DEFAULT_LOGO = { url: 'assets/identity/logo.webp', width: 857, height: 221 };
const DEFAULT_OG = { url: 'assets/brand-logo.png', width: 1220, height: 750, type: 'image/png' };

function ogImage(settings, override) {
  const url = override || settings.og_image_url || DEFAULT_OG.url;
  const known = url === DEFAULT_OG.url;
  return {
    url: absoluteUrl(url),
    width: known ? DEFAULT_OG.width : undefined,
    height: known ? DEFAULT_OG.height : undefined,
    type: known
      ? DEFAULT_OG.type
      : /\.webp(\?|$)/i.test(url) ? 'image/webp' : /\.jpe?g(\?|$)/i.test(url) ? 'image/jpeg' : /\.png(\?|$)/i.test(url) ? 'image/png' : undefined
  };
}

const organizationId = () => `${SITE_URL}/#organization`;
const websiteId = () => `${SITE_URL}/#website`;

function organizationNode(content) {
  const { settings, services } = content;
  const logo = settings.logo_url || DEFAULT_LOGO.url;
  const og = ogImage(settings);
  return {
    '@type': 'Organization',
    '@id': organizationId(),
    name: settings.site_name || '5CHICKS',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(logo),
      ...(logo === DEFAULT_LOGO.url ? { width: DEFAULT_LOGO.width, height: DEFAULT_LOGO.height } : {})
    },
    image: og.url,
    description: settings.default_seo_description_en,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.social_links?.length ? { sameAs: settings.social_links.map((l) => l.url).filter(Boolean) } : {}),
    knowsAbout: services.map((s) => s.name_en)
  };
}

const websiteNode = (content) => ({
  '@type': 'WebSite',
  '@id': websiteId(),
  url: `${SITE_URL}/`,
  name: content.settings.site_name || '5CHICKS',
  inLanguage: ['en', 'ar'],
  publisher: { '@id': organizationId() }
});

const imageObject = (og) => ({
  '@type': 'ImageObject',
  url: og.url,
  ...(og.width ? { width: og.width, height: og.height } : {})
});

// A page descriptor: { path, robots, og, text: { en: {title, description, locale, imageAlt}, ar }, graph(lang) }.
function describe(content, { path, titles, descriptions, ogOverride, robots }) {
  const { settings } = content;
  const text = {};
  for (const lang of ['en', 'ar'])
    text[lang] = {
      title: titles[lang] || titles.en || pick(settings, 'default_seo_title', lang),
      description: descriptions[lang] || descriptions.en || pick(settings, 'default_seo_description', lang),
      locale: LOCALE[lang],
      imageAlt: pick(settings, 'og_image_alt', lang)
    };
  return { path, robots: robots || 'index, follow, max-image-preview:large', og: ogImage(settings, ogOverride), text };
}

const webPage = (page, lang, extra = {}) => {
  const url = pageUrl(lang, page.path);
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.text[lang].title,
    description: page.text[lang].description,
    inLanguage: lang,
    isPartOf: { '@id': websiteId() },
    ...extra,
    primaryImageOfPage: imageObject(page.og)
  };
};

const breadcrumb = (lang, path, items) => ({
  '@type': 'BreadcrumbList',
  '@id': `${pageUrl(lang, path)}#breadcrumb`,
  itemListElement: items.map(([name, itemPath], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: pageUrl(lang, itemPath)
  }))
});

const pageText = (content, slug) => {
  const row = content.pages[slug] || {};
  return {
    titles: { en: row.seo_title_en, ar: row.seo_title_ar },
    descriptions: { en: row.seo_description_en, ar: row.seo_description_ar },
    ogOverride: row.og_image_url
  };
};

export function homeSeo(content) {
  const page = describe(content, { path: '/', ...pageText(content, 'home') });
  page.graph = (lang) => [
    organizationNode(content),
    websiteNode(content),
    webPage(page, lang, { about: { '@id': organizationId() } })
  ];
  return page;
}

// /services, /portfolio, /contact
export function listPageSeo(content, slug, path) {
  const page = describe(content, { path, ...pageText(content, slug) });
  const name = (lang) => pick(content.pages[slug], 'title', lang);
  page.graph = (lang) => [
    organizationNode(content),
    websiteNode(content),
    webPage(page, lang, { about: { '@id': organizationId() }, breadcrumb: { '@id': `${pageUrl(lang, path)}#breadcrumb` } }),
    breadcrumb(lang, path, [[content.settings.site_name || '5CHICKS', '/'], [name(lang), path]])
  ];
  return page;
}

export function serviceSeo(content, service) {
  const path = `/services/${service.slug}`;
  const page = describe(content, {
    path,
    titles: { en: service.seo_title_en || service.name_en, ar: service.seo_title_ar || service.name_ar },
    descriptions: { en: service.seo_description_en || service.description_en, ar: service.seo_description_ar || service.description_ar },
    ogOverride: service.og_image_url || service.hero_image_url
  });
  const serviceId = `${pageUrl('en', path)}#service`;
  page.graph = (lang) => [
    organizationNode(content),
    websiteNode(content),
    webPage(page, lang, { about: { '@id': serviceId }, breadcrumb: { '@id': `${pageUrl(lang, path)}#breadcrumb` } }),
    {
      '@type': 'Service',
      '@id': serviceId,
      name: pick(service, 'name', lang),
      serviceType: service.name_en,
      description: page.text[lang].description,
      url: pageUrl(lang, path),
      provider: { '@id': organizationId() }
    },
    breadcrumb(lang, path, [
      [content.settings.site_name || '5CHICKS', '/'],
      [pick(content.pages.services, 'title', lang) || 'Services', '/services'],
      [pick(service, 'name', lang), path]
    ])
  ];
  return page;
}

export function projectSeo(content, project) {
  const path = `/portfolio/${project.slug}`;
  const site = content.settings.site_name || '5CHICKS';
  const page = describe(content, {
    path,
    titles: {
      en: project.seo_title_en || `${project.title_en} — ${site}`,
      ar: project.seo_title_ar || `${project.title_ar || project.title_en} — ${site}`
    },
    descriptions: { en: project.seo_description_en || project.description_en, ar: project.seo_description_ar || project.description_ar },
    ogOverride: project.og_image_url || project.cover_url
  });
  page.graph = (lang) => [
    organizationNode(content),
    websiteNode(content),
    webPage(page, lang, { breadcrumb: { '@id': `${pageUrl(lang, path)}#breadcrumb` } }),
    {
      '@type': 'CreativeWork',
      '@id': `${pageUrl('en', path)}#work`,
      name: pick(project, 'title', lang),
      description: page.text[lang].description,
      url: pageUrl(lang, path),
      ...(project.cover_url ? { image: absoluteUrl(project.cover_url) } : {}),
      creator: { '@id': organizationId() }
    },
    breadcrumb(lang, path, [
      [site, '/'],
      [pick(content.pages.portfolio, 'title', lang) || 'Portfolio', '/portfolio'],
      [pick(project, 'title', lang), path]
    ])
  ];
  return page;
}

export function notFoundSeo(content, path) {
  const site = content.settings.site_name || '5CHICKS';
  const page = describe(content, {
    path,
    titles: { en: `Page not found — ${site}`, ar: `الصفحة مش موجودة — ${site}` },
    descriptions: {},
    robots: 'noindex, follow'
  });
  page.graph = () => [organizationNode(content), websiteNode(content)];
  return page;
}

const structuredData = (lang, page) => ({ '@context': 'https://schema.org', '@graph': page.graph(lang) });

// Each entry: [tag, attribute used to find the element, attributes].
function headEntries(lang, page) {
  const text = page.text[lang];
  const other = lang === 'ar' ? 'en' : 'ar';
  const url = pageUrl(lang, page.path);
  const og = page.og;
  const meta = (key, name, content) => ['meta', key, { [key]: name, content }];
  const entries = [
    meta('name', 'description', text.description),
    meta('name', 'robots', page.robots),
    ['link', 'rel=canonical', { rel: 'canonical', href: url }],
    ['link', 'hreflang=en', { rel: 'alternate', hreflang: 'en', href: pageUrl('en', page.path) }],
    ['link', 'hreflang=ar', { rel: 'alternate', hreflang: 'ar', href: pageUrl('ar', page.path) }],
    ['link', 'hreflang=x-default', { rel: 'alternate', hreflang: 'x-default', href: pageUrl('en', page.path) }],
    meta('property', 'og:site_name', '5CHICKS'),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:title', text.title),
    meta('property', 'og:description', text.description),
    meta('property', 'og:url', url),
    meta('property', 'og:image', og.url)
  ];
  if (og.type) entries.push(meta('property', 'og:image:type', og.type));
  if (og.width) {
    entries.push(meta('property', 'og:image:width', String(og.width)));
    entries.push(meta('property', 'og:image:height', String(og.height)));
  }
  entries.push(
    meta('property', 'og:image:alt', text.imageAlt),
    meta('property', 'og:locale', text.locale),
    meta('property', 'og:locale:alternate', page.text[other].locale),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', text.title),
    meta('name', 'twitter:description', text.description),
    meta('name', 'twitter:image', og.url),
    meta('name', 'twitter:image:alt', text.imageAlt)
  );
  return entries;
}

const selectorFor = (tag, key, attrs) =>
  key.startsWith('rel=')
    ? `link[rel="${attrs.rel}"]:not([hreflang])`
    : key.startsWith('hreflang=')
      ? `link[rel="alternate"][hreflang="${attrs.hreflang}"]`
      : `${tag}[${key}="${attrs[key]}"]`;

// Runtime: create or update every tag so the head always matches the visible page and language.
export function applySeo(lang, page) {
  const head = document.head;
  const wanted = headEntries(lang, page);
  // Remove optional OG image tags the new page does not have.
  for (const name of ['og:image:type', 'og:image:width', 'og:image:height'])
    if (!wanted.some(([, key, attrs]) => attrs[key] === name))
      head.querySelector(`meta[property="${name}"]`)?.remove();
  for (const [tag, key, attrs] of wanted) {
    let element = head.querySelector(selectorFor(tag, key, attrs));
    if (!element) {
      element = document.createElement(tag);
      head.appendChild(element);
    }
    for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  }
  let jsonLd = head.querySelector('script#structured-data');
  if (!jsonLd) {
    jsonLd = document.createElement('script');
    jsonLd.type = 'application/ld+json';
    jsonLd.id = 'structured-data';
    head.appendChild(jsonLd);
  }
  jsonLd.textContent = JSON.stringify(structuredData(lang, page));
}

const escapeAttribute = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Build time: the same tags as static HTML.
export function renderSeoHead(lang, page) {
  const tags = headEntries(lang, page).map(
    ([tag, , attrs]) =>
      `<${tag} ${Object.entries(attrs)
        .map(([name, value]) => `${name}="${escapeAttribute(value)}"`)
        .join(' ')} />`
  );
  const json = JSON.stringify(structuredData(lang, page)).replace(/</g, '\\u003c');
  tags.push(`<script type="application/ld+json" id="structured-data">${json}</script>`);
  return tags.join('\n    ');
}
