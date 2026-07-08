/* ============================================================
   Apptonomia — Textos de La Oca / The Goose Game (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🦢 La Oca',
      instruccion: 'Tira el dado y avanza por el tablero hasta llegar a la meta.',
      instruccionExtra: ' Primero elige el tablero.',
      tituloNiveles: 'Elige el tablero',
      tirarDado: 'Tirar el dado',
      finalTitulo: '¡Has llegado a la meta!',
      otroNivel: 'Elegir otro tablero',
      veces: '{n} veces',
      casillaActual: 'Casilla {n} de {total}',
      regalo: '🎁 ¡Regalo! Una estrella más.',
      meta: '¡Meta!',
      resumenFinal: 'Has llegado a la meta. Ahora tienes {total} estrellas.'
    },
    en: {
      title: '🦢 The Goose Game',
      instruccion: 'Roll the dice and move along the board until you reach the finish.',
      instruccionExtra: ' First, choose a board.',
      tituloNiveles: 'Choose a board',
      tirarDado: 'Roll the dice',
      finalTitulo: 'You reached the finish!',
      otroNivel: 'Choose another board',
      veces: '{n} times',
      casillaActual: 'Square {n} of {total}',
      regalo: '🎁 Gift! One more star.',
      meta: 'Finish!',
      resumenFinal: 'You reached the finish. You now have {total} stars.'
    }
  });
})();
