/* ==========================================================================
   Apptonomia — Refuerzo positivo y mensajes de ánimo
   Expone window.App.feedback.acierto(zona) / .animo(zona) / .celebrar(msg)
   Reglas 5 y 6 de CLAUDE.md: el error nunca se castiga; refuerzo <= 2 s.
   Mensajes según idioma activo (App.i18n.pick). Requiere utils.js e i18n.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  function alAzar(clave) {
    if (window.App.i18n) return window.App.i18n.pick(clave);
    return '';
  }

  /* Sonido suave con Web Audio (sin archivos). Falla en silencio.
     Respeta la preferencia "Sonidos" de /ajustes/ (por defecto
     activados: solo se silencia si alguien la ha puesto a false). */
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
    } catch (e) { /* silencio */ }
  }

  function sonidoAcierto() {
    tono(523.25, 0.15);          /* do */
    setTimeout(function () { tono(659.25, 0.2); }, 120); /* mi */
  }

  function sonidoAnimo() {
    /* Suave y neutro, nunca duro (regla 5) */
    tono(392, 0.2, 'sine');
  }

  /**
   * Refuerzo positivo en una zona de feedback (elemento con aria-live).
   * @param {Element} [zona] - elemento donde escribir el mensaje
   * @returns {string} el mensaje usado
   */
  function acierto(zona) {
    var msg = alAzar('feedback.acierto');
    if (zona) {
      zona.textContent = '⭐ ' + msg;
      zona.classList.remove('animo');
      zona.classList.add('acierto');
    }
    sonidoAcierto();
    return msg;
  }

  /**
   * Mensaje de ánimo tras un fallo. Nunca punitivo.
   * @param {Element} [zona]
   * @returns {string} el mensaje usado
   */
  function animo(zona) {
    var msg = alAzar('feedback.animo');
    if (zona) {
      zona.textContent = msg;
      zona.classList.remove('acierto');
      zona.classList.add('animo');
    }
    sonidoAnimo();
    return msg;
  }

  /* Rondas completadas en esta sesión de página (regla 5: nunca en
     localStorage, nunca presión — solo una frase amable cada 5 rondas). */
  var rondasSesion = 0;

  /**
   * Pantalla de celebración breve (usa .celebration de components.css).
   * Crea el elemento si no existe. Se oculta sola tras 2 s.
   * @param {string} mensaje - p. ej. '¡Rutina completada!'
   * @param {function} [despues] - callback al ocultarse
   */
  function celebrar(mensaje, despues) {
    rondasSesion += 1;
    if (rondasSesion % 5 === 0) {
      var descanso = window.App.i18n ? window.App.i18n.t('core.descanso') : '';
      if (descanso) mensaje = mensaje + ' ' + descanso;
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
    acierto: acierto,
    animo: animo,
    celebrar: celebrar
  };
})();
