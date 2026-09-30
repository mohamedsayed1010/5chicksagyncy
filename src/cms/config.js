// Runtime configuration. Only the public (anon/publishable) key is ever used in the browser;
// write access is enforced by Supabase Auth + Row Level Security, never by this code.
// import.meta.env.* is used directly (not through a variable) so Vite can replace the values at
// build time and remove code that can never run in production.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://5chicks.vercel.app').replace(/\/+$/, '');

// Dev-only in-memory backend for working on the dashboard without Supabase (`npm run dev` with
// VITE_CMS_MOCK=true). import.meta.env.DEV is the constant `false` in production builds.
export const MOCK_MODE = import.meta.env.DEV && import.meta.env.VITE_CMS_MOCK === 'true';

export const BACKEND = MOCK_MODE ? 'mock' : SUPABASE_URL && SUPABASE_ANON_KEY ? 'supabase' : 'none';

export const MEDIA_BUCKET = 'media';
