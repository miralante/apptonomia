/* ============================================================
   Apptonomia — Textos de Adivinanzas / Riddles (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🧩 Adivinanzas',
      instruccion: 'Lee la adivinanza. Después elige la respuesta.',
      pregunta: '¿Qué es?',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      explicacionCorrecta: '✅ ¡Correcto! La respuesta es: ',
      explicacionIncorrectaA: '❌ ',
      explicacionIncorrectaB: ' no es correcto. La respuesta correcta es: ',
      pista: '🤔 Prueba otra vez. Vuelve a leer la pista: '
    },
    en: {
      title: '🧩 Riddles',
      instruccion: 'Read the riddle. Then choose the answer.',
      pregunta: 'What is it?',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      explicacionCorrecta: '✅ Correct! The answer is: ',
      explicacionIncorrectaA: '❌ ',
      explicacionIncorrectaB: ' is not right. The correct answer is: ',
      pista: '🤔 Try again. Read the clue again: '
    }
  });
})();
