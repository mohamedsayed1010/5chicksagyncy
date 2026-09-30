// Editable fields of each page section. The dashboard renders forms from these definitions:
//   i18n: true   → stored in content_en / content_ar (edited side by side)
//   otherwise    → stored in settings (language independent)
//   type         → text (default) | textarea | media | link | select | color | toggle | list
// Keys that exist in the database but are not listed here are kept unchanged on save.
const t = (key, label, extra) => ({ key, label, i18n: true, ...extra });
const ta = (key, label, extra) => ({ key, label, i18n: true, type: 'textarea', ...extra });
const media = (key, label, extra) => ({ key, label, type: 'media', ...extra });
const link = (key, label, extra) => ({ key, label, type: 'link', ...extra });
const BREAK = 'Use a new line for a line break.';

export const SECTION_SCHEMAS = {
  header: {
    label: 'Header',
    fields: [
      media('logo', 'Logo'),
      { key: 'links', label: 'Menu links', type: 'list', itemLabel: 'link', fields: [t('label', 'Label'), link('href', 'Link', { hint: '#section, /page or https://…' }), { key: 'icon', label: 'Arrow', type: 'select', options: [['', 'None'], ['↘', '↘'], ['↗', '↗'], ['↓', '↓']] }] },
      t('ctaLabel', 'Contact button text'),
      link('contactHref', 'Contact button link'),
      t('languageLabel', 'Language switch text', { hint: 'English column: shown on the English site (the button switches to Arabic).' }),
      t('languageAria', 'Language switch label (screen readers)'),
      t('skipLabel', 'Skip link text (keyboard users)'),
      t('homeLabel', 'Logo link label (screen readers)'),
      t('navLabel', 'Menu name (screen readers)')
    ]
  },
  hero: {
    label: 'Hero',
    fields: [
      t('topline', 'Eyebrow'),
      t('toplineEnd', 'Eyebrow (right side)'),
      t('titleLine1', 'Title — first line'),
      t('titleLine2', 'Title — start of second line', { hint: 'Text before the green highlight, including the trailing space.' }),
      t('titleHighlight', 'Title — green highlight'),
      ta('description', 'Description'),
      t('buttonLabel', 'Button text'),
      link('buttonHref', 'Button link'),
      media('chromeImage', 'Main artwork'),
      media('heroVideo', 'Hero video (optional)', { accept: 'video', hint: 'When set, the video replaces the artwork (the artwork becomes its poster).' }),
      media('stickerImage', 'Sticker image'),
      ta('sticker', 'Sticker text', { hint: BREAK }),
      t('coordinateTop', 'Small label (top)'),
      t('coordinateBottom', 'Small label (bottom)'),
      t('labelStrong', 'Green label — large word'),
      t('labelText', 'Green label — text'),
      t('bottomText', 'Bottom line'),
      t('scrollLabel', 'Scroll link text'),
      link('scrollHref', 'Scroll link')
    ]
  },
  ticker: {
    label: 'Ticker',
    fields: [{ key: 'items', label: 'Ticker items', type: 'list', itemLabel: 'item', fields: [t('text', 'Text'), { key: 'enabled', label: 'Visible', type: 'toggle', default: true }] }]
  },
  about: {
    label: 'About (The House)',
    fields: [
      t('eyebrow', 'Eyebrow'),
      media('symbolImage', 'Small brand image'),
      ta('title', 'Title', { hint: BREAK }),
      ta('titleHighlight', 'Title — grey part', { hint: BREAK }),
      ta('lead', 'Lead sentence'),
      { key: 'paragraphs', label: 'Paragraphs', type: 'list', itemLabel: 'paragraph', fields: [ta('text', 'Text')] },
      t('linkLabel', 'Link text'),
      link('linkHref', 'Link'),
      t('missionLabel', 'Mission label'),
      ta('mission', 'Mission'),
      t('visionLabel', 'Vision label'),
      ta('vision', 'Vision')
    ]
  },
  services: {
    label: 'Services',
    note: 'The service cards themselves are managed under Services.',
    fields: [t('eyebrow', 'Eyebrow'), t('note', 'Small note'), ta('title', 'Title', { hint: BREAK }), ta('titleOutline', 'Title — outlined part', { hint: BREAK }), ta('intro', 'Intro', { hint: BREAK }), t('detailsLabel', 'Card button: details'), t('whatsappLabel', 'Card button: WhatsApp')]
  },
  clients: {
    label: 'Clients',
    note: 'Client logos are managed under Clients.',
    fields: [t('eyebrow', 'Eyebrow'), t('note', 'Small note'), ta('title', 'Title', { hint: BREAK }), ta('titleHighlight', 'Title — green part', { hint: BREAK }), ta('intro', 'Intro', { hint: BREAK }), t('pauseLabel', 'Pause button'), t('playLabel', 'Play button'), t('windowLabel', 'Logo strip label (screen readers)'), t('placeholder', 'Placeholder text (no logos)'), ta('emptyNote', 'Note when there are no logos')]
  },
  work: {
    label: 'Work',
    note: 'The collections and their slides are managed under Sliders.',
    fields: [t('eyebrow', 'Eyebrow'), t('note', 'Small note'), ta('title', 'Title', { hint: BREAK }), ta('titleOutline', 'Title — outlined part', { hint: BREAK }), ta('intro', 'Intro', { hint: BREAK }), t('jumpNavLabel', 'Collections menu label (screen readers)'), t('collectionLabel', 'Collection eyebrow'), t('previewNote', 'Note under the collections')]
  },
  portfolio: {
    label: 'Portfolio',
    fields: [
      t('eyebrow', 'Eyebrow'),
      ta('title', 'Title', { hint: BREAK }),
      ta('titleHighlight', 'Title — green part', { hint: BREAK }),
      ta('text', 'Text'),
      t('viewLabel', 'View button'),
      t('downloadLabel', 'Download link'),
      t('detail', 'File details line'),
      media('pdfUrl', 'Portfolio PDF', { accept: 'document' }),
      { key: 'pdfDownloadName', label: 'Download file name' },
      media('patternImage', 'Artwork pattern'),
      media('logoImage', 'Artwork logo'),
      t('artText', 'Artwork caption'),
      t('projectsTitle', 'Projects heading (portfolio page)'),
      t('dialogTitle', 'Viewer title'),
      t('openPdfLabel', 'Viewer: open PDF'),
      t('dialogDownloadLabel', 'Viewer: download'),
      t('closeLabel', 'Viewer: close (screen readers)'),
      ta('help', 'Viewer help text'),
      t('frameTitle', 'Viewer frame title (screen readers)')
    ]
  },
  chicks: {
    label: 'The Chicks (creative DNA)',
    fields: [
      t('eyebrow', 'Eyebrow'),
      t('note', 'Small note'),
      ta('title', 'Title', { hint: BREAK }),
      ta('titleHighlight', 'Title — green part', { hint: BREAK }),
      media('heartImage', 'Hearts image'),
      t('heartAlt', 'Hearts image description'),
      media('crewImage', 'Characters image'),
      t('crewAlt', 'Characters image description'),
      t('crewSideStart', 'Side text (start)'),
      t('crewSideEnd', 'Side text (end)'),
      {
        key: 'traits',
        label: 'Personalities',
        type: 'list',
        itemLabel: 'personality',
        fields: [t('label', 'Name'), ta('text', 'Text', { hint: BREAK }), media('image', 'Image'), t('alt', 'Image description'), { key: 'accent', label: 'Accent colour', type: 'color' }]
      }
    ]
  },
  contact: {
    label: 'Contact',
    note: 'The phone number and WhatsApp number are managed under Settings.',
    fields: [t('eyebrow', 'Eyebrow'), ta('title', 'Title', { hint: BREAK }), ta('titleHighlight', 'Title — outlined part', { hint: BREAK }), t('buttonLabel', 'Button text'), ta('closing', 'Closing text', { hint: BREAK })]
  },
  footer: {
    label: 'Footer',
    note: 'Social links are managed under Settings.',
    fields: [media('logo', 'Logo'), t('copyright', 'Copyright text', { hint: 'Shown after “© <year>”.' }), t('backToTop', 'Back to top text'), t('homeLabel', 'Logo link label (screen readers)')]
  },
  'service-template': {
    label: 'Service page labels',
    note: 'Headings and labels shared by every service detail page.',
    fields: [
      'skipLabel', 'breadcrumbLabel', 'servicesLabel', 'eyebrow', 'whatsappLabel', 'allServicesLabel', 'overviewEyebrow', 'overviewTitle',
      'offersEyebrow', 'offersNote', 'offersTitle', 'processEyebrow', 'processNote', 'processTitle', 'processIntro', 'valueEyebrow', 'valueTitle',
      'faqEyebrow', 'faqTitle', 'projectsEyebrow', 'projectsTitle', 'othersEyebrow', 'othersNote', 'othersTitle', 'ctaEyebrow', 'ctaTitle',
      'ctaHighlight', 'ctaButton', 'ctaClosing', 'relatedReels', 'relatedWork', 'relatedPortfolio'
    ].map((key) => (/Title$|Closing|Intro/.test(key) ? ta(key, key.replace(/([A-Z])/g, ' $1').toLowerCase()) : t(key, key.replace(/([A-Z])/g, ' $1').toLowerCase())))
  }
};

// Database row → form values ({ en, ar } for translatable fields; lists become arrays of items).
export function sectionToValues(section, schema) {
  const values = {};
  const en = section.content_en || {};
  const ar = section.content_ar || {};
  const settings = section.settings || {};
  for (const field of schema.fields) {
    if (field.type === 'list') {
      const length = Math.max(en[field.key]?.length || 0, ar[field.key]?.length || 0, settings[field.key]?.length || 0);
      values[field.key] = Array.from({ length }, (_, i) => {
        const item = { _key: Math.random().toString(36).slice(2) };
        for (const sub of field.fields)
          item[sub.key] = sub.i18n
            ? { en: en[field.key]?.[i]?.[sub.key] ?? '', ar: ar[field.key]?.[i]?.[sub.key] ?? '' }
            : settings[field.key]?.[i]?.[sub.key] ?? sub.default ?? '';
        return item;
      });
    } else values[field.key] = field.i18n ? { en: en[field.key] ?? '', ar: ar[field.key] ?? '' } : settings[field.key] ?? field.default ?? '';
  }
  return values;
}

// Form values → { content_en, content_ar, settings }, starting from the stored row so that keys the
// schema does not know about are preserved.
export function valuesToSection(values, schema, section) {
  const content_en = { ...(section.content_en || {}) };
  const content_ar = { ...(section.content_ar || {}) };
  const settings = { ...(section.settings || {}) };
  for (const field of schema.fields) {
    const value = values[field.key];
    if (field.type === 'list') {
      const i18nFields = field.fields.filter((f) => f.i18n);
      const plainFields = field.fields.filter((f) => !f.i18n);
      if (i18nFields.length) {
        content_en[field.key] = value.map((item) => Object.fromEntries(i18nFields.map((f) => [f.key, item[f.key].en])));
        content_ar[field.key] = value.map((item) => Object.fromEntries(i18nFields.map((f) => [f.key, item[f.key].ar])));
      }
      if (plainFields.length) settings[field.key] = value.map((item) => Object.fromEntries(plainFields.map((f) => [f.key, item[f.key]])));
    } else if (field.i18n) {
      content_en[field.key] = value.en;
      content_ar[field.key] = value.ar;
    } else settings[field.key] = value;
  }
  return { content_en, content_ar, settings };
}
