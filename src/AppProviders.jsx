import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CmsProvider } from './cms/CmsProvider.jsx';
import { PlaybackProvider } from './components/PlaybackContext.jsx';
import { LanguageProvider, getInitialLanguage } from './i18n/language.jsx';

export const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

// Data (TanStack Query + CMS content), language and video playback — shared by public pages and
// the dashboard, in the browser and in the build-time prerender.
export default function AppProviders({ queryClient, initialContent, children }) {
  const [lang, setLang] = useState(getInitialLanguage);
  const language = useMemo(() => ({ lang, ar: lang === 'ar', setLang }), [lang]);
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider value={language}>
        <CmsProvider initialContent={initialContent}>
          <PlaybackProvider>{children}</PlaybackProvider>
        </CmsProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
