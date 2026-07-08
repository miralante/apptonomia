/* ============================================================
   Apptonomia — Textos de Palabras / Words (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🔤 Palabras',
      instruccion: 'Mira el dibujo. Elige la palabra correcta.',
      instruccionCompleta: 'Mira el dibujo. Elige la palabra correcta. Primero elige el tema.',
      elegirTema: 'Elige un tema',
      pregunta: '¿Cómo se llama?',
      veces: '({n} veces)',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      elegirOtroTema: 'Elegir otro tema',
      explicacionCorrecta: '✅ ¡Correcto! Así se llama.',
      explicacionIncorrectaA: '❌ No es esa palabra. Así se llama: ',
      pista: '🤔 Prueba otra vez. Escucha otra vez y mira bien el dibujo.'
    },
    en: {
      title: '🔤 Words',
      instruccion: 'Look at the picture. Choose the right word.',
      instruccionCompleta: 'Look at the picture. Choose the right word. First choose a topic.',
      elegirTema: 'Choose a topic',
      pregunta: 'What is it called?',
      veces: '({n} times)',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      elegirOtroTema: 'Choose another topic',
      explicacionCorrecta: '✅ Correct! That is its name.',
      explicacionIncorrectaA: '❌ That is not the word. It is called: ',
      pista: '🤔 Try again. Listen again and look closely at the picture.'
    }
  });
})();
