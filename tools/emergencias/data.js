/* ============================================================
   Datos: Emergencias (autonomía — reconocer una emergencia de
   verdad y practicar cómo pedir ayuda).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda,
     reconocer: [{ picto, situacion, opciones: string[3], correcta }],
     llamadas: [{ nombre, items: [{ picto, texto }] }] }
   'reconocer' es un quiz de una sola ronda (sin niveles): mezcla
   emergencias de verdad (fuego, alguien herido que no responde, no
   puede respirar) con cosas que NO son una emergencia (no encuentra
   el mando, se le quema un poco la comida) para que el contraste
   enseñe a distinguir. La opción correcta en una emergencia real es
   siempre pedir ayuda YA; en lo que no lo es, siempre resolverlo con
   calma — nunca "no hacer nada" ni "llamar al 112 por cualquier cosa"
   (llamar sin necesidad también es un error que se enseña aquí).
   'llamadas' es la práctica de pedir ayuda: SIEMPRE el mismo orden
   de 3 pasos (nombre → qué pasa → dónde estás), con el motor de
   ordenar de Lista de Tareas — solo cambia la emergencia descrita,
   para que se aprenda la estructura de la llamada, no un guion fijo.
   Sin niveles (regla 13 no aplica: cada ronda ya mezcla dificultad
   a propósito, como contraste didáctico, no como progresión).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    reconocer: [
      { picto: '🔥', situacion: 'Ves fuego de verdad en la cocina de tu casa.', opciones: ['Es una emergencia: pedir ayuda ya (llamar al 112 o avisar a un adulto)', 'No es una emergencia: puede esperar', 'Apagarlo tú solo con agua'], correcta: 0 },
      { picto: '📺', situacion: 'No encuentras el mando de la tele.', opciones: ['No es una emergencia: buscarlo con calma o esperar', 'Es una emergencia: llamar al 112', 'Gritar muy fuerte pidiendo ayuda'], correcta: 0 },
      { picto: '🤕', situacion: 'Alguien se ha caído y no puede levantarse ni hablar bien.', opciones: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: esperar a que se le pase', 'Moverlo tú para que se levante'], correcta: 0 },
      { picto: '🍝', situacion: 'Se te ha quemado un poco la comida.', opciones: ['No es una emergencia: apagar el fuego y ventilar con calma', 'Es una emergencia: llamar al 112', 'Salir corriendo de casa'], correcta: 0 },
      { picto: '🩸', situacion: 'Alguien se ha hecho una herida muy grande y sangra mucho.', opciones: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: ponerle una tirita', 'Esperar a ver si se le pasa solo'], correcta: 0 },
      { picto: '🧦', situacion: 'No encuentras un calcetín.', opciones: ['No es una emergencia: seguir buscando con calma', 'Es una emergencia: llamar al 112', 'Ponerte a llorar sin buscar'], correcta: 0 },
      { picto: '😮‍💨', situacion: 'Alguien no puede respirar bien y se pone de otro color.', opciones: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: esperar un rato', 'Darle algo de comer'], correcta: 0 },
      { picto: '🎮', situacion: 'Se te ha quedado sin batería el videojuego.', opciones: ['No es una emergencia: cargarlo con calma', 'Es una emergencia: llamar al 112', 'Avisar a la policía'], correcta: 0 },
      { picto: '🚗', situacion: 'Ves un accidente de coche en la calle y alguien está herido.', opciones: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: seguir caminando', 'Acercarte a mover el coche'], correcta: 0 },
      { picto: '🌧️', situacion: 'Está lloviendo y se te ha olvidado el paraguas.', opciones: ['No es una emergencia: buscar cobijo o esperar con calma', 'Es una emergencia: llamar al 112', 'Correr por la calzada'], correcta: 0 }
    ],
    llamadas: [
      { nombre: 'Hay fuego en la cocina', items: [
        { picto: '📛', texto: 'Decir tu nombre' },
        { picto: '🔥', texto: 'Decir qué está pasando: hay un fuego' },
        { picto: '📍', texto: 'Decir dónde estás' }
      ] },
      { nombre: 'Alguien se ha caído y no se levanta', items: [
        { picto: '📛', texto: 'Decir tu nombre' },
        { picto: '🤕', texto: 'Decir qué está pasando: alguien se ha caído' },
        { picto: '📍', texto: 'Decir dónde estás' }
      ] },
      { nombre: 'Ves un accidente de coche', items: [
        { picto: '📛', texto: 'Decir tu nombre' },
        { picto: '🚗', texto: 'Decir qué está pasando: hay un accidente' },
        { picto: '📍', texto: 'Decir dónde estás' }
      ] },
      { nombre: 'Un familiar no puede respirar bien', items: [
        { picto: '📛', texto: 'Decir tu nombre' },
        { picto: '😮‍💨', texto: 'Decir qué está pasando: no puede respirar bien' },
        { picto: '📍', texto: 'Decir dónde estás' }
      ] }
    ]
  },
  en: {
    porRonda: 8,
    reconocer: [
      { picto: '🔥', situacion: 'You see real fire in your kitchen.', opciones: ['It is an emergency: get help now (call 112 or tell an adult)', 'It is not an emergency: it can wait', 'Put it out yourself with water'], correcta: 0 },
      { picto: '📺', situacion: 'You cannot find the TV remote.', opciones: ['It is not an emergency: look for it calmly or wait', 'It is an emergency: call 112', 'Shout very loudly for help'], correcta: 0 },
      { picto: '🤕', situacion: 'Someone has fallen and cannot get up or speak properly.', opciones: ['It is an emergency: get help now', 'It is not an emergency: wait for it to pass', 'Move them yourself to make them stand up'], correcta: 0 },
      { picto: '🍝', situacion: 'Your food got a little burnt.', opciones: ['It is not an emergency: turn off the heat and air the room calmly', 'It is an emergency: call 112', 'Run out of the house'], correcta: 0 },
      { picto: '🩸', situacion: 'Someone has a very big wound and is bleeding a lot.', opciones: ['It is an emergency: get help now', 'It is not an emergency: put a plaster on it', 'Wait and see if it stops on its own'], correcta: 0 },
      { picto: '🧦', situacion: 'You cannot find a sock.', opciones: ['It is not an emergency: keep looking calmly', 'It is an emergency: call 112', 'Start crying without looking'], correcta: 0 },
      { picto: '😮‍💨', situacion: 'Someone cannot breathe well and changes colour.', opciones: ['It is an emergency: get help now', 'It is not an emergency: wait a while', 'Give them something to eat'], correcta: 0 },
      { picto: '🎮', situacion: 'Your video game ran out of battery.', opciones: ['It is not an emergency: charge it calmly', 'It is an emergency: call 112', 'Tell the police'], correcta: 0 },
      { picto: '🚗', situacion: 'You see a car accident on the street and someone is hurt.', opciones: ['It is an emergency: get help now', 'It is not an emergency: keep walking', 'Go move the car'], correcta: 0 },
      { picto: '🌧️', situacion: 'It is raining and you forgot your umbrella.', opciones: ['It is not an emergency: find shelter or wait calmly', 'It is an emergency: call 112', 'Run onto the road'], correcta: 0 }
    ],
    llamadas: [
      { nombre: 'There is a fire in the kitchen', items: [
        { picto: '📛', texto: 'Say your name' },
        { picto: '🔥', texto: 'Say what is happening: there is a fire' },
        { picto: '📍', texto: 'Say where you are' }
      ] },
      { nombre: 'Someone has fallen and cannot get up', items: [
        { picto: '📛', texto: 'Say your name' },
        { picto: '🤕', texto: 'Say what is happening: someone has fallen' },
        { picto: '📍', texto: 'Say where you are' }
      ] },
      { nombre: 'You see a car accident', items: [
        { picto: '📛', texto: 'Say your name' },
        { picto: '🚗', texto: 'Say what is happening: there is an accident' },
        { picto: '📍', texto: 'Say where you are' }
      ] },
      { nombre: 'A family member cannot breathe well', items: [
        { picto: '📛', texto: 'Say your name' },
        { picto: '😮‍💨', texto: 'Say what is happening: they cannot breathe well' },
        { picto: '📍', texto: 'Say where you are' }
      ] }
    ]
  }
};
