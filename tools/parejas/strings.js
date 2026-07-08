/* ============================================================
   Apptonomia — Textos de Parejas (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🃏 Parejas',
      instruccion: 'Busca las dos cartas iguales. Toca una carta para verla.',
      instruccionExtra: ' Primero elige el nivel.',
      tituloNiveles: 'Elige el nivel',
      nivelFacil: 'Fácil',
      nivelMedio: 'Medio',
      nivelDificil: 'Difícil',
      nivelParejas: '{n} parejas',
      veces: '{n} veces',
      tableroAria: 'Tablero de cartas',
      cartaTapada: 'Carta tapada',
      cartaConSimbolo: 'Carta con {picto}',
      contador: '{n} de {total} parejas',
      finalTitulo: '¡Lo has conseguido!',
      resumenFinalUna: 'Has encontrado todas las parejas. Ganas 1 estrella.',
      resumenFinalVarias: 'Has encontrado todas las parejas. Ganas {n} estrellas.',
      celebrarTexto: '¡Todas las parejas!',
      otroNivel: 'Elegir otro nivel'
    },
    en: {
      title: '🃏 Pairs',
      instruccion: 'Find the two matching cards. Touch a card to see it.',
      instruccionExtra: ' First, choose a level.',
      tituloNiveles: 'Choose a level',
      nivelFacil: 'Easy',
      nivelMedio: 'Medium',
      nivelDificil: 'Hard',
      nivelParejas: '{n} pairs',
      veces: '{n} times',
      tableroAria: 'Card board',
      cartaTapada: 'Card face down',
      cartaConSimbolo: 'Card showing {picto}',
      contador: '{n} of {total} pairs',
      finalTitulo: 'You did it!',
      resumenFinalUna: 'You found all the pairs. You win 1 star.',
      resumenFinalVarias: 'You found all the pairs. You win {n} stars.',
      celebrarTexto: 'All the pairs!',
      otroNivel: 'Choose another level'
    }
  });
})();
