// Extended content for the service detail pages (/services/<id>).
// Keys match the service ids in content-data.js, which are also the URL slugs.
// Everything here is derived from the existing service descriptions, deliverables and company
// copy. Do not add prices, statistics, clients or guarantees that the business has not provided.
// `whatsapp` holds the prefilled WhatsApp message for each language.

export const SERVICE_DETAILS = {
  'digital-marketing': {
    whatsapp: {
      en: "Hello 5CHICKS, I'm interested in your Digital Marketing service for my brand's content and social media. I'd like to know more about the process, pricing, and timeline.",
      ar: 'مرحبًا 5CHICKS، عندي اهتمام بخدمة التسويق الرقمي لمحتوى البراند والسوشيال ميديا، وحابب أعرف أكتر عن طريقة الشغل والأسعار والمدة المتوقعة.'
    },
    seo: {
      en: {
        title: 'Digital Marketing — 5CHICKS Creative House',
        description:
          'Digital marketing by 5CHICKS: content strategy, campaign concepts, social media content planning and creative copy and visuals that connect your brand with its audience.'
      },
      ar: {
        title: 'التسويق الرقمي — 5CHICKS',
        description:
          'خدمة التسويق الرقمي من 5CHICKS: استراتيجية المحتوى وأفكار الحملات وتخطيط محتوى السوشيال ميديا وكتابة المحتوى وتصميمات الحملات.'
      }
    },
    en: {
      overview: [
        'Digital marketing at 5CHICKS is about giving your brand a clear voice online. We shape the direction of your content, plan how it appears across social media, and create the copy and visuals that carry each campaign.',
        'Because design, media production and branding sit under the same roof, the content we plan can be designed, shot and edited by one connected team, so every post fits the bigger story.'
      ],
      offers: [
        ['Content strategy & campaign concepts', 'A considered direction for what your brand says, turned into campaign ideas where every piece has a clear role.'],
        ['Social media content planning', 'The posts around each campaign, planned ahead so your presence stays consistent rather than occasional.'],
        ['Creative copy & campaign visuals', 'The words and visuals for each piece, written and designed to carry one clear message.']
      ],
      process: [
        ['Understand', 'Your brand, your audience and what you want the campaign to achieve.'],
        ['Direct', 'Set the content direction and the message each campaign carries.'],
        ['Plan', 'Plan the campaign and the posts around it.'],
        ['Create', 'Write the copy and produce the visuals for each piece.'],
        ['Refine', 'Review the content together and refine it before it goes out.']
      ],
      value: [
        ['A clear message', 'Content with a direction says one thing well, instead of many things at once.'],
        ['A consistent presence', 'Planned content keeps your brand showing up in the right places, regularly.'],
        ['One connected team', 'Strategy, design and production work together, so the idea survives all the way to the final post.']
      ],
      faq: [
        ['What does the digital marketing service include?', 'Content strategy and campaign concepts, social media content planning, and creative copy and campaign visuals.'],
        ['Can you also produce the content?', 'Yes. Media production, visual art and branding are also 5CHICKS services, so campaign content can be designed, shot and edited by the same team.'],
        ['Can I see examples of your work?', 'Our company portfolio includes a digital marketing section, and the reels collection on our homepage shows short-form content we have produced.'],
        ['How much does it cost?', 'Pricing is not published on the website. Send us your project details on WhatsApp and we will talk it through with you.']
      ]
    },
    ar: {
      overview: [
        'التسويق الرقمي في 5CHICKS معناه إن البراند بتاعك يبقى له صوت واضح أونلاين. بنحدد اتجاه المحتوى، ونخطط لظهوره على السوشيال ميديا، ونكتب ونصمم المحتوى اللي بيشيل كل حملة.',
        'وعلشان التصميم والإنتاج الإعلامي والبراندينج تحت سقف واحد، المحتوى اللي بنخطط له ممكن يتصمم ويتصور ويتعمله مونتاج بنفس الفريق، فكل بوست يبقى جزء من الحكاية الأكبر.'
      ],
      offers: [
        ['استراتيجية المحتوى وأفكار الحملات', 'اتجاه واضح للي البراند بيقوله، بيتحول لأفكار حملات كل تفصيلة فيها ليها دور.'],
        ['تخطيط محتوى السوشيال ميديا', 'تخطيط البوستات حوالين كل حملة من بدري، علشان حضورك يفضل ثابت ومش بالصدفة.'],
        ['كتابة المحتوى وتصميمات الحملات', 'الكلام والتصميمات لكل بوست، مكتوبة ومتصممة علشان توصل رسالة واحدة واضحة.']
      ],
      process: [
        ['نفهم', 'البراند بتاعك وجمهورك واللي عايز الحملة تحققه.'],
        ['نحدد الاتجاه', 'اتجاه المحتوى والرسالة اللي كل حملة هتشيلها.'],
        ['نخطط', 'نخطط للحملة والبوستات اللي حواليها.'],
        ['ننفّذ', 'نكتب المحتوى ونجهز التصميمات لكل بوست.'],
        ['نراجع', 'نراجع المحتوى مع بعض ونظبطه قبل ما ينزل.']
      ],
      value: [
        ['رسالة واضحة', 'المحتوى اللي له اتجاه بيقول حاجة واحدة كويس، بدل حاجات كتير مرة واحدة.'],
        ['حضور ثابت', 'المحتوى المتخطط له بيخلّي البراند موجود في المكان الصح وبانتظام.'],
        ['فريق واحد متكامل', 'الاستراتيجية والتصميم والإنتاج بيشتغلوا مع بعض، فالفكرة بتفضل واضحة لحد آخر بوست.']
      ],
      faq: [
        ['خدمة التسويق الرقمي بتشمل إيه؟', 'استراتيجية المحتوى وأفكار الحملات، وتخطيط محتوى السوشيال ميديا، وكتابة المحتوى وتصميمات الحملات.'],
        ['ممكن تنتجوا المحتوى كمان؟', 'أيوه. الإنتاج الإعلامي والفنون البصرية والبراندينج من خدمات 5CHICKS برضه، فمحتوى الحملة ممكن يتصمم ويتصور ويتعمله مونتاج بنفس الفريق.'],
        ['أقدر أشوف أمثلة من شغلكم؟', 'بورتفوليو الشركة فيه جزء للتسويق الرقمي، ومجموعة الريلز في الصفحة الرئيسية بتعرض محتوى قصير من إنتاجنا.'],
        ['التكلفة كام؟', 'الأسعار مش منشورة على الموقع. ابعتلنا تفاصيل مشروعك على واتساب ونتكلم فيها سوا.']
      ]
    }
  },

  branding: {
    whatsapp: {
      en: "Hello 5CHICKS, I'm interested in your Branding service for a visual identity. I'd like to know more about the process, pricing, and timeline.",
      ar: 'مرحبًا 5CHICKS، عندي اهتمام بخدمة الهوية التجارية لتصميم هوية بصرية، وحابب أعرف أكتر عن طريقة الشغل والأسعار والمدة المتوقعة.'
    },
    seo: {
      en: {
        title: 'Branding & Visual Identity — 5CHICKS Creative House',
        description:
          'Branding by 5CHICKS: logo and visual identity systems, colour palettes and typography, and brand guidelines and applications that give your business a coherent identity.'
      },
      ar: {
        title: 'الهوية التجارية — 5CHICKS',
        description:
          'خدمة الهوية التجارية من 5CHICKS: تصميم اللوجو ونظام الهوية البصرية، ولوحات الألوان والخطوط، ودليل الهوية وتطبيقات البراند.'
      }
    },
    en: {
      overview: [
        'Branding is where a business gets its visual language. We design the logo, choose the colours and typography, and show how they work across real applications, so your identity feels consistent wherever people meet it.',
        'The aim is an identity that reflects who you are today and has room to grow with your business.'
      ],
      offers: [
        ['Logo & visual identity systems', 'A logo and the wider visual system around it, designed to work together.'],
        ['Colour palettes & typography', 'Colours and type chosen to express your personality and stay consistent across every touchpoint.'],
        ['Brand guidelines & applications', 'Clear guidelines and examples of the identity in use, so it is applied the same way every time.']
      ],
      process: [
        ['Discover', 'Who you are, who you speak to and what the brand needs to say.'],
        ['Explore', 'Explore visual directions for the identity.'],
        ['Design', 'Design the logo and the visual system around it.'],
        ['Define', 'Set the colour palette and typography.'],
        ['Apply', 'Apply the identity and document it in brand guidelines.']
      ],
      value: [
        ['Recognition', 'A coherent identity helps people recognise your brand wherever they see it.'],
        ['Consistency', 'Guidelines keep every application looking like the same brand.'],
        ['Room to grow', 'An identity built as a system can grow with your business.']
      ],
      faq: [
        ['What does the branding service include?', 'Logo and visual identity systems, colour palettes and typography, and brand guidelines and applications.'],
        ['Can the new identity be used in our marketing and content?', 'Yes. Digital marketing, visual art and media production are also 5CHICKS services, so the same team can carry the identity into your campaigns and content.'],
        ['Can I see examples of your work?', 'Our company portfolio includes branding and brand identity projects. You can view or download it from the portfolio section of our homepage.'],
        ['How much does it cost?', 'Pricing is not published on the website. Send us your project details on WhatsApp and we will talk it through with you.']
      ]
    },
    ar: {
      overview: [
        'الهوية التجارية هي اللغة البصرية للبراند. بنصمم اللوجو، ونختار الألوان والخطوط، ونوريك إزاي بيشتغلوا في تطبيقات حقيقية، علشان هويتك تبان متناسقة في أي مكان الناس تشوفها فيه.',
        'الهدف هوية تعبّر عنك النهارده وتقدر تكبر مع مشروعك.'
      ],
      offers: [
        ['تصميم اللوجو ونظام الهوية البصرية', 'لوجو ونظام بصري كامل حواليه، متصممين علشان يكمّلوا بعض.'],
        ['لوحات الألوان واختيار الخطوط', 'ألوان وخطوط بتعبّر عن شخصية البراند وتفضل ثابتة في كل مكان.'],
        ['دليل الهوية وتطبيقات البراند', 'دليل واضح وأمثلة للهوية وهي مستخدمة، علشان تتطبق بنفس الشكل كل مرة.']
      ],
      process: [
        ['نكتشف', 'إنت مين، بتكلم مين، والبراند محتاج يقول إيه.'],
        ['نجرّب', 'نستكشف اتجاهات بصرية مختلفة للهوية.'],
        ['نصمم', 'نصمم اللوجو والنظام البصري اللي حواليه.'],
        ['نحدد', 'نحدد لوحة الألوان والخطوط.'],
        ['نطبّق', 'نطبّق الهوية ونوثّقها في دليل الهوية.']
      ],
      value: [
        ['براند يتعرف', 'الهوية المتناسقة بتخلّي الناس تعرف البراند بتاعك في أي مكان.'],
        ['تناسق', 'دليل الهوية بيخلّي كل تطبيق شكله نفس البراند.'],
        ['مساحة للتطور', 'الهوية المبنية كنظام تقدر تكبر مع مشروعك.']
      ],
      faq: [
        ['خدمة الهوية التجارية بتشمل إيه؟', 'تصميم اللوجو ونظام الهوية البصرية، ولوحات الألوان واختيار الخطوط، ودليل الهوية وتطبيقات البراند.'],
        ['ينفع نستخدم الهوية الجديدة في التسويق والمحتوى؟', 'أيوه. التسويق الرقمي والفنون البصرية والإنتاج الإعلامي من خدمات 5CHICKS برضه، فنفس الفريق يقدر يكمّل الهوية في حملاتك ومحتواك.'],
        ['أقدر أشوف أمثلة من شغلكم؟', 'بورتفوليو الشركة فيه مشاريع هوية تجارية وهوية بصرية. تقدر تشوفه أو تحمّله من قسم البورتفوليو في الصفحة الرئيسية.'],
        ['التكلفة كام؟', 'الأسعار مش منشورة على الموقع. ابعتلنا تفاصيل مشروعك على واتساب ونتكلم فيها سوا.']
      ]
    }
  },

  software: {
    whatsapp: {
      en: "Hello 5CHICKS, I'm interested in your Software service for a website or digital solution. I'd like to know more about the process, pricing, and timeline.",
      ar: 'مرحبًا 5CHICKS، عندي اهتمام بخدمة البرمجيات لموقع أو حل رقمي، وحابب أعرف أكتر عن طريقة الشغل والأسعار والمدة المتوقعة.'
    },
    seo: {
      en: {
        title: 'Software & Web Development — 5CHICKS Creative House',
        description:
          'Software by 5CHICKS: website design and development, interface design and user journeys, and business-focused digital solutions built around real business needs.'
      },
      ar: {
        title: 'البرمجيات — 5CHICKS',
        description:
          'خدمة البرمجيات من 5CHICKS: تصميم وتطوير المواقع، وتصميم الواجهات ورحلة المستخدم، وحلول رقمية مبنية على احتياجات مشروعك.'
      }
    },
    en: {
      overview: [
        'Software at 5CHICKS brings design and programming together in one team. We design and build websites and digital experiences around what your business actually needs, with clarity and usability guiding every decision.',
        'Because the same team also works on branding and content, your website can speak the same visual language as the rest of your brand.'
      ],
      offers: [
        ['Website design & development', 'Websites designed and built by the same team, from the way they look to the way they work.'],
        ['Interface design & user journeys', 'Interfaces and journeys planned around the people who use them, so the experience stays clear.'],
        ['Business-focused digital solutions', 'Digital tools shaped around real business needs rather than features for their own sake.']
      ],
      process: [
        ['Understand', 'Your business, your users and what the experience needs to do.'],
        ['Plan', 'Plan the structure and the user journeys.'],
        ['Design', 'Design the interface with clarity and usability in mind.'],
        ['Build', 'Develop the website or solution.'],
        ['Test & launch', 'Test it and prepare it to go live.']
      ],
      value: [
        ['Clarity', 'A clear experience helps people find what they came for.'],
        ['Usability', 'Designed around how people actually use it, not just how it looks.'],
        ['Built around your needs', 'Solutions shaped by your business goals, designed and built by one team.']
      ],
      faq: [
        ['What does the software service include?', 'Website design and development, interface design and user journeys, and business-focused digital solutions.'],
        ['Do you handle both design and development?', 'Yes. Design and programming are part of the same service, handled by one connected team.'],
        ['Can the website match our brand identity?', 'Yes. Branding is also a 5CHICKS service, so the website can follow your existing identity or one we create with you.'],
        ['How much does it cost?', 'Pricing is not published on the website. Send us your project details on WhatsApp and we will talk it through with you.']
      ]
    },
    ar: {
      overview: [
        'البرمجيات في 5CHICKS بتجمع التصميم والبرمجة في فريق واحد. بنصمم ونطوّر مواقع وتجارب رقمية مبنية على اللي مشروعك محتاجه فعلًا، والوضوح وسهولة الاستخدام هما أساس كل قرار.',
        'وعلشان نفس الفريق بيشتغل على البراندينج والمحتوى، موقعك يقدر يتكلم بنفس اللغة البصرية بتاعة البراند.'
      ],
      offers: [
        ['تصميم وتطوير المواقع', 'مواقع بيصممها ويطوّرها نفس الفريق، من شكلها لطريقة شغلها.'],
        ['تصميم الواجهات ورحلة المستخدم', 'واجهات ورحلات مستخدم متخطط لها حوالين الناس اللي هتستخدمها، علشان التجربة تفضل واضحة.'],
        ['حلول رقمية تناسب احتياجات المشروع', 'أدوات رقمية مبنية على احتياجات حقيقية، مش مميزات وخلاص.']
      ],
      process: [
        ['نفهم', 'مشروعك والمستخدمين واللي التجربة محتاجة تعمله.'],
        ['نخطط', 'نخطط للهيكل ورحلة المستخدم.'],
        ['نصمم', 'نصمم الواجهة بوضوح وسهولة استخدام.'],
        ['نطوّر', 'نطوّر الموقع أو الحل الرقمي.'],
        ['نختبر ونطلق', 'نختبره ونجهّزه علشان ينزل.']
      ],
      value: [
        ['وضوح', 'التجربة الواضحة بتساعد الناس توصل للي جايين علشانه.'],
        ['سهولة استخدام', 'متصمم على طريقة استخدام الناس الحقيقية، مش شكله بس.'],
        ['مبني على احتياجاتك', 'حلول مبنية على أهداف مشروعك، بيصممها ويطوّرها فريق واحد.']
      ],
      faq: [
        ['خدمة البرمجيات بتشمل إيه؟', 'تصميم وتطوير المواقع، وتصميم الواجهات ورحلة المستخدم، وحلول رقمية تناسب احتياجات المشروع.'],
        ['بتعملوا التصميم والتطوير الاتنين؟', 'أيوه. التصميم والبرمجة جزء من نفس الخدمة، وبيشتغل عليهم فريق واحد متكامل.'],
        ['ينفع الموقع يمشي مع هوية البراند بتاعنا؟', 'أيوه. الهوية التجارية من خدمات 5CHICKS برضه، فالموقع يقدر يمشي على هويتك الحالية أو هوية نعملها معاك.'],
        ['التكلفة كام؟', 'الأسعار مش منشورة على الموقع. ابعتلنا تفاصيل مشروعك على واتساب ونتكلم فيها سوا.']
      ]
    }
  },

  'media-production': {
    whatsapp: {
      en: "Hello 5CHICKS, I'm interested in your Media Production service for photography or video. I'd like to know more about the process, pricing, and timeline.",
      ar: 'مرحبًا 5CHICKS، عندي اهتمام بخدمة الإنتاج الإعلامي لتصوير فوتوغرافي أو فيديو، وحابب أعرف أكتر عن طريقة الشغل والأسعار والمدة المتوقعة.'
    },
    seo: {
      en: {
        title: 'Media Production — Photography & Video by 5CHICKS',
        description:
          'Media production by 5CHICKS: creative concepts and direction, photography and video production, and editing for reels, films and sketches, from planning to the final edit.'
      },
      ar: {
        title: 'الإنتاج الإعلامي — 5CHICKS',
        description:
          'خدمة الإنتاج الإعلامي من 5CHICKS: الأفكار الإبداعية والإخراج، والتصوير الفوتوغرافي وإنتاج الفيديو، ومونتاج الريلز والأفلام والسكتشات.'
      }
    },
    en: {
      overview: [
        'Media production turns a concept into a visual story. We handle direction, photography and video production, and the idea leads the way from planning and shooting to the final edit.',
        'Whether it is a reel, a film or a sketch, the same team takes it from the first idea to the final frame. You can watch our reels, films and sketches on the homepage.'
      ],
      offers: [
        ['Creative concepts & direction', 'The idea behind the piece and the direction that shapes how it is told.'],
        ['Photography & video production', 'Photography and video shoots planned around the concept.'],
        ['Editing for reels, films & sketches', 'The final edit, cut for the format the content is made for.']
      ],
      process: [
        ['Concept', 'Develop the idea and the story behind it.'],
        ['Plan', 'Plan the shoot around the concept.'],
        ['Shoot', 'Photography and video production.'],
        ['Edit', 'Edit the material for its format: reel, film or sketch.'],
        ['Final frame', 'Review and deliver the final edit.']
      ],
      value: [
        ['Idea first', 'The concept leads every stage, so the result says what it is meant to say.'],
        ['Made for the format', 'Reels, films and sketches are each edited for how they will be watched.'],
        ['One team, start to finish', 'Planning, shooting and editing stay with the same team.']
      ],
      faq: [
        ['What does the media production service include?', 'Creative concepts and direction, photography and video production, and editing for reels, films and sketches.'],
        ['Can I see examples of your work?', 'Yes. Our reels, films and sketches are on the homepage, and our company portfolio includes media production and food photography.'],
        ['Do you only edit, or also shoot?', 'Both. The service covers the whole journey, from planning and shooting to the final edit.'],
        ['How much does it cost?', 'Pricing is not published on the website. Send us your project details on WhatsApp and we will talk it through with you.']
      ]
    },
    ar: {
      overview: [
        'الإنتاج الإعلامي بيحوّل الفكرة لحكاية بصرية. بنشتغل على الإخراج والتصوير الفوتوغرافي وإنتاج الفيديو، والفكرة بتقود كل مرحلة من التحضير والتصوير لحد المونتاج النهائي.',
        'سواء ريل أو فيلم أو سكتش، نفس الفريق بياخده من أول فكرة لآخر كادر. تقدر تتفرج على الريلز والأفلام والسكتشات بتاعتنا في الصفحة الرئيسية.'
      ],
      offers: [
        ['الأفكار الإبداعية والإخراج', 'الفكرة ورا كل عمل، والإخراج اللي بيحدد طريقة حكايته.'],
        ['التصوير الفوتوغرافي وإنتاج الفيديو', 'جلسات تصوير فوتوغرافي وفيديو متخطط لها حوالين الفكرة.'],
        ['مونتاج الريلز والأفلام والسكتشات', 'المونتاج النهائي، متقطّع على حسب الشكل اللي المحتوى معمول له.']
      ],
      process: [
        ['الفكرة', 'نطوّر الفكرة والحكاية اللي وراها.'],
        ['التحضير', 'نخطط للتصوير حوالين الفكرة.'],
        ['التصوير', 'التصوير الفوتوغرافي وإنتاج الفيديو.'],
        ['المونتاج', 'مونتاج المادة على حسب شكلها: ريل أو فيلم أو سكتش.'],
        ['آخر كادر', 'نراجع ونسلّم المونتاج النهائي.']
      ],
      value: [
        ['الفكرة الأول', 'الفكرة بتقود كل مرحلة، فالنتيجة بتقول اللي المفروض تقوله.'],
        ['معمول لشكله', 'الريلز والأفلام والسكتشات كل واحد بيتعمله مونتاج على حسب طريقة مشاهدته.'],
        ['فريق واحد من الأول للآخر', 'التحضير والتصوير والمونتاج بيفضلوا مع نفس الفريق.']
      ],
      faq: [
        ['خدمة الإنتاج الإعلامي بتشمل إيه؟', 'الأفكار الإبداعية والإخراج، والتصوير الفوتوغرافي وإنتاج الفيديو، ومونتاج الريلز والأفلام والسكتشات.'],
        ['أقدر أشوف أمثلة من شغلكم؟', 'أيوه. الريلز والأفلام والسكتشات بتاعتنا موجودة في الصفحة الرئيسية، وبورتفوليو الشركة فيه إنتاج إعلامي وتصوير أكل.'],
        ['بتعملوا مونتاج بس ولا تصوير كمان؟', 'الاتنين. الخدمة بتغطي الرحلة كلها، من التحضير والتصوير لحد المونتاج النهائي.'],
        ['التكلفة كام؟', 'الأسعار مش منشورة على الموقع. ابعتلنا تفاصيل مشروعك على واتساب ونتكلم فيها سوا.']
      ]
    }
  },

  'visual-art': {
    whatsapp: {
      en: "Hello 5CHICKS, I'm interested in your Visual Art service for campaign artwork and designs. I'd like to know more about the process, pricing, and timeline.",
      ar: 'مرحبًا 5CHICKS، عندي اهتمام بخدمة الفنون البصرية لتصميمات الحملات والمواد الدعائية، وحابب أعرف أكتر عن طريقة الشغل والأسعار والمدة المتوقعة.'
    },
    seo: {
      en: {
        title: 'Visual Art & Design — 5CHICKS Creative House',
        description:
          'Visual art by 5CHICKS: art direction and visual concepts, campaign artwork and compositions, and digital and promotional design that express your brand’s personality.'
      },
      ar: {
        title: 'الفنون البصرية — 5CHICKS',
        description:
          'خدمة الفنون البصرية من 5CHICKS: التوجيه الفني والأفكار البصرية، وتصميمات الحملات والتركيبات البصرية، والتصميم الرقمي والمواد الدعائية.'
      }
    },
    en: {
      overview: [
        'Visual art gives your idea a visual point of view. We create visuals that express your brand’s personality and make its message tangible.',
        'Composition, colour and image-making come together across campaign artwork, digital content and promotional materials.'
      ],
      offers: [
        ['Art direction & visual concepts', 'The visual idea and the direction that keeps every piece consistent.'],
        ['Campaign artwork & compositions', 'Artwork and compositions made for your campaigns.'],
        ['Digital & promotional design', 'Designs for digital content and promotional materials.']
      ],
      process: [
        ['Understand', 'The message and the personality the visuals should carry.'],
        ['Concept', 'Develop the visual concept and art direction.'],
        ['Compose', 'Build the compositions, colour and imagery.'],
        ['Adapt', 'Adapt the artwork for digital and promotional use.'],
        ['Refine', 'Review together and refine the final pieces.']
      ],
      value: [
        ['Personality', 'Visuals that express who your brand is, not just what it sells.'],
        ['A tangible message', 'Imagery makes the message easier to see and remember.'],
        ['Consistent across formats', 'One art direction carries across campaign, digital and promotional pieces.']
      ],
      faq: [
        ['What does the visual art service include?', 'Art direction and visual concepts, campaign artwork and compositions, and digital and promotional design.'],
        ['Can I see examples of your work?', 'Our company portfolio includes visual art projects. You can view or download it from the portfolio section of our homepage.'],
        ['Can the visuals follow our brand identity?', 'Yes. Visual art is designed to express your brand’s personality, and branding is also a 5CHICKS service if you need an identity first.'],
        ['How much does it cost?', 'Pricing is not published on the website. Send us your project details on WhatsApp and we will talk it through with you.']
      ]
    },
    ar: {
      overview: [
        'الفنون البصرية بتدّي فكرتك شكل يعبّر عنها. بنصنع صور وتصميمات بتعكس شخصية البراند وبتوصّل رسالته بشكل ملموس.',
        'التكوين والألوان ومعالجة الصور بيجتمعوا في تصميمات الحملات والمحتوى الرقمي والمواد الدعائية.'
      ],
      offers: [
        ['التوجيه الفني والأفكار البصرية', 'الفكرة البصرية والتوجيه اللي بيخلّي كل تصميم متناسق.'],
        ['تصميمات الحملات والتركيبات البصرية', 'تصميمات وتركيبات بصرية معمولة مخصوص لحملاتك.'],
        ['التصميم الرقمي والمواد الدعائية', 'تصميمات للمحتوى الرقمي والمواد الدعائية.']
      ],
      process: [
        ['نفهم', 'الرسالة والشخصية اللي التصميمات محتاجة تعبّر عنها.'],
        ['الفكرة', 'نطوّر الفكرة البصرية والتوجيه الفني.'],
        ['التكوين', 'نبني التكوين والألوان والصور.'],
        ['التكييف', 'نجهّز التصميمات للاستخدام الرقمي والدعائي.'],
        ['نراجع', 'نراجع مع بعض ونظبط التصميمات النهائية.']
      ],
      value: [
        ['شخصية', 'تصميمات بتعبّر عن البراند نفسه، مش بس عن اللي بيبيعه.'],
        ['رسالة ملموسة', 'الصورة بتخلّي الرسالة أسهل في الفهم والتذكّر.'],
        ['تناسق في كل شكل', 'توجيه فني واحد بيمشي على الحملات والمحتوى الرقمي والمواد الدعائية.']
      ],
      faq: [
        ['خدمة الفنون البصرية بتشمل إيه؟', 'التوجيه الفني والأفكار البصرية، وتصميمات الحملات والتركيبات البصرية، والتصميم الرقمي والمواد الدعائية.'],
        ['أقدر أشوف أمثلة من شغلكم؟', 'بورتفوليو الشركة فيه مشاريع فنون بصرية. تقدر تشوفه أو تحمّله من قسم البورتفوليو في الصفحة الرئيسية.'],
        ['ينفع التصميمات تمشي مع هوية البراند بتاعنا؟', 'أيوه. الفنون البصرية معمولة علشان تعبّر عن شخصية البراند، والهوية التجارية من خدمات 5CHICKS برضه لو محتاج هوية الأول.'],
        ['التكلفة كام؟', 'الأسعار مش منشورة على الموقع. ابعتلنا تفاصيل مشروعك على واتساب ونتكلم فيها سوا.']
      ]
    }
  }
};
