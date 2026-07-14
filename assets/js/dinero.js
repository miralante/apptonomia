/* ==========================================================================
   Apptonomia — Dinero visual compartido (euros dibujados con CSS)
   Expone window.App.dinero: el catálogo de monedas y billetes y los
   helpers de formato/habla que usan las herramientas de dinero
   (El Monedero, La Tienda). Las clases CSS (.dinero, .m5c … .b50e,
   .mesa-dinero) viven en assets/css/components.css.
   Los importes SIEMPRE en céntimos (enteros): evita errores de coma
   flotante. Requiere i18n.js (cargar tras feedback.js, antes del
   strings.js de la herramienta).
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  /* Textos propios del módulo (namespace dinero.*), como hace
     i18n.js con core.* y feedback.*. */
  App.i18n.register({
    es: {
      dinero: {
        euro: 'euro',
        euros: 'euros',
        centimos: 'céntimos',
        y: 'y',
        cts: 'cts',
        monedaDe: 'Moneda de {v}',
        billeteDe: 'Billete de {v}',
        unaMonedaDe: '1 moneda de {v}',
        variasMonedasDe: '{n} monedas de {v}',
        unBilleteDe: '1 billete de {v}',
        variosBilletesDe: '{n} billetes de {v}'
      }
    },
    en: {
      dinero: {
        euro: 'euro',
        euros: 'euros',
        centimos: 'cents',
        y: 'and',
        cts: 'cts',
        monedaDe: '{v} coin',
        billeteDe: '{v} banknote',
        unaMonedaDe: '1 coin of {v}',
        variasMonedasDe: '{n} coins of {v}',
        unBilleteDe: '1 banknote of {v}',
        variosBilletesDe: '{n} banknotes of {v}'
      }
    }
  });

  /* Catálogo: una entrada por denominación (sin 1 y 2 céntimos:
     carga cognitiva; los importes van en múltiplos de 5, como el
     redondeo real). La clase css la dibuja components.css. */
  var CATALOGO = [
    { cent: 5, tipo: 'moneda', css: 'm5c' },
    { cent: 10, tipo: 'moneda', css: 'm10c' },
    { cent: 20, tipo: 'moneda', css: 'm20c' },
    { cent: 50, tipo: 'moneda', css: 'm50c' },
    { cent: 100, tipo: 'moneda', css: 'm1e' },
    { cent: 200, tipo: 'moneda', css: 'm2e' },
    { cent: 500, tipo: 'billete', css: 'b5e' },
    { cent: 1000, tipo: 'billete', css: 'b10e' },
    { cent: 2000, tipo: 'billete', css: 'b20e' },
    { cent: 5000, tipo: 'billete', css: 'b50e' }
  ];

  function info(cent) {
    return CATALOGO.filter(function (d) { return d.cent === cent; })[0];
  }

  /* "2 €" / "50 cts" — etiqueta corta impresa en la ficha. */
  function etiqueta(cent) {
    return cent >= 100 ? (cent / 100) + ' €' : cent + ' ' + App.i18n.t('dinero.cts');
  }

  /* "1,50 €" — importe con el separador del idioma activo. */
  function formatear(cent) {
    var sep = App.i18n.locale() === 'en' ? '.' : ',';
    return (cent / 100).toFixed(2).replace('.', sep) + ' €';
  }

  /* "2 euros y 50 céntimos" — para hablar y para las pistas. */
  function hablado(cent) {
    var e = Math.floor(cent / 100);
    var c = cent % 100;
    var textoE = e === 1 ? '1 ' + App.i18n.t('dinero.euro') : e + ' ' + App.i18n.t('dinero.euros');
    var textoC = c + ' ' + App.i18n.t('dinero.centimos');
    if (e && c) return textoE + ' ' + App.i18n.t('dinero.y') + ' ' + textoC;
    if (e) return textoE;
    return textoC;
  }

  /* "Moneda de 2 euros" / "Billete de 5 euros" (aria). */
  function aria(cent) {
    var clave = info(cent).tipo === 'billete' ? 'dinero.billeteDe' : 'dinero.monedaDe';
    return App.i18n.t(clave).replace('{v}', hablado(cent));
  }

  /* Crea la ficha visual (span decorativo o botón interactivo). */
  function crearFicha(cent, interactiva) {
    var d = info(cent);
    var el = document.createElement(interactiva ? 'button' : 'span');
    if (interactiva) el.type = 'button';
    el.className = 'dinero ' + d.tipo + ' ' + d.css;
    el.textContent = etiqueta(cent);
    return el;
  }

  /* Descompone un importe en fichas, de mayor a menor (greedy). */
  function descomponer(cent) {
    var piezas = [];
    var restante = cent;
    CATALOGO.slice().sort(function (a, b) { return b.cent - a.cent; }).forEach(function (d) {
      while (restante >= d.cent) {
        piezas.push(d.cent);
        restante -= d.cent;
      }
    });
    return piezas;
  }

  /* "2 monedas de 1 euro y 1 billete de 5 euros" — desglose para
     explicaciones (regla 11), generado del propio caso. */
  function desglose(piezas) {
    var grupos = [];
    piezas.forEach(function (cent) {
      var g = grupos.filter(function (x) { return x.cent === cent; })[0];
      if (g) g.n += 1;
      else grupos.push({ cent: cent, n: 1 });
    });
    var partes = grupos.map(function (g) {
      var billete = info(g.cent).tipo === 'billete';
      var clave = g.n === 1 ? (billete ? 'dinero.unBilleteDe' : 'dinero.unaMonedaDe')
        : (billete ? 'dinero.variosBilletesDe' : 'dinero.variasMonedasDe');
      return App.i18n.t(clave).replace('{n}', g.n).replace('{v}', hablado(g.cent));
    });
    if (partes.length === 1) return partes[0];
    return partes.slice(0, -1).join(', ') + ' ' + App.i18n.t('dinero.y') + ' ' + partes[partes.length - 1];
  }

  /* Pinta fichas decorativas dentro de un contenedor (lo vacía). */
  function pintarFichas(contenedor, piezas) {
    contenedor.innerHTML = '';
    (piezas || []).forEach(function (cent) {
      var ficha = crearFicha(cent, false);
      ficha.setAttribute('role', 'img');
      ficha.setAttribute('aria-label', aria(cent));
      contenedor.appendChild(ficha);
    });
  }

  window.App.dinero = {
    CATALOGO: CATALOGO,
    info: info,
    etiqueta: etiqueta,
    formatear: formatear,
    hablado: hablado,
    aria: aria,
    crearFicha: crearFicha,
    descomponer: descomponer,
    desglose: desglose,
    pintarFichas: pintarFichas
  };
})();
