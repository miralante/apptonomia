/* ============================================================
   Apptonomia — Textos de El Teatro / The Theatre (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🎭 El Teatro',
      instruccion: 'Monta la escena. Pon cada personaje donde diga la frase.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      veces: 'veces',
      consigna: 'Pon {pers} {rel} {ref}.',
      rel_delante: 'delante',
      rel_detras: 'detrás',
      pistaDelante: '🤔 Busca {ref}. Delante es la fila de abajo, la más cerca de ti.',
      pistaDetras: '🤔 Busca {ref}. Detrás es la fila de arriba, al fondo.',
      malSitio: '❌ El sitio correcto está marcado: {rel} {ref}. Toca ahí.',
      okSitio: '✅ ¡Muy bien! {pers} está {rel} {ref}.',
      escenaCompletada: '🎭 ¡Escena completada!',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      ariaSitioFondo: 'Sitio del fondo, columna {c}',
      ariaSitioDelante: 'Sitio de delante, columna {c}',
      ariaOcupado: '{nombre}, columna {c}'
    },
    en: {
      title: '🎭 The Theatre',
      instruccion: 'Build the scene. Put each character where the sentence says.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      veces: 'times',
      consigna: 'Put {pers} {rel} {ref}.',
      rel_delante: 'in front of',
      rel_detras: 'behind',
      pistaDelante: '🤔 Find {ref}. In front is the bottom row, the one closest to you.',
      pistaDetras: '🤔 Find {ref}. Behind is the top row, at the back.',
      malSitio: '❌ The right spot is marked: {rel} {ref}. Touch there.',
      okSitio: '✅ Well done! {pers} is {rel} {ref}.',
      escenaCompletada: '🎭 Scene complete!',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      ariaSitioFondo: 'Background spot, column {c}',
      ariaSitioDelante: 'Front spot, column {c}',
      ariaOcupado: '{nombre}, column {c}'
    }
  });
})();
