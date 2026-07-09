/* ============================================================
   Apptonomia — Tres en Raya (razonamiento: lógica y anticipación)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: la persona es ❌ y siempre empieza; el rival es ⭕ y
   juega según la habilidad del nivel (azar / remata su línea /
   también bloquea). Ganar da 1 estrella; el empate se celebra sin
   estrella; perder no se castiga (regla 5): mensaje de ánimo con un
   consejo y botón de jugar otra vez.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'tres-en-raya';
  var $ = App.utils.$;
  var JUGADOR = 'X';
  var RIVAL = 'O';
  var FICHA = { X: '❌', O: '⭕' };
  var LINEAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],   /* filas */
    [0, 3, 6], [1, 4, 7], [2, 5, 8],   /* columnas */
    [0, 4, 8], [2, 4, 6]               /* diagonales */
  ];
  var DELAY = App.utils.reducedMotion() ? 0 : 700;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var tableroEl = $('#tablero');
  var estadoEl = $('#estado');
  var feedbackEl = $('#feedback');
  var btnOtraPartida = $('#btnOtraPartida');
  var btnSalir = $('#btnSalir');
  var starsEl = $('#stars');

  /* Progreso persistente */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.victorias) progreso.victorias = {};

  /* Estado de la partida */
  var nivel = null;
  var celdas = [];        /* 'X' | 'O' | null, índices 0-8 */
  var botones = [];
  var turnoJugador = true;
  var partidaTerminada = false;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  /* ---- Pantalla inicial ---- */
  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    banco().niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.victorias[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + veces + ' ' + App.i18n.t('veces') + ')</span>';
      btn.addEventListener('click', function () { iniciarPartida(n); });
      cont.appendChild(btn);
    });
  }

  /* ---- Tablero ---- */
  function ariaCelda(i) {
    var f = Math.floor(i / 3) + 1;
    var c = (i % 3) + 1;
    var pos = App.i18n.t('fila').replace('{f}', f).replace('{c}', c);
    var estado = App.i18n.t('casillaVacia');
    if (celdas[i] === JUGADOR) estado = App.i18n.t('casillaTuya');
    if (celdas[i] === RIVAL) estado = App.i18n.t('casillaRival');
    return estado + ', ' + pos;
  }

  function pintarTablero() {
    botones.forEach(function (btn, i) {
      btn.textContent = celdas[i] ? FICHA[celdas[i]] : '';
      btn.disabled = partidaTerminada || !!celdas[i] || !turnoJugador;
      btn.setAttribute('aria-label', ariaCelda(i));
      btn.classList.toggle('tuya', celdas[i] === JUGADOR);
      btn.classList.toggle('rival', celdas[i] === RIVAL);
    });
  }

  function crearTablero() {
    tableroEl.innerHTML = '';
    botones = [];
    for (var i = 0; i < 9; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'celda';
      (function (idx, b) {
        b.addEventListener('click', function () { jugarTurno(idx); });
      })(i, btn);
      tableroEl.appendChild(btn);
      botones.push(btn);
    }
  }

  function iniciarPartida(n) {
    nivel = n;
    celdas = [null, null, null, null, null, null, null, null, null];
    turnoJugador = true;
    partidaTerminada = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnOtraPartida.classList.add('oculto');
    estadoEl.textContent = App.i18n.t('teToca');
    pantallaInicio.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    crearTablero();
    pintarTablero();
    pintarEstrellas();
  }

  /* ---- Lógica ---- */
  function lineaGanadora(quien) {
    for (var i = 0; i < LINEAS.length; i++) {
      var l = LINEAS[i];
      if (celdas[l[0]] === quien && celdas[l[1]] === quien && celdas[l[2]] === quien) return l;
    }
    return null;
  }

  function casillasLibres() {
    var libres = [];
    celdas.forEach(function (v, i) { if (!v) libres.push(i); });
    return libres;
  }

  /* Devuelve la casilla que completa una línea de 'quien', o -1. */
  function casillaQueCompleta(quien) {
    for (var i = 0; i < LINEAS.length; i++) {
      var l = LINEAS[i];
      var valores = [celdas[l[0]], celdas[l[1]], celdas[l[2]]];
      var mias = 0; var libre = -1;
      for (var j = 0; j < 3; j++) {
        if (valores[j] === quien) mias += 1;
        else if (!valores[j]) libre = l[j];
      }
      if (mias === 2 && libre !== -1) return libre;
    }
    return -1;
  }

  /* El rival juega según la habilidad del nivel (ver data.js):
     'azar' elige al azar; 'gana' remata su línea si puede; 'bloquea'
     además tapa la línea del jugador. Cada nivel añade UNA habilidad. */
  function eligeCasillaRival() {
    var hab = nivel.habilidad;
    if (hab === 'gana' || hab === 'bloquea') {
      var remate = casillaQueCompleta(RIVAL);
      if (remate !== -1) return remate;
    }
    if (hab === 'bloquea') {
      var tapar = casillaQueCompleta(JUGADOR);
      if (tapar !== -1) return tapar;
    }
    var libres = casillasLibres();
    return App.utils.shuffle(libres)[0];
  }

  function marcarLinea(linea) {
    linea.forEach(function (i) { botones[i].classList.add('ganadora'); });
  }

  function jugarTurno(idx) {
    if (partidaTerminada || !turnoJugador || celdas[idx]) return;
    celdas[idx] = JUGADOR;
    turnoJugador = false;
    pintarTablero();

    var lineaJugador = lineaGanadora(JUGADOR);
    if (lineaJugador) { terminar('jugador', lineaJugador); return; }
    if (casillasLibres().length === 0) { terminar('empate', null); return; }

    estadoEl.textContent = App.i18n.t('piensaRival');
    setTimeout(function () {
      if (partidaTerminada) return;
      var idxRival = eligeCasillaRival();
      celdas[idxRival] = RIVAL;
      var lineaRival = lineaGanadora(RIVAL);
      if (lineaRival) { terminar('rival', lineaRival); return; }
      if (casillasLibres().length === 0) { terminar('empate', null); return; }
      turnoJugador = true;
      estadoEl.textContent = App.i18n.t('teToca');
      pintarTablero();
    }, DELAY);
  }

  function terminar(resultado, linea) {
    partidaTerminada = true;
    turnoJugador = false;
    pintarTablero();
    if (linea) marcarLinea(linea);

    if (resultado === 'jugador') {
      estadoEl.textContent = App.i18n.t('hasGanado');
      progreso.estrellas += 1;
      progreso.victorias[nivel.id] = (progreso.victorias[nivel.id] || 0) + 1;
      guardar();
      pintarEstrellas();
      App.feedback.celebrar(App.i18n.t('hasGanado'));
    } else if (resultado === 'empate') {
      estadoEl.textContent = App.i18n.t('empate');
      App.feedback.acierto(feedbackEl);
      App.tts.speak(App.i18n.t('empate'));
    } else {
      /* Perder: nunca castigo (regla 5) — ánimo y un consejo concreto. */
      estadoEl.textContent = App.i18n.t('haGanadoRival');
      App.feedback.animo(feedbackEl);
      App.tts.speak(App.i18n.t('haGanadoRival'));
    }
    btnOtraPartida.classList.remove('oculto');
    btnOtraPartida.focus();
  }

  /* ---- Eventos ---- */
  btnOtraPartida.addEventListener('click', function () { iniciarPartida(nivel); });
  btnSalir.addEventListener('click', function () {
    App.tts.stop();
    pantallaJuego.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent + App.i18n.t('instruccionNivel'));
  });
  $('#btnEstado').addEventListener('click', function () {
    App.tts.speak(estadoEl.textContent);
  });

  pintarNiveles();
  pintarEstrellas();
})();
