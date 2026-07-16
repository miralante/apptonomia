/* ============================================================
   Datos: ¿Dónde está? (memoria/atención — direccionamiento y
   localización: vocabulario espacial izquierda/derecha/encima/debajo).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda,
     objetos: [{ picto, el, del }]
       'el'  → nombre con artículo para ser sujeto ("el perro").
       'del' → forma con "de" para la instrucción ("del perro",
               "de la casa"); en inglés ambas son "the dog".
     niveles: [{ id, nombre, descripcion, eje, relaciones }] }
   'eje' controla la disposición ('fila' | 'columna' | 'mixto') y
   'relaciones' qué conceptos se preguntan ('izq'|'der'|'enc'|'deb').
   Los ítems se GENERAN en app.js: 3 objetos distintos al azar
   (referencia en el centro, objetivo a un lado, distractor al otro)
   y una relación del nivel. El texto de cada relación está en
   strings.js (rel_*, mira_*).
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es el eje espacial trabajado (horizontal → vertical → ambos
   mezclados). Siempre 3 objetos en pantalla.
   Los pictos son iguales en ambos idiomas; los nombres no.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    objetos: [
      { picto: '🏠', el: 'la casa', del: 'de la casa' },
      { picto: '🌳', el: 'el árbol', del: 'del árbol' },
      { picto: '🚗', el: 'el coche', del: 'del coche' },
      { picto: '🐕', el: 'el perro', del: 'del perro' },
      { picto: '⭐', el: 'la estrella', del: 'de la estrella' },
      { picto: '🌸', el: 'la flor', del: 'de la flor' },
      { picto: '🍎', el: 'la manzana', del: 'de la manzana' },
      { picto: '⚽', el: 'la pelota', del: 'de la pelota' },
      { picto: '🪑', el: 'la silla', del: 'de la silla' },
      { picto: '🐦', el: 'el pájaro', del: 'del pájaro' }
    ],
    niveles: [
      { id: 1, nombre: 'Nivel 1', descripcion: 'Izquierda y derecha', eje: 'fila', relaciones: ['izq', 'der'] },
      { id: 2, nombre: 'Nivel 2', descripcion: 'Encima y debajo', eje: 'columna', relaciones: ['enc', 'deb'] },
      { id: 3, nombre: 'Nivel 3', descripcion: 'Todo mezclado', eje: 'mixto', relaciones: ['izq', 'der', 'enc', 'deb'] }
    ]
  },
  en: {
    porRonda: 8,
    objetos: [
      { picto: '🏠', el: 'the house', del: 'the house' },
      { picto: '🌳', el: 'the tree', del: 'the tree' },
      { picto: '🚗', el: 'the car', del: 'the car' },
      { picto: '🐕', el: 'the dog', del: 'the dog' },
      { picto: '⭐', el: 'the star', del: 'the star' },
      { picto: '🌸', el: 'the flower', del: 'the flower' },
      { picto: '🍎', el: 'the apple', del: 'the apple' },
      { picto: '⚽', el: 'the ball', del: 'the ball' },
      { picto: '🪑', el: 'the chair', del: 'the chair' },
      { picto: '🐦', el: 'the bird', del: 'the bird' }
    ],
    niveles: [
      { id: 1, nombre: 'Level 1', descripcion: 'Left and right', eje: 'fila', relaciones: ['izq', 'der'] },
      { id: 2, nombre: 'Level 2', descripcion: 'Above and below', eje: 'columna', relaciones: ['enc', 'deb'] },
      { id: 3, nombre: 'Level 3', descripcion: 'All mixed', eje: 'mixto', relaciones: ['izq', 'der', 'enc', 'deb'] }
    ]
  }
};
