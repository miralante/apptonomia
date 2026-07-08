/* ============================================================
   Apptonomia — Textos de ¿Qué no encaja? (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🔎 ¿Qué no encaja?',
      instruccion: 'Mira los tres dibujos. Toca el que no va con los demás.',
      instruccionExtra: ' Primero elige el nivel.',
      tituloNiveles: 'Elige el nivel',
      pregunta: '¿Cuál no encaja?',
      otroNivel: 'Elegir otro nivel',
      dibujoAria: 'Dibujo',
      veces: '{n} veces',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      nivel1Nombre: 'Nivel 1', nivel1Desc: 'Grupos muy distintos',
      nivel2Nombre: 'Nivel 2', nivel2Desc: 'Grupos parecidos',
      nivel3Nombre: 'Nivel 3', nivel3Desc: 'Grupos con relación fina',
      rondaCompletadaTitulo: '¡Ronda completada!',
      explicacionCorrecta: '✅ ¡Correcto! Ese es el que no encaja con los demás.',
      explicacionIncorrectaA: '❌ Ese sí encaja con los demás. El que no encaja es: ',
      pista: '🤔 Prueba otra vez. Mira los tres dibujos con calma.'
    },
    en: {
      title: "🔎 Which one doesn't belong?",
      instruccion: 'Look at the three pictures. Touch the one that is different.',
      instruccionExtra: ' First, choose a level.',
      tituloNiveles: 'Choose a level',
      pregunta: "Which one doesn't belong?",
      otroNivel: 'Choose another level',
      dibujoAria: 'Picture',
      veces: '{n} times',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      nivel1Nombre: 'Level 1', nivel1Desc: 'Very different groups',
      nivel2Nombre: 'Level 2', nivel2Desc: 'Similar groups',
      nivel3Nombre: 'Level 3', nivel3Desc: 'Groups with a finer link',
      rondaCompletadaTitulo: 'Round complete!',
      explicacionCorrecta: "✅ Correct! That one doesn't belong with the others.",
      explicacionIncorrectaA: '❌ That one does belong with the others. The odd one out is: ',
      pista: '🤔 Try again. Look calmly at the three pictures.'
    }
  });
})();
