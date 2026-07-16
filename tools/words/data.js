/* ============================================================
   Datos: Palabras (es) y Words en inglés (en) — vocabulario temático.
   Formato: DATA[loc] = { porRonda, temas: [{ id, nombre, descripcion, picto,
     estrellas, items: [{ picto, palabra }] }] }
   Se elige un tema y se juega una ronda de emparejar picto-palabra.
   'id' de cada tema se mantiene igual en es/en para conservar el progreso.
   Para ampliar: añadir items a un tema o un tema nuevo al array del idioma.
   app.js usa DATA[App.i18n.locale()].
   ============================================================ */
const DATA = {
  es: {
  porRonda: 10,
  temas: [
    {
      id: 'animales',
      nombre: 'Animales',
      descripcion: 'Vocabulario de animales',
      picto: '🐶',
      estrellas: 1,
      items: [
        { picto: '🐶', palabra: 'Perro' },
        { picto: '🐱', palabra: 'Gato' },
        { picto: '🐮', palabra: 'Vaca' },
        { picto: '🐷', palabra: 'Cerdo' },
        { picto: '🐴', palabra: 'Caballo' },
        { picto: '🐑', palabra: 'Oveja' },
        { picto: '🐔', palabra: 'Gallina' },
        { picto: '🐰', palabra: 'Conejo' },
        { picto: '🦁', palabra: 'León' },
        { picto: '🐘', palabra: 'Elefante' },
        { picto: '🐒', palabra: 'Mono' },
        { picto: '🐦', palabra: 'Pájaro' },
        { picto: '🐟', palabra: 'Pez' },
        { picto: '🐻', palabra: 'Oso' },
        { picto: '🦋', palabra: 'Mariposa' }
      ]
    },
    {
      id: 'comida',
      nombre: 'Comida',
      descripcion: 'Vocabulario de comida',
      picto: '🍎',
      estrellas: 2,
      items: [
        { picto: '🍎', palabra: 'Manzana' },
        { picto: '🍌', palabra: 'Plátano' },
        { picto: '🍇', palabra: 'Uvas' },
        { picto: '🍞', palabra: 'Pan' },
        { picto: '🧀', palabra: 'Queso' },
        { picto: '🥛', palabra: 'Leche' },
        { picto: '🍕', palabra: 'Pizza' },
        { picto: '🍗', palabra: 'Pollo' },
        { picto: '🍚', palabra: 'Arroz' },
        { picto: '🥕', palabra: 'Zanahoria' },
        { picto: '🍫', palabra: 'Chocolate' },
        { picto: '🥚', palabra: 'Huevo' },
        { picto: '🍉', palabra: 'Sandía' },
        { picto: '🍪', palabra: 'Galleta' },
        { picto: '🍦', palabra: 'Helado' }
      ]
    },
    {
      id: 'ropa',
      nombre: 'Ropa',
      descripcion: 'Vocabulario de ropa',
      picto: '👕',
      estrellas: 2,
      items: [
        { picto: '👕', palabra: 'Camiseta' },
        { picto: '👖', palabra: 'Pantalón' },
        { picto: '🧦', palabra: 'Calcetines' },
        { picto: '👗', palabra: 'Vestido' },
        { picto: '🧥', palabra: 'Abrigo' },
        { picto: '👟', palabra: 'Zapatillas' },
        { picto: '🧤', palabra: 'Guantes' },
        { picto: '🎩', palabra: 'Sombrero' },
        { picto: '👔', palabra: 'Corbata' },
        { picto: '🧣', palabra: 'Bufanda' },
        { picto: '👚', palabra: 'Blusa' },
        { picto: '🩳', palabra: 'Pantalón corto' },
        { picto: '👞', palabra: 'Zapato' },
        { picto: '🧢', palabra: 'Gorra' },
        { picto: '👘', palabra: 'Bata' }
      ]
    },
    {
      id: 'casa',
      nombre: 'La casa',
      descripcion: 'Vocabulario del hogar',
      picto: '🏠',
      estrellas: 3,
      items: [
        { picto: '🛏️', palabra: 'Cama' },
        { picto: '🪑', palabra: 'Silla' },
        { picto: '🚪', palabra: 'Puerta' },
        { picto: '🪟', palabra: 'Ventana' },
        { picto: '🛋️', palabra: 'Sofá' },
        { picto: '🚽', palabra: 'Baño' },
        { picto: '🍽️', palabra: 'Plato' },
        { picto: '🥄', palabra: 'Cuchara' },
        { picto: '🔑', palabra: 'Llave' },
        { picto: '💡', palabra: 'Bombilla' },
        { picto: '🪞', palabra: 'Espejo' },
        { picto: '🧴', palabra: 'Champú' },
        { picto: '🧻', palabra: 'Papel' },
        { picto: '🗄️', palabra: 'Armario' },
        { picto: '🕰️', palabra: 'Reloj' }
      ]
    }
  ]
  },
  en: {
    porRonda: 10,
    temas: [
      {
        id: 'animales',
        nombre: 'Animals',
        descripcion: 'Animal vocabulary',
        picto: '🐶',
        estrellas: 1,
        items: [
          { picto: '🐶', palabra: 'Dog' },
          { picto: '🐱', palabra: 'Cat' },
          { picto: '🐮', palabra: 'Cow' },
          { picto: '🐷', palabra: 'Pig' },
          { picto: '🐴', palabra: 'Horse' },
          { picto: '🐑', palabra: 'Sheep' },
          { picto: '🐔', palabra: 'Hen' },
          { picto: '🐰', palabra: 'Rabbit' },
          { picto: '🦁', palabra: 'Lion' },
          { picto: '🐘', palabra: 'Elephant' },
          { picto: '🐒', palabra: 'Monkey' },
          { picto: '🐦', palabra: 'Bird' },
          { picto: '🐟', palabra: 'Fish' },
          { picto: '🐻', palabra: 'Bear' },
          { picto: '🦋', palabra: 'Butterfly' }
        ]
      },
      {
        id: 'comida',
        nombre: 'Food',
        descripcion: 'Food vocabulary',
        picto: '🍎',
        estrellas: 2,
        items: [
          { picto: '🍎', palabra: 'Apple' },
          { picto: '🍌', palabra: 'Banana' },
          { picto: '🍇', palabra: 'Grapes' },
          { picto: '🍞', palabra: 'Bread' },
          { picto: '🧀', palabra: 'Cheese' },
          { picto: '🥛', palabra: 'Milk' },
          { picto: '🍕', palabra: 'Pizza' },
          { picto: '🍗', palabra: 'Chicken' },
          { picto: '🍚', palabra: 'Rice' },
          { picto: '🥕', palabra: 'Carrot' },
          { picto: '🍫', palabra: 'Chocolate' },
          { picto: '🥚', palabra: 'Egg' },
          { picto: '🍉', palabra: 'Watermelon' },
          { picto: '🍪', palabra: 'Cookie' },
          { picto: '🍦', palabra: 'Ice cream' }
        ]
      },
      {
        id: 'ropa',
        nombre: 'Clothes',
        descripcion: 'Clothing vocabulary',
        picto: '👕',
        estrellas: 2,
        items: [
          { picto: '👕', palabra: 'T-shirt' },
          { picto: '👖', palabra: 'Trousers' },
          { picto: '🧦', palabra: 'Socks' },
          { picto: '👗', palabra: 'Dress' },
          { picto: '🧥', palabra: 'Coat' },
          { picto: '👟', palabra: 'Trainers' },
          { picto: '🧤', palabra: 'Gloves' },
          { picto: '🎩', palabra: 'Hat' },
          { picto: '👔', palabra: 'Tie' },
          { picto: '🧣', palabra: 'Scarf' },
          { picto: '👚', palabra: 'Blouse' },
          { picto: '🩳', palabra: 'Shorts' },
          { picto: '👞', palabra: 'Shoe' },
          { picto: '🧢', palabra: 'Cap' },
          { picto: '👘', palabra: 'Robe' }
        ]
      },
      {
        id: 'casa',
        nombre: 'The house',
        descripcion: 'Home vocabulary',
        picto: '🏠',
        estrellas: 3,
        items: [
          { picto: '🛏️', palabra: 'Bed' },
          { picto: '🪑', palabra: 'Chair' },
          { picto: '🚪', palabra: 'Door' },
          { picto: '🪟', palabra: 'Window' },
          { picto: '🛋️', palabra: 'Sofa' },
          { picto: '🚽', palabra: 'Bathroom' },
          { picto: '🍽️', palabra: 'Plate' },
          { picto: '🥄', palabra: 'Spoon' },
          { picto: '🔑', palabra: 'Key' },
          { picto: '💡', palabra: 'Light bulb' },
          { picto: '🪞', palabra: 'Mirror' },
          { picto: '🧴', palabra: 'Shampoo' },
          { picto: '🧻', palabra: 'Paper' },
          { picto: '🗄️', palabra: 'Cupboard' },
          { picto: '🕰️', palabra: 'Clock' }
        ]
      }
    ]
  }
};
