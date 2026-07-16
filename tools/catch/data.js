/* ============================================================
   Datos: Atrapa — configuración de niveles.
   Formato: niveles[] = { id, nombre, tamano (px, nunca < 64) }
   toquesPorRonda: toques necesarios para completar una ronda.
   Para ampliar: añadir niveles nuevos al array.
   ============================================================ */
const DATA = {
  toquesPorRonda: 10,
  niveles: [
    { id: 'grande', nombre: 'Grande', tamano: 120, estrellas: 1 },
    { id: 'mediano', nombre: 'Mediano', tamano: 90, estrellas: 2 },
    { id: 'pequeno', nombre: 'Pequeño', tamano: 64, estrellas: 3 }
  ],
  /* Emojis que va mostrando el objetivo (variedad = motivación) */
  objetivos: ['⚽', '🎈', '⭐', '🍎', '🐥', '🌸', '🚗', '🐟', '🎁', '🦋']
};
