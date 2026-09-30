import { isValidWhatsappNumber } from '../cms/resolve.js';

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Links may be absolute (https:, tel:, mailto:), site paths (/services), in-page (#contact) or
// files shipped with the site (assets/...).
export const isValidLink = (value) =>
  !value || /^(https?:\/\/[^\s]+|tel:\+?[\d\s-]+|mailto:[^\s@]+@[^\s@]+|\/[^\s]*|#[\w-]+|assets\/[^\s]+)$/.test(value);

export const isHexColor = (value) => /^#[0-9a-fA-F]{6}$/.test(value || '');

export const validators = {
  required: (value) => (String(value ?? '').trim() ? '' : 'Required'),
  slug: (value) => (SLUG_PATTERN.test(value || '') ? '' : 'Use lowercase letters, numbers and single hyphens (e.g. web-design)'),
  link: (value) => (isValidLink(value) ? '' : 'Enter a full URL (https://…), a path (/services), #section, tel: or mailto:'),
  color: (value) => (isHexColor(value) ? '' : 'Use a 6-digit hex colour such as #00ff87'),
  whatsapp: (value) =>
    !value || isValidWhatsappNumber(value) ? '' : 'International format without + or spaces, e.g. 201004066939',
  email: (value) => (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address')
};

// Run { field: [validatorName, ...] } against values; returns { field: message } for failures.
export function validate(values, rules) {
  const errors = {};
  for (const [field, names] of Object.entries(rules))
    for (const name of names) {
      const message = validators[name](values[field]);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  return errors;
}
