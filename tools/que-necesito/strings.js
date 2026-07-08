/* ============================================================
   Apptonomia — Textos de ¿Qué necesito? / What Do I Need? (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🎒 ¿Qué necesito?',
      instruccion: 'Lee la tarea. Elige qué necesitas para hacerla.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      pregunta: '¿Qué necesitas?',
      veces: 'veces',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Eso es lo que necesitas.',
      explicacionIncorrectaA: '❌ Eso no es lo que necesitas. Necesitas: ',
      pista: '🤔 Prueba otra vez. Vuelve a leer la tarea: '
    },
    en: {
      title: '🎒 What Do I Need?',
      instruccion: 'Read the task. Choose what you need to do it.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      pregunta: 'What do you need?',
      veces: 'times',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! That is what you need.',
      explicacionIncorrectaA: '❌ That is not what you need. You need: ',
      pista: '🤔 Try again. Read the task again: '
    }
  });
})();
