/* ============================================================
   Apptonomia — Textos de Categorías / Categories (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🗂️ Categorías',
      instruccion: 'Mira la palabra. Toca la caja del grupo correcto.',
      elegirNivel: 'Elige el nivel',
      escucharCategoria: 'Escuchar: {categoria}',
      veces: '({n} veces)',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      elegirOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Va en ese grupo.',
      explicacionIncorrectaA: '❌ Ese no es el grupo. Va en: ',
      pista: '🤔 Prueba otra vez. Piensa bien de qué trata la palabra.'
    },
    en: {
      title: '🗂️ Categories',
      instruccion: 'Look at the word. Touch the box for the right group.',
      elegirNivel: 'Choose a level',
      escucharCategoria: 'Listen: {categoria}',
      veces: '({n} times)',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      elegirOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! That is the right group.',
      explicacionIncorrectaA: '❌ That is not the group. It goes in: ',
      pista: '🤔 Try again. Think carefully about what the word is.'
    }
  });
})();
