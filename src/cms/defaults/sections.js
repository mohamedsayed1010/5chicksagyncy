// Initial CMS content for page sections, moved verbatim from the hand-written components.
// Every section is stored as { key, page, sort_order, enabled, content_en, content_ar, settings }.
// - content_en / content_ar hold translatable text (same shape in both languages)
// - settings holds language-independent values (images, links, colours, flags)
// - lists are index-aligned across content_en, content_ar and settings
// - "\n" inside a text value renders as a line break (<br />)
import { SITE_CONTENT } from '../../data/content-data.js';
import { SITE_CONTENT_AR } from '../../data/content-ar.js';

const company = { en: SITE_CONTENT.company, ar: { ...SITE_CONTENT.company, ...SITE_CONTENT_AR.company } };

export const HOME_SECTIONS = [
  {
    key: 'header',
    settings: {
      logo: 'assets/identity/logo.webp',
      contactHref: '#contact',
      links: [
        { href: '#work', icon: '↘' },
        { href: '#services', icon: '' },
        { href: '#portfolio', icon: '' },
        { href: '#about', icon: '' },
        { href: '#chicks', icon: '' }
      ]
    },
    content_en: {
      skipLabel: 'Skip to our work',
      homeLabel: '5CHICKS home',
      navLabel: 'Main navigation',
      links: [{ label: 'Our Work' }, { label: 'Services' }, { label: 'Portfolio' }, { label: 'The House' }, { label: 'The Chicks' }],
      ctaLabel: 'Let’s talk',
      languageLabel: 'العربية',
      languageAria: 'التبديل للعربية'
    },
    content_ar: {
      skipLabel: 'انتقل إلى أعمالنا',
      homeLabel: 'الصفحة الرئيسية لـ 5CHICKS',
      navLabel: 'التنقل الرئيسي',
      links: [{ label: 'أعمالنا' }, { label: 'خدماتنا' }, { label: 'البورتفوليو' }, { label: 'عن الشركة' }, { label: 'شخصياتنا' }],
      ctaLabel: 'خلّينا نتكلم',
      languageLabel: 'English',
      languageAria: 'Switch to English'
    }
  },
  {
    key: 'hero',
    settings: {
      chromeImage: 'assets/identity/chrome.webp',
      heroVideo: '',
      stickerImage: 'assets/identity/creativity.webp',
      buttonHref: '#services',
      scrollHref: '#work'
    },
    content_en: {
      topline: 'MEET 5CHICKS / YOUR CREATIVE HOUSE',
      toplineEnd: 'CREATIVE HOUSE',
      titleLine1: 'SMALL CHICKS.',
      titleLine2: 'BIG ',
      titleHighlight: 'ENERGY',
      description: company.en.heroDescription,
      buttonLabel: 'Discover our services',
      coordinateTop: 'IDEAS INTO IMPACT',
      coordinateBottom: 'FIVE FORCES IN MOTION',
      sticker: 'A LITTLE DIFFERENT.\nA LOT OF CHARACTER.',
      labelStrong: 'PURE',
      labelText: 'CREATIVE DNA',
      bottomText: 'STRATEGY MEETS INSTINCT.',
      scrollLabel: 'SCROLL TO DISCOVER'
    },
    content_ar: {
      topline: 'اتعرّف على 5CHICKS / بيتك الإبداعي',
      toplineEnd: 'بيت إبداعي متكامل',
      titleLine1: 'حجمنا صغير.',
      titleLine2: '',
      titleHighlight: 'إبداعنا كبير',
      description: company.ar.heroDescription,
      buttonLabel: 'اكتشف خدماتنا',
      coordinateTop: 'من الفكرة للتأثير',
      coordinateBottom: 'خمس قوى إبداعية في حركة',
      sticker: 'اختلاف في التفكير.\nشخصية في كل تفصيلة.',
      labelStrong: 'إبداع',
      labelText: 'في كل تفصيلة',
      bottomText: 'استراتيجية بروح إبداعية.',
      scrollLabel: 'اكتشف أكتر'
    }
  },
  {
    key: 'ticker',
    settings: { items: [{ enabled: true }, { enabled: true }, { enabled: true }] },
    content_en: { items: [{ text: 'GOOD IDEAS HATCH HERE' }, { text: 'BUILT TO STAND OUT' }, { text: 'FIVE MINDS. NO LIMITS.' }] },
    content_ar: { items: [{ text: 'هنا بتبدأ الأفكار' }, { text: 'اتخلقنا علشان نتميّز' }, { text: 'خمس عقول. بلا حدود.' }] }
  },
  {
    key: 'about',
    settings: { symbolImage: 'assets/identity/symbol.webp', linkHref: '#services' },
    content_en: {
      eyebrow: 'WHO WE ARE',
      title: 'FIVE FORCES.',
      titleHighlight: 'ONE\nHOUSE.',
      lead: company.en.lead,
      paragraphs: company.en.paragraphs.map((text) => ({ text })),
      linkLabel: 'Find your next creative service',
      missionLabel: 'OUR MISSION',
      mission: company.en.mission,
      visionLabel: 'OUR VISION',
      vision: company.en.vision
    },
    content_ar: {
      eyebrow: 'إحنا مين',
      title: 'خمس قوى.',
      titleHighlight: 'بيت\nواحد.',
      lead: company.ar.lead,
      paragraphs: company.ar.paragraphs.map((text) => ({ text })),
      linkLabel: 'اكتشف الخدمة المناسبة لمشروعك',
      missionLabel: 'رسالتنا',
      mission: company.ar.mission,
      visionLabel: 'رؤيتنا',
      vision: company.ar.vision
    }
  },
  {
    key: 'services',
    settings: {},
    content_en: {
      eyebrow: 'WHAT WE DO',
      note: 'FROM THE FIRST IDEA TO THE FINAL DETAIL.',
      title: 'FIVE WAYS TO',
      titleOutline: 'MOVE FORWARD.',
      intro: 'Creative thinking. Connected services.\nA complete picture for your brand.',
      detailsLabel: 'View details',
      whatsappLabel: 'Chat on WhatsApp'
    },
    content_ar: {
      eyebrow: 'بنقدّم إيه',
      note: 'من أول فكرة لآخر تفصيلة.',
      title: 'خمس طرق',
      titleOutline: 'نطوّر بيها فكرتك.',
      intro: 'تفكير إبداعي. خدمات متكاملة.\nصورة كاملة لعلامتك التجارية.',
      detailsLabel: 'التفاصيل',
      whatsappLabel: 'كلّمنا على واتساب'
    }
  },
  {
    key: 'clients',
    settings: {},
    content_en: {
      eyebrow: 'OUR CLIENTS',
      note: 'CREATIVE WORK. SHARED AMBITION.',
      title: 'GOOD COMPANY.',
      titleHighlight: 'GREAT WORK.',
      intro: 'Brands we’ve worked with. \nStories we’ve helped bring to life.',
      pauseLabel: 'Pause motion',
      playLabel: 'Play motion',
      windowLabel: 'Client logos',
      placeholder: 'CLIENT LOGO COMING SOON',
      emptyNote: 'Preview spaces — client logos will be added soon.'
    },
    content_ar: {
      eyebrow: 'عملاؤنا',
      note: 'إبداع يجمعنا. وطموح مشترك.',
      title: 'عملاء اشتغلنا',
      titleHighlight: 'معاهم.',
      intro: 'علامات تجارية شاركنا رحلتها. \nوحكايات ساعدنا إنها توصل.',
      pauseLabel: 'إيقاف الحركة مؤقتًا',
      playLabel: 'تشغيل الحركة',
      windowLabel: 'لوجوهات العملاء',
      placeholder: 'لوجو العميل قريبًا',
      emptyNote: 'مساحات مؤقتة للعرض — لوجوهات العملاء هتضاف قريبًا.'
    }
  },
  {
    key: 'work',
    settings: {},
    content_en: {
      eyebrow: 'OUR WORK',
      note: 'LESS TALK. MORE PLAY.',
      title: 'MADE TO',
      titleOutline: 'MAKE YOU LOOK.',
      intro: 'Three formats. Their own space.\nExplore each collection below.',
      jumpNavLabel: 'Work collections',
      collectionLabel: 'COLLECTION',
      previewNote: 'Selected reels, films and sketches by 5CHICKS'
    },
    content_ar: {
      eyebrow: 'أعمالنا',
      note: 'كلام أقل. شغل أكتر.',
      title: 'شغل يستاهل',
      titleOutline: 'توقف عنده.',
      intro: 'ثلاثة أشكال. لكل واحد مساحته.\nاكتشف كل مجموعة بنفسك.',
      jumpNavLabel: 'أقسام الأعمال',
      collectionLabel: 'من أعمالنا',
      previewNote: 'مختارات من الريلز والأفلام والسكتشات من أعمالنا'
    }
  },
  {
    key: 'portfolio',
    settings: {
      patternImage: 'assets/identity/pattern.webp',
      logoImage: 'assets/identity/logo.webp',
      pdfUrl: 'assets/5chicks-portfolio.pdf',
      pdfDownloadName: '5CHICKS-Portfolio.pdf'
    },
    content_en: {
      artText: 'THE HOUSE. THE WORK. THE WHOLE STORY.',
      eyebrow: 'TAKE A CLOSER LOOK',
      title: 'THE FULL',
      titleHighlight: 'PICTURE.',
      text: 'Explore our company profile, creative services and selected projects. All in one portfolio.',
      viewLabel: 'View portfolio',
      downloadLabel: 'Download PDF',
      detail: 'COMPANY PORTFOLIO / PDF / 40.8 MB',
      dialogTitle: '5CHICKS / PORTFOLIO',
      openPdfLabel: 'Open PDF',
      dialogDownloadLabel: 'Download',
      closeLabel: 'Close portfolio',
      help: 'Scroll to explore. Use + to zoom, or open and download the original PDF.',
      frameTitle: '5CHICKS company portfolio PDF',
      projectsTitle: 'Projects'
    },
    content_ar: {
      artText: 'الشركة. الشغل. الحكاية كاملة.',
      eyebrow: 'خد نظرة أقرب',
      title: 'الصورة',
      titleHighlight: 'الكاملة.',
      text: 'اتعرّف على شركتنا وخدماتنا ومختارات من أعمالنا. كلها في بورتفوليو واحد.',
      viewLabel: 'شوف البورتفوليو',
      downloadLabel: 'تحميل PDF',
      detail: 'بورتفوليو الشركة / PDF / 40.8 MB',
      dialogTitle: '5CHICKS / البورتفوليو',
      openPdfLabel: 'افتح PDF',
      dialogDownloadLabel: 'تحميل',
      closeLabel: 'إغلاق البورتفوليو',
      help: 'مرّر لاستكشاف الأعمال. استخدم + للتكبير، أو افتح وحمّل ملف PDF الأصلي.',
      frameTitle: 'بورتفوليو شركة 5CHICKS',
      projectsTitle: 'المشاريع'
    }
  },
  {
    key: 'chicks',
    settings: {
      heartImage: 'assets/identity/hearts.webp',
      crewImage: 'assets/identity/crew.webp',
      traits: [
        { accent: '#09c8e9', image: 'assets/identity/flexibility.webp' },
        { accent: '#9400ff', image: 'assets/identity/brightness.webp' },
        { accent: '#ff43c2', image: 'assets/identity/creativity.webp' },
        { accent: '#ffdb00', image: 'assets/identity/stability.webp' },
        { accent: '#00f080', image: 'assets/identity/mastery.webp' }
      ]
    },
    content_en: {
      eyebrow: 'OUR CREATIVE DNA',
      note: 'FIVE PERSONALITIES. ALL IN.',
      title: 'NOT YOUR\nAVERAGE ',
      titleHighlight: 'FLOCK.',
      heartAlt: 'Two green hearts in glass bubbles',
      crewAlt: 'Five colorful chick characters representing flexibility, brightness, creativity, stability and mastery',
      crewSideStart: 'BUILT DIFFERENT.',
      crewSideEnd: 'BETTER TOGETHER.',
      traits: [
        { label: 'ADAPT', alt: 'Flexibility dynamic logo', text: 'New challenge?\nWe find a new way.' },
        { label: 'THINK', alt: 'Brightness dynamic logo', text: 'A fresh perspective.\nA sharper idea.' },
        { label: 'CREATE', alt: 'Creativity dynamic logo', text: 'Curiosity first.\nPossibilities everywhere.' },
        { label: 'BUILD', alt: 'Stability dynamic logo', text: 'Strong foundations.\nRoom to grow.' },
        { label: 'MASTER', alt: 'Mastery dynamic logo', text: 'Care in every detail.\nCraft in every finish.' }
      ]
    },
    content_ar: {
      eyebrow: 'شخصيتنا الإبداعية',
      note: 'خمس شخصيات. روح واحدة.',
      title: 'مش أي\n',
      titleHighlight: 'فريق وخلاص.',
      heartAlt: 'قلبان باللون الأخضر داخل فقاعات زجاجية',
      crewAlt: 'خمس شخصيات تمثل المرونة والتفكير والإبداع والثبات والإتقان',
      crewSideStart: 'مختلفين في تفكيرنا.',
      crewSideEnd: 'أقوى مع بعض.',
      traits: [
        { label: 'المرونة', alt: 'Flexibility dynamic logo', text: 'تحدّي جديد؟\nهنلاقي طريق جديد.' },
        { label: 'التفكير', alt: 'Brightness dynamic logo', text: 'نظرة مختلفة.\nوفكرة أوضح.' },
        { label: 'الإبداع', alt: 'Creativity dynamic logo', text: 'فضول بلا حدود.\nوفرص في كل اتجاه.' },
        { label: 'الثبات', alt: 'Stability dynamic logo', text: 'أساس قوي.\nومساحة للتطور.' },
        { label: 'الإتقان', alt: 'Mastery dynamic logo', text: 'اهتمام بكل تفصيلة.\nوإتقان في كل خطوة.' }
      ]
    }
  },
  {
    key: 'contact',
    settings: {},
    content_en: {
      eyebrow: 'YOUR NEXT BIG THING STARTS HERE.',
      title: 'LET’S HATCH\nSOMETHING ',
      titleHighlight: 'BIG.',
      buttonLabel: 'Let’s talk',
      closing: 'Bring the idea.\nWe’ll bring the energy.'
    },
    content_ar: {
      eyebrow: 'فكرتك الكبيرة الجاية بتبدأ هنا.',
      title: 'يلا نبدأ\nحاجة ',
      titleHighlight: 'كبيرة.',
      buttonLabel: 'خلّينا نتكلم',
      closing: 'هات الفكرة.\nوإحنا نجيب الإبداع.'
    }
  },
  {
    key: 'footer',
    settings: { logo: 'assets/identity/logo.webp' },
    content_en: { homeLabel: '5CHICKS home', copyright: '5CHICKS CREATIVE HOUSE', backToTop: 'BACK TO TOP' },
    content_ar: { homeLabel: 'الصفحة الرئيسية لـ 5CHICKS', copyright: '5CHICKS — بيت إبداعي', backToTop: 'الرجوع للأعلى' }
  }
];

// Labels used on every service detail page (the page template), moved from ServicePage.jsx.
export const SERVICE_TEMPLATE_SECTION = {
  key: 'service-template',
  settings: {},
  content_en: {
    skipLabel: 'Skip to content',
    breadcrumbLabel: 'Breadcrumb',
    servicesLabel: 'Services',
    eyebrow: 'SERVICE',
    whatsappLabel: 'Chat on WhatsApp',
    allServicesLabel: 'All services',
    overviewEyebrow: 'OVERVIEW',
    overviewTitle: 'What this service provides.',
    offersEyebrow: 'WHAT WE OFFER',
    offersNote: 'THE DELIVERABLES.',
    offersTitle: 'What we offer.',
    processEyebrow: 'PROCESS',
    processNote: 'A TYPICAL WORKFLOW.',
    processTitle: 'How we typically work.',
    processIntro: 'Every project is shaped around its own goals. This is how the work usually comes together.',
    valueEyebrow: 'WHY IT MATTERS',
    valueTitle: 'Why it matters.',
    faqEyebrow: 'FAQ',
    faqTitle: 'Good questions.',
    projectsEyebrow: 'RELATED PROJECTS',
    projectsTitle: 'Related work.',
    othersEyebrow: 'MORE SERVICES',
    othersNote: 'ONE CONNECTED TEAM.',
    othersTitle: 'Explore other services.',
    ctaEyebrow: 'YOUR NEXT BIG THING STARTS HERE.',
    ctaTitle: 'DISCUSS YOUR\n',
    ctaHighlight: 'PROJECT.',
    ctaButton: 'Discuss your project',
    ctaClosing: 'Bring the idea.\nWe’ll bring the energy.',
    relatedReels: 'Watch our reels',
    relatedWork: 'Watch our reels, films & sketches',
    relatedPortfolio: 'View the company portfolio'
  },
  content_ar: {
    skipLabel: 'انتقل للمحتوى',
    breadcrumbLabel: 'مسار التنقل',
    servicesLabel: 'خدماتنا',
    eyebrow: 'خدمة',
    whatsappLabel: 'كلّمنا على واتساب',
    allServicesLabel: 'كل الخدمات',
    overviewEyebrow: 'نظرة عامة',
    overviewTitle: 'الخدمة دي بتقدّم إيه.',
    offersEyebrow: 'بنقدّم إيه',
    offersNote: 'اللي هتستلمه.',
    offersTitle: 'اللي بنقدّمه.',
    processEyebrow: 'طريقة الشغل',
    processNote: 'خطوات الشغل المعتادة.',
    processTitle: 'إزاي بنشتغل عادةً.',
    processIntro: 'كل مشروع بيتشكّل على حسب أهدافه. دي الطريقة اللي الشغل بيمشي بيها عادةً.',
    valueEyebrow: 'ليه الخدمة دي مهمة',
    valueTitle: 'ليه ده مهم.',
    faqEyebrow: 'أسئلة شائعة',
    faqTitle: 'أسئلة في محلها.',
    projectsEyebrow: 'مشاريع مرتبطة',
    projectsTitle: 'شغل مرتبط بالخدمة.',
    othersEyebrow: 'خدمات تانية',
    othersNote: 'فريق واحد متكامل.',
    othersTitle: 'اكتشف خدماتنا التانية.',
    ctaEyebrow: 'فكرتك الكبيرة الجاية بتبدأ هنا.',
    ctaTitle: 'خلّينا نتكلم\nعن ',
    ctaHighlight: 'مشروعك.',
    ctaButton: 'اتكلم معانا عن مشروعك',
    ctaClosing: 'هات الفكرة.\nوإحنا نجيب الإبداع.',
    relatedReels: 'اتفرج على الريلز بتاعتنا',
    relatedWork: 'اتفرج على الريلز والأفلام والسكتشات',
    relatedPortfolio: 'شوف بورتفوليو الشركة'
  }
};
