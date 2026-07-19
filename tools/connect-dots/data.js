/* ============================================================
   Data: Connect the Dots — eye-hand coordination.
   Format: DATA.es / DATA.en = [{ id, name, count, shapes }]
     count: how many numbered dots the level's shapes use (5, 7, 9).
     shapes: [{ id, emoji, name, dots: [{x, y}, ...] }]
       dots: 'count' points as percentages (0-100) of the play
         area, in the order they must be tapped (1..count). The
         app always draws the closing segment count→1, so every
         shape is a single closed outline.
   Progression (rule 13, one variable per level): the only thing
   that changes between levels is the number of dots (5 → 7 → 9);
   how the shape is traced never changes.
   Shapes are plain straight-line outlines (some are 5- or
   9-pointed stars, traced by connecting every other vertex of a
   regular polygon — a classic pentagram/nonagram construction).
   Coordinates are the same in ES and EN; only names differ.
   ============================================================ */
var SHAPES_L1 = [
  { id: 'house', emoji: '🏠', dots: [
    { x: 50, y: 8 }, { x: 88, y: 42 }, { x: 88, y: 92 }, { x: 12, y: 92 }, { x: 12, y: 42 }
  ] },
  { id: 'boat', emoji: '⛵', dots: [
    { x: 15, y: 85 }, { x: 85, y: 85 }, { x: 60, y: 50 }, { x: 60, y: 10 }, { x: 30, y: 50 }
  ] },
  { id: 'star5', emoji: '⭐', dots: [
    { x: 50, y: 10 }, { x: 74.7, y: 86 }, { x: 10.1, y: 39 }, { x: 89.9, y: 39 }, { x: 25.3, y: 86 }
  ] }
];

var SHAPES_L2 = [
  { id: 'arrow', emoji: '➡️', dots: [
    { x: 92, y: 50 }, { x: 62, y: 20 }, { x: 62, y: 38 }, { x: 10, y: 38 },
    { x: 10, y: 62 }, { x: 62, y: 62 }, { x: 62, y: 80 }
  ] },
  { id: 'fish', emoji: '🐟', dots: [
    { x: 85, y: 50 }, { x: 60, y: 25 }, { x: 25, y: 35 }, { x: 5, y: 15 },
    { x: 20, y: 50 }, { x: 5, y: 85 }, { x: 25, y: 65 }
  ] }
];

var SHAPES_L3 = [
  { id: 'rocket', emoji: '🚀', dots: [
    { x: 50, y: 5 }, { x: 65, y: 35 }, { x: 65, y: 70 }, { x: 85, y: 90 }, { x: 60, y: 85 },
    { x: 50, y: 95 }, { x: 40, y: 85 }, { x: 15, y: 90 }, { x: 35, y: 70 }
  ] },
  { id: 'star9', emoji: '✨', dots: [
    { x: 50, y: 10 }, { x: 64.4, y: 91.5 }, { x: 23, y: 19.8 }, { x: 86.4, y: 73 }, { x: 8.6, y: 44.7 },
    { x: 91.4, y: 44.7 }, { x: 13.6, y: 73 }, { x: 77, y: 19.8 }, { x: 35.6, y: 91.5 }
  ] }
];

var DATA = {
  es: [
    { id: 'l1', name: 'Nivel 1 · 5 puntos', count: 5, shapes: SHAPES_L1 },
    { id: 'l2', name: 'Nivel 2 · 7 puntos', count: 7, shapes: SHAPES_L2 },
    { id: 'l3', name: 'Nivel 3 · 9 puntos', count: 9, shapes: SHAPES_L3 }
  ],
  en: [
    { id: 'l1', name: 'Level 1 · 5 dots', count: 5, shapes: SHAPES_L1 },
    { id: 'l2', name: 'Level 2 · 7 dots', count: 7, shapes: SHAPES_L2 },
    { id: 'l3', name: 'Level 3 · 9 dots', count: 9, shapes: SHAPES_L3 }
  ]
};
