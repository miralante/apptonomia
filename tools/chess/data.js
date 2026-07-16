/* ============================================================
   Datos: El Ajedrez (razonamiento — planificación, anticipación
   y razonamiento espacial con el juego de mesa clásico adaptado).
   Formato: DATA.es / DATA.en, cada uno con:
   { piezas:  { porRonda, niveles: [{ id, nombre, descripcion, pieza }] },
     partida: { niveles: [{ id, nombre, descripcion, habilidad }] } }
   Dos actividades independientes elegibles desde un menú (regla 10),
   como en Emergencias y La Compra:
   - 'piezas' (Las piezas): puzzles de recoger estrellas ⭐ para
     aprender cómo mueve cada pieza. Los tableros se generan al vuelo
     con un paseo aleatorio de movimientos legales (patrón El Camino):
     las estrellas se dejan en casillas visitadas, así el puzzle
     SIEMPRE tiene solución por construcción y no se puede memorizar.
     Sin rival, sin fallo posible: solo se pueden tocar casillas
     legales. Regla 13: la única variable por nivel es LA PIEZA
     (torre recto → alfil diagonal → dama ambos → caballo salto).
   - 'partida' (Mini partida): duelo en tablero 5×5 con las 4 piezas
     aprendidas + el rey. Sin peones, sin jaque, sin enroque: se gana
     al CAPTURAR el rey del rival. Regla 13: la única variable es
     cuánto se fija el rival — cada nivel añade UNA habilidad
     ('azar' → 'captura' come si puede y remata al rey → 'protege'
     además evita dejar su rey o la pieza movida a tiro).
   Adaptación: perder no se castiga (regla 5) — ánimo con un consejo
   y otra partida; los cierres por bloqueo comparan piezas y el
   empate se celebra (como en Las Damas y el Dominó).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    piezas: {
      porRonda: 4,
      niveles: [
        { id: 1, nombre: 'Nivel 1', descripcion: 'La torre ♖ va recto', pieza: 'torre' },
        { id: 2, nombre: 'Nivel 2', descripcion: 'El alfil ♗ va en diagonal', pieza: 'alfil' },
        { id: 3, nombre: 'Nivel 3', descripcion: 'La dama ♕ va recto y en diagonal', pieza: 'dama' },
        { id: 4, nombre: 'Nivel 4', descripcion: 'El caballo ♘ salta en L', pieza: 'caballo' }
      ]
    },
    partida: {
      niveles: [
        { id: 1, nombre: 'Nivel 1', descripcion: 'Rival tranquilo', habilidad: 'azar' },
        { id: 2, nombre: 'Nivel 2', descripcion: 'Rival que captura', habilidad: 'captura' },
        { id: 3, nombre: 'Nivel 3', descripcion: 'Rival que también se protege', habilidad: 'protege' }
      ]
    }
  },
  en: {
    piezas: {
      porRonda: 4,
      niveles: [
        { id: 1, nombre: 'Level 1', descripcion: 'The rook ♖ moves straight', pieza: 'torre' },
        { id: 2, nombre: 'Level 2', descripcion: 'The bishop ♗ moves diagonally', pieza: 'alfil' },
        { id: 3, nombre: 'Level 3', descripcion: 'The queen ♕ moves straight and diagonally', pieza: 'dama' },
        { id: 4, nombre: 'Level 4', descripcion: 'The knight ♘ jumps in an L', pieza: 'caballo' }
      ]
    },
    partida: {
      niveles: [
        { id: 1, nombre: 'Level 1', descripcion: 'Relaxed rival', habilidad: 'azar' },
        { id: 2, nombre: 'Level 2', descripcion: 'Rival who captures', habilidad: 'captura' },
        { id: 3, nombre: 'Level 3', descripcion: 'Rival who also protects itself', habilidad: 'protege' }
      ]
    }
  }
};
