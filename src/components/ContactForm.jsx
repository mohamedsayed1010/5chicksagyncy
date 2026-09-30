import { useRef, useState } from 'react';
import ArrowIcon from './ArrowIcon.jsx';
import { useLanguage } from '../i18n/language.jsx';
import { LIMITS, MIN, validateContact } from '../contact/validation.js';
import '../styles/contact-form.css';

const EMPTY = { name: '', phone: '', details: '', link: '', website: '' };
const FIELDS = ['name', 'phone', 'details', 'link'];

// Error code (from validation.js) → message, per field.
const MESSAGES = {
  name: {
    required: ['Please enter your name.', 'من فضلك اكتب اسمك.'],
    short: [`Name must be at least ${MIN.name} characters.`, `الاسم لازم يكون ${MIN.name} حروف على الأقل.`],
    long: [`Name can be up to ${LIMITS.name} characters.`, `الاسم ممكن يكون لحد ${LIMITS.name} حرف.`]
  },
  phone: {
    required: ['Please enter your phone number.', 'من فضلك اكتب رقم تليفونك.'],
    invalid: ['Enter a valid phone number, e.g. +20 100 123 4567.', 'اكتب رقم تليفون صحيح، مثلًا ‎+20 100 123 4567.']
  },
  details: {
    required: ['Tell us a little about your project.', 'احكيلنا شوية عن مشروعك.'],
    short: [`Please add a bit more detail (at least ${MIN.details} characters).`, `محتاجين تفاصيل أكتر شوية (${MIN.details} حروف على الأقل).`],
    long: [`Details can be up to ${LIMITS.details} characters.`, `التفاصيل ممكن تكون لحد ${LIMITS.details} حرف.`]
  },
  link: {
    invalid: ['Enter a valid link, e.g. facebook.com/yourpage.', 'اكتب لينك صحيح، مثلًا facebook.com/yourpage.']
  }
};

// Contact form section: name, phone, project details and an optional link, emailed by /api/contact.
export default function ContactForm() {
  const { lang, ar, t } = useLanguage();
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: 'idle' }); // idle | sending | success | error
  const formRef = useRef(null);

  const { errors } = validateContact(values);
  const errorFor = (field) => (touched[field] && errors[field] ? MESSAGES[field][errors[field]][ar ? 1 : 0] : '');

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (status.state === 'success' || status.state === 'error') setStatus({ state: 'idle' });
  };
  const blur = (event) => setTouched((current) => ({ ...current, [event.target.name]: true }));

  async function submit(event) {
    event.preventDefault();
    if (status.state === 'sending') return;
    setTouched({ name: true, phone: true, details: true, link: true });
    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid) {
      formRef.current.elements[firstInvalid].focus();
      return;
    }

    setStatus({ state: 'sending' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, lang })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'send');
      setValues(EMPTY);
      setTouched({});
      setStatus({ state: 'success' });
    } catch {
      setStatus({ state: 'error' });
    }
  }

  const field = (name) => {
    const error = errorFor(name);
    return {
      id: `cf-${name}`,
      name,
      value: values[name],
      onChange: update,
      onBlur: blur,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `cf-${name}-error` : undefined
    };
  };
  const errorText = (name) =>
    errorFor(name) ? (
      <p className="cf-error" id={`cf-${name}-error`}>
        {errorFor(name)}
      </p>
    ) : null;

  const sending = status.state === 'sending';
  return (
    <section className="section contact-form-section" id="contact-form" aria-labelledby="contact-form-title">
      <div className="cf-intro">
        <span className="eyebrow">{t('START A PROJECT', 'ابدأ مشروعك')}</span>
        <h2 id="contact-form-title">
          {t('TELL US ABOUT', 'احكيلنا عن')}
          <br />
          <span>{t('YOUR PROJECT.', 'مشروعك.')}</span>
        </h2>
        <p>
          {t(
            'Share a few details and a way to reach you — our team will get back to you shortly.',
            'ابعتلنا شوية تفاصيل ورقم نوصلك عليه، وفريقنا هيرد عليك في أقرب وقت.'
          )}
        </p>
      </div>

      <form className="cf-card" ref={formRef} onSubmit={submit} noValidate aria-busy={sending}>
        <div className="cf-row">
          <div className="cf-field">
            <label htmlFor="cf-name">{t('Name', 'الاسم')}</label>
            <input {...field('name')} type="text" autoComplete="name" maxLength={LIMITS.name} required
              placeholder={t('Your full name', 'اسمك بالكامل')} />
            {errorText('name')}
          </div>
          <div className="cf-field">
            <label htmlFor="cf-phone">{t('Phone number', 'رقم التليفون')}</label>
            <input {...field('phone')} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" maxLength={LIMITS.phone}
              required placeholder="+20 100 123 4567" />
            {errorText('phone')}
          </div>
        </div>

        <div className="cf-field">
          <label htmlFor="cf-details">{t('Project details', 'تفاصيل المشروع')}</label>
          <textarea {...field('details')} rows={6} maxLength={LIMITS.details} required
            placeholder={t('What are you working on? Goals, timeline, budget…', 'بتشتغل على إيه؟ الهدف، المدة، الميزانية…')} />
          <div className="cf-meta">
            {errorText('details')}
            <span className="cf-count" aria-hidden="true">
              {values.details.length}/{LIMITS.details}
            </span>
          </div>
        </div>

        <div className="cf-field">
          <label htmlFor="cf-link">
            {t('Project link', 'لينك المشروع')} <span className="cf-optional">{t('(optional)', '(اختياري)')}</span>
          </label>
          <input {...field('link')} type="text" inputMode="url" autoComplete="url" dir="ltr" maxLength={LIMITS.link}
            placeholder={t('Website, Facebook page or any link', 'موقع، صفحة فيسبوك أو أي لينك')} />
          {errorText('link')}
        </div>

        {/* Honeypot for spam bots: hidden from people and assistive tech. */}
        <div className="cf-trap" aria-hidden="true">
          <label htmlFor="cf-website">Website</label>
          <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} />
        </div>

        <div className="cf-actions">
          <button className="button primary cf-submit" type="submit" disabled={sending}>
            {sending ? t('Sending…', 'جاري الإرسال…') : t('Send message', 'ابعت الرسالة')}
            <span>
              <ArrowIcon char="↗" />
            </span>
          </button>
          <div className="cf-status-slot" role="status" aria-live="polite">
            {status.state === 'success' && (
              <p className="cf-status is-success">
                {t('Thanks! Your message was sent — we’ll be in touch soon.', 'شكرًا! رسالتك وصلت، وهنتواصل معاك قريب.')}
              </p>
            )}
            {status.state === 'error' && (
              <p className="cf-status is-error">
                {t(
                  'Sorry, your message couldn’t be sent. Please try again or reach us on WhatsApp.',
                  'للأسف الرسالة موصلتش. جرّب تاني أو كلّمنا على واتساب.'
                )}
              </p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
