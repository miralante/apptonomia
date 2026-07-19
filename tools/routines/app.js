/* ============================================================
   Apptonomia — Mis Rutinas (secuenciación y autonomía)
   Rutinas diarias paso a paso. Cada paso se marca como "Hecho".
   El estado se reinicia automáticamente cada día.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'rutinas';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  var pantallaMenu = $('#pantallaMenu');
  var pantallaRutina = $('#pantallaRutina');
  var pantallaFinal = $('#pantallaFinal');
  var listaRutinas = $('#listaRutinas');
  var listaPasos = $('#listaPasos');
  var tituloRutina = $('#tituloRutina');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var feedbackEl = $('#feedback');
  var starsEl = $('#stars');

  /* Progreso persistente. Si la fecha guardada no es hoy, se reinicia. */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (progreso.fecha !== App.utils.hoy() || !progreso.hechos) {
    progreso.fecha = App.utils.hoy();
    progreso.hechos = {}; /* { idRutina: [true, false, ...] } */
  }

  var rutinaActual = null;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function hechosDe(rutina) {
    if (!progreso.hechos[rutina.id]) {
      progreso.hechos[rutina.id] = rutina.pasos.map(function () { return false; });
    }
    return progreso.hechos[rutina.id];
  }

  function contarHechos(rutina) {
    return hechosDe(rutina).filter(Boolean).length;
  }

  /* ---- Routine menu ---- */
  function pintarMenu() {
    pantallaRutina.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaMenu.classList.remove('oculto');
    listaRutinas.innerHTML = '';
    DATOS.forEach(function (rutina) {
      var hechos = contarHechos(rutina);
      var total = rutina.pasos.length;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card tarjeta-rutina';
      btn.innerHTML =
        '<span class="picto" aria-hidden="true">' + rutina.picto + '</span>' +
        '<span class="nombre">' + rutina.nombre + '</span>' +
        '<span class="estado">' +
        (hechos === total ? App.i18n.t('completadaHoy') : App.i18n.t('pasosDe').replace('{n}', hechos).replace('{total}', total)) +
        '</span>';
      btn.addEventListener('click', function () { abrirRutina(rutina); });
      listaRutinas.appendChild(btn);
    });
    pintarEstrellas();
  }

  /* ---- Vista de una rutina ---- */
  function abrirRutina(rutina) {
    rutinaActual = rutina;
    pantallaMenu.classList.add('oculto');
    pantallaRutina.classList.remove('oculto');
    tituloRutina.textContent = rutina.picto + ' ' + rutina.nombre;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    pintarPasos();
  }

  function pintarPasos() {
    var hechos = hechosDe(rutinaActual);
    var actual = hechos.indexOf(false); /* primer paso pendiente */
    listaPasos.innerHTML = '';

    rutinaActual.pasos.forEach(function (paso, i) {
      var li = document.createElement('li');
      li.className = 'paso' +
        (hechos[i] ? ' hecho' : '') +
        (i === actual ? ' actual' : '');

      var picto = '<span class="picto" aria-hidden="true">' + paso.picto + '</span>';
      var texto = '<span class="texto">' + paso.texto + '</span>';
      var audio = '<button type="button" class="btn btn-audio btn-oir" ' +
        'aria-label="' + App.i18n.t('ariaEscucharPaso') + '">🔊</button>';
      var hechoBtn = '<button type="button" class="btn btn-hecho"' +
        (i === actual ? '' : ' disabled') + '>' +
        App.i18n.t('btnHecho') + '</button>';

      li.innerHTML = picto + texto + audio + (hechos[i] ? '<span class="check" aria-label="' + App.i18n.t('ariaPasoHecho') + '">✔</span>' : hechoBtn);

      li.querySelector('.btn-oir').addEventListener('click', function () {
        App.tts.speak(paso.texto);
      });
      var btnHecho = li.querySelector('.btn-hecho');
      if (btnHecho) {
        btnHecho.addEventListener('click', function () { marcarHecho(i); });
      }
      listaPasos.appendChild(li);
    });

    var n = contarHechos(rutinaActual);
    var total = rutinaActual.pasos.length;
    progressFill.style.width = ((n / total) * 100) + '%';
    progressText.textContent = App.i18n.t('pasosDe').replace('{n}', n).replace('{total}', total);
  }

  function marcarHecho(i) {
    var hechos = hechosDe(rutinaActual);
    hechos[i] = true;
    guardar();
    App.feedback.success(feedbackEl);

    if (contarHechos(rutinaActual) === rutinaActual.pasos.length) {
      progreso.estrellas += 1;
      guardar();
      terminarRutina();
    } else {
      pintarPasos();
    }
  }

  function terminarRutina() {
    pintarPasos();
    pantallaRutina.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal').replace('{nombre}', rutinaActual.nombre);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('rutinaCompletadaTitulo'));
    pintarEstrellas();
  }

  /* Events */
  $('#btnOtraRutina').addEventListener('click', pintarMenu);
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent);
  });
  $('#btnVolver').addEventListener('click', function (e) {
    /* If we're inside a routine, go back to the routine menu */
    if (!pantallaRutina.classList.contains('oculto')) {
      e.preventDefault();
      App.tts.stop();
      pintarMenu();
    }
  });

  pintarMenu();
})();
