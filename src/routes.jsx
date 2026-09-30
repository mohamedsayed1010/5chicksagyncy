import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import { ContactPage, PortfolioPage, ServicesPage } from './pages/ListPages.jsx';
import { NotFoundPage } from './pages/StatusPages.jsx';

// The dashboard is a separate chunk, only downloaded when /admin is opened.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

// Shared by the browser router (main.jsx) and the build-time prerender (entry-server.jsx).
export const routeElements = (
  <>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="services" element={<ServicesPage />} />
      <Route path="services/:slug" element={<ServiceDetailPage />} />
      <Route path="portfolio" element={<PortfolioPage />} />
      <Route path="portfolio/:slug" element={<ProjectPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route
      path="admin/*"
      element={
        <Suspense fallback={<div className="admin-boot">Loading dashboard…</div>}>
          <AdminApp />
        </Suspense>
      }
    />
  </>
);

// Every public URL that exists for the given (published) content — used for prerendering and
// the sitemap.
export function publicPaths(content) {
  return [
    '/',
    '/services',
    ...content.services.map((s) => `/services/${s.slug}`),
    '/portfolio',
    ...content.projects.map((p) => `/portfolio/${p.slug}`),
    '/contact'
  ];
}
