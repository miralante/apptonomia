/* ============================================================
   Datos: Situaciones (autonomía — ¿qué haces si...?).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ situacion, picto, opciones: string[3], correcta }] }] }
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
        descripcion: 'En casa',
        estrellas: 1,
        items: [
          { situacion: 'Se te ha caído la leche al suelo.', picto: '🥛', opciones: ['Lo limpio con un paño', 'Lo dejo así', 'Me enfado mucho'], correcta: 0 },
          { situacion: 'Tienes hambre.', picto: '😋', opciones: ['Como algo', 'Grito', 'Me voy a dormir'], correcta: 0 },
          { situacion: 'Tienes sed.', picto: '🥤', opciones: ['Bebo agua', 'Me enfado', 'Lloro'], correcta: 0 },
          { situacion: 'Se ha ensuciado tu camiseta.', picto: '👕', opciones: ['La pongo a lavar', 'La tiro', 'Me la dejo puesta sucia'], correcta: 0 },
          { situacion: 'Tienes sueño por la noche.', picto: '😴', opciones: ['Me voy a la cama', 'Sigo jugando', 'Grito'], correcta: 0 },
          { situacion: 'Se te ha roto un juguete.', picto: '🧸', opciones: ['Se lo digo a un adulto', 'Lo escondo', 'Rompo otro juguete'], correcta: 0 },
          { situacion: 'Hace frío fuera.', picto: '🥶', opciones: ['Me pongo un abrigo', 'Salgo en camiseta', 'No salgo nunca'], correcta: 0 },
          { situacion: 'Tienes las manos sucias antes de comer.', picto: '🤲', opciones: ['Me lavo las manos', 'Como con las manos sucias', 'Me las limpio en la ropa'], correcta: 0 },
          { situacion: 'Se ha acabado el papel higiénico.', picto: '🧻', opciones: ['Aviso a alguien de casa', 'No digo nada', 'Uso otra cosa'], correcta: 0 },
          { situacion: 'Tu habitación está desordenada.', picto: '🧸', opciones: ['La ordeno', 'La dejo así', 'Me enfado con mis cosas'], correcta: 0 },
          { situacion: 'Suena el despertador por la mañana.', picto: '⏰', opciones: ['Me levanto', 'Lo apago y sigo durmiendo todo el día', 'Lo tiro'], correcta: 0 },
          { situacion: 'Tienes que ir al baño.', picto: '🚽', opciones: ['Voy al baño', 'Aguanto mucho tiempo', 'Espero sin decir nada'], correcta: 0 },
          { situacion: 'Se ha hecho de noche y estás en casa.', picto: '🌙', opciones: ['Enciendo la luz', 'Me quedo a oscuras', 'Salgo a la calle'], correcta: 0 },
          { situacion: 'Tienes los zapatos desatados.', picto: '👟', opciones: ['Me los ato', 'Sigo caminando así', 'Los tiro'], correcta: 0 },
          { situacion: 'Es la hora de cenar.', picto: '🍽️', opciones: ['Voy a cenar', 'Sigo jugando y no ceno', 'Me enfado'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Con otras personas',
        estrellas: 2,
        items: [
          { situacion: 'Un amigo te saluda.', picto: '👋', opciones: ['Le saludo también', 'No le miro', 'Me voy corriendo'], correcta: 0 },
          { situacion: 'Alguien te pide ayuda para llevar bolsas.', picto: '🛍️', opciones: ['Le ayudo', 'Me río de él', 'No le hago caso'], correcta: 0 },
          { situacion: 'Quieres jugar con otros niños.', picto: '⚽', opciones: ['Les pregunto si puedo jugar', 'Les quito el balón', 'Me voy sin decir nada'], correcta: 0 },
          { situacion: 'Un compañero está triste.', picto: '😢', opciones: ['Le pregunto qué le pasa', 'Me río de él', 'Le ignoro'], correcta: 0 },
          { situacion: 'Llegas tarde a una cita.', picto: '⏰', opciones: ['Aviso de que llegaré tarde', 'No digo nada', 'Falto sin avisar'], correcta: 0 },
          { situacion: 'Te han hecho un regalo.', picto: '🎁', opciones: ['Doy las gracias', 'No digo nada', 'Lo tiro'], correcta: 0 },
          { situacion: 'Alguien te interrumpe cuando hablas.', picto: '🗣️', opciones: ['Espero mi turno para hablar', 'Le grito', 'Me voy enfadado'], correcta: 0 },
          { situacion: 'Estás en la fila del autobús.', picto: '🚌', opciones: ['Espero mi turno', 'Me cuelo el primero', 'Empujo a los demás'], correcta: 0 },
          { situacion: 'Un amigo te presta un juguete.', picto: '🧸', opciones: ['Lo cuido y se lo devuelvo', 'Lo rompo', 'Me lo quedo para siempre'], correcta: 0 },
          { situacion: 'Quieres hablar y otra persona está hablando.', picto: '💬', opciones: ['Espero a que termine', 'La interrumpo', 'Grito más fuerte'], correcta: 0 },
          { situacion: 'Alguien te felicita por algo que has hecho.', picto: '👏', opciones: ['Sonrío y doy las gracias', 'No digo nada', 'Me pongo a llorar'], correcta: 0 },
          { situacion: 'Ves a alguien que se ha caído.', picto: '🤕', opciones: ['Le pregunto si está bien', 'Me río', 'Sigo caminando sin mirar'], correcta: 0 },
          { situacion: 'Estás en una tienda y quieres algo.', picto: '🏪', opciones: ['Se lo pido a un adulto', 'Lo cojo sin pagar', 'Grito hasta que me lo den'], correcta: 0 },
          { situacion: 'Un amigo no quiere compartir su merienda.', picto: '🍎', opciones: ['Lo respeto y no insisto', 'Se la quito', 'Me enfado mucho'], correcta: 0 },
          { situacion: 'Terminas de comer en casa de un amigo.', picto: '🍽️', opciones: ['Doy las gracias por la comida', 'Me voy sin decir nada', 'Dejo todo tirado'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Cómo me siento',
        estrellas: 3,
        items: [
          { situacion: 'Te sientes muy enfadado.', picto: '😠', opciones: ['Respiro y me calmo', 'Grito y rompo cosas', 'Pego a alguien'], correcta: 0 },
          { situacion: 'Estás nervioso antes de un examen.', picto: '😰', opciones: ['Respiro despacio para calmarme', 'Dejo de estudiar del todo', 'Me enfado con todos'], correcta: 0 },
          { situacion: 'Alguien se burla de ti.', picto: '😞', opciones: ['Se lo cuento a un adulto de confianza', 'Le pego', 'Me lo callo y sufro solo'], correcta: 0 },
          { situacion: 'Te sientes triste sin saber por qué.', picto: '😢', opciones: ['Hablo de cómo me siento', 'Me lo guardo todo', 'Grito a los demás'], correcta: 0 },
          { situacion: 'Has cometido un error.', picto: '😳', opciones: ['Pido perdón y lo arreglo', 'Echo la culpa a otro', 'Me enfado conmigo mismo'], correcta: 0 },
          { situacion: 'Tienes miedo de algo nuevo.', picto: '😨', opciones: ['Pido ayuda a alguien de confianza', 'Evito hacerlo siempre', 'Finjo que no tengo miedo'], correcta: 0 },
          { situacion: 'Estás muy emocionado y no puedes parar quieto.', picto: '🤩', opciones: ['Respiro y me tranquilizo poco a poco', 'Grito sin parar', 'Molesto a los demás'], correcta: 0 },
          { situacion: 'Un amigo está enfadado contigo.', picto: '😤', opciones: ['Le pregunto qué ha pasado', 'Me enfado también', 'Dejo de hablarle para siempre'], correcta: 0 },
          { situacion: 'Sientes envidia porque un amigo tiene algo que tú no.', picto: '😒', opciones: ['Me alegro por él y sigo a lo mío', 'Se lo quito', 'Le digo cosas feas'], correcta: 0 },
          { situacion: 'Te sientes solo.', picto: '🥺', opciones: ['Busco a alguien con quien hablar', 'Me escondo siempre', 'Me enfado con todos'], correcta: 0 },
          { situacion: 'Alguien te da una mala noticia.', picto: '😔', opciones: ['Hablo de lo que siento', 'Lo escondo todo dentro', 'Grito a quien me lo dice'], correcta: 0 },
          { situacion: 'Te sientes muy orgulloso de algo que has hecho.', picto: '🥰', opciones: ['Lo comparto con alguien', 'No se lo cuento a nadie', 'Presumo delante de todos sin parar'], correcta: 0 },
          { situacion: 'Estás frustrado porque algo no te sale bien.', picto: '😣', opciones: ['Descanso un momento y lo vuelvo a intentar', 'Lo rompo todo', 'Dejo de intentarlo para siempre'], correcta: 0 },
          { situacion: 'Ves que un amigo está llorando.', picto: '😭', opciones: ['Le pregunto si necesita ayuda', 'Me río', 'Le dejo solo sin más'], correcta: 0 },
          { situacion: 'Te sientes muy contento por algo bueno que ha pasado.', picto: '😄', opciones: ['Lo disfruto y lo comparto', 'Lo escondo', 'Me pongo triste igualmente'], correcta: 0 }
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
        descripcion: 'At home',
        estrellas: 1,
        items: [
          { situacion: 'You spilled milk on the floor.', picto: '🥛', opciones: ['I clean it up with a cloth', 'I leave it there', 'I get very angry'], correcta: 0 },
          { situacion: 'You are hungry.', picto: '😋', opciones: ['I eat something', 'I shout', 'I go to sleep'], correcta: 0 },
          { situacion: 'You are thirsty.', picto: '🥤', opciones: ['I drink water', 'I get angry', 'I cry'], correcta: 0 },
          { situacion: 'Your t-shirt got dirty.', picto: '👕', opciones: ['I put it in the wash', 'I throw it away', 'I keep wearing it dirty'], correcta: 0 },
          { situacion: 'You feel sleepy at night.', picto: '😴', opciones: ['I go to bed', 'I keep playing', 'I shout'], correcta: 0 },
          { situacion: 'One of your toys has broken.', picto: '🧸', opciones: ['I tell an adult', 'I hide it', 'I break another toy'], correcta: 0 },
          { situacion: 'It is cold outside.', picto: '🥶', opciones: ['I put on a coat', 'I go out in a t-shirt', 'I never go outside'], correcta: 0 },
          { situacion: 'Your hands are dirty before a meal.', picto: '🤲', opciones: ['I wash my hands', 'I eat with dirty hands', 'I wipe them on my clothes'], correcta: 0 },
          { situacion: 'The toilet paper has run out.', picto: '🧻', opciones: ['I tell someone at home', 'I say nothing', 'I use something else'], correcta: 0 },
          { situacion: 'Your room is messy.', picto: '🧸', opciones: ['I tidy it up', 'I leave it messy', 'I get angry at my things'], correcta: 0 },
          { situacion: 'The alarm clock rings in the morning.', picto: '⏰', opciones: ['I get up', 'I turn it off and sleep all day', 'I throw it away'], correcta: 0 },
          { situacion: 'You need to use the bathroom.', picto: '🚽', opciones: ['I go to the bathroom', 'I hold it in for a long time', 'I wait without saying anything'], correcta: 0 },
          { situacion: 'It has become night and you are at home.', picto: '🌙', opciones: ['I turn on the light', 'I stay in the dark', 'I go outside'], correcta: 0 },
          { situacion: 'Your shoelaces are untied.', picto: '👟', opciones: ['I tie them', 'I keep walking like that', 'I throw them away'], correcta: 0 },
          { situacion: 'It is time for dinner.', picto: '🍽️', opciones: ['I go and have dinner', 'I keep playing and skip dinner', 'I get angry'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'With other people',
        estrellas: 2,
        items: [
          { situacion: 'A friend waves hello to you.', picto: '👋', opciones: ['I wave back', 'I do not look at them', 'I run away'], correcta: 0 },
          { situacion: 'Someone asks you for help carrying bags.', picto: '🛍️', opciones: ['I help them', 'I laugh at them', 'I ignore them'], correcta: 0 },
          { situacion: 'You want to play with other kids.', picto: '⚽', opciones: ['I ask if I can join in', 'I take their ball away', 'I leave without saying anything'], correcta: 0 },
          { situacion: 'A classmate looks sad.', picto: '😢', opciones: ['I ask what is wrong', 'I laugh at them', 'I ignore them'], correcta: 0 },
          { situacion: 'You are running late for an appointment.', picto: '⏰', opciones: ['I let them know I will be late', 'I say nothing', 'I do not show up and do not tell anyone'], correcta: 0 },
          { situacion: 'Someone gives you a gift.', picto: '🎁', opciones: ['I say thank you', 'I say nothing', 'I throw it away'], correcta: 0 },
          { situacion: 'Someone interrupts you while you are talking.', picto: '🗣️', opciones: ['I wait for my turn to speak', 'I shout at them', 'I storm off angry'], correcta: 0 },
          { situacion: 'You are in line for the bus.', picto: '🚌', opciones: ['I wait my turn', 'I push to the front', 'I push other people'], correcta: 0 },
          { situacion: 'A friend lends you a toy.', picto: '🧸', opciones: ['I take care of it and give it back', 'I break it', 'I keep it forever'], correcta: 0 },
          { situacion: 'You want to speak, but someone else is talking.', picto: '💬', opciones: ['I wait until they finish', 'I interrupt them', 'I shout louder'], correcta: 0 },
          { situacion: 'Someone congratulates you for something you did.', picto: '👏', opciones: ['I smile and say thank you', 'I say nothing', 'I start crying'], correcta: 0 },
          { situacion: 'You see someone who has fallen down.', picto: '🤕', opciones: ['I ask if they are okay', 'I laugh', 'I keep walking without looking'], correcta: 0 },
          { situacion: 'You are in a shop and want something.', picto: '🏪', opciones: ['I ask an adult for it', 'I take it without paying', 'I shout until they give it to me'], correcta: 0 },
          { situacion: 'A friend does not want to share their snack.', picto: '🍎', opciones: ['I respect that and do not insist', 'I take it from them', 'I get very angry'], correcta: 0 },
          { situacion: "You finish eating at a friend's house.", picto: '🍽️', opciones: ['I say thank you for the meal', 'I leave without saying anything', 'I leave a mess behind'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'How I feel',
        estrellas: 3,
        items: [
          { situacion: 'You feel very angry.', picto: '😠', opciones: ['I breathe and calm down', 'I shout and break things', 'I hit someone'], correcta: 0 },
          { situacion: 'You feel nervous before a test.', picto: '😰', opciones: ['I breathe slowly to calm down', 'I stop studying completely', 'I get angry at everyone'], correcta: 0 },
          { situacion: 'Someone makes fun of you.', picto: '😞', opciones: ['I tell an adult I trust', 'I hit them', 'I keep it to myself and suffer alone'], correcta: 0 },
          { situacion: 'You feel sad without knowing why.', picto: '😢', opciones: ['I talk about how I feel', 'I keep it all inside', 'I shout at other people'], correcta: 0 },
          { situacion: 'You have made a mistake.', picto: '😳', opciones: ['I say sorry and fix it', 'I blame someone else', 'I get angry at myself'], correcta: 0 },
          { situacion: 'You are afraid of something new.', picto: '😨', opciones: ['I ask someone I trust for help', 'I always avoid doing it', 'I pretend I am not afraid'], correcta: 0 },
          { situacion: 'You are very excited and cannot sit still.', picto: '🤩', opciones: ['I breathe and calm down little by little', 'I keep shouting', 'I bother other people'], correcta: 0 },
          { situacion: 'A friend is angry with you.', picto: '😤', opciones: ['I ask what happened', 'I get angry too', 'I stop talking to them forever'], correcta: 0 },
          { situacion: 'You feel jealous because a friend has something you do not.', picto: '😒', opciones: ['I am happy for them and carry on with my own things', 'I take it from them', 'I say unkind things to them'], correcta: 0 },
          { situacion: 'You feel lonely.', picto: '🥺', opciones: ['I look for someone to talk to', 'I always hide away', 'I get angry at everyone'], correcta: 0 },
          { situacion: 'Someone gives you bad news.', picto: '😔', opciones: ['I talk about how I feel', 'I keep it all bottled up', 'I shout at the person who told me'], correcta: 0 },
          { situacion: 'You feel very proud of something you did.', picto: '🥰', opciones: ['I share it with someone', 'I do not tell anyone', 'I keep bragging to everyone'], correcta: 0 },
          { situacion: 'You feel frustrated because something is not going well.', picto: '😣', opciones: ['I rest for a moment and try again', 'I break everything', 'I give up trying forever'], correcta: 0 },
          { situacion: 'You see a friend crying.', picto: '😭', opciones: ['I ask if they need help', 'I laugh', 'I just leave them alone'], correcta: 0 },
          { situacion: 'You feel very happy because something good happened.', picto: '😄', opciones: ['I enjoy it and share it', 'I hide it', 'I feel sad anyway'], correcta: 0 }
        ]
      }
    ]
  }
};
