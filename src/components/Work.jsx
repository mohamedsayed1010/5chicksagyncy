import { useState } from 'react';
import WorkCarousel from './WorkCarousel.jsx';
import Lines from './Lines.jsx';
import SmartLink from './SmartLink.jsx';
import { withIcons } from './ArrowIcon.jsx';
import { useContent } from '../cms/CmsProvider.jsx';
import { pick } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';
import { usePlayback } from './PlaybackContext.jsx';

// The Work section: one carousel per enabled CMS slider (reels, films, sketches, ...).
export default function Work({ section: s }) {
  const { lang } = useLanguage();
  const { sliders } = useContent();
  const controller = usePlayback();
  // Sound is shared by every video on the page.
  const [muted, setMuted] = useState(true);

  return (
    <section className="work section" id="work" aria-labelledby="work-title">
      <div className="section-top">
        <span className="eyebrow">{s.eyebrow}</span>
        <span className="small-note">{s.note}</span>
      </div>
      <div className="work-heading">
        <h2 id="work-title">
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
      <nav className="work-jumps" aria-label={s.jumpNavLabel}>
        {sliders.map((slider) => (
          <SmartLink key={slider.id} href={'#' + slider.key}>
            {withIcons((pick(slider, 'nav_label', lang) || pick(slider, 'title', lang)) + ' ↓')}
          </SmartLink>
        ))}
      </nav>
      {sliders.map((slider) => (
        <section key={slider.id} className="work-row" id={slider.key} aria-labelledby={slider.key + '-title'}>
          <div className="row-heading">
            <div>
              <span className="eyebrow">{s.collectionLabel}</span>
              <h3 id={slider.key + '-title'}>{pick(slider, 'title', lang)}</h3>
            </div>
            <p>{pick(slider, 'description', lang)}</p>
          </div>
          <WorkCarousel
            // Rebuilt when the slides change, so edited content is picked up cleanly.
            key={slider.slides.map((slide) => slide.id + slide.updated_at).join('|')}
            category={slider.key}
            arabicName={slider.title_ar}
            items={slider.slides}
            controller={controller}
            muted={muted}
            onToggleMute={() => setMuted((value) => !value)}
          />
        </section>
      ))}
      <p className="preview-note">{s.previewNote}</p>
    </section>
  );
}
