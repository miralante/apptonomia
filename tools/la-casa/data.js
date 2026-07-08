/* ============================================================
   Datos: La Casa (autonomía — ordenar pasos de tareas del hogar).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     tareas: [{ nombre, pasos: string[] }] }] }
   'pasos' está en el orden correcto (el primero se hace primero).
   Los pasos son emojis (pictogramas): no cambian entre idiomas,
   solo se traduce 'nombre' de la tarea y del nivel.
   Para ampliar: añadir tareas al array del nivel correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 5,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: '3 pasos',
        estrellas: 1,
        tareas: [
          { nombre: 'Poner la mesa', pasos: ['🍽️', '🍴', '🥤'] },
          { nombre: 'Barrer el suelo', pasos: ['🧹', '🗑️', '✨'] },
          { nombre: 'Fregar los platos', pasos: ['🍽️', '🧽', '✨'] },
          { nombre: 'Sacar la basura', pasos: ['🗑️', '🚪', '🚮'] },
          { nombre: 'Doblar la ropa', pasos: ['🧺', '👕', '🗄️'] },
          { nombre: 'Regar las plantas', pasos: ['🪴', '🚰', '💧'] },
          { nombre: 'Limpiar el polvo', pasos: ['🪑', '🧴', '✨'] },
          { nombre: 'Pasear al perro', pasos: ['🐶', '🚪', '🌳'] }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: '4 pasos',
        estrellas: 2,
        tareas: [
          { nombre: 'Poner la lavadora', pasos: ['🧺', '🧴', '🌀', '👕'] },
          { nombre: 'Preparar la merienda', pasos: ['🍞', '🧈', '🍽️', '😋'] },
          { nombre: 'Limpiar la habitación', pasos: ['🛏️', '🧹', '🗑️', '✨'] },
          { nombre: 'Hacer la compra semanal', pasos: ['📝', '🛒', '💳', '🏠'] },
          { nombre: 'Bañar al perro', pasos: ['🐶', '🛁', '🧼', '🐩'] },
          { nombre: 'Regar el jardín', pasos: ['🚿', '🌱', '🌸', '☀️'] },
          { nombre: 'Ordenar los juguetes', pasos: ['🧸', '📦', '🗄️', '✨'] },
          { nombre: 'Preparar la mochila del cole', pasos: ['🎒', '📚', '✏️', '🚪'] }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: '5 pasos',
        estrellas: 3,
        tareas: [
          { nombre: 'Hacer una comida completa', pasos: ['🥕', '🍳', '🍽️', '🍴', '🧽'] },
          { nombre: 'Lavar y tender la ropa', pasos: ['🧺', '🌀', '💧', '☀️', '👕'] },
          { nombre: 'Organizar una fiesta en casa', pasos: ['📝', '🛒', '🎈', '🎂', '🎉'] },
          { nombre: 'Limpiar toda la casa', pasos: ['🛏️', '🧹', '🧽', '🗑️', '✨'] },
          { nombre: 'Cuidar una planta desde semilla', pasos: ['🌰', '🕳️', '🚰', '🌱', '🌳'] },
          { nombre: 'Preparar el desayuno en familia', pasos: ['🥣', '🍳', '🍽️', '🥛', '😋'] }
        ]
      }
    ]
  },

  en: {
    porRonda: 5,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: '3 steps',
        estrellas: 1,
        tareas: [
          { nombre: 'Set the table', pasos: ['🍽️', '🍴', '🥤'] },
          { nombre: 'Sweep the floor', pasos: ['🧹', '🗑️', '✨'] },
          { nombre: 'Wash the dishes', pasos: ['🍽️', '🧽', '✨'] },
          { nombre: 'Take out the trash', pasos: ['🗑️', '🚪', '🚮'] },
          { nombre: 'Fold the clothes', pasos: ['🧺', '👕', '🗄️'] },
          { nombre: 'Water the plants', pasos: ['🪴', '🚰', '💧'] },
          { nombre: 'Dust the furniture', pasos: ['🪑', '🧴', '✨'] },
          { nombre: 'Walk the dog', pasos: ['🐶', '🚪', '🌳'] }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: '4 steps',
        estrellas: 2,
        tareas: [
          { nombre: 'Do the laundry', pasos: ['🧺', '🧴', '🌀', '👕'] },
          { nombre: 'Make a snack', pasos: ['🍞', '🧈', '🍽️', '😋'] },
          { nombre: 'Clean the bedroom', pasos: ['🛏️', '🧹', '🗑️', '✨'] },
          { nombre: 'Do the weekly shopping', pasos: ['📝', '🛒', '💳', '🏠'] },
          { nombre: 'Bathe the dog', pasos: ['🐶', '🛁', '🧼', '🐩'] },
          { nombre: 'Water the garden', pasos: ['🚿', '🌱', '🌸', '☀️'] },
          { nombre: 'Tidy up the toys', pasos: ['🧸', '📦', '🗄️', '✨'] },
          { nombre: 'Pack the school bag', pasos: ['🎒', '📚', '✏️', '🚪'] }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: '5 steps',
        estrellas: 3,
        tareas: [
          { nombre: 'Cook a full meal', pasos: ['🥕', '🍳', '🍽️', '🍴', '🧽'] },
          { nombre: 'Wash and hang out the clothes', pasos: ['🧺', '🌀', '💧', '☀️', '👕'] },
          { nombre: 'Organize a party at home', pasos: ['📝', '🛒', '🎈', '🎂', '🎉'] },
          { nombre: 'Clean the whole house', pasos: ['🛏️', '🧹', '🧽', '🗑️', '✨'] },
          { nombre: 'Grow a plant from a seed', pasos: ['🌰', '🕳️', '🚰', '🌱', '🌳'] },
          { nombre: 'Make breakfast for the family', pasos: ['🥣', '🍳', '🍽️', '🥛', '😋'] }
        ]
      }
    ]
  }
};
