import { useLayoutEffect } from 'react';
import { applyDocumentLanguage, useLanguage } from '../i18n/language.jsx';

// Applies <html lang/dir>, <title> and every SEO tag for the page being shown, and re-applies them
// when the language or the page's CMS content changes.
export function usePageSeo(page) {
  const { lang } = useLanguage();
  useLayoutEffect(() => {
    if (page) applyDocumentLanguage(lang, page);
  }, [lang, page]);
}
