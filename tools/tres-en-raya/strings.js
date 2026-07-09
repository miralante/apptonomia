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
      btnOtroNivel: 'Elegir otro nivel'
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
      btnOtroNivel: 'Choose another level'
    }
  });
})();
