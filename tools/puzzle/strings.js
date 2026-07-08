/* ============================================================
   Apptonomia — Textos de Puzzle (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🧩 Puzzle',
      instruccion: 'Mira el modelo. Toca una pieza y después toca su sitio en el tablero.',
      instruccionExtra: ' Primero elige el nivel.',
      tituloNiveles: 'Elige el nivel',
      etiquetaModelo: 'Modelo',
      etiquetaTablero: 'Tu tablero',
      etiquetaPiezas: 'Piezas',
      piezaAria: 'Pieza',
      otroNivel: 'Elegir otro nivel',
      veces: '{n} veces',
      resumenFinal: 'Has completado {n} puzles. Ahora tienes {total} estrellas.'
    },
    en: {
      title: '🧩 Puzzle',
      instruccion: 'Look at the model. Touch a piece, then touch its place on the board.',
      instruccionExtra: ' First, choose a level.',
      tituloNiveles: 'Choose a level',
      etiquetaModelo: 'Model',
      etiquetaTablero: 'Your board',
      etiquetaPiezas: 'Pieces',
      piezaAria: 'Piece',
      otroNivel: 'Choose another level',
      veces: '{n} times',
      resumenFinal: 'You completed {n} puzzles. You now have {total} stars.'
    }
  });
})();
