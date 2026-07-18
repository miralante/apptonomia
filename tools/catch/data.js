/* ============================================================
   Data: Catch — level configuration.
   Format: niveles[] = { id, nombre, tamano (px, never < 64) }
   toquesPorRonda: taps needed to complete a round.
   To extend: add new levels to the array.
   ============================================================ */
const DATA = {
  toquesPorRonda: 10,
  niveles: [
    { id: 'grande', nombre: 'Grande', tamano: 120, estrellas: 1 },
    { id: 'mediano', nombre: 'Mediano', tamano: 90, estrellas: 2 },
    { id: 'pequeno', nombre: 'Pequeño', tamano: 64, estrellas: 3 }
  ],
  /* Emojis shown by the target (variety = motivation) */
  objetivos: ['⚽', '🎈', '⭐', '🍎', '🐥', '🌸', '🚗', '🐟', '🎁', '🦋']
};
