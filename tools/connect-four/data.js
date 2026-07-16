/* ============================================================
   Datos: Cuatro en Raya (razonamiento — lógica, anticipación y
   razonamiento espacial; Conecta 4 adaptado).
   Formato: DATA.es / DATA.en, cada uno con:
   { niveles: [{ id, nombre, descripcion, habilidad }] }
   'habilidad' controla cómo juega el rival (lógica en app.js,
   misma clave en ambos idiomas):
     'azar'    → el rival elige una columna libre al azar.
     'gana'    → además, si puede completar su línea de cuatro, lo hace.
     'bloquea' → además, si tú vas a completar tu línea, te la tapa.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es cuánto se fija el rival — cada nivel le añade UNA sola
   habilidad nueva (azar → remata su línea → también bloquea la
   tuya), exactamente igual que en Tres en Raya. El tablero (6
   columnas × 5 filas), las fichas y las reglas no cambian nunca.
   Adaptación: se toca la COLUMNA entera (un solo botón grande por
   columna) y la ficha cae sola hasta abajo; sin cronómetro ni caída
   automática. Perder no se castiga (regla 5): ánimo con un consejo
   y jugar otra vez; el empate (tablero lleno) también se celebra.
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
