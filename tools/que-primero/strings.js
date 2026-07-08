/* ============================================================
   Apptonomia — Textos de ¿Qué hago primero? / What Do I Do First? (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '📝 ¿Qué hago primero?',
      instruccion: 'Lee la situación. Elige qué harías primero.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      pregunta: '¿Qué haces primero?',
      veces: 'veces',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Eso es lo que hay que hacer primero.',
      explicacionIncorrectaA: '❌ Eso no es lo primero. Lo primero es: ',
      pista: '🤔 Prueba otra vez. Vuelve a pensar en la situación: '
    },
    en: {
      title: '📝 What Do I Do First?',
      instruccion: 'Read the situation. Choose what you would do first.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      pregunta: 'What do you do first?',
      veces: 'times',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! That is what you should do first.',
      explicacionIncorrectaA: '❌ That is not first. The first thing is: ',
      pista: '🤔 Try again. Think about the situation again: '
    }
  });
})();
