/* ============================================================
   Datos: El Teatro (memoria/atención — construcción de escenas con
   profundidad: delante/detrás, fondo y primer plano).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda,
     referencias: [{ picto, el, del }] (decorado: árbol, casa…),
     personajes: [{ picto, el }] (quien se coloca: perro, gato…),
       'el'  → nombre con artículo para ser sujeto ("el perro").
       'del' → forma con "de" para la consigna ("del árbol",
               "de la casa"); en inglés ambas son "the tree".
     niveles: [{ id, nombre, descripcion, ordenes }] }
   El escenario tiene 2 filas × 4 columnas: la fila de arriba es el
   FONDO (se ve más pequeña) y la de abajo es DELANTE (más grande).
   Cada escena se GENERA en app.js: cada columna recibe una
   referencia (en fila al azar) y se dan 'ordenes' una a una ("Pon
   el perro delante del árbol") — el sitio correcto es la otra
   fila, misma columna que la referencia nombrada. Las columnas sin
   orden hacen de distractores.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es el número de órdenes por escena (2 → 3 → 4). Las relaciones
   (delante/detrás) y el escenario no cambian nunca.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 3,
    referencias: [
      { picto: '🌳', el: 'el árbol', del: 'del árbol' },
      { picto: '🏠', el: 'la casa', del: 'de la casa' },
      { picto: '⛰️', el: 'la montaña', del: 'de la montaña' },
      { picto: '🏰', el: 'el castillo', del: 'del castillo' },
      { picto: '🌻', el: 'el girasol', del: 'del girasol' },
      { picto: '⛺', el: 'la tienda', del: 'de la tienda' }
    ],
    personajes: [
      { picto: '🐕', el: 'el perro' },
      { picto: '🐈', el: 'el gato' },
      { picto: '👧', el: 'la niña' },
      { picto: '👦', el: 'el niño' },
      { picto: '🐰', el: 'el conejo' },
      { picto: '🦆', el: 'el pato' },
      { picto: '⭐', el: 'la estrella' },
      { picto: '⚽', el: 'la pelota' }
    ],
    niveles: [
      { id: 1, nombre: 'Nivel 1', descripcion: '2 personajes', ordenes: 2 },
      { id: 2, nombre: 'Nivel 2', descripcion: '3 personajes', ordenes: 3 },
      { id: 3, nombre: 'Nivel 3', descripcion: '4 personajes', ordenes: 4 }
    ]
  },
  en: {
    porRonda: 3,
    referencias: [
      { picto: '🌳', el: 'the tree', del: 'the tree' },
      { picto: '🏠', el: 'the house', del: 'the house' },
      { picto: '⛰️', el: 'the mountain', del: 'the mountain' },
      { picto: '🏰', el: 'the castle', del: 'the castle' },
      { picto: '🌻', el: 'the sunflower', del: 'the sunflower' },
      { picto: '⛺', el: 'the tent', del: 'the tent' }
    ],
    personajes: [
      { picto: '🐕', el: 'the dog' },
      { picto: '🐈', el: 'the cat' },
      { picto: '👧', el: 'the girl' },
      { picto: '👦', el: 'the boy' },
      { picto: '🐰', el: 'the rabbit' },
      { picto: '🦆', el: 'the duck' },
      { picto: '⭐', el: 'the star' },
      { picto: '⚽', el: 'the ball' }
    ],
    niveles: [
      { id: 1, nombre: 'Level 1', descripcion: '2 characters', ordenes: 2 },
      { id: 2, nombre: 'Level 2', descripcion: '3 characters', ordenes: 3 },
      { id: 3, nombre: 'Level 3', descripcion: '4 characters', ordenes: 4 }
    ]
  }
};
