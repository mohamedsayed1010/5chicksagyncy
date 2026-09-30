import { useLayoutEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatch } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import FloatingWhatsApp from '../components/FloatingWhatsApp.jsx';
import PortfolioDialog from '../components/PortfolioDialog.jsx';
import { useContent, useSection } from '../cms/CmsProvider.jsx';
import { pick } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';

const isServer = typeof document === 'undefined';

// The site uses `scroll-behavior: smooth` for in-page anchors. When the route changes, the new page
// should start at its position instantly instead of animating from the previous page's scroll
// position, so smooth scrolling is paused for the frame in which ScrollRestoration scrolls.
// Rendered before <ScrollRestoration /> so this layout effect runs first.
function InstantRouteScroll() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => root.style.removeProperty('scroll-behavior')));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}

// Shared frame of every public page, in the same DOM order as the original site:
// skip link + header, page <main>, footer, floating WhatsApp, portfolio dialog.
export default function PublicLayout() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const content = useContent();
  const template = useSection('service-template', 'services');
  const isHome = pathname === '/';
  // On a service page the floating button carries that service's prefilled message.
  const serviceMatch = useMatch('/services/:slug');
  const service = serviceMatch && content.services.find((s) => s.slug === serviceMatch.params.slug);
  return (
    <>
      <Header skipHref={isHome ? undefined : '#top'} skipLabel={isHome ? undefined : template?.skipLabel} />
      <Outlet />
      <Footer />
      <FloatingWhatsApp message={service ? pick(service, 'whatsapp_message', lang) : undefined} />
      <PortfolioDialog />
      {/* Scroll to top (or #hash) on navigation, restore positions on back/forward. */}
      {!isServer && <InstantRouteScroll />}
      {!isServer && <ScrollRestoration />}
    </>
  );
}
