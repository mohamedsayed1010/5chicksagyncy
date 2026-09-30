import ArrowIcon from './ArrowIcon.jsx';
import Lines from './Lines.jsx';
import SmartLink from './SmartLink.jsx';
import { assetUrl } from '../cms/resolve.js';

export default function Hero({ section: s }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-topline">
        <span>
          <i className="live-dot"></i>
          {' ' + s.topline}
        </span>
        <span>{s.toplineEnd}</span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title">
            <Lines text={s.titleLine1} />
            <br />
            {s.titleLine2 || null}
            <span className="energy">
              {s.titleHighlight}
              <span className="period">.</span>
            </span>
          </h1>
          <div className="hero-description">
            <span className="mini-symbol"><ArrowIcon char="↳" /></span>
            <p id="companyHero">{s.description}</p>
          </div>
          <SmartLink className="button primary" href={s.buttonHref}>
            {s.buttonLabel + ' '}
            <span><ArrowIcon char="↘" /></span>
          </SmartLink>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <span className="art-coordinate coordinate-top">
            {s.coordinateTop + ' '}
            <ArrowIcon char="↗" />
          </span>
          <span className="art-coordinate coordinate-bottom">{s.coordinateBottom}</span>
          {s.heroVideo ? (
            // Optional: a hero video replaces the chrome artwork (the image becomes its poster).
            <video
              className="chrome-mark"
              src={assetUrl(s.heroVideo)}
              poster={assetUrl(s.chromeImage) || undefined}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              className="chrome-mark"
              src={assetUrl(s.chromeImage)}
              alt=""
              fetchPriority="high"
              width="650"
              height="750"
            />
          )}
          <div className="art-sticker">
            <img src={assetUrl(s.stickerImage)} alt="" />
            <span>
              <Lines text={s.sticker} />
            </span>
          </div>
          <span className="art-spark">✳</span>
          <div className="art-label">
            <span>{s.labelStrong}</span>
            {' ' + s.labelText}
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <span>{s.bottomText}</span>
        <div className="palette">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
        <SmartLink href={s.scrollHref}>
          {s.scrollLabel + ' '}
          <span><ArrowIcon char="↓" /></span>
        </SmartLink>
      </div>
    </section>
  );
}
