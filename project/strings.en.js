/* ==========================================================================
   Apptonomia — Deck institucional · strings.en.js
   English mirror. Keep key parity with strings.es.js.
   ========================================================================== */
window.I18N = window.I18N || {};
window.I18N.en = {
  // --- Common i18n ---
  'core.skipToContent': 'Skip to content',

  // --- Top bar ---
  'deck.contextLabel': 'Institutional deck',
  'deck.print': 'Print / PDF',

  // --- Slide 1 · Cover ---
  'deck.coverEyebrow': 'Social impact',
  'deck.coverTagline': 'Web apps so every person can learn at their own pace.',
  'deck.coverChip1': 'Free, no sign-up',
  'deck.coverChip2': 'Privacy by default',
  'deck.coverChip3': 'Cognitive accessibility',
  'deck.coverChip4': 'Open source',
  'deck.coverCardMath': 'Math and logic',
  'deck.coverCardRoutine': 'Routines and daily life',
  'deck.coverCardMoney': 'Everyday money',
  'deck.coverCardDict': 'Easy-read dictionary',
  'deck.coverCardCards': 'Study flashcards',
  'deck.coverCardTyping': 'Touch typing',
  'deck.coverCardChess': 'Adapted games',

  // --- Slide 2 · Problem ---
  'deck.problemEyebrow': 'The problem',
  'deck.problemTitle': 'Practising between sessions is almost impossible',
  'deck.problemLead': 'People with intellectual disabilities practise with their therapist in clinic. Afterwards, at home or in their free time, they are on their own.',
  'deck.problemP1': 'Difficulty finding resources that are adapted to the community and have real practical usefulness.',
  'deck.problemP2': 'Few apps that make the work of educators, families and therapists easier.',
  'deck.problemP3': 'There is no need to collect personal data — and, where it exists, it is especially sensitive.',
  'deck.problemP4': 'It is hard to ensure that the skills needed to contribute to an autonomous life are actually achieved.',
  'deck.problemQuote': '“What happens between one session and the next?”',
  'deck.problemQuoteAttr': '— The question that started the project',

  // --- Slide 3 · Solution ---
  'deck.solutionEyebrow': 'The solution',
  'deck.solutionTitle': 'A suite of self-contained, accessible and respectful apps',
  'deck.solutionLead': 'Calculia, Routime, Okeymoney, Sinonimia, Memofun, Teclatlon and Ludia form one consistent suite: same look and feel, same accessibility, easy-read and therapeutic principles, same privacy promise. Users can open any of them without an account, installing nothing and sharing no data.',
  'deck.solutionPillar1Title': 'Real autonomy',
  'deck.solutionPillar1Text': 'Apps work without a professional sitting next to the user. If constant help is needed, something is not right.',
  'deck.solutionPillar2Title': 'No pressure',
  'deck.solutionPillar2Text': 'No timers, no game over, no negative scores. Mistakes get an encouraging response and can always be retried.',
  'deck.solutionPillar3Title': 'Privacy by default',
  'deck.solutionPillar3Text': 'No sign-up, no cookies, no analytics, no third-party services. All progress stays on the device.',
  'deck.solutionPillar4Title': 'Practical usefulness',
  'deck.solutionPillar4Text': 'Designed to make the work of therapists, educators and families easier: reusable between sessions, at no cost and with no install.',
  'deck.solutionPillar5Title': 'Adapted to the community',
  'deck.solutionPillar5Text': 'Designed for people with intellectual disabilities: they train reasoning and intellectual skills with the goal of contributing to an autonomous life.',
  'deck.solutionPillar6Title': 'Scaffolded method',
  'deck.solutionPillar6Text': 'Each activity starts with visual support and modelling, and the support is gradually removed so the person can do it alone. Mistakes are prevented more than corrected: reframed, never punished.',

  // --- Slide 4 · Objectives ---
  'deck.objEyebrow': 'Objectives',
  'deck.objTitle': 'Five objectives, measurable and public',
  'deck.obj1Title': 'Universal and free access',
  'deck.obj1Text': 'Remove the economic, technical and sign-up barrier so anyone can practise from the very first click.',
  'deck.obj2Title': 'Make knowledge easier to acquire through easy read',
  'deck.obj2Text': 'Apply UNE 153101 (Easy Read) across all written communication: short sentences, one idea per sentence, everyday vocabulary and visual support. Easy read is not just a style: it is the condition that makes content understandable, and therefore learnable.',
  'deck.obj3Title': 'Respect for dignity and privacy',
  'deck.obj3Text': 'Zero personal data, zero tracking, zero accounts. The suite does not know who uses it, and that is deliberate.',
  'deck.obj4Title': 'Didactic and pedagogical objectives',
  'deck.obj4Text': 'Design every activity with an explicit didactic intent: what is trained, why it matters and how progress shows. The apps support curricular learning and are a useful complement to the classroom, the clinic and the home.',
  'deck.obj5Title': 'Foster autonomy through training and simulation',
  'deck.obj5Text': 'Activities train real-life capabilities (calculate, read, write, manage money, follow a routine) and reproduce everyday situations in a safe environment. Repeated practice with realistic scenarios favours transfer to autonomous life beyond the screen.',

  // --- Slide 5 · Product ---
  'deck.productEyebrow': 'The product',
  'deck.productTitle': 'Apps, one shared language',
  'deck.productCalc': 'Calculation and logical reasoning with short, visual activities.',
  'deck.productRoutime': 'Everyday activities to train mind and daily-life skills.',
  'deck.productOkey': 'Money and everyday autonomy, step by step, with a personal-finance simulator.',
  'deck.productSin': 'Easy-read dictionary with synonyms and OpenSymbols pictograms.',
  'deck.productMemo': 'Study flashcards to revise at your own pace. One idea per card.',
  'deck.productTec': 'Touch typing on the physical computer keyboard, finger by finger.',
  'deck.productLudia': 'Adapted games: learn, practice and play with help.',
  'deck.productMath': 'Math',
  'deck.productRoutine': 'Routines and daily life',
  'deck.productMoney': 'Financial education',
  'deck.productDict': 'Easy read',
  'deck.productCards': 'Flashcards',
  'deck.productTyping': 'Touch typing',
  'deck.productChess': 'Adapted games',

  // --- Slide 6 · Organisation ---
  'deck.orgEyebrow': 'Organisation',
  'deck.orgTitle': 'A suite, several repositories, open source',
  'deck.orgRootDesc': 'Suite portal',
  'deck.orgP1': 'Apptonomia is a meta-project: a central portal at apptonomia.uk links to the sibling apps, each with its own domain, its own repository and its own deploy cycle. This lets each app evolve at its own pace without blocking the others.',
  'deck.orgP2': 'Independent deploys. Each app ships on its own through Cloudflare Workers.',
  'deck.orgP3': 'Shared conventions. Structure, accessibility, i18n and offline mode are common.',
  'deck.orgP4': 'Lightweight governance. Documented roles and CLAUDE.md as the operational contract.',
  'deck.orgP5': 'Open source by design. The full suite — code, content, product decisions and roadmaps — lives in public repositories under the MIT licence. Public issues and pull requests, open continuous integration, no telemetry and no backend to hide.',
  'deck.orgP6': 'Adaptations welcome. An administration, NGO or school can adapt and maintain a version for its community without asking for permission.',
  'deck.orgReposTitle': 'GitHub repositories',

  // --- Slide 7 · Tech ---
  'deck.techEyebrow': 'Technology',
  'deck.techTitle': 'A modest stack for a solid project',
  'deck.techStackTitle': 'Stack',
  'deck.techOfflineTitle': 'Works offline',
  'deck.techAccTitle': 'Accessibility and easy read',
  'deck.techAccLFText': 'Easy read is not just a style: it is the condition that makes content understandable, and therefore learnable.',
  'deck.techSecurityTitle': 'Security and privacy',

  // --- Slide 8 · Standards ---
  'deck.stdEyebrow': 'Standards and audit',
  'deck.stdTitle': 'Designed for them, written in code',
  'deck.stdUneTitle': 'UNE 153101:2018 EX — Easy Read',
  'deck.stdUneText': 'Short sentences, one idea per sentence, everyday vocabulary, no jargon or clinical language in what users read. Applied across the whole suite — interfaces, messages, examples and microcopy — because easy read is the condition that makes content understandable, and therefore learnable.',
  'deck.stdWcagTitle': 'WCAG 2.1 — AA minimum, AAA where applicable',
  'deck.stdWcagText': 'Reinforced contrast (AAA 1.4.6), accessible reading level (AAA 3.1.5) and colour never used as the sole channel (AAA 1.4.1).',
  'deck.stdMitTitle': 'MIT licence across the codebase',
  'deck.stdMitText': 'Any organisation can reuse, adapt or fork the suite for its community at no licence cost.',
  'deck.stdCiTitle': 'Public continuous integration',
  'deck.stdCiText': 'Every change goes through a set of automatic checks (i18n parity, syntax, catalog, accessibility, forbidden terms). CI is the contract.',

  // --- Slide 9 · Sustainability ---


  // --- Slide 10 · Use cases ---
  'deck.useEyebrow': 'Where it fits',
  'deck.useTitle': 'Real use cases',
  'deck.use1Title': '\ud83c\udfeb  Schools and support classrooms',
  'deck.use1Text': 'Reinforcement between lessons for students with support needs. Installs as a PWA on a classroom tablet and is reused year after year, licence-free.',
  'deck.use2Title': '\ud83e\ude7a  Occupational-therapy clinics',
  'deck.use2Text': 'A complement between sessions. The therapist assigns a specific activity and the person practises at home without sending data to any server.',
  'deck.use3Title': '\ud83c\udfe0  Families',
  'deck.use3Text': 'Direct access from the living-room browser, with nothing to install. Families can see progress on the device itself and erase it when they want.',
  'deck.use4Title': '\ud83c\udfe2  Public entities',
  'deck.use4Text': 'Community deployment or a customised fork under the MIT licence. The suite is reusable for local projects with specific needs.',

  // --- Slide 11 · Collaboration ---
  'deck.collabEyebrow': 'How to collaborate',
  'deck.collabTitle': 'Teams, roles and ways to take part',
  'deck.collabLead': 'Apptonomia is maintained by a small, distributed network of people. Roles describe what each person does; the ways to collaborate are the entry point, no matter where you come from.',
  'deck.roleTechTitle': 'Technical team',
  'deck.roleTechText': 'Maintains app code, infrastructure, technical accessibility and continuous integration. Usually works through pull requests and reviews on GitHub.',
  'deck.roleClinicalTitle': 'Clinical and education team',
  'deck.roleClinicalText': 'Occupational therapists, education professionals, psychologists and speech therapists who test the apps with their population and bring real-world criteria.',
  'deck.roleOutreachTitle': 'Outreach and sustainability team',
  'deck.roleOutreachText': 'Communications and public entities who spread the word, fund maintenance or coordinate community-specific forks.',
  'deck.collab1Title': 'Institutional outreach',
  'deck.collab1Text': 'Present Apptonomia in your network of centres, professionals and families. Ready-to-use materials.',
  'deck.collab2Title': 'Professional validation',
  'deck.collab2Text': 'Clinical and professional teams who test the apps and bring criteria on how they fit into a session or a support plan.',
  'deck.collab3Title': 'Technical or content contribution',
  'deck.collab3Text': 'Pull requests to the open repositories, new decks in Memofun, new entries in Sinonimia, new activities in Calculia, Routime, Okeymoney, Teclatlon and Ludia, translations into more languages.',


  // --- Slide 12 · Closing ---
  'deck.closeEyebrow': 'Thanks for reading this far',
  'deck.closeTitle': 'Let\u2019s build a project that respects the people who use it',
  'deck.closeLead': 'If your organisation wants to explore a collaboration, please get in touch..',
  'deck.closeCtaLabel': 'Visit the portal',
  'deck.closeEmailLabel': 'Email',
  'deck.closeRepoLabel': 'Repos',
  // --- Slide 6 · Multilingual and extensible ---
  'deck.langEyebrow': 'Language',
  'deck.langTitle': 'Multilingual by default, extensible by collaboration',
  'deck.langLead': 'Every app in the suite ships with a multilingual core: Spanish and English as the base languages. The architecture is ready to grow with more languages without rewriting code, just by adding translation files.',
  'deck.langP1': 'Automatic detection from the browser language, with a manual selector always visible.',
  'deck.langP2': 'File-level isolation: each language lives in its own file .js, without touching the rest of the code.',
  'deck.langP3': 'Full coverage: interface copy, feedback messages, alerts and microcopy.',
  'deck.langP4': 'Easy read: translations follow the UNE 153101 standard in other languages too.',
  'deck.langHowTitle': 'Want to add a language?',
  'deck.langStep1': 'Fork the repository of the app you want to translate.',
  'deck.langStep2': 'Copy strings.es.js as strings.<your-locale>.js and translate the keys.',
  'deck.langStep3': 'Register the language in the selector switcher in the header.',
  'deck.langStep4': 'Open a pull request. We review it with you and ship it.',
  'deck.langCta': 'A good translation helps hundreds of families. The step-by-step guide lives in each repository, at doc/<lang>/I18N.md.',

  // --- Footer ---
  'deck.footer': 'Institutional deck for partner organisations'
};
