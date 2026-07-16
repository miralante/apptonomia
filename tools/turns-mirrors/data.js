/* ============================================================
   Datos: Giros y Espejos (memoria/atención — percepción viso-espacial:
   rotación mental, reflejos e inversiones de grafías).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, tipo, nombre, descripcion, items }] }
   'tipo' controla la mecánica (misma clave en ambos idiomas):
     'giro'   → items: [{ picto, distractores: [picto, picto] }]
                El modelo se muestra derecho; la opción correcta es el
                MISMO picto girado (90/180/270 al azar); las incorrectas
                son otros pictos también girados.
     'espejo' → items: [{ picto }]
                Correcta = el picto reflejado en horizontal (scaleX -1);
                incorrectas = el picto sin reflejar y reflejado en
                vertical. Pictos siempre asimétricos para que se note.
     'letras' → items: [{ modelo, opciones: [3 letras], correcta: 0 }]
                Grafías simétricas (b/d/p/q, n/u, M/W, 6/9): tocar la
                letra idéntica al modelo entre sus letras espejo.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es el tipo de transformación a discriminar (girado → espejo →
   letras espejo). Siempre 1 modelo y 3 opciones (regla 11).
   Los pictos son iguales en ambos idiomas; solo se traducen los
   textos de nivel. app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
(function () {
  'use strict';

  var GIRO = [
    { picto: '✈️', distractores: ['🚁', '🚗'] },
    { picto: '🚗', distractores: ['🚌', '🚲'] },
    { picto: '🐘', distractores: ['🐕', '🐄'] },
    { picto: '🦆', distractores: ['🐦', '🐔'] },
    { picto: '🐟', distractores: ['🐬', '🦈'] },
    { picto: '🔑', distractores: ['🔧', '✏️'] },
    { picto: '✏️', distractores: ['🖊️', '🔑'] },
    { picto: '👟', distractores: ['🥾', '🧦'] },
    { picto: '🚲', distractores: ['🛵', '🚗'] },
    { picto: '🐢', distractores: ['🐊', '🦎'] },
    { picto: '🚌', distractores: ['🚗', '🚚'] },
    { picto: '☕', distractores: ['🍺', '🥤'] }
  ];

  var ESPEJO = [
    { picto: '✈️' }, { picto: '🚗' }, { picto: '🐘' }, { picto: '🦆' },
    { picto: '🐟' }, { picto: '🔑' }, { picto: '✏️' }, { picto: '👟' },
    { picto: '🚲' }, { picto: '🐢' }, { picto: '🛵' }, { picto: '☕' }
  ];

  var LETRAS = [
    { modelo: 'b', opciones: ['b', 'd', 'p'], correcta: 0 },
    { modelo: 'd', opciones: ['d', 'b', 'q'], correcta: 0 },
    { modelo: 'p', opciones: ['p', 'q', 'b'], correcta: 0 },
    { modelo: 'q', opciones: ['q', 'p', 'd'], correcta: 0 },
    { modelo: 'n', opciones: ['n', 'u', 'm'], correcta: 0 },
    { modelo: 'u', opciones: ['u', 'n', 'v'], correcta: 0 },
    { modelo: 'M', opciones: ['M', 'W', 'N'], correcta: 0 },
    { modelo: 'W', opciones: ['W', 'M', 'V'], correcta: 0 },
    { modelo: '6', opciones: ['6', '9', '8'], correcta: 0 },
    { modelo: '9', opciones: ['9', '6', '8'], correcta: 0 }
  ];

  window.DATA = {
    es: {
      porRonda: 8,
      niveles: [
        { id: 1, tipo: 'giro', nombre: 'Nivel 1', descripcion: 'Figuras giradas', items: GIRO },
        { id: 2, tipo: 'espejo', nombre: 'Nivel 2', descripcion: 'Reflejos en el espejo', items: ESPEJO },
        { id: 3, tipo: 'letras', nombre: 'Nivel 3', descripcion: 'Letras que se parecen', items: LETRAS }
      ]
    },
    en: {
      porRonda: 8,
      niveles: [
        { id: 1, tipo: 'giro', nombre: 'Level 1', descripcion: 'Rotated shapes', items: GIRO },
        { id: 2, tipo: 'espejo', nombre: 'Level 2', descripcion: 'Mirror reflections', items: ESPEJO },
        { id: 3, tipo: 'letras', nombre: 'Level 3', descripcion: 'Look-alike letters', items: LETRAS }
      ]
    }
  };
})();
