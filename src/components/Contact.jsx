import ArrowIcon from './ArrowIcon.jsx';
import Lines from './Lines.jsx';
import ContactForm from './ContactForm.jsx';
import { useSettings } from '../cms/CmsProvider.jsx';
import { telHref } from '../cms/resolve.js';

export default function Contact({ section: s }) {
  const settings = useSettings();
  const phone = telHref(settings.phone);
  return (
    <>
      <section className="contact section" id="contact" aria-labelledby="contact-title">
        <div className="contact-pattern" aria-hidden="true"></div>
        <div className="contact-content">
          <span className="eyebrow">{s.eyebrow}</span>
          <h2 id="contact-title">
            <Lines text={s.title} />
            <span>
              <Lines text={s.titleHighlight} />
            </span>
          </h2>
          <div className="contact-bottom">
            <a className="button dark" href={phone}>
              {s.buttonLabel + ' '}
              <span><ArrowIcon char="↗" /></span>
            </a>
            <a className="phone-link" href={phone}>
              {(settings.phone_display || settings.phone) + ' '}<span><ArrowIcon char="↗" /></span>
            </a>
            <p>
              <Lines text={s.closing} />
            </p>
          </div>
        </div>
      </section>
      <ContactForm />
    </>
  );
}
