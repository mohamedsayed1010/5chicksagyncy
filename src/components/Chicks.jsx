import Lines from './Lines.jsx';
import { assetUrl } from '../cms/resolve.js';

export default function Chicks({ section: s }) {
  return (
    <section className="chicks section" id="chicks" aria-labelledby="chicks-title">
      <div className="section-top">
        <span className="eyebrow">{s.eyebrow}</span>
        <span className="small-note">{s.note}</span>
      </div>
      <div className="crew-heading">
        <h2 id="chicks-title">
          <Lines text={s.title} />
          <span>
            <Lines text={s.titleHighlight} />
          </span>
        </h2>
        <img className="heart-element" src={assetUrl(s.heartImage)} alt={s.heartAlt} loading="lazy" />
      </div>
      <div className="crew-stage">
        <span className="crew-side">{s.crewSideStart}</span>
        <img src={assetUrl(s.crewImage)} alt={s.crewAlt} loading="lazy" width="780" height="430" />
        <span className="crew-side">{s.crewSideEnd}</span>
      </div>
      <div className="dna-grid">
        {(s.traits || []).map((trait, i) => (
          <article key={i} style={{ '--accent': trait.accent }}>
            <span>{trait.label}</span>
            <img src={assetUrl(trait.image)} alt={trait.alt} loading="lazy" />
            <p>
              <Lines text={trait.text} />
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
