// Build-time rendering (scripts/prerender.mjs): static HTML + SEO head for every public route.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router';
import AppProviders, { createQueryClient } from './AppProviders.jsx';
import { publicPaths, routeElements } from './routes.jsx';
import { normalizePublic, seedContent } from './cms/normalize.js';
import { homeSeo, listPageSeo, notFoundSeo, pageUrl, projectSeo, renderSeoHead, serviceSeo } from './seo/seo.js';

export { normalizePublic, seedContent, publicPaths, pageUrl };

export function seoFor(path, content) {
  if (path === '/') return homeSeo(content);
  const [, section, slug] = path.split('/');
  if (!slug && ['services', 'portfolio', 'contact'].includes(section)) return listPageSeo(content, section, path);
  if (section === 'services') {
    const service = content.services.find((s) => s.slug === slug);
    if (service) return serviceSeo(content, service);
  }
  if (section === 'portfolio') {
    const project = content.projects.find((p) => p.slug === slug);
    if (project) return projectSeo(content, project);
  }
  return notFoundSeo(content, path);
}

export function renderPath(path, content) {
  const seo = seoFor(path, content);
  const html = renderToString(
    <StrictMode>
      <AppProviders queryClient={createQueryClient()} initialContent={content}>
        <StaticRouter location={path}>
          <Routes>{routeElements}</Routes>
        </StaticRouter>
      </AppProviders>
    </StrictMode>
  );
  return { html, head: renderSeoHead('en', seo), title: seo.text.en.title };
}
