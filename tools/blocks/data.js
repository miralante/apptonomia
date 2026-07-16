/* ============================================================
   Datos: Los Bloques (memoria/atención — construcción viso-espacial
   tipo tetris/bloques: copiar un modelo en una cuadrícula).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, colores: { R, B, Y } (nombre hablado de cada color),
     niveles: [{ id, nombre, descripcion, modelos: string[] }] }
   Cada modelo es un string de 16 caracteres (cuadrícula 4×4, fila a
   fila): '.' = casilla vacía, 'R' = rojo, 'B' = azul, 'Y' = amarillo.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es el número de bloques de color del modelo (4 → 6 → 8). La
   cuadrícula (4×4) y la paleta (3 colores) no cambian nunca.
   Los modelos son iguales en ambos idiomas; solo se traducen los
   textos. app.js usa DATA[App.i18n.locale()] || DATA.es.
   Para ampliar: añadir strings de 16 caracteres con el número de
   bloques exacto del nivel.
   ============================================================ */
(function () {
  'use strict';

  /* 4 bloques */
  var MODELOS_1 = [
    'RRRR............',
    'B...B...B...B...',
    'YY..YY..........',
    '....RR....RR....',
    '.B...B...B...B..',
    'Y..Y........Y..Y'
  ];

  /* 6 bloques */
  var MODELOS_2 = [
    'R...R...R...RRR.',
    'BBBB.B...B......',
    '.YY.YYYY........',
    'RR...RR...RR....',
    'BB..B.B.BB......',
    '.Y..YYY..Y...Y..'
  ];

  /* 8 bloques */
  var MODELOS_3 = [
    'RRRRRRRR........',
    'BBBBB..BB..B....',
    'Y.Y..Y.YY.Y..Y.Y',
    'R..RRRRRR..R....',
    'YY...YY...YY..YY',
    'RRBBRRBB........'
  ];

  window.DATA = {
    es: {
      porRonda: 3,
      colores: { R: 'rojo', B: 'azul', Y: 'amarillo' },
      niveles: [
        { id: 1, nombre: 'Nivel 1', descripcion: '4 bloques', modelos: MODELOS_1 },
        { id: 2, nombre: 'Nivel 2', descripcion: '6 bloques', modelos: MODELOS_2 },
        { id: 3, nombre: 'Nivel 3', descripcion: '8 bloques', modelos: MODELOS_3 }
      ]
    },
    en: {
      porRonda: 3,
      colores: { R: 'red', B: 'blue', Y: 'yellow' },
      niveles: [
        { id: 1, nombre: 'Level 1', descripcion: '4 blocks', modelos: MODELOS_1 },
        { id: 2, nombre: 'Level 2', descripcion: '6 blocks', modelos: MODELOS_2 },
        { id: 3, nombre: 'Level 3', descripcion: '8 blocks', modelos: MODELOS_3 }
      ]
    }
  };
})();
