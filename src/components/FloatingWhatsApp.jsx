import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import WhatsAppIcon from './WhatsAppIcon.jsx';
import { useSettings } from '../cms/CmsProvider.jsx';
import { pick, whatsappUrl } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';
import '../styles/floating-whatsapp.css';

// Floating WhatsApp call-to-action, pinned to the bottom inline-end corner (right in LTR, left in RTL).
// Number, default message and labels come from the global settings; `message` (e.g. a service's
// message) overrides the default. It fades out while the contact row or footer is on screen, and is
// not rendered at all if the configured number is invalid.
export default function FloatingWhatsApp({ message, avoid = '.contact-bottom, footer' }) {
  const { lang } = useLanguage();
  const settings = useSettings();
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll(avoid);
    if (!targets.length) return;
    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)
      );
      setHidden(visible.size > 0);
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
    // Re-observe after navigation: each page has its own contact row.
  }, [avoid, pathname]);

  const href = whatsappUrl(settings.whatsapp_number, message || pick(settings, 'whatsapp_message', lang));
  if (!href) return null;
  return (
    <a
      className={hidden ? 'wa-float is-hidden' : 'wa-float'}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={pick(settings, 'whatsapp_aria', lang)}
    >
      <WhatsAppIcon className="wa-float__icon" />
      <span className="wa-float__label" aria-hidden="true">
        {pick(settings, 'whatsapp_label', lang)}
      </span>
    </a>
  );
}
