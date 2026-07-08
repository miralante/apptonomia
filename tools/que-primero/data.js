/* ============================================================
   Datos: ¿Qué hago primero? (autonomía — priorización de tareas).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ picto, situacion, opciones: string[3], correcta }] }] }
   Cada situación presenta dos o más cosas que se podrían hacer; la
   opción correcta es siempre la más urgente o necesaria (seguridad,
   plazo, ayudar a alguien), nunca la más apetecible.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   contrastes de urgencia muy obvios (algo que no puede esperar frente
   a ocio); nivel 2 mantiene el mismo formato de 3 opciones y solo
   hace el contraste más sutil (dos tareas legítimas, pero una con
   un plazo real).
   Para ampliar: añadir items al array del nivel correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Urgencias claras',
        estrellas: 1,
        items: [
          { picto: '📚', situacion: 'Tienes deberes para entregar mañana. También te apetece ver la tele.', opciones: ['Hacer los deberes', 'Ver la tele', 'Merendar'], correcta: 0 },
          { picto: '🦷', situacion: 'Se te ha acabado la pasta de dientes y tienes que lavarte los dientes. También quieres seguir jugando.', opciones: ['Decírselo a un adulto para comprar más', 'Seguir jugando', 'Esperar a mañana'], correcta: 0 },
          { picto: '🚌', situacion: 'El autobús del colegio llega en cinco minutos. Todavía no te has puesto los zapatos.', opciones: ['Ponerte los zapatos ya', 'Terminar de desayunar tranquilo', 'Buscar un juguete'], correcta: 0 },
          { picto: '🩹', situacion: 'Te has hecho una herida jugando. También quieres seguir jugando con tus amigos.', opciones: ['Decírselo a un adulto para curarte', 'Seguir jugando', 'Esperar a que deje de doler'], correcta: 0 },
          { picto: '🍲', situacion: 'La comida se está quemando en el fuego. Estás viendo tu programa favorito.', opciones: ['Avisar a un adulto de que se quema', 'Terminar de ver el programa', 'Cambiar de canal'], correcta: 0 },
          { picto: '⏰', situacion: 'Suena la alarma del colegio y llegas tarde. Quieres seguir en la cama un rato más.', opciones: ['Levantarte ya', 'Quedarte cinco minutos más', 'Apagar la alarma y dormir'], correcta: 0 },
          { picto: '🧸', situacion: 'Tu hermano pequeño se ha caído y llora. Estás jugando a un videojuego.', opciones: ['Ir a ver si está bien', 'Terminar la partida primero', 'Subir el volumen'], correcta: 0 },
          { picto: '🚿', situacion: 'Se ha caído agua en el suelo de la cocina y alguien puede resbalar. Quieres seguir merendando.', opciones: ['Limpiarlo o avisar a un adulto', 'Terminar de merendar', 'Dejarlo para luego'], correcta: 0 },
          { picto: '📱', situacion: 'Un familiar te llama porque necesita ayuda. Estás viendo un vídeo.', opciones: ['Contestar y ayudar', 'Terminar el vídeo primero', 'Llamar luego'], correcta: 0 },
          { picto: '🐶', situacion: 'Tu perro necesita salir a hacer sus necesidades. Quieres seguir dibujando.', opciones: ['Sacarlo ahora', 'Terminar el dibujo', 'Esperar a que aguante'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Urgencias menos claras',
        estrellas: 2,
        items: [
          { picto: '🎒', situacion: 'Tienes que preparar la mochila para una excursión de mañana temprano y hoy te queda poco tiempo libre. También te apetece leer un rato.', opciones: ['Preparar la mochila primero', 'Leer un rato primero', 'Dejarlo todo para mañana por la mañana'], correcta: 0 },
          { picto: '🧺', situacion: 'Es tu turno de poner la lavadora antes de las ocho para que esté seca a tiempo. Todavía te queda tiempo libre hoy.', opciones: ['Poner la lavadora ahora', 'Esperar a más tarde', 'Pedir a otro que la ponga'], correcta: 0 },
          { picto: '📅', situacion: 'Tienes una cita médica en media hora. Un amigo te invita a jugar ahora mismo.', opciones: ['Prepararte para la cita', 'Jugar un rato antes', 'Llegar tarde a la cita'], correcta: 0 },
          { picto: '🌱', situacion: 'Las plantas llevan varios días sin agua y hoy hace mucho calor. También quieres terminar un juego.', opciones: ['Regarlas ahora', 'Terminar el juego primero', 'Regarlas mañana'], correcta: 0 },
          { picto: '📖', situacion: 'Tienes un examen importante pasado mañana y aún no has empezado a estudiar. Hoy también podrías adelantar tu tiempo libre.', opciones: ['Empezar a estudiar hoy', 'Dejarlo todo para mañana', 'Ver la tele todo el día'], correcta: 0 },
          { picto: '🧹', situacion: 'Vienen visitas a casa en una hora y tu habitación está desordenada. Preferirías seguir jugando.', opciones: ['Ordenar la habitación ahora', 'Seguir jugando y ordenar luego', 'Dejarlo para otro día'], correcta: 0 },
          { picto: '💊', situacion: 'Tienes que tomar una medicina a una hora concreta y ya casi es la hora. Estás en medio de un juego.', opciones: ['Tomar la medicina a su hora', 'Terminar el juego primero', 'Tomarla más tarde si se te olvida'], correcta: 0 },
          { picto: '🚗', situacion: 'Salís de viaje en diez minutos y aún no has recogido tus cosas. Quieres terminar de dibujar.', opciones: ['Recoger tus cosas ya', 'Terminar el dibujo', 'Dejar tus cosas sin recoger'], correcta: 0 }
        ]
      }
    ]
  },
  en: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: 'Clear urgencies',
        estrellas: 1,
        items: [
          { picto: '📚', situacion: 'You have homework due tomorrow. You also feel like watching TV.', opciones: ['Do your homework', 'Watch TV', 'Have a snack'], correcta: 0 },
          { picto: '🦷', situacion: 'You have run out of toothpaste and need to brush your teeth. You also want to keep playing.', opciones: ['Tell a trusted adult so they can buy more', 'Keep playing', 'Wait until tomorrow'], correcta: 0 },
          { picto: '🚌', situacion: "The school bus arrives in five minutes. You still haven't put your shoes on.", opciones: ['Put your shoes on now', 'Finish breakfast slowly', 'Look for a toy'], correcta: 0 },
          { picto: '🩹', situacion: 'You hurt yourself while playing. You also want to keep playing with your friends.', opciones: ['Tell a trusted adult so they can help you', 'Keep playing', 'Wait until it stops hurting'], correcta: 0 },
          { picto: '🍲', situacion: 'The food is burning on the stove. You are watching your favorite show.', opciones: ['Tell an adult it is burning', 'Finish watching the show', 'Change the channel'], correcta: 0 },
          { picto: '⏰', situacion: 'Your school alarm goes off and you are running late. You want to stay in bed a bit longer.', opciones: ['Get up now', 'Stay five more minutes', 'Turn off the alarm and sleep'], correcta: 0 },
          { picto: '🧸', situacion: 'Your little brother fell and is crying. You are playing a video game.', opciones: ['Go check if he is okay', 'Finish the round first', 'Turn up the volume'], correcta: 0 },
          { picto: '🚿', situacion: 'Water has spilled on the kitchen floor and someone could slip. You want to keep having your snack.', opciones: ['Clean it up or tell an adult', 'Finish your snack', 'Leave it for later'], correcta: 0 },
          { picto: '📱', situacion: 'A family member calls you because they need help. You are watching a video.', opciones: ['Answer and help', 'Finish the video first', 'Call back later'], correcta: 0 },
          { picto: '🐶', situacion: 'Your dog needs to go outside for the toilet. You want to keep drawing.', opciones: ['Take him out now', 'Finish the drawing', 'Wait until he can hold it'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Less clear urgencies',
        estrellas: 2,
        items: [
          { picto: '🎒', situacion: "You need to pack your bag for an early trip tomorrow and you don't have much free time today. You also feel like reading for a while.", opciones: ['Pack your bag first', 'Read for a while first', 'Leave it all for tomorrow morning'], correcta: 0 },
          { picto: '🧺', situacion: "It's your turn to put the washing machine on before eight so it dries in time. You still have free time today.", opciones: ['Put the washing machine on now', 'Wait until later', 'Ask someone else to do it'], correcta: 0 },
          { picto: '📅', situacion: "You have a doctor's appointment in half an hour. A friend invites you to play right now.", opciones: ['Get ready for the appointment', 'Play for a while first', 'Be late for the appointment'], correcta: 0 },
          { picto: '🌱', situacion: "The plants haven't been watered for days and it's very hot today. You also want to finish a game.", opciones: ['Water them now', 'Finish the game first', 'Water them tomorrow'], correcta: 0 },
          { picto: '📖', situacion: "You have an important exam the day after tomorrow and haven't started studying yet. Today you could also start your free time earlier.", opciones: ['Start studying today', 'Leave it all for tomorrow', 'Watch TV all day'], correcta: 0 },
          { picto: '🧹', situacion: 'Visitors are coming to your house in an hour and your room is messy. You would rather keep playing.', opciones: ['Tidy your room now', 'Keep playing and tidy later', 'Leave it for another day'], correcta: 0 },
          { picto: '💊', situacion: "You need to take medicine at a specific time and it's almost time. You are in the middle of a game.", opciones: ['Take the medicine on time', 'Finish the game first', 'Take it later if you remember'], correcta: 0 },
          { picto: '🚗', situacion: "You are leaving on a trip in ten minutes and haven't packed your things yet. You want to finish drawing.", opciones: ['Pack your things now', 'Finish the drawing', 'Leave your things unpacked'], correcta: 0 }
        ]
      }
    ]
  }
};
