import { Link } from 'react-router-dom';
import ArrowIcon from './ArrowIcon.jsx';
import Lines from './Lines.jsx';
import WhatsAppIcon from './WhatsAppIcon.jsx';
import { useContent } from '../cms/CmsProvider.jsx';
import { assetUrl, pick, whatsappUrl } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';
import '../styles/services.css';

// One service: identity icon, name, tagline, description, deliverables and two actions
// (details page first, service-specific WhatsApp chat second).
export function ServiceCard({ service, labels }) {
  const { lang, t } = useLanguage();
  const { settings } = useContent();
  const name = pick(service, 'name', lang);
  const titleId = `service-${service.slug}-title`;
  const whatsapp = whatsappUrl(settings.whatsapp_number, pick(service, 'whatsapp_message', lang));
  const deliverables = service.items.filter((item) => item.kind === 'deliverable');
  return (
    <article
      className="svc-card"
      id={service.slug}
      aria-labelledby={titleId}
      style={{ '--service-color': service.color || '#00ff87' }}
    >
      <div className="svc-card__head">
        <span className="svc-card__icon">
          {service.icon_url && <img src={assetUrl(service.icon_url)} alt="" loading="lazy" width="44" height="44" />}
        </span>
        <h3 className="svc-card__title" id={titleId}>
          {name}
        </h3>
      </div>
      <p className="svc-card__tagline">{pick(service, 'tagline', lang)}</p>
      <p className="svc-card__desc">{pick(service, 'description', lang)}</p>
      <ul className="svc-card__list">
        {deliverables.map((item) => (
          <li key={item.id}>{pick(item, 'title', lang)}</li>
        ))}
      </ul>
      <div className="svc-card__actions">
        <Link
          className="svc-btn svc-btn--primary"
          to={`/services/${service.slug}`}
          aria-label={t(`View details: ${name}`, `تفاصيل خدمة ${name}`)}
        >
          {labels.detailsLabel} <ArrowIcon char="↗" />
        </Link>
        {whatsapp && (
          <a
            className="svc-btn svc-btn--whatsapp"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(
              `Chat on WhatsApp about ${name} (opens in a new tab)`,
              `كلّمنا على واتساب عن ${name} (بيفتح في تبويب جديد)`
            )}
          >
            <WhatsAppIcon className="svc-btn__wa" />
            {labels.whatsappLabel}
          </a>
        )}
      </div>
    </article>
  );
}

export default function Services({ section: s }) {
  const { lang } = useLanguage();
  const { services } = useContent();
  return (
    <section className="service-section section" id="services" aria-labelledby="services-title">
      <div className="section-top">
        <span className="eyebrow">{s.eyebrow}</span>
        <span className="small-note">{s.note}</span>
      </div>
      <div className="work-heading">
        <h2 id="services-title">
          <Lines text={s.title} />
          <br />
          <span className="outline">
            <Lines text={s.titleOutline} />
          </span>
        </h2>
        <p>
          <Lines text={s.intro} />
        </p>
      </div>
      <div id="serviceCards" className="svc-grid">
        {services.map((service) => (
          // Keyed by language so cards are rebuilt on a language switch (keeps scroll anchoring as before).
          <ServiceCard key={lang + service.id} service={service} labels={s} />
        ))}
      </div>
    </section>
  );
}
