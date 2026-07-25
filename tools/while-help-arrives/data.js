/* ============================================================
   Datos: Mientras Llega la Ayuda (autonomía — qué hacer después
   de llamar al 112, mientras llega la ambulancia / bomberos /
   policía).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda,
     queHago: [{ picto, situacion, opciones: string[3], correcta }],
     pasos: [{ nombre, items: [{ picto, texto }] }] }
   'queHago' es un quiz de 8 rondas (sin niveles): cada situación
   es real (fuego, herido grave, hemorragia fuerte, gas, desmayado,
   accidentado, alergia, atragantamiento). La opción correcta es
   SIEMPRE la acción segura taught en primeros auxilios básicos
   (salir, no mover, presionar, posición lateral, etc.). Las otras
   son errores reales muy comunes (mover al herido, dar agua,
   aplicar barro, provocar vómito, esperar parado sin hacer nada).
   NUNCA "no hacer nada" se ofrece como opción correcta — el
   family-pedagogical line: siempre hay algo seguro que se puede
   hacer (a veces lo único es "salir y mantener la distancia").
   'pasos' es práctica de ordenar (motor de task-list): para un
   tipo de emergencia, ordenar las 3 acciones inmediatas en el
   orden lógico. La estructura varía con la emergencia para que
   se APRENDA a secuenciar, no un guion fijo.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: {
    porRonda: 8,
    queHago: [
      { picto: '🔥', situacion: 'Hay fuego en la cocina y acabas de llamar al 112. ¿Qué haces ahora?', opciones: ['Salir de casa, cerrar la puerta al salir y esperar la ayuda en la calle', 'Volver a entrar para apagar el fuego con agua', 'Esconderte dentro del baño'], correcta: 0 },
      { picto: '🚑', situacion: 'Alguien se ha caído y está sangrando mucho. Acabas de llamar al 112.', opciones: ['Presionar la herida con una tela limpia y no soltarla hasta que llegue la ayuda', 'Darle agua para que beba', 'Esperar parado a su lado sin hacer nada'], correcta: 0 },
      { picto: '😵', situacion: 'Una persona se ha desmayado y no responde. Ya has llamado al 112.', opciones: ['Ponerla de lado con cuidado, hablarle y no dejarla sola', 'Echarle agua en la cara para que se despierte', 'Moverla y sentarla en una silla'], correcta: 0 },
      { picto: '😮‍💨', situacion: 'Alguien no puede respirar bien y se le cambia el color. Acabas de llamar al 112.', opciones: ['Aflojarle la ropa, mantenerlo sentado y no darle nada por la boca', 'Darle algo de comer o de beber', 'Tumbarlo boca arriba bien plano'], correcta: 0 },
      { picto: '💨', situacion: 'Huele mucho a gas en casa. Ya has llamado al 112.', opciones: ['Salir sin encender nada y esperar la ayuda en la calle', 'Encender la luz para ver mejor', 'Abrir una ventana y quedarte dentro'], correcta: 0 },
      { picto: '🚗', situacion: 'Hay un accidente de coche y alguien está herido. Ya has llamado al 112.', opciones: ['Ponerte en un sitio seguro y NO mover al herido', 'Mover al herido para apartarlo del coche', 'Acercarte al coche para ver si puedes arrancarlo'], correcta: 0 },
      { picto: '🐝', situacion: 'A una persona alérgica le ha picado una avispa y se le hincha mucho. Acabas de llamar al 112.', opciones: ['Mantenerla tranquila, sentada y sin darle nada hasta que llegue la ayuda', 'Ponerle barro en la picadura', 'Darle una pastilla que tengas en casa'], correcta: 0 },
      { picto: '💊', situacion: 'Un niño pequeño se ha tragado unas pastillas. Ya has llamado al 112.', opciones: ['Esperar la ayuda sin darle de comer ni de beber y no provocar el vómito', 'Darle mucha agua para que las expulse', 'Hacerle vomitar metiéndole el dedo en la boca'], correcta: 0 }
    ],
    pasos: [
      { nombre: '🔥 Fuego en la cocina', items: [
        { picto: '🚪', texto: 'Salir de la cocina' },
        { picto: '🔒', texto: 'Cerrar la puerta al salir' },
        { picto: '🛑', texto: 'Esperar la ayuda en la calle' }
      ] },
      { nombre: '🩸 Herida que sangra mucho', items: [
        { picto: '🧼', texto: 'Poner una tela limpia en la herida' },
        { picto: '✋', texto: 'Presionar fuerte sin soltar' },
        { picto: '⏱️', texto: 'Mantener la presión hasta que llegue la ayuda' }
      ] },
      { nombre: '😵 Alguien se ha desmayado', items: [
        { picto: '🗣️', texto: 'Hablarle para ver si responde' },
        { picto: '↩️', texto: 'Ponerlo de lado con cuidado' },
        { picto: '👀', texto: 'Quedarse a su lado hasta que llegue la ayuda' }
      ] },
      { nombre: '💨 Olor fuerte a gas', items: [
        { picto: '🚪', texto: 'Salir de casa' },
        { picto: '🚫', texto: 'No encender la luz ni nada' },
        { picto: '📞', texto: 'Llamar al 112 desde fuera' }
      ] }
    ]
  },
  en: {
    porRonda: 8,
    queHago: [
      { picto: '🔥', situacion: 'There is a fire in the kitchen and you have just called 112. What do you do now?', opciones: ['Leave the house, close the door behind you, and wait for help outside', 'Go back in to put the fire out with water', 'Hide inside the bathroom'], correcta: 0 },
      { picto: '🚑', situacion: 'Someone has fallen and is bleeding a lot. You have just called 112.', opciones: ['Press the wound with a clean cloth and do not let go until help arrives', 'Give them water to drink', 'Stand next to them and wait without doing anything'], correcta: 0 },
      { picto: '😵', situacion: 'A person has fainted and is not responding. You have just called 112.', opciones: ['Lay them on their side gently, talk to them, and do not leave them alone', 'Pour water on their face to wake them up', 'Move them and sit them in a chair'], correcta: 0 },
      { picto: '😮‍💨', situacion: 'Someone cannot breathe well and is changing colour. You have just called 112.', opciones: ['Loosen their clothes, keep them sitting, and do not give them anything to eat or drink', 'Give them something to eat or drink', 'Lay them flat on their back'], correcta: 0 },
      { picto: '💨', situacion: 'There is a strong smell of gas at home. You have just called 112.', opciones: ['Leave without turning anything on and wait for help out on the street', 'Turn the light on to see better', 'Open a window and stay inside'], correcta: 0 },
      { picto: '🚗', situacion: 'There is a car accident and someone is hurt. You have just called 112.', opciones: ['Stand in a safe place and DO NOT move the injured person', 'Move the injured person away from the car', 'Walk up to the car to see if you can start it'], correcta: 0 },
      { picto: '🐝', situacion: 'An allergic person has been stung by a wasp and is swelling a lot. You have just called 112.', opciones: ['Keep them calm, sitting, and do not give them anything until help arrives', 'Put mud on the sting', 'Give them a pill you have at home'], correcta: 0 },
      { picto: '💊', situacion: 'A small child has swallowed some pills. You have just called 112.', opciones: ['Wait for help without giving them food or drink and do not make them vomit', 'Give them lots of water to flush them out', 'Make them vomit by putting your finger in their mouth'], correcta: 0 }
    ],
    pasos: [
      { nombre: '🔥 Fire in the kitchen', items: [
        { picto: '🚪', texto: 'Leave the kitchen' },
        { picto: '🔒', texto: 'Close the door behind you' },
        { picto: '🛑', texto: 'Wait for help out on the street' }
      ] },
      { nombre: '🩸 A wound that bleeds a lot', items: [
        { picto: '🧼', texto: 'Put a clean cloth on the wound' },
        { picto: '✋', texto: 'Press firmly without letting go' },
        { picto: '⏱️', texto: 'Keep pressing until help arrives' }
      ] },
      { nombre: '😵 Someone has fainted', items: [
        { picto: '🗣️', texto: 'Talk to them to see if they respond' },
        { picto: '↩️', texto: 'Lay them on their side gently' },
        { picto: '👀', texto: 'Stay beside them until help arrives' }
      ] },
      { nombre: '💨 Strong smell of gas', items: [
        { picto: '🚪', texto: 'Leave the house' },
        { picto: '🚫', texto: 'Do not turn on the light or anything' },
        { picto: '📞', texto: 'Call 112 from outside' }
      ] }
    ]
  }
};
