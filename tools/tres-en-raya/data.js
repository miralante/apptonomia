/* ============================================================
   Datos: Tres en Raya (razonamiento — lógica y anticipación).
   Formato: DATA.es / DATA.en, cada uno con:
   { niveles: [{ id, nombre, descripcion, habilidad }] }
   'habilidad' controla cómo juega el rival (lógica en app.js,
   misma clave en ambos idiomas):
     'azar'    → el rival elige una casilla libre al azar.
     'gana'    → además, si el rival puede completar su línea, lo hace.
     'bloquea' → además, si tú vas a completar tu línea, te la tapa.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es cuánto se fija el rival — cada nivel le añade UNA sola
   habilidad nueva (azar → remata su línea → también bloquea la
   tuya). El tablero, las fichas y las reglas no cambian nunca.
   Adaptación: perder no se castiga (regla 5) — sin "game over",
   se anima y se ofrece jugar otra vez; el empate también se celebra.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    niveles: [
      { id: 1, nombre: 'Nivel 1', descripcion: 'Rival tranquilo', habilidad: 'azar' },
      { id: 2, nombre: 'Nivel 2', descripcion: 'Rival que remata', habilidad: 'gana' },
      { id: 3, nombre: 'Nivel 3', descripcion: 'Rival que también tapa', habilidad: 'bloquea' }
    ]
  },
  en: {
    niveles: [
      { id: 1, nombre: 'Level 1', descripcion: 'Relaxed rival', habilidad: 'azar' },
      { id: 2, nombre: 'Level 2', descripcion: 'Rival who finishes lines', habilidad: 'gana' },
      { id: 3, nombre: 'Level 3', descripcion: 'Rival who also blocks', habilidad: 'bloquea' }
    ]
  }
};
