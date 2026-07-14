/* ============================================================
   Apptonomia — Textos de Cuatro en Raya / Four in a Row (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🟡 Cuatro en Raya',
      instruccion: 'Tú eres 🟡. Toca una columna: tu ficha cae hasta abajo. Haz una línea de cuatro antes que el rival.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      veces: 'victorias',
      ariaTablero: 'Tablero de cuatro en raya',
      ariaColumna: 'Columna {c}, {n} fichas',
      ariaColumnaLlena: 'Columna {c}, llena',
      teToca: 'Te toca. Toca una columna.',
      piensaRival: 'El rival piensa…',
      rivalPone: 'El rival pone su ficha en la columna {c}.',
      hasGanado: '🎉 ¡Has ganado! Cuatro en raya.',
      empate: '🤝 El tablero está lleno. ¡Empate! Muy bien jugado.',
      haGanadoRival: 'El rival hizo su línea de cuatro. ¡Casi! Fíjate en sus fichas para taparle el camino.',
      jugarOtraVez: 'Jugar otra vez',
      btnOtroNivel: 'Elegir otro nivel',
      btnAyuda: '💡 Ayuda',
      ariaEscucharAyuda: 'Escuchar la ayuda',
      ayudaGanas1: 'Mira tus fichas amarillas 🟡. Casi tienes cuatro en línea. ¿Qué columna te falta?',
      ayudaGanas2: 'Toca la columna marcada: completas tu línea de cuatro y ganas.',
      ayudaTapa1: 'Mira las fichas azules del rival 🔵. Casi tiene cuatro en línea. ¿Qué pasa si no le tapas?',
      ayudaTapa2: 'Toca la columna marcada: tu ficha le tapa la línea al rival.',
      ayudaCentro1: 'Las columnas del centro tocan más líneas que las de los lados. ¿Cuáles son?',
      ayudaCentro2: 'Toca la columna marcada, en el centro: desde ahí hay más maneras de hacer cuatro.',
      ayudaLibre1: 'Mira las columnas libres. ¿Cuál te ayuda a juntar tus fichas en línea?',
      ayudaLibre2: 'Toca la columna marcada y sigue juntando tus fichas en línea.'
    },
    en: {
      title: '🟡 Four in a Row',
      instruccion: 'You are 🟡. Touch a column: your piece falls to the bottom. Make a line of four before your rival.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      veces: 'wins',
      ariaTablero: 'Four in a row board',
      ariaColumna: 'Column {c}, {n} pieces',
      ariaColumnaLlena: 'Column {c}, full',
      teToca: 'Your turn. Touch a column.',
      piensaRival: 'Your rival is thinking…',
      rivalPone: 'Your rival drops a piece in column {c}.',
      hasGanado: '🎉 You won! Four in a row.',
      empate: '🤝 The board is full. A draw! Very well played.',
      haGanadoRival: 'Your rival made their line of four. So close! Watch their pieces to block their path.',
      jugarOtraVez: 'Play again',
      btnOtroNivel: 'Choose another level',
      btnAyuda: '💡 Help',
      ariaEscucharAyuda: 'Listen to the help',
      ayudaGanas1: 'Look at your yellow pieces 🟡. You almost have four in a line. Which column is missing?',
      ayudaGanas2: 'Touch the marked column: you complete your line of four and win.',
      ayudaTapa1: "Look at your rival's blue pieces 🔵. They almost have four in a line. What happens if you don't block?",
      ayudaTapa2: "Touch the marked column: your piece blocks your rival's line.",
      ayudaCentro1: 'The centre columns touch more lines than the side ones. Which are they?',
      ayudaCentro2: 'Touch the marked column, in the centre: from there, there are more ways to make four.',
      ayudaLibre1: 'Look at the free columns. Which one helps you join your pieces in a line?',
      ayudaLibre2: 'Touch the marked column and keep joining your pieces in a line.'
    }
  });
})();
