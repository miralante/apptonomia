/* ============================================================
   Data: Word Search — words by topic (es/en).
   Format:
     DATA.levels = [{ id, size, numWords, directions, stars }]
       - size: board side (size × size).
       - numWords: how many words are hidden per game.
       - directions: 'H' (across →) and/or 'V' (down ↓).
       - Gradual progression: each level changes ONE variable only.
     DATA[loc] = { topics: [{ id, name, description, picto, words }] }
       - each topic 'id' stays the same across es/en to keep progress
         when the language changes.
       - 'words': text as shown and spoken aloud. On the board they
         are normalized (uppercase, no accents; Ñ is kept). Only
         words that fit the board are used.
   To extend via configuration: add words to a topic, or a new topic
   to the language array (same 'id' in both languages).
   app.js uses DATA[App.i18n.locale()] falling back to DATA.es.
   ============================================================ */
var DATA = {
  levels: [
    { id: 'level1', size: 6, numWords: 4, directions: ['H'], stars: 1 },
    { id: 'level2', size: 8, numWords: 4, directions: ['H'], stars: 2 },
    { id: 'level3', size: 8, numWords: 4, directions: ['H', 'V'], stars: 3 }
  ],
  es: {
    topics: [
      {
        id: 'animals',
        name: 'Animales',
        description: 'Palabras de animales',
        picto: '🐶',
        words: ['Perro', 'Gato', 'Vaca', 'León', 'Oso', 'Mono', 'Oveja', 'Ratón', 'Conejo', 'Pájaro', 'Caballo', 'Gallina']
      },
      {
        id: 'food',
        name: 'Comida',
        description: 'Palabras de comida',
        picto: '🍎',
        words: ['Pan', 'Sopa', 'Queso', 'Leche', 'Pizza', 'Pollo', 'Arroz', 'Huevo', 'Sandía', 'Helado', 'Galleta', 'Manzana']
      },
      {
        id: 'home',
        name: 'La casa',
        description: 'Palabras de la casa',
        picto: '🏠',
        words: ['Mesa', 'Cama', 'Sofá', 'Silla', 'Llave', 'Plato', 'Espejo', 'Puerta', 'Cocina', 'Ventana', 'Lámpara', 'Armario']
      },
      {
        id: 'school',
        name: 'El colegio',
        description: 'Palabras del colegio',
        picto: '🎒',
        words: ['Goma', 'Aula', 'Lápiz', 'Libro', 'Papel', 'Clase', 'Patio', 'Recreo', 'Mochila', 'Pizarra', 'Tijeras', 'Libreta']
      }
    ]
  },
  en: {
    topics: [
      {
        id: 'animals',
        name: 'Animals',
        description: 'Animal words',
        picto: '🐶',
        words: ['Dog', 'Cat', 'Cow', 'Lion', 'Bear', 'Fish', 'Horse', 'Sheep', 'Mouse', 'Rabbit', 'Monkey', 'Bird']
      },
      {
        id: 'food',
        name: 'Food',
        description: 'Food words',
        picto: '🍎',
        words: ['Bread', 'Milk', 'Soup', 'Cheese', 'Pizza', 'Rice', 'Egg', 'Apple', 'Cookie', 'Melon', 'Banana', 'Chicken']
      },
      {
        id: 'home',
        name: 'The home',
        description: 'Home words',
        picto: '🏠',
        words: ['Table', 'Chair', 'Bed', 'Sofa', 'Door', 'Lamp', 'Key', 'Plate', 'Mirror', 'Window', 'Kitchen', 'Garden']
      },
      {
        id: 'school',
        name: 'School',
        description: 'School words',
        picto: '🎒',
        words: ['Book', 'Glue', 'Pen', 'Pencil', 'Paper', 'Class', 'Board', 'Ruler', 'Eraser', 'Recess', 'Teacher', 'Crayon']
      }
    ]
  }
};
