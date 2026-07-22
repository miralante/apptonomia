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
  var pantallaOrdenar = $('#pantallaOrdenar');
  var listaRutinas = $('#listaRutinas');
  var listaPasos = $('#listaPasos');
  var listaOrdenar = $('#listaOrdenar');
  var tituloRutina = $('#tituloRutina');
  var tituloOrdenar = $('#tituloOrdenar');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var feedbackEl = $('#feedback');
  var feedbackOrdenar = $('#feedbackOrdenar');
  var starsEl = $('#stars');

  /* Progreso persistente. Si la fecha guardada no es hoy, se reinicia. */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (progreso.fecha !== App.utils.hoy() || !progreso.hechos) {
    progreso.fecha = App.utils.hoy();
    progreso.hechos = {}; /* { idRutina: [true, false, ...] } */
  }
  /* Estado de la pantalla "Ordena la rutina". No se reinicia cada día:
     el progreso de ordenación es aprendizaje a largo plazo. */
  if (!progreso.orden || typeof progreso.orden !== 'object') progreso.orden = {};
  /* intentos: { idRutina: number } - contador Socrático (1ª pista, 2ª solución). */

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
    pantallaOrdenar.classList.add('oculto');
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
      var btnOrdenar = document.createElement('button');
      btnOrdenar.type = 'button';
      btnOrdenar.className = 'btn btn-ordenar-rutina';
      btnOrdenar.textContent = App.i18n.t('btnOrdenar');
      btnOrdenar.setAttribute('aria-label', App.i18n.t('btnOrdenar') + ': ' + rutina.nombre);
      btnOrdenar.addEventListener('click', function (e) {
        e.stopPropagation();
        abrirOrdenar(rutina);
      });
      btn.appendChild(btnOrdenar);
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

  /* ---- Pantalla "Ordena la rutina" ----
     Aprendizaje de secuencias. Los pasos aparecen mezclados y la persona
     los reordena con flechas ↑/↓ (accesible por teclado y sin arrastre).
     Patrón Socrático: 1.er error → pista (di el primer paso);
                        2.º error → botón "Ver solución" se ofrece explícito.
     Reglas: nunca castigo (App.feedback.encourage), +1⭐ al acertar,
     progreso persistente de orden (no se reinicia cada día). */
  var ordenActual = null; /* { rutina, mezcla: number[], intentos: number } */

  function barajar(arr) {
    /* Barajado Fisher-Yates, sin mutar el original. */
    var copia = arr.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copia[i]; copia[i] = copia[j]; copia[j] = tmp;
    }
    /* Si por azar queda ya ordenado, vuelve a barajar (no trampa al usuario). */
    var esOrden = copia.every(function (v, idx) { return v === idx; });
    if (esOrden && copia.length > 1) return barajar(arr);
    return copia;
  }

  function abrirOrdenar(rutina) {
    ordenActual = { rutina: rutina, mezcla: barajar(rutina.pasos.map(function (_, i) { return i; })), intentos: 0 };
    pantallaMenu.classList.add('oculto');
    pantallaRutina.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaOrdenar.classList.remove('oculto');
    tituloOrdenar.textContent = App.i18n.t('ordenTitulo').replace('{nombre}', rutina.nombre);
    feedbackOrdenar.textContent = '';
    feedbackOrdenar.className = 'feedback';
    pintarOrdenar();
  }

  function pintarOrdenar() {
    var rutina = ordenActual.rutina;
    listaOrdenar.innerHTML = '';
    ordenActual.mezcla.forEach(function (idxOriginal, i) {
      var paso = rutina.pasos[idxOriginal];
      var li = document.createElement('li');
      li.className = 'paso-ordenable';
      var esPrimero = i === 0;
      var esUltimo = i === ordenActual.mezcla.length - 1;
      li.innerHTML =
        '<span class="posicion" aria-hidden="true">' + (i + 1) + '</span>' +
        '<span class="picto" aria-hidden="true">' + paso.picto + '</span>' +
        '<span class="texto">' + paso.texto + '</span>' +
        '<button type="button" class="btn-flecha btn-subir"' +
        (esPrimero ? ' disabled' : '') +
        ' aria-label="' + App.i18n.t('ariaSubir') + '">↑</button>' +
        '<button type="button" class="btn-flecha btn-bajar"' +
        (esUltimo ? ' disabled' : '') +
        ' aria-label="' + App.i18n.t('ariaBajar') + '">↓</button>';
      li.querySelector('.btn-subir').addEventListener('click', function () { moverPaso(i, -1); });
      li.querySelector('.btn-bajar').addEventListener('click', function () { moverPaso(i, 1); });
      listaOrdenar.appendChild(li);
    });
  }

  function moverPaso(i, dir) {
    var j = i + dir;
    if (j < 0 || j >= ordenActual.mezcla.length) return;
    var arr = ordenActual.mezcla;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    pintarOrdenar();
  }

  function contarBienColocados() {
    var n = 0;
    ordenActual.mezcla.forEach(function (idx, i) { if (idx === i) n++; });
    return n;
  }

  function comprobarOrden() {
    var total = ordenActual.mezcla.length;
    var bien = contarBienColocados();
    var todoBien = bien === total;
    if (todoBien) {
      /* Éxito: +1⭐. Nunca restamos. */
      progreso.estrellas += 1;
      guardar();
      App.feedback.success(feedbackOrdenar);
      feedbackOrdenar.textContent = App.i18n.t('ordenCorrecto');
      App.feedback.celebrate(App.i18n.t('ordenCorrecto'));
      pintarEstrellas();
    } else {
      ordenActual.intentos++;
      guardar();
      App.feedback.encourage(feedbackOrdenar);
      feedbackOrdenar.textContent = App.i18n.t('ordenFeedback').replace('{n}', bien).replace('{total}', total) +
        ' ' + App.i18n.t('ordenIncorrecto');
    }
  }

  function pistaOrdenar() {
    /* Socrático: orientamos sin dar la solución completa. Decimos el primer paso. */
    var primeroCorrecto = ordenActual.rutina.pasos[0];
    feedbackOrdenar.textContent = App.i18n.t('pistaOrdenar').replace('{primero}', primeroCorrecto.texto);
    App.tts.speak(feedbackOrdenar.textContent);
  }

  function resolverOrdenar() {
    /* Socrático paso 2: mostramos la solución para que nadie se quede atascado. */
    ordenActual.mezcla = ordenActual.rutina.pasos.map(function (_, i) { return i; });
    pintarOrdenar();
    feedbackOrdenar.textContent = App.i18n.t('resolverOrdenar');
    App.tts.speak(feedbackOrdenar.textContent);
  }

  /* Events */
  $('#btnOtraRutina').addEventListener('click', pintarMenu);
  $('#btnComprobar').addEventListener('click', comprobarOrden);
  $('#btnPistaOrdenar').addEventListener('click', pistaOrdenar);
  $('#btnResolverOrdenar').addEventListener('click', resolverOrdenar);
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent);
  });
  $('#btnVolver').addEventListener('click', function (e) {
    /* If we're inside a routine, go back to the routine menu */
    if (!pantallaRutina.classList.contains('oculto') ||
        !pantallaOrdenar.classList.contains('oculto')) {
      e.preventDefault();
      App.tts.stop();
      pintarMenu();
    }
  });

  pintarMenu();
})();
