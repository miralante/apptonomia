/* ============================================================
   Datos: Mi Cuerpo Me Avisa (emociones — interocepción: notar las
   señales del propio cuerpo y elegir qué hacer).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ text, options: string[3], correct: indice }] }] }
   'text' describe una señal del cuerpo; la opción correcta es
   siempre cuidar de esa señal (comer, beber, descansar, respirar,
   contarlo a un adulto de confianza si hace falta) — nunca
   ignorarla ni aguantar.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   señales físicas muy claras (hambre, sed, sueño, frío/calor);
   nivel 2 mantiene el mismo formato de 3 opciones y pasa a señales
   más sutiles, el puente cuerpo-emoción (nervios, tensión, nudo en
   la garganta antes de llorar), conectando con Calma y ¿Cómo me
   siento?.
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
        descripcion: 'Señales claras del cuerpo',
        estrellas: 1,
        items: [
          { text: 'Te suena la tripa y notas que tienes hambre.', options: ['Comer algo', 'Beber agua', 'Dormir un rato'], correct: 0 },
          { text: 'Notas la boca seca y tienes sed.', options: ['Beber agua', 'Comer algo', 'Ponerte el abrigo'], correct: 0 },
          { text: 'Se te cierran los ojos y bostezas mucho.', options: ['Descansar o dormir un rato', 'Seguir jugando sin parar', 'Beber agua'], correct: 0 },
          { text: 'Te duele la cabeza.', options: ['Decírselo a un adulto de confianza', 'Seguir jugando sin decir nada', 'Gritar muy fuerte'], correct: 0 },
          { text: 'Notas el corazón muy acelerado después de correr mucho.', options: ['Parar un momento y descansar', 'Seguir corriendo más rápido', 'Aguantar la respiración'], correct: 0 },
          { text: 'Tienes ganas de ir al baño.', options: ['Ir al baño ahora', 'Esperar mucho rato', 'Decir que no pasa nada'], correct: 0 },
          { text: 'Notas que tienes mucho calor y estás sudando.', options: ['Beber agua y quitarte una prenda', 'Ponerte más ropa', 'Seguir corriendo al sol'], correct: 0 },
          { text: 'Notas que tienes frío y tiemblas un poco.', options: ['Ponerte una prenda de abrigo', 'Quitarte ropa', 'No decir nada a nadie'], correct: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'El cuerpo y las emociones',
        estrellas: 2,
        items: [
          { text: 'Notas que el estómago se te encoge antes de un examen.', options: ['Respirar despacio y decir cómo te sientes', 'Aguantarte sin decir nada', 'Salir corriendo de la clase'], correct: 0 },
          { text: 'Te tiemblan las manos y notas que estás muy nervioso.', options: ['Hacer una respiración tranquila, como en Calma', 'Apretar los puños muy fuerte', 'Ignorarlo y seguir sin parar'], correct: 0 },
          { text: 'Notas que se te tensan los hombros y aprietas los dientes.', options: ['Parar un momento y relajar el cuerpo', 'Seguir tenso todo el día', 'Golpear algo'], correct: 0 },
          { text: 'Te sientes muy cansado aunque no hayas hecho mucho ejercicio.', options: ['Descansar y decírselo a un adulto si sigue pasando', 'Forzarte a seguir igual', 'No decir nada a nadie'], correct: 0 },
          { text: 'Notas un nudo en la garganta y ganas de llorar.', options: ['Decir cómo te sientes a alguien de confianza', 'Aguantarte las ganas de llorar', 'Reírte para disimular'], correct: 0 },
          { text: 'Te cuesta concentrarte y notas la cabeza espesa.', options: ['Parar un momento a descansar los ojos y la mente', 'Seguir igual sin descansar', 'Ponerte a gritar'], correct: 0 },
          { text: 'Notas mareo después de dar muchas vueltas jugando.', options: ['Sentarte tranquilo hasta que se te pase', 'Seguir dando vueltas más rápido', 'No decir nada a nadie'], correct: 0 },
          { text: 'Sientes un dolor fuerte que no se te pasa en un rato.', options: ['Decírselo enseguida a un adulto de confianza', 'Esperar mucho tiempo sin decir nada', 'Tomar una medicina tú solo'], correct: 0 }
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
        descripcion: 'Clear body signals',
        estrellas: 1,
        items: [
          { text: 'Your tummy rumbles and you feel hungry.', options: ['Eat something', 'Drink water', 'Sleep for a while'], correct: 0 },
          { text: 'Your mouth feels dry and you feel thirsty.', options: ['Drink water', 'Eat something', 'Put on your coat'], correct: 0 },
          { text: 'Your eyes are closing and you keep yawning.', options: ['Rest or sleep for a while', 'Keep playing without stopping', 'Drink water'], correct: 0 },
          { text: 'You have a headache.', options: ['Tell a trusted adult', 'Keep playing without saying anything', 'Shout very loudly'], correct: 0 },
          { text: 'Your heart is racing after running a lot.', options: ['Stop for a moment and rest', 'Keep running faster', 'Hold your breath'], correct: 0 },
          { text: 'You need to go to the toilet.', options: ['Go to the toilet now', 'Wait a long time', 'Say it is nothing'], correct: 0 },
          { text: 'You feel very hot and you are sweating.', options: ['Drink water and take off a layer', 'Put on more clothes', 'Keep running in the sun'], correct: 0 },
          { text: 'You feel cold and shiver a little.', options: ['Put on a warm layer', 'Take off clothes', 'Say nothing to anyone'], correct: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Your body and emotions',
        estrellas: 2,
        items: [
          { text: 'Your stomach tightens before a test.', options: ['Breathe slowly and say how you feel', 'Hold it in and say nothing', 'Run out of the classroom'], correct: 0 },
          { text: 'Your hands shake and you feel very nervous.', options: ['Do a calm breath, like in Calma', 'Clench your fists very hard', 'Ignore it and keep going'], correct: 0 },
          { text: 'Your shoulders tense up and you clench your teeth.', options: ['Stop for a moment and relax your body', 'Stay tense all day', 'Hit something'], correct: 0 },
          { text: 'You feel very tired even though you have not exercised much.', options: ['Rest and tell an adult if it keeps happening', 'Force yourself to keep going', 'Say nothing to anyone'], correct: 0 },
          { text: 'You feel a lump in your throat and want to cry.', options: ['Tell someone you trust how you feel', 'Hold back your tears', 'Laugh to hide it'], correct: 0 },
          { text: "It's hard to concentrate and your head feels foggy.", options: ['Stop for a moment to rest your eyes and mind', 'Keep going without resting', 'Start shouting'], correct: 0 },
          { text: 'You feel dizzy after spinning around a lot while playing.', options: ['Sit down calmly until it passes', 'Keep spinning faster', 'Say nothing to anyone'], correct: 0 },
          { text: 'You feel a strong pain that does not go away for a while.', options: ['Tell a trusted adult right away', 'Wait a long time without saying anything', 'Take medicine by yourself'], correct: 0 }
        ]
      }
    ]
  }
};
