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
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué más te pones para salir?', opciones: ['Abrigo, bufanda y guantes', 'Gafas de sol', 'Gorra de verano'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor y vas a la piscina. ¿Qué te pones para bañarte?', opciones: ['Bañador', 'Vaqueros', 'Abrigo'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor por la noche. ¿Qué pijama te pones?', opciones: ['Pijama fresquito de verano', 'Pijama grueso de invierno', 'Bufanda para dormir'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío y vas a jugar con la nieve. ¿Qué te pones en las manos?', opciones: ['Guantes', 'Chanclas', 'Nada en las manos'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío. ¿Qué te pones en la cabeza?', opciones: ['Gorro de lana', 'Gorra de verano', 'Gafas de sol'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor y vas a hacer deporte fuera. ¿Qué te pones en la cabeza para protegerte del sol?', opciones: ['Gorra', 'Gorro de lana', 'Nada, mejor sin nada'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío y sales a la calle un momento a tirar la basura. ¿Qué te pones en los pies?', opciones: ['Zapatos cerrados y calcetines gruesos', 'Sandalias', 'Chanclas'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace mucho calor y vas a dormir la siesta. ¿Qué manta usas?', opciones: ['Una sábana fina o ninguna manta', 'Un edredón grueso de invierno', 'Dos mantas de lana'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace mucho frío y vas a jugar fuera un buen rato. ¿Qué te pones debajo del abrigo?', opciones: ['Un jersey de manga larga', 'Una camiseta de tirantes', 'Nada debajo del abrigo'], correcta: 0 }
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
          { picto: '🌧️', situacion: 'Está lloviendo. ¿Qué más te pones para salir?', opciones: ['Paraguas y chubasquero', 'Gafas de sol', 'Gorro de lana para la nieve'], correcta: 0 },
          { picto: '☀️', situacion: 'Hace calor y vas a caminar mucho rato. ¿Qué calzado eliges?', opciones: ['Zapatillas cómodas y frescas', 'Botas de nieve', 'Botas de agua'], correcta: 0 },
          { picto: '❄️', situacion: 'Hace frío y sopla mucho viento. ¿Qué te pones en el cuello?', opciones: ['Bufanda', 'Nada en el cuello', 'Gafas de sol'], correcta: 0 },
          { picto: '❄️', situacion: 'Fuera hace frío, pero dentro de casa hay calefacción. ¿Qué haces al entrar?', opciones: ['Quitarte el abrigo', 'Dejarte el abrigo puesto todo el día', 'Ponerte otro jersey más'], correcta: 0 },
          { picto: '🌧️', situacion: 'El cielo está muy oscuro, aunque todavía no llueve. ¿Qué llevas por si acaso?', opciones: ['El paraguas en la mochila', 'Gafas de sol', 'El bañador'], correcta: 0 },
          { picto: '🌧️', situacion: 'Deja de llover y sale el sol. ¿Qué haces con el chubasquero?', opciones: ['Quitártelo y guardarlo', 'Dejártelo puesto todo el día', 'Tirarlo a una papelera'], correcta: 0 }
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
          { picto: '❄️', situacion: 'It is very cold. What else do you wear to go out?', opciones: ['A coat, scarf and gloves', 'Sunglasses', 'A summer cap'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot and you are going to the pool. What do you wear to swim?', opciones: ['A swimsuit', 'Jeans', 'A coat'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot at night. Which pyjamas do you wear?', opciones: ['Light summer pyjamas', 'Thick winter pyjamas', 'A scarf to sleep'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold and you are going to play in the snow. What do you wear on your hands?', opciones: ['Gloves', 'Flip-flops', 'Nothing on your hands'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold. What do you wear on your head?', opciones: ['A wool hat', 'A summer cap', 'Sunglasses'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot and you are going to do sports outside. What do you wear on your head to protect from the sun?', opciones: ['A cap', 'A wool hat', 'Nothing, better with nothing'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold and you go outside for a moment to take out the rubbish. What do you wear on your feet?', opciones: ['Closed shoes and thick socks', 'Sandals', 'Flip-flops'], correcta: 0 },
          { picto: '☀️', situacion: 'It is very hot and you are taking a nap. Which blanket do you use?', opciones: ['A thin sheet or no blanket', 'A thick winter duvet', 'Two wool blankets'], correcta: 0 },
          { picto: '❄️', situacion: 'It is very cold and you are going to play outside for a while. What do you wear under your coat?', opciones: ['A long-sleeved jumper', 'A vest top', 'Nothing under the coat'], correcta: 0 }
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
          { picto: '🌧️', situacion: 'It is raining. What else do you wear to go out?', opciones: ['An umbrella and a raincoat', 'Sunglasses', 'A snow hat'], correcta: 0 },
          { picto: '☀️', situacion: 'It is hot and you are going to walk for a long time. Which shoes do you choose?', opciones: ['Comfortable, light trainers', 'Snow boots', 'Wellington boots'], correcta: 0 },
          { picto: '❄️', situacion: 'It is cold and very windy. What do you wear around your neck?', opciones: ['A scarf', 'Nothing on your neck', 'Sunglasses'], correcta: 0 },
          { picto: '❄️', situacion: 'It is cold outside, but the house has heating on. What do you do when you come in?', opciones: ['Take off your coat', 'Keep your coat on all day', 'Put on another jumper'], correcta: 0 },
          { picto: '🌧️', situacion: 'The sky is very dark, though it is not raining yet. What do you take just in case?', opciones: ['An umbrella in your bag', 'Sunglasses', 'Swimming trunks'], correcta: 0 },
          { picto: '🌧️', situacion: 'It stops raining and the sun comes out. What do you do with your raincoat?', opciones: ['Take it off and put it away', 'Keep it on all day', 'Throw it in a bin'], correcta: 0 }
        ]
      }
    ]
  }
};
