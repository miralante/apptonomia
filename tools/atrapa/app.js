/* ============================================================
   Apptonomia — Atrapa (coordinación oculomanual)
   El objetivo aparece en posiciones aleatorias. Al tocarlo:
   refuerzo positivo y se recoloca (mínimo 30 % de distancia).
   10 toques = ronda completada. Sin cronómetro visible.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'atrapa';
  var $ = App.utils.$;
  var banco = DATA[App.i18n.locale()] || DATA.es;

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

  /* Progreso persistente */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.rondas) progreso.rondas = {};

  /* Estado */
  var nivel = null;
  var toques = 0;
  var posAnterior = { x: 0.5, y: 0.5 };

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function pintarProgreso() {
    progressFill.style.width = ((toques / DATA.toquesPorRonda) * 100) + '%';
    progressText.textContent = toques + ' / ' + DATA.toquesPorRonda;
  }

  /* Pantalla inicial: botones de nivel */
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

  /* Nueva posición aleatoria, alejada al menos un 30 % de la anterior */
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
    App.feedback.acierto(feedbackEl);
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
    App.feedback.celebrar('¡Ronda completada!');
  }

  /* Eventos */
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

  /* Recolocar el objetivo si cambia el tamaño de la ventana */
  window.addEventListener('resize', function () {
    if (nivel && !pantallaJuego.classList.contains('oculto')) moverObjetivo();
  });

  pintarNiveles();
  pintarEstrellas();
})();
