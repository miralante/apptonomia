/* ============================================================
   Apptonomia — Los Números (matemáticas para el día a día)
   Datos y niveles en data.js. Módulos compartidos en assets/js/.
   Cada cifra se pinta según su posición: azul unidades,
   verde decenas, morado centenas. La coma, los céntimos y los
   signos van en naranja. Los números grandes llevan etiquetas
   por grupos (miles, millones… hasta billones).
   Las preguntas se generan al vuelo según el tipo del nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'numeros';
  var $ = App.utils.$;

  var pantallaMenu = $('#pantallaMenu');
  var pantallaNiveles = $('#pantallaNiveles');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var enunciadoEl = $('#enunciado');
  var visualEl = $('#visual');
  var leyendaEl = $('#leyenda');
  var opcionesEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnEscucharExplicacion = $('#btnEscucharExplicacion');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};

  /* Round state */
  var actividad = null;
  var nivel = null;
  var idx = 0;
  var aciertosRonda = 0;
  var resuelto = false;
  var intentos = 0;
  var pregunta = null;
  var pools = {};

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  /* ---- Utilidades ---- */

  function ri(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

  /* Saca elementos de una lista sin repetir dentro de la ronda. */
  function sacar(clave, lista) {
    var p = pools[clave];
    if (!p || p.i >= p.orden.length) {
      p = pools[clave] = { orden: App.utils.shuffle(lista), i: 0 };
    }
    return p.orden[p.i++];
  }

  /* ---- Color-coded digits by place value ---- */

  var POS_CLASE = ['cifra-u', 'cifra-d', 'cifra-c'];

  /* Separador de miles ('.' es / ',' en) y decimal (',' es / '.' en).
     No es solo estilo: intercambiar el separador entre idiomas es
     obligatorio para que el número se lea correctamente (ver I18N.md §2). */
  function separadorMiles() { return App.i18n.locale() === 'en' ? ',' : '.'; }
  function separadorDecimal() { return App.i18n.locale() === 'en' ? '.' : ','; }

  function leyendaPos() {
    return '<span class="cifra-u">' + App.i18n.t('leyendaUnidadesTxt') + '</span> · ' +
      '<span class="cifra-d">' + App.i18n.t('leyendaDecenasTxt') + '</span> · ' +
      '<span class="cifra-c">' + App.i18n.t('leyendaCentenasTxt') + '</span>';
  }

  function leyendaPrecio() {
    return '<span class="cifra-u">' + App.i18n.t('leyendaEurosTxt') + '</span> · ' +
      '<span class="cifra-coma">' + App.i18n.t('leyendaComaTxt') + '</span>';
  }

  function leyendaFrac() {
    return '<span class="cifra-u">' + App.i18n.t('leyendaPartesPintadasTxt') + '</span> · ' +
      '<span class="cifra-d">' + App.i18n.t('leyendaPartesTotalTxt') + '</span>';
  }

  /* html for the digits of n. destacar: place (0=units, 1=tens…)
     that gets underlined. etiquetas: group labels (thousands, millions…). */
  function cifras(n, etiquetas, destacar) {
    var s = String(n);
    var grupos = [];
    for (var i = s.length; i > 0; i -= 3) grupos.unshift(s.slice(Math.max(0, i - 3), i));
    var html = '';
    for (var g = 0; g < grupos.length; g++) {
      var cuerpo = '';
      for (var j = 0; j < grupos[g].length; j++) {
        var pos = grupos[g].length - 1 - j;
        var posAbs = (grupos.length - 1 - g) * 3 + pos;
        var clase = POS_CLASE[pos];
        if (destacar === posAbs) clase += ' destacada';
        cuerpo += '<span class="' + clase + '">' + grupos[g][j] + '</span>';
      }
      if (g > 0) html += '<span class="cifra-sep">' + separadorMiles() + '</span>';
      if (etiquetas && grupos.length > 1) {
        html += '<span class="grupo"><span>' + cuerpo + '</span>' +
          '<span class="grupo-etq">' + (App.i18n.t('grupoEtq.' + (grupos.length - 1 - g)) || '&nbsp;') + '</span></span>';
      } else {
        html += cuerpo;
      }
    }
    return html;
  }

  function numero(n, opts) {
    opts = opts || {};
    return '<span class="num-color">' + cifras(n, opts.etiquetas, opts.destacar) + '</span>';
  }

  function signo(s) { return '<span class="signo">' + s + '</span>'; }

  function precioHTML(cent) {
    var e = Math.floor(cent / 100);
    var c = cent % 100;
    var cc = (c < 10 ? '0' : '') + c;
    return '<span class="num-color">' + cifras(e) +
      '<span class="cifra-coma">' + separadorDecimal() + '</span><span class="cifra-dec">' + cc + '</span> €</span>';
  }

  function palabrasPrecio(cent) {
    var e = Math.floor(cent / 100);
    var c = cent % 100;
    var pe = e === 1 ? App.i18n.t('euroUno') : App.i18n.t('euroVarios').replace('{e}', e);
    return c === 0 ? pe : App.i18n.t('precioConCentimos').replace('{euros}', pe).replace('{c}', c);
  }

  /* ---- Fracciones (SVG) ---- */

  function svgFraccion(num, den, size) {
    var cx = 60, cy = 60, r = 54;
    var paths = '';
    for (var i = 0; i < den; i++) {
      var a0 = -Math.PI / 2 + (i * 2 * Math.PI) / den;
      var a1 = a0 + (2 * Math.PI) / den;
      var x0 = (cx + r * Math.cos(a0)).toFixed(1);
      var y0 = (cy + r * Math.sin(a0)).toFixed(1);
      var x1 = (cx + r * Math.cos(a1)).toFixed(1);
      var y1 = (cy + r * Math.sin(a1)).toFixed(1);
      var fill = i < num ? 'var(--mod-razonamiento)' : 'var(--color-superficie)';
      paths += '<path d="M' + cx + ' ' + cy + ' L' + x0 + ' ' + y0 +
        ' A' + r + ' ' + r + ' 0 0 1 ' + x1 + ' ' + y1 + ' Z" fill="' + fill +
        '" stroke="var(--color-texto)" stroke-width="2"/>';
    }
    return '<svg viewBox="0 0 120 120" width="' + size + '" height="' + size + '" aria-hidden="true">' + paths + '</svg>';
  }

  function htmlFraccion(f) {
    return '<span class="frac" aria-hidden="true"><span class="frac-num">' + f[0] +
      '</span><span class="frac-den">' + f[1] + '</span></span>';
  }

  /* ---- Numeric options (3, unique, shuffled) ---- */

  function construirOpciones(correcto, distractores, formato) {
    var valores = [correcto];
    for (var i = 0; i < distractores.length && valores.length < 3; i++) {
      var d = distractores[i];
      if (d > 0 && valores.indexOf(d) === -1) valores.push(d);
    }
    var extra = correcto + 2;
    while (valores.length < 3) {
      if (valores.indexOf(extra) === -1) valores.push(extra);
      extra += 3;
    }
    return App.utils.shuffle(valores).map(function (v) {
      return { html: formato ? formato(v) : String(v), correcta: v === correcto };
    });
  }

  function repetir(html, veces) {
    var s = '';
    for (var i = 0; i < veces; i++) s += html;
    return s;
  }

  function grupoPuntos(n, clase) {
    return '<span class="grupo-puntos">' + repetir('<span class="punto ' + clase + '"></span>', n) + '</span>';
  }

  /* Dots to subtract: the last "quitar" ones get an X. */
  function grupoPuntosResta(total, quitar) {
    var s = '';
    for (var i = 0; i < total; i++) {
      var clase = i >= (total - quitar) ? 'punto quitado' : 'punto';
      s += '<span class="' + clase + '"></span>';
    }
    return '<span class="grupo-puntos">' + s + '</span>';
  }

  /* ============================================================
     Generadores de preguntas (uno por tipo de nivel)
     Devuelven: enunciado, hablar, visual (html), leyenda,
     opciones[{html, correcta, aria?}], pista?, enFila?, visualAria?
     ============================================================ */

  var GENERADORES = {

    contar: function (nv) {
      /* 'max' is derived from 'paso' (the only difficulty variable,
         rule 13): bigger steps need more headroom for the 5-term
         sequence to make sense. */
      var max = nv.paso * 12;
      var inicio = ri(0, Math.floor((max - nv.paso * 4) / nv.paso)) * nv.paso;
      var seq = [];
      for (var i = 0; i < 4; i++) seq.push(inicio + nv.paso * i);
      var correcto = inicio + nv.paso * 4;
      return {
        enunciado: App.i18n.t('gen.contarEnunciado'),
        hablar: App.i18n.t('gen.contarHablar').replace(/\{paso\}/g, nv.paso).replace('{seq}', seq.join(', ')),
        visual: '<div class="secuencia">' + seq.map(function (n) {
          return '<span class="caja-num">' + numero(n) + '</span>';
        }).join('') + '<span class="caja-num hueco">?</span></div>',
        leyenda: leyendaPos(),
        opciones: construirOpciones(correcto,
          [correcto - nv.paso, correcto + nv.paso, correcto + 1],
          function (v) { return numero(v); })
      };
    },

    bloques: function (nv) {
      var n = nv.max === 99 ? ri(11, 99) : ri(111, 999);
      var c = Math.floor(n / 100);
      var d = Math.floor((n % 100) / 10);
      var u = n % 10;
      var partes = [];
      if (c) partes.push(c + ' ' + App.i18n.t(c === 1 ? 'centenaSingular' : 'centenaPlural'));
      if (d) partes.push(d + ' ' + App.i18n.t(d === 1 ? 'decenaSingular' : 'decenaPlural'));
      if (u) partes.push(u + ' ' + App.i18n.t(u === 1 ? 'unidadSingular' : 'unidadPlural'));
      var conjuncion = App.i18n.locale() === 'en' ? ' and $1' : ' y $1';
      var texto = partes.join(', ').replace(/, ([^,]+)$/, conjuncion);
      var html = '<div class="bloques">';
      if (c) html += '<span class="bloques-grupo">' + repetir('<span class="bloque-100">100</span>', c) + '</span>';
      if (d) html += '<span class="bloques-grupo">' + repetir('<span class="bloque-10">10</span>', d) + '</span>';
      if (u) html += '<span class="bloques-grupo">' + repetir('<span class="bloque-1"></span>', u) + '</span>';
      html += '</div>';
      var trocado = c * 100 + u * 10 + d; /* tens and units swapped */
      return {
        enunciado: App.i18n.t('gen.bloquesEnunciado'),
        hablar: App.i18n.t('gen.bloquesHablar').replace('{texto}', texto),
        visual: html,
        visualAria: App.i18n.t('gen.bloquesVisualAria').replace('{texto}', texto),
        leyenda: leyendaPos(),
        opciones: construirOpciones(n,
          App.utils.shuffle([trocado !== n ? trocado : n + 1, n + 10, n - 10, n + 1]),
          function (v) { return numero(v); })
      };
    },

    lectura: function (nv, i) {
      var lista = DATA.lecturas[App.i18n.locale()][nv.lista];
      var item = sacar(nv.lista, lista);
      var otros = App.utils.shuffle(lista.filter(function (o) { return o.n !== item.n; })).slice(0, 2);
      var nota = item.nota ? '<p class="pista">' + item.nota + '</p>' : '';
      if (i % 2 === 0) {
        /* number → words */
        return {
          enunciado: App.i18n.t('gen.lecturaEnunciadoNumASim'),
          hablar: App.i18n.t('gen.lecturaHablarNumASim'),
          visual: '<div class="visual-num">' + numero(item.n, { etiquetas: true }) + '</div>' + nota,
          leyenda: leyendaPos(),
          opciones: App.utils.shuffle([{ html: item.palabras, correcta: true }].concat(
            otros.map(function (o) { return { html: o.palabras, correcta: false }; })
          ))
        };
      }
      /* words → number */
      return {
        enunciado: App.i18n.t('gen.lecturaEnunciadoSimANum'),
        hablar: App.i18n.t('gen.lecturaHablarSimANum').replace('{palabras}', item.palabras),
        visual: '<p class="palabras-num">' + item.palabras + '</p>' + nota,
        leyenda: leyendaPos(),
        opciones: App.utils.shuffle([{ html: numero(item.n), correcta: true }].concat(
          otros.map(function (o) { return { html: numero(o.n), correcta: false }; })
        ))
      };
    },

    /* Place-value exchange: 10 of one kind become 1 of the next
       (units→tens, tens→hundreds, hundreds→thousands). Even questions
       group small blocks into framed tens; odd questions go the other
       way (how many small ones make these big blocks?). */
    canje: function (nv, i) {
      var bloques = [
        '<span class="bloque-1"></span>',
        '<span class="bloque-10">10</span>',
        '<span class="bloque-100">100</span>',
        '<span class="bloque-1000">1' + separadorMiles() + '000</span>'
      ];
      var pista = App.i18n.t('gen.canjePista' + nv.lugar);
      if (i % 2 === 0) {
        /* Big blocks get large fast: fewer groups for bigger places. */
        var k = ri(2, [5, 4, 3][nv.lugar]);
        var n = k * 10;
        var enunciado = App.i18n.t('gen.canjeDirecto' + nv.lugar).replace('{n}', n);
        return {
          enunciado: enunciado,
          hablar: enunciado + ' ' + pista,
          visual: '<div class="bloques">' +
            repetir('<span class="canje-grupo">' + repetir(bloques[nv.lugar], 10) + '</span>', k) +
            '</div><p class="pista">' + pista + '</p>',
          visualAria: App.i18n.t('gen.canjeAriaDirecto').replace('{k}', k),
          leyenda: leyendaPos(),
          opciones: construirOpciones(k, [n, k + 1, k - 1],
            function (v) { return numero(v); })
        };
      }
      var kInv = ri(2, 9);
      var enunciadoInv = App.i18n.t('gen.canjeInverso' + nv.lugar).replace('{k}', kInv);
      return {
        enunciado: enunciadoInv,
        hablar: enunciadoInv + ' ' + pista,
        visual: '<div class="bloques"><span class="bloques-grupo">' +
          repetir(bloques[nv.lugar + 1], kInv) +
          '</span></div><p class="pista">' + pista + '</p>',
        visualAria: App.i18n.t('gen.canjeAriaInverso').replace('{k}', kInv),
        leyenda: leyendaPos(),
        opciones: construirOpciones(kInv * 10, [kInv, kInv * 10 + 10, (kInv - 1) * 10],
          function (v) { return numero(v); })
      };
    },

    /* ×10 ladder: multiplying a power of ten by 10 moves every digit
       one place left, up to 10^12 (un billón / one trillion). The
       exponent range gives exactly 6 rungs per level, so a round
       walks the whole ladder without repeats. */
    escalera: function (nv) {
      var exponentes = [];
      for (var e = nv.minExp; e <= nv.maxExp; e++) exponentes.push(e);
      var exp = sacar('esc' + nv.id, exponentes);
      var n = Math.pow(10, exp);
      var correcto = n * 10;
      return {
        enunciado: App.i18n.t('gen.escaleraEnunciado'),
        hablar: App.i18n.t('gen.escaleraHablar')
          .replace('{palabras}', DATA.potencias[App.i18n.locale()][exp]),
        visual: '<div class="expresion">' + numero(10) + signo('×') +
          numero(n, { etiquetas: true }) + signo('=') +
          '<span class="caja-num hueco">?</span></div>' +
          '<p class="pista">' + App.i18n.t('gen.escaleraPista') + '</p>',
        leyenda: leyendaPos(),
        opciones: construirOpciones(correcto, [n, correcto * 10],
          function (v) { return numero(v); })
      };
    },

    dictado: function (nv) {
      var n = ri(11, nv.max);
      var candidatos = App.utils.shuffle(
        [n - 10, n + 10, n - 1, n + 1, n + 2].filter(function (x) { return x > 0 && x !== n; })
      );
      return {
        enunciado: App.i18n.t('gen.dictadoEnunciado'),
        hablar: String(n),
        visual: '<div class="dictado-espera" aria-hidden="true">🔊</div>',
        visualAria: App.i18n.t('gen.dictadoVisualAria'),
        opciones: construirOpciones(n, candidatos, function (v) { return numero(v); }),
        autoHablar: true
      };
    },

    sumar: function (nv) {
      var a = ri(nv.a[0], nv.a[1]);
      var b = ri(nv.b[0], nv.b[1]);
      return {
        enunciado: App.i18n.t('gen.sumarEnunciado').replace('{a}', a).replace('{b}', b),
        hablar: App.i18n.t('gen.sumarHablar').replace('{a}', a).replace('{b}', b),
        visual: '<div class="expresion">' + numero(a) + signo('+') + numero(b) +
          signo('=') + '<span class="caja-num hueco">?</span></div>' +
          '<div class="puntos" aria-hidden="true">' + grupoPuntos(a, 'pa') +
          signo('+') + grupoPuntos(b, 'pb') + '</div>',
        opciones: construirOpciones(a + b, [a + b - 1, a + b + 1, a + b + 2],
          function (v) { return numero(v); })
      };
    },

    restar: function (nv) {
      var a = ri(nv.a[0], nv.a[1]);
      var b = ri(1, Math.min(nv.maxB, a));
      var correcto = a - b;
      return {
        enunciado: App.i18n.t('gen.restarEnunciado').replace('{a}', a).replace('{b}', b),
        hablar: App.i18n.t('gen.restarHablar').replace('{a}', a).replace('{b}', b),
        visual: '<div class="expresion">' + numero(a) + signo('−') + numero(b) +
          signo('=') + '<span class="caja-num hueco">?</span></div>' +
          '<div class="puntos" aria-hidden="true">' + grupoPuntosResta(a, b) + '</div>' +
          '<p class="pista">' + App.i18n.t('gen.restarPista').replace('{b}', b) + '</p>',
        opciones: construirOpciones(correcto, [correcto - 1, correcto + 1, a],
          function (v) { return numero(v); })
      };
    },

    multiplicar: function (nv) {
      var a = nv.tablas[ri(0, nv.tablas.length - 1)];
      var b = ri(2, 9);
      var filas = repetir('<span class="fila-puntos">' + repetir('<span class="punto"></span>', b) + '</span>', a);
      return {
        enunciado: App.i18n.t('gen.multiplicarEnunciado').replace('{a}', a).replace('{b}', b),
        hablar: App.i18n.t('gen.multiplicarHablar').replace(/\{a\}/g, a).replace(/\{b\}/g, b),
        visual: '<div class="expresion">' + numero(a) + signo('×') + numero(b) +
          signo('=') + '<span class="caja-num hueco">?</span></div>' +
          '<div class="filas-puntos" aria-hidden="true">' + filas + '</div>' +
          '<p class="pista">' + App.i18n.t('gen.multiplicarPista').replace('{a}', a).replace('{b}', b) + '</p>',
        opciones: construirOpciones(a * b, [a * (b + 1), a * (b - 1), a * b + 1],
          function (v) { return numero(v); })
      };
    },

    dobles: function () {
      var a = ri(2, 12);
      return {
        enunciado: App.i18n.t('gen.doblesEnunciado').replace(/\{a\}/g, a),
        hablar: App.i18n.t('gen.doblesHablar').replace(/\{a\}/g, a),
        visual: '<div class="expresion">' + numero(a) + signo('+') + numero(a) +
          signo('=') + '<span class="caja-num hueco">?</span></div>' +
          '<div class="puntos" aria-hidden="true">' + grupoPuntos(a, 'pa') +
          signo('+') + grupoPuntos(a, 'pb') + '</div>' +
          '<p class="pista">' + App.i18n.t('gen.doblesPista') + '</p>',
        opciones: construirOpciones(2 * a, [2 * a - 1, 2 * a + 2, 2 * a + 1],
          function (v) { return numero(v); })
      };
    },

    sumaGrande: function (nv) {
      var n, destacar, pista;
      if (nv.suma === 10) {
        n = ri(1, 8) * 10 + ri(1, 9);
        if (Math.random() < 0.4) n += ri(1, 4) * 100;
        destacar = 1;
        pista = App.i18n.t('gen.pistaDecenas');
      } else if (nv.suma === 100) {
        n = ri(1, 8) * 100 + ri(0, 99);
        destacar = 2;
        pista = App.i18n.t('gen.pistaCentenas');
      } else {
        n = ri(1, 8) * 1000 + ri(0, 999);
        destacar = 3;
        pista = App.i18n.t('gen.pistaMiles');
      }
      var correcto = n + nv.suma;
      return {
        enunciado: App.i18n.t('gen.sumaGrandeEnunciado').replace('{n}', n).replace('{suma}', nv.suma),
        hablar: App.i18n.t('gen.sumaGrandeHablar').replace('{n}', n).replace('{suma}', nv.suma).replace('{pista}', pista),
        visual: '<div class="expresion">' + numero(n, { destacar: destacar }) +
          signo('+') + numero(nv.suma) + signo('=') +
          '<span class="caja-num hueco">?</span></div>' +
          '<p class="pista">' + pista + '</p>',
        leyenda: leyendaPos(),
        opciones: construirOpciones(correcto,
          App.utils.shuffle([n + 1, n + nv.suma * 2, correcto + nv.suma / 10]),
          function (v) { return numero(v); })
      };
    },

    restaGrande: function (nv) {
      var n, destacar, pista;
      if (nv.resta === 10) {
        n = ri(1, 8) * 10 + ri(1, 9);
        if (Math.random() < 0.4) n += ri(1, 4) * 100;
        destacar = 1;
        pista = App.i18n.t('gen.pistaDecenas');
      } else if (nv.resta === 100) {
        n = ri(1, 8) * 100 + ri(0, 99);
        destacar = 2;
        pista = App.i18n.t('gen.pistaCentenas');
      } else {
        n = ri(1, 8) * 1000 + ri(0, 999);
        destacar = 3;
        pista = App.i18n.t('gen.pistaMiles');
      }
      var correcto = n - nv.resta;
      return {
        enunciado: App.i18n.t('gen.restaGrandeEnunciado').replace('{n}', n).replace('{resta}', nv.resta),
        hablar: App.i18n.t('gen.restaGrandeHablar').replace('{n}', n).replace('{resta}', nv.resta).replace('{pista}', pista),
        visual: '<div class="expresion">' + numero(n, { destacar: destacar }) +
          signo('−') + numero(nv.resta) + signo('=') +
          '<span class="caja-num hueco">?</span></div>' +
          '<p class="pista">' + pista + '</p>',
        leyenda: leyendaPos(),
        opciones: construirOpciones(correcto,
          App.utils.shuffle([n - 1, correcto - nv.resta, n + nv.resta]),
          function (v) { return numero(v); })
      };
    },

    multiplicaGrande: function (nv) {
      var n = ri(2, 99);
      var correcto = n * nv.factor;
      var ceros = App.i18n.t(nv.factor === 10 ? 'gen.cerosUno' : 'gen.cerosDos');
      var distractores = nv.factor === 10 ?
        [n, n * 100, correcto + 1] :
        [n, n * 10, correcto + 10];
      return {
        enunciado: App.i18n.t('gen.multiplicaGrandeEnunciado').replace('{n}', n).replace('{factor}', nv.factor),
        hablar: App.i18n.t('gen.multiplicaGrandeHablar').replace('{n}', n).replace('{factor}', nv.factor).replace('{ceros}', ceros),
        visual: '<div class="expresion">' + numero(n) + signo('×') + numero(nv.factor) +
          signo('=') + '<span class="caja-num hueco">?</span></div>' +
          '<p class="pista">' + App.i18n.t('gen.multiplicaGrandePista').replace('{ceros}', ceros).replace('{n}', n) + '</p>',
        opciones: construirOpciones(correcto, App.utils.shuffle(distractores),
          function (v) { return numero(v); })
      };
    },

    fracciones: function (nv) {
      var f = sacar(nv.id, nv.fracs);
      var otros = App.utils.shuffle(nv.fracs.filter(function (o) {
        return o[0] * f[1] !== o[1] * f[0]; /* quitar fracciones equivalentes */
      })).slice(0, 2);
      return {
        enunciado: App.i18n.t('gen.fraccionesEnunciado'),
        hablar: App.i18n.t('gen.fraccionesHablar').replace(/\{den\}/g, f[1]),
        visual: svgFraccion(f[0], f[1], 170),
        visualAria: App.i18n.t('gen.fraccionesVisualAria').replace('{den}', f[1]).replace('{num}', f[0]),
        leyenda: leyendaFrac(),
        opciones: App.utils.shuffle(
          [{ html: htmlFraccion(f), aria: App.i18n.t('gen.fraccionAria').replace('{num}', f[0]).replace('{den}', f[1]), correcta: true }].concat(
            otros.map(function (o) {
              return { html: htmlFraccion(o), aria: App.i18n.t('gen.fraccionAria').replace('{num}', o[0]).replace('{den}', o[1]), correcta: false };
            })
          )),
        enFila: true
      };
    },

    comparaFrac: function (nv) {
      var par = App.utils.shuffle(sacar(nv.id, nv.pares));
      var mayor = (par[0][0] / par[0][1] > par[1][0] / par[1][1]) ? par[0] : par[1];
      return {
        enunciado: App.i18n.t('gen.comparaFracEnunciado'),
        hablar: App.i18n.t('gen.comparaFracHablar'),
        visual: '',
        opciones: par.map(function (f) {
          return {
            html: '<span class="op-frac">' + svgFraccion(f[0], f[1], 120) + htmlFraccion(f) + '</span>',
            aria: App.i18n.t('gen.fraccionAria').replace('{num}', f[0]).replace('{den}', f[1]),
            correcta: f === mayor
          };
        }),
        enFila: true
      };
    },

    precios: function () {
      var prod = sacar('prod', DATA.productos);
      var nombreProd = App.i18n.t('producto.' + prod.id);
      var e = ri(1, 9);
      var c = [5, 10, 25, 50, 75, 90][ri(0, 5)];
      var cent = e * 100 + c;
      var mal1 = App.i18n.t('precioConCentimos')
        .replace('{euros}', App.i18n.t('euroVarios').replace('{e}', c === e ? e + 1 : c))
        .replace('{c}', c === e ? c : e);
      var mal2 = String(e) + (c < 10 ? '0' : '') + c + ' euros';
      return {
        enunciado: App.i18n.t('gen.preciosEnunciado'),
        hablar: App.i18n.t('gen.preciosHablar').replace('{prod}', nombreProd),
        visual: '<div class="picto-medida" aria-hidden="true">' + prod.picto + '</div>' +
          '<div class="visual-num">' + precioHTML(cent) + '</div>',
        leyenda: leyendaPrecio(),
        opciones: App.utils.shuffle([
          { html: palabrasPrecio(cent), correcta: true },
          { html: mal1, correcta: false },
          { html: mal2, correcta: false }
        ])
      };
    },

    comparaPrecios: function () {
      var prods = App.utils.shuffle(DATA.productos).slice(0, 2);
      var nombres = prods.map(function (p) { return App.i18n.t('producto.' + p.id); });
      var e = ri(1, 4);
      var pares = [
        [e * 100 + 5, e * 100 + 50],
        [e * 100 + 90, (e + 1) * 100 + 10],
        [e * 100, e * 100 + 50],
        [e * 100 + 25, e * 100 + 75]
      ];
      var par = App.utils.shuffle(pares[ri(0, pares.length - 1)]);
      var caro = Math.max(par[0], par[1]);
      return {
        enunciado: App.i18n.t('gen.comparaPreciosEnunciado'),
        hablar: App.i18n.t('gen.comparaPreciosHablar').replace('{p1}', nombres[0]).replace('{p2}', nombres[1]),
        visual: '',
        leyenda: leyendaPrecio(),
        opciones: prods.map(function (p, i) {
          return {
            html: '<span class="op-precio"><span class="op-picto">' + p.picto + '</span>' +
              '<span>' + nombres[i] + '</span>' + precioHTML(par[i]) + '</span>',
            aria: nombres[i] + ': ' + palabrasPrecio(par[i]),
            correcta: par[i] === caro
          };
        }),
        enFila: true
      };
    },

    llegaUno: function () {
      var caso = sacar('llegaUno', DATA.llegaUno);
      var prod = sacar('prodLlegaUno', DATA.productos);
      var nombreProd = App.i18n.t('producto.' + prod.id);
      var llega = caso.precio <= caso.tiene;
      return {
        enunciado: App.i18n.t('gen.llegaUnoEnunciado'),
        hablar: App.i18n.t('gen.llegaUnoHablar')
          .replace('{tiene}', palabrasPrecio(caso.tiene))
          .replace('{prod}', nombreProd)
          .replace('{precio}', palabrasPrecio(caso.precio)),
        visual:
          '<div class="llega-caja"><p class="llega-etq">' + App.i18n.t('gen.etqTienes') + '</p>' + precioHTML(caso.tiene) + '</div>' +
          '<div class="llega-caja"><p class="llega-etq">' + prod.picto + ' ' + nombreProd + ':</p>' +
          precioHTML(caso.precio) + '</div>',
        leyenda: leyendaPrecio(),
        opciones: App.utils.shuffle([
          { html: App.i18n.t('gen.opcionSi'), correcta: llega },
          { html: App.i18n.t('gen.opcionNo'), correcta: !llega }
        ]),
        enFila: true
      };
    },

    llegaDos: function () {
      var caso = sacar('llegaDos', DATA.llegaDos);
      var prods = App.utils.shuffle(DATA.productos).slice(0, 2);
      var nombres = prods.map(function (p) { return App.i18n.t('producto.' + p.id); });
      var total = caso.precios[0] + caso.precios[1];
      var llega = total <= caso.tiene;
      return {
        enunciado: App.i18n.t('gen.llegaDosEnunciado'),
        hablar: App.i18n.t('gen.llegaDosHablar')
          .replace('{tiene}', palabrasPrecio(caso.tiene))
          .replace('{p1}', nombres[0]).replace('{precio1}', palabrasPrecio(caso.precios[0]))
          .replace('{p2}', nombres[1]).replace('{precio2}', palabrasPrecio(caso.precios[1])),
        visual:
          '<div class="llega-caja"><p class="llega-etq">' + App.i18n.t('gen.etqTienes') + '</p>' + precioHTML(caso.tiene) + '</div>' +
          '<div class="llega-fila">' +
          '<div class="llega-caja"><p class="llega-etq">' + prods[0].picto + ' ' + nombres[0] + ':</p>' +
          precioHTML(caso.precios[0]) + '</div>' +
          '<div class="llega-caja"><p class="llega-etq">' + prods[1].picto + ' ' + nombres[1] + ':</p>' +
          precioHTML(caso.precios[1]) + '</div>' +
          '</div>',
        leyenda: leyendaPrecio(),
        opciones: App.utils.shuffle([
          { html: App.i18n.t('gen.opcionSi'), correcta: llega },
          { html: App.i18n.t('gen.opcionNo'), correcta: !llega }
        ]),
        enFila: true
      };
    },

    cambio: function (nv) {
      var caso = sacar('cambio-' + nv.lista, DATA.cambio[nv.lista]);
      var vuelta = caso.billete - caso.precio;
      return {
        enunciado: App.i18n.t('gen.cambioEnunciado'),
        hablar: App.i18n.t('gen.cambioHablar')
          .replace('{billete}', palabrasPrecio(caso.billete))
          .replace('{precio}', palabrasPrecio(caso.precio)),
        visual:
          '<div class="llega-caja"><p class="llega-etq">' + App.i18n.t('gen.etqPagas') + '</p>' + precioHTML(caso.billete) + '</div>' +
          '<div class="llega-caja"><p class="llega-etq">' + App.i18n.t('gen.etqCuesta') + '</p>' + precioHTML(caso.precio) + '</div>',
        leyenda: leyendaPrecio(),
        opciones: App.utils.shuffle([
          { html: precioHTML(vuelta), correcta: true },
          { html: precioHTML(vuelta + 100), correcta: false },
          { html: precioHTML(Math.max(0, vuelta - 100)), correcta: false }
        ]),
        enFila: true
      };
    },

    medidas: function (nv) {
      var grupo = DATA.medidas[App.i18n.locale()][nv.lista];
      var item = sacar('med-' + nv.lista, grupo.items);
      var ej = item.ej ? '<p class="pista">' + item.ej + '</p>' : '';
      return {
        enunciado: item.pregunta,
        hablar: item.q + '. ' + item.pregunta,
        visual: '<div class="picto-medida" aria-hidden="true">' + grupo.picto + '</div>' +
          '<p class="medida-txt">' + item.q + '</p>' + ej,
        opciones: App.utils.shuffle([{ html: item.r, correcta: true }].concat(
          item.falsas.map(function (f) { return { html: f, correcta: false }; })
        ))
      };
    }
  };

  /* ============================================================
     Pantallas y flujo
     ============================================================ */

  function mostrar(pantalla) {
    [pantallaMenu, pantallaNiveles, pantallaJuego, pantallaFinal].forEach(function (p) {
      p.classList.toggle('oculto', p !== pantalla);
    });
  }

  /* ---- Activity menu ---- */
  function pintarMenu() {
    var cont = $('#menuGrupos');
    cont.innerHTML = '';
    DATA.grupos.forEach(function (g) {
      var sec = document.createElement('div');
      sec.className = 'menu-grupo';
      var h = document.createElement('h2');
      h.textContent = App.i18n.t('grupo.' + g.id);
      sec.appendChild(h);
      var grid = document.createElement('div');
      grid.className = 'menu-grid';
      g.ids.forEach(function (id) {
        var act = DATA.actividades[id];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-actividad';
        btn.innerHTML = '<span class="picto" aria-hidden="true">' + act.picto + '</span>' +
          '<span>' + App.i18n.t('actividad.' + id + '.nombre') + '</span>' +
          '<span class="detalle">' + App.i18n.t('actividad.' + id + '.detalle') + '</span>';
        btn.addEventListener('click', function () { abrirActividad(id); });
        grid.appendChild(btn);
      });
      sec.appendChild(grid);
      cont.appendChild(sec);
    });
  }

  /* ---- Niveles de una actividad ---- */
  function abrirActividad(id) {
    actividad = DATA.actividades[id];
    actividad.id = id;
    $('#tituloActividad').textContent = actividad.picto + ' ' + App.i18n.t('actividad.' + id + '.nombre');
    $('#instruccionActividad').textContent = App.i18n.t('actividad.' + id + '.instruccion');
    var cont = $('#niveles');
    cont.innerHTML = '';
    actividad.niveles.forEach(function (nv) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[nv.id] || 0;
      var vecesTxt = App.i18n.t('veces').replace('{n}', veces);
      btn.innerHTML = App.i18n.t('nivel.' + nv.id) + ' <span class="nivel-info">(' + vecesTxt + ')</span>';
      btn.addEventListener('click', function () { iniciarRonda(nv); });
      cont.appendChild(btn);
    });
    App.tts.stop();
    mostrar(pantallaNiveles);
  }

  /* ---- Juego ---- */
  function iniciarRonda(nv) {
    nivel = nv;
    idx = 0;
    aciertosRonda = 0;
    pools = {};
    App.tts.stop();
    mostrar(pantallaJuego);
    render();
  }

  function render() {
    resuelto = false;
    intentos = 0;
    pregunta = GENERADORES[nivel.tipo](nivel, idx);

    enunciadoEl.textContent = pregunta.enunciado;
    visualEl.innerHTML = pregunta.visual || '';
    if (pregunta.visualAria) {
      visualEl.setAttribute('role', 'img');
      visualEl.setAttribute('aria-label', pregunta.visualAria);
    } else {
      visualEl.removeAttribute('role');
      visualEl.removeAttribute('aria-label');
    }
    leyendaEl.innerHTML = pregunta.leyenda || '';
    leyendaEl.classList.toggle('oculto', !pregunta.leyenda);

    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');

    opcionesEl.innerHTML = '';
    opcionesEl.classList.toggle('opciones-fila', !!pregunta.enFila);
    pregunta.opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.innerHTML = op.html;
      if (op.aria) btn.setAttribute('aria-label', op.aria);
      btn.addEventListener('click', function () { responder(op, btn); });
      opcionesEl.appendChild(btn);
    });

    progressFill.style.width = ((idx / DATA.porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + DATA.porRonda;
    pintarEstrellas();

    /* Audio only plays if the user taps the "Listen" button (btnEscuchar) */
  }

  /* Extrae el texto visible de un option.html (puede llevar <span> internos) */
  function textoPlano(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent;
  }

  function mostrarExplicacion(esCorrecta) {
    var correcta = pregunta.opciones.filter(function (o) { return o.correcta; })[0];
    var texto = (esCorrecta ? App.i18n.t('explicacionCorrecta') : App.i18n.t('explicacionIncorrectaA')) +
      textoPlano(correcta.html) + '.';
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('oculto');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to look at the question/visual again.
     Only on the second mistake is the correct answer explained
     (mostrarExplicacion). */
  function mostrarPista() {
    explicacionEl.textContent = App.i18n.t('pista');
    explicacionWrap.classList.remove('oculto');
  }

  function responder(op, btn) {
    if (resuelto) return;
    if (op.correcta) {
      mostrarExplicacion(op.correcta);
      resuelto = true;
      btn.classList.add('correcta');
      App.feedback.success(feedbackEl);
      progreso.estrellas += 1;
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      App.utils.$$('#opciones .btn-opcion').forEach(function (b) { b.disabled = true; });
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else {
      intentos += 1;
      if (intentos === 1) {
        mostrarPista();
      } else {
        mostrarExplicacion(op.correcta);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
    }
  }

  function siguiente() {
    idx += 1;
    App.tts.stop();
    if (idx >= DATA.porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    mostrar(pantallaFinal);
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda)
      .replace('{actividad}', App.i18n.t('actividad.' + actividad.id + '.nombre'))
      .replace('{estrellas}', progreso.estrellas);
    App.feedback.celebrar(App.i18n.t('core.rondaCompletada'));

    var idxNivel = actividad.niveles.indexOf(nivel);
    var siguienteNivel = (aciertosRonda === DATA.porRonda && idxNivel !== -1 && idxNivel + 1 < actividad.niveles.length)
      ? actividad.niveles[idxNivel + 1] : null;
    var btnMasDificil = $('#btnMasDificil');
    if (siguienteNivel) {
      btnMasDificil.textContent = App.i18n.t('btnMasDificil').replace('{nombre}', App.i18n.t('nivel.' + siguienteNivel.id));
      btnMasDificil.classList.remove('oculto');
      btnMasDificil.onclick = function () { iniciarRonda(siguienteNivel); };
    } else {
      btnMasDificil.classList.add('oculto');
    }
  }

  /* ---- Eventos ---- */
  $('#btnInstruccion').addEventListener('click', function () {
    App.tts.speak($('#instruccion').textContent);
  });
  $('#btnInstruccionActividad').addEventListener('click', function () {
    App.tts.speak(App.i18n.t('actividad.' + actividad.id + '.instruccion') + App.i18n.t('instruccionExtra'));
  });
  $('#btnEscuchar').addEventListener('click', function () {
    App.tts.speak(pregunta ? (pregunta.hablar || pregunta.enunciado) : '');
  });
  btnSiguiente.addEventListener('click', siguiente);
  btnEscucharExplicacion.addEventListener('click', function () {
    App.tts.speak(explicacionEl.textContent);
  });
  $('#btnVolverMenu').addEventListener('click', function () { mostrar(pantallaMenu); });
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () { abrirActividad(actividad.id); });
  $('#btnOtraActividad').addEventListener('click', function () { mostrar(pantallaMenu); });

  $('#notaMonedero').innerHTML = App.i18n.t('notaMonedero')
    .replace('{link}', '<a href="../monedero/index.html">' + App.i18n.t('notaMonederoLink') + '</a>');

  pintarMenu();
  pintarEstrellas();
})();
