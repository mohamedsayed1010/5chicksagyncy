import { withIcons } from './ArrowIcon.jsx';
import SmartLink from './SmartLink.jsx';
import { useSection, useSettings } from '../cms/CmsProvider.jsx';
import { assetUrl } from '../cms/resolve.js';

// Footer from the "footer" section; social links come from the global settings when present.
export default function Footer() {
  const s = useSection('footer');
  const settings = useSettings();
  if (!s) return null;
  const socials = (settings.social_links || []).filter((link) => link.url);
  return (
    <footer>
      <SmartLink href="#top" aria-label={s.homeLabel}>
        <img src={assetUrl(s.logo)} alt="5CHICKS" width="170" height="60" loading="lazy" />
      </SmartLink>
      <span>
        © <span id="year">{new Date().getFullYear()}</span>
        {' ' + s.copyright}
      </span>
      {socials.length > 0 && (
        <nav className="footer-social" aria-label="Social">
          {socials.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label || link.url}
            </a>
          ))}
        </nav>
      )}
      <a href="#top">{withIcons(s.backToTop + ' ↑')}</a>
    </footer>
  );
}
