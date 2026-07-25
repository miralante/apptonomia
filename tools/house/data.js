/* ============================================================
   Datos: La Casa (autonomía — ordenar pasos de tareas del hogar).
   Formato: DATA.es / DATA.en, cada uno un objeto con:
   { porRonda, tareas: [{ id, nombre, picto, pasos: string[] }] }
   - pasos: pictogramas (emojis) en el orden correcto; el primero
     se hace primero. No cambian entre idiomas (solo 'nombre').
   - porRonda: cuántas tareas se eligen al azar por partida.
   La persona entra y empieza directamente: no hay niveles.
   Para ampliar: añadir un objeto al array 'tareas' del idioma
   correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: {
    porRonda: 5,
    tareas: [
      /* --- Mesa y comida --- */
      { id: 'mesa',       nombre: 'Poner la mesa',                  picto: '🍽️', pasos: ['🍽️', '🍴', '🥄', '🥤', '🪑'] },
      { id: 'recoger',    nombre: 'Recoger la mesa',                picto: '🧽', pasos: ['🍽️', '🍴', '🥄', '🧽', '✨'] },
      { id: 'merienda',   nombre: 'Preparar la merienda',           picto: '🥪', pasos: ['🍞', '🧈', '🔪', '🍽️', '😋'] },
      { id: 'desayuno',   nombre: 'Preparar el desayuno',           picto: '🥣', pasos: ['🥣', '🥛', '🍞', '🥄', '😋'] },

      /* --- Platos y cocina --- */
      { id: 'platos',     nombre: 'Fregar los platos',              picto: '🧽', pasos: ['🍽️', '🧽', '🧴', '🚿', '✨'] },
      { id: 'cocinar',    nombre: 'Cocinar una comida',             picto: '🍳', pasos: ['🥕', '🔪', '🍳', '🍽️', '🧽'] },

      /* --- Ropa y lavadora --- */
      { id: 'doblar',     nombre: 'Doblar la ropa',                 picto: '👕', pasos: ['🧺', '👕', '👖', '🧦', '🗄️'] },
      { id: 'lavar',      nombre: 'Poner la lavadora',              picto: '🌀', pasos: ['🧺', '🧴', '🌀', '👕', '🚪'] },
      { id: 'tender',     nombre: 'Tender la ropa',                 picto: '☀️', pasos: ['🧺', '🪝', '👕', '💧', '☀️'] },

      /* --- Hacer la cama --- */
      { id: 'cama',       nombre: 'Hacer la cama',                  picto: '🛏️', pasos: ['🛏️', '🧴', '🛌', '🪟', '✨'] },

      /* --- Limpieza general --- */
      { id: 'barrer',     nombre: 'Barrer el suelo',                picto: '🧹', pasos: ['🧹', '🗑️', '🚪', '🧺', '✨'] },
      { id: 'fregar',     nombre: 'Fregar el suelo',                picto: '🪣', pasos: ['🪣', '🧴', '🧹', '🚪', '✨'] },
      { id: 'polvo',      nombre: 'Limpiar el polvo',               picto: '🪑', pasos: ['🪑', '🧴', '🧽', '🗑️', '✨'] },
      { id: 'habitacion', nombre: 'Ordenar mi habitación',          picto: '🛏️', pasos: ['🛏️', '👕', '🧸', '📦', '✨'] },

      /* --- Basura y reciclaje --- */
      { id: 'basura',     nombre: 'Sacar la basura',                picto: '🚮', pasos: ['🗑️', '🪢', '🚪', '🚮', '✨'] },

      /* --- Plantas y jardín --- */
      { id: 'plantas',    nombre: 'Regar las plantas',              picto: '🪴', pasos: ['🪴', '🚰', '💧', '☀️', '✨'] },
      { id: 'jardin',     nombre: 'Regar el jardín',                picto: '🌱', pasos: ['🚿', '🌱', '💧', '🌸', '☀️'] },
      { id: 'semilla',    nombre: 'Plantar una semilla',            picto: '🌰', pasos: ['🌰', '🕳️', '🌱', '🚰', '☀️'] },

      /* --- Mascotas --- */
      { id: 'pasear',     nombre: 'Pasear al perro',                picto: '🐶', pasos: ['🐶', '🦮', '🚪', '🌳', '🏠'] },
      { id: 'banarPerro', nombre: 'Bañar al perro',                 picto: '🛁', pasos: ['🐶', '🛁', '🧼', '💧', '🐩'] },
      { id: 'comidaPerro',nombre: 'Dar de comer al perro',          picto: '🦴', pasos: ['🥣', '🥄', '🦴', '🐶', '✨'] },
      { id: 'comidaGato', nombre: 'Dar de comer al gato',           picto: '🐱', pasos: ['🥣', '🥫', '🥄', '🐱', '✨'] },
      { id: 'arenero',    nombre: 'Limpiar el arenero del gato',    picto: '🐈', pasos: ['🧹', '🪣', '🐈', '🧴', '✨'] },

      /* --- Compra semanal --- */
      { id: 'compra',     nombre: 'Hacer la compra semanal',        picto: '🛒', pasos: ['📝', '🛒', '💳', '🛍️', '🏠'] },

      /* --- Preparar el cole --- */
      { id: 'mochila',    nombre: 'Preparar la mochila del cole',   picto: '🎒', pasos: ['🎒', '📚', '✏️', '🍎', '🚪'] },

      /* --- Fiesta en casa --- */
      { id: 'fiesta',     nombre: 'Preparar una fiesta en casa',    picto: '🎉', pasos: ['📝', '🛒', '🎈', '🎂', '🎉'] }
    ]
  },

  en: {
    porRonda: 5,
    tareas: [
      /* --- Table and food --- */
      { id: 'mesa',       nombre: 'Set the table',                  picto: '🍽️', pasos: ['🍽️', '🍴', '🥄', '🥤', '🪑'] },
      { id: 'recoger',    nombre: 'Clear the table',                picto: '🧽', pasos: ['🍽️', '🍴', '🥄', '🧽', '✨'] },
      { id: 'merienda',   nombre: 'Make a snack',                   picto: '🥪', pasos: ['🍞', '🧈', '🔪', '🍽️', '😋'] },
      { id: 'desayuno',   nombre: 'Make breakfast',                 picto: '🥣', pasos: ['🥣', '🥛', '🍞', '🥄', '😋'] },

      /* --- Dishes and cooking --- */
      { id: 'platos',     nombre: 'Wash the dishes',                picto: '🧽', pasos: ['🍽️', '🧽', '🧴', '🚿', '✨'] },
      { id: 'cocinar',    nombre: 'Cook a meal',                    picto: '🍳', pasos: ['🥕', '🔪', '🍳', '🍽️', '🧽'] },

      /* --- Laundry --- */
      { id: 'doblar',     nombre: 'Fold the clothes',               picto: '👕', pasos: ['🧺', '👕', '👖', '🧦', '🗄️'] },
      { id: 'lavar',      nombre: 'Do the laundry',                 picto: '🌀', pasos: ['🧺', '🧴', '🌀', '👕', '🚪'] },
      { id: 'tender',     nombre: 'Hang out the laundry',           picto: '☀️', pasos: ['🧺', '🪝', '👕', '💧', '☀️'] },

      /* --- Make the bed --- */
      { id: 'cama',       nombre: 'Make the bed',                   picto: '🛏️', pasos: ['🛏️', '🧴', '🛌', '🪟', '✨'] },

      /* --- General cleaning --- */
      { id: 'barrer',     nombre: 'Sweep the floor',                picto: '🧹', pasos: ['🧹', '🗑️', '🚪', '🧺', '✨'] },
      { id: 'fregar',     nombre: 'Mop the floor',                  picto: '🪣', pasos: ['🪣', '🧴', '🧹', '🚪', '✨'] },
      { id: 'polvo',      nombre: 'Dust the furniture',             picto: '🪑', pasos: ['🪑', '🧴', '🧽', '🗑️', '✨'] },
      { id: 'habitacion', nombre: 'Tidy up my bedroom',             picto: '🛏️', pasos: ['🛏️', '👕', '🧸', '📦', '✨'] },

      /* --- Trash --- */
      { id: 'basura',     nombre: 'Take out the trash',             picto: '🚮', pasos: ['🗑️', '🪢', '🚪', '🚮', '✨'] },

      /* --- Plants and garden --- */
      { id: 'plantas',    nombre: 'Water the plants',               picto: '🪴', pasos: ['🪴', '🚰', '💧', '☀️', '✨'] },
      { id: 'jardin',     nombre: 'Water the garden',               picto: '🌱', pasos: ['🚿', '🌱', '💧', '🌸', '☀️'] },
      { id: 'semilla',    nombre: 'Plant a seed',                   picto: '🌰', pasos: ['🌰', '🕳️', '🌱', '🚰', '☀️'] },

      /* --- Pets --- */
      { id: 'pasear',     nombre: 'Walk the dog',                   picto: '🐶', pasos: ['🐶', '🦮', '🚪', '🌳', '🏠'] },
      { id: 'banarPerro', nombre: 'Bathe the dog',                  picto: '🛁', pasos: ['🐶', '🛁', '🧼', '💧', '🐩'] },
      { id: 'comidaPerro',nombre: 'Feed the dog',                   picto: '🦴', pasos: ['🥣', '🥄', '🦴', '🐶', '✨'] },
      { id: 'comidaGato', nombre: 'Feed the cat',                   picto: '🐱', pasos: ['🥣', '🥫', '🥄', '🐱', '✨'] },
      { id: 'arenero',    nombre: 'Clean the cat litter',           picto: '🐈', pasos: ['🧹', '🪣', '🐈', '🧴', '✨'] },

      /* --- Weekly shopping --- */
      { id: 'compra',     nombre: 'Do the weekly shopping',         picto: '🛒', pasos: ['📝', '🛒', '💳', '🛍️', '🏠'] },

      /* --- School bag --- */
      { id: 'mochila',    nombre: 'Pack the school bag',            picto: '🎒', pasos: ['🎒', '📚', '✏️', '🍎', '🚪'] },

      /* --- Party at home --- */
      { id: 'fiesta',     nombre: 'Set up a party at home',         picto: '🎉', pasos: ['📝', '🛒', '🎈', '🎂', '🎉'] }
    ]
  }
};
