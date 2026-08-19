/* Apptonomia — portal texts (EN).
   Locale-specific file. Loaded unconditionally from index.html;
   script.js picks the active one from App.i18n.
   Same key shape as strings.es.js (1:1 parity). */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    core: {
      skipToContent: 'Skip to content'
    },
    meta: {
      description: 'Gateway to the Apptonomia suite: Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon and Routime.'
    },
    home: {
      title: 'Apptonomia',
      tagline: 'What are you going to do now?'
    },
    tags: {
      math: 'Math',
      study: 'Study',
      life: 'Daily life',
      words: 'Words',
      keyboard: 'Keyboard',
      activities: 'Activities'
    },
    projects: {
      calculia: 'Calculation and logical reasoning through short, visual activities.',
      memofun: 'Flashcards to learn at your own pace.',
      okeymoney: 'Money and everyday autonomy, step by step.',
      sinonimia: 'Easy-read dictionary with synonyms and pictograms.',
      teclatlon: 'Touch typing with a physical computer keyboard.',
      routime: 'Everyday activities to train mind and skills.'
    },
    footer: {
      note: 'Apptonomia — gateway to the suite'
    }
  }, 'en');
}