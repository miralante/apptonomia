/* ============================================================
   Datos: Dominó (razonamiento — juego de mesa real simplificado).
   Formato: DATA.es / DATA.en, cada uno con:
   { manoInicial, niveles: [{ id, nombre, descripcion, maxPips }] }
   Las fichas se GENERAN en app.js a partir de maxPips: todas las
   parejas [a, b] con 0 ≤ a ≤ b ≤ maxPips (con maxPips 3 son 10
   fichas; con 5, 21; con 6, las 28 del dominó completo). Se
   reparten 'manoInicial' fichas a la persona y al rival; el resto
   es el montón para robar.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es maxPips (3 → 5 → 6), es decir, cuántos valores distintos hay
   que reconocer. La mano (4 fichas), el rival y las reglas no
   cambian nunca.
   Adaptación clave frente a la versión anterior: la ficha se
   orienta SOLA al colocarla (nada de girarla a mano); solo se
   pregunta el lado cuando la ficha encaja en los dos extremos.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    manoInicial: 4,
    niveles: [
      { id: 1, nombre: 'Nivel 1', descripcion: 'Fichas del 0 al 3', maxPips: 3 },
      { id: 2, nombre: 'Nivel 2', descripcion: 'Fichas del 0 al 5', maxPips: 5 },
      { id: 3, nombre: 'Nivel 3', descripcion: 'Dominó completo (0 al 6)', maxPips: 6 }
    ]
  },
  en: {
    manoInicial: 4,
    niveles: [
      { id: 1, nombre: 'Level 1', descripcion: 'Tiles from 0 to 3', maxPips: 3 },
      { id: 2, nombre: 'Level 2', descripcion: 'Tiles from 0 to 5', maxPips: 5 },
      { id: 3, nombre: 'Level 3', descripcion: 'Full domino set (0 to 6)', maxPips: 6 }
    ]
  }
};
