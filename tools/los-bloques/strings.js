/* ============================================================
   Apptonomia — Textos de Los Bloques / The Blocks (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🧱 Los Bloques',
      instruccion: 'Copia el modelo. Elige un color y toca las casillas para pintarlas igual.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      veces: 'veces',
      etiquetaModelo: 'Modelo',
      etiquetaTuyo: 'Tu construcción',
      eligeColor: 'Color elegido: {color}.',
      okBloque: '✅ ¡Correcto! Esa casilla es de ese color.',
      pistaColor: '🤔 Mira bien el modelo. ¿De qué color es esa casilla?',
      pistaVacia: '🤔 Mira bien el modelo. ¿Esa casilla tiene color?',
      malColor: '❌ Esa casilla es de color {color}. Ya está pintada.',
      malVacia: '❌ En el modelo esa casilla está vacía. No hay que pintarla.',
      construccionCompletada: '🎉 ¡Construcción completada!',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      ariaColor: 'Elegir color {color}',
      ariaCeldaVacia: 'Casilla sin pintar, fila {f}, columna {c}',
      ariaCeldaPintada: 'Casilla {color}, fila {f}, columna {c}'
    },
    en: {
      title: '🧱 The Blocks',
      instruccion: 'Copy the model. Choose a colour and touch the squares to paint them the same.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      veces: 'times',
      etiquetaModelo: 'Model',
      etiquetaTuyo: 'Your build',
      eligeColor: 'Chosen colour: {color}.',
      okBloque: '✅ Correct! That square is that colour.',
      pistaColor: '🤔 Look carefully at the model. What colour is that square?',
      pistaVacia: '🤔 Look carefully at the model. Does that square have a colour?',
      malColor: '❌ That square is {color}. It has been painted.',
      malVacia: '❌ In the model that square is empty. It does not need painting.',
      construccionCompletada: '🎉 Build complete!',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      ariaColor: 'Choose colour {color}',
      ariaCeldaVacia: 'Unpainted square, row {f}, column {c}',
      ariaCeldaPintada: '{color} square, row {f}, column {c}'
    }
  });
})();
