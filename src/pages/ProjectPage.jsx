import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArrowIcon from '../components/ArrowIcon.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { NotFoundPage, PageLoading } from './StatusPages.jsx';
import { useCms, useSection } from '../cms/CmsProvider.jsx';
import { assetUrl, paragraphs, pick, whatsappUrl } from '../cms/resolve.js';
import { projectSeo } from '../seo/seo.js';
import { usePageSeo } from '../seo/usePageSeo.js';
import { useLanguage } from '../i18n/language.jsx';
import '../styles/services.css';
import '../styles/cms-pages.css';

function GalleryItem({ item, lang, title }) {
  const alt = pick(item, 'alt', lang) || title;
  if (item.kind === 'video')
    return (
      <figure className="project-media project-media--video">
        <video
          src={assetUrl(item.url)}
          poster={item.poster_url ? assetUrl(item.poster_url) : undefined}
          controls
          preload="none"
          playsInline
          aria-label={alt}
        />
      </figure>
    );
  return (
    <figure className="project-media">
      <img
        src={assetUrl(item.url)}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={item.width || undefined}
        height={item.height || undefined}
      />
    </figure>
  );
}

function ProjectDetail({ project }) {
  const { lang, t } = useLanguage();
  const { content } = useCms();
  const portfolio = useSection('portfolio');
  usePageSeo(useMemo(() => projectSeo(content, project), [content, project]));
  const title = pick(project, 'title', lang);
  const service = content.services.find((s) => s.id === project.service_id);
  const whatsapp = whatsappUrl(
    content.settings.whatsapp_number,
    t(`Hello 5CHICKS, I saw your project "${title}" and I'd like to talk about a similar project.`,
      `مرحبًا 5CHICKS، شفت مشروع "${title}" وحابب أتكلم معاكم عن مشروع شبهه.`)
  );
  const others = content.projects.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <main id="top" className="project-page" style={{ '--service-color': service?.color || '#00ff87' }}>
      <section className="project-hero" aria-labelledby="project-title">
        <nav className="sp-crumbs" aria-label={t('Breadcrumb', 'مسار التنقل')}>
          <ol>
            <li><Link to="/">{content.settings.site_name}</Link></li>
            <li><Link to="/portfolio">{pick(content.pages.portfolio, 'title', lang)}</Link></li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        {project.category && <span className="eyebrow">{project.category}</span>}
        <h1 id="project-title">{title}</h1>
        <div className="project-hero__meta">
          {project.client && (
            <p><span>{t('Client', 'العميل')}</span>{project.client}</p>
          )}
          {service && (
            <p>
              <span>{t('Service', 'الخدمة')}</span>
              <Link to={`/services/${service.slug}`}>{pick(service, 'name', lang)}</Link>
            </p>
          )}
          {project.tags?.length > 0 && (
            <p><span>{t('Tags', 'الوسوم')}</span>{project.tags.join(' · ')}</p>
          )}
        </div>
        {paragraphs(pick(project, 'description', lang)).map((text) => (
          <p className="project-hero__text" key={text}>{text}</p>
        ))}
        <div className="sp-actions">
          {whatsapp && (
            <a className="svc-btn svc-btn--primary sp-btn" href={whatsapp} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="svc-btn__wa" />
              {t('Chat on WhatsApp', 'كلّمنا على واتساب')}
            </a>
          )}
          {project.external_url && (
            <a className="svc-btn svc-btn--ghost sp-btn" href={project.external_url} target="_blank" rel="noopener noreferrer">
              {t('Visit project', 'زور المشروع')} <ArrowIcon char="↗" />
            </a>
          )}
        </div>
      </section>

      {project.cover_url && (
        <div className="project-cover">
          <img src={assetUrl(project.cover_url)} alt={title} fetchPriority="high" />
        </div>
      )}

      {project.media.length > 0 && (
        <section className="section project-gallery" aria-label={t('Gallery', 'معرض الصور')}>
          {project.media.map((item) => (
            <GalleryItem key={item.id} item={item} lang={lang} title={title} />
          ))}
        </section>
      )}

      {others.length > 0 && (
        <section className="section projects-section" aria-labelledby="more-projects">
          <h2 className="projects-title" id="more-projects">{portfolio?.projectsTitle}</h2>
          <div className="projects-grid">
            {others.map((other) => <ProjectCard key={other.id} project={other} />)}
          </div>
        </section>
      )}
    </main>
  );
}

// /portfolio/:slug — any published project works here without a dedicated component.
export default function ProjectPage() {
  const { slug } = useParams();
  const { content, loading } = useCms();
  const project = content.projects.find((p) => p.slug === slug);
  if (project) return <ProjectDetail key={project.id} project={project} />;
  return loading ? <PageLoading /> : <NotFoundPage />;
}
