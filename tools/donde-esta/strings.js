/* ============================================================
   Apptonomia — Textos de ¿Dónde está? / Where Is It? (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   rel_*  → forma para la instrucción ("está {rel} {del-objeto}").
   mira_* → forma para la pista ("Después mira {mira}").
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🧭 ¿Dónde está?',
      instruccion: 'Lee la frase. Toca el dibujo correcto.',
      instruccionNivel: ' Primero elige el nivel.',
      elegirNivel: 'Elige el nivel',
      veces: 'veces',
      consigna: 'Toca lo que está {rel} {ref}.',
      rel_izq: 'a la izquierda',
      rel_der: 'a la derecha',
      rel_enc: 'encima',
      rel_deb: 'debajo',
      mira_izq: 'a su izquierda',
      mira_der: 'a su derecha',
      mira_enc: 'arriba',
      mira_deb: 'abajo',
      okRelacion: '✅ ¡Correcto! {objeto} está {rel} {ref}.',
      pista: '🤔 Busca primero {ref}. Después mira {mira}.',
      malRelacion: '❌ {Rel} {ref} está {objeto}. Está marcado: tócalo.',
      resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
      btnOtroNivel: 'Elegir otro nivel',
      ariaObjeto: 'Tocar {objeto}'
    },
    en: {
      title: '🧭 Where Is It?',
      instruccion: 'Read the sentence. Touch the right picture.',
      instruccionNivel: ' First, choose the level.',
      elegirNivel: 'Choose the level',
      veces: 'times',
      consigna: 'Touch what is {rel} {ref}.',
      rel_izq: 'to the left of',
      rel_der: 'to the right of',
      rel_enc: 'above',
      rel_deb: 'below',
      mira_izq: 'to its left',
      mira_der: 'to its right',
      mira_enc: 'up',
      mira_deb: 'down',
      okRelacion: '✅ Correct! {objeto} is {rel} {ref}.',
      pista: '🤔 First find {ref}. Then look {mira}.',
      malRelacion: '❌ {Rel} {ref} is {objeto}. It is marked: touch it.',
      resumenFinal: 'You won {n} stars. You now have {total} stars.',
      btnOtroNivel: 'Choose another level',
      ariaObjeto: 'Touch {objeto}'
    }
  });
})();
