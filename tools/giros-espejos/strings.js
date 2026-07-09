/* ============================================================
   Apptonomia — Textos de Giros y Espejos / Turns and Mirrors (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🔄 Giros y Espejos',
      instruccion: 'Mira el modelo. Toca la opción correcta.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      veces: 'veces',
      modelo: 'Modelo',
      preguntaGiro: 'Toca el dibujo igual al modelo, aunque esté girado.',
      preguntaEspejo: 'Toca el dibujo como se ve en un espejo.',
      preguntaLetras: 'Toca la letra igual al modelo.',
      okGiro: '✅ ¡Correcto! Es el mismo dibujo, aunque esté girado.',
      okEspejo: '✅ ¡Correcto! En el espejo, el dibujo mira al lado contrario.',
      okLetras: '✅ ¡Correcto! Es la misma letra.',
      pistaGiro: '🤔 Gira el dibujo con la imaginación. ¿Cuál tiene la misma forma que el modelo?',
      pistaEspejo: '🤔 Mira hacia dónde mira el modelo. En un espejo miraría al lado contrario.',
      pistaLetras: '🤔 Mira hacia dónde mira la barriga de la letra.',
      malGiro: '❌ Ese es otro dibujo. El igual al modelo es el que está marcado.',
      malEspejo: '❌ Ese no es el reflejo. El reflejo es el que está marcado.',
      malLetras: '❌ Esa es otra letra. La letra igual es: {letra}. Está marcada.',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      ariaOpcion: 'Opción {n}'
    },
    en: {
      title: '🔄 Turns and Mirrors',
      instruccion: 'Look at the model. Touch the right option.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      veces: 'times',
      modelo: 'Model',
      preguntaGiro: 'Touch the picture that matches the model, even though it is turned.',
      preguntaEspejo: 'Touch the picture as it looks in a mirror.',
      preguntaLetras: 'Touch the letter that matches the model.',
      okGiro: '✅ Correct! It is the same picture, even though it is turned.',
      okEspejo: '✅ Correct! In the mirror, the picture faces the other way.',
      okLetras: '✅ Correct! It is the same letter.',
      pistaGiro: '🤔 Turn the picture in your imagination. Which one has the same shape as the model?',
      pistaEspejo: '🤔 Look at which way the model faces. In a mirror it would face the other way.',
      pistaLetras: '🤔 Look at which way the round part of the letter faces.',
      malGiro: '❌ That is a different picture. The one that matches the model is marked.',
      malEspejo: '❌ That is not the reflection. The reflection is marked.',
      malLetras: '❌ That is a different letter. The matching letter is: {letra}. It is marked.',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      ariaOpcion: 'Option {n}'
    }
  });
})();
