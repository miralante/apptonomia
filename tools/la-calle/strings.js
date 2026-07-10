/* ============================================================
   Apptonomia — Textos de La Calle / The Street (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🚸 La Calle',
      instruccion: 'Lee la situación. Elige qué es más seguro.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      pregunta: '¿Qué haces?',
      veces: 'veces',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Eso es lo más seguro.',
      explicacionIncorrectaA: '❌ Eso no es lo más seguro. Lo correcto es: ',
      pista: '🤔 Prueba otra vez. Piensa en la situación: '
    },
    en: {
      title: '🚸 The Street',
      instruccion: 'Read the situation. Choose what is safest.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      pregunta: 'What do you do?',
      veces: 'times',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! That is the safest thing to do.',
      explicacionIncorrectaA: '❌ That is not the safest. The right answer is: ',
      pista: '🤔 Try again. Think about the situation: '
    }
  });
})();
