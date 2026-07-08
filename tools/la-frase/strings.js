/* ============================================================
   Apptonomia — Textos de La Frase / The Sentence (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '📝 La Frase',
      instruccion: 'Lee la frase. Después responde a la pregunta.',
      instruccionCompleta: 'Lee la frase. Después responde a la pregunta. Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      veces: '({n} veces)',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      elegirOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Lo dice la frase: ',
      explicacionIncorrectaA: '❌ No. La respuesta correcta es: ',
      pista: '🤔 Prueba otra vez. Vuelve a leer la frase: '
    },
    en: {
      title: '📝 The Sentence',
      instruccion: 'Read the sentence. Then answer the question.',
      instruccionCompleta: 'Read the sentence. Then answer the question. First choose a level.',
      elegirNivel: 'Choose a level',
      veces: '({n} times)',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      elegirOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! The sentence says: ',
      explicacionIncorrectaA: '❌ No. The correct answer is: ',
      pista: '🤔 Try again. Read the sentence again: '
    }
  });
})();
