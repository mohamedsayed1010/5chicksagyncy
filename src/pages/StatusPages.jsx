import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../cms/CmsProvider.jsx';
import { notFoundSeo } from '../seo/seo.js';
import { usePageSeo } from '../seo/usePageSeo.js';
import { useLanguage } from '../i18n/language.jsx';
import '../styles/cms-pages.css';

export function NotFoundPage() {
  const { t } = useLanguage();
  const content = useContent();
  const { pathname } = useLocation();
  usePageSeo(useMemo(() => notFoundSeo(content, pathname), [content, pathname]));
  return (
    <main id="top" className="status-page">
      <span className="eyebrow">404</span>
      <h1>{t('This page doesn’t exist.', 'الصفحة دي مش موجودة.')}</h1>
      <p>{t('It may have been moved or unpublished.', 'ممكن تكون اتنقلت أو اتشالت.')}</p>
      <Link className="button primary" to="/">
        {t('Back to the homepage', 'الرجوع للصفحة الرئيسية')}
      </Link>
    </main>
  );
}

// Shown while a page that is not in the build-time snapshot (e.g. a newly published service) loads.
export function PageLoading() {
  const { t } = useLanguage();
  return (
    <main id="top" className="status-page" aria-busy="true">
      <span className="status-page__spinner" aria-hidden="true"></span>
      <p>{t('Loading…', 'جارٍ التحميل…')}</p>
    </main>
  );
}
