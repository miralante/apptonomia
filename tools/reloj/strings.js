/* ============================================================
   Apptonomia — Textos de El Reloj (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   IMPORTANTE: las horas NO se traducen de forma literal (ver PLAN-I18N.md
   Fase 3). Cada idioma usa sus propias expresiones horarias.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🕐 El Reloj',
      instruccion: 'Mira el reloj. Elige la hora correcta.',
      tituloNiveles: 'Elige el nivel',
      nivelNombre: 'Nivel {n}',
      veces: '{n} veces',
      escucharPreguntaAria: 'Escuchar la pregunta',
      preguntaQueHora: '¿Qué hora es?',
      relojAria: 'Reloj: {texto}',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {estrellas} estrellas.',
      otroNivel: 'Elegir otro nivel',
      horaEnPunto: '{h} en punto',
      horaYCuarto: '{h} y cuarto',
      horaYMedia: '{h} y media',
      horaMenosCuarto: '{h} menos cuarto',
      explicacionCorrecta: '✅ ¡Correcto! Son las ',
      explicacionIncorrectaA: '❌ No es esa hora. Son las ',
      pistaLeer: '🤔 Prueba otra vez. Mira el reloj con calma.',
      pistaAsociar: '🤔 Prueba otra vez. Piensa en ese momento del día.',
      nivelDescripcion: {
        1: 'Horas en punto',
        2: 'Y media',
        3: 'Y cuarto, menos cuarto'
      },
      momento: {
        desayuno: { nombre: 'el desayuno', pregunta: '¿A qué hora es el desayuno?' },
        colegio: { nombre: 'ir al colegio', pregunta: '¿A qué hora vas al colegio?' },
        comida: { nombre: 'la comida', pregunta: '¿A qué hora es la comida?' },
        merienda: { nombre: 'la merienda', pregunta: '¿A qué hora es la merienda?' },
        cena: { nombre: 'la cena', pregunta: '¿A qué hora es la cena?' },
        dormir: { nombre: 'dormir', pregunta: '¿A qué hora te vas a dormir?' }
      }
    },
    en: {
      title: '🕐 The Clock',
      instruccion: 'Look at the clock. Choose the right time.',
      tituloNiveles: 'Choose a level',
      nivelNombre: 'Level {n}',
      veces: '{n} times',
      escucharPreguntaAria: 'Listen to the question',
      preguntaQueHora: 'What time is it?',
      relojAria: 'Clock: {texto}',
      resumenFinal: 'You won {n} stars. Now you have {estrellas} stars.',
      otroNivel: 'Choose another level',
      horaEnPunto: "{h} o'clock",
      horaYCuarto: 'quarter past {h}',
      horaYMedia: 'half past {h}',
      horaMenosCuarto: 'quarter to {h}',
      explicacionCorrecta: "✅ Correct! It's ",
      explicacionIncorrectaA: "❌ That is not the time. It's ",
      pistaLeer: '🤔 Try again. Look calmly at the clock.',
      pistaAsociar: '🤔 Try again. Think about that time of day.',
      nivelDescripcion: {
        1: "O'clock",
        2: 'Half past',
        3: 'Quarter past, quarter to'
      },
      momento: {
        desayuno: { nombre: 'breakfast', pregunta: 'What time is breakfast?' },
        colegio: { nombre: 'going to school', pregunta: 'What time do you go to school?' },
        comida: { nombre: 'lunch', pregunta: 'What time is lunch?' },
        merienda: { nombre: 'snack time', pregunta: 'What time is snack time?' },
        cena: { nombre: 'dinner', pregunta: 'What time is dinner?' },
        dormir: { nombre: 'bedtime', pregunta: 'What time do you go to bed?' }
      }
    }
  });
})();
