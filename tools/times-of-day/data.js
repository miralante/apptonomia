/* ============================================================
   Datos: Partes del Día (autonomía — organizar tareas diarias por
   momento del día).
   Formato: DATA[locale] = { porRonda, momentos: string[3] (Mañana,
     Tarde, Noche — compartidos por todos los niveles), niveles: [{
     id, nombre, descripcion, estrellas,
     items: [{ picto, tarea, momento }] }] }
   'momento' de cada item debe coincidir con uno de los valores de
   'momentos'. Al colocar bien una tarea, se añade a la lista visual
   de esa caja (no desaparece: la ronda construye 3 listas completas).
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   tareas con un momento del día muy obvio (desayunar, dormir…);
   nivel 2 mantiene 3 cajas y solo cambia a tareas menos evidentes
   (peinarse antes de salir, dejar la ropa preparada…), sin añadir
   ni quitar cajas.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 9,
    momentos: ['Mañana', 'Tarde', 'Noche'],
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Momentos muy claros',
        estrellas: 1,
        items: [
          { picto: '🥐', tarea: 'Desayunar', momento: 'Mañana' },
          { picto: '🛏️', tarea: 'Levantarte de la cama', momento: 'Mañana' },
          { picto: '🎒', tarea: 'Ir al colegio', momento: 'Mañana' },
          { picto: '🪥', tarea: 'Lavarte los dientes al despertar', momento: 'Mañana' },
          { picto: '🍽️', tarea: 'Comer', momento: 'Tarde' },
          { picto: '📚', tarea: 'Hacer los deberes', momento: 'Tarde' },
          { picto: '🍎', tarea: 'Merendar', momento: 'Tarde' },
          { picto: '⚽', tarea: 'Jugar en el parque', momento: 'Tarde' },
          { picto: '🍲', tarea: 'Cenar', momento: 'Noche' },
          { picto: '🌙', tarea: 'Ponerte el pijama', momento: 'Noche' },
          { picto: '🛁', tarea: 'Bañarte antes de dormir', momento: 'Noche' },
          { picto: '😴', tarea: 'Dormir', momento: 'Noche' },
          { picto: '👋', tarea: 'Decir buenos días', momento: 'Mañana' },
          { picto: '🌆', tarea: 'Volver a casa del colegio', momento: 'Tarde' }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Momentos menos claros',
        estrellas: 2,
        items: [
          { picto: '☀️', tarea: 'Abrir las cortinas al levantarte', momento: 'Mañana' },
          { picto: '🧴', tarea: 'Peinarte antes de ir al cole', momento: 'Mañana' },
          { picto: '🚌', tarea: 'Coger el autobús del colegio', momento: 'Mañana' },
          { picto: '🧦', tarea: 'Ponerte los calcetines antes de salir de casa', momento: 'Mañana' },
          { picto: '📖', tarea: 'Leer un rato después de comer', momento: 'Tarde' },
          { picto: '🎨', tarea: 'Hacer una manualidad después del cole', momento: 'Tarde' },
          { picto: '🐕', tarea: 'Sacar a pasear al perro', momento: 'Tarde' },
          { picto: '🧃', tarea: 'Merendar un zumo', momento: 'Tarde' },
          { picto: '🔦', tarea: 'Apagar la luz para dormir', momento: 'Noche' },
          { picto: '📱', tarea: 'Dejar el móvil cargando', momento: 'Noche' },
          { picto: '🧸', tarea: 'Coger el peluche para dormir', momento: 'Noche' },
          { picto: '👖', tarea: 'Dejar la ropa preparada para mañana', momento: 'Noche' },
          { picto: '🛒', tarea: 'Ayudar a guardar la compra de la tarde', momento: 'Tarde' },
          { picto: '🦷', tarea: 'Lavarte los dientes antes de acostarte', momento: 'Noche' }
        ]
      }
    ]
  },
  en: {
    porRonda: 9,
    momentos: ['Morning', 'Afternoon', 'Night'],
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: 'Very clear times of day',
        estrellas: 1,
        items: [
          { picto: '🥐', tarea: 'Have breakfast', momento: 'Morning' },
          { picto: '🛏️', tarea: 'Get out of bed', momento: 'Morning' },
          { picto: '🎒', tarea: 'Go to school', momento: 'Morning' },
          { picto: '🪥', tarea: 'Brush your teeth when you wake up', momento: 'Morning' },
          { picto: '🍽️', tarea: 'Have lunch', momento: 'Afternoon' },
          { picto: '📚', tarea: 'Do your homework', momento: 'Afternoon' },
          { picto: '🍎', tarea: 'Have a snack', momento: 'Afternoon' },
          { picto: '⚽', tarea: 'Play at the park', momento: 'Afternoon' },
          { picto: '🍲', tarea: 'Have dinner', momento: 'Night' },
          { picto: '🌙', tarea: 'Put on your pyjamas', momento: 'Night' },
          { picto: '🛁', tarea: 'Take a bath before bed', momento: 'Night' },
          { picto: '😴', tarea: 'Sleep', momento: 'Night' },
          { picto: '👋', tarea: 'Say good morning', momento: 'Morning' },
          { picto: '🌆', tarea: 'Come home from school', momento: 'Afternoon' }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Less obvious times of day',
        estrellas: 2,
        items: [
          { picto: '☀️', tarea: 'Open the curtains when you get up', momento: 'Morning' },
          { picto: '🧴', tarea: 'Comb your hair before school', momento: 'Morning' },
          { picto: '🚌', tarea: 'Catch the school bus', momento: 'Morning' },
          { picto: '🧦', tarea: 'Put your socks on before leaving home', momento: 'Morning' },
          { picto: '📖', tarea: 'Read for a while after lunch', momento: 'Afternoon' },
          { picto: '🎨', tarea: 'Do a craft after school', momento: 'Afternoon' },
          { picto: '🐕', tarea: 'Take the dog for a walk', momento: 'Afternoon' },
          { picto: '🧃', tarea: 'Have a juice for your snack', momento: 'Afternoon' },
          { picto: '🔦', tarea: 'Turn off the light to sleep', momento: 'Night' },
          { picto: '📱', tarea: 'Leave your phone charging', momento: 'Night' },
          { picto: '🧸', tarea: 'Get your teddy bear for bed', momento: 'Night' },
          { picto: '👖', tarea: "Lay out tomorrow's clothes", momento: 'Night' },
          { picto: '🛒', tarea: 'Help put away the afternoon shopping', momento: 'Afternoon' },
          { picto: '🦷', tarea: 'Brush your teeth before bed', momento: 'Night' }
        ]
      }
    ]
  }
};
