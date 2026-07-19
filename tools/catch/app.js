/* ============================================================
   Apptonomia — Catch (eye-hand coordination)
   The target appears at random positions. Tapping it triggers
   positive reinforcement and it moves again (at least 30% away).
   10 taps = round completed. No visible timer.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'atrapa';
  var $ = App.utils.$;

  var areaEl = $('#areaJuego');
  var objetivoEl = $('#objetivo');
  var feedbackEl = $('#feedback');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var resumenFinal = $('#resumenFinal');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.rondas) progreso.rondas = {};

  /* State */
  var nivel = null;
  var toques = 0;
  var posAnterior = { x: 0.5, y: 0.5 };

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function pintarProgreso() {
    progressFill.style.width = ((toques / DATA.toquesPorRonda) * 100) + '%';
    progressText.textContent = toques + ' / ' + DATA.toquesPorRonda;
  }

  /* Start screen: level buttons */
  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    DATA.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var completadas = progreso.rondas[n.id] || 0;
      btn.innerHTML = n.nombre +
        ' <span class="nivel-info">(' + completadas + ' rondas)</span>';
      btn.addEventListener('click', function () { empezar(n); });
      cont.appendChild(btn);
    });
  }

  function empezar(n) {
    nivel = n;
    toques = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    objetivoEl.style.width = nivel.tamano + 'px';
    objetivoEl.style.height = nivel.tamano + 'px';
    objetivoEl.style.fontSize = Math.round(nivel.tamano * 0.55) + 'px';
    pintarProgreso();
    moverObjetivo();
  }

  /* New random position, at least 30% away from the previous one */
  function moverObjetivo() {
    var x, y, dist, intentos = 0;
    do {
      x = 0.05 + Math.random() * 0.9;
      y = 0.05 + Math.random() * 0.9;
      dist = Math.hypot(x - posAnterior.x, y - posAnterior.y);
      intentos++;
    } while (dist < 0.3 && intentos < 20);
    posAnterior = { x: x, y: y };

    var maxX = areaEl.clientWidth - nivel.tamano;
    var maxY = areaEl.clientHeight - nivel.tamano;
    objetivoEl.style.left = Math.round(x * maxX) + 'px';
    objetivoEl.style.top = Math.round(y * maxY) + 'px';
    objetivoEl.textContent =
      DATA.objetivos[Math.floor(Math.random() * DATA.objetivos.length)];
  }

  function acierto() {
    toques += 1;
    progreso.estrellas += 1;
    guardar();
    pintarEstrellas();
    pintarProgreso();
    App.feedback.success(feedbackEl);
    if (toques >= DATA.toquesPorRonda) {
      terminarRonda();
    } else {
      moverObjetivo();
    }
  }

  function terminarRonda() {
    progreso.rondas[nivel.id] = (progreso.rondas[nivel.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    resumenFinal.textContent =
      'Has atrapado ' + DATA.toquesPorRonda + ' dibujos. ¡Muy bien!';
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate('¡Ronda completada!');
  }

  /* Events */
  objetivoEl.addEventListener('click', acierto);
  $('#btnRepetir').addEventListener('click', function () { empezar(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent + ' Primero elige el tamaño.');
  });

  /* Reposition the target if the window size changes */
  window.addEventListener('resize', function () {
    if (nivel && !pantallaJuego.classList.contains('oculto')) moverObjetivo();
  });

  pintarNiveles();
  pintarEstrellas();
})();
