/* ==========================================================================
   Apptonomia — Texto a voz (Web Speech API)
   Expone window.App.tts.speak(texto, onEnd) y App.tts.stop()
   Voz e idioma según App.i18n.lang() (regla 4 de CLAUDE.md: velocidad 0.9).
   Requiere i18n.js cargado antes.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var disponible = 'speechSynthesis' in window;
  var voces = [];

  function idiomaActivo() {
    return (window.App.i18n && window.App.i18n.lang()) || 'es-ES';
  }

  function elegirVoz(prefijo) {
    var elegida = null;
    for (var i = 0; i < voces.length; i++) {
      if (voces[i].lang && voces[i].lang.indexOf(prefijo) === 0) {
        elegida = voces[i];
        if (voces[i].lang === idiomaActivo()) break;
      }
    }
    return elegida;
  }

  function cargarVoces() {
    if (!disponible) return;
    voces = window.speechSynthesis.getVoices();
  }

  if (disponible) {
    cargarVoces();
    window.speechSynthesis.onvoiceschanged = cargarVoces;
  }

  /**
   * Lee un texto en voz alta. Cancela cualquier lectura anterior.
   * @param {string} texto
   * @param {function} [onEnd] - callback al terminar (opcional)
   */
  function speak(texto, onEnd) {
    if (!disponible || !texto) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    var lang = idiomaActivo();
    var u = new SpeechSynthesisUtterance(texto);
    u.lang = lang;
    u.rate = 0.9;
    u.pitch = 1;
    var voz = elegirVoz(lang.slice(0, 2));
    if (voz) u.voice = voz;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  }

  /** Detiene la lectura actual. */
  function stop() {
    if (disponible) window.speechSynthesis.cancel();
  }

  window.App.tts = {
    speak: speak,
    stop: stop,
    disponible: disponible
  };
})();
