/* The public suite landing has no interactive sound feedback, so audio
   preferences do not apply here. Keep its settings drawer focused on the
   controls the landing can actually apply. */
window.LocalePickerConfig = {
  storageKey: 'apptonomia:locale',
  settingsStorageKey: 'apptonomia:locale:accessibility',
  path: 'js/strings',
  requiredLocales: ['es', 'en'],
  defaultLocale: 'en',
  soundSettings: false
};
