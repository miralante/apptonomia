/* ============================================================
   Apptonomia — La Casa (autonomía: ordenar tareas del hogar)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: tocar los pasos en el orden correcto. Un toque fuera
   de orden no penaliza: solo anima a seguir intentando.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'la-casa';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var tareaTituloEl = $('#tareaTitulo');
  var secuenciaEl = $('#secuencia');
  var disponiblesEl = $('#disponibles');
  var feedbackEl = $('#feedback');
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
  var tareas = [];
  var idx = 0;
  var aciertosRonda = 0;
  var siguienteEsperado = 0;
  var slots = [];

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
    tareas = App.utils.shuffle(nivel.tareas).slice(0, DATOS.porRonda);
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

  function render() {
    var tarea = tareas[idx];
    siguienteEsperado = 0;
    slots = new Array(tarea.pasos.length).fill(null);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    tareaTituloEl.textContent = tarea.nombre;

    pintarSlots();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(tarea.pasos.map(function (picto, orden) {
      return { picto: picto, orden: orden };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn paso';
      btn.textContent = p.picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso'));
      btn.addEventListener('click', function () { tocar(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function pintarSlots() {
    secuenciaEl.innerHTML = '';
    slots.forEach(function (picto) {
      var div = document.createElement('div');
      div.className = 'slot' + (picto ? ' lleno' : '');
      div.textContent = picto || '';
      secuenciaEl.appendChild(div);
    });
  }

  function tocar(orden, btn) {
    var tarea = tareas[idx];
    if (orden === siguienteEsperado) {
      slots[orden] = tarea.pasos[orden];
      pintarSlots();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackEl);
      siguienteEsperado += 1;
      if (siguienteEsperado >= tarea.pasos.length) {
        terminarTarea();
      }
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function terminarTarea() {
    progreso.estrellas += 1;
    aciertosRonda += 1;
    guardar();
    pintarEstrellas();
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
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
    App.feedback.celebrar(App.i18n.t('core.rondaCompletada'));
  }

  /* Events */
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

  pintarNiveles();
  pintarEstrellas();
})();
