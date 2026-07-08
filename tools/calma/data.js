/* ============================================================
   Datos: Calma (respiración y relajación guiadas). ES/EN.
   Formato: DATA.<idioma>.niveles = [{ id, nombre, descripcion,
     estrellas, ciclos (número de repeticiones de coger/soltar aire) }]
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   Para ampliar: añadir una sesión con otro número de ciclos.
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
