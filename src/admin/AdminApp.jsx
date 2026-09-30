import { useLayoutEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import { AuthProvider, RequireAdmin } from './auth.jsx';
import { FeedbackProvider } from './ui.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { PageEditor, PagesList, SectionEditorPage } from './pages/PagesPages.jsx';
import { ServiceEditor, ServicesList } from './pages/ServicesPages.jsx';
import { ProjectEditor, ProjectsList } from './pages/ProjectsPages.jsx';
import { SliderEditor, SlidersList } from './pages/SlidersPages.jsx';
import MediaLibraryPage from './pages/MediaLibraryPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import SeoPage from './pages/SeoPage.jsx';
import './admin.css';

// The dashboard is never indexed and always uses the English, left-to-right interface
// (content fields show English and Arabic side by side).
function useAdminDocument() {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const previous = { lang: html.lang, dir: html.dir, title: document.title };
    html.lang = 'en';
    html.dir = 'ltr';
    document.title = '5CHICKS CMS';
    let robots = document.head.querySelector('meta[name="robots"]');
    const previousRobots = robots?.content;
    if (!robots) robots = document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'robots' }));
    robots.content = 'noindex, nofollow';
    return () => {
      Object.assign(html, { lang: previous.lang, dir: previous.dir });
      document.title = previous.title;
      if (previousRobots) robots.content = previousRobots;
    };
  }, []);
}

export default function AdminApp() {
  useAdminDocument();
  const guard = (element) => <RequireAdmin>{element}</RequireAdmin>;
  return (
    <AuthProvider>
      <FeedbackProvider>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route element={guard(<AdminLayout />)}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="pages" element={<PagesList />} />
            <Route path="pages/:slug" element={<PageEditor />} />
            <Route path="pages/:slug/sections/:key" element={<SectionEditorPage />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="services/:id" element={<ServiceEditor />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/:id" element={<ProjectEditor />} />
            <Route path="sliders" element={<SlidersList />} />
            <Route path="sliders/:id" element={<SliderEditor />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="seo" element={<SeoPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </FeedbackProvider>
    </AuthProvider>
  );
}
