/* ============================================================
   Datos: Mis Rutinas — rutinas diarias paso a paso.
   Formato: DATA.es / DATA.en, cada uno un array:
   [{ id, nombre, picto, pasos: [{ texto, picto }] }]
   - texto: en Lectura Fácil (frase corta, una idea).
   - picto: emoji grande que representa el paso.
   Para ampliar: añadir un objeto nuevo al array del idioma.
   El progreso se reinicia cada día de forma automática.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: [
    {
      id: 'manana',
      nombre: 'Por la mañana',
      picto: '🌅',
      pasos: [
        { texto: 'Me levanto de la cama.', picto: '🛏️' },
        { texto: 'Voy al baño.', picto: '🚽' },
        { texto: 'Me lavo la cara.', picto: '🧼' },
        { texto: 'Me visto.', picto: '👕' },
        { texto: 'Desayuno.', picto: '🥛' },
        { texto: 'Me lavo los dientes.', picto: '🪥' }
      ]
    },
    {
      id: 'comer',
      nombre: 'Antes de comer',
      picto: '🍽️',
      pasos: [
        { texto: 'Me lavo las manos.', picto: '🧼' },
        { texto: 'Pongo la mesa.', picto: '🍽️' },
        { texto: 'Me siento en la mesa.', picto: '🪑' },
        { texto: 'Como despacio.', picto: '🥄' },
        { texto: 'Recojo mi plato.', picto: '🧽' }
      ]
    },
    {
      id: 'noche',
      nombre: 'Por la noche',
      picto: '🌙',
      pasos: [
        { texto: 'Ceno.', picto: '🍽️' },
        { texto: 'Me pongo el pijama.', picto: '🩳' },
        { texto: 'Me lavo los dientes.', picto: '🪥' },
        { texto: 'Preparo la ropa de mañana.', picto: '👕' },
        { texto: 'Me acuesto.', picto: '🛏️' }
      ]
    },
    {
      id: 'salir',
      nombre: 'Salir de casa',
      picto: '🚪',
      pasos: [
        { texto: 'Voy al baño.', picto: '🚽' },
        { texto: 'Cojo mis llaves.', picto: '🔑' },
        { texto: 'Cojo mi teléfono.', picto: '📱' },
        { texto: 'Miro el tiempo. ¿Necesito abrigo?', picto: '🌦️' },
        { texto: 'Cierro la puerta.', picto: '🚪' }
      ]
    }
  ],

  en: [
    {
      id: 'manana',
      nombre: 'In the morning',
      picto: '🌅',
      pasos: [
        { texto: 'I get out of bed.', picto: '🛏️' },
        { texto: 'I go to the bathroom.', picto: '🚽' },
        { texto: 'I wash my face.', picto: '🧼' },
        { texto: 'I get dressed.', picto: '👕' },
        { texto: 'I have breakfast.', picto: '🥛' },
        { texto: 'I brush my teeth.', picto: '🪥' }
      ]
    },
    {
      id: 'comer',
      nombre: 'Before eating',
      picto: '🍽️',
      pasos: [
        { texto: 'I wash my hands.', picto: '🧼' },
        { texto: 'I set the table.', picto: '🍽️' },
        { texto: 'I sit at the table.', picto: '🪑' },
        { texto: 'I eat slowly.', picto: '🥄' },
        { texto: 'I clear my plate.', picto: '🧽' }
      ]
    },
    {
      id: 'noche',
      nombre: 'At night',
      picto: '🌙',
      pasos: [
        { texto: 'I have dinner.', picto: '🍽️' },
        { texto: 'I put on my pajamas.', picto: '🩳' },
        { texto: 'I brush my teeth.', picto: '🪥' },
        { texto: "I get tomorrow's clothes ready.", picto: '👕' },
        { texto: 'I go to bed.', picto: '🛏️' }
      ]
    },
    {
      id: 'salir',
      nombre: 'Leaving home',
      picto: '🚪',
      pasos: [
        { texto: 'I go to the bathroom.', picto: '🚽' },
        { texto: 'I grab my keys.', picto: '🔑' },
        { texto: 'I grab my phone.', picto: '📱' },
        { texto: 'I check the weather. Do I need a coat?', picto: '🌦️' },
        { texto: 'I close the door.', picto: '🚪' }
      ]
    }
  ]
};
