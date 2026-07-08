/* ============================================================
   Datos: Atrapa — configuración de niveles.
   Formato: niveles[] = { id, nombreKey, tamano (px, nunca < 64) }
   nombreKey apunta a un texto registrado en strings.js (App.i18n.t).
   toquesPorRonda: toques necesarios para completar una ronda.
   objetivos: emojis que va mostrando el objetivo (iguales en es/en).
   Para ampliar: añadir niveles nuevos al array. app.js usa
   DATA[App.i18n.locale()].
   ============================================================ */
const NIVELES = [
  { id: 'grande', nombreKey: 'nivelGrande', tamano: 120, estrellas: 1 },
  { id: 'mediano', nombreKey: 'nivelMediano', tamano: 90, estrellas: 2 },
  { id: 'pequeno', nombreKey: 'nivelPequeno', tamano: 64, estrellas: 3 }
];

const OBJETIVOS = ['⚽', '🎈', '⭐', '🍎', '🐥', '🌸', '🚗', '🐟', '🎁', '🦋'];

const DATA = {
  es: { toquesPorRonda: 10, niveles: NIVELES, objetivos: OBJETIVOS },
  en: { toquesPorRonda: 10, niveles: NIVELES, objetivos: OBJETIVOS }
};
