/* ============================================================
   Apptonomia — Textos de Situaciones / Situations (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🤔 Situaciones',
      instruccion: 'Lee la situación. Elige qué harías.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      pregunta: '¿Qué haces?',
      veces: 'veces',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Ante esta situación, eso es lo mejor.',
      explicacionIncorrectaA: '❌ Eso no es lo mejor en esta situación. Lo mejor es: ',
      pista: '🤔 Prueba otra vez. Vuelve a pensar en la situación: '
    },
    en: {
      title: '🤔 Situations',
      instruccion: 'Read the situation. Choose what you would do.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      pregunta: 'What do you do?',
      veces: 'times',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! That is the best thing to do here.',
      explicacionIncorrectaA: '❌ That is not the best choice here. The best choice is: ',
      pista: '🤔 Try again. Think about the situation again: '
    }
  });
})();
