import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArrowIcon from '../components/ArrowIcon.jsx';
import Lines from '../components/Lines.jsx';
import SmartLink from '../components/SmartLink.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { ProjectsGrid } from './ListPages.jsx';
import { NotFoundPage, PageLoading } from './StatusPages.jsx';
import { useCms, useSection } from '../cms/CmsProvider.jsx';
import { assetUrl, paragraphs, pick, telHref, whatsappUrl } from '../cms/resolve.js';
import { serviceSeo } from '../seo/seo.js';
import { usePageSeo } from '../seo/usePageSeo.js';
import { useLanguage } from '../i18n/language.jsx';
import '../styles/services.css';
import '../styles/service-page.css';

const RELATED_WORK_LABEL = { '#reels': 'relatedReels', '#work': 'relatedWork', '#portfolio': 'relatedPortfolio' };

function SectionTop({ eyebrow, note }) {
  return (
    <div className="section-top">
      <span className="eyebrow">{eyebrow}</span>
      {note && <span className="small-note">{note}</span>}
    </div>
  );
}

function ServiceDetail({ service }) {
  const { lang, t } = useLanguage();
  const { content } = useCms();
  const s = useSection('service-template', 'services');
  const { settings } = content;
  usePageSeo(useMemo(() => serviceSeo(content, service), [content, service]));

  const name = pick(service, 'name', lang);
  const whatsapp = whatsappUrl(settings.whatsapp_number, pick(service, 'whatsapp_message', lang));
  const items = (kind) => service.items.filter((item) => item.kind === kind);
  const others = content.services.filter((other) => other.id !== service.id);
  const projects = content.projects.filter((project) => project.service_id === service.id);
  const relatedLabel = s[RELATED_WORK_LABEL[service.work_link]];
  const waLabel = t(`Chat on WhatsApp about ${name} (opens in a new tab)`, `كلّمنا على واتساب عن ${name} (بيفتح في تبويب جديد)`);
  const phone = telHref(settings.phone);
  const offers = items('deliverable');
  const process = items('process');
  const values = items('value');
  const faq = items('faq');

  return (
    <main id="top" className="sp" style={{ '--service-color': service.color }}>
      <section className="sp-hero" aria-labelledby="sp-title">
        <div className="sp-hero__copy">
          <nav className="sp-crumbs" aria-label={s.breadcrumbLabel}>
            <ol>
              <li>
                <Link to="/">{settings.site_name}</Link>
              </li>
              <li>
                <Link to="/#services">{s.servicesLabel}</Link>
              </li>
              <li aria-current="page">{name}</li>
            </ol>
          </nav>
          <span className="eyebrow sp-eyebrow">{s.eyebrow}</span>
          <h1 className="sp-title" id="sp-title">
            {name}
          </h1>
          <p className="sp-lead">{pick(service, 'tagline', lang)}</p>
          <p className="sp-desc">{pick(service, 'description', lang)}</p>
          <div className="sp-actions">
            {whatsapp && (
              <a className="svc-btn svc-btn--primary sp-btn" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={waLabel}>
                <WhatsAppIcon className="svc-btn__wa" />
                {s.whatsappLabel}
              </a>
            )}
            <Link className="svc-btn svc-btn--ghost sp-btn" to="/#services">
              {s.allServicesLabel}
            </Link>
          </div>
        </div>
        <div className="sp-hero__visual" aria-hidden="true">
          <span className="sp-orbit"></span>
          {(service.hero_image_url || service.icon_url) && (
            <img src={assetUrl(service.hero_image_url || service.icon_url)} alt="" width="240" height="240" fetchPriority="high" />
          )}
        </div>
      </section>

      {paragraphs(pick(service, 'overview', lang)).length > 0 && (
        <section className="section sp-overview" aria-labelledby="sp-overview-title">
          <SectionTop eyebrow={s.overviewEyebrow} />
          <div className="sp-overview__grid">
            <h2 className="sp-h2" id="sp-overview-title">
              {s.overviewTitle}
            </h2>
            <div className="sp-overview__text">
              {paragraphs(pick(service, 'overview', lang)).map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {offers.length > 0 && (
        <section className="section sp-offers" aria-labelledby="sp-offers-title">
          <SectionTop eyebrow={s.offersEyebrow} note={s.offersNote} />
          <h2 className="sp-h2" id="sp-offers-title">
            {s.offersTitle}
          </h2>
          <div className="sp-offers__grid">
            {offers.map((item) => (
              <article className="sp-offer" key={item.id}>
                <h3>{pick(item, 'title', lang)}</h3>
                {pick(item, 'body', lang) && <p>{pick(item, 'body', lang)}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {process.length > 0 && (
        <section className="section sp-process" aria-labelledby="sp-process-title">
          <SectionTop eyebrow={s.processEyebrow} note={s.processNote} />
          <h2 className="sp-h2" id="sp-process-title">
            {s.processTitle}
          </h2>
          <p className="sp-note">{s.processIntro}</p>
          <ol className="sp-steps">
            {process.map((item) => (
              <li className="sp-step" key={item.id}>
                <h3>{pick(item, 'title', lang)}</h3>
                <p>{pick(item, 'body', lang)}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {values.length > 0 && (
        <section className="section sp-value" aria-labelledby="sp-value-title">
          <SectionTop eyebrow={s.valueEyebrow} />
          <h2 className="sp-h2" id="sp-value-title">
            {s.valueTitle}
          </h2>
          <div className="sp-value__grid">
            {values.map((item) => (
              <article key={item.id}>
                <h3>{pick(item, 'title', lang)}</h3>
                <p>{pick(item, 'body', lang)}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="section sp-faq" aria-labelledby="sp-faq-title">
          <SectionTop eyebrow={s.faqEyebrow} />
          <div className="sp-faq__grid">
            <div>
              <h2 className="sp-h2" id="sp-faq-title">
                {s.faqTitle}
              </h2>
              {relatedLabel && (
                <SmartLink className="sp-related" href={service.work_link.startsWith('#') ? '/' + service.work_link : service.work_link}>
                  {relatedLabel} <ArrowIcon char="↗" />
                </SmartLink>
              )}
            </div>
            <div className="sp-faq__list">
              {faq.map((item) => (
                <details key={item.id}>
                  <summary>{pick(item, 'title', lang)}</summary>
                  <p>{pick(item, 'body', lang)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProjectsGrid projects={projects} eyebrow={s.projectsEyebrow} title={s.projectsTitle} />

      {others.length > 0 && (
        <section className="section sp-others" aria-labelledby="sp-others-title">
          <SectionTop eyebrow={s.othersEyebrow} note={s.othersNote} />
          <h2 className="sp-h2" id="sp-others-title">
            {s.othersTitle}
          </h2>
          <ul className="sp-others__grid">
            {others.map((other) => (
              <li key={other.id}>
                <Link className="sp-other" to={`/services/${other.slug}`} style={{ '--service-color': other.color }}>
                  {other.icon_url && <img src={assetUrl(other.icon_url)} alt="" loading="lazy" width="40" height="40" />}
                  <span className="sp-other__text">
                    <span className="sp-other__title">{pick(other, 'name', lang)}</span>
                    <span className="sp-other__tagline">{pick(other, 'tagline', lang)}</span>
                  </span>
                  <ArrowIcon char="↗" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="contact section sp-cta" aria-labelledby="sp-cta-title">
        <div className="contact-pattern" aria-hidden="true"></div>
        <div className="contact-content">
          <span className="eyebrow">{s.ctaEyebrow}</span>
          <h2 id="sp-cta-title">
            <Lines text={s.ctaTitle} />
            <span>
              <Lines text={s.ctaHighlight} />
            </span>
          </h2>
          <div className="contact-bottom">
            {whatsapp && (
              <a className="button dark" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={waLabel}>
                {s.ctaButton + ' '}
                <span>
                  <WhatsAppIcon className="sp-cta__wa" />
                </span>
              </a>
            )}
            {phone && (
              <a className="phone-link" href={phone}>
                {(settings.phone_display || settings.phone) + ' '}<span><ArrowIcon char="↗" /></span>
              </a>
            )}
            <p>
              <Lines text={s.ctaClosing} />
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// /services/:slug — any published service works here without a dedicated component.
export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { content, loading } = useCms();
  const service = content.services.find((s) => s.slug === slug);
  if (service) return <ServiceDetail key={service.id} service={service} />;
  return loading ? <PageLoading /> : <NotFoundPage />;
}
