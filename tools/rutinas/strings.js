/* ============================================================
   Apptonomia — Textos de Mis Rutinas / My Routines (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '📋 Mis Rutinas',
      instruccion: 'Elige una rutina. Marca cada paso cuando lo hagas.',
      ariaEscucharPaso: 'Escuchar el paso',
      btnHecho: '✔ Hecho',
      ariaPasoHecho: 'Paso hecho',
      completadaHoy: '✔ Completada hoy',
      pasosDe: '{n} de {total} pasos',
      rutinaCompletadaTitulo: '¡Rutina completada!',
      resumenFinal: 'Has terminado la rutina "{nombre}". Ganas 1 estrella.',
      btnOtraRutina: 'Ver mis rutinas'
    },
    en: {
      title: '📋 My Routines',
      instruccion: 'Choose a routine. Check off each step when you do it.',
      ariaEscucharPaso: 'Listen to the step',
      btnHecho: '✔ Done',
      ariaPasoHecho: 'Step done',
      completadaHoy: '✔ Done today',
      pasosDe: '{n} of {total} steps',
      rutinaCompletadaTitulo: 'Routine complete!',
      resumenFinal: 'You finished the "{nombre}" routine. You earn 1 star.',
      btnOtraRutina: 'See my routines'
    }
  });
})();
