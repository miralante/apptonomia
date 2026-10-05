/* ==========================================================================
   Apptonomia — Locale picker configuration.
   Must be an external file, not an inline <script>: the CSP in `_headers`
   is `script-src 'self'` with no `unsafe-inline`, so an inline block is
   blocked and window.LocalePickerConfig stays undefined. The component then
   falls back to ITS OWN defaults — `js/strings` probed with HEAD on every
   load, and the `apptonomia:locale` key of a sibling app. Same reason
   assets/js/sw-register.js is an external file.
   Load it BEFORE assets/js/locale-picker.js, and without `defer`, so it
   runs first: the picker is deferred, and deferred scripts keep their
   document order but a classic script always beats them.

   The landing is the suite's public front door and has no settings route of
   its own, so the shared ⚙️ IS its settings UI and stays enabled. The gear
   sits top right, beside this dropdown; neither is inside the other.
   ========================================================================== */
window.LocalePickerConfig = {
  storageKey: 'apptonomia:locale',
  settingsStorageKey: 'apptonomia:locale:accessibility',
  /* Sin descubrimiento por HEAD. El componente solo admite es/en
     (SUPPORTED_LOCALES esta fijado en el codigo), asi que sondear
     js/strings.<locale>.js no puede descubrir un tercer idioma que
     requiredLocales no declare ya. Solo costs requests: en la portada
     resolvia bien, pero en las subpaginas (about/, legal/, team/,
     project/) la ruta es relativa a la pagina y cada carga pedia dos
     ficheros que no existen ahi — dos 404 por visita. Las otras cinco
     apps de la suite ya van en path: null por este mismo motivo. */
  path: null,
  requiredLocales: ['es', 'en'],
  defaultLocale: 'en',
  /* The public suite landing has no interactive sound feedback, so audio
     preferences do not apply here: the drawer drops both sound switches
     instead of offering controls that cannot do anything. */
  soundSettings: false,
  /* The landing's body copy is sized in px through --text-base, so the text
     size buttons have to scale that token too — changing only the root
     font-size leaves the page text exactly the same size. */
  textBaseToken: true
};
