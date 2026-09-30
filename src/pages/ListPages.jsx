// /services, /portfolio and /contact reuse the homepage sections (same CMS content, same design).
import { useMemo } from 'react';
import Lines from '../components/Lines.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { Sections } from './HomePage.jsx';
import { useContent, useSection } from '../cms/CmsProvider.jsx';
import { listPageSeo } from '../seo/seo.js';
import { usePageSeo } from '../seo/usePageSeo.js';
import '../styles/cms-pages.css';

function useListSeo(slug, path) {
  const content = useContent();
  usePageSeo(useMemo(() => listPageSeo(content, slug, path), [content, slug, path]));
}

export function ServicesPage() {
  useListSeo('services', '/services');
  return (
    <main id="top">
      <Sections page="home" only={['services']} />
    </main>
  );
}

export function ContactPage() {
  useListSeo('contact', '/contact');
  return (
    <main id="top">
      <Sections page="home" only={['contact']} />
    </main>
  );
}

export function ProjectsGrid({ projects, eyebrow, title }) {
  if (!projects.length) return null;
  return (
    <section className="section projects-section" aria-labelledby="projects-title">
      <div className="section-top">
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="projects-title" id="projects-title">
        <Lines text={title} />
      </h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export function PortfolioPage() {
  useListSeo('portfolio', '/portfolio');
  const { projects } = useContent();
  const portfolio = useSection('portfolio');
  return (
    <main id="top">
      <Sections page="home" only={['portfolio']} />
      <ProjectsGrid projects={projects} eyebrow={portfolio?.eyebrow} title={portfolio?.projectsTitle} />
      <Sections page="home" only={['work']} />
    </main>
  );
}
