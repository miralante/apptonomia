/* ============================================================
   Datos: ¿Qué necesito? (autonomía — planificación de tareas).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ text, options: string[3], correct: indice }] }] }
   'text' describe una tarea o un objetivo; 'options[correct]' es lo que
   hace falta preparar o hacer antes de empezar.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa tareas
   con una sola cosa muy obvia que preparar (lavarte los dientes → el
   cepillo); nivel 2 mantiene el mismo formato de 3 opciones y solo
   pasa a tareas donde hace falta pensar un poco más (una receta,
   una excursión, estudiar con tiempo).
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
        descripcion: 'Una cosa muy clara',
        estrellas: 1,
        items: [
          { text: 'Vas a lavarte los dientes.', options: ['Cepillo y pasta de dientes', 'El móvil', 'Un libro'], correct: 0 },
          { text: 'Vas a hacer los deberes de mates.', options: ['Cuaderno y lápiz', 'El bañador', 'Un paraguas'], correct: 0 },
          { text: 'Vas a salir a la calle y está lloviendo.', options: ['El paraguas', 'Gafas de sol', 'El bañador'], correct: 0 },
          { text: 'Vas a montar en bici.', options: ['El casco', 'Un libro', 'Una manta'], correct: 0 },
          { text: 'Vas a merendar.', options: ['Algo de comer', 'El cepillo de dientes', 'Un paraguas'], correct: 0 },
          { text: 'Vas a dormir.', options: ['El pijama', 'El bañador', 'Un paraguas'], correct: 0 },
          { text: 'Vas a ir a la piscina.', options: ['El bañador y la toalla', 'El abrigo', 'Los libros del cole'], correct: 0 },
          { text: 'Vas a salir de casa y hace mucho frío.', options: ['El abrigo', 'El bañador', 'Una camiseta de tirantes'], correct: 0 },
          { text: 'Vas a pintar un dibujo.', options: ['Colores o rotuladores', 'El cepillo de dientes', 'El paraguas'], correct: 0 },
          { text: 'Vas a jugar al fútbol.', options: ['El balón y ropa de deporte', 'Un libro', 'El pijama'], correct: 0 },
          { text: 'Vas a ducharte.', options: ['Toalla y jabón', 'El abrigo', 'Un balón'], correct: 0 },
          { text: 'Vas a salir y hace mucho sol.', options: ['Gorra o crema de sol', 'El paraguas', 'Una bufanda'], correct: 0 },
          { text: 'Vas a recortar figuras de papel.', options: ['Tijeras de punta redonda', 'Una cuchara', 'El pijama'], correct: 0 },
          { text: 'Vas a pasear al perro.', options: ['La correa y bolsitas', 'El bañador', 'Un libro'], correct: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Hay que pensar un poco más',
        estrellas: 2,
        items: [
          { text: 'Vas a hacer una tarta de cumpleaños.', options: ['Harina, huevos y azúcar', 'Un balón', 'Un paraguas'], correct: 0 },
          { text: 'Vas a acampar en el jardín por la noche.', options: ['Una linterna', 'Gafas de sol', 'Un abanico'], correct: 0 },
          { text: 'Tienes un examen mañana.', options: ['Estudiar esta tarde', 'Ver la tele toda la tarde', 'Dormir todo el día'], correct: 0 },
          { text: 'Vas a ayudar a poner la mesa.', options: ['Platos y cubiertos', 'Libros del cole', 'El bañador'], correct: 0 },
          { text: 'Vas a hacer una videollamada con la abuela.', options: ['Cargar el móvil o la tablet', 'Coger el paraguas', 'Ponerte el pijama'], correct: 0 },
          { text: 'Vas a plantar semillas en una maceta.', options: ['Tierra y agua', 'Un cepillo de dientes', 'Un balón'], correct: 0 },
          { text: 'Vas de excursión al campo todo el día.', options: ['Agua y comida para el camino', 'Solo el pijama', 'Solo un paraguas'], correct: 0 },
          { text: 'Vas a escribir una carta a un amigo.', options: ['Papel y bolígrafo', 'El bañador', 'Un balón'], correct: 0 },
          { text: 'Vas a hacer un bizcocho y el horno tiene que estar caliente.', options: ['Encender el horno antes de empezar', 'Encenderlo al final del todo', 'No encenderlo'], correct: 0 },
          { text: 'Vas a ir a comprar el pan.', options: ['Dinero o tarjeta', 'El pijama', 'Una manta'], correct: 0 },
          { text: 'Vas a coger el autobús para ir al centro.', options: ['Saber el número del bus y llevar el bono o dinero', 'Solo unas gafas de sol', 'El bañador'], correct: 0 },
          { text: 'Mañana madrugas para una excursión.', options: ['Preparar la ropa y poner el despertador esta noche', 'Acostarte muy tarde', 'Dejarlo todo para mañana'], correct: 0 }
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
        descripcion: 'One very clear thing',
        estrellas: 1,
        items: [
          { text: 'You are going to brush your teeth.', options: ['A toothbrush and toothpaste', 'A phone', 'A book'], correct: 0 },
          { text: 'You are going to do your maths homework.', options: ['A notebook and a pencil', 'Swimming trunks', 'An umbrella'], correct: 0 },
          { text: "You are going outside and it's raining.", options: ['An umbrella', 'Sunglasses', 'Swimming trunks'], correct: 0 },
          { text: 'You are going to ride your bike.', options: ['A helmet', 'A book', 'A blanket'], correct: 0 },
          { text: 'You are going to have a snack.', options: ['Something to eat', 'A toothbrush', 'An umbrella'], correct: 0 },
          { text: 'You are going to sleep.', options: ['Pyjamas', 'Swimming trunks', 'An umbrella'], correct: 0 },
          { text: 'You are going to the swimming pool.', options: ['Swimming trunks and a towel', 'A coat', 'School books'], correct: 0 },
          { text: "You are going outside and it's very cold.", options: ['A coat', 'Swimming trunks', 'A sleeveless top'], correct: 0 },
          { text: 'You are going to paint a picture.', options: ['Crayons or felt tips', 'A toothbrush', 'An umbrella'], correct: 0 },
          { text: 'You are going to play football.', options: ['A ball and sports clothes', 'A book', 'Pyjamas'], correct: 0 },
          { text: 'You are going to take a shower.', options: ['A towel and soap', 'A coat', 'A ball'], correct: 0 },
          { text: 'You are going outside and it is very sunny.', options: ['A cap or sun cream', 'An umbrella', 'A scarf'], correct: 0 },
          { text: 'You are going to cut out paper shapes.', options: ['Round-tip scissors', 'A spoon', 'Pyjamas'], correct: 0 },
          { text: 'You are going to walk the dog.', options: ['The lead and waste bags', 'Swimming trunks', 'A book'], correct: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'You have to think a bit more',
        estrellas: 2,
        items: [
          { text: 'You are going to make a birthday cake.', options: ['Flour, eggs and sugar', 'A ball', 'An umbrella'], correct: 0 },
          { text: 'You are going to camp in the garden at night.', options: ['A torch', 'Sunglasses', 'A fan'], correct: 0 },
          { text: 'You have an exam tomorrow.', options: ['Study this afternoon', 'Watch TV all afternoon', 'Sleep all day'], correct: 0 },
          { text: 'You are going to help set the table.', options: ['Plates and cutlery', 'School books', 'Swimming trunks'], correct: 0 },
          { text: 'You are going to video call your grandma.', options: ['Charge your phone or tablet', 'Grab an umbrella', 'Put on your pyjamas'], correct: 0 },
          { text: 'You are going to plant seeds in a pot.', options: ['Soil and water', 'A toothbrush', 'A ball'], correct: 0 },
          { text: 'You are going on a day trip to the countryside.', options: ['Water and food for the journey', 'Just your pyjamas', 'Just an umbrella'], correct: 0 },
          { text: 'You are going to write a letter to a friend.', options: ['Paper and a pen', 'Swimming trunks', 'A ball'], correct: 0 },
          { text: 'You are going to bake a cake and the oven needs to be hot.', options: ['Turn the oven on before you start', 'Turn it on at the very end', 'Do not turn it on'], correct: 0 },
          { text: 'You are going to buy bread.', options: ['Money or a card', 'Pyjamas', 'A blanket'], correct: 0 },
          { text: 'You are going to take the bus into town.', options: ['Know the bus number and bring your pass or money', 'Just sunglasses', 'Swimming trunks'], correct: 0 },
          { text: 'You are getting up early tomorrow for a trip.', options: ['Lay out your clothes and set the alarm tonight', 'Go to bed very late', 'Leave everything for the morning'], correct: 0 }
        ]
      }
    ]
  }
};
