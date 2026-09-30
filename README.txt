5CHICKS — Creative House

React (Vite) website with the supplied original brand assets and neon palette.
Develop: npm install, then npm run dev. Build: npm run build (output in dist/).

Included:
- Responsive brand-led hero with chrome artwork and neon identity accents
- Our Work navigation and three independent centred, swipeable video carousels
- Only the selected, visible video plays; keyboard, pause, mute and fullscreen controls
- Reduced-motion support, focus states, skip link and mobile layouts
- Original five dynamic logos, pattern, characters and identity elements
- In-page PDF portfolio viewer, direct PDF fallback and download
- Telephone contact from the supplied company portfolio

EDIT VIDEOS: src/data/work-data.js
GUIDE (Arabic): VIDEO-GUIDE.md
PDF: public/assets/5chicks-portfolio.pdf

Current videos are procedural DEMO motion clips from the original site, not client work.
Browser-compatible copies and covers are in assets/videos. Original assets remain intact.
Replace the demo media and descriptions with final projects before publishing.

Deploy: the contents of dist/ after npm run build.
Do not deploy tmp/ or the original design-source folders.
Portfolio preview: portfolio-preview.html (src/pages/PortfolioPreview.jsx) + public/assets/portfolio (faithful, lazy-loaded images of the original PDF).
When replacing the PDF content, regenerate its preview images too.

Company and services content: src/data/content-data.js
Content editing guide (Arabic): CONTENT-GUIDE.md
Service rendering: src/components/Services.jsx
Page order: company, services, three work collections, PDF portfolio, creative DNA, contact.

Arabic/English support: src/data/content-ar.js, src/i18n/language.jsx, src/components/ArrowIcon.jsx.
Default language: Arabic, with a persistent language switch and ?lang=ar / ?lang=en overrides.
Arrow buttons use inline SVG; decorative section/service numbering has been removed.
Client-logo carousel: src/data/clients-data.js, src/components/Clients.jsx and public/assets/clients/.
Empty client data shows clearly labelled preview spaces. Add supplied client logos to replace them.

REAL MEDIA UPDATE: 69 supplied videos replace the demos (55 reels / 6 films / 8 sketches).
Optimized files: public/assets/web-videos. Original files: public/assets/videos/<category> (do not publish originals).
See MEDIA-REPORT.md and VIDEO-GUIDE.md for current media instructions; earlier demo notes are superseded.
Videos now load only on active playback; only nearby covers load near the viewport.

SEO: page metadata, canonical/hreflang, Open Graph, Twitter and JSON-LD live in src/seo/seo.js.
Production URL: https://5chicks.vercel.app (change it in src/seo/seo.js, public/robots.txt and public/sitemap.xml).
npm run build also prerenders the English page into dist/index.html (scripts/prerender.mjs) so crawlers get real HTML.
Arabic is served at /?lang=ar (canonical + hreflang). portfolio-preview.html is noindex (dialog viewer only).
Images: client logos and video posters are WebP (quality chosen per image). Save new logos/posters as .webp.
Kept as JPG (WebP was not smaller): clients 1, 5, 10 and posters reels-160a5619b9, reels-6abdc96d80.
Open Graph image: public/assets/brand-logo.png (kept PNG for social-network compatibility).
