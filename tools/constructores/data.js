/* ============================================================
   Apptonomia — Constructores (datos)
   Bloques disponibles y plantillas predefinidas.
   
   Niveles de dificultad (un solo cambio por nivel):
   - Nivel 1: Grid 6x4, 4 bloques básicos, plantillas simples
   - Nivel 2: Grid 8x5, 6 bloques, plantillas intermedias
   - Nivel 3: Grid 10x6, 8 bloques, plantillas complejas
   
   ============================================================ */

var DATA = {};

// Tamaños de cuadrícula por nivel
DATA.gridSizes = {
  1: { cols: 6, rows: 4 },
  2: { cols: 8, rows: 5 },
  3: { cols: 10, rows: 6 }
};

// Bloques disponibles (ordenados por nivel)
DATA.bloques = {
  1: [
    { id: 'tierra',   picto: '🟫', nombre: 'Tierra' },
    { id: 'piedra',   picto: '⬜', nombre: 'Piedra' },
    { id: 'madera',   picto: '🟧', nombre: 'Madera' },
    { id: 'agua',     picto: '💧', nombre: 'Agua' }
  ],
  2: [
    { id: 'tierra',   picto: '🟫', nombre: 'Tierra' },
    { id: 'piedra',   picto: '⬜', nombre: 'Piedra' },
    { id: 'madera',   picto: '🟧', nombre: 'Madera' },
    { id: 'agua',     picto: '💧', nombre: 'Agua' },
    { id: 'césped',   picto: '🌿', nombre: 'Césped' },
    { id: 'techo',    picto: '🔺', nombre: 'Techo' }
  ],
  3: [
    { id: 'tierra',   picto: '🟫', nombre: 'Tierra' },
    { id: 'piedra',   picto: '⬜', nombre: 'Piedra' },
    { id: 'madera',   picto: '🟧', nombre: 'Madera' },
    { id: 'agua',     picto: '💧', nombre: 'Agua' },
    { id: 'césped',   picto: '🌿', nombre: 'Césped' },
    { id: 'techo',    picto: '🔺', nombre: 'Techo' },
    { id: 'ladrillo', picto: '🧱', nombre: 'Ladrillo' },
    { id: 'arena',    picto: '🏖️', nombre: 'Arena' }
  ]
};

// Plantillas predefinidas
// Cada plantilla tiene: id, nombreKey (clave i18n), gridSize, y una matriz de bloques
// null = vacío, string = id del bloque
DATA.plantillas = [
  // Nivel 1: Plantillas simples
  {
    id: 'casita',
    nivel: 1,
    gridSize: { cols: 6, rows: 4 },
    nombre: 'plantilla.casita',
    matriz: [
      [null, null, 'techo', 'techo', null, null],
      [null, 'madera', 'madera', 'madera', 'madera', null],
      [null, 'madera', 'madera', 'agua', 'madera', null],
      ['césped', 'césped', 'tierra', 'tierra', 'césped', 'césped']
    ]
  },
  {
    id: 'castillo',
    nivel: 1,
    gridSize: { cols: 6, rows: 4 },
    nombre: 'plantilla.castillo',
    matriz: [
      ['piedra', 'piedra', 'piedra', 'piedra', 'piedra', 'piedra'],
      ['piedra', null, null, null, null, 'piedra'],
      ['piedra', 'piedra', 'piedra', 'piedra', 'piedra', 'piedra'],
      ['tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra']
    ]
  },
  
  // Nivel 2: Plantillas intermedias
  {
    id: 'piscina',
    nivel: 2,
    gridSize: { cols: 8, rows: 5 },
    nombre: 'plantilla.piscina',
    matriz: [
      ['césped', 'césped', 'césped', 'césped', 'césped', 'césped', 'césped', 'césped'],
      ['césped', 'piedra', 'piedra', 'piedra', 'piedra', 'piedra', 'piedra', 'césped'],
      ['césped', 'piedra', 'agua', 'agua', 'agua', 'agua', 'piedra', 'césped'],
      ['césped', 'piedra', 'agua', 'agua', 'agua', 'agua', 'piedra', 'césped'],
      ['césped', 'césped', 'piedra', 'piedra', 'piedra', 'piedra', 'césped', 'césped']
    ]
  },
  {
    id: 'puente',
    nivel: 2,
    gridSize: { cols: 8, rows: 5 },
    nombre: 'plantilla.puente',
    matriz: [
      [null, null, null, null, null, null, null, null],
      [null, null, 'madera', 'madera', 'madera', 'madera', null, null],
      ['agua', 'agua', 'madera', 'madera', 'agua', 'agua', 'agua', 'agua'],
      ['agua', 'agua', 'agua', 'agua', 'agua', 'agua', 'agua', 'agua'],
      [null, null, null, null, null, null, null, null]
    ]
  },
  
  // Nivel 3: Plantillas complejas
  {
    id: 'ciudad',
    nivel: 3,
    gridSize: { cols: 10, rows: 6 },
    nombre: 'plantilla.ciudad',
    matriz: [
      ['tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra'],
      ['piedra', 'techo', 'piedra', null, 'ladrillo', 'techo', 'ladrillo', null, 'madera', 'techo'],
      ['piedra', 'piedra', 'piedra', null, 'ladrillo', 'ladrillo', 'ladrillo', null, 'madera', 'madera'],
      ['tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra'],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null]
    ]
  },
  {
    id: 'rio',
    nivel: 3,
    gridSize: { cols: 10, rows: 6 },
    nombre: 'plantilla.rio',
    matriz: [
      ['césped', 'césped', 'césped', 'agua', 'agua', 'agua', 'agua', 'césped', 'césped', 'césped'],
      ['césped', 'madera', 'madera', 'agua', 'agua', 'agua', 'agua', 'piedra', 'piedra', 'piedra'],
      ['tierra', 'tierra', 'tierra', 'agua', 'agua', 'agua', 'agua', 'tierra', 'tierra', 'tierra'],
      ['tierra', null, null, 'agua', 'agua', 'agua', 'agua', null, null, 'tierra'],
      ['piedra', null, null, 'agua', 'agua', 'agua', 'agua', null, null, 'madera'],
      ['piedra', 'piedra', 'piedra', 'agua', 'agua', 'agua', 'agua', 'madera', 'madera', 'madera']
    ]
  }
];

// Obtener plantillas por nivel
DATA.getPlantillasPorNivel = function(nivel) {
  return DATA.plantillas.filter(function(p) { return p.nivel <= nivel; });
};
