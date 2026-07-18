/* ============================================================
   Data: Calm (guided breathing and relaxation). ES/EN.
   Format: DATA.<language>.niveles = [{ id, nombre, descripcion,
     estrellas, ciclos (number of inhale/exhale repetitions) }]
   app.js uses DATA[App.i18n.locale()] || DATA.es.
   To extend: add a session with a different number of cycles.
   ============================================================ */
const DATA = {
  es: {
    niveles: [
      { id: 1, nombre: 'Sesión corta', descripcion: '3 respiraciones', estrellas: 1, ciclos: 3 },
      { id: 2, nombre: 'Sesión media', descripcion: '5 respiraciones', estrellas: 2, ciclos: 5 },
      { id: 3, nombre: 'Sesión larga', descripcion: '8 respiraciones', estrellas: 3, ciclos: 8 }
    ]
  },
  en: {
    niveles: [
      { id: 1, nombre: 'Short session', descripcion: '3 breaths', estrellas: 1, ciclos: 3 },
      { id: 2, nombre: 'Medium session', descripcion: '5 breaths', estrellas: 2, ciclos: 5 },
      { id: 3, nombre: 'Long session', descripcion: '8 breaths', estrellas: 3, ciclos: 8 }
    ]
  }
};
