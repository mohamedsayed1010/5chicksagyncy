import ArrowIcon from './ArrowIcon.jsx';
import SmartLink from './SmartLink.jsx';
import { useSection } from '../cms/CmsProvider.jsx';
import { assetUrl } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';

// Site header, fully driven by the "header" section. `skipHref` points the skip link at the
// current page's main content (defaults to the first menu link, "#work" on the homepage);
// `skipLabel` overrides the header section's label on other pages.
export default function Header({ skipHref, skipLabel }) {
  const { ar, setLang } = useLanguage();
  const header = useSection('header');
  if (!header) return null;
  return (
    <>
      <a className="skip-link" href={skipHref || header.links[0]?.href || '#top'}>
        {skipLabel || header.skipLabel}
      </a>
      <header className="nav">
        <SmartLink className="logo-link" href="#top" aria-label={header.homeLabel}>
          <img src={assetUrl(header.logo)} alt="5CHICKS" width="170" height="60" />
        </SmartLink>
        <nav aria-label={header.navLabel}>
          {header.links.map((link, i) => (
            <SmartLink key={i} href={link.href}>
              {link.icon ? (
                <>
                  {link.label + ' '}
                  <span><ArrowIcon char={link.icon} /></span>
                </>
              ) : (
                link.label
              )}
            </SmartLink>
          ))}
        </nav>
        <button
          type="button"
          id="languageToggle"
          className="language-toggle"
          lang={ar ? 'en' : 'ar'}
          aria-label={header.languageAria}
          onClick={() => setLang(ar ? 'en' : 'ar')}
        >
          {header.languageLabel}
        </button>
        <SmartLink className="nav-contact" href={header.contactHref}>
          {header.ctaLabel + ' '}
          <span><ArrowIcon char="↗" /></span>
        </SmartLink>
      </header>
    </>
  );
}
