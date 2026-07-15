/* ==========================================================================
   Teclado — Lógica
   Aprende a escribir con el teclado físico del ordenador.
   El teclado que se ve en pantalla es SOLO visual (no se puede tocar):
   enseña la tecla objetivo, refleja cada pulsación y colorea las teclas
   por mano o por dedo (método de mecanografía con fila guía F/J).
   Requiere assets/js (App.utils, App.tts, App.storage, App.feedback) y data.js.
   ========================================================================== */
(function () {
  'use strict';

  var $ = App.utils.$;
  var $$ = App.utils.$$;
  var SLUG = 'keyboard-typing';
  var PANTALLAS = ['pantallaNombre', 'pantallaMenu', 'pantallaLecciones', 'pantallaJuego', 'pantallaLibre'];

  /* ---------- Estado y progreso ---------- */
  var state = App.storage.get(SLUG);
  state.nombre = typeof state.nombre === 'string' ? state.nombre : '';
  state.estrellas = state.estrellas || 0;
  state.completado = state.completado || {};
  state.opciones = state.opciones || {};
  if (typeof state.opciones.teclado !== 'string' || !DATA.layouts[state.opciones.teclado]) {
    state.opciones.teclado = App.utils.esTactil() ? 'movil' : (state.opciones.numeros ? 'normal' : 'simplificado');
  }
  delete state.opciones.numeros;
  if (state.opciones.color !== 'dedos') state.opciones.color = 'manos';

  function guardar() { App.storage.set(SLUG, state); }

  /* Partida en curso. null fuera de pantallaJuego.
     type 'seq': { cfg: { modo, titulo, pasos, claveEstrella, alTerminar }, idx, pos, esperando }
     type 'reto': { set: { ch: true } } */
  var game = null;

  function bonito(nombre) {
    return nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1) : '';
  }

  function mensajeFinal() {
    return state.nombre
      ? App.i18n.t('muyBienNombre').replace('{nombre}', bonito(state.nombre))
      : App.i18n.t('muyBien');
  }

  function actualizarEstrellas() {
    $('#stars').textContent = '⭐ ' + state.estrellas;
  }

  function premiar(clave) {
    if (!state.completado[clave]) {
      state.completado[clave] = true;
      state.estrellas += 1;
      guardar();
      actualizarEstrellas();
    }
  }

  /* ---------- Datos de teclas ---------- */
  function filasVisibles() {
    return DATA.layouts[state.opciones.teclado] || DATA.layouts.simplificado;
  }

  function esExtendido() {
    return state.opciones.teclado === 'extendido';
  }

  /* El único tipo de teclado que se puede tocar de verdad: en un móvil no
     hay teclado físico que pulsar, la pantalla es la entrada real. Los
     demás tipos son decorativos (pointer-events: none en CSS). */
  function esMovil() {
    return state.opciones.teclado === 'movil';
  }

  function clavesTipeables(filas) {
    var out = {};
    filas.forEach(function (f) {
      f.forEach(function (k) { if (k.ch) out[k.ch] = true; });
    });
    return out;
  }

  function dedoDe(ch, enNumpad) {
    if (!ch) return null;
    if (ch === ' ') return 'th';
    if (enNumpad) return DATA.numpadFingers[ch] || null;
    var filas = esMovil()
      ? DATA.layouts.movil
      : [DATA.numberRow].concat(DATA.rows);
    for (var i = 0; i < filas.length; i++) {
      for (var j = 0; j < filas[i].length; j++) {
        if (filas[i][j].ch === ch) return filas[i][j].finger;
      }
    }
    return null;
  }

  /* ---------- Teclado visual (nunca clicable: pointer-events none) ---------- */
  function crearTecla(k) {
    var d = document.createElement('div');
    var mano = k.finger === 'th' ? 'ambas' : (k.finger.charAt(0) === 'l' ? 'izq' : 'der');
    var ancho = k.wide === true ? ' ancha' : (k.wide === 'media' ? ' media' : '');
    d.className = 'tecla f-' + k.finger + ' m-' + mano + ancho + (k.decor ? ' decorativa' : '');
    if (k.ch) d.dataset.ch = k.ch;
    d.textContent = k.label ? App.i18n.t('teclaLabel.' + k.label) : k.ch;
    if (k.bump) {
      var m = document.createElement('span');
      m.className = 'marca';
      d.appendChild(m);
    }
    return d;
  }

  function pintarFilas(cont, filas) {
    cont.innerHTML = '';
    filas.forEach(function (fila) {
      var f = document.createElement('div');
      f.className = 'fila-teclas';
      fila.forEach(function (k) { f.appendChild(crearTecla(k)); });
      cont.appendChild(f);
    });
  }

  function renderTeclados() {
    $$('.teclado').forEach(function (c) {
      pintarFilas(c, filasVisibles());
      c.classList.toggle('tocable', esMovil());
    });
    $$('.numpad-inline').forEach(function (c) {
      c.classList.toggle('oculto', !esExtendido());
      pintarFilas(c, DATA.numpad);
    });
    $$('.teclado, .numpad, .numpad-inline').forEach(function (c) {
      c.classList.toggle('color-dedos', state.opciones.color === 'dedos');
      c.classList.toggle('color-manos', state.opciones.color === 'manos');
    });
    actualizarOpcionesUI();
    /* Recalcular la guía completa (no solo marcarObjetivo): cambiar de
       tipo de teclado a mitad de partida puede cambiar qué dedo/pulgar
       corresponde a la misma tecla (p. ej. física de 8 dedos → móvil). */
    if (game && game.type === 'seq') actualizarGuia();
    if (game && game.type === 'reto') reaplicarReto();
  }

  function actualizarOpcionesUI() {
    $$('.btn-teclado').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.teclado === state.opciones.teclado));
    });
    $$('.btn-color').forEach(function (b) {
      b.setAttribute('aria-pressed', String(state.opciones.color === 'dedos'));
      b.textContent = App.i18n.t(state.opciones.color === 'dedos' ? 'btnColoresDedos' : 'btnColoresManos');
    });
    $$('.leyenda-teclado').forEach(function (l) {
      l.textContent = esMovil()
        ? App.i18n.t('leyendaMovil')
        : App.i18n.t(state.opciones.color === 'dedos' ? 'leyendaDedos' : 'leyendaManos');
    });
  }

  function teclasDe(ch) {
    if (!ch || ch === '"') return [];
    return $$('.tecla[data-ch="' + ch + '"]');
  }

  function flashTecla(ch, abajo) {
    teclasDe(ch).forEach(function (t) { t.classList.toggle('pulsada', abajo); });
    if (abajo) {
      setTimeout(function () {
        teclasDe(ch).forEach(function (t) { t.classList.remove('pulsada'); });
      }, 600);
    }
  }

  function marcarObjetivo(ch) {
    $$('.tecla.objetivo').forEach(function (t) { t.classList.remove('objetivo'); });
    teclasDe(ch).forEach(function (t) { t.classList.add('objetivo'); });
  }

  /* ---------- Guía de manos ---------- */
  function manosSVG(activo) {
    function dedo(f, x, y, h) {
      var act = (activo === f) ? ' activo' : '';
      return '<rect class="dedo' + act + '" x="' + x + '" y="' + y + '" width="32" height="' + h + '" rx="15"/>';
    }
    /* 'th' (espacio) enciende los dos pulgares; 'lt'/'rt' (teclado de
       móvil) encienden solo el pulgar de ese lado. */
    function pulgar(x, id) {
      var act = (activo === 'th' || activo === id) ? ' activo' : '';
      return '<rect class="dedo' + act + '" x="' + x + '" y="112" width="42" height="28" rx="14"/>';
    }
    return '<svg viewBox="0 0 405 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      dedo('lp', 0, 48, 60) + dedo('lr', 38, 26, 82) + dedo('lm', 76, 16, 92) + dedo('li', 114, 26, 82) +
      '<rect class="palma" x="0" y="96" width="146" height="70" rx="22"/>' + pulgar(147, 'lt') +
      pulgar(216, 'rt') + dedo('ri', 259, 26, 82) + dedo('rm', 297, 16, 92) + dedo('rr', 335, 26, 82) + dedo('rp', 373, 48, 60) +
      '<rect class="palma" x="259" y="96" width="146" height="70" rx="22"/>' +
      '<text x="73" y="192">' + App.i18n.t('izquierdaEtiqueta') + '</text>' +
      '<text x="332" y="192">' + App.i18n.t('derechaEtiqueta') + '</text>' +
      '</svg>';
  }

  function pintarManos(dedo) {
    $('#manosSvg').innerHTML = manosSVG(dedo);
    var texto;
    if (dedo === 'th') texto = App.i18n.t('pulgarTexto');
    else if (dedo) texto = App.i18n.t('manoDedoTexto')
      .replace('{mano}', App.i18n.t('dedo.' + dedo + '.mano'))
      .replace('{dedo}', App.i18n.t('dedo.' + dedo + '.nombre'));
    else texto = App.i18n.t('buscaTecla');
    $('#guiaTexto').textContent = texto;
  }

  /* ---------- Pantallas ---------- */
  function mostrarPantalla(id) {
    PANTALLAS.forEach(function (p) {
      document.getElementById(p).classList.toggle('oculto', p !== id);
    });
  }

  function irMenu() {
    pintarMenu();
    mostrarPantalla('pantallaMenu');
  }

  function irLecciones() {
    pintarLecciones();
    mostrarPantalla('pantallaLecciones');
  }

  function irNombre() {
    $('#inputNombre').value = state.nombre;
    $('#avisoNombre').textContent = '';
    mostrarPantalla('pantallaNombre');
    $('#inputNombre').focus();
  }

  function irLibre() {
    mostrarPantalla('pantallaLibre');
    $('#areaLibre').focus();
  }

  function lecciones() { return DATA.lessons[App.i18n.locale()] || DATA.lessons.es; }

  function pintarMenu() {
    $('#saludo').textContent = state.nombre
      ? App.i18n.t('saludoConNombre').replace('{nombre}', bonito(state.nombre))
      : App.i18n.t('saludoHola');
    var todasLecciones = lecciones();
    var hechas = todasLecciones.filter(function (l) { return state.completado[l.id]; }).length;
    $$('.tarjeta-modo').forEach(function (t) {
      var badge = t.querySelector('.hecho');
      var m = t.dataset.modo;
      /* "Coloca los dedos" enseña a encontrar F y J por su marca táctil:
         una pantalla lisa no tiene esa marca, no aplica en modo móvil. */
      if (m === 'posicion') { t.classList.toggle('oculto', esMovil()); return; }
      if (m === 'lecciones') badge.textContent = hechas > 0 ? App.i18n.t('deTexto').replace('{hechas}', hechas).replace('{total}', todasLecciones.length) : '';
      else badge.textContent = state.completado[m] ? '⭐' : '';
    });
    actualizarEstrellas();
  }

  function pintarLecciones() {
    var cont = $('#listaLecciones');
    cont.innerHTML = '';
    var todasLecciones = lecciones();
    todasLecciones.forEach(function (l, i) {
      var abierta = i === 0 || !!state.completado[todasLecciones[i - 1].id];
      var hecha = !!state.completado[l.id];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn-leccion' + (hecha ? ' hecha' : '') + (!abierta ? ' cerrada' : '');
      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = String(i + 1);
      var tit = document.createElement('span');
      tit.className = 'tit';
      tit.textContent = l.title;
      var est = document.createElement('span');
      est.setAttribute('aria-hidden', 'true');
      est.textContent = hecha ? '⭐' : (abierta ? '' : '🔒');
      b.appendChild(num); b.appendChild(tit); b.appendChild(est);
      if (abierta) {
        b.addEventListener('click', function () { jugarLeccion(l); });
      } else {
        b.disabled = true;
        b.setAttribute('aria-label', App.i18n.t('leccionCerradaAria').replace('{n}', i + 1));
      }
      cont.appendChild(b);
    });
  }

  /* ---------- Motor de secuencias ---------- */
  function iniciarSecuencia(cfg) {
    game = { type: 'seq', cfg: cfg, idx: 0, pos: 0, esperando: false };
    $('#tituloJuego').textContent = cfg.titulo;
    var enNumpad = cfg.modo === 'numeros';
    $('#panelTeclado').classList.toggle('oculto', enNumpad);
    $('#panelNumpad').classList.toggle('oculto', !enNumpad);
    $('#zonaObjetivo').classList.remove('oculto');
    $('#zonaReto').classList.add('oculto');
    $('#guia').classList.remove('oculto');
    limpiarFeedback();
    mostrarPantalla('pantallaJuego');
    cargarPaso();
  }

  function pasoActual() { return game.cfg.pasos[game.idx]; }

  function charEsperado() {
    var p = pasoActual();
    return p ? p.seq[game.pos] : null;
  }

  function cargarPaso() {
    game.pos = 0;
    $('#instruccionJuego').textContent = pasoActual().text || '';
    renderObjetivo();
    actualizarGuia();
  }

  function renderObjetivo() {
    var seq = pasoActual().seq;
    var zona = $('#zonaObjetivo');
    zona.innerHTML = '';
    zona.setAttribute('aria-label', App.i18n.t('escribeAria').replace('{seq}', seq));
    for (var i = 0; i < seq.length; i++) {
      var s = document.createElement('span');
      s.className = 'letra' + (i < game.pos ? ' hecha' : (i === game.pos ? ' actual' : ''));
      s.textContent = seq[i] === ' ' ? '␣' : seq[i];
      zona.appendChild(s);
    }
  }

  function actualizarGuia() {
    var ch = charEsperado();
    marcarObjetivo(ch);
    pintarManos(dedoDe(ch, game.cfg.modo === 'numeros'));
  }

  function limpiarFeedback() {
    var f = $('#feedback');
    f.textContent = '';
    f.className = 'feedback';
  }

  function teclaJuego(ch) {
    if (game.esperando) return;
    var seq = pasoActual().seq;
    if (ch === seq[game.pos]) {
      game.pos += 1;
      renderObjetivo();
      if (game.pos >= seq.length) pasoCompletado();
      else actualizarGuia();
    } else {
      teclasDe(ch).forEach(function (t) {
        t.classList.add('fallo');
        setTimeout(function () { t.classList.remove('fallo'); }, 500);
      });
      App.feedback.encourage($('#feedback'));
    }
  }

  function pasoCompletado() {
    game.esperando = true;
    marcarObjetivo(null);
    App.feedback.success($('#feedback'));
    setTimeout(function () {
      if (!game) return;
      game.esperando = false;
      game.idx += 1;
      if (game.idx >= game.cfg.pasos.length) {
        terminarSecuencia();
      } else {
        limpiarFeedback();
        cargarPaso();
      }
    }, 1000);
  }

  function terminarSecuencia() {
    var cfg = game.cfg;
    game = null;
    premiar(cfg.claveEstrella);
    App.feedback.celebrar(mensajeFinal(), cfg.alTerminar);
  }

  /* ---------- Modos de juego ---------- */
  function jugarPosicion() {
    iniciarSecuencia({
      modo: 'posicion', titulo: App.i18n.t('modoPosicionNombre'),
      pasos: DATA.placement[App.i18n.locale()] || DATA.placement.es,
      claveEstrella: 'posicion', alTerminar: irMenu
    });
  }

  function jugarLeccion(l) {
    var pasos = l.steps.map(function (s) { return { text: l.intro, seq: s }; });
    iniciarSecuencia({
      modo: 'leccion', titulo: App.i18n.t('leccionTitulo').replace('{titulo}', l.title),
      pasos: pasos, claveEstrella: l.id, alTerminar: irLecciones
    });
  }

  function jugarPalabras() {
    var pasos = [];
    if (state.nombre) {
      /* sin tildes: el ejercicio usa las teclas básicas */
      var plano = state.nombre.toLowerCase();
      if (plano.normalize) plano = plano.normalize('NFD').replace(/[̀-ͯ]/g, '');
      pasos.push({ text: App.i18n.t('escribeTuNombre'), seq: plano });
    }
    var banco = DATA.words[App.i18n.locale()] || DATA.words.es;
    App.utils.shuffle(banco).slice(0, 4).forEach(function (w) {
      pasos.push({ text: App.i18n.t('escribeLaPalabra'), seq: w });
    });
    iniciarSecuencia({
      modo: 'palabras', titulo: App.i18n.t('modoPalabrasNombre'),
      pasos: pasos, claveEstrella: 'palabras', alTerminar: irMenu
    });
  }

  function jugarNumeros() {
    iniciarSecuencia({
      modo: 'numeros', titulo: App.i18n.t('modoNumerosNombre'),
      pasos: DATA.numpadSteps[App.i18n.locale()] || DATA.numpadSteps.es,
      claveEstrella: 'numeros', alTerminar: irMenu
    });
  }

  /* ---------- Reto: todas las teclas ---------- */
  function jugarReto() {
    game = { type: 'reto', set: {} };
    $('#tituloJuego').textContent = App.i18n.t('tituloTodasLasTeclas');
    $('#instruccionJuego').textContent = App.i18n.t('instruccionTodasLasTeclas');
    $('#panelTeclado').classList.remove('oculto');
    $('#panelNumpad').classList.add('oculto');
    $('#zonaObjetivo').classList.add('oculto');
    $('#zonaReto').classList.remove('oculto');
    $('#guia').classList.add('oculto');
    limpiarFeedback();
    marcarObjetivo(null);
    $$('.tecla.hecha').forEach(function (t) { t.classList.remove('hecha'); });
    mostrarPantalla('pantallaJuego');
    actualizarReto();
  }

  function teclaReto(ch) {
    var visibles = clavesTipeables(filasVisibles());
    if (!visibles[ch] || game.set[ch]) return;
    game.set[ch] = true;
    teclasDe(ch).forEach(function (t) { t.classList.add('hecha'); });
    actualizarReto();
  }

  function reaplicarReto() {
    Object.keys(game.set).forEach(function (ch) {
      teclasDe(ch).forEach(function (t) { t.classList.add('hecha'); });
    });
    actualizarReto();
  }

  function actualizarReto() {
    var total = 0, hechas = 0;
    filasVisibles().forEach(function (f) {
      f.forEach(function (k) {
        if (!k.ch) return;
        total += 1;
        if (game.set[k.ch]) hechas += 1;
      });
    });
    $('#retoFill').style.width = (total ? Math.round(hechas / total * 100) : 0) + '%';
    $('#retoTexto').textContent = App.i18n.t('deTexto').replace('{hechas}', hechas).replace('{total}', total);
    if (total > 0 && hechas === total) {
      game = null;
      premiar('todas');
      App.feedback.celebrar(mensajeFinal(), irMenu);
    }
  }

  /* ---------- Teclado físico ---------- */
  function normalizarTecla(k) {
    if (k === 'Spacebar') k = ' ';
    if (typeof k !== 'string' || k.length !== 1) return null;
    return k.toLowerCase();
  }

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var ch = normalizarTecla(e.key);
    if (!ch) return;
    flashTecla(ch, true);
    var foco = document.activeElement;
    if (foco && (foco.tagName === 'INPUT' || foco.tagName === 'TEXTAREA')) return;
    if (!game) return;
    e.preventDefault();
    if (e.repeat) return;
    if (game.type === 'reto') teclaReto(ch);
    else teclaJuego(ch);
  });

  document.addEventListener('keyup', function (e) {
    var ch = normalizarTecla(e.key);
    if (ch) flashTecla(ch, false);
  });

  /* ---------- Teclado de móvil: único tipo que se puede tocar ---------- */
  document.addEventListener('click', function (e) {
    if (!esMovil()) return;
    var tecla = e.target.closest('.teclado.tocable .tecla[data-ch]');
    if (!tecla) return;
    var ch = tecla.dataset.ch;
    flashTecla(ch, true);
    setTimeout(function () { flashTecla(ch, false); }, 150);
    if (!game) return;
    if (game.type === 'reto') teclaReto(ch);
    else teclaJuego(ch);
  });

  /* ---------- Opciones del teclado (delegación: hay varios paneles) ---------- */
  document.addEventListener('click', function (e) {
    var bt = e.target.closest('.btn-teclado');
    if (bt) {
      state.opciones.teclado = bt.dataset.teclado;
      guardar();
      renderTeclados();
      return;
    }
    var bc = e.target.closest('.btn-color');
    if (bc) {
      state.opciones.color = state.opciones.color === 'manos' ? 'dedos' : 'manos';
      guardar();
      renderTeclados();
    }
  });

  /* ---------- Nombre ---------- */
  function guardarNombre() {
    var v = $('#inputNombre').value.trim().slice(0, 20);
    state.nombre = v;
    guardar();
    /* El audio solo se reproduce si el usuario pulsa el botón "Escuchar" (btnLeerNombre) */
    irMenu();
  }

  $('#btnGuardarNombre').addEventListener('click', guardarNombre);
  $('#btnSinNombre').addEventListener('click', function () {
    state.nombre = '';
    guardar();
    irMenu();
  });
  $('#inputNombre').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      guardarNombre();
    }
  });
  $('#btnLeerNombre').addEventListener('click', function () {
    App.tts.speak($('#textoNombre').textContent + App.i18n.t('escucharNombreExtra'));
  });

  var confirmandoBorrado = false;
  $('#btnBorrarTodo').addEventListener('click', function () {
    var btn = this;
    if (!confirmandoBorrado) {
      confirmandoBorrado = true;
      btn.textContent = App.i18n.t('confirmarBorrado');
      setTimeout(function () {
        confirmandoBorrado = false;
        btn.textContent = App.i18n.t('btnBorrarProgreso');
      }, 4000);
      return;
    }
    confirmandoBorrado = false;
    App.storage.remove(SLUG);
    state = { nombre: '', estrellas: 0, completado: {}, opciones: { teclado: App.utils.esTactil() ? 'movil' : 'simplificado', color: 'manos' } };
    guardar();
    btn.textContent = App.i18n.t('btnBorrarProgreso');
    $('#inputNombre').value = '';
    $('#avisoNombre').textContent = App.i18n.t('avisoBorrado');
    renderTeclados();
    actualizarEstrellas();
  });

  /* ---------- Menú y navegación ---------- */
  $('#menuJuegos').addEventListener('click', function (e) {
    var t = e.target.closest('.tarjeta-modo');
    if (!t) return;
    var m = t.dataset.modo;
    if (m === 'posicion') jugarPosicion();
    else if (m === 'lecciones') irLecciones();
    else if (m === 'palabras') jugarPalabras();
    else if (m === 'todas') jugarReto();
    else if (m === 'numeros') jugarNumeros();
    else if (m === 'libre') irLibre();
  });

  $('#btnLeerSaludo').addEventListener('click', function () {
    App.tts.speak($('#saludo').textContent + ' ' + App.i18n.t('eligeJuego'));
  });

  $('#btnCambiarNombre').addEventListener('click', irNombre);
  $('#btnVolverMenu').addEventListener('click', irMenu);

  $('#btnSalirJuego').addEventListener('click', function () {
    var modo = game && game.cfg ? game.cfg.modo : null;
    game = null;
    App.tts.stop();
    marcarObjetivo(null);
    if (modo === 'leccion') irLecciones();
    else irMenu();
  });

  $('#btnLeerJuego').addEventListener('click', function () {
    var texto = $('#tituloJuego').textContent + '. ' + $('#instruccionJuego').textContent;
    if (game && game.type === 'seq') texto += ' ' + $('#guiaTexto').textContent;
    App.tts.speak(texto);
  });

  /* ---------- Escritura libre ---------- */
  $('#btnSalirLibre').addEventListener('click', irMenu);
  $('#btnLeerLibre').addEventListener('click', function () {
    var t = $('#areaLibre').value.trim();
    App.tts.speak(t || App.i18n.t('noHasEscrito'));
  });
  $('#btnBorrarLibre').addEventListener('click', function () {
    $('#areaLibre').value = '';
    $('#areaLibre').focus();
  });

  /* ---------- Arranque ---------- */
  $('#areaLibre').setAttribute('placeholder', App.i18n.t('areaLibrePlaceholder'));
  pintarFilas($('#numpad'), DATA.numpad);
  renderTeclados();
  actualizarEstrellas();
  if (state.nombre) irMenu();
  else irNombre();
})();
