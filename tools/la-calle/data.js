/* ============================================================
   Datos: La Calle (autonomía — movilidad comunitaria y seguridad
   en la calle: cruzar, transporte, perderse).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ picto, situacion, opciones: string[3], correcta }] }] }
   Cada situación describe algo que pasa en la calle; la opción
   correcta es siempre la más segura, nunca la más rápida ni la que
   parece más cómoda.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   situaciones muy claras (semáforo en rojo, un desconocido que pide
   que le acompañes); nivel 2 mantiene el mismo formato de 3 opciones
   y pasa a situaciones menos evidentes (semáforo parpadeando a
   mitad de cruce, alguien conocido de vista que ofrece llevarte).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Situaciones claras',
        estrellas: 1,
        items: [
          { picto: '🚦', situacion: 'Vas a cruzar la calle y el semáforo de peatones está en rojo.', opciones: ['Esperar a que se ponga verde', 'Cruzar rápido si no viene ningún coche', 'Cruzar por la mitad de la calle'], correcta: 0 },
          { picto: '🚦', situacion: 'El semáforo de peatones está verde.', opciones: ['Cruzar mirando a los dos lados', 'Cruzar corriendo sin mirar', 'Quedarte esperando aunque esté verde'], correcta: 0 },
          { picto: '🚸', situacion: 'Vas a cruzar por una calle que no tiene semáforo.', opciones: ['Mirar a los dos lados y cruzar por el paso de peatones', 'Cruzar por donde estás sin mirar', 'Cruzar corriendo por el medio de la calle'], correcta: 0 },
          { picto: '🚌', situacion: 'Estás esperando el autobús en la parada.', opciones: ['Esperar detrás de la línea hasta que pare', 'Salir a la calzada para verlo llegar antes', 'Subir corriendo aunque el autobús no haya parado'], correcta: 0 },
          { picto: '🚏', situacion: 'No sabes si el autobús que viene es el tuyo.', opciones: ['Mirar el número o preguntar al conductor', 'Subir a cualquier autobús que llegue', 'Cruzar la calle para verlo mejor'], correcta: 0 },
          { picto: '🧍', situacion: 'Un desconocido en la calle te dice que le acompañes a algún sitio.', opciones: ['Decir que no y alejarte hacia gente conocida', 'Acompañarlo si parece simpático', 'Seguirlo en silencio'], correcta: 0 },
          { picto: '🗺️', situacion: 'Te das cuenta de que te has perdido por la calle.', opciones: ['Pararte donde estás y pedir ayuda a un policía o a una tienda', 'Seguir caminando deprisa a ver si lo encuentras', 'Meterte por una calle que no conoces para explorar'], correcta: 0 },
          { picto: '🪪', situacion: 'Un policía te pregunta quién eres porque te has perdido.', opciones: ['Enseñarle tu identificación o decir tu nombre y el teléfono de un familiar', 'No decir nada y alejarte', 'Decir un nombre falso'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Situaciones menos claras',
        estrellas: 2,
        items: [
          { picto: '🚦', situacion: 'El semáforo de peatones empieza a parpadear en verde mientras estás cruzando.', opciones: ['Terminar de cruzar sin correr hasta la otra acera', 'Volver corriendo hacia atrás', 'Quedarte parado en medio de la calle'], correcta: 0 },
          { picto: '🚗', situacion: 'Un coche está aparcado justo en el paso de peatones y no te deja ver bien.', opciones: ['Asomarte con cuidado antes de cruzar, mirando a los dos lados', 'Cruzar rápido sin mirar porque tienes prisa', 'Pasar por delante del coche sin mirar'], correcta: 0 },
          { picto: '🚏', situacion: 'El autobús que esperabas se ha adelantado y ya se ha ido.', opciones: ['Esperar tranquilo al siguiente o mirar el horario', 'Correr por la calle para intentar alcanzarlo', 'Cruzar la calzada para pararlo'], correcta: 0 },
          { picto: '🧑', situacion: 'Alguien que no conoces se ofrece a llevarte a casa en coche porque hace mal tiempo.', opciones: ['Decir que no, gracias, y esperar a alguien conocido', 'Subir porque hace mal tiempo', 'Subir si parece una persona amable'], correcta: 0 },
          { picto: '🏬', situacion: 'Te pierdes dentro de un centro comercial muy grande.', opciones: ['Ir al mostrador de información o a una tienda y pedir ayuda', 'Salir a la calle a buscar solo', 'Sentarte en el suelo a esperar sin decir nada a nadie'], correcta: 0 },
          { picto: '📱', situacion: 'Te has perdido y llevas el móvil contigo.', opciones: ['Llamar a un familiar o persona de confianza para decir dónde estás', 'Apagar el móvil para ahorrar batería', 'Escribir a desconocidos pidiendo que vengan a buscarte'], correcta: 0 },
          { picto: '🚧', situacion: 'La acera está cortada por obras.', opciones: ['Buscar otro camino o cruzar con mucho cuidado mirando el tráfico', 'Meterte en la zona de obras aunque esté vallada', 'Caminar por la calzada sin mirar los coches'], correcta: 0 },
          { picto: '🌙', situacion: 'Se te ha hecho de noche y todavía estás fuera de casa.', opciones: ['Avisar a un adulto de confianza de dónde estás y volver por calles conocidas e iluminadas', 'Volver por un atajo desconocido y oscuro', 'Quedarte fuera sin avisar a nadie'], correcta: 0 }
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
        descripcion: 'Clear situations',
        estrellas: 1,
        items: [
          { picto: '🚦', situacion: 'You are about to cross and the pedestrian light is red.', opciones: ['Wait until it turns green', 'Cross quickly if no car is coming', 'Cross from the middle of the street'], correcta: 0 },
          { picto: '🚦', situacion: 'The pedestrian light is green.', opciones: ['Cross looking both ways', 'Cross running without looking', 'Keep waiting even though it is green'], correcta: 0 },
          { picto: '🚸', situacion: 'You are going to cross a street with no traffic light.', opciones: ['Look both ways and cross at the pedestrian crossing', 'Cross from where you are without looking', 'Cross running through the middle of the street'], correcta: 0 },
          { picto: '🚌', situacion: 'You are waiting for the bus at the stop.', opciones: ['Wait behind the line until it stops', 'Step onto the road to see it coming sooner', 'Get on running even though the bus has not stopped'], correcta: 0 },
          { picto: '🚏', situacion: "You don't know if the bus coming is yours.", opciones: ['Check the number or ask the driver', 'Get on any bus that arrives', 'Cross the street to see it better'], correcta: 0 },
          { picto: '🧍', situacion: 'A stranger on the street asks you to go with them somewhere.', opciones: ['Say no and move towards people you know', 'Go with them if they seem nice', 'Follow them in silence'], correcta: 0 },
          { picto: '🗺️', situacion: 'You realize you are lost on the street.', opciones: ['Stop where you are and ask a police officer or a shop for help', 'Keep walking fast to try to find it', 'Go down an unknown street to explore'], correcta: 0 },
          { picto: '🪪', situacion: 'A police officer asks who you are because you are lost.', opciones: ["Show your ID or say your name and a family member's phone number", 'Say nothing and walk away', 'Give a false name'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Less clear situations',
        estrellas: 2,
        items: [
          { picto: '🚦', situacion: 'The pedestrian light starts flashing green while you are crossing.', opciones: ['Finish crossing without running to the other side', 'Run back the way you came', 'Stand still in the middle of the street'], correcta: 0 },
          { picto: '🚗', situacion: 'A car is parked right on the crossing and blocks your view.', opciones: ['Peek out carefully before crossing, looking both ways', 'Cross quickly without looking because you are in a hurry', "Walk past the car's front without looking"], correcta: 0 },
          { picto: '🚏', situacion: 'The bus you were waiting for left early.', opciones: ['Wait calmly for the next one or check the timetable', 'Run down the street to try to catch it', 'Cross the road to stop it'], correcta: 0 },
          { picto: '🧑', situacion: 'Someone you do not know offers to drive you home because the weather is bad.', opciones: ['Say no thank you, and wait for someone you know', 'Get in because of the weather', 'Get in if they seem like a nice person'], correcta: 0 },
          { picto: '🏬', situacion: 'You get lost inside a very big shopping centre.', opciones: ['Go to the information desk or a shop and ask for help', 'Go outside to search on your own', 'Sit on the floor and wait without telling anyone'], correcta: 0 },
          { picto: '📱', situacion: 'You are lost and have your phone with you.', opciones: ['Call a family member or someone you trust and say where you are', 'Turn off the phone to save battery', 'Message strangers asking them to come get you'], correcta: 0 },
          { picto: '🚧', situacion: 'The pavement is blocked by roadworks.', opciones: ['Find another way or cross very carefully watching the traffic', 'Go into the fenced-off work area anyway', 'Walk on the road without watching for cars'], correcta: 0 },
          { picto: '🌙', situacion: 'It has become dark and you are still out of the house.', opciones: ['Tell a trusted adult where you are and go back through known, lit streets', 'Go back through an unknown, dark shortcut', 'Stay out without telling anyone'], correcta: 0 }
        ]
      }
    ]
  }
};
