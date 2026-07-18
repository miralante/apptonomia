/* ==========================================================================
   Apptonomia — Positive reinforcement and encouragement messages
   Exposes window.App.feedback.success(zona) / .encourage(zona) / .celebrate(msg)
   Rules 5 and 6 of CLAUDE.md: mistakes are never punished; feedback <= 2 s.
   Messages follow the active language (App.i18n.pick). Requires utils.js and i18n.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  function alAzar(clave) {
    if (window.App.i18n) return window.App.i18n.pick(clave);
    return '';
  }

  /* Soft sound with Web Audio (no audio files). Fails silently.
     Honors the "Sounds" preference from /settings/ (on by default:
     only muted if someone has explicitly turned it off). */
  var audioCtx = null;

  function sonidosActivados() {
    if (!window.App.storage) return true;
    return App.storage.get('prefs').sonidos !== false;
  }

  function tono(frecuencia, duracion, tipo) {
    if (!sonidosActivados()) return;
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = tipo || 'sine';
      osc.frequency.value = frecuencia;
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracion);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duracion);
    } catch (e) { /* silent */ }
  }

  function sonidoAcierto() {
    tono(523.25, 0.15);          /* C */
    setTimeout(function () { tono(659.25, 0.2); }, 120); /* E */
  }

  function sonidoAnimo() {
    /* Soft and neutral, never harsh (rule 5) */
    tono(392, 0.2, 'sine');
  }

  /**
   * Positive reinforcement in a feedback zone (element with aria-live).
   * @param {Element} [zona] - element to write the message into
   * @returns {string} the message used
   */
  function success(zona) {
    var msg = alAzar('feedback.success');
    if (zona) {
      zona.textContent = '⭐ ' + msg;
      zona.classList.remove('encourage');
      zona.classList.add('success');
    }
    sonidoAcierto();
    return msg;
  }

  /**
   * Encouragement message after a mistake. Never punitive.
   * @param {Element} [zona]
   * @returns {string} the message used
   */
  function encourage(zona) {
    var msg = alAzar('feedback.encourage');
    if (zona) {
      zona.textContent = msg;
      zona.classList.remove('success');
      zona.classList.add('encourage');
    }
    sonidoAnimo();
    return msg;
  }

  /* Rounds completed in this page session (rule 5: never in
     localStorage, never pressure — just a kind phrase every 5 rounds). */
  var rondasSesion = 0;

  /**
   * Brief celebration screen (uses .celebration from components.css).
   * Creates the element if it doesn't exist. Hides itself after 2 s.
   * @param {string} mensaje - e.g. '¡Rutina completada!'
   * @param {function} [despues] - callback when it hides
   */
  function celebrate(mensaje, despues) {
    rondasSesion += 1;
    if (rondasSesion % 5 === 0) {
      var rest = window.App.i18n ? window.App.i18n.t('core.rest') : '';
      if (rest) mensaje = mensaje + ' ' + rest;
    }
    var capa = document.getElementById('app-celebration');
    if (!capa) {
      capa = document.createElement('div');
      capa.id = 'app-celebration';
      capa.className = 'celebration hidden';
      capa.setAttribute('role', 'status');
      capa.innerHTML =
        '<div class="emoji">🎉</div>' +
        '<div class="mensaje"></div>';
      document.body.appendChild(capa);
    }
    capa.querySelector('.mensaje').textContent = mensaje;
    capa.classList.remove('hidden');
    sonidoAcierto();

    var duracion = (window.App.utils && window.App.utils.reducedMotion()) ? 1200 : 2000;
    setTimeout(function () {
      capa.classList.add('hidden');
      if (despues) despues();
    }, duracion);
  }

  window.App.feedback = {
    success: success,
    encourage: encourage,
    celebrate: celebrate
  };
})();
