/* ============================================================
   Apptonomia — Textos de Sudoku Visual / Visual Sudoku (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🧩 Sudoku Visual',
      instruccion: 'Rellena los huecos. En cada fila, columna y caja no se puede repetir ningún dibujo.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      veces: 'veces',
      eligeHueco: 'Toca un hueco vacío.',
      eligeDibujo: 'Ahora toca el dibujo que falta.',
      explicacionCorrecta: '✅ ¡Correcto! Ese dibujo va ahí.',
      pista: '🤔 Prueba otra vez. Mira su fila y su columna: ¿qué dibujo no está todavía?',
      explicacionIncorrecta: '❌ Ahí va este dibujo: {picto}. Ya está colocado.',
      sudokuCompletado: '🎉 ¡Sudoku completado!',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      ariaHueco: 'Hueco vacío, fila {f}, columna {c}',
      ariaFija: '{picto}, fila {f}, columna {c}',
      ariaPaleta: 'Poner {picto}'
    },
    en: {
      title: '🧩 Visual Sudoku',
      instruccion: 'Fill in the gaps. No picture can repeat in a row, column or box.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      veces: 'times',
      eligeHueco: 'Touch an empty gap.',
      eligeDibujo: 'Now touch the missing picture.',
      explicacionCorrecta: '✅ Correct! That picture goes there.',
      pista: '🤔 Try again. Look at its row and column: which picture is not there yet?',
      explicacionIncorrecta: '❌ This picture goes there: {picto}. It has been placed.',
      sudokuCompletado: '🎉 Sudoku complete!',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      ariaHueco: 'Empty gap, row {f}, column {c}',
      ariaFija: '{picto}, row {f}, column {c}',
      ariaPaleta: 'Place {picto}'
    }
  });
})();
