/* ============================================================
   Apptonomia — Textos de El Monedero / The Coin Purse (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: 'El Monedero',
      titleH1: '💶 El Monedero',
      instruccion: 'Mira el precio. Toca las monedas hasta llegar al precio justo.',
      eligeNivel: 'Elige el nivel',
      hasPuesto: 'Has puesto: {total}',
      quitarUltima: '↩ Quitar última',
      vaciar: '🗑 Vaciar',
      comprobar: 'Comprobar',
      escucharPrecio: 'Escuchar el precio',
      anadirMoneda: 'Añadir {valor}',
      faltaDinero: 'Falta dinero. Añade más monedas.',
      sobraDinero: 'Sobra dinero. Quita alguna moneda.',
      resumenFinal: 'Has pagado {n} precios justos. Ahora tienes {total} estrellas.',
      vecesTexto: '{n} veces',
      elegirOtroNivel: 'Elegir otro nivel',
      primeroElige: ' Primero elige el nivel.'
    },
    en: {
      title: 'The Coin Purse',
      titleH1: '💶 The Coin Purse',
      instruccion: 'Look at the price. Touch the coins until you reach the exact price.',
      eligeNivel: 'Choose a level',
      hasPuesto: 'You have put in: {total}',
      quitarUltima: '↩ Remove last',
      vaciar: '🗑 Empty',
      comprobar: 'Check',
      escucharPrecio: 'Listen to the price',
      anadirMoneda: 'Add {valor}',
      faltaDinero: 'Not enough money. Add more coins.',
      sobraDinero: 'Too much money. Remove a coin.',
      resumenFinal: 'You paid the exact price {n} times. You now have {total} stars.',
      vecesTexto: '{n} times',
      elegirOtroNivel: 'Choose another level',
      primeroElige: ' First, choose a level.'
    }
  });
})();
