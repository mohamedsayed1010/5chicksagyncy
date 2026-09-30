import { useEffect, useState } from 'react';
import { withIcons } from '../components/ArrowIcon.jsx';

const PAGES = [
  '5CHICKS agency cover, five characters and introduction',
  'Who we are, mission, vision and services',
  'Digital marketing portfolio projects',
  'Branding portfolio projects',
  'Brand identity projects and visual art',
  'Visual art projects and media production',
  'Media production and food photography',
  'Selected photography and contact number 01004066939'
];

export const ar = new URLSearchParams(location.search).get('lang') === 'ar';

// Faithful image preview of the company PDF, shown inside the portfolio dialog.
export default function PortfolioPreview() {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    document.body.classList.toggle('zoom', zoom > 100);
  }, [zoom]);

  const updateZoom = (change) =>
    setZoom((value) => Math.max(100, Math.min(200, value + change)));

  return (
    <>
      <div
        className="reader-tools"
        aria-label={ar ? 'أدوات معاينة البورتفوليو' : 'Portfolio preview controls'}
      >
        <button
          type="button"
          id="zoomOut"
          aria-label={ar ? 'تصغير' : 'Zoom out'}
          disabled={zoom === 100}
          onClick={() => updateZoom(-25)}
        >
          −
        </button>
        <span id="zoomValue" aria-live="polite">
          {zoom === 100 ? (ar ? 'ملاءمة العرض' : 'Fit width') : zoom + '%'}
        </span>
        <button
          type="button"
          id="zoomIn"
          aria-label={ar ? 'تكبير' : 'Zoom in'}
          disabled={zoom === 200}
          onClick={() => updateZoom(25)}
        >
          +
        </button>
        <a href="assets/5chicks-portfolio.pdf" target="_blank" rel="noopener">
          {withIcons(ar ? 'ملف PDF الأصلي ↗' : 'Original PDF ↗')}
        </a>
      </div>
      <main
        className="document"
        id="document"
        aria-label={ar ? 'معاينة بورتفوليو الشركة' : 'Complete company portfolio preview'}
        tabIndex={0}
        style={{ width: zoom + '%' }}
      >
        {PAGES.map((alt, index) => (
          <img
            key={index}
            src={`assets/portfolio/part-0${index + 1}.webp`}
            width="1269"
            height="2000"
            alt={ar ? 'بورتفوليو الشركة — الجزء ' + (index + 1) : alt}
            loading={index ? 'lazy' : undefined}
          />
        ))}
      </main>
    </>
  );
}
