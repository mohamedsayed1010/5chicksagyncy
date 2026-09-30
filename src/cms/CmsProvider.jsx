import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApi, hasBackend } from './api/index.js';
import { normalizePublic, seedContent } from './normalize.js';
import { resolveSection } from './resolve.js';
import { useLanguage } from '../i18n/language.jsx';

export const PUBLIC_CONTENT_KEY = ['cms', 'public'];

// Content embedded into prerendered HTML at build time (see scripts/prerender.mjs).
function readSnapshot() {
  if (typeof document === 'undefined') return null;
  try {
    const node = document.getElementById('cms-snapshot');
    return node ? JSON.parse(node.textContent) : null;
  } catch {
    return null;
  }
}

const CmsContext = createContext(null);

// Renders immediately from the build-time snapshot (or the migrated seed), then refreshes the
// published content from the backend in the background. Admin saves invalidate PUBLIC_CONTENT_KEY.
export function CmsProvider({ initialContent, children }) {
  const initial = useMemo(() => initialContent || readSnapshot() || seedContent(), [initialContent]);
  const query = useQuery({
    queryKey: PUBLIC_CONTENT_KEY,
    queryFn: async () => normalizePublic(await (await getApi()).fetchPublicRows()),
    enabled: hasBackend && typeof window !== 'undefined',
    initialData: initial,
    initialDataUpdatedAt: 0,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1
  });
  const value = useMemo(
    () => ({
      content: query.data,
      // True until the first backend response when a backend is configured.
      loading: hasBackend && query.isFetching && query.dataUpdatedAt === 0,
      error: query.error
    }),
    [query.data, query.isFetching, query.dataUpdatedAt, query.error]
  );
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export const useCms = () => useContext(CmsContext);
export const useContent = () => useCms().content;

// A page section resolved for the current language (null when missing or disabled).
export function useSection(key, page = 'home') {
  const { lang } = useLanguage();
  const content = useContent();
  const section = content.sections.find((s) => s.page_slug === page && s.key === key);
  return useMemo(() => resolveSection(section, lang), [section, lang]);
}

export const useSettings = () => useContent().settings;
