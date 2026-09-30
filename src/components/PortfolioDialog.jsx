import { useEffect, useRef, useState } from 'react';
import { withIcons } from './ArrowIcon.jsx';
import { useSection } from '../cms/CmsProvider.jsx';
import { assetUrl } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';
import { usePlayback, usePortfolioDialog } from './PlaybackContext.jsx';

// The PDF portfolio viewer. Rendered once by the layout (after the footer, as before); the
// Portfolio section opens it through PlaybackContext.
export default function PortfolioDialog() {
  const { lang } = useLanguage();
  const s = useSection('portfolio');
  const controller = usePlayback();
  const { setDialog } = usePortfolioDialog();
  const dialogRef = useRef(null);
  const [frameRequested, setFrameRequested] = useState(false);

  useEffect(() => {
    controller.dialog = dialogRef.current;
    setDialog({
      element: dialogRef.current,
      open: () => {
        dialogRef.current.showModal();
        document.body.classList.add('modal-open');
        setFrameRequested(true);
        controller.syncPlayback();
      }
    });
  }, [controller, setDialog]);

  if (!s) return null;
  const close = () => dialogRef.current.close();
  const pdf = assetUrl(s.pdfUrl);
  return (
    <dialog
      id="portfolioDialog"
      ref={dialogRef}
      aria-labelledby="portfolioDialogTitle"
      onClose={() => {
        document.body.classList.remove('modal-open');
        controller.syncPlayback();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="pdf-shell">
        <div className="pdf-toolbar">
          <h2 id="portfolioDialogTitle">{s.dialogTitle}</h2>
          <a href={pdf} target="_blank" rel="noopener">
            {withIcons(s.openPdfLabel + ' ↗')}
          </a>
          <a href={pdf} download={s.pdfDownloadName}>
            {withIcons(s.dialogDownloadLabel + ' ↓')}
          </a>
          <button type="button" id="closePortfolio" aria-label={s.closeLabel} onClick={close}>
            ×
          </button>
        </div>
        <p className="pdf-help">{s.help}</p>
        {/* The preview only loads on first open, then follows the page language. */}
        <iframe
          id="portfolioFrame"
          title={s.frameTitle}
          src={frameRequested ? '/portfolio-preview.html?lang=' + lang : undefined}
        ></iframe>
      </div>
    </dialog>
  );
}
