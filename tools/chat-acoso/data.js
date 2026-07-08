/* ============================================================
   Datos: Chat Acoso (autonomía — detectar el acoso entre iguales
   y saber cómo actuar).
   Simulador de chats para practicar cómo responder cuando alguien
   conocido (compañeros, grupo de clase) acosa por chat: insultos,
   exclusión, rumores, fotos para reírse, amenazas, o presión para
   unirse a molestar a otro. La respuesta correcta SIEMPRE incluye
   contárselo a un adulto de confianza — nunca devolver el ataque,
   nunca ignorarlo sin más, nunca guardar el secreto si te lo piden.
   Formato: DATA.es / DATA.en, cada uno con:
   {
     escenarios: [{
       id, titulo, picto,
       contacto: nombre o grupo que se ve en el chat,
       relacion: quién es (para el aviso "no es un desconocido"),
       pasos: [
         { tipo: 'msg', texto }                  → mensaje que recibe el usuario
         { tipo: 'eleccion', opciones: [         → el usuario elige respuesta
             { texto, segura: true, avisoSeguro } → segura: explica por qué, el chat sigue
             { texto, segura: false, aviso }     → arriesgada: consejo y se reintenta
           ] }
         { tipo: 'accion', texto, confirmacion } → botón final (contarlo) + mensaje
       ],
       regla: norma para recordar al terminar
     }],
     normas: resumen de todas las normas (pantalla "Mis normas")
   }
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   Tono: Lectura Fácil, sin asustar, nunca culpar a quien lo sufre.
   ============================================================ */
const DATA = {

  es: {
    escenarios: [
      {
        id: 'insultos',
        titulo: 'Me insultan en el chat',
        picto: '😞',
        contacto: 'Grupo 5ºB',
        relacion: 'Grupo de tu clase',
        pasos: [
          { tipo: 'msg', texto: 'Alguien del grupo escribe: "Eres tonto, no sabes hacer nada bien."' },
          { tipo: 'msg', texto: 'Otro compañero se ríe y escribe: "Jajaja, es verdad."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No contesto. Se lo voy a contar a un adulto de confianza.', segura: true,
              avisoSeguro: 'Contárselo a un adulto es lo mejor. Los insultos repetidos son acoso, no es tu culpa.' },
            { texto: 'Les insulto también, para que vean lo que se siente.', segura: false,
              aviso: 'Devolver el insulto no hace que pare, y puede empeorar las cosas. Mejor cuéntaselo a un adulto.' },
            { texto: 'No digo nada y dejo que sigan.', segura: false,
              aviso: 'Quedarte callado no hace que el acoso pare solo. Contarlo a alguien de confianza sí ayuda.' }
          ] },
          { tipo: 'msg', texto: 'El grupo sigue escribiendo cosas feas sobre ti, día tras día.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Guardo los mensajes (una captura de pantalla) y se los enseño a un adulto.', segura: true,
              avisoSeguro: 'Guardar las pruebas ayuda a que el adulto entienda lo que pasa y pueda ayudarte mejor.' },
            { texto: 'Borro el chat para no verlo más.', segura: false,
              aviso: 'Borrarlo no hace que pare. Es mejor guardarlo y contarlo, para que un adulto pueda ayudar.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Contárselo a un adulto de confianza',
            confirmacion: 'Se lo has contado a un adulto. Eso es lo correcto. Acosar no está bien y tú no tienes la culpa.' }
        ],
        regla: 'Si alguien te insulta muchas veces en un chat, no es una broma: es acoso. Cuéntaselo siempre a un adulto de confianza. Nunca es tu culpa.'
      },

      {
        id: 'exclusion',
        titulo: 'Me echan del grupo',
        picto: '🚫',
        contacto: 'Amigos del cole',
        relacion: 'Amigos de tu clase',
        pasos: [
          { tipo: 'msg', texto: 'Ves un mensaje: "Hemos hecho un grupo nuevo sin ti, no le digáis nada."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Me siento mal. Se lo cuento a alguien de confianza.', segura: true,
              avisoSeguro: 'Contarlo ayuda. Que te excluyan a propósito y a escondidas duele, y mereces que alguien te ayude.' },
            { texto: 'Hago yo también un grupo para dejar fuera a otro.', segura: false,
              aviso: 'Excluir a otra persona no arregla que te hayan excluido a ti. Mejor cuéntaselo a un adulto.' },
            { texto: 'No le doy importancia, seguro que no es nada.', segura: false,
              aviso: 'Si te duele, sí importa. No hace falta que lo soportes solo o sola.' }
          ] },
          { tipo: 'msg', texto: 'Un compañero te escribe directamente: "Nadie te quiere en el grupo, mejor no insistas."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Le respondo con calma que eso no está bien, y se lo cuento a un adulto.', segura: true,
              avisoSeguro: 'Puedes responder con calma y también contarlo. Las dos cosas ayudan a que la situación mejore.' },
            { texto: 'Le suplico que me dejen entrar en el grupo.', segura: false,
              aviso: 'No tienes que rogar para que te traten bien. Cuéntaselo a alguien de confianza.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Contárselo a un adulto de confianza',
            confirmacion: 'Muy bien. Un adulto puede ayudarte a que la situación cambie.' }
        ],
        regla: 'Que te excluyan a propósito de un grupo también es una forma de acoso. Cuéntaselo a un adulto de confianza.'
      },

      {
        id: 'rumores',
        titulo: 'Están contando mentiras de mí',
        picto: '🗯️',
        contacto: 'Grupo de clase',
        relacion: 'Compañeros de tu clase',
        pasos: [
          { tipo: 'msg', texto: 'Una compañera escribe: "He oído que hizo algo horrible, ¿os lo cuento?"' },
          { tipo: 'msg', texto: 'Varios compañeros responden: "¡Cuéntalo! ¡Cuéntalo!"' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Escribo con calma que eso no es verdad, y se lo cuento a un adulto.', segura: true,
              avisoSeguro: 'Está bien aclarar la verdad con calma. Y contarlo a un adulto ayuda a que pare.' },
            { texto: 'Empiezo a contar cosas falsas de ella también.', segura: false,
              aviso: 'Contar mentiras de otra persona no soluciona nada, y hace más daño. Mejor cuéntaselo a un adulto.' },
            { texto: 'No digo nada, aunque no sea verdad.', segura: false,
              aviso: 'Puedes decir con calma que no es verdad. Y sobre todo, contárselo a alguien de confianza.' }
          ] },
          { tipo: 'msg', texto: 'El rumor sigue circulando y algunos compañeros te miran raro.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Se lo cuento a un adulto de confianza para que me ayude.', segura: true,
              avisoSeguro: 'Un rumor que se extiende necesita la ayuda de un adulto para pararlo bien.' },
            { texto: 'Dejo de ir a clase para no verlos.', segura: false,
              aviso: 'Evitar ir a clase no resuelve el problema. Un adulto puede ayudar a que el rumor pare.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Contárselo a un adulto de confianza',
            confirmacion: 'Bien hecho. Un adulto puede ayudar a aclarar la verdad y a que paren los rumores.' }
        ],
        regla: 'Los rumores falsos también hacen daño. No es tu culpa que los cuenten. Cuéntaselo a un adulto de confianza.'
      },

      {
        id: 'foto',
        titulo: 'Se ríen de una foto mía',
        picto: '📸',
        contacto: 'Grupo de clase',
        relacion: 'Compañeros de tu clase',
        pasos: [
          { tipo: 'msg', texto: 'Alguien comparte una foto tuya en la que sales mal, y escribe: "Mirad qué cara jajaja."' },
          { tipo: 'msg', texto: 'Varios compañeros ponen emoticonos de risa.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Pido que la borren, y se lo cuento a un adulto de confianza.', segura: true,
              avisoSeguro: 'Puedes pedir que la borren y también contarlo a un adulto. Reírse así de una foto tuya no está bien.' },
            { texto: 'Comparto una foto suya para reírme también.', segura: false,
              aviso: 'Hacer lo mismo no soluciona nada y hace más daño. Mejor cuéntaselo a un adulto.' },
            { texto: 'Me río también para que no se note que me duele.', segura: false,
              aviso: 'No hace falta fingir que no duele. Contarlo a un adulto es lo que de verdad ayuda.' }
          ] },
          { tipo: 'msg', texto: 'La foto se sigue compartiendo con más gente.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Guardo el mensaje y se lo enseño a un adulto de confianza.', segura: true,
              avisoSeguro: 'Guardar lo que ha pasado ayuda a que el adulto pueda actuar mejor.' },
            { texto: 'Borro mi cuenta para que no me encuentren.', segura: false,
              aviso: 'No tienes que desaparecer tú. Un adulto puede ayudar a que quiten la foto y pare la burla.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Contárselo a un adulto de confianza',
            confirmacion: 'Muy bien hecho. Un adulto puede ayudar a que quiten la foto y a hablar con quien la compartió.' }
        ],
        regla: 'Compartir una foto tuya para reírse de ti no está bien, aunque digan que es broma. Cuéntaselo a un adulto de confianza.'
      },

      {
        id: 'amenaza',
        titulo: 'Me amenazan en un chat',
        picto: '😨',
        contacto: 'Compañero de clase',
        relacion: 'Un compañero de tu clase',
        pasos: [
          { tipo: 'msg', texto: '"Mañana en el patio vas a ver lo que te espera."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Se lo cuento enseguida a un adulto de confianza.', segura: true,
              avisoSeguro: 'Una amenaza hay que contarla siempre y cuanto antes, a un adulto de confianza.' },
            { texto: 'Le respondo con otra amenaza.', segura: false,
              aviso: 'Responder con otra amenaza puede empeorar las cosas. Cuéntaselo a un adulto ahora mismo.' },
            { texto: 'No voy a clase mañana para evitarlo.', segura: false,
              aviso: 'Faltar a clase no resuelve el problema real. Cuéntaselo a un adulto para que te proteja de verdad.' }
          ] },
          { tipo: 'msg', texto: '"Y no se te ocurra contarlo a nadie."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Se lo cuento a un adulto de todas formas. Es lo más importante.', segura: true,
              avisoSeguro: 'Que te pidan guardar el secreto es otra señal de que hay que contarlo. Un adulto puede protegerte.' },
            { texto: 'No se lo cuento a nadie, como me dice.', segura: false,
              aviso: 'Cuando alguien te pide guardar en secreto algo que te asusta, siempre hay que contarlo a un adulto.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Contárselo a un adulto de confianza ahora mismo',
            confirmacion: 'Muy bien. Ante una amenaza, contarlo enseguida a un adulto es lo más importante y lo más valiente.' }
        ],
        regla: 'Si alguien te amenaza, cuéntaselo enseguida a un adulto de confianza, aunque te pidan que no lo hagas. Un adulto puede protegerte.'
      },

      {
        id: 'testigo',
        titulo: 'Me piden que moleste a otro',
        picto: '👀',
        contacto: 'Grupo de clase',
        relacion: 'Compañeros de tu clase',
        pasos: [
          { tipo: 'msg', texto: 'Un compañero escribe en el grupo: "Vamos a meternos todos con él, escribidle algo feo."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'No participo, y se lo cuento a un adulto de confianza.', segura: true,
              avisoSeguro: 'No unirte y contarlo ayuda a proteger a tu compañero. Eso es ser un buen amigo.' },
            { texto: 'Escribo algo feo también, para no quedar mal con el grupo.', segura: false,
              aviso: 'Unirte para no quedar mal hace daño a otra persona. Mejor no participar, y contarlo.' },
            { texto: 'No escribo nada, pero tampoco se lo digo a nadie.', segura: false,
              aviso: 'No participar ya es un paso, pero contarlo a un adulto ayuda mucho más a proteger a tu compañero.' }
          ] },
          { tipo: 'msg', texto: 'Varios compañeros ya han escrito cosas feas y esperan que tú también lo hagas.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'Le escribo en privado para decirle que no está solo, y se lo cuento a un adulto.', segura: true,
              avisoSeguro: 'Apoyar a quien lo está pasando mal, y contarlo a un adulto, es la mejor forma de ayudar.' },
            { texto: 'Sigo la corriente del grupo para que no se metan conmigo.', segura: false,
              aviso: 'Seguir la corriente hace daño a otra persona. Puedes no participar y contarlo a un adulto.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Contárselo a un adulto de confianza',
            confirmacion: 'Muy bien hecho. Contarlo ayuda a proteger a tu compañero, y a ti también.' }
        ],
        regla: 'Si ves que están acosando a alguien, no participes. Contárselo a un adulto de confianza ayuda a proteger a esa persona.'
      }
    ],

    normas: [
      { picto: '😞', texto: 'Si te insultan muchas veces en un chat, no es una broma: es acoso. Cuéntaselo a un adulto de confianza.' },
      { picto: '🚫', texto: 'Que te excluyan a propósito de un grupo también es acoso. Cuéntaselo a un adulto.' },
      { picto: '🗯️', texto: 'Los rumores falsos hacen daño. No es tu culpa. Cuéntaselo a un adulto.' },
      { picto: '📸', texto: 'Compartir una foto tuya para reírse no está bien, aunque digan que es broma.' },
      { picto: '😨', texto: 'Si alguien te amenaza, cuéntaselo enseguida a un adulto, aunque te pidan que no lo hagas.' },
      { picto: '👀', texto: 'Si ves que acosan a alguien, no participes. Contarlo ayuda a proteger a esa persona.' },
      { picto: '🛡️', texto: 'Si un chat te hace sentir mal: para, guarda los mensajes y cuéntaselo a un adulto. Pedir ayuda siempre está bien.' }
    ]
  },

  en: {
    escenarios: [
      {
        id: 'insultos',
        titulo: "I'm being insulted in the chat",
        picto: '😞',
        contacto: 'Class Group 5B',
        relacion: 'Your class group chat',
        pasos: [
          { tipo: 'msg', texto: 'Someone in the group writes: "You\'re stupid, you can\'t do anything right."' },
          { tipo: 'msg', texto: 'Another classmate laughs and writes: "Haha, it\'s true."' },
          { tipo: 'eleccion', opciones: [
            { texto: "I don't reply. I'm going to tell a trusted adult.", segura: true,
              avisoSeguro: "Telling a trusted adult is the best thing to do. Being insulted again and again is bullying, and it is not your fault." },
            { texto: 'I insult them back, so they know how it feels.', segura: false,
              aviso: "Insulting them back doesn't make it stop, and can make things worse. It's better to tell a trusted adult." },
            { texto: "I say nothing and let it continue.", segura: false,
              aviso: "Staying quiet doesn't make bullying stop on its own. Telling someone you trust really does help." }
          ] },
          { tipo: 'msg', texto: 'The group keeps writing mean things about you, day after day.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'I save the messages (a screenshot) and show them to a trusted adult.', segura: true,
              avisoSeguro: 'Saving the evidence helps the adult understand what is happening and help you better.' },
            { texto: 'I delete the chat so I don\'t see it anymore.', segura: false,
              aviso: "Deleting it doesn't make it stop. It's better to save it and tell someone, so an adult can help." }
          ] },
          { tipo: 'accion', texto: '🗣️ Tell a trusted adult',
            confirmacion: "You told a trusted adult. That's the right thing to do. Bullying is not okay, and it is not your fault." }
        ],
        regla: "If someone insults you many times in a chat, it's not a joke: it's bullying. Always tell a trusted adult. It is never your fault."
      },

      {
        id: 'exclusion',
        titulo: "I'm being left out of the group",
        picto: '🚫',
        contacto: 'School friends',
        relacion: 'Friends from your class',
        pasos: [
          { tipo: 'msg', texto: 'You see a message: "We made a new group without you, don\'t tell them anything."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'I feel bad. I tell someone I trust.', segura: true,
              avisoSeguro: 'Telling someone helps. Being left out on purpose and secretly hurts, and you deserve help.' },
            { texto: 'I make a group too, to leave someone else out.', segura: false,
              aviso: "Excluding someone else doesn't fix being excluded yourself. It's better to tell a trusted adult." },
            { texto: "I don't make a big deal of it, it's probably nothing.", segura: false,
              aviso: 'If it hurts, it does matter. You do not have to deal with it alone.' }
          ] },
          { tipo: 'msg', texto: 'A classmate messages you directly: "Nobody wants you in the group, better stop trying."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'I calmly reply that this is not okay, and I tell a trusted adult.', segura: true,
              avisoSeguro: 'You can reply calmly and also tell someone. Both things help the situation get better.' },
            { texto: 'I beg them to let me into the group.', segura: false,
              aviso: 'You do not have to beg to be treated well. Tell someone you trust.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Tell a trusted adult',
            confirmacion: 'Well done. A trusted adult can help the situation change.' }
        ],
        regla: 'Being deliberately left out of a group is also a form of bullying. Tell a trusted adult.'
      },

      {
        id: 'rumores',
        titulo: 'People are spreading lies about me',
        picto: '🗯️',
        contacto: 'Class group',
        relacion: 'Classmates from your class',
        pasos: [
          { tipo: 'msg', texto: 'A classmate writes: "I heard they did something awful, should I tell everyone?"' },
          { tipo: 'msg', texto: 'Several classmates reply: "Tell us! Tell us!"' },
          { tipo: 'eleccion', opciones: [
            { texto: "I calmly write that it isn't true, and I tell a trusted adult.", segura: true,
              avisoSeguro: "It's okay to calmly set the record straight. And telling a trusted adult helps it stop." },
            { texto: 'I start spreading lies about her too.', segura: false,
              aviso: "Spreading lies about someone else doesn't fix anything, and causes more harm. It's better to tell a trusted adult." },
            { texto: "I say nothing, even though it isn't true.", segura: false,
              aviso: "You can calmly say it isn't true. And most importantly, tell someone you trust." }
          ] },
          { tipo: 'msg', texto: 'The rumor keeps spreading and some classmates give you strange looks.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'I tell a trusted adult so they can help me.', segura: true,
              avisoSeguro: 'A rumor that keeps spreading needs a trusted adult\'s help to stop it properly.' },
            { texto: "I stop going to class so I don't see them.", segura: false,
              aviso: "Avoiding class doesn't solve the real problem. A trusted adult can help the rumor stop." }
          ] },
          { tipo: 'accion', texto: '🗣️ Tell a trusted adult',
            confirmacion: 'Well done. A trusted adult can help set the record straight and stop the rumors.' }
        ],
        regla: 'False rumors hurt too. It is not your fault that people spread them. Tell a trusted adult.'
      },

      {
        id: 'foto',
        titulo: "They're laughing at a photo of me",
        picto: '📸',
        contacto: 'Class group',
        relacion: 'Classmates from your class',
        pasos: [
          { tipo: 'msg', texto: 'Someone shares an unflattering photo of you and writes: "Look at this face, haha."' },
          { tipo: 'msg', texto: 'Several classmates add laughing emojis.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'I ask them to delete it, and I tell a trusted adult.', segura: true,
              avisoSeguro: "You can ask them to delete it and also tell a trusted adult. Laughing at a photo of you like that isn't okay." },
            { texto: 'I share a photo of them to laugh too.', segura: false,
              aviso: "Doing the same thing doesn't fix anything and causes more harm. It's better to tell a trusted adult." },
            { texto: "I laugh along so it doesn't show that it hurts.", segura: false,
              aviso: "You don't have to pretend it doesn't hurt. Telling a trusted adult is what really helps." }
          ] },
          { tipo: 'msg', texto: 'The photo keeps getting shared with more people.' },
          { tipo: 'eleccion', opciones: [
            { texto: 'I save the message and show it to a trusted adult.', segura: true,
              avisoSeguro: 'Saving what happened helps the adult act on it better.' },
            { texto: 'I delete my account so they can\'t find me.', segura: false,
              aviso: 'You do not have to disappear. A trusted adult can help get the photo taken down and stop the mocking.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Tell a trusted adult',
            confirmacion: 'Well done. A trusted adult can help get the photo removed and talk to whoever shared it.' }
        ],
        regla: "Sharing a photo of you to laugh at you is not okay, even if they call it a joke. Tell a trusted adult."
      },

      {
        id: 'amenaza',
        titulo: "I'm being threatened in a chat",
        picto: '😨',
        contacto: 'Classmate',
        relacion: 'A classmate of yours',
        pasos: [
          { tipo: 'msg', texto: '"Tomorrow at break you\'ll see what\'s coming to you."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'I tell a trusted adult right away.', segura: true,
              avisoSeguro: 'A threat should always be reported right away to a trusted adult.' },
            { texto: 'I threaten them back.', segura: false,
              aviso: 'Threatening them back can make things worse. Tell a trusted adult right now.' },
            { texto: "I skip class tomorrow to avoid it.", segura: false,
              aviso: "Missing class doesn't solve the real problem. Tell a trusted adult so they can truly protect you." }
          ] },
          { tipo: 'msg', texto: '"And don\'t you dare tell anyone."' },
          { tipo: 'eleccion', opciones: [
            { texto: 'I tell a trusted adult anyway. That is the most important thing.', segura: true,
              avisoSeguro: 'Being asked to keep it secret is another sign you should tell someone. A trusted adult can protect you.' },
            { texto: "I don't tell anyone, just like they said.", segura: false,
              aviso: "When someone asks you to keep something scary secret, you should always tell a trusted adult." }
          ] },
          { tipo: 'accion', texto: '🗣️ Tell a trusted adult right now',
            confirmacion: 'Well done. Telling a trusted adult right away about a threat is the most important and the bravest thing to do.' }
        ],
        regla: 'If someone threatens you, tell a trusted adult right away, even if they ask you not to. A trusted adult can protect you.'
      },

      {
        id: 'testigo',
        titulo: "I'm asked to pick on someone else",
        picto: '👀',
        contacto: 'Class group',
        relacion: 'Classmates from your class',
        pasos: [
          { tipo: 'msg', texto: 'A classmate writes in the group: "Let\'s all pick on him, write something mean."' },
          { tipo: 'eleccion', opciones: [
            { texto: "I don't join in, and I tell a trusted adult.", segura: true,
              avisoSeguro: 'Not joining in and telling someone helps protect your classmate. That is being a good friend.' },
            { texto: 'I write something mean too, so I don\'t look bad to the group.', segura: false,
              aviso: 'Joining in so you don\'t look bad still hurts another person. Better not to join in, and tell someone.' },
            { texto: "I don't write anything, but I don't tell anyone either.", segura: false,
              aviso: 'Not joining in is already a step, but telling a trusted adult helps protect your classmate much more.' }
          ] },
          { tipo: 'msg', texto: 'Several classmates have already written mean things and expect you to as well.' },
          { tipo: 'eleccion', opciones: [
            { texto: "I message him privately to say he's not alone, and I tell a trusted adult.", segura: true,
              avisoSeguro: 'Supporting someone who is struggling, and telling a trusted adult, is the best way to help.' },
            { texto: 'I go along with the group so they don\'t turn on me.', segura: false,
              aviso: 'Going along with it still hurts another person. You can choose not to join in, and tell a trusted adult.' }
          ] },
          { tipo: 'accion', texto: '🗣️ Tell a trusted adult',
            confirmacion: 'Well done. Telling someone helps protect your classmate, and you too.' }
        ],
        regla: "If you see someone being bullied, don't join in. Telling a trusted adult helps protect that person."
      }
    ],

    normas: [
      { picto: '😞', texto: "If someone insults you many times in a chat, it's not a joke: it's bullying. Tell a trusted adult." },
      { picto: '🚫', texto: 'Being deliberately left out of a group is also bullying. Tell a trusted adult.' },
      { picto: '🗯️', texto: 'False rumors hurt too. It is not your fault. Tell a trusted adult.' },
      { picto: '📸', texto: "Sharing a photo of you to laugh at you is not okay, even if they call it a joke." },
      { picto: '😨', texto: 'If someone threatens you, tell a trusted adult right away, even if they ask you not to.' },
      { picto: '👀', texto: "If you see someone being bullied, don't join in. Telling someone helps protect that person." },
      { picto: '🛡️', texto: 'If a chat makes you feel bad: stop, save the messages and tell a trusted adult. Asking for help is always okay.' }
    ]
  }
};
