/* ============================================================
   Datos: ¿Qué falta? (memoria visual a corto plazo).
   Formato: niveles = [{ id, nombreKey, descripcionKey, estrellas,
     cantidad: number (objetos a memorizar) }]
   nombreKey/descripcionKey apuntan a textos registrados en
   strings.js (App.i18n.t).
   pool: string[] — pictos de los que se sortean las escenas
   (debe tener bastantes más elementos que la mayor 'cantidad').
   Los pictos son emojis: iguales en es/en.
   Para ampliar: añadir pictos a 'pool' o niveles nuevos.
   app.js usa DATA[App.i18n.locale()].
   ============================================================ */
const POOL = [
  '🍎', '🍌', '⚽', '📚', '🧸', '🎈', '🔑', '👟',
  '🕶️', '☂️', '🎧', '📱', '✏️', '🧦', '🍪', '🚗',
  '🎁', '🧩', '🖍️', '🍉'
];

const NIVELES = [
  { id: 1, nombreKey: 'nivel1', descripcionKey: 'descripcion4', estrellas: 1, cantidad: 4 },
  { id: 2, nombreKey: 'nivel2', descripcionKey: 'descripcion5', estrellas: 2, cantidad: 5 },
  { id: 3, nombreKey: 'nivel3', descripcionKey: 'descripcion6', estrellas: 3, cantidad: 6 }
];

const DATA = {
  es: { porRonda: 6, pool: POOL, niveles: NIVELES },
  en: { porRonda: 6, pool: POOL, niveles: NIVELES }
};
