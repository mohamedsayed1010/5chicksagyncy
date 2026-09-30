import ArrowIcon from './ArrowIcon.jsx';
import Lines from './Lines.jsx';
import { assetUrl } from '../cms/resolve.js';
import { usePortfolioDialog } from './PlaybackContext.jsx';

export default function Portfolio({ section: s }) {
  const { dialog } = usePortfolioDialog();
  return (
    <section className="portfolio section" id="portfolio" aria-labelledby="portfolio-title">
      <div className="portfolio-art" aria-hidden="true">
        <img src={assetUrl(s.patternImage)} alt="" loading="lazy" />
        <img src={assetUrl(s.logoImage)} alt="" loading="lazy" />
        <span>{s.artText}</span>
      </div>
      <div className="portfolio-copy">
        <span className="eyebrow">{s.eyebrow}</span>
        <h2 id="portfolio-title">
          <Lines text={s.title} />
          <br />
          <span>
            <Lines text={s.titleHighlight} />
          </span>
        </h2>
        <p>{s.text}</p>
        <div className="portfolio-actions">
          <button type="button" id="openPortfolio" className="button primary" onClick={() => dialog.open()}>
            {s.viewLabel + ' '}
            <span><ArrowIcon char="↗" /></span>
          </button>
          <a className="download-link" href={assetUrl(s.pdfUrl)} download={s.pdfDownloadName}>
            {s.downloadLabel + ' '}
            <span><ArrowIcon char="↓" /></span>
          </a>
        </div>
        <span className="pdf-detail">{s.detail}</span>
      </div>
    </section>
  );
}
