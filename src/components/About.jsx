import ArrowIcon from './ArrowIcon.jsx';
import Lines from './Lines.jsx';
import SmartLink from './SmartLink.jsx';
import { assetUrl } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';

export default function About({ section: s }) {
  const { lang } = useLanguage();
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="section-top">
        <span className="eyebrow">{s.eyebrow}</span>
        <img className="small-brand" src={assetUrl(s.symbolImage)} alt="" loading="lazy" />
      </div>
      <div className="about-layout">
        <h2 id="about-title">
          <Lines text={s.title} />
          <br />
          <span>
            <Lines text={s.titleHighlight} />
          </span>
        </h2>
        <div className="about-details">
          <p className="large-copy" id="companyLead">
            {s.lead}
          </p>
          <div id="companyParagraphs">
            {(s.paragraphs || []).map((paragraph, index) => (
              // Keyed by language so paragraphs are rebuilt on a language switch (scroll anchoring).
              <p key={lang + index}>{paragraph.text}</p>
            ))}
          </div>
          <SmartLink className="text-link" href={s.linkHref}>
            {s.linkLabel + ' '}
            <span><ArrowIcon char="↓" /></span>
          </SmartLink>
        </div>
      </div>
      <div className="company-principles">
        <article>
          <span>{s.missionLabel}</span>
          <p id="companyMission">{s.mission}</p>
        </article>
        <article>
          <span>{s.visionLabel}</span>
          <p id="companyVision">{s.vision}</p>
        </article>
      </div>
    </section>
  );
}
