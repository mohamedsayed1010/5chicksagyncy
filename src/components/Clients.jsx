import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lines from './Lines.jsx';
import { useContent } from '../cms/CmsProvider.jsx';
import { assetUrl, pick } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';

const reducedMotionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)');

function ClientLogo({ client, hidden, failed, onError, placeholder }) {
  const { lang } = useLanguage();
  if (!client)
    return (
      <div className="client-logo client-placeholder" role="listitem" aria-hidden="true">
        <span className="placeholder-mark">LOGO</span>
        <span>{placeholder}</span>
      </div>
    );
  const name = pick(client, 'name', lang);
  const className = client.theme === 'dark' ? 'client-logo client-logo-dark' : 'client-logo';
  const logo = failed ? (
    <span className="client-name">{name}</span>
  ) : (
    <img src={assetUrl(client.logo_url)} alt={name} decoding="async" onError={onError} />
  );
  // A client with a website links to it; otherwise the logo is a plain list item (as before).
  return client.url ? (
    <a
      className={className}
      role="listitem"
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={hidden ? 'true' : undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      {logo}
    </a>
  ) : (
    <div className={className} role="listitem" aria-hidden={hidden ? 'true' : undefined}>
      {logo}
    </div>
  );
}

export default function Clients({ section: s }) {
  const { lang } = useLanguage();
  const { clients } = useContent();
  const sectionRef = useRef(null);
  const [paused, setPaused] = useState(() => reducedMotionQuery().matches);
  const [explicitlyPlaying, setExplicitlyPlaying] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [background, setBackground] = useState(false);
  const [metrics, setMetrics] = useState({ width: 0, narrow: false });
  const [failedLogos, setFailedLogos] = useState({});

  // Enough logos to fill the strip; re-measured only when the section width changes.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const measure = () => setMetrics({ width: section.clientWidth, narrow: innerWidth < 600 });
    measure();
    let previousWidth = 0;
    const resizeObserver = new ResizeObserver((entries) => {
      const width = Math.round(entries[0].contentRect.width);
      if (width !== previousWidth) {
        previousWidth = width;
        measure();
      }
    });
    resizeObserver.observe(section);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const reducedMotion = reducedMotionQuery();
    const onMotionChange = () => {
      setPaused(reducedMotion.matches);
      setExplicitlyPlaying(false);
    };
    const onVisibility = () => setBackground(document.hidden);
    const intersectionObserver = new IntersectionObserver(
      (entries) => setOffscreen(!entries[0].isIntersecting),
      { threshold: 0 }
    );
    intersectionObserver.observe(section);
    reducedMotion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const withLogos = clients.filter((client) => client.logo_url);
  const source = withLogos.length ? withLogos : Array.from({ length: 6 }, () => null);
  const minimum = Math.ceil(metrics.width / (metrics.narrow ? 170 : 228)) + 1;
  const count = Math.max(source.length, Math.ceil(minimum / source.length) * source.length);

  const sectionClass = ['clients', 'section'];
  if (paused) sectionClass.push('clients-paused');
  if (explicitlyPlaying) sectionClass.push('clients-manual-play');
  if (offscreen) sectionClass.push('clients-offscreen');
  if (background) sectionClass.push('clients-background');

  const toggleMotion = () => {
    setExplicitlyPlaying(paused);
    setPaused(!paused);
  };

  return (
    <section ref={sectionRef} className={sectionClass.join(' ')} id="clients" aria-labelledby="clients-title">
      <div className="section-top">
        <span className="eyebrow">{s.eyebrow}</span>
        <span className="small-note">{s.note}</span>
      </div>
      <div className="clients-heading">
        <h2 id="clients-title">
          <Lines text={s.title} />
          <br />
          <span>
            <Lines text={s.titleHighlight} />
          </span>
        </h2>
        <div className="clients-intro">
          <p>
            <Lines text={s.intro} />
          </p>
          <button
            type="button"
            className="clients-toggle"
            id="clientsToggle"
            aria-pressed={String(paused)}
            onClick={toggleMotion}
          >
            {paused ? s.playLabel : s.pauseLabel}
          </button>
        </div>
      </div>
      <div className="clients-window" aria-label={s.windowLabel}>
        {/* Two matching groups keep the logo strip seamless when it loops. */}
        <div
          className="clients-track"
          id="clientsTrack"
          style={{ '--clients-duration': Math.max(24, count * 3.5) + 's' }}
        >
          {[0, 1].map((groupIndex) => (
            <div
              key={lang + groupIndex}
              className="clients-group"
              role="list"
              aria-hidden={groupIndex ? 'true' : undefined}
              inert={groupIndex ? true : undefined}
            >
              {Array.from({ length: count }, (_, i) => {
                const client = source[i % source.length];
                return (
                  <ClientLogo
                    key={i}
                    client={client}
                    hidden={i >= source.length}
                    placeholder={s.placeholder}
                    failed={client && failedLogos[client.logo_url]}
                    onError={() => setFailedLogos((failed) => ({ ...failed, [client.logo_url]: true }))}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="clients-note" id="clientsNote" hidden={withLogos.length > 0}>
        {withLogos.length ? '' : s.emptyNote}
      </p>
    </section>
  );
}
