/* ============================================================
   Apptonomia — Textos de ¿Dónde lo guardo? / Where Do I Keep It? (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🗄️ ¿Dónde lo guardo?',
      instruccion: 'Mira el objeto. Toca la caja del sitio correcto.',
      elegirNivel: 'Elige el nivel',
      escucharCategoria: 'Escuchar: {categoria}',
      veces: '({n} veces)',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      elegirOtroNivel: 'Elegir otro nivel',
      explicacionCorrecta: '✅ ¡Correcto! Va en ese sitio.',
      explicacionIncorrectaA: '❌ Ese no es el sitio. Va en: ',
      pista: '🤔 Prueba otra vez. Piensa para qué sirve ese objeto.'
    },
    en: {
      title: '🗄️ Where Do I Keep It?',
      instruccion: 'Look at the object. Touch the box for the right place.',
      elegirNivel: 'Choose a level',
      escucharCategoria: 'Listen: {categoria}',
      veces: '({n} times)',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      elegirOtroNivel: 'Choose another level',
      explicacionCorrecta: '✅ Correct! That is the right place.',
      explicacionIncorrectaA: '❌ That is not the place. It goes in: ',
      pista: '🤔 Try again. Think about what that object is used for.'
    }
  });
})();
