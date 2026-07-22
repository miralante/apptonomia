/* ============================================================
   Apptonomia — Palabras (lenguaje: vocabulario temático)
   Datos en data.js (DATA.temas). Módulos compartidos en assets/js/.
   Mecánica: se muestra un picto y hay que elegir su palabra entre
   3 opciones. La palabra se lee sola al aparecer. Ronda de 10.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'palabras';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var itemPictoEl = $('#itemPicto');
  var opcionesEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnEscucharExplicacion = $('#btnEscucharExplicacion');
  var btnEscuchar = $('#btnEscuchar');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};

  /* Round state */
  var tema = null;
  var items = [];
  var idx = 0;
  var aciertosRonda = 0;
  var resuelto = false;
  var intentos = 0;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function pintarTemas() {
    var cont = $('#temas');
    cont.innerHTML = '';
    banco().temas.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[t.id] || 0;
      btn.innerHTML = t.picto + ' ' + t.nombre +
        ' <span class="nivel-info">' + App.i18n.t('veces').replace('{n}', veces) + '</span>';
      btn.addEventListener('click', function () { iniciarRonda(t); });
      cont.appendChild(btn);
    });
  }

  function iniciarRonda(t) {
    tema = t;
    items = App.utils.shuffle(tema.items).slice(0, banco().porRonda);
    idx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    render();
  }

  function pintarProgreso() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idx / porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + porRonda;
  }

  function opcionesDistractoras(item) {
    var otras = tema.items.filter(function (i) { return i.palabra !== item.palabra; });
    return App.utils.shuffle(otras).slice(0, 2);
  }

  function render() {
    var item = items[idx];
    resuelto = false;
    intentos = 0;
    itemPictoEl.textContent = item.picto;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');
    opcionesEl.innerHTML = '';

    var opciones = App.utils.shuffle(
      [{ palabra: item.palabra, esCorrecta: true }].concat(
        opcionesDistractoras(item).map(function (d) { return { palabra: d.palabra, esCorrecta: false }; })
      )
    );

    opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.palabra;
      btn.addEventListener('click', function () { responder(btn, op.esCorrecta, item); });
      opcionesEl.appendChild(btn);
    });

    App.tts.speak(item.palabra);
    pintarProgreso();
    pintarEstrellas();
  }

  function mostrarExplicacion(esCorrecta, item) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.palabra + '.';
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('oculto');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to look at the picture again. Only on
     the second mistake is the correct answer explained
     (mostrarExplicacion). */
  function mostrarPista() {
    explicacionEl.textContent = App.i18n.t('pista');
    explicacionWrap.classList.remove('oculto');
  }

  function responder(btn, esCorrecta, item) {
    if (resuelto) return;
    if (esCorrecta) {
      mostrarExplicacion(esCorrecta, item);
      resuelto = true;
      btn.classList.add('correcta');
      App.utils.$$('#opciones .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progreso.estrellas += 1;
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else {
      intentos += 1;
      if (intentos === 1) {
        mostrarPista();
      } else {
        mostrarExplicacion(esCorrecta, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
    }
  }

  function siguiente() {
    idx += 1;
    App.tts.stop();
    if (idx >= banco().porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    progreso.completados[tema.id] = (progreso.completados[tema.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda)
      .replace('{total}', progreso.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnEscuchar.addEventListener('click', function () {
    App.tts.speak(items[idx].palabra);
  });
  btnSiguiente.addEventListener('click', siguiente);
  btnEscucharExplicacion.addEventListener('click', function () {
    App.tts.speak(explicacionEl.textContent);
  });
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(tema); });
  $('#btnOtroTema').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarTemas();
    pantallaInicio.classList.remove('oculto');
  });

  pintarTemas();
  pintarEstrellas();
})();

