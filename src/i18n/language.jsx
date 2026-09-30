import { createContext, useContext } from 'react';
import { applySeo } from '../seo/seo.js';

const STORAGE_KEY = '5chicks-language';

// Runtime UI strings (video controls, status labels) that are looked up by their English text.
const UI = {
  'Play video': 'تشغيل الفيديو',
  'Pause video': 'إيقاف الفيديو مؤقتًا',
  'Unmute video': 'تشغيل الصوت',
  'Mute video': 'كتم الصوت',
  'Show video fullscreen': 'عرض الفيديو بملء الشاشة',
  'READY TO PLAY': 'جاهز للتشغيل',
  '● NOW PLAYING': '● يعرض الآن',
  'VIDEO UNAVAILABLE': 'الفيديو غير متاح',
  'FULLSCREEN UNAVAILABLE': 'ملء الشاشة غير متاح',
  'SOUND OFF': 'الصوت مكتوم',
  'SOUND ON': 'الصوت شغّال',
  'New stories are on the way.': 'حكايات جديدة في الطريق.',
  'Made for the moment.': 'حكايات على قدّ اللحظة.',
  'Think in cinema.': 'فكّر بصورة سينمائية.',
  'Every story starts somewhere.': 'كل حكاية بتبدأ بفكرة.',
  'REELS / MOTION PREVIEW': 'ريلز / نموذج تجريبي',
  'FILMS / MOTION PREVIEW': 'أفلام / نموذج تجريبي',
  'SKETCHES / MOTION PREVIEW': 'سكتشات / نموذج تجريبي'
};

export const translateUI = (text, language) =>
  language === 'ar' ? UI[text] || text : text;

// English is the default; a saved choice or ?lang=ar / ?lang=en overrides it.
export function getInitialLanguage() {
  let initial = 'en';
  try {
    initial = localStorage.getItem(STORAGE_KEY) || 'en';
  } catch {}
  const query = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('lang');
  if (query === 'ar' || query === 'en') initial = query;
  return initial === 'en' ? 'en' : 'ar';
}

// `page` is the SEO descriptor of the page being shown (see src/seo/seo.js).
export function applyDocumentLanguage(language, page) {
  const ar = language === 'ar';
  document.documentElement.lang = language;
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  document.title = page.text[language].title;
  // Description, canonical, hreflang, Open Graph, Twitter and JSON-LD follow the language.
  applySeo(language, page);
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {}
}

const LanguageContext = createContext({
  lang: 'en',
  ar: false,
  setLang: () => {}
});

export const LanguageProvider = LanguageContext.Provider;

export function useLanguage() {
  const context = useContext(LanguageContext);
  return {
    ...context,
    t: (english, arabic) => (context.ar ? arabic : english),
    ui: (text) => translateUI(text, context.lang)
  };
}
