import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `vite preview` behaves like the Vercel deployment (vercel.json):
//   /services/branding → dist/services/branding.html (prerendered, "cleanUrls")
//   any other extension-less URL (/admin, new CMS slugs) → dist/spa.html (SPA fallback)
const previewRouting = {
  name: 'preview-routing',
  configurePreviewServer(server) {
    const dist = path.resolve(server.config.root, server.config.build.outDir);
    server.middlewares.use((req, res, next) => {
      const [pathname, query = ''] = req.url.split('?');
      if (pathname === '/') return next();
      // Files: served when they exist, otherwise a real 404 (no HTML fallback), like Vercel.
      if (/\.[a-z0-9]{1,8}$/i.test(pathname)) {
        if (fs.existsSync(path.join(dist, decodeURIComponent(pathname)))) return next();
        res.statusCode = 404;
        return res.end('Not found');
      }
      const clean = pathname.replace(/\/+$/, '');
      const file = fs.existsSync(path.join(dist, clean + '.html')) ? clean + '.html' : '/spa.html';
      req.url = file + (query ? '?' + query : '');
      next();
    });
  }
};

export default defineConfig(({ isSsrBuild }) => ({
  // Absolute base: the SPA serves nested routes such as /services/branding.
  base: '/',
  plugins: [react(), previewRouting],
  // Pre-bundle every runtime dependency up front (some are only reached through lazy chunks such as
  // the dashboard); otherwise the dev server re-optimizes on first use, which fails on Windows.
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', '@tanstack/react-query', '@supabase/supabase-js']
  },
  // The prerender (SSR) build only needs the JS, not a copy of the media folder.
  publicDir: isSsrBuild ? false : 'public',
  build: {
    // Bundles go to "static/" so they never mix with the public "assets/" media folder.
    assetsDir: 'static',
    rollupOptions: isSsrBuild
      ? {}
      : {
          input: {
            main: 'index.html',
            preview: 'portfolio-preview.html'
          }
        }
  }
}));
