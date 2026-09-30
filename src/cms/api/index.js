// Picks the CMS backend: Supabase (production), the dev-only mock, or none (static seed content).
import { BACKEND } from '../config.js';

let apiPromise;

export function getApi() {
  if (!apiPromise)
    apiPromise = (async () => {
      // The condition is written out here so production builds (DEV === false) drop the mock entirely.
      if (import.meta.env.DEV && import.meta.env.VITE_CMS_MOCK === 'true') return (await import('./mockApi.js')).createMockApi();
      // Loaded on demand so supabase-js is not part of the initial public bundle.
      if (BACKEND === 'supabase') return (await import('./supabaseApi.js')).createSupabaseApi();
      return null;
    })();
  return apiPromise;
}

export const hasBackend = BACKEND !== 'none';
