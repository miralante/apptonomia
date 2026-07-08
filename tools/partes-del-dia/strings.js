/* ============================================================
   Apptonomia — Textos de Partes del Día / Times of Day (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🌗 Partes del Día',
      instruccion: 'Mira la tarea. Toca la caja del momento del día correcto.',
      elegirNivel: 'Elige el nivel',
      escucharMomento: 'Escuchar: {momento}',
      veces: '({n} veces)',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      elegirOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Va en ese momento del día.',
      explicacionIncorrectaA: '❌ Ese no es el momento. Va en: ',
      pista: '🤔 Prueba otra vez. Piensa cuándo se hace esa tarea normalmente.'
    },
    en: {
      title: '🌗 Times of Day',
      instruccion: 'Look at the task. Touch the box for the right time of day.',
      elegirNivel: 'Choose a level',
      escucharMomento: 'Listen: {momento}',
      veces: '({n} times)',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      elegirOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! That is the right time of day.',
      explicacionIncorrectaA: '❌ That is not the right time. It goes in: ',
      pista: '🤔 Try again. Think about when you normally do that task.'
    }
  });
})();
