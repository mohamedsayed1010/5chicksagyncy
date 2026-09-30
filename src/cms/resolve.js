// Helpers that turn CMS rows into what the components render.

// "assets/x.webp" (files shipped with the site) → "/assets/x.webp"; absolute URLs are kept.
// Empty → undefined, so React leaves the attribute out instead of rendering src="".
export function assetUrl(url) {
  if (!url) return undefined;
  if (/^(https?:|blob:|data:|\/)/.test(url)) return url;
  return '/' + url;
}

// Bilingual column pair: row.name_en / row.name_ar → the value for the current language
// (Arabic falls back to English when empty).
export const pick = (row, field, lang) =>
  (lang === 'ar' ? row?.[`${field}_ar`] : '') || row?.[`${field}_en`] || '';

// A section's view for one language: settings + content_<lang>, with lists merged item by item.
export function resolveSection(section, lang) {
  if (!section) return null;
  const content = (lang === 'ar' ? section.content_ar : section.content_en) || {};
  const base = section.content_en || {};
  const settings = section.settings || {};
  const view = { ...settings };
  for (const key of new Set([...Object.keys(base), ...Object.keys(content)])) {
    const value = content[key] ?? base[key];
    if (Array.isArray(value) || Array.isArray(settings[key])) {
      const length = Math.max(value?.length || 0, settings[key]?.length || 0);
      view[key] = Array.from({ length }, (_, i) => ({ ...(settings[key]?.[i] || {}), ...(base[key]?.[i] || {}), ...(value?.[i] || {}) }));
    } else view[key] = value;
  }
  return view;
}

// WhatsApp numbers are stored in international format without "+" (e.g. 201004066939).
export const isValidWhatsappNumber = (number) => /^[1-9][0-9]{7,14}$/.test(String(number || ''));

export function whatsappUrl(number, message) {
  if (!isValidWhatsappNumber(number)) return null;
  return `https://wa.me/${number}` + (message ? `?text=${encodeURIComponent(message)}` : '');
}

export const telHref = (phone) => (phone ? `tel:${String(phone).replace(/[^\d+]/g, '')}` : '');

// Paragraphs are stored as one text value separated by blank lines.
export const paragraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
