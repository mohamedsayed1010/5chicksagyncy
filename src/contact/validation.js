// Contact form rules, shared by the browser form (ContactForm.jsx) and the email function
// (api/contact.js) so both sides accept exactly the same input. Errors are codes; the form turns
// them into English/Arabic messages.

export const LIMITS = { name: 80, phone: 20, details: 2000, link: 500 };
export const MIN = { name: 2, details: 10 };

const ARABIC_DIGITS = /[٠-٩۰-۹]/g;
// Arabic-Indic digits (U+0660…, U+06F0…) → 0-9; both blocks start on a multiple of 16.
const toLatinDigits = (value) => value.replace(ARABIC_DIGITS, (d) => String(d.charCodeAt(0) % 16));

const text = (value) => (typeof value === 'string' ? value.trim() : '');

// Accepts "5chicks.com", "www.facebook.com/page" or a full http(s) URL; returns the https URL or null.
export function normalizeLink(value) {
  const raw = text(value);
  if (!raw) return '';
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes('.') || /\s/.test(raw)) return null;
    return url.href;
  } catch {
    return null;
  }
}

// Returns { values, errors }: `values` are cleaned, `errors` maps field → code (empty when valid).
export function validateContact(input = {}) {
  const name = text(input.name).replace(/\s+/g, ' ');
  const phone = toLatinDigits(text(input.phone));
  const details = text(input.details);
  const link = normalizeLink(input.link);
  const errors = {};

  if (!name) errors.name = 'required';
  else if (name.length < MIN.name) errors.name = 'short';
  else if (name.length > LIMITS.name) errors.name = 'long';

  const digits = phone.replace(/\D/g, '');
  if (!phone) errors.phone = 'required';
  else if (!/^\+?[\d\s\-().]+$/.test(phone) || digits.length < 7 || digits.length > 15 || phone.length > LIMITS.phone)
    errors.phone = 'invalid';

  if (!details) errors.details = 'required';
  else if (details.length < MIN.details) errors.details = 'short';
  else if (details.length > LIMITS.details) errors.details = 'long';

  if (link === null || text(input.link).length > LIMITS.link) errors.link = 'invalid';

  return { values: { name, phone, details, link: link || '' }, errors };
}
