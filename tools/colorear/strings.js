/* ============================================================
   Apptonomia — Textos de Colorear (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🎨 Colorear',
      instruccion: 'Elige un dibujo. Después, elige un color y toca una zona para pintarla.',
      lienzoAria: 'Dibujo para colorear',
      tituloElegirDibujo: 'Elige un dibujo',
      btnTerminado: '✔ He terminado',
      finalTitulo: '¡Qué bonito!',
      otroDibujo: 'Pintar otro dibujo',
      dibujosPintadosUno: 'Has pintado 1 dibujo en total. ',
      dibujosPintadosVarios: 'Has pintado {n} dibujos en total. ',
      estrellasUna: 'Ahora tienes 1 estrella.',
      estrellasVarias: 'Ahora tienes {n} estrellas.',
      zonaAria: 'Zona: {nombre}',
      color: {
        rojo: 'Rojo', azul: 'Azul', verde: 'Verde',
        amarillo: 'Amarillo', morado: 'Morado', naranja: 'Naranja'
      },
      dibujo: {
        casa: 'La casa', flor: 'La flor', pez: 'El pez', coche: 'El coche'
      },
      zona: {
        techo: 'Techo', pared: 'Pared', puerta: 'Puerta', ventana: 'Ventana', sol: 'Sol',
        petalos: 'Pétalos', centro: 'Centro', tallo: 'Tallo', hoja: 'Hoja',
        cuerpo: 'Cuerpo', cola: 'Cola', aleta: 'Aleta', ojo: 'Ojo',
        cabina: 'Cabina', rueda1: 'Rueda 1', rueda2: 'Rueda 2'
      }
    },
    en: {
      title: '🎨 Coloring',
      instruccion: 'Choose a picture. Then choose a color and touch a part to paint it.',
      lienzoAria: 'Picture to color in',
      tituloElegirDibujo: 'Choose a picture',
      btnTerminado: '✔ I am done',
      finalTitulo: 'How nice!',
      otroDibujo: 'Paint another picture',
      dibujosPintadosUno: 'You have painted 1 picture in total. ',
      dibujosPintadosVarios: 'You have painted {n} pictures in total. ',
      estrellasUna: 'Now you have 1 star.',
      estrellasVarias: 'Now you have {n} stars.',
      zonaAria: 'Part: {nombre}',
      color: {
        rojo: 'Red', azul: 'Blue', verde: 'Green',
        amarillo: 'Yellow', morado: 'Purple', naranja: 'Orange'
      },
      dibujo: {
        casa: 'The house', flor: 'The flower', pez: 'The fish', coche: 'The car'
      },
      zona: {
        techo: 'Roof', pared: 'Wall', puerta: 'Door', ventana: 'Window', sol: 'Sun',
        petalos: 'Petals', centro: 'Center', tallo: 'Stem', hoja: 'Leaf',
        cuerpo: 'Body', cola: 'Tail', aleta: 'Fin', ojo: 'Eye',
        cabina: 'Cabin', rueda1: 'Wheel 1', rueda2: 'Wheel 2'
      }
    }
  });
})();
