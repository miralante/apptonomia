/* ============================================================
   Apptonomia — Trazos (motricidad fina)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: repasar con el dedo/ratón una guía de puntos. Se
   comprueba cuánta guía se ha cubierto (sin exigir perfección).
   Sin límite de intentos: "Borrar" permite volver a empezar.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'trazos';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var formaTituloEl = $('#formaTitulo');
  var lienzo = $('#lienzo');
  var guiaPath = $('#guia');
  var trazoPath = $('#trazoUsuario');
  var feedbackEl = $('#feedback');
  var btnBorrar = $('#btnBorrar');
  var btnComprobar = $('#btnComprobar');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};

  /* Round state */
  var nivel = null;
  var formas = [];
  var idx = 0;
  var aciertosRonda = 0;
  var resuelto = false;
  var trazos = [];       /* array de trazos; cada uno, array de [x,y] */
  var dibujando = false;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    DATOS.niveles.forEach(function (n) {
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
    formas = App.utils.shuffle(nivel.formas).slice(0, DATOS.porRonda);
    idx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    render();
  }

  function pintarProgreso() {
    progressFill.style.width = ((idx / DATOS.porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + DATOS.porRonda;
  }

  function cadenaDesdePuntos(puntos) {
    return 'M ' + puntos.map(function (p) { return p[0] + ',' + p[1]; }).join(' L ');
  }

  function render() {
    var forma = formas[idx];
    resuelto = false;
    trazos = [];
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    formaTituloEl.textContent = forma.nombre;
    guiaPath.setAttribute('d', cadenaDesdePuntos(forma.puntos));
    trazoPath.setAttribute('d', '');

    pintarProgreso();
    pintarEstrellas();
  }

  /* ---- Drawing with pointer (mouse, finger, or pen) ---- */
  function coordenadas(evt) {
    var rect = lienzo.getBoundingClientRect();
    var x = ((evt.clientX - rect.left) / rect.width) * 100;
    var y = ((evt.clientY - rect.top) / rect.height) * 100;
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  }

  function pintarTrazoUsuario() {
    var d = trazos
      .filter(function (t) { return t.length > 0; })
      .map(cadenaDesdePuntos)
      .join(' ');
    trazoPath.setAttribute('d', d);
  }

  function iniciarTrazo(evt) {
    if (resuelto) return;
    evt.preventDefault();
    dibujando = true;
    try { lienzo.setPointerCapture(evt.pointerId); } catch (e) { /* ignorar */ }
    trazos.push([coordenadas(evt)]);
  }

  function continuarTrazo(evt) {
    if (!dibujando || resuelto) return;
    evt.preventDefault();
    trazos[trazos.length - 1].push(coordenadas(evt));
    pintarTrazoUsuario();
  }

  function terminarTrazo() {
    dibujando = false;
  }

  /* ---- Coverage check ---- */
  function puntosFinos(puntos, pasos) {
    var finos = [];
    for (var i = 0; i < puntos.length - 1; i++) {
      var a = puntos[i], b = puntos[i + 1];
      for (var j = 0; j <= pasos; j++) {
        finos.push([
          a[0] + ((b[0] - a[0]) * j) / pasos,
          a[1] + ((b[1] - a[1]) * j) / pasos
        ]);
      }
    }
    return finos;
  }

  function distancia(p1, p2) {
    return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
  }

  function comprobar() {
    if (resuelto) return;
    var forma = formas[idx];
    var objetivo = puntosFinos(forma.puntos, 6);
    var dibujados = trazos.reduce(function (acc, t) { return acc.concat(t); }, []);

    if (!dibujados.length) {
      App.feedback.encourage(feedbackEl);
      return;
    }

    var cubiertos = objetivo.filter(function (obj) {
      return dibujados.some(function (d) { return distancia(obj, d) <= DATOS.tolerancia; });
    }).length;
    var porcentaje = cubiertos / objetivo.length;

    if (porcentaje >= 0.75) {
      resuelto = true;
      App.feedback.success(feedbackEl);
      progreso.estrellas += 1;
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function borrar() {
    if (resuelto) return;
    trazos = [];
    trazoPath.setAttribute('d', '');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
  }

  function siguiente() {
    idx += 1;
    App.tts.stop();
    if (idx >= DATOS.porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda)
      .replace('{total}', progreso.estrellas);
    App.feedback.celebrate(App.i18n.t('finalTitulo'));
  }

  /* Events */
  lienzo.addEventListener('pointerdown', iniciarTrazo);
  lienzo.addEventListener('pointermove', continuarTrazo);
  lienzo.addEventListener('pointerup', terminarTrazo);
  lienzo.addEventListener('pointercancel', terminarTrazo);
  btnBorrar.addEventListener('click', borrar);
  btnComprobar.addEventListener('click', comprobar);
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak(App.i18n.t('instruccionCompleta'));
  });

  pintarNiveles();
  pintarEstrellas();
})();
