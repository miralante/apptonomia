/* ==========================================================================
   Apptonomia — Utilidades compartidas
   Expone window.App.utils
   Cargar con: <script src="../../assets/js/utils.js"></script>
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  /**
   * Baraja una copia del array (Fisher-Yates).
   * Nunca usar sort(() => Math.random() - 0.5).
   */
  function shuffle(array) {
    var copy = array.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  /** Atajo de querySelector. */
  function $(selector) {
    return document.querySelector(selector);
  }

  /** Atajo de querySelectorAll (devuelve Array). */
  function $$(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  /** Fecha de hoy como 'YYYY-MM-DD' (para rutinas diarias). */
  function hoy() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  /** true si el usuario prefiere menos animaciones. */
  function reducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** true si el dispositivo es principalmente táctil (no se espera teclado
      físico): sin puntero fino (ratón/trackpad) como entrada principal.
      Un portátil con pantalla táctil sigue dando false (su entrada principal
      es el ratón/trackpad), un móvil o tablet da true. */
  function esTactil() {
    return !!(window.matchMedia &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }

  /* Mantener la pantalla encendida durante la actividad (Screen Wake Lock).
     Mejora progresiva: si el navegador no la soporta, no pasa nada.
     Requiere gesto de usuario, así que se pide en el primer toque/clic;
     se vuelve a pedir al recuperar visibilidad (el lock se libera solo
     al ocultar la pestaña). */
  if ('wakeLock' in navigator) {
    var wakeLockSentinel = null;
    var pedirWakeLock = function () {
      navigator.wakeLock.request('screen').then(function (sentinel) {
        wakeLockSentinel = sentinel;
      }).catch(function () { /* denegado o no disponible: seguir sin bloqueo */ });
    };
    document.addEventListener('pointerdown', function primeraVez() {
      pedirWakeLock();
      document.removeEventListener('pointerdown', primeraVez);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && wakeLockSentinel) {
        pedirWakeLock();
      }
    });
  }

  window.App.utils = {
    shuffle: shuffle,
    $: $,
    $$: $$,
    hoy: hoy,
    reducedMotion: reducedMotion,
    esTactil: esTactil
  };
})();
