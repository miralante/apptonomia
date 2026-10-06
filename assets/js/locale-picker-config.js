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
   its own, so the shared ⚙️ IS its settings UI and stays enabled. With
   `languageInDrawer` the dropdown moves INTO that drawer, as its first
   row, and the ⚙️ is left alone in the header: language and display
   preferences in one place instead of two controls side by side. The
   other seven apps keep the dropdown in the header, which is the
   component's default.
   ========================================================================== */
window.LocalePickerConfig = {
  storageKey: 'apptonomia:locale',
  settingsStorageKey: 'apptonomia:locale:accessibility',
  /* El idioma vive DENTRO del cajón del ⚙️, no al lado en la cabecera. En
     esta portada el ⚙️ es toda la configuración, así que el desplegable
     fuera de él era un segundo sitio donde cambiar preferencias; dentro
     del cajón queda con el tema, la letra y el contraste. Coste: un clic
     más para llegar al idioma. */
  languageInDrawer: true,
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
