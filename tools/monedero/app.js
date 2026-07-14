/* ============================================================
   Apptonomia — El Monedero (razonamiento: manejo funcional del
   dinero). Datos en data.js. Módulos compartidos en assets/js/.
   Dos actividades desde un menú (patrón La Compra):
   - ¿Cuánto hay?: se muestran monedas/billetes y se elige el total
     entre 3 opciones (regla 11). Los casos se GENERAN al vuelo con
     las denominaciones del nivel: variedad infinita. Primer fallo →
     pista socrática; segundo → explicación con el desglose (regla 12).
   - Paga justo: tocar dinero hasta el precio exacto. Comprobar con
     andamiaje: 1º fallo solo dirección (falta/sobra), 2º la cantidad
     exacta que falta o sobra. Botón 💡 Ayuda en 2 pasos que enseña
     la estrategia de pagar de mayor a menor (greedy).
   Los importes se trabajan en céntimos (enteros) para evitar
   errores de coma flotante. El error nunca se castiga (regla 5).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'monedero';
  var $ = App.utils.$;

  var starsEl = $('#stars');

  /* Progreso persistente (migra el formato antiguo: 'completados'
     era de la única actividad de pagar). */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completadosPagar) progreso.completadosPagar = progreso.completados || {};
  if (!progreso.completadosContar) progreso.completadosContar = {};
  delete progreso.completados;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function datos() { return DATA[App.i18n.locale()] || DATA.es; }

  /* ---- Pantallas ---- */
  var PANTALLAS = ['pantallaMenu', 'pantallaNivelesContar', 'pantallaJuegoContar',
    'pantallaNivelesPagar', 'pantallaJuegoPagar', 'pantallaFinal'];
  function mostrar(id) {
    PANTALLAS.forEach(function (p) { $('#' + p).classList.add('oculto'); });
    $('#' + id).classList.remove('oculto');
  }

  /* ============================================================
     Dinero: formato, habla y fichas visuales (catálogo DINERO)
     ============================================================ */
  function infoDinero(cent) {
    return DINERO.filter(function (d) { return d.cent === cent; })[0];
  }

  /* "2 €" / "50 cts" — etiqueta corta impresa en la ficha. */
  function etiqueta(cent) {
    return cent >= 100 ? (cent / 100) + ' €' : cent + ' ' + App.i18n.t('ctsCorto');
  }

  /* "1,50 €" — importe con separador del idioma. */
  function formatear(cent) {
    var sep = App.i18n.locale() === 'en' ? '.' : ',';
    return (cent / 100).toFixed(2).replace('.', sep) + ' €';
  }

  /* "2 euros y 50 céntimos" — para hablar y para las pistas. */
  function hablado(cent) {
    var e = Math.floor(cent / 100);
    var c = cent % 100;
    var textoE = e === 1 ? '1 ' + App.i18n.t('palabraEuro') : e + ' ' + App.i18n.t('palabraEuros');
    var textoC = c + ' ' + App.i18n.t('palabraCentimos');
    if (e && c) return textoE + ' ' + App.i18n.t('palabraY') + ' ' + textoC;
    if (e) return textoE;
    return textoC;
  }

  /* "Moneda de 2 euros" / "Billete de 5 euros" (aria). */
  function ariaDinero(cent) {
    var clave = infoDinero(cent).tipo === 'billete' ? 'billeteDe' : 'monedaDe';
    return App.i18n.t(clave).replace('{v}', hablado(cent));
  }

  /* Crea la ficha visual (span decorativo o botón interactivo). */
  function crearFicha(cent, interactiva) {
    var info = infoDinero(cent);
    var el = document.createElement(interactiva ? 'button' : 'span');
    if (interactiva) el.type = 'button';
    el.className = 'dinero ' + info.tipo + ' ' + info.css;
    el.textContent = etiqueta(cent);
    return el;
  }

  /* ============================================================
     Actividad 1 — ¿Cuánto hay? (casos generados al vuelo)
     ============================================================ */
  var mesaEl = $('#mesaDinero');
  var opcionesEl = $('#opcionesContar');
  var feedbackContarEl = $('#feedbackContar');
  var explicacionContarWrap = $('#explicacionContarWrap');
  var explicacionContarEl = $('#explicacionContar');
  var btnSiguienteContar = $('#btnSiguienteContar');

  var nivelC = null;
  var casoC = null;
  var idxC = 0;
  var aciertosC = 0;
  var intentosC = 0;
  var resueltoC = false;

  function pintarNivelesContar() {
    var cont = $('#nivelesContar');
    cont.innerHTML = '';
    datos().contar.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completadosContar[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + App.i18n.t('vecesTexto').replace('{n}', veces) + ')</span>';
      btn.addEventListener('click', function () { iniciarRondaContar(n); });
      cont.appendChild(btn);
    });
  }

  /* Genera un caso: 2-4 piezas de las denominaciones del nivel y
     3 opciones (el total y 2 cercanas, todas distintas). */
  function generarCaso(nivel) {
    var n = 2 + Math.floor(Math.random() * 3);
    var piezas = [];
    var total = 0;
    for (var k = 0; k < n; k++) {
      var v = nivel.cents[Math.floor(Math.random() * nivel.cents.length)];
      piezas.push(v);
      total += v;
    }
    piezas.sort(function (a, b) { return b - a; });
    var distractores = [];
    App.utils.shuffle(nivel.cents).forEach(function (d) {
      [total + d, total - d].forEach(function (x) {
        if (x > 0 && x !== total && distractores.indexOf(x) === -1 && distractores.length < 2) {
          distractores.push(x);
        }
      });
    });
    while (distractores.length < 2) {
      distractores.push(total + (distractores.length + 1) * nivel.cents[0]);
    }
    return { piezas: piezas, total: total, opciones: App.utils.shuffle([total].concat(distractores)) };
  }

  /* "2 monedas de 1 euro y 1 billete de 5 euros" — desglose para la
     explicación (regla 11), generado del propio caso. */
  function desglose(piezas) {
    var grupos = [];
    piezas.forEach(function (cent) {
      var g = grupos.filter(function (x) { return x.cent === cent; })[0];
      if (g) g.n += 1;
      else grupos.push({ cent: cent, n: 1 });
    });
    var partes = grupos.map(function (g) {
      var billete = infoDinero(g.cent).tipo === 'billete';
      var clave = g.n === 1 ? (billete ? 'unBilleteDe' : 'unaMonedaDe')
        : (billete ? 'variosBilletesDe' : 'variasMonedasDe');
      return App.i18n.t(clave).replace('{n}', g.n).replace('{v}', hablado(g.cent));
    });
    if (partes.length === 1) return partes[0];
    return partes.slice(0, -1).join(', ') + ' ' + App.i18n.t('palabraY') + ' ' + partes[partes.length - 1];
  }

  function mostrarTextoContar(texto) {
    explicacionContarEl.textContent = texto;
    explicacionContarWrap.classList.remove('oculto');
    App.tts.speak(texto);
  }

  function pintarProgresoContar() {
    var total = datos().porRonda;
    $('#progressContarFill').style.width = (idxC / total * 100) + '%';
    $('#progressContarText').textContent = idxC + ' / ' + total;
  }

  function iniciarRondaContar(n) {
    nivelC = n;
    idxC = 0;
    aciertosC = 0;
    mostrar('pantallaJuegoContar');
    renderContar();
  }

  function renderContar() {
    casoC = generarCaso(nivelC);
    intentosC = 0;
    resueltoC = false;
    feedbackContarEl.textContent = '';
    feedbackContarEl.className = 'feedback';
    explicacionContarWrap.classList.add('oculto');
    explicacionContarEl.textContent = '';
    btnSiguienteContar.classList.add('oculto');

    mesaEl.innerHTML = '';
    casoC.piezas.forEach(function (cent) {
      var ficha = crearFicha(cent, false);
      ficha.setAttribute('role', 'img');
      ficha.setAttribute('aria-label', ariaDinero(cent));
      mesaEl.appendChild(ficha);
    });

    opcionesEl.innerHTML = '';
    casoC.opciones.forEach(function (cent) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = formatear(cent);
      btn.addEventListener('click', function () { responderContar(btn, cent); });
      opcionesEl.appendChild(btn);
    });

    pintarProgresoContar();
    pintarEstrellas();
  }

  function explicarContar(bien) {
    var clave = bien ? 'explicacionBien' : 'explicacionCasi';
    mostrarTextoContar(App.i18n.t(clave)
      .replace('{d}', desglose(casoC.piezas))
      .replace('{total}', formatear(casoC.total)));
  }

  function responderContar(btn, cent) {
    if (resueltoC) return;
    if (cent === casoC.total) {
      resueltoC = true;
      btn.classList.add('correcta');
      if (intentosC === 0) {
        progreso.estrellas += 1;
        aciertosC += 1;
        guardar();
        pintarEstrellas();
      }
      App.feedback.acierto(feedbackContarEl);
      explicarContar(true);
      btnSiguienteContar.classList.remove('oculto');
      btnSiguienteContar.focus();
      return;
    }
    intentosC += 1;
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.animo(feedbackContarEl);
    if (intentosC === 1) {
      /* Primer fallo: pista socrática, sin dar la respuesta (regla 12). */
      mostrarTextoContar(App.i18n.t('pistaContar'));
    } else {
      /* Segundo fallo: se explica con el desglose y se señala la
         opción correcta (regla 11: nadie se queda sin resolución). */
      resueltoC = true;
      App.utils.$$('#opcionesContar .btn-opcion').forEach(function (b) {
        if (b.textContent === formatear(casoC.total)) b.classList.add('correcta');
        b.disabled = true;
      });
      explicarContar(false);
      btnSiguienteContar.classList.remove('oculto');
      btnSiguienteContar.focus();
    }
  }

  function siguienteContar() {
    idxC += 1;
    App.tts.stop();
    if (idxC >= datos().porRonda) terminarRonda('contar');
    else renderContar();
  }

  /* ============================================================
     Actividad 2 — Paga justo
     ============================================================ */
  var productoEl = $('#producto');
  var precioTextoEl = $('#precioTexto');
  var totalPuestoEl = $('#totalPuesto');
  var monedasEl = $('#monedas');
  var feedbackPagarEl = $('#feedbackPagar');
  var ayudaPagarWrap = $('#ayudaPagarWrap');
  var ayudaPagarTextoEl = $('#ayudaPagarTexto');
  var btnComprobar = $('#btnComprobar');
  var btnQuitar = $('#btnQuitar');
  var btnSiguientePagar = $('#btnSiguientePagar');

  var nivelP = null;
  var productosRonda = [];
  var idxP = 0;
  var aciertosP = 0;
  var puestas = [];      /* céntimos de cada pieza puesta, en orden */
  var fallosP = 0;       /* comprobaciones falladas de este producto */
  var resueltoP = false;
  var ayudaPasoP = 0;
  var botonesDinero = {};  /* cent -> botón, para marcar la ayuda */

  function pintarNivelesPagar() {
    var cont = $('#nivelesPagar');
    cont.innerHTML = '';
    datos().pagar.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completadosPagar[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + App.i18n.t('vecesTexto').replace('{n}', veces) + ')</span>';
      btn.addEventListener('click', function () { iniciarRondaPagar(n); });
      cont.appendChild(btn);
    });
  }

  function iniciarRondaPagar(n) {
    nivelP = n;
    productosRonda = App.utils.shuffle(n.productos).slice(0, datos().porRonda);
    idxP = 0;
    aciertosP = 0;
    pintarDineroPagar();
    mostrar('pantallaJuegoPagar');
    renderPagar();
  }

  /* Botones de dinero del nivel, de mayor a menor (enseña a pagar
     empezando por lo grande). */
  function pintarDineroPagar() {
    monedasEl.innerHTML = '';
    botonesDinero = {};
    nivelP.cents.slice().sort(function (a, b) { return b - a; }).forEach(function (cent) {
      var btn = crearFicha(cent, true);
      btn.setAttribute('aria-label', App.i18n.t('anadirDinero').replace('{d}', ariaDinero(cent)));
      btn.addEventListener('click', function () { anadirDinero(cent); });
      monedasEl.appendChild(btn);
      botonesDinero[cent] = btn;
    });
  }

  function totalPuestas() {
    return puestas.reduce(function (suma, c) { return suma + c; }, 0);
  }

  function pintarTotal() {
    totalPuestoEl.textContent = App.i18n.t('hasPuesto').replace('{total}', formatear(totalPuestas()));
  }

  function pintarProgresoPagar() {
    var total = datos().porRonda;
    $('#progressPagarFill').style.width = (idxP / total * 100) + '%';
    $('#progressPagarText').textContent = idxP + ' / ' + total;
  }

  function renderPagar() {
    var item = productosRonda[idxP];
    resueltoP = false;
    fallosP = 0;
    puestas = [];
    feedbackPagarEl.textContent = '';
    feedbackPagarEl.className = 'feedback';
    btnSiguientePagar.classList.add('oculto');
    btnComprobar.disabled = false;
    productoEl.textContent = item.picto;
    precioTextoEl.textContent = App.i18n.t('cuesta')
      .replace('{nombre}', item.nombre)
      .replace('{precio}', formatear(item.precioCent));
    limpiarAyudaPagar();
    pintarTotal();
    pintarProgresoPagar();
    pintarEstrellas();
  }

  function anadirDinero(cent) {
    if (resueltoP) return;
    puestas.push(cent);
    limpiarAyudaPagar();
    pintarTotal();
  }

  function quitarUltima() {
    if (resueltoP) return;
    puestas.pop();
    limpiarAyudaPagar();
    pintarTotal();
  }

  function vaciar() {
    if (resueltoP) return;
    puestas = [];
    limpiarAyudaPagar();
    pintarTotal();
  }

  /* Comprobar con andamiaje (regla 12 adaptada): el primer fallo
     solo da la dirección; a partir del segundo, la cantidad exacta
     que falta o sobra — nadie se queda atascado. */
  function comprobar() {
    if (resueltoP) return;
    var objetivo = productosRonda[idxP].precioCent;
    var puesto = totalPuestas();

    if (puesto === objetivo) {
      resueltoP = true;
      if (fallosP === 0) {
        aciertosP += 1;
        progreso.estrellas += 1;
        guardar();
        pintarEstrellas();
      }
      App.feedback.acierto(feedbackPagarEl);
      btnComprobar.disabled = true;
      btnSiguientePagar.classList.remove('oculto');
      btnSiguientePagar.focus();
      return;
    }

    fallosP += 1;
    var falta = puesto < objetivo;
    var texto;
    if (fallosP === 1) {
      texto = App.i18n.t(falta ? 'faltaDinero1' : 'sobraDinero1');
    } else {
      var dif = Math.abs(objetivo - puesto);
      texto = App.i18n.t(falta ? 'faltaDinero2' : 'sobraDinero2')
        .replace('{dif}', hablado(dif));
    }
    feedbackPagarEl.textContent = texto;
    feedbackPagarEl.className = 'feedback animo';
    App.tts.speak(texto);
  }

  /* ---- 💡 Ayuda a demanda (método socrático en dos pasos) ----
     Enseña la estrategia de pagar de mayor a menor: 1ª pulsación
     pregunta por el dinero más grande que cabe; la 2ª lo marca. */
  function limpiarAyudaPagar() {
    ayudaPasoP = 0;
    ayudaPagarWrap.classList.add('oculto');
    ayudaPagarTextoEl.textContent = '';
    Object.keys(botonesDinero).forEach(function (c) {
      botonesDinero[c].classList.remove('sugerida');
    });
    btnQuitar.classList.remove('sugerida');
    btnComprobar.classList.remove('sugerida');
  }

  function pedirAyudaPagar() {
    if (resueltoP) return;
    var objetivo = productosRonda[idxP].precioCent;
    var restante = objetivo - totalPuestas();
    ayudaPasoP = ayudaPasoP >= 2 ? 2 : ayudaPasoP + 1;
    var texto;

    if (restante === 0) {
      texto = App.i18n.t('ayudaComprobar');
      btnComprobar.classList.add('sugerida');
    } else if (restante < 0) {
      texto = App.i18n.t('ayudaQuita' + ayudaPasoP);
      if (ayudaPasoP === 2) btnQuitar.classList.add('sugerida');
    } else {
      texto = App.i18n.t('ayudaPagar' + ayudaPasoP);
      if (ayudaPasoP === 2) {
        /* El dinero más grande del nivel que cabe en lo que queda. */
        var mejor = nivelP.cents.filter(function (c) { return c <= restante; })
          .sort(function (a, b) { return b - a; })[0];
        if (mejor) botonesDinero[mejor].classList.add('sugerida');
      }
    }
    ayudaPagarTextoEl.textContent = texto;
    ayudaPagarWrap.classList.remove('oculto');
    App.tts.speak(texto);
  }

  function siguientePagar() {
    idxP += 1;
    App.tts.stop();
    if (idxP >= datos().porRonda) terminarRonda('pagar');
    else renderPagar();
  }

  /* ============================================================
     Final de ronda (compartido)
     ============================================================ */
  var actividadActual = 'contar';

  function terminarRonda(actividad) {
    actividadActual = actividad;
    var total = datos().porRonda;
    if (actividad === 'contar') {
      progreso.completadosContar[nivelC.id] = (progreso.completadosContar[nivelC.id] || 0) + 1;
      $('#resumenFinal').textContent = App.i18n.t('resumenContar')
        .replace('{n}', aciertosC).replace('{t}', total);
    } else {
      progreso.completadosPagar[nivelP.id] = (progreso.completadosPagar[nivelP.id] || 0) + 1;
      $('#resumenFinal').textContent = App.i18n.t('resumenPagar')
        .replace('{n}', aciertosP).replace('{t}', total);
    }
    guardar();
    mostrar('pantallaFinal');
    App.feedback.celebrar(App.i18n.t('core.rondaCompletada'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaContar').addEventListener('click', function () {
    pintarNivelesContar();
    mostrar('pantallaNivelesContar');
  });
  $('#tarjetaPagar').addEventListener('click', function () {
    pintarNivelesPagar();
    mostrar('pantallaNivelesPagar');
  });
  $('#btnVolverMenuContar').addEventListener('click', function () { App.tts.stop(); mostrar('pantallaMenu'); });
  $('#btnVolverMenuPagar').addEventListener('click', function () { App.tts.stop(); mostrar('pantallaMenu'); });
  $('#btnVolverMenuFinal').addEventListener('click', function () { App.tts.stop(); mostrar('pantallaMenu'); });

  btnSiguienteContar.addEventListener('click', siguienteContar);
  $('#btnPreguntaContar').addEventListener('click', function () {
    App.tts.speak(App.i18n.t('contarPregunta'));
  });
  $('#btnEscucharExplicacionContar').addEventListener('click', function () {
    App.tts.speak(explicacionContarEl.textContent);
  });

  $('#btnEscuchar').addEventListener('click', function () {
    App.tts.speak(precioTextoEl.textContent);
  });
  btnComprobar.addEventListener('click', comprobar);
  btnQuitar.addEventListener('click', quitarUltima);
  $('#btnVaciar').addEventListener('click', vaciar);
  btnSiguientePagar.addEventListener('click', siguientePagar);
  $('#btnAyudaPagar').addEventListener('click', pedirAyudaPagar);
  $('#btnEscucharAyudaPagar').addEventListener('click', function () {
    App.tts.speak(ayudaPagarTextoEl.textContent);
  });

  $('#btnRepetir').addEventListener('click', function () {
    if (actividadActual === 'contar') iniciarRondaContar(nivelC);
    else iniciarRondaPagar(nivelP);
  });
  $('#btnOtroNivelFinal').addEventListener('click', function () {
    if (actividadActual === 'contar') {
      pintarNivelesContar();
      mostrar('pantallaNivelesContar');
    } else {
      pintarNivelesPagar();
      mostrar('pantallaNivelesPagar');
    }
  });
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent);
  });
  $('#btnInstruccionPagar').addEventListener('click', function () {
    App.tts.speak(App.i18n.t('pagarInstruccion'));
  });

  pintarEstrellas();
})();
