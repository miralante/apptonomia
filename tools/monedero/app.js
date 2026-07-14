/* ============================================================
   Apptonomia — El Monedero (razonamiento: manejo funcional del
   dinero). Datos en data.js. Módulos compartidos en assets/js/.
   Cinco actividades desde un menú (patrón La Compra):
   - ¿Cuánto hay? · ¿Con qué pago? · ¿Está bien el cambio? ·
     La Hucha: quiz de dinero físico con casos GENERADOS al vuelo.
     Corren sobre un runner genérico (montarQuiz más abajo):
     ▶ AÑADIR UNA ACTIVIDAD DE DINERO NUEVA = un objeto de
       configuración en ACTIVIDADES (generar, enunciado, mesa,
       opciones, pista, explicación) + su tarjeta en index.html
       + sus textos en strings.js.
     Todas cumplen las reglas 11 y 12: explicación generada del
     propio caso al resolver, pista socrática al primer fallo.
   - Paga justo: interactiva (tocar dinero hasta el precio exacto),
     con Comprobar en dos pasos y botón 💡 de estrategia greedy.
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
  ['completadosContar', 'completadosConQuePago', 'completadosCambio', 'completadosHucha']
    .forEach(function (clave) { if (!progreso[clave]) progreso[clave] = {}; });
  delete progreso.completados;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function datos() { return DATA[App.i18n.locale()] || DATA.es; }
  function azar(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

  /* ---- Pantallas ---- */
  var PANTALLAS = ['pantallaMenu', 'pantallaNiveles', 'pantallaJuegoQuiz',
    'pantallaJuegoPagar', 'pantallaFinal'];
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

  /* Descompone un importe en fichas, de mayor a menor (greedy). */
  function descomponer(cent) {
    var piezas = [];
    var restante = cent;
    DINERO.slice().sort(function (a, b) { return b.cent - a.cent; }).forEach(function (d) {
      while (restante >= d.cent) {
        piezas.push(d.cent);
        restante -= d.cent;
      }
    });
    return piezas;
  }

  /* "2 monedas de 1 euro y 1 billete de 5 euros" — desglose para
     las explicaciones (regla 11), generado del propio caso. */
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

  /* Pinta fichas decorativas en la mesa. */
  function pintarMesa(piezas) {
    var mesaEl = $('#mesaDinero');
    mesaEl.innerHTML = '';
    if (!piezas || !piezas.length) {
      mesaEl.classList.add('oculto');
      return;
    }
    piezas.forEach(function (cent) {
      var ficha = crearFicha(cent, false);
      ficha.setAttribute('role', 'img');
      ficha.setAttribute('aria-label', ariaDinero(cent));
      mesaEl.appendChild(ficha);
    });
    mesaEl.classList.remove('oculto');
  }

  /* ============================================================
     Generadores de casos (variedad infinita, cero autoría)
     ============================================================ */

  /* Todos los productos del banco, en el idioma activo. */
  function todosLosProductos() {
    return datos().pagar.niveles.reduce(function (lista, n) {
      return lista.concat(n.productos);
    }, []);
  }

  /* ¿Está el importe en el "bucket" del paso? (los importes de un
     nivel no caen en el nivel anterior, como en Paga justo). */
  function enBucket(cent, paso) {
    if (paso === 100) return cent % 100 === 0;
    if (paso === 50) return cent % 50 === 0 && cent % 100 !== 0;
    return cent % 10 === 0 && cent % 50 !== 0;
  }

  /* Importes del bucket estrictamente entre min y max. */
  function importesEnHueco(min, max, paso) {
    var lista = [];
    for (var v = paso; v < max; v += paso) {
      if (v > min && enBucket(v, paso)) lista.push(v);
    }
    return lista;
  }

  /* Par (precio, pagado): pagado es la única opción que llega y el
     cambio nunca es cero. Compartido por conquepago y cambio. */
  function generarPar(paso) {
    var pares = [[200, 100], [500, 200], [1000, 500]];   /* [pagado, inferior] */
    var candidatos = [];
    pares.forEach(function (par) {
      var precios = importesEnHueco(par[1], par[0], paso);
      if (precios.length) candidatos.push({ pagado: par[0], inferior: par[1], precios: precios });
    });
    var c = azar(candidatos);
    return { pagado: c.pagado, inferior: c.inferior, precio: azar(c.precios) };
  }

  /* Distractores de importe: cercanos, distintos y positivos. */
  function distractoresDe(correcto, paso) {
    var lista = [];
    App.utils.shuffle([paso, 100, paso * 2]).forEach(function (d) {
      [correcto + d, correcto - d].forEach(function (x) {
        if (x > 0 && x !== correcto && lista.indexOf(x) === -1 && lista.length < 2) lista.push(x);
      });
    });
    while (lista.length < 2) lista.push(correcto + (lista.length + 1) * paso);
    return lista;
  }

  /* ============================================================
     Runner genérico de quiz de dinero
     ============================================================ */
  var enunciadoQuizEl = $('#enunciadoQuiz');
  var opcionesQuizEl = $('#opcionesQuiz');
  var feedbackQuizEl = $('#feedbackQuiz');
  var explicacionQuizWrap = $('#explicacionQuizWrap');
  var explicacionQuizEl = $('#explicacionQuiz');
  var btnSiguienteQuiz = $('#btnSiguienteQuiz');

  var actividadActual = 'contar';
  var nivelQ = null;
  var casoQ = null;
  var idxQ = 0;
  var aciertosQ = 0;
  var intentosQ = 0;
  var resueltoQ = false;
  var opcionBotones = [];

  function cfgActual() { return ACTIVIDADES[actividadActual]; }

  function mostrarTextoQuiz(texto) {
    explicacionQuizEl.textContent = texto;
    explicacionQuizWrap.classList.remove('oculto');
    App.tts.speak(texto);
  }

  function pintarProgresoQuiz() {
    var total = datos().porRonda;
    $('#progressQuizFill').style.width = (idxQ / total * 100) + '%';
    $('#progressQuizText').textContent = idxQ + ' / ' + total;
  }

  function iniciarRondaQuiz(nivel) {
    nivelQ = nivel;
    idxQ = 0;
    aciertosQ = 0;
    mostrar('pantallaJuegoQuiz');
    renderQuiz();
  }

  function renderQuiz() {
    var cfg = cfgActual();
    casoQ = cfg.generar(nivelQ);
    intentosQ = 0;
    resueltoQ = false;
    feedbackQuizEl.textContent = '';
    feedbackQuizEl.className = 'feedback';
    explicacionQuizWrap.classList.add('oculto');
    explicacionQuizEl.textContent = '';
    btnSiguienteQuiz.classList.add('oculto');

    enunciadoQuizEl.textContent = cfg.enunciado(casoQ);
    pintarMesa(cfg.mesa ? cfg.mesa(casoQ) : null);

    opcionesQuizEl.innerHTML = '';
    opcionBotones = [];
    cfg.opciones(casoQ).forEach(function (op) {
      var btn;
      if (cfg.tipoOpcion === 'ficha') {
        btn = crearFicha(op.cent, true);
        btn.setAttribute('aria-label', ariaDinero(op.cent));
      } else {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = op.texto;
      }
      btn.addEventListener('click', function () { responderQuiz(btn, op); });
      opcionesQuizEl.appendChild(btn);
      opcionBotones.push({ btn: btn, op: op });
    });

    pintarProgresoQuiz();
    pintarEstrellas();
  }

  function resolverQuiz(bien) {
    var cfg = cfgActual();
    resueltoQ = true;
    opcionBotones.forEach(function (par) {
      par.btn.disabled = true;
      if (par.op.correcta) par.btn.classList.add('correcta');
    });
    mostrarTextoQuiz(cfg.explicacion(casoQ, bien));
    if (cfg.alResolver) cfg.alResolver(casoQ);
    btnSiguienteQuiz.classList.remove('oculto');
    btnSiguienteQuiz.focus();
  }

  function responderQuiz(btn, op) {
    if (resueltoQ) return;
    if (op.correcta) {
      if (intentosQ === 0) {
        aciertosQ += 1;
        progreso.estrellas += 1;
        guardar();
        pintarEstrellas();
      }
      App.feedback.acierto(feedbackQuizEl);
      resolverQuiz(true);
      return;
    }
    intentosQ += 1;
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.animo(feedbackQuizEl);
    if (intentosQ === 1) {
      /* Primer fallo: pista socrática, sin dar la respuesta (regla 12). */
      mostrarTextoQuiz(cfgActual().pista(casoQ));
    } else {
      /* Segundo fallo: se marca la correcta y se explica el porqué
         (regla 11: nadie se queda sin resolución). */
      resolverQuiz(false);
    }
  }

  function siguienteQuiz() {
    idxQ += 1;
    App.tts.stop();
    if (idxQ >= datos().porRonda) terminarRonda(aciertosQ);
    else renderQuiz();
  }

  /* ============================================================
     Configuración de las actividades (▶ añadir aquí las nuevas)
     ============================================================ */
  var ACTIVIDADES = {

    /* --- ¿Cuánto hay? — contar el dinero de la mesa --- */
    contar: {
      esQuiz: true,
      instruccion: 'instruccionContar',
      progresoClave: 'completadosContar',
      resumen: 'resumenContar',
      niveles: function () { return datos().contar.niveles; },
      generar: function (nivel) {
        var n = 2 + Math.floor(Math.random() * 3);
        var piezas = [];
        var total = 0;
        for (var k = 0; k < n; k++) {
          var v = azar(nivel.cents);
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
        return { piezas: piezas, total: total, importes: App.utils.shuffle([total].concat(distractores)) };
      },
      enunciado: function () { return App.i18n.t('contarPregunta'); },
      mesa: function (caso) { return caso.piezas; },
      opciones: function (caso) {
        return caso.importes.map(function (cent) {
          return { texto: formatear(cent), correcta: cent === caso.total };
        });
      },
      pista: function () { return App.i18n.t('pistaContar'); },
      explicacion: function (caso, bien) {
        return App.i18n.t(bien ? 'explicacionBien' : 'explicacionCasi')
          .replace('{d}', desglose(caso.piezas))
          .replace('{total}', formatear(caso.total));
      }
    },

    /* --- ¿Con qué pago? — elegir el dinero que llega --- */
    conquepago: {
      esQuiz: true,
      tipoOpcion: 'ficha',
      instruccion: 'instruccionConQuePago',
      progresoClave: 'completadosConQuePago',
      resumen: 'resumenConQuePago',
      niveles: function () { return datos().importe.niveles; },
      generar: function (nivel) {
        var par = generarPar(nivel.paso);
        var producto = azar(todosLosProductos());
        var menores = [500, 200, 100, 50].filter(function (c) { return c < par.inferior; });
        var opciones = App.utils.shuffle([
          { cent: par.pagado, correcta: true },
          { cent: par.inferior, correcta: false },
          { cent: azar(menores), correcta: false }
        ]);
        return {
          picto: producto.picto,
          nombre: producto.nombre,
          precio: par.precio,
          pagado: par.pagado,
          cambio: par.pagado - par.precio,
          lista: opciones
        };
      },
      enunciado: function (caso) {
        return caso.picto + ' ' + App.i18n.t('enunciadoConQuePago')
          .replace('{nombre}', caso.nombre)
          .replace('{precio}', formatear(caso.precio));
      },
      mesa: function () { return null; },
      opciones: function (caso) { return caso.lista; },
      pista: function () { return App.i18n.t('pistaConQuePago'); },
      explicacion: function (caso, bien) {
        return App.i18n.t(bien ? 'explicacionPagoBien' : 'explicacionPagoCasi')
          .replace('{pagado}', hablado(caso.pagado))
          .replace('{cambio}', formatear(caso.cambio));
      },
      /* Al resolver, el cambio aparece como fichas en la mesa:
         conecta pagar con el cambio físico. */
      alResolver: function (caso) { pintarMesa(descomponer(caso.cambio)); }
    },

    /* --- ¿Está bien el cambio? — verificar lo devuelto --- */
    cambio: {
      esQuiz: true,
      instruccion: 'instruccionCambio',
      progresoClave: 'completadosCambio',
      resumen: 'resumenCambio',
      niveles: function () { return datos().importe.niveles; },
      generar: function (nivel) {
        var par = generarPar(nivel.paso);
        var bueno = par.pagado - par.precio;
        var esBien = Math.random() < 0.5;
        var mostrado = bueno;
        if (!esBien) {
          var deltas = App.utils.shuffle([nivel.paso, -nivel.paso, 100, -100]);
          for (var k = 0; k < deltas.length; k++) {
            var m = bueno + deltas[k];
            if (m > 0 && m !== bueno) { mostrado = m; break; }
          }
        }
        return { precio: par.precio, pagado: par.pagado, bueno: bueno, mostrado: mostrado, esBien: mostrado === bueno };
      },
      enunciado: function (caso) {
        return App.i18n.t('enunciadoCambio')
          .replace('{precio}', formatear(caso.precio))
          .replace('{pagado}', hablado(caso.pagado));
      },
      mesa: function (caso) { return descomponer(caso.mostrado); },
      /* Sí/No en orden fijo (natural), no se barajan. */
      opciones: function (caso) {
        return [
          { texto: App.i18n.t('si'), correcta: caso.esBien },
          { texto: App.i18n.t('no'), correcta: !caso.esBien }
        ];
      },
      pista: function () { return App.i18n.t('pistaCambio'); },
      explicacion: function (caso) {
        var clave = caso.esBien ? 'explicacionCambioBien' :
          (caso.mostrado < caso.bueno ? 'explicacionCambioFalta' : 'explicacionCambioSobra');
        return App.i18n.t(clave)
          .replace('{bueno}', formatear(caso.bueno))
          .replace('{mostrado}', formatear(caso.mostrado));
      }
    },

    /* --- La Hucha — ¿cuánto falta para comprarlo? --- */
    hucha: {
      esQuiz: true,
      instruccion: 'instruccionHucha',
      progresoClave: 'completadosHucha',
      resumen: 'resumenHucha',
      niveles: function () { return datos().importe.niveles; },
      generar: function (nivel) {
        /* Objetivos: el banco PRODUCTOS del bucket del nivel. */
        var banco = datos().pagar.niveles.filter(function (n) { return n.id === nivel.id; })[0];
        var candidatos = banco.productos.filter(function (p) { return p.precioCent >= 2 * nivel.paso; });
        var producto = azar(candidatos);
        var pasos = producto.precioCent / nivel.paso;
        var tienes = nivel.paso * (1 + Math.floor(Math.random() * (pasos - 1)));
        var falta = producto.precioCent - tienes;
        var opciones = App.utils.shuffle([falta].concat(distractoresDe(falta, nivel.paso)));
        return {
          picto: producto.picto,
          nombre: producto.nombre,
          precio: producto.precioCent,
          tienes: tienes,
          falta: falta,
          importes: opciones
        };
      },
      enunciado: function (caso) {
        var nombre = caso.nombre.charAt(0).toLowerCase() + caso.nombre.slice(1);
        return caso.picto + ' ' + App.i18n.t('enunciadoHucha')
          .replace('{nombre}', nombre)
          .replace('{precio}', formatear(caso.precio));
      },
      mesa: function (caso) { return descomponer(caso.tienes); },
      opciones: function (caso) {
        return caso.importes.map(function (cent) {
          return { texto: formatear(cent), correcta: cent === caso.falta };
        });
      },
      pista: function () { return App.i18n.t('pistaHucha'); },
      explicacion: function (caso, bien) {
        return App.i18n.t(bien ? 'explicacionHuchaBien' : 'explicacionHuchaCasi')
          .replace('{precio}', formatear(caso.precio))
          .replace('{tienes}', formatear(caso.tienes))
          .replace('{falta}', formatear(caso.falta));
      }
    },

    /* --- Paga justo — interactiva, fuera del runner --- */
    pagar: {
      esQuiz: false,
      instruccion: 'pagarInstruccion',
      progresoClave: 'completadosPagar',
      resumen: 'resumenPagar',
      niveles: function () { return datos().pagar.niveles; }
    }
  };

  /* ============================================================
     Menú y niveles (compartidos)
     ============================================================ */
  function abrirActividad(id) {
    actividadActual = id;
    var cfg = cfgActual();
    $('#instruccionActividad').textContent = App.i18n.t(cfg.instruccion);
    pintarNiveles();
    mostrar('pantallaNiveles');
  }

  function pintarNiveles() {
    var cfg = cfgActual();
    var cont = $('#niveles');
    cont.innerHTML = '';
    cfg.niveles().forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso[cfg.progresoClave][n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + App.i18n.t('vecesTexto').replace('{n}', veces) + ')</span>';
      btn.addEventListener('click', function () {
        if (cfg.esQuiz) iniciarRondaQuiz(n);
        else iniciarRondaPagar(n);
      });
      cont.appendChild(btn);
    });
  }

  function terminarRonda(aciertos) {
    var cfg = cfgActual();
    var nivel = cfg.esQuiz ? nivelQ : nivelP;
    progreso[cfg.progresoClave][nivel.id] = (progreso[cfg.progresoClave][nivel.id] || 0) + 1;
    guardar();
    $('#resumenFinal').textContent = App.i18n.t(cfg.resumen)
      .replace('{n}', aciertos)
      .replace('{t}', datos().porRonda);
    mostrar('pantallaFinal');
    App.feedback.celebrar(App.i18n.t('core.rondaCompletada'));
  }

  /* ============================================================
     Actividad — Paga justo (interactiva)
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
    if (idxP >= datos().porRonda) terminarRonda(aciertosP);
    else renderPagar();
  }

  /* ---- Eventos ---- */
  App.utils.$$('.tarjeta-actividad').forEach(function (btn) {
    btn.addEventListener('click', function () { abrirActividad(btn.getAttribute('data-actividad')); });
  });
  $('#btnVolverMenuNiveles').addEventListener('click', function () { App.tts.stop(); mostrar('pantallaMenu'); });
  $('#btnVolverMenuFinal').addEventListener('click', function () { App.tts.stop(); mostrar('pantallaMenu'); });
  $('#btnInstruccionActividad').addEventListener('click', function () {
    App.tts.speak($('#instruccionActividad').textContent);
  });

  btnSiguienteQuiz.addEventListener('click', siguienteQuiz);
  $('#btnEnunciadoQuiz').addEventListener('click', function () {
    App.tts.speak(enunciadoQuizEl.textContent);
  });
  $('#btnEscucharExplicacionQuiz').addEventListener('click', function () {
    App.tts.speak(explicacionQuizEl.textContent);
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
    if (cfgActual().esQuiz) iniciarRondaQuiz(nivelQ);
    else iniciarRondaPagar(nivelP);
  });
  $('#btnOtroNivelFinal').addEventListener('click', function () { abrirActividad(actividadActual); });
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent);
  });

  pintarEstrellas();
})();
