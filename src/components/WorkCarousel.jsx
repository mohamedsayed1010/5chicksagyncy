import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ArrowIcon, { withIcons } from './ArrowIcon.jsx';
import SmartLink from './SmartLink.jsx';
import { assetUrl } from '../cms/resolve.js';
import { translateUI, useLanguage } from '../i18n/language.jsx';

// Arabic collection names used in the carousel's accessible labels (CMS title as fallback).
const ARABIC_COLLECTION = { reels: 'الريلز', films: 'الأفلام', sketches: 'السكتشات' };

// A slide's text for the current language (Arabic falls back to English).
const slideTitle = (item, ar, ui) => (ar ? item.title_ar || ui(item.title_en) : item.title_en);

function Slide({
  item,
  card,
  row,
  index,
  total,
  category,
  isActive,
  labelsVersion,
  offset,
  layout,
  inRange,
  muted,
  controller,
  onActivate,
  onToggleMute
}) {
  const { lang, ar } = useLanguage();
  const ui = (text) => translateUI(text, lang);
  // The play glyph follows play/pause events; the status and labels are also
  // re-read from the video whenever the row changes slide or the language changes.
  const [playing, setPlaying] = useState(false);
  const [labelPlaying, setLabelPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);

  useLayoutEffect(() => {
    if (!card.video) return;
    setLabelPlaying(!card.video.paused);
    setFullscreenError(false);
  }, [labelsVersion, lang, card]);

  const title = slideTitle(item, ar, ui);
  const badge = ar
    ? item.label_ar || ui(item.label_en || category.toUpperCase())
    : item.label_en || category.toUpperCase();
  const isVideo = Boolean(item.video_url);
  const status = fullscreenError
    ? 'FULLSCREEN UNAVAILABLE'
    : error
      ? 'VIDEO UNAVAILABLE'
      : labelPlaying
        ? '● NOW PLAYING'
        : 'READY TO PLAY';

  const update = () => {
    const video = card.video;
    const isPlaying = !video.paused && !video.ended;
    setPlaying(isPlaying);
    setLabelPlaying(isPlaying);
    setFullscreenError(false);
  };

  const onPlay = () => {
    const video = card.video;
    if (controller.getPlaybackTarget() !== video) {
      video.pause();
      return;
    }
    controller.pauseOthers(video);
    update();
  };

  const onPlayClick = () => {
    if (index !== row.active) return;
    controller.manualRow = row;
    if (card.video.paused) {
      row.userPaused = false;
      row.manual = true;
      controller.syncPlayback();
    } else {
      row.userPaused = true;
      card.video.pause();
    }
  };

  const onFullscreenClick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (card.slide.requestFullscreen) await card.slide.requestFullscreen();
      else if (card.video.webkitEnterFullscreen) card.video.webkitEnterFullscreen();
    } catch {
      setFullscreenError(true);
    }
  };

  // Transform, stacking and visibility are only applied once slide widths are measured.
  let style;
  let visible;
  if (layout) {
    const centerWidth = layout.widths[row.active];
    const width = layout.widths[index];
    const distance =
      offset === 0
        ? 0
        : Math.sign(offset) *
          (centerWidth / 2 +
            width / 2 +
            (layout.viewportWidth < 600 ? 22 : 36) +
            (Math.abs(offset) - 1) * (width + 36));
    visible = Math.abs(offset) <= 1;
    style = {
      transform: `translateX(calc(-50% + ${distance}px)) scale(${offset === 0 ? 1 : 0.88})`,
      zIndex: offset === 0 ? 5 : 4 - Math.min(Math.abs(offset), 3),
      visibility: visible ? 'visible' : 'hidden'
    };
  }
  const buttonTabIndex = isActive ? 0 : -1;

  return (
    <article
      ref={(el) => {
        card.slide = el;
      }}
      className={isActive ? 'slide is-active' : 'slide'}
      data-category={category}
      role="group"
      aria-roledescription={ar ? 'شريحة' : 'slide'}
      aria-label={
        ar
          ? `${index + 1} من ${total}: ${title}`
          : `${index + 1} of ${total}: ${title}`
      }
      aria-hidden={layout ? String(!visible) : undefined}
      style={style}
    >
      {isVideo ? (
      <video
        ref={(el) => {
          card.video = el;
        }}
        preload="none"
        muted={muted}
        loop
        playsInline
        aria-label={title}
        poster={layout && visible && inRange && item.poster_url ? assetUrl(item.poster_url) : undefined}
        onPlay={onPlay}
        onPause={update}
        onError={() => {
          card.error = true;
          setError(true);
          update();
        }}
        onLoadedMetadata={() => {
          const video = card.video;
          if (card.resumeTime > 0 && card.resumeTime < video.duration)
            video.currentTime = card.resumeTime;
        }}
      />
      ) : (
        <img
          className="slide-image"
          src={layout && visible && inRange ? assetUrl(item.image_url) : undefined}
          alt={title}
        />
      )}
      <div className="slide-top">
        <span className="slide-badge">{badge}</span>
        <span className="slide-live">{ui(status)}</span>
      </div>
      <button
        type="button"
        className="slide-activate"
        aria-label={(ar ? 'عرض ' : 'Show ') + title}
        tabIndex={layout && visible && offset !== 0 ? 0 : -1}
        onClick={onActivate}
      >
        <span>{withIcons(title + ' ↗')}</span>
      </button>
      {isVideo && (
      <div className="video-controls">
        <button
          type="button"
          className="play-button"
          aria-label={ui(labelPlaying ? 'Pause video' : 'Play video')}
          tabIndex={buttonTabIndex}
          onClick={onPlayClick}
        >
          {playing ? 'Ⅱ' : '▶'}
        </button>
        <span className="video-status">
          {ui(error ? 'VIDEO UNAVAILABLE' : muted ? 'SOUND OFF' : 'SOUND ON')}
        </span>
        <button
          type="button"
          className="sound-button"
          aria-label={ui(muted ? 'Unmute video' : 'Mute video')}
          aria-pressed={String(!muted)}
          tabIndex={buttonTabIndex}
          onClick={onToggleMute}
        >
          ♪
        </button>
        <button
          type="button"
          className="fullscreen-button"
          aria-label={ui('Show video fullscreen')}
          tabIndex={buttonTabIndex}
          onClick={onFullscreenClick}
        >
          ⛶
        </button>
      </div>
      )}
    </article>
  );
}

export default function WorkCarousel({
  category,
  arabicName,
  items,
  controller,
  muted,
  onToggleMute
}) {
  const { lang, ar } = useLanguage();
  const [active, setActive] = useState(0);
  const [layout, setLayout] = useState(null);
  const [inRange, setInRange] = useState(false);
  const [labelsVersion, setLabelsVersion] = useState(0);
  const stageRef = useRef(null);
  const suppressClickUntil = useRef(0);
  const pointerStart = useRef(null);

  // Mutable playback state shared with the controller (not rendered directly).
  const rowRef = useRef(null);
  if (!rowRef.current)
    rowRef.current = {
      cards: items.map((item) => ({
        src: assetUrl(item.video_url),
        slide: null,
        video: null,
        resumeTime: 0,
        pending: false,
        error: false
      })),
      active: 0,
      userPaused: false,
      manual: false,
      transitioning: false,
      timer: 0
    };
  const row = rowRef.current;
  const count = items.length;

  const measure = () => {
    if (!row.cards.length) return;
    setLayout({
      widths: row.cards.map((card) => card.slide.offsetWidth),
      viewportWidth: innerWidth
    });
  };

  const select = (index) => {
    if (!count) return;
    row.cards.forEach((card) => card.video?.pause());
    row.active = (index + count) % count;
    row.transitioning = true;
    row.userPaused = false;
    row.manual = false;
    if (controller.manualRow === row) controller.manualRow = null;
    setActive(row.active);
    setLabelsVersion((version) => version + 1);
    clearTimeout(row.timer);
    row.timer = setTimeout(
      () => {
        row.transitioning = false;
        controller.syncPlayback();
      },
      controller.reducedMotion.matches ? 0 : 650
    );
  };

  useLayoutEffect(measure, [active]);

  useEffect(() => {
    const unregister = controller.register(row);
    if (count) select(0);
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onResize);
    // Covers are fetched only for the three nearby cards in a collection near the viewport.
    const coverObserver = new IntersectionObserver(
      (entries) => setInRange(entries[0].isIntersecting),
      { rootMargin: '250px 0px' }
    );
    coverObserver.observe(stageRef.current);
    const onPointerUp = (event) => {
      const start = pointerStart.current;
      if (!start || event.pointerId !== start.id) return;
      const x = event.clientX - start.x,
        y = event.clientY - start.y;
      if (count > 1 && Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.3) {
        suppressClickUntil.current = Date.now() + 400;
        select(row.active + (x < 0 ? 1 : -1));
      }
      pointerStart.current = null;
    };
    const onPointerCancel = () => (pointerStart.current = null);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    return () => {
      unregister();
      clearTimeout(row.timer);
      coverObserver.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onResize);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (event) => {
    if (count < 2) return;
    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      select(
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? count - 1
            : row.active + (event.key === 'ArrowRight' ? 1 : -1)
      );
    }
  };

  const onPointerDown = (event) => {
    if (!event.target.closest('.video-controls'))
      pointerStart.current = {
        x: event.clientX,
        y: event.clientY,
        id: event.pointerId
      };
  };

  const collectionLabel = ARABIC_COLLECTION[category] || arabicName;
  const activeItem = items[active];
  const pad = (value) => String(value).padStart(2, '0');

  return (
    <div
      className="carousel"
      data-collection={category}
      role="region"
      aria-roledescription={ar ? 'سلايدر' : 'carousel'}
      aria-label={
        ar ? 'مجموعة ' + collectionLabel : category + ' video collection'
      }
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="carousel-stage" ref={stageRef} onPointerDown={onPointerDown}>
        {count ? (
          items.map((item, index) => {
            let offset = (index - active + count) % count;
            if (offset > count / 2) offset -= count;
            return (
              <Slide
                key={index}
                item={item}
                card={row.cards[index]}
                row={row}
                index={index}
                total={count}
                category={category}
                isActive={index === active}
                labelsVersion={labelsVersion}
                offset={offset}
                layout={layout}
                inRange={inRange}
                muted={muted}
                controller={controller}
                onToggleMute={onToggleMute}
                onActivate={() => {
                  if (Date.now() > suppressClickUntil.current) select(index);
                }}
              />
            );
          })
        ) : (
          <p className="empty-collection">
            {translateUI('New stories are on the way.', lang)}
          </p>
        )}
      </div>
      <div className="carousel-bottom">
        <div className="slide-progress">
          <span className="slide-number">{count ? pad(active + 1) : '00'}</span>
          <div className="progress-line">
            <i style={{ width: count ? `${((active + 1) / count) * 100}%` : '0' }}></i>
          </div>
          <span className="slide-total">{pad(count)}</span>
        </div>
        <p className="slide-caption" aria-live="polite">
          {activeItem ? slideTitle(activeItem, ar, (text) => translateUI(text, lang)) : ''}
          {activeItem && (ar ? activeItem.description_ar : activeItem.description_en) && (
            <span className="slide-description">
              {' — ' + ((ar ? activeItem.description_ar : '') || activeItem.description_en)}
            </span>
          )}
          {activeItem?.cta_url && (
            <>
              {' '}
              <SmartLink className="slide-cta" href={activeItem.cta_url}>
                {((ar ? activeItem.cta_label_ar : '') || activeItem.cta_label_en || '↗') + ' '}
                <ArrowIcon char="↗" />
              </SmartLink>
            </>
          )}
        </p>
        <div className="carousel-arrows">
          <button
            type="button"
            className="previous-slide"
            aria-label={
              ar
                ? 'الفيديو السابق في ' + collectionLabel
                : 'Previous ' + category + ' video'
            }
            disabled={count < 2}
            onClick={() => select(row.active - 1)}
          >
            <ArrowIcon char="←" />
          </button>
          <button
            type="button"
            className="next-slide"
            aria-label={
              ar
                ? 'الفيديو التالي في ' + collectionLabel
                : 'Next ' + category + ' video'
            }
            disabled={count < 2}
            onClick={() => select(row.active + 1)}
          >
            <ArrowIcon char="→" />
          </button>
        </div>
      </div>
    </div>
  );
}
