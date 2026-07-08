/* ============================================================
   Apptonomia — Textos de Dichos / Idioms (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: 'Dichos de España',
      instruccion: 'Lee el dicho. Después elige qué significa.',
      pregunta: '¿Qué significa?',
      rondaCompletadaTitulo: '¡Ronda completada!',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      explicacionCorrecta: '✅ ¡Correcto! Eso es lo que significa.',
      explicacionIncorrectaA: '❌ Eso no es lo que significa. El significado es: ',
      explicacionIncorrectaB: '',
      pista: '🤔 Prueba otra vez. Vuelve a leer el dicho: '
    },
    en: {
      title: 'English idioms',
      instruccion: 'Read the idiom. Then choose what it means.',
      pregunta: 'What does it mean?',
      rondaCompletadaTitulo: 'Round complete!',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      explicacionCorrecta: '✅ Correct! That is what it means.',
      explicacionIncorrectaA: '❌ That is not what it means. It means: ',
      explicacionIncorrectaB: '',
      pista: '🤔 Try again. Read the idiom again: '
    }
  });
})();
