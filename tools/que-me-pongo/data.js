/* ============================================================
   Datos: ¿Qué me pongo? (autonomía — vestirse según el tiempo:
   calor/frío/lluvia, verano/invierno).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ picto, situacion, opciones: string[3], correcta }] }] }
   Cada item pregunta por UNA prenda (torso, piernas, pies, o un
   extra como gorra/paraguas) para un tiempo concreto; la opción
   correcta es siempre la prenda adecuada a ese tiempo, nunca la más
   bonita o la primera de la lista.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa solo
   los dos contrastes más claros (mucho calor / mucho frío); nivel 2
   mantiene el mismo formato de 4 preguntas por tiempo y 3 opciones,
   y añade un tercer tiempo menos evidente (lluvia, que no depende
   de la temperatura sino de ir seco).
   Para ampliar: añadir items al array del nivel correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Mucho calor o mucho frío',
        estrellas: 1,
        items: [
          { picto: '☀️', situacion: 'Hace mucho calor. ¿Qué te pones en el torso (arriba)?', opciones: ['Camiseta de manga corta', 'Jersey de lana', 'Abrigo'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor. ¿Qué te pones en las piernas?', opciones: ['Pantalón corto', 'Pantalón largo y grueso', 'Pijama de invierno'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor. ¿Qué te pones en los pies?', opciones: ['Sandalias', 'Botas de agua', 'Botas de nieve'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor. ¿Qué más te pones para salir?', opciones: ['Gorra y gafas de sol', 'Bufanda y guantes', 'Abrigo grueso'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué te pones en el torso (arriba)?', opciones: ['Jersey de lana', 'Camiseta de tirantes', 'Camiseta de manga corta'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué te pones en las piernas?', opciones: ['Pantalón largo y grueso', 'Pantalón corto', 'Bañador'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué te pones en los pies?', opciones: ['Botas', 'Sandalias', 'Chanclas'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué más te pones para salir?', opciones: ['Abrigo, bufanda y guantes', 'Gafas de sol', 'Gorra de verano'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'También cuando llueve',
        estrellas: 2,
        items: [
          { picto: '☀️', situacion: 'Hace mucho calor. ¿Qué te pones en el torso (arriba)?', opciones: ['Camiseta de manga corta', 'Jersey de lana', 'Abrigo'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor. ¿Qué te pones en las piernas?', opciones: ['Pantalón corto', 'Pantalón largo y grueso', 'Pijama de invierno'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor. ¿Qué te pones en los pies?', opciones: ['Sandalias', 'Botas de agua', 'Botas de nieve'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor. ¿Qué más te pones para salir?', opciones: ['Gorra y gafas de sol', 'Bufanda y guantes', 'Abrigo grueso'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué te pones en el torso (arriba)?', opciones: ['Jersey de lana', 'Camiseta de tirantes', 'Camiseta de manga corta'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué te pones en las piernas?', opciones: ['Pantalón largo y grueso', 'Pantalón corto', 'Bañador'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué te pones en los pies?', opciones: ['Botas', 'Sandalias', 'Chanclas'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué más te pones para salir?', opciones: ['Abrigo, bufanda y guantes', 'Gafas de sol', 'Gorra de verano'], correcta: 0 },
          { picto: '🌧️', situacion: 'Está lloviendo. ¿Qué te pones en el torso (arriba)?', opciones: ['Camiseta de manga larga', 'Camiseta de tirantes', 'Jersey muy grueso de nieve'], correcta: 0 },
          { picto: '🌧️', situacion: 'Está lloviendo. ¿Qué te pones en las piernas?', opciones: ['Pantalón largo', 'Pantalón corto', 'Bañador'], correcta: 0 },
          { picto: '🌧️', situacion: 'Está lloviendo. ¿Qué te pones en los pies?', opciones: ['Botas de agua', 'Sandalias', 'Chanclas'], correcta: 0 },
          { picto: '🌧️', situacion: 'Está lloviendo. ¿Qué más te pones para salir?', opciones: ['Paraguas y chubasquero', 'Gafas de sol', 'Gorro de lana para la nieve'], correcta: 0 }
        ]
      }
    ]
  },
  en: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: 'Very hot or very cold',
        estrellas: 1,
        items: [
          { picto: '☀️', situacion: 'It is very hot. What do you wear on your top (upper body)?', opciones: ['A short-sleeved t-shirt', 'A wool jumper', 'A coat'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot. What do you wear on your legs?', opciones: ['Shorts', 'Thick long trousers', 'Winter pyjamas'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot. What do you wear on your feet?', opciones: ['Sandals', 'Wellington boots', 'Snow boots'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot. What else do you wear to go out?', opciones: ['A cap and sunglasses', 'A scarf and gloves', 'A thick coat'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What do you wear on your top (upper body)?', opciones: ['A wool jumper', 'A vest top', 'A short-sleeved t-shirt'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What do you wear on your legs?', opciones: ['Thick long trousers', 'Shorts', 'Swimming trunks'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What do you wear on your feet?', opciones: ['Boots', 'Sandals', 'Flip-flops'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What else do you wear to go out?', opciones: ['A coat, scarf and gloves', 'Sunglasses', 'A summer cap'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Also when it rains',
        estrellas: 2,
        items: [
          { picto: '☀️', situacion: 'It is very hot. What do you wear on your top (upper body)?', opciones: ['A short-sleeved t-shirt', 'A wool jumper', 'A coat'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot. What do you wear on your legs?', opciones: ['Shorts', 'Thick long trousers', 'Winter pyjamas'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot. What do you wear on your feet?', opciones: ['Sandals', 'Wellington boots', 'Snow boots'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot. What else do you wear to go out?', opciones: ['A cap and sunglasses', 'A scarf and gloves', 'A thick coat'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What do you wear on your top (upper body)?', opciones: ['A wool jumper', 'A vest top', 'A short-sleeved t-shirt'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What do you wear on your legs?', opciones: ['Thick long trousers', 'Shorts', 'Swimming trunks'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What do you wear on your feet?', opciones: ['Boots', 'Sandals', 'Flip-flops'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What else do you wear to go out?', opciones: ['A coat, scarf and gloves', 'Sunglasses', 'A summer cap'], correcta: 0 },
          { picto: '🌧️', situacion: 'It is raining. What do you wear on your top (upper body)?', opciones: ['A long-sleeved t-shirt', 'A vest top', 'A very thick snow jumper'], correcta: 0 },
          { picto: '🌧️', situacion: 'It is raining. What do you wear on your legs?', opciones: ['Long trousers', 'Shorts', 'Swimming trunks'], correcta: 0 },
          { picto: '🌧️', situacion: 'It is raining. What do you wear on your feet?', opciones: ['Wellington boots', 'Sandals', 'Flip-flops'], correcta: 0 },
          { picto: '🌧️', situacion: 'It is raining. What else do you wear to go out?', opciones: ['An umbrella and a raincoat', 'Sunglasses', 'A snow hat'], correcta: 0 }
        ]
      }
    ]
  }
};
