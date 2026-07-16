/* ============================================================
   Datos: Lista de Tareas (autonomía — organizar tareas mixtas:
   casa, trabajo y personales, en el orden lógico del día).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     listas: [{ nombre, items: [{ picto, texto }] }] }] }
   'items' está en el orden correcto (el primero se hace primero).
   A diferencia de La Casa (pasos de UNA tarea del hogar), aquí cada
   'items' mezcla tareas independientes de distintos ámbitos del día
   (casa, trabajo, cuidado personal) que hay que ordenar por lógica
   o cronología, no solo pasos de una sola actividad.
   Progresión (regla 13, un solo cambio por nivel, mismo patrón que
   La Casa): nivel 1 usa listas de 3 tareas; nivel 2 mantiene el
   mismo tipo de contenido y solo sube a 4 tareas por lista.
   Para ampliar: añadir listas al array del nivel correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 5,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: '3 tareas',
        estrellas: 1,
        listas: [
          { nombre: 'Tu mañana antes de salir', items: [
            { picto: '👕', texto: 'Vestirte' },
            { picto: '🥐', texto: 'Desayunar' },
            { picto: '🎒', texto: 'Coger la mochila y salir' }
          ] },
          { nombre: 'Llegar al trabajo', items: [
            { picto: '🚌', texto: 'Coger el autobús' },
            { picto: '🏢', texto: 'Entrar al trabajo' },
            { picto: '🕐', texto: 'Fichar la entrada' }
          ] },
          { nombre: 'Una tarea en el taller', items: [
            { picto: '📦', texto: 'Coger las cajas' },
            { picto: '🏷️', texto: 'Poner las etiquetas' },
            { picto: '📚', texto: 'Apilarlas en su sitio' }
          ] },
          { nombre: 'Terminar la jornada', items: [
            { picto: '🧹', texto: 'Recoger tu puesto' },
            { picto: '🕐', texto: 'Fichar la salida' },
            { picto: '🚪', texto: 'Salir del trabajo' }
          ] },
          { nombre: 'Volver a casa', items: [
            { picto: '🚌', texto: 'Coger el autobús de vuelta' },
            { picto: '🔑', texto: 'Abrir la puerta de casa' },
            { picto: '🛋️', texto: 'Descansar un rato' }
          ] },
          { nombre: 'Antes de cenar', items: [
            { picto: '🧺', texto: 'Dejar la ropa de trabajo' },
            { picto: '🧼', texto: 'Lavarte las manos' },
            { picto: '🍲', texto: 'Poner la mesa para cenar' }
          ] },
          { nombre: 'Tu noche', items: [
            { picto: '🍽️', texto: 'Cenar' },
            { picto: '🪥', texto: 'Lavarte los dientes' },
            { picto: '😴', texto: 'Irte a dormir' }
          ] },
          { nombre: 'Preparar el día siguiente', items: [
            { picto: '⏰', texto: 'Poner el despertador' },
            { picto: '🎒', texto: 'Dejar la mochila preparada' },
            { picto: '🌙', texto: 'Apagar la luz' }
          ] }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: '4 tareas',
        estrellas: 2,
        listas: [
          { nombre: 'Antes de salir a trabajar', items: [
            { picto: '⏰', texto: 'Despertarte con la alarma' },
            { picto: '🪥', texto: 'Asearte' },
            { picto: '👕', texto: 'Vestirte con la ropa de trabajo' },
            { picto: '🥐', texto: 'Desayunar' }
          ] },
          { nombre: 'Llegar y prepararte en el trabajo', items: [
            { picto: '🚌', texto: 'Coger el autobús' },
            { picto: '🕐', texto: 'Fichar la entrada' },
            { picto: '🧤', texto: 'Ponerte los guantes de trabajo' },
            { picto: '📋', texto: 'Ver la lista de tareas del día' }
          ] },
          { nombre: 'Un encargo del taller', items: [
            { picto: '📋', texto: 'Leer el encargo' },
            { picto: '📦', texto: 'Preparar el material' },
            { picto: '🔧', texto: 'Hacer el trabajo' },
            { picto: '✅', texto: 'Revisar que está bien hecho' }
          ] },
          { nombre: 'Tu descanso en el trabajo', items: [
            { picto: '🕐', texto: 'Esperar a que sea la hora' },
            { picto: '🥪', texto: 'Sacar la comida' },
            { picto: '🍽️', texto: 'Comer con calma' },
            { picto: '🔙', texto: 'Volver a tu puesto' }
          ] },
          { nombre: 'Terminar y volver a casa', items: [
            { picto: '🧹', texto: 'Recoger tu puesto de trabajo' },
            { picto: '🕐', texto: 'Fichar la salida' },
            { picto: '🚌', texto: 'Coger el autobús de vuelta' },
            { picto: '🔑', texto: 'Llegar a casa' }
          ] },
          { nombre: 'Tu tarde en casa', items: [
            { picto: '🧺', texto: 'Cambiarte de ropa' },
            { picto: '📺', texto: 'Descansar un rato' },
            { picto: '🛒', texto: 'Ir a comprar lo que falte' },
            { picto: '🍲', texto: 'Preparar la cena' }
          ] },
          { nombre: 'Antes de dormir', items: [
            { picto: '🍽️', texto: 'Cenar' },
            { picto: '🧴', texto: 'Ducharte' },
            { picto: '🪥', texto: 'Lavarte los dientes' },
            { picto: '😴', texto: 'Meterte en la cama' }
          ] },
          { nombre: 'Dejar todo listo para mañana', items: [
            { picto: '👕', texto: 'Preparar la ropa de trabajo' },
            { picto: '🎒', texto: 'Dejar la mochila lista' },
            { picto: '⏰', texto: 'Poner el despertador' },
            { picto: '🌙', texto: 'Apagar la luz' }
          ] }
        ]
      }
    ]
  },
  en: {
    porRonda: 5,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: '3 tasks',
        estrellas: 1,
        listas: [
          { nombre: 'Your morning before leaving', items: [
            { picto: '👕', texto: 'Get dressed' },
            { picto: '🥐', texto: 'Have breakfast' },
            { picto: '🎒', texto: 'Grab your bag and go' }
          ] },
          { nombre: 'Getting to work', items: [
            { picto: '🚌', texto: 'Catch the bus' },
            { picto: '🏢', texto: 'Go into work' },
            { picto: '🕐', texto: 'Clock in' }
          ] },
          { nombre: 'A task at the workshop', items: [
            { picto: '📦', texto: 'Get the boxes' },
            { picto: '🏷️', texto: 'Put on the labels' },
            { picto: '📚', texto: 'Stack them in their place' }
          ] },
          { nombre: 'Finishing your shift', items: [
            { picto: '🧹', texto: 'Tidy your workstation' },
            { picto: '🕐', texto: 'Clock out' },
            { picto: '🚪', texto: 'Leave work' }
          ] },
          { nombre: 'Getting back home', items: [
            { picto: '🚌', texto: 'Catch the bus back' },
            { picto: '🔑', texto: 'Open the front door' },
            { picto: '🛋️', texto: 'Rest for a while' }
          ] },
          { nombre: 'Before dinner', items: [
            { picto: '🧺', texto: 'Put away your work clothes' },
            { picto: '🧼', texto: 'Wash your hands' },
            { picto: '🍲', texto: 'Set the table for dinner' }
          ] },
          { nombre: 'Your evening', items: [
            { picto: '🍽️', texto: 'Have dinner' },
            { picto: '🪥', texto: 'Brush your teeth' },
            { picto: '😴', texto: 'Go to sleep' }
          ] },
          { nombre: 'Getting ready for tomorrow', items: [
            { picto: '⏰', texto: 'Set the alarm' },
            { picto: '🎒', texto: 'Leave your bag ready' },
            { picto: '🌙', texto: 'Turn off the light' }
          ] }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: '4 tasks',
        estrellas: 2,
        listas: [
          { nombre: 'Before leaving for work', items: [
            { picto: '⏰', texto: 'Wake up to the alarm' },
            { picto: '🪥', texto: 'Wash and get ready' },
            { picto: '👕', texto: 'Put on your work clothes' },
            { picto: '🥐', texto: 'Have breakfast' }
          ] },
          { nombre: 'Arriving and getting ready at work', items: [
            { picto: '🚌', texto: 'Catch the bus' },
            { picto: '🕐', texto: 'Clock in' },
            { picto: '🧤', texto: 'Put on your work gloves' },
            { picto: '📋', texto: "Check the day's task list" }
          ] },
          { nombre: 'A workshop order', items: [
            { picto: '📋', texto: 'Read the order' },
            { picto: '📦', texto: 'Get the materials ready' },
            { picto: '🔧', texto: 'Do the work' },
            { picto: '✅', texto: 'Check it is done well' }
          ] },
          { nombre: 'Your break at work', items: [
            { picto: '🕐', texto: 'Wait until it is time' },
            { picto: '🥪', texto: 'Get out your food' },
            { picto: '🍽️', texto: 'Eat calmly' },
            { picto: '🔙', texto: 'Go back to your workstation' }
          ] },
          { nombre: 'Finishing and heading home', items: [
            { picto: '🧹', texto: 'Tidy your workstation' },
            { picto: '🕐', texto: 'Clock out' },
            { picto: '🚌', texto: 'Catch the bus back' },
            { picto: '🔑', texto: 'Arrive home' }
          ] },
          { nombre: 'Your afternoon at home', items: [
            { picto: '🧺', texto: 'Change your clothes' },
            { picto: '📺', texto: 'Rest for a while' },
            { picto: '🛒', texto: 'Go buy what is missing' },
            { picto: '🍲', texto: 'Get dinner ready' }
          ] },
          { nombre: 'Before bed', items: [
            { picto: '🍽️', texto: 'Have dinner' },
            { picto: '🧴', texto: 'Take a shower' },
            { picto: '🪥', texto: 'Brush your teeth' },
            { picto: '😴', texto: 'Get into bed' }
          ] },
          { nombre: 'Getting everything ready for tomorrow', items: [
            { picto: '👕', texto: 'Get your work clothes ready' },
            { picto: '🎒', texto: 'Leave your bag ready' },
            { picto: '⏰', texto: 'Set the alarm' },
            { picto: '🌙', texto: 'Turn off the light' }
          ] }
        ]
      }
    ]
  }
};
