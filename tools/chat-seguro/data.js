/* ============================================================
   Datos: Chat Seguro (autonomía — seguridad en internet).
   Chats simulados para practicar cómo responder a personas que
   intentan engañar: pedir fotos, datos, contraseñas, secretos…
   Formato: DATA.es / DATA.en, cada uno con:
   {
     escenarios: [{
       id, titulo, picto,
       contacto: nombre que se ve en el chat (siempre desconocido),
       pasos: [
         { tipo: 'msg', texto }                  → mensaje que recibe el usuario
         { tipo: 'eleccion', opciones: [         → el usuario elige respuesta
             { texto, segura: true, avisoSeguro } → segura: el chat sigue, explica por qué
             { texto, segura: false, aviso }     → arriesgada: consejo y se reintenta
           ] }
         { tipo: 'accion', texto, confirmacion } → botón final (bloquear) + mensaje
       ],
       regla: norma para recordar al terminar
     }],
     normas: resumen de todas las normas (pantalla "Mis normas")
   }
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   Tono: Lectura Fácil, sin asustar. El error nunca se castiga.
   ============================================================ */
const DATA = {

  es: {
    escenarios: [
      {
        id: 'fotos',
        titulo: 'Me piden una foto',
        picto: '📷',
        contacto: 'Leo_23',
        pasos: [
          { tipo: 'msg', texto: 'Hola. Jugamos ayer al juego de coches. ¿Te acuerdas de mí?' },
          { tipo: 'msg', texto: 'Me caes muy bien. ¿Me mandas una foto tuya?' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No. No te conozco.', segura: true,
              avisoSeguro: 'No conoces a esta persona de verdad. Decir que no protege tus fotos.' },
            { texto: 'Vale, ahora te la mando.', segura: false,
              aviso: 'Cuidado. No sabes quién es esta persona de verdad. Tus fotos son tuyas. No las envíes.' },
            { texto: 'Bueno… solo una foto.', segura: false,
              aviso: 'Aunque sea solo una, no. Una foto tuya dice mucho de ti y ya no la puedes recuperar.' }
          ] },
          { tipo: 'msg', texto: 'Venga, porfa. Pensaba que éramos amigos. Los amigos se mandan fotos.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Los amigos de verdad no piden fotos así. No.', segura: true,
              avisoSeguro: 'Un amigo de verdad no te pide fotos con excusas ni te presiona así.' },
            { texto: 'No quiero que te enfades. Te mando una.', segura: false,
              aviso: 'Esta persona quiere que te sientas mal para conseguir tu foto. Eso es una trampa.' }
          ] },
          { tipo: 'msg', texto: 'Pues si no me la mandas, dejo de hablarte.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Adiós. Se lo voy a contar a una persona de confianza.', segura: true,
              avisoSeguro: 'Que alguien deje de hablarte por no mandar una foto no es un problema tuyo. Contarlo ayuda.' },
            { texto: 'Espera, no te vayas. Te la mando.', segura: false,
              aviso: 'No pasa nada si deja de hablarte. Enfadarse y meter prisa es otra trampa.' }
          ] },
          { tipo: 'accion', texto: '🚫 Bloquear a esta persona',
            confirmacion: 'Has bloqueado a Leo_23. ¡Muy bien hecho!' }
        ],
        regla: 'Tus fotos son tuyas. No las envíes a personas que no conoces. Si alguien insiste, cuéntaselo a una persona de confianza.'
      },

      {
        id: 'datos',
        titulo: 'Me preguntan dónde vivo',
        picto: '🏠',
        contacto: 'Marta_Fan',
        pasos: [
          { tipo: 'msg', texto: '¡Hola! Me encanta tu foto de perfil. ¿Cómo te llamas de verdad?' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Prefiero no decirlo.', segura: true,
              avisoSeguro: 'No hace falta decir tu nombre completo a alguien que no conoces.' },
            { texto: 'Te digo mi nombre y mis apellidos.', segura: false,
              aviso: 'Tu nombre completo es un dato personal. En internet, mejor no darlo a desconocidos.' }
          ] },
          { tipo: 'msg', texto: 'Yo vivo en Madrid. ¿Y tú? ¿En qué calle vives?' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Eso no te lo voy a decir.', segura: true,
              avisoSeguro: 'Tu dirección es un dato que solo debe conocer la gente de confianza.' },
            { texto: 'Te digo mi calle y mi número.', segura: false,
              aviso: 'Nunca digas dónde vives a alguien de internet. Con ese dato pueden encontrarte.' },
            { texto: 'Te digo mi ciudad y mi colegio.', segura: false,
              aviso: 'Tu colegio también es un dato personal. Con él pueden saber dónde estás cada día.' }
          ] },
          { tipo: 'msg', texto: '¿Y tu teléfono? Así hablamos mejor.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No doy mi teléfono a personas que no conozco.', segura: true,
              avisoSeguro: 'Tu teléfono es tuyo. No hace falta darlo para seguir hablando.' },
            { texto: 'Vale, apunta mi número.', segura: false,
              aviso: 'Con tu teléfono te pueden llamar y escribir cuando quieran. No lo des.' }
          ] },
          { tipo: 'accion', texto: '🚫 Bloquear a esta persona',
            confirmacion: 'Has bloqueado a Marta_Fan. Tus datos están a salvo.' }
        ],
        regla: 'Tus datos son tuyos: nombre completo, dirección, teléfono y colegio. No los des en internet.'
      },

      {
        id: 'premio',
        titulo: 'Un premio sorpresa',
        picto: '🎁',
        contacto: 'Premios_Ya',
        pasos: [
          { tipo: 'msg', texto: '🎉 ¡Enhorabuena! Has ganado un teléfono nuevo.' },
          { tipo: 'msg', texto: 'Para enviarte el premio, dame los números de la tarjeta del banco de tu familia.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No. Esto es un engaño.', segura: true,
              avisoSeguro: 'Nadie regala nada a cambio de datos bancarios: es una señal clara de engaño.' },
            { texto: '¡Un premio! Voy a buscar la tarjeta.', segura: false,
              aviso: 'Nadie regala nada a cambio de los números de una tarjeta. Es un engaño para quitar dinero.' }
          ] },
          { tipo: 'msg', texto: '¡Date prisa! El premio se acaba en 5 minutos.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No me des prisa. No te voy a dar nada.', segura: true,
              avisoSeguro: 'Meter prisa es una técnica para que no pienses. Parar y no darte prisa es lo seguro.' },
            { texto: '¡Rápido, que se acaba! Te doy los números.', segura: false,
              aviso: 'Las prisas son una trampa. Quieren que no pienses. Tú puedes parar y pensar con calma.' }
          ] },
          { tipo: 'accion', texto: '🚫 Bloquear y avisar a mi familia',
            confirmacion: 'Has bloqueado a Premios_Ya y has avisado a tu familia. ¡Genial!' }
        ],
        regla: 'Si te regalan algo a cambio de datos o dinero, es un engaño. Para, no contestes y avisa a tu familia.'
      },

      {
        id: 'secreto',
        titulo: 'Un secreto raro',
        picto: '🤫',
        contacto: 'Dani_Guay',
        pasos: [
          { tipo: 'msg', texto: 'Hola. Eres muy especial. Me gusta mucho hablar contigo.' },
          { tipo: 'msg', texto: 'Esto es nuestro secreto, ¿vale? No le digas a nadie que hablamos.' },
          { tipo: 'eleccion', opciones: [
            { texto: '¿Por qué un secreto? Eso no me gusta.', segura: true,
              avisoSeguro: 'Dudar de un secreto raro es buena señal: las personas de confianza no piden guardar secretos así.' },
            { texto: 'Vale, será nuestro secreto.', segura: false,
              aviso: 'Cuando alguien pide un secreto en internet, algo va mal. Las personas buenas no piden secretos así.' }
          ] },
          { tipo: 'msg', texto: 'Si se lo cuentas a alguien, te vas a meter en un lío.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Contarlo no es meterse en un lío. Lo voy a contar.', segura: true,
              avisoSeguro: 'Contar lo que pasa nunca mete en un lío; ayuda a que un adulto de confianza lo sepa.' },
            { texto: 'Vale, no se lo cuento a nadie.', segura: false,
              aviso: 'Contar lo que te pasa nunca es malo. Las personas de confianza te ayudan.' }
          ] },
          { tipo: 'accion', texto: '🚫 Bloquear y contarlo a una persona de confianza',
            confirmacion: 'Has bloqueado a Dani_Guay y lo has contado. Eso es ser valiente.' }
        ],
        regla: 'Los secretos de internet no se guardan. Cuéntaselo siempre a una persona de confianza: tu familia, un profesor…'
      },

      {
        id: 'quedar',
        titulo: 'Quiere quedar conmigo',
        picto: '📍',
        contacto: 'Sara_Juegos',
        pasos: [
          { tipo: 'msg', texto: '¡Hola otra vez! Ya hablamos mucho, ¿no? Somos casi amigos.' },
          { tipo: 'msg', texto: '¿Quedamos mañana en el parque? Ven sin decir nada a nadie.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No. No quedo con personas que solo conozco por internet.', segura: true,
              avisoSeguro: 'No sabes quién es de verdad esa persona: no quedar es lo seguro.' },
            { texto: 'Vale, mañana voy.', segura: false,
              aviso: 'No sabes quién es de verdad. Puede mentir sobre su nombre o su edad. No vayas.' },
            { texto: 'Voy, pero solo un ratito.', segura: false,
              aviso: 'Aunque sea un ratito, es peligroso. No vayas a ningún sitio sin tu familia.' }
          ] },
          { tipo: 'msg', texto: '¿Por qué no? Tengo un regalo para ti.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No quiero tu regalo. Se lo voy a contar a mi familia.', segura: true,
              avisoSeguro: 'Un regalo a cambio de quedar es una trampa habitual; contarlo a la familia protege.' },
            { texto: '¿Un regalo? Bueno, entonces voy.', segura: false,
              aviso: 'El regalo es una trampa para que vayas. Cuéntaselo a tu familia.' }
          ] },
          { tipo: 'accion', texto: '🚫 Bloquear y contarlo a mi familia',
            confirmacion: 'Has bloqueado a Sara_Juegos y lo has contado a tu familia. ¡Muy bien!' }
        ],
        regla: 'Nunca quedes con alguien que solo conoces por internet. Si te lo pide, cuéntaselo a tu familia.'
      },

      {
        id: 'contrasena',
        titulo: 'Me piden mi contraseña',
        picto: '🔑',
        contacto: 'Ayuda_Del_Juego',
        pasos: [
          { tipo: 'msg', texto: 'Hola. Somos la ayuda del juego. Hay un problema con tu cuenta.' },
          { tipo: 'msg', texto: 'Dinos tu contraseña para arreglarlo.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No. Mi contraseña es solo mía.', segura: true,
              avisoSeguro: 'La ayuda de verdad nunca necesita tu contraseña para arreglar nada.' },
            { texto: 'Vale, os digo mi contraseña.', segura: false,
              aviso: 'La ayuda de verdad nunca pide tu contraseña. Quien la pide, quiere robar tu cuenta.' }
          ] },
          { tipo: 'msg', texto: 'Si no nos la das, hoy mismo perderás todos tus puntos.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No te creo. Voy a pedir ayuda a una persona de confianza.', segura: true,
              avisoSeguro: 'Amenazar con quitarte algo para conseguir la contraseña es la trampa; pedir ayuda es lo seguro.' },
            { texto: '¡Mis puntos no! Os la doy.', segura: false,
              aviso: 'Te asustan para que obedezcas. Es una trampa. Para y pide ayuda.' }
          ] },
          { tipo: 'accion', texto: '🚫 Bloquear y pedir ayuda',
            confirmacion: 'Has bloqueado a Ayuda_Del_Juego. Tu cuenta está a salvo.' }
        ],
        regla: 'Tu contraseña es solo tuya. No la des a nadie. La ayuda de verdad nunca te la pide.'
      }
    ],

    normas: [
      { picto: '📷', texto: 'Tus fotos son tuyas. No las envíes a personas que no conoces.' },
      { picto: '🏠', texto: 'No des tus datos: nombre completo, dirección, teléfono ni colegio.' },
      { picto: '🎁', texto: 'Si te regalan algo a cambio de datos o dinero, es un engaño.' },
      { picto: '🤫', texto: 'Los secretos de internet no se guardan. Cuéntalos a una persona de confianza.' },
      { picto: '📍', texto: 'Nunca quedes con alguien que solo conoces por internet.' },
      { picto: '🔑', texto: 'Tu contraseña es solo tuya. No la des a nadie.' },
      { picto: '🛡️', texto: 'Si un chat te hace sentir mal: para, bloquea y cuéntalo. Pedir ayuda siempre está bien.' }
    ]
  },

  en: {
    escenarios: [
      {
        id: 'fotos',
        titulo: 'Someone asks for a photo',
        picto: '📷',
        contacto: 'Jamie_23',
        pasos: [
          { tipo: 'msg', texto: 'Hi. We played the car game yesterday. Do you remember me?' },
          { tipo: 'msg', texto: 'I like you a lot. Can you send me a photo of yourself?' },
          { tipo: 'eleccion', opciones: [
            { texto: "No. I don't know you.", segura: true,
              avisoSeguro: "You don't really know this person. Saying no keeps your photos safe." },
            { texto: "Okay, I'll send it now.", segura: false,
              aviso: "Careful. You don't really know who this person is. Your photos are yours. Don't send them." },
            { texto: 'Well… just one photo.', segura: false,
              aviso: "Even just one, no. A photo of you says a lot, and once you send it you can't take it back." }
          ] },
          { tipo: 'msg', texto: "Come on, please. I thought we were friends. Friends send each other photos." },
          { tipo: 'eleccion', opciones: [
            { texto: "Real friends don't ask for photos like that. No.", segura: true,
              avisoSeguro: "A real friend doesn't ask for photos with excuses or pressure you like that." },
            { texto: "I don't want you to be upset. I'll send you one.", segura: false,
              aviso: 'This person wants you to feel bad so you send a photo. That is a trick.' }
          ] },
          { tipo: 'msg', texto: "Well, if you don't send it, I'll stop talking to you." },
          { tipo: 'eleccion', opciones: [
            { texto: "Goodbye. I'm going to tell someone I trust.", segura: true,
              avisoSeguro: "It's not your problem if someone stops talking to you over a photo. Telling someone helps." },
            { texto: "Wait, don't go. I'll send it.", segura: false,
              aviso: "It's okay if they stop talking to you. Getting upset and rushing you is another trick." }
          ] },
          { tipo: 'accion', texto: '🚫 Block this person',
            confirmacion: 'You blocked Jamie_23. Well done!' }
        ],
        regla: "Your photos are yours. Don't send them to people you don't know. If someone insists, tell someone you trust."
      },

      {
        id: 'datos',
        titulo: 'They ask where I live',
        picto: '🏠',
        contacto: 'Alex_Fan',
        pasos: [
          { tipo: 'msg', texto: "Hi! I love your profile picture. What's your real name?" },
          { tipo: 'eleccion', opciones: [
            { texto: "I'd rather not say.", segura: true,
              avisoSeguro: "You don't need to give your full name to someone you don't know." },
            { texto: "I'll tell you my full name.", segura: false,
              aviso: "Your full name is personal information. Online, it's best not to give it to strangers." }
          ] },
          { tipo: 'msg', texto: 'I live in London. What about you? What street do you live on?' },
          { tipo: 'eleccion', opciones: [
            { texto: "I'm not going to tell you that.", segura: true,
              avisoSeguro: 'Your address is something only people you trust should know.' },
            { texto: "I'll tell you my street and house number.", segura: false,
              aviso: 'Never say where you live to someone online. With that, they could find you.' },
            { texto: "I'll tell you my city and my school.", segura: false,
              aviso: 'Your school is personal information too. With it, someone could find out where you are every day.' }
          ] },
          { tipo: 'msg', texto: "What's your phone number? We could talk better that way." },
          { tipo: 'eleccion', opciones: [
            { texto: "I don't give my phone number to people I don't know.", segura: true,
              avisoSeguro: "Your phone number is yours. You don't need to give it out to keep talking." },
            { texto: "Okay, here's my number.", segura: false,
              aviso: 'With your phone number, someone can call or message you whenever they want. Do not give it out.' }
          ] },
          { tipo: 'accion', texto: '🚫 Block this person',
            confirmacion: 'You blocked Alex_Fan. Your information is safe.' }
        ],
        regla: "Your information is yours: full name, address, phone number, and school. Don't share it online."
      },

      {
        id: 'premio',
        titulo: 'A surprise prize',
        picto: '🎁',
        contacto: 'PrizesNow',
        pasos: [
          { tipo: 'msg', texto: "🎉 Congratulations! You've won a new phone." },
          { tipo: 'msg', texto: "To send you the prize, give me your family's bank card numbers." },
          { tipo: 'eleccion', opciones: [
            { texto: 'No. This is a trick.', segura: true,
              avisoSeguro: 'Nobody gives away a prize in exchange for bank details: that is a clear sign of a trick.' },
            { texto: "A prize! I'll go find the card.", segura: false,
              aviso: 'Nobody gives away a prize in exchange for card numbers. It is a trick to take money.' }
          ] },
          { tipo: 'msg', texto: 'Hurry! The prize ends in 5 minutes.' },
          { tipo: 'eleccion', opciones: [
            { texto: "Don't rush me. I'm not giving you anything.", segura: true,
              avisoSeguro: 'Rushing you is a trick to stop you thinking. Stopping and not rushing is the safe choice.' },
            { texto: 'Quick, before it ends! Here are the numbers.', segura: false,
              aviso: 'Rushing you is a trick. They want you to stop thinking. You can stop and think calmly.' }
          ] },
          { tipo: 'accion', texto: '🚫 Block and tell my family',
            confirmacion: 'You blocked PrizesNow and told your family. Great job!' }
        ],
        regla: "If someone offers you a gift in exchange for information or money, it's a trick. Stop, don't reply, and tell your family."
      },

      {
        id: 'secreto',
        titulo: 'A strange secret',
        picto: '🤫',
        contacto: 'Sam_Cool',
        pasos: [
          { tipo: 'msg', texto: "Hi. You're really special. I love talking with you." },
          { tipo: 'msg', texto: "This is our secret, okay? Don't tell anyone we talk." },
          { tipo: 'eleccion', opciones: [
            { texto: "Why a secret? I don't like that.", segura: true,
              avisoSeguro: 'Doubting a strange secret is a good sign: people you trust do not ask you to keep secrets like that.' },
            { texto: "Okay, it'll be our secret.", segura: false,
              aviso: 'When someone asks for a secret online, something is wrong. Good people do not ask for secrets like that.' }
          ] },
          { tipo: 'msg', texto: "If you tell anyone, you'll get in trouble." },
          { tipo: 'eleccion', opciones: [
            { texto: "Telling someone isn't getting in trouble. I'm going to tell.", segura: true,
              avisoSeguro: 'Telling someone what is happening never gets you in trouble; it helps a trusted adult find out.' },
            { texto: "Okay, I won't tell anyone.", segura: false,
              aviso: 'Telling someone what is happening is never wrong. People you trust can help you.' }
          ] },
          { tipo: 'accion', texto: '🚫 Block and tell someone I trust',
            confirmacion: 'You blocked Sam_Cool and told someone. That is being brave.' }
        ],
        regla: 'Online secrets should not be kept. Always tell someone you trust: your family, a teacher…'
      },

      {
        id: 'quedar',
        titulo: 'They want to meet me',
        picto: '📍',
        contacto: 'Sara_Games',
        pasos: [
          { tipo: 'msg', texto: "Hi again! We've talked a lot, right? We're almost friends." },
          { tipo: 'msg', texto: 'Want to meet tomorrow at the park? Come without telling anyone.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No. I do not meet people I only know from the internet.', segura: true,
              avisoSeguro: 'You do not really know who this person is. Not meeting them is the safe choice.' },
            { texto: "Okay, I'll go tomorrow.", segura: false,
              aviso: 'You do not really know who this is. They could lie about their name or age. Do not go.' },
            { texto: "I'll go, but just for a little while.", segura: false,
              aviso: 'Even for a little while, it is dangerous. Do not go anywhere without your family.' }
          ] },
          { tipo: 'msg', texto: 'Why not? I have a gift for you.' },
          { tipo: 'eleccion', opciones: [
            { texto: "I don't want your gift. I'm going to tell my family.", segura: true,
              avisoSeguro: 'A gift in exchange for meeting up is a common trick; telling your family protects you.' },
            { texto: "A gift? Okay, then I'll go.", segura: false,
              aviso: 'The gift is a trick to get you to go. Tell your family.' }
          ] },
          { tipo: 'accion', texto: '🚫 Block and tell my family',
            confirmacion: 'You blocked Sara_Games and told your family. Well done!' }
        ],
        regla: 'Never meet someone you only know from the internet. If they ask you to, tell your family.'
      },

      {
        id: 'contrasena',
        titulo: 'They ask for my password',
        picto: '🔑',
        contacto: 'GameHelpDesk',
        pasos: [
          { tipo: 'msg', texto: "Hi. We're the game's help team. There's a problem with your account." },
          { tipo: 'msg', texto: 'Tell us your password so we can fix it.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No. My password is only mine.', segura: true,
              avisoSeguro: 'Real help never needs your password to fix anything.' },
            { texto: "Okay, here's my password.", segura: false,
              aviso: 'Real help never asks for your password. Whoever asks for it wants to steal your account.' }
          ] },
          { tipo: 'msg', texto: "If you don't give it to us, you'll lose all your points today." },
          { tipo: 'eleccion', opciones: [
            { texto: "I don't believe you. I'm going to ask someone I trust for help.", segura: true,
              avisoSeguro: 'Threatening to take something away to get your password is the trick; asking for help is the safe choice.' },
            { texto: "Not my points! Here it is.", segura: false,
              aviso: 'They are scaring you so you will obey. It is a trick. Stop and ask for help.' }
          ] },
          { tipo: 'accion', texto: '🚫 Block and ask for help',
            confirmacion: 'You blocked GameHelpDesk. Your account is safe.' }
        ],
        regla: 'Your password is only yours. Do not give it to anyone. Real help never asks for it.'
      }
    ],

    normas: [
      { picto: '📷', texto: "Your photos are yours. Don't send them to people you don't know." },
      { picto: '🏠', texto: "Don't share your information: full name, address, phone number, or school." },
      { picto: '🎁', texto: "If someone offers you a gift in exchange for information or money, it's a trick." },
      { picto: '🤫', texto: 'Online secrets should not be kept. Tell someone you trust.' },
      { picto: '📍', texto: 'Never meet someone you only know from the internet.' },
      { picto: '🔑', texto: 'Your password is only yours. Do not give it to anyone.' },
      { picto: '🛡️', texto: 'If a chat makes you feel bad: stop, block, and tell someone. Asking for help is always okay.' }
    ]
  }
};
