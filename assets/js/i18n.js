/* ==========================================================================
   Apptonomia — Internacionalización (i18n)
   Expone window.App.i18n. Cargar DESPUÉS de utils.js y ANTES de tts.js/feedback.js.
   Orden estándar: utils.js -> i18n.js -> tts.js -> storage.js -> feedback.js ->
   strings.js -> data.js -> app.js.

   Idioma activo: localStorage 'apptonomia:locale' si es soportado; si no,
   se detecta navigator.language (prefijo 'en' -> 'en', cualquier otro -> 'es').
   Cada página registra sus propios textos con App.i18n.register({es:{...}, en:{...}}).
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var CLAVE_LOCALE = 'apptonomia:locale';
  var SOPORTADOS = ['es', 'en'];
  var POR_DEFECTO = 'es';

  var DICT = {
    es: {
      core: {
        volver: '← Volver',
        volverAlMenu: 'Volver al menú',
        jugarOtraVez: 'Jugar otra vez',
        siguiente: 'Siguiente →',
        escuchar: '🔊 Escuchar',
        escucharInstrucciones: 'Escuchar las instrucciones',
        escucharTexto: 'Escuchar el texto',
        cargando: 'Cargando…',
        rondaCompletada: '¡Ronda completada!',
        descanso: '¡Llevas un buen rato! Puedes descansar si quieres.'
      },
      feedback: {
        acierto: ['¡Muy bien!', '¡Genial!', '¡Lo has conseguido!', '¡Estupendo!', '¡Sigue así!'],
        animo: ['Casi. ¡Inténtalo otra vez!', 'No pasa nada. ¡Otra vez!', 'Prueba de nuevo. ¡Tú puedes!']
      }
    },
    en: {
      core: {
        volver: '← Back',
        volverAlMenu: 'Back to menu',
        jugarOtraVez: 'Play again',
        siguiente: 'Next →',
        escuchar: '🔊 Listen',
        escucharInstrucciones: 'Listen to the instructions',
        escucharTexto: 'Listen to the text',
        cargando: 'Loading…',
        rondaCompletada: 'Round complete!',
        descanso: 'You have been playing a while! You can rest if you want.'
      },
      feedback: {
        acierto: ['Well done!', 'Great!', 'You got it!', 'Fantastic!', 'Keep it up!'],
        animo: ['Almost. Try again!', "That's okay. Try again!", 'Try once more. You can do it!']
      }
    }
  };

  function detectar() {
    try {
      var idiomas = navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ''];
      for (var i = 0; i < idiomas.length; i++) {
        var prefijo = (idiomas[i] || '').slice(0, 2).toLowerCase();
        if (SOPORTADOS.indexOf(prefijo) !== -1) return prefijo;
      }
    } catch (e) { /* ignorar */ }
    return POR_DEFECTO;
  }

  function locale() {
    try {
      var guardado = localStorage.getItem(CLAVE_LOCALE);
      if (guardado && SOPORTADOS.indexOf(guardado) !== -1) return guardado;
    } catch (e) { /* ignorar */ }
    return detectar();
  }

  function setLocale(loc) {
    if (SOPORTADOS.indexOf(loc) === -1) return;
    try {
      localStorage.setItem(CLAVE_LOCALE, loc);
    } catch (e) { /* ignorar */ }
    location.reload();
  }

  function lang() {
    return locale() === 'en' ? 'en-US' : 'es-ES';
  }

  /** Fusiona un diccionario nuevo {es:{...}, en:{...}} en el diccionario interno. */
  function register(dict) {
    SOPORTADOS.forEach(function (loc) {
      if (!dict[loc]) return;
      DICT[loc] = DICT[loc] || {};
      for (var clave in dict[loc]) {
        if (Object.prototype.hasOwnProperty.call(dict[loc], clave)) {
          DICT[loc][clave] = dict[loc][clave];
        }
      }
    });
  }

  function buscar(dictLoc, key) {
    var partes = key.split('.');
    var actual = dictLoc;
    for (var i = 0; i < partes.length; i++) {
      if (actual == null) return undefined;
      actual = actual[partes[i]];
    }
    return actual;
  }

  function t(key) {
    var loc = locale();
    var valor = buscar(DICT[loc], key);
    if (valor === undefined && loc !== POR_DEFECTO) {
      valor = buscar(DICT[POR_DEFECTO], key);
    }
    if (valor === undefined) return key;
    if (Array.isArray(valor)) return valor.join(', ');
    return valor;
  }

  function pick(key) {
    var loc = locale();
    var valor = buscar(DICT[loc], key);
    if (!Array.isArray(valor) && loc !== POR_DEFECTO) {
      valor = buscar(DICT[POR_DEFECTO], key);
    }
    if (!Array.isArray(valor) || !valor.length) return '';
    return valor[Math.floor(Math.random() * valor.length)];
  }

  function apply(root) {
    root = root || document;
    var nodos = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodos.length; i++) {
      nodos[i].textContent = t(nodos[i].getAttribute('data-i18n'));
    }
    var ariaNodos = root.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < ariaNodos.length; j++) {
      ariaNodos[j].setAttribute('aria-label', t(ariaNodos[j].getAttribute('data-i18n-aria')));
    }
    var tituloClave = document.documentElement.getAttribute('data-i18n-title');
    if (tituloClave) {
      document.title = t(tituloClave) + ' | Apptonomia';
    }
  }

  function inicio() {
    document.documentElement.lang = locale();
    apply(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicio);
  } else {
    inicio();
  }

  window.App.i18n = {
    SOPORTADOS: SOPORTADOS,
    locale: locale,
    setLocale: setLocale,
    lang: lang,
    register: register,
    t: t,
    pick: pick,
    apply: apply
  };
})();
