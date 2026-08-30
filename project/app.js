/* ==========================================================================
   Apptonomia — Deck institucional (deck/app.js)
   Navegación por teclado (←/→, Inicio/Fin, Espacio), botones, contador
   de slide y selector de idioma (es/en) sobre los strings declarados en
   strings.es.js / strings.en.js. Sin dependencias, accesible por diseño.

   Convenciones de la suite heredadas:
   - Detección de locale por navigator.languages con fallback a "es".
   - data-i18n="key" -> reemplaza textContent.
   - data-i18n-aria="key" -> reemplaza aria-label.
   - data-i18n-aria-pressed="key" -> toggle aria-pressed según el texto
     ("true"/"false"), usado por los botones ES/EN.
   - Sin frameworks, sin librerías.
   ========================================================================== */

(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // i18n mínimo (mismo patrón que el resto de la suite)
  // ---------------------------------------------------------------------
  var DIC = {};
  var currentLocale = 'es';

  function loadDictionary(locale) {
    var dict = (window.I18N && window.I18N[locale]) || {};
    DIC = dict;
    currentLocale = locale;
  }

  function t(key) {
    return (DIC && DIC[key]) || key;
  }

  function applyI18n() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      nodes[i].textContent = t(key);
    }
    var ariaNodes = document.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < ariaNodes.length; j++) {
      var aKey = ariaNodes[j].getAttribute('data-i18n-aria');
      ariaNodes[j].setAttribute('aria-label', t(aKey));
    }
    var apNodes = document.querySelectorAll('[data-i18n-aria-pressed]');
    for (var k = 0; k < apNodes.length; k++) {
      var apKey = apNodes[k].getAttribute('data-i18n-aria-pressed');
      apNodes[k].setAttribute('aria-pressed', String(t(apKey) === 'true'));
    }
    // <title> también se i18niza si lleva data-i18n.
    document.documentElement.setAttribute('lang', currentLocale);
  }

  function pickInitialLocale() {
    var nav = (navigator.languages || [navigator.language || 'es'])
      .map(function (l) { return l.toLowerCase().split('-')[0]; });
    var supported = Object.keys(window.I18N || {});
    for (var i = 0; i < nav.length; i++) {
      if (supported.indexOf(nav[i]) !== -1) return nav[i];
    }
    return supported[0] || 'es';
  }

  // ---------------------------------------------------------------------
  // Navegación por slides
  // ---------------------------------------------------------------------
  var slides = [];
  var current = 0;

  function collectSlides() {
    slides = Array.prototype.slice.call(
      document.querySelectorAll('.deck-stage > .slide')
    );
  }

  function updateCounter() {
    var n = current + 1;
    var total = slides.length;
    var n1 = document.getElementById('slideNum');
    var n2 = document.getElementById('slideNumFoot');
    var t1 = document.getElementById('slideTotal');
    var t2 = document.getElementById('slideTotalFoot');
    if (n1) n1.textContent = String(n);
    if (n2) n2.textContent = String(n);
    if (t1) t1.textContent = String(total);
    if (t2) t2.textContent = String(total);
  }

  function goTo(idx) {
    if (!slides.length) return;
    if (idx < 0) idx = 0;
    if (idx > slides.length - 1) idx = slides.length - 1;
    current = idx;
    var target = slides[current];
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // marca visual del slide activo
    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.toggle('is-active', i === current);
    }
    updateCounter();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // ---------------------------------------------------------------------
  // Atajos de teclado
  // ---------------------------------------------------------------------
  function onKey(e) {
    // No interceptar si el foco está en un campo editable (no hay, pero
    // por si en el futuro se añade un campo de búsqueda, por ejemplo).
    var tag = (e.target && e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ': // Space
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(slides.length - 1);
        break;
      case 'Escape':
        // Lleva al inicio si se ha hecho scroll fuera del escenario.
        if (window.scrollY > 100) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        break;
      default:
        break;
    }
  }

  // ---------------------------------------------------------------------
  // Selector de idioma
  // ---------------------------------------------------------------------
  function setLocale(locale) {
    if (!window.I18N || !window.I18N[locale]) return;
    loadDictionary(locale);
    applyI18n();
    var btns = document.querySelectorAll('[data-locale]');
    for (var i = 0; i < btns.length; i++) {
      var active = btns[i].getAttribute('data-locale') === locale;
      btns[i].setAttribute('aria-pressed', String(active));
    }
    try {
      window.localStorage.setItem('deck.locale', locale);
    } catch (e) { /* localStorage puede estar bloqueado en modo privado */ }
  }

  function bindLangButtons() {
    var btns = document.querySelectorAll('[data-locale]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        var loc = e.currentTarget.getAttribute('data-locale');
        setLocale(loc);
      });
    }
  }

  // ---------------------------------------------------------------------
  // Botones prev / next / print
  // ---------------------------------------------------------------------
  function bindNavButtons() {
    var prevBtn = document.getElementById('btnPrev');
    var nextBtn = document.getElementById('btnNext');
    var printBtn = document.getElementById('btnPrint');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        // Pequeño truco: hacer scroll al inicio antes de imprimir para
        // que el paginado refleje el orden natural de los slides.
        window.scrollTo(0, 0);
        // Pequeño delay para que el navegador aplique el scroll antes del
        // diálogo de impresión (algunos navegadores lo necesitan).
        setTimeout(function () {
          try { window.print(); } catch (e) { /* ignore */ }
        }, 50);
      });
    }
  }

  // ---------------------------------------------------------------------
  // Scroll-spy: actualiza el contador según la slide visible
  // ---------------------------------------------------------------------
  var scrollRaf = null;
  function onScroll() {
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(function () {
      scrollRaf = null;
      if (!slides.length) return;
      var stageTop = 0;
      var stageEl = document.querySelector('.deck-stage');
      if (stageEl) {
        var rect = stageEl.getBoundingClientRect();
        stageTop = rect.top + window.scrollY;
      }
      // Centro de la viewport como referencia.
      var pivot = window.scrollY + window.innerHeight * 0.35;
      var bestIdx = 0;
      var bestDist = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var sRect = slides[i].getBoundingClientRect();
        var sTop = sRect.top + window.scrollY;
        var dist = Math.abs(sTop - pivot);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      }
      if (bestIdx !== current) {
        current = bestIdx;
        for (var j = 0; j < slides.length; j++) {
          slides[j].classList.toggle('is-active', j === current);
        }
        updateCounter();
      }
    });
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  function init() {
    collectSlides();
    var saved = null;
    try { saved = window.localStorage.getItem('deck.locale'); } catch (e) { saved = null; }
    var initial = saved || pickInitialLocale();
    setLocale(initial);
    bindLangButtons();
    bindNavButtons();
    updateCounter();
    // Marcar la primera slide como activa.
    if (slides[0]) slides[0].classList.add('is-active');
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
