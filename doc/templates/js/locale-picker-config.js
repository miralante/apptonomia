/* Locale-picker configuration. A file, not an inline <script>: the CSP is
   `script-src 'self'`, which blocks inline scripts. Load it BEFORE
   js/locale-picker.js.

   Every key the picker stores starts with '{{SLUG}}:' so config/ can clear it
   together with the rest of the app's data. `storageKey` matches
   App.i18n.STORAGE_KEY, so the picker and the i18n core agree on the locale.
   `path: null`: strings live next to each page, no HEAD discovery. */
window.LocalePickerConfig = {
  languageInDrawer: true,
  storageKey: '{{SLUG}}:locale',
  soundStorageKey: '{{SLUG}}:sounds',
  path: null,
  requiredLocales: ['es', 'en'],
  defaultLocale: 'es',
  soundSettings: false
};
