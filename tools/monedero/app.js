/* ============================================================
   Apptonomia — El Monedero (matemáticas cotidianas)
   Datos en data.js (DATA[locale].niveles). Módulos compartidos en assets/js/.
   Mecánica: tocar monedas hasta llegar al precio exacto.
   Los importes se trabajan en céntimos (enteros) para evitar
   errores de coma flotante. Si falta o sobra dinero, no es un
   error: se anima a seguir ajustando las monedas.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'monedero';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var productoEl = $('#producto');
  var precioTextoEl = $('#precioTexto');
  var totalPuestoEl = $('#totalPuesto');
  var monedasEl = $('#monedas');
  var feedbackEl = $('#feedback');
  var btnEscuchar = $('#btnEscuchar');
  var btnComprobar = $('#btnComprobar');
  var btnQuitar = $('#btnQuitar');
  var btnVaciar = $('#btnVaciar');
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
  var productos = [];
  var idx = 0;
  var aciertosRonda = 0;
  var puestas = [];      /* céntimos de cada moneda tocada, en orden */
  var resuelto = false;

  function datos() { return DATA[App.i18n.locale()] || DATA.es; }

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function centimos(valorEuros) { return Math.round(valorEuros * 100); }

  function formatear(centimosValor) {
    var sep = App.i18n.locale() === 'en' ? '.' : ',';
    return (centimosValor / 100).toFixed(2).replace('.', sep) + ' €';
  }

  function etiquetaMoneda(valorEuros) {
    return valorEuros >= 1 ? valorEuros + ' €' : Math.round(valorEuros * 100) + ' c';
  }

  /* ---- Pantalla inicial ---- */
  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    datos().niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + App.i18n.t('vecesTexto').replace('{n}', veces) + ')</span>';
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
    });
  }

  function iniciarRonda(n) {
    nivel = n;
    productos = App.utils.shuffle(nivel.productos).slice(0, datos().porRonda);
    idx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    pintarMonedas();
    render();
  }

  function pintarMonedas() {
    monedasEl.innerHTML = '';
    nivel.monedas.forEach(function (valor) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn moneda';
      btn.textContent = etiquetaMoneda(valor);
      btn.setAttribute('aria-label', App.i18n.t('anadirMoneda').replace('{valor}', etiquetaMoneda(valor)));
      btn.addEventListener('click', function () { anadirMoneda(valor); });
      monedasEl.appendChild(btn);
    });
  }

  function pintarProgreso() {
    progressFill.style.width = ((idx / datos().porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + datos().porRonda;
  }

  function totalPuestas() {
    return puestas.reduce(function (suma, c) { return suma + c; }, 0);
  }

  function pintarTotal() {
    totalPuestoEl.textContent = App.i18n.t('hasPuesto').replace('{total}', formatear(totalPuestas()));
  }

  function render() {
    var item = productos[idx];
    resuelto = false;
    puestas = [];
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    btnComprobar.disabled = false;
    productoEl.textContent = item.picto;
    var sep = App.i18n.locale() === 'en' ? '.' : ',';
    precioTextoEl.textContent = item.nombre + ': ' + item.precio.toFixed(2).replace('.', sep) + ' €';
    pintarTotal();
    pintarProgreso();
    pintarEstrellas();
  }

  function anadirMoneda(valorEuros) {
    if (resuelto) return;
    puestas.push(centimos(valorEuros));
    pintarTotal();
  }

  function quitarUltima() {
    if (resuelto) return;
    puestas.pop();
    pintarTotal();
  }

  function vaciar() {
    if (resuelto) return;
    puestas = [];
    pintarTotal();
  }

  function comprobar() {
    if (resuelto) return;
    var item = productos[idx];
    var objetivo = centimos(item.precio);
    var puesto = totalPuestas();

    if (puesto === objetivo) {
      resuelto = true;
      App.feedback.acierto(feedbackEl);
      progreso.estrellas += 1;
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      btnComprobar.disabled = true;
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else if (puesto < objetivo) {
      feedbackEl.textContent = App.i18n.t('faltaDinero');
      feedbackEl.className = 'feedback animo';
    } else {
      feedbackEl.textContent = App.i18n.t('sobraDinero');
      feedbackEl.className = 'feedback animo';
    }
  }

  function siguiente() {
    idx += 1;
    App.tts.stop();
    if (idx >= datos().porRonda) {
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

  /* Eventos */
  btnEscuchar.addEventListener('click', function () {
    App.tts.speak(precioTextoEl.textContent);
  });
  btnComprobar.addEventListener('click', comprobar);
  btnQuitar.addEventListener('click', quitarUltima);
  btnVaciar.addEventListener('click', vaciar);
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent + App.i18n.t('primeroElige'));
  });

  pintarNiveles();
  pintarEstrellas();
})();
