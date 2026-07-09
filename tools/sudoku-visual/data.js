/* ============================================================
   Datos: Sudoku Visual (razonamiento — lógica sin números).
   Tablero 4×4 con bloques 2×2 y pictos en vez de números: cada
   fila, columna y bloque debe tener los 4 pictos sin repetir.
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, temas: [ [picto ×4] ], soluciones: [ [16 índices 0-3] ],
     niveles: [{ id, nombre, descripcion, huecos }] }
   'soluciones' son cuadrículas YA resueltas y válidas (fila a fila);
   cada partida elige una solución y un tema al azar y vacía 'huecos'
   casillas. La persona rellena comparando contra esa solución, así
   nunca hay callejones sin salida.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es el número de huecos que hay que rellenar (4 → 6 → 8). El tamaño
   del tablero, los bloques y los pictos no cambian nunca.
   'temas' y 'soluciones' son iguales en ambos idiomas (pictos y
   posiciones no se traducen); solo cambian los textos de los niveles.
   Para ampliar: añadir cuadrículas a 'soluciones' o temas nuevos.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
(function () {
  'use strict';

  var TEMAS = [
    ['🍎', '🍌', '🍇', '🍓'],
    ['🐶', '🐱', '🐭', '🐰'],
    ['🔵', '🔶', '⭐', '❤️'],
    ['☀️', '🌙', '⛅', '🌈']
  ];

  /* Cuadrículas 4×4 resueltas (índices 0-3 sobre el tema), fila a fila.
     Todas cumplen: sin repetir en fila, columna ni bloque 2×2. */
  var SOLUCIONES = [
    [0, 1, 2, 3,
     2, 3, 0, 1,
     1, 0, 3, 2,
     3, 2, 1, 0],
    [1, 2, 3, 0,
     3, 0, 1, 2,
     0, 1, 2, 3,
     2, 3, 0, 1],
    [2, 0, 3, 1,
     3, 1, 2, 0,
     0, 2, 1, 3,
     1, 3, 0, 2],
    [3, 2, 1, 0,
     1, 0, 3, 2,
     0, 1, 2, 3,
     2, 3, 0, 1],
    [0, 3, 1, 2,
     1, 2, 0, 3,
     3, 0, 2, 1,
     2, 1, 3, 0],
    [2, 1, 0, 3,
     0, 3, 2, 1,
     3, 0, 1, 2,
     1, 2, 3, 0]
  ];

  window.DATA = {
    es: {
      porRonda: 3,
      temas: TEMAS,
      soluciones: SOLUCIONES,
      niveles: [
        { id: 1, nombre: 'Nivel 1', descripcion: '4 huecos', huecos: 4 },
        { id: 2, nombre: 'Nivel 2', descripcion: '6 huecos', huecos: 6 },
        { id: 3, nombre: 'Nivel 3', descripcion: '8 huecos', huecos: 8 }
      ]
    },
    en: {
      porRonda: 3,
      temas: TEMAS,
      soluciones: SOLUCIONES,
      niveles: [
        { id: 1, nombre: 'Level 1', descripcion: '4 gaps', huecos: 4 },
        { id: 2, nombre: 'Level 2', descripcion: '6 gaps', huecos: 6 },
        { id: 3, nombre: 'Level 3', descripcion: '8 gaps', huecos: 8 }
      ]
    }
  };
})();
