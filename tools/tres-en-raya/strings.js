/* ============================================================
   Apptonomia — Textos de Tres en Raya / Tic-Tac-Toe (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '⭕ Tres en Raya',
      instruccion: 'Tú eres ❌. Haz una línea de tres antes que el rival. Toca una casilla vacía.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      veces: 'victorias',
      teToca: 'Te toca. Toca una casilla vacía.',
      piensaRival: 'El rival piensa…',
      hasGanado: '🎉 ¡Has ganado! Tres en raya.',
      empate: '🤝 ¡Empate! Muy bien jugado.',
      haGanadoRival: 'El rival hizo su línea. ¡Casi! Fíjate en sus fichas para taparle el camino.',
      jugarOtraVez: 'Jugar otra vez',
      casillaVacia: 'Casilla vacía',
      casillaTuya: 'Tu ficha',
      casillaRival: 'Ficha del rival',
      fila: 'fila {f}, columna {c}',
      resumenNivel: 'Victorias en este nivel: {n}',
      btnOtroNivel: 'Elegir otro nivel',
      btnAyuda: '💡 Ayuda',
      ariaEscucharAyuda: 'Escuchar la ayuda',
      ayudaGanas1: 'Mira tus fichas ❌. Tienes dos en línea. ¿Qué casilla te falta para hacer tres en raya?',
      ayudaGanas2: 'Toca la casilla marcada: completas tu línea de tres y ganas.',
      ayudaTapa1: 'Mira las fichas del rival ⭕. Tiene dos en línea. ¿Qué pasa si no le tapas el hueco?',
      ayudaTapa2: 'Toca la casilla marcada: así le tapas la línea al rival.',
      ayudaCentro1: 'Hay una casilla que toca más líneas que ninguna otra. ¿Cuál crees que es?',
      ayudaCentro2: 'Toca el centro: desde ahí puedes hacer línea de cuatro maneras distintas.',
      ayudaEsquina1: 'Las esquinas tocan tres líneas cada una. ¿Hay alguna esquina libre?',
      ayudaEsquina2: 'Toca la esquina marcada: participa en tres líneas posibles.',
      ayudaLibre1: 'Mira las casillas libres. ¿Cuál te ayuda a juntar tus fichas en línea?',
      ayudaLibre2: 'Toca la casilla marcada y sigue juntando tus fichas en línea.'
    },
    en: {
      title: '⭕ Tic-Tac-Toe',
      instruccion: 'You are ❌. Make a line of three before your rival. Touch an empty square.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      veces: 'wins',
      teToca: 'Your turn. Touch an empty square.',
      piensaRival: 'Your rival is thinking…',
      hasGanado: '🎉 You won! Three in a row.',
      empate: '🤝 A draw! Very well played.',
      haGanadoRival: 'Your rival made their line. So close! Watch their pieces to block their path.',
      jugarOtraVez: 'Play again',
      casillaVacia: 'Empty square',
      casillaTuya: 'Your piece',
      casillaRival: "Rival's piece",
      fila: 'row {f}, column {c}',
      resumenNivel: 'Wins at this level: {n}',
      btnOtroNivel: 'Choose another level',
      btnAyuda: '💡 Help',
      ariaEscucharAyuda: 'Listen to the help',
      ayudaGanas1: 'Look at your ❌ pieces. You have two in a line. Which square is missing for three in a row?',
      ayudaGanas2: 'Touch the marked square: you complete your line of three and win.',
      ayudaTapa1: "Look at your rival's ⭕ pieces. They have two in a line. What happens if you don't cover the gap?",
      ayudaTapa2: "Touch the marked square: you block your rival's line.",
      ayudaCentro1: 'One square touches more lines than any other. Which one do you think it is?',
      ayudaCentro2: 'Touch the centre: from there you can make a line in four different ways.',
      ayudaEsquina1: 'Corners touch three lines each. Is any corner free?',
      ayudaEsquina2: 'Touch the marked corner: it is part of three possible lines.',
      ayudaLibre1: 'Look at the free squares. Which one helps you join your pieces in a line?',
      ayudaLibre2: 'Touch the marked square and keep joining your pieces in a line.'
    }
  });
})();
