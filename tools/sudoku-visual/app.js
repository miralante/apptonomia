/* ============================================================
   Apptonomia — Sudoku Visual (razonamiento: lógica sin números)
   Datos en data.js (DATA.soluciones, DATA.temas, DATA.niveles).
   Mecánica: tablero 4×4 con pictos; se toca un hueco y después el
   picto de la paleta. Se valida contra la solución precalculada:
   primer fallo en un hueco → pista socrática (regla 12); segundo
   fallo → se explica y se coloca el picto correcto (regla 11),
   nadie se queda atascado. Ronda de 3 sudokus; 1 estrella por
   sudoku completado. El error nunca se castiga.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'sudoku-visual';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var tableroEl = $('#tablero');
  var paletaEl = $('#paleta');
  var estadoEl = $('#estado');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Progreso persistente */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};

  /* Estado de la ronda */
  var nivel = null;
  var idxPuzzle = 0;        /* sudoku actual dentro de la ronda */
  var aciertosRonda = 0;
  var solucion = [];        /* 16 índices 0-3 */
  var tema = [];            /* 4 pictos */
  var celdas = [];          /* índice 0-3 colocado, o null si es hueco */
  var botonesCelda = [];
  var huecoActivo = -1;
  var intentosHueco = {};   /* idx celda -> nº de fallos (regla 12) */

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
      var veces = progreso.completados[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + veces + ' ' + App.i18n.t('veces') + ')</span>';
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
    });
  }

  function iniciarRonda(n) {
    nivel = n;
    idxPuzzle = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    nuevoSudoku();
  }

  function pintarProgreso() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idxPuzzle / porRonda) * 100) + '%';
    progressText.textContent = idxPuzzle + ' / ' + porRonda;
  }

  /* ---- Montar un sudoku ---- */
  function nuevoSudoku() {
    var b = banco();
    solucion = App.utils.shuffle(b.soluciones)[0];
    tema = App.utils.shuffle(b.temas)[0];
    celdas = solucion.slice();
    /* Vaciar 'huecos' casillas al azar (regla 13: única variable por nivel) */
    var posiciones = App.utils.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
      .slice(0, nivel.huecos);
    posiciones.forEach(function (p) { celdas[p] = null; });

    huecoActivo = -1;
    intentosHueco = {};
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');
    estadoEl.textContent = App.i18n.t('eligeHueco');

    pintarTablero();
    pintarPaleta();
    pintarProgreso();
    pintarEstrellas();
  }

  function ariaCelda(i) {
    var f = Math.floor(i / 4) + 1;
    var c = (i % 4) + 1;
    if (celdas[i] === null) {
      return App.i18n.t('ariaHueco').replace('{f}', f).replace('{c}', c);
    }
    return App.i18n.t('ariaFija').replace('{picto}', tema[celdas[i]])
      .replace('{f}', f).replace('{c}', c);
  }

  function pintarTablero() {
    tableroEl.innerHTML = '';
    botonesCelda = [];
    for (var i = 0; i < 16; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'celda' +
        (celdas[i] === null ? ' hueco' : ' fija') +
        (esBloqueSombreado(i) ? ' bloque-b' : '');
      btn.textContent = celdas[i] === null ? '' : tema[celdas[i]];
      btn.disabled = celdas[i] !== null;
      btn.setAttribute('aria-label', ariaCelda(i));
      (function (idx, b2) {
        b2.addEventListener('click', function () { elegirHueco(idx); });
      })(i, btn);
      tableroEl.appendChild(btn);
      botonesCelda.push(btn);
    }
  }

  /* Bloques 2×2 alternos sombreados para que "la caja" se vea. */
  function esBloqueSombreado(i) {
    var f = Math.floor(i / 4);
    var c = i % 4;
    var bloque = Math.floor(f / 2) * 2 + Math.floor(c / 2);
    return bloque === 1 || bloque === 2;
  }

  function pintarPaleta() {
    paletaEl.innerHTML = '';
    tema.forEach(function (picto, vi) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-picto';
      btn.textContent = picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaPaleta').replace('{picto}', picto));
      btn.addEventListener('click', function () { elegirPicto(vi); });
      paletaEl.appendChild(btn);
    });
  }

  /* ---- Interacción: hueco y después picto ---- */
  function elegirHueco(i) {
    if (celdas[i] !== null) return;
    huecoActivo = i;
    botonesCelda.forEach(function (b, j) {
      b.classList.toggle('activa', j === i);
    });
    estadoEl.textContent = App.i18n.t('eligeDibujo');
    limpiarAviso();
  }

  function limpiarAviso() {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
  }

  function elegirPicto(vi) {
    if (huecoActivo === -1) {
      estadoEl.textContent = App.i18n.t('eligeHueco');
      return;
    }
    var i = huecoActivo;
    if (vi === solucion[i]) {
      colocar(i, vi);
      App.feedback.acierto(feedbackEl);
      explicacionEl.textContent = App.i18n.t('explicacionCorrecta');
      explicacionWrap.classList.remove('oculto');
      comprobarCompletado();
    } else {
      intentosHueco[i] = (intentosHueco[i] || 0) + 1;
      App.feedback.animo(feedbackEl);
      if (intentosHueco[i] === 1) {
        /* Regla 12: primer fallo → pista, nunca la respuesta */
        explicacionEl.textContent = App.i18n.t('pista');
        explicacionWrap.classList.remove('oculto');
      } else {
        /* Segundo fallo → se explica y se coloca (nadie se queda atascado) */
        var correcto = tema[solucion[i]];
        explicacionEl.textContent = App.i18n.t('explicacionIncorrecta').replace('{picto}', correcto);
        explicacionWrap.classList.remove('oculto');
        colocar(i, solucion[i]);
        comprobarCompletado();
      }
    }
  }

  function colocar(i, vi) {
    celdas[i] = vi;
    huecoActivo = -1;
    var btn = botonesCelda[i];
    btn.textContent = tema[vi];
    btn.disabled = true;
    btn.classList.remove('hueco', 'activa');
    btn.classList.add('fija', 'recien');
    btn.setAttribute('aria-label', ariaCelda(i));
    estadoEl.textContent = App.i18n.t('eligeHueco');
  }

  function quedanHuecos() {
    for (var i = 0; i < 16; i++) { if (celdas[i] === null) return true; }
    return false;
  }

  function comprobarCompletado() {
    if (quedanHuecos()) return;
    idxPuzzle += 1;
    aciertosRonda += 1;
    progreso.estrellas += 1;
    guardar();
    pintarEstrellas();
    pintarProgreso();
    estadoEl.textContent = App.i18n.t('sudokuCompletado');
    App.feedback.celebrar(App.i18n.t('sudokuCompletado'));
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
  }

  function siguiente() {
    App.tts.stop();
    if (idxPuzzle >= banco().porRonda) {
      terminarRonda();
    } else {
      nuevoSudoku();
    }
  }

  function terminarRonda() {
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda).replace('{total}', progreso.estrellas);
    App.feedback.celebrar(App.i18n.t('core.rondaCompletada'));
  }

  /* ---- Eventos ---- */
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent + App.i18n.t('instruccionNivel'));
  });
  $('#btnEstado').addEventListener('click', function () {
    App.tts.speak(estadoEl.textContent);
  });
  $('#btnEscucharExplicacion').addEventListener('click', function () {
    App.tts.speak(explicacionEl.textContent);
  });

  pintarNiveles();
  pintarEstrellas();
})();
