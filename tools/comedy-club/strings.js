/* ============================================================
   Apptonomia — Textos de Club de la Comedia / Comedy Club (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🎭 Club de la Comedia',
      instruccion: 'Lee el chiste. Después elige por qué es gracioso.',
      pregunta: '¿Por qué es gracioso?',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      explicacionCorrecta: '✅ ¡Correcto! Por eso es gracioso.',
      explicacionIncorrectaA: '❌ Esa no es la razón. La razón es: ',
      explicacionIncorrectaB: '',
      pista: '🤔 Prueba otra vez. Vuelve a leer el chiste: '
    },
    en: {
      title: '🎭 Comedy Club',
      instruccion: 'Read the joke. Then choose why it is funny.',
      pregunta: 'Why is it funny?',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      explicacionCorrecta: '✅ Correct! That is why it is funny.',
      explicacionIncorrectaA: '❌ That is not the reason. The reason is: ',
      explicacionIncorrectaB: '',
      pista: '🤔 Try again. Read the joke again: '
    }
  });
})();
