import { useMemo } from 'react';
import Hero from '../components/Hero.jsx';
import Ticker from '../components/Ticker.jsx';
import About from '../components/About.jsx';
import Services from '../components/Services.jsx';
import Clients from '../components/Clients.jsx';
import Work from '../components/Work.jsx';
import Portfolio from '../components/Portfolio.jsx';
import Chicks from '../components/Chicks.jsx';
import Contact from '../components/Contact.jsx';
import { useContent } from '../cms/CmsProvider.jsx';
import { resolveSection } from '../cms/resolve.js';
import { homeSeo } from '../seo/seo.js';
import { usePageSeo } from '../seo/usePageSeo.js';
import { useLanguage } from '../i18n/language.jsx';

// Page sections the homepage can render, by CMS section key. Header/footer are part of the layout.
export const SECTION_COMPONENTS = { hero: Hero, ticker: Ticker, about: About, services: Services, clients: Clients, work: Work, portfolio: Portfolio, chicks: Chicks, contact: Contact };

// Renders the enabled sections of a page in their CMS order.
export function Sections({ page, only }) {
  const { lang } = useLanguage();
  const content = useContent();
  return content.sections
    .filter((s) => s.page_slug === page && SECTION_COMPONENTS[s.key] && (!only || only.includes(s.key)))
    .map((section) => {
      const Component = SECTION_COMPONENTS[section.key];
      return <Component key={section.id} section={resolveSection(section, lang)} />;
    });
}

export default function HomePage() {
  const content = useContent();
  usePageSeo(useMemo(() => homeSeo(content), [content]));
  return (
    <main id="top">
      <Sections page="home" />
    </main>
  );
}
