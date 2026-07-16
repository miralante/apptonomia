/* ============================================================
   Datos: Las Damas (razonamiento — lógica, anticipación y
   planificación en un juego de mesa clásico adaptado).
   Formato: DATA.es / DATA.en, cada uno con:
   { niveles: [{ id, nombre, descripcion, habilidad }] }
   'habilidad' controla cómo juega el rival (lógica en app.js,
   misma clave en ambos idiomas):
     'azar'    → el rival elige una jugada legal al azar.
     'come'    → además, si el rival puede comer una ficha, come.
     'protege' → además, evita mover a casillas donde tú podrías
                 comerle la ficha en el siguiente turno.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es cuánto se fija el rival — cada nivel le añade UNA sola
   habilidad nueva (azar → come cuando puede → también se protege).
   El tablero (6×6), las fichas (6 por bando) y las reglas no
   cambian nunca.
   Adaptación del juego real: tablero 6×6 en vez de 8×8, comer no es
   obligatorio, sin saltos múltiples. La coronación sí se conserva
   (llegar al final convierte la ficha en dama 👑, que también va
   hacia atrás): es una recompensa clara con una regla simple.
   Perder no se castiga (regla 5): mensaje de ánimo con un consejo
   y jugar otra vez; el cierre por bloqueo compara fichas y el
   empate se celebra (como en el Dominó).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    niveles: [
      { id: 1, nombre: 'Nivel 1', descripcion: 'Rival tranquilo', habilidad: 'azar' },
      { id: 2, nombre: 'Nivel 2', descripcion: 'Rival que come', habilidad: 'come' },
      { id: 3, nombre: 'Nivel 3', descripcion: 'Rival que también se protege', habilidad: 'protege' }
    ]
  },
  en: {
    niveles: [
      { id: 1, nombre: 'Level 1', descripcion: 'Relaxed rival', habilidad: 'azar' },
      { id: 2, nombre: 'Level 2', descripcion: 'Rival who captures', habilidad: 'come' },
      { id: 3, nombre: 'Level 3', descripcion: 'Rival who also protects itself', habilidad: 'protege' }
    ]
  }
};
