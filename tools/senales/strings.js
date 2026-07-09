/* ============================================================
   Apptonomia — Textos de Señales / Signs (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🚦 Señales',
      instruccion: 'Observa la señal. Elige qué significa o a dónde lleva.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      pregunta: '¿Qué significa esta señal?',
      veces: 'veces',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Eso es lo que significa esta señal.',
      explicacionIncorrectaA: '❌ No es eso. Esta señal significa: ',
      pista: '🤔 Prueba otra vez. Piensa bien qué indica esta señal: '
    },
    en: {
      title: '🚦 Signs',
      instruccion: 'Look at the sign. Choose what it means or where it leads.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      pregunta: 'What does this sign mean?',
      veces: 'times',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! That is what this sign means.',
      explicacionIncorrectaA: '❌ No, that is not it. This sign means: ',
      pista: '🤔 Try again. Think carefully about what this sign indicates: '
    }
  });
})();
