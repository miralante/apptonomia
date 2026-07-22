/* ============================================================
   Data: Connect the Dots — shape catalog.
   Format: SHAPES = [{ id, emoji, dots: [{x, y}, ...] }]
     dots: percentages (0-100) of the play area, in the order
       they must be tapped (1..dots.length). The app always draws
       the closing segment back to the first dot, so every shape
       is a single closed outline.
   Each round picks a random dot count between 5 and 10, then a
   random shape with that count — there is no level selection.
   Shapes are plain straight-line outlines; the star shapes trace
   a classic multi-point star (alternating outer/inner vertices,
   or — for star5/star9 — every other vertex of a regular polygon,
   a pentagram/nonagram construction).
   Coordinates are locale-independent; only the shape name (via
   the 'shape_<id>' i18n key) changes between ES and EN.
   ============================================================ */
var SHAPES = [
  { id: 'house', emoji: '🏠', dots: [
    { x: 50, y: 8 }, { x: 88, y: 42 }, { x: 88, y: 92 }, { x: 12, y: 92 }, { x: 12, y: 42 }
  ] },
  { id: 'boat', emoji: '⛵', dots: [
    { x: 15, y: 85 }, { x: 85, y: 85 }, { x: 60, y: 50 }, { x: 60, y: 10 }, { x: 30, y: 50 }
  ] },
  { id: 'star5', emoji: '⭐', dots: [
    { x: 50, y: 10 }, { x: 74.7, y: 86 }, { x: 10.1, y: 39 }, { x: 89.9, y: 39 }, { x: 25.3, y: 86 }
  ] },
  { id: 'gem', emoji: '💎', dots: [
    { x: 30, y: 15 }, { x: 70, y: 15 }, { x: 90, y: 50 }, { x: 70, y: 90 }, { x: 30, y: 90 }, { x: 10, y: 50 }
  ] },
  { id: 'arrow', emoji: '➡️', dots: [
    { x: 92, y: 50 }, { x: 62, y: 20 }, { x: 62, y: 38 }, { x: 10, y: 38 },
    { x: 10, y: 62 }, { x: 62, y: 62 }, { x: 62, y: 80 }
  ] },
  { id: 'fish', emoji: '🐟', dots: [
    { x: 85, y: 50 }, { x: 60, y: 25 }, { x: 25, y: 35 }, { x: 5, y: 15 },
    { x: 20, y: 50 }, { x: 5, y: 85 }, { x: 25, y: 65 }
  ] },
  { id: 'sparkle', emoji: '✴️', dots: [
    { x: 50, y: 8 }, { x: 61.3, y: 38.7 }, { x: 92, y: 50 }, { x: 61.3, y: 61.3 },
    { x: 50, y: 92 }, { x: 38.7, y: 61.3 }, { x: 8, y: 50 }, { x: 38.7, y: 38.7 }
  ] },
  { id: 'rocket', emoji: '🚀', dots: [
    { x: 50, y: 5 }, { x: 65, y: 35 }, { x: 65, y: 70 }, { x: 85, y: 90 }, { x: 60, y: 85 },
    { x: 50, y: 95 }, { x: 40, y: 85 }, { x: 15, y: 90 }, { x: 35, y: 70 }
  ] },
  { id: 'star9', emoji: '✨', dots: [
    { x: 50, y: 10 }, { x: 64.4, y: 91.5 }, { x: 23, y: 19.8 }, { x: 86.4, y: 73 }, { x: 8.6, y: 44.7 },
    { x: 91.4, y: 44.7 }, { x: 13.6, y: 73 }, { x: 77, y: 19.8 }, { x: 35.6, y: 91.5 }
  ] },
  { id: 'star10', emoji: '🌟', dots: [
    { x: 50, y: 5 }, { x: 60.6, y: 35.4 }, { x: 92.8, y: 36.1 }, { x: 67.1, y: 55.6 }, { x: 76.4, y: 86.4 },
    { x: 50, y: 68 }, { x: 23.6, y: 86.4 }, { x: 32.9, y: 55.6 }, { x: 7.2, y: 36.1 }, { x: 39.4, y: 35.4 }
  ] }
];
