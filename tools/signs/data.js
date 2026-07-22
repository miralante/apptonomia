/* ============================================================
   Datos: Señales (peligro, avisos, baño, etc.)
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ senal, nombre, tipo, opciones: string[3], correcta }] }] }
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Señales de peligro y avisos',
        estrellas: 1,
        items: [
          { senal: '⚠️', nombre: 'Peligro', tipo: 'senal-peligro-picto', opciones: ['Cuidado, hay peligro', 'Pasa rápido', 'Zona segura'], correcta: 0 },
          { senal: '🚫', nombre: 'Prohibido', tipo: 'senal-prohibicion-picto', opciones: ['Se puede hacer', 'No está permitido', 'Obligatorio'], correcta: 1 },
          { senal: '🔥', nombre: 'Fuego', tipo: 'senal-peligro-picto', opciones: ['Puedes tocarlo', 'Cuidado con el fuego', 'Es seguro'], correcta: 1 },
          { senal: '⚡', nombre: 'Peligro de electrocución', tipo: 'senal-peligro-picto', opciones: ['Es seguro tocarlo', 'Riesgo de electrocución, no lo toques', 'Es un juguete'], correcta: 1 },
          { senal: '☣️', nombre: 'Radiactivo', tipo: 'senal-peligro-picto', opciones: ['Es seguro tocarlo', 'No te acerques', 'Puedes jugar'], correcta: 1 },
          { senal: '☠️', nombre: 'Veneno', tipo: 'senal-peligro-picto', opciones: ['Es comida', 'No tocar ni comer', 'Puedes probarlo'], correcta: 1 },
          { senal: '⚠️', nombre: 'Precaución', tipo: 'senal-peligro-picto', opciones: ['Pasa sin mirar', 'Ten cuidado', 'Es una zona de juego'], correcta: 1 },
          { senal: '🔴', nombre: 'Alto', tipo: 'senal-peligro-picto', opciones: ['Sigue adelante', 'Para y espera', 'Corre rápido'], correcta: 1 },
          { senal: '💀', nombre: 'Peligro de muerte', tipo: 'senal-peligro-picto', opciones: ['Zona segura', 'Extremadamente peligroso', 'Puedes entrar'], correcta: 1 },
          { senal: '🛑', nombre: 'Pare', tipo: 'senal-peligro-picto', opciones: ['Sigue andando', 'Detente completamente', 'Corre'], correcta: 1 },
          { senal: '🚧', nombre: 'Obras', tipo: 'senal-peligro-picto', opciones: ['Puedes pasar tranquilo', 'Aviso de obras, ten cuidado', 'Es una tienda'], correcta: 1 },
          { senal: '💦', nombre: 'Suelo mojado', tipo: 'senal-peligro-picto', opciones: ['El suelo está seco', 'Aviso: el suelo está mojado', 'Puedes correr'], correcta: 1 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Señales de baño y aseo',
        estrellas: 2,
        items: [
          { senal: '🚽', nombre: 'Baño / WC', tipo: 'senal-informacion-picto', opciones: ['Es una cocina', 'Para ir al baño', 'Es un dormitorio'], correcta: 1 },
          { senal: '🚹', nombre: 'Baño de hombres', tipo: 'senal-informacion-picto', opciones: ['Baño de mujeres', 'Baño para hombres', 'Es la salida'], correcta: 1 },
          { senal: '🚺', nombre: 'Baño de mujeres', tipo: 'senal-informacion-picto', opciones: ['Baño de hombres', 'Baño para mujeres', 'Es la entrada'], correcta: 1 },
          { senal: '🚿', nombre: 'Ducha', tipo: 'senal-informacion-picto', opciones: ['Para comer', 'Para ducharse', 'Para dormir'], correcta: 1 },
          { senal: '🛁', nombre: 'Bañera', tipo: 'senal-informacion-picto', opciones: ['Para jugar', 'Para bañarse', 'Para trabajar'], correcta: 1 },
          { senal: '🚰', nombre: 'Agua potable', tipo: 'senal-informacion-picto', opciones: ['No potable', 'Agua que puedes beber', 'Es de colores'], correcta: 1 },
          { senal: '🧴', nombre: 'Jabón', tipo: 'senal-obligacion-picto', opciones: ['Es comida', 'Para lavarse', 'Es perfume'], correcta: 1 },
          { senal: '🧻', nombre: 'Papel higiénico', tipo: 'senal-informacion-picto', opciones: ['Para secarse', 'Para jugar', 'Para comer'], correcta: 0 },
          { senal: '🚴', nombre: 'Vestuarios', tipo: 'senal-informacion-picto', opciones: ['Para ducharse y cambiarse', 'Para comer', 'Para estudiar'], correcta: 0 },
          { senal: '🧼', nombre: 'Lavabo', tipo: 'senal-informacion-picto', opciones: ['Para dormir', 'Para lavarse manos y cara', 'Para cocinar'], correcta: 1 },
          { senal: '💧', nombre: 'Agua', tipo: 'senal-informacion-picto', opciones: ['Es fuego', 'Es agua', 'Es tierra'], correcta: 1 },
          { senal: '🧹', nombre: 'Limpieza', tipo: 'senal-obligacion-picto', opciones: ['Zona sucia', 'Mantén la limpieza', 'Tira papeles'], correcta: 1 }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Señales de obligación y prohibición',
        estrellas: 2,
        items: [
          { senal: '⛔', nombre: 'Prohibido el paso', tipo: 'senal-prohibicion-picto', opciones: ['Puedes pasar', 'No puedes pasar', 'Entra rápido'], correcta: 1 },
          { senal: '🚭', nombre: 'Prohibido fumar', tipo: 'senal-prohibicion-picto', opciones: ['Puedes fumar', 'No fumar aquí', 'Fuma fuera'], correcta: 1 },
          { senal: '📵', nombre: 'Prohibido el móvil', tipo: 'senal-prohibicion-picto', opciones: ['Usa el móvil todo lo que quieras', 'No uses el móvil', 'Llama por teléfono'], correcta: 1 },
          { senal: '🐕', nombre: 'No perros', tipo: 'senal-prohibicion-picto', opciones: ['Puedes traer perros', 'No traer animales', 'Los perros entran'], correcta: 1 },
          { senal: '🚳', nombre: 'Prohibido bicicletas', tipo: 'senal-prohibicion-picto', opciones: ['Entra en bici', 'No entrar en bici', 'Deja la bici fuera'], correcta: 1 },
          { senal: '🈲', nombre: 'Prohibido', tipo: 'senal-prohibicion-picto', opciones: ['Está permitido', 'No está permitido', 'Es obligatorio'], correcta: 1 },
          { senal: '⭕', nombre: 'Circulación', tipo: 'senal-informacion-picto', opciones: ['Zona para correr', 'Zona de paso', 'Zona prohibida'], correcta: 1 },
          { senal: '🚸', nombre: 'Paso de peatones', tipo: 'senal-obligacion-picto', opciones: ['Para los coches', 'Cruza por aquí', 'Corre'], correcta: 1 },
          { senal: '⏱️', nombre: 'Tiempo limitado', tipo: 'senal-informacion-picto', opciones: ['Tiempo ilimitado', 'Tiempo máximo', 'No hay tiempo'], correcta: 1 },
          { senal: '🔒', nombre: 'Cerrado', tipo: 'senal-prohibicion-picto', opciones: ['Abierto', 'Cerrado, no entrar', 'Entra sin parar'], correcta: 1 }
        ]
      },
      {
        id: 4,
        nombre: 'Nivel 4',
        descripcion: 'Señales de información y salidas',
        estrellas: 2,
        items: [
          { senal: '🚪', nombre: 'Salida', tipo: 'senal-salida-picto', opciones: ['Entrada', 'Salida, por aquí se sale', 'Es la cocina'], correcta: 1 },
          { senal: '🏃', nombre: 'Salida de emergencia', tipo: 'senal-salida-picto', opciones: ['Zona peligrosa', 'Por aquí se sale si hay emergencia', 'Es un baño'], correcta: 1 },
          { senal: '🔓', nombre: 'Abierto', tipo: 'senal-informacion-picto', opciones: ['Cerrado', 'Abierto, puedes entrar', 'Es privado'], correcta: 1 },
          { senal: '🅿️', nombre: 'Aparcamiento', tipo: 'senal-informacion-picto', opciones: ['Para jugar', 'Para aparcar coches', 'Para comer'], correcta: 1 },
          { senal: 'ℹ️', nombre: 'Información', tipo: 'senal-informacion-picto', opciones: ['Es peligroso', 'Aquí hay información', 'No mires'], correcta: 1 },
          { senal: '📍', nombre: 'Ubicación', tipo: 'senal-informacion-picto', opciones: ['Estás aquí', 'Es lejos', 'No mires el mapa'], correcta: 0 },
          { senal: '🗺️', nombre: 'Mapa', tipo: 'senal-informacion-picto', opciones: ['Para perderse', 'Para orientarte', 'Es decorativo'], correcta: 1 },
          { senal: '🛗', nombre: 'Ascensor', tipo: 'senal-informacion-picto', opciones: ['Por las escaleras', 'Para subir y bajar', 'Es la puerta'], correcta: 1 },
          { senal: '📶', nombre: 'WiFi', tipo: 'senal-informacion-picto', opciones: ['No hay conexión', 'Hay WiFi aquí', 'Es un teléfono'], correcta: 1 },
          { senal: '🔋', nombre: 'Cargador', tipo: 'senal-informacion-picto', opciones: ['Para jugar', 'Para cargar dispositivos', 'Es una pila'], correcta: 1 }
        ]
      },
      {
        id: 5,
        nombre: 'Nivel 5',
        descripcion: 'Señales de emergencia y primeros auxilios',
        estrellas: 3,
        items: [
          { senal: '🚑', nombre: 'Ambulancia / Socorro', tipo: 'senal-salida-picto', opciones: ['Para el coche', 'Emergencia médica', 'Es un taxi'], correcta: 1 },
          { senal: '🚒', nombre: 'Bomberos', tipo: 'senal-peligro-picto', opciones: ['Para la comida', 'Emergencia de fuego', 'Es la policía'], correcta: 1 },
          { senal: '🚓', nombre: 'Policía', tipo: 'senal-informacion-picto', opciones: ['Para jugar', 'Seguridad y orden', 'Es una ambulancia'], correcta: 1 },
          { senal: '🆘', nombre: 'Socorro', tipo: 'senal-peligro-picto', opciones: ['Todo bien', 'Necesito ayuda', 'No pasa nada'], correcta: 1 },
          { senal: '🆗', nombre: 'Vale / OK', tipo: 'senal-informacion-picto', opciones: ['No está bien', 'Está bien / correcto', 'Hay un problema'], correcta: 1 },
          { senal: '🩹', nombre: 'Tirita / Apósito', tipo: 'senal-informacion-picto', opciones: ['Para cortar', 'Para curar heridas', 'Para jugar'], correcta: 1 },
          { senal: '💊', nombre: 'Medicina', tipo: 'senal-informacion-picto', opciones: ['Es comida', 'Medicamentos', 'Es veneno'], correcta: 1 },
          { senal: '🩺', nombre: 'Estetoscopio', tipo: 'senal-informacion-picto', opciones: ['Para escuchar el corazón', 'Es un juguete', 'Para decorar'], correcta: 0 },
          { senal: '🏥', nombre: 'Hospital', tipo: 'senal-informacion-picto', opciones: ['Para comprar', 'Centro de salud', 'Es una tienda'], correcta: 1 },
          { senal: '🧯', nombre: 'Extintor', tipo: 'senal-peligro-picto', opciones: ['Para encender fuego', 'Para apagar fuego', 'Es decoración'], correcta: 1 }
        ]
      },
      {
        id: 6,
        nombre: 'Nivel 6',
        descripcion: 'Señales de transporte público',
        estrellas: 3,
        items: [
          { senal: '🚌', nombre: 'Parada de autobús', tipo: 'senal-informacion-picto', opciones: ['Para esperar el autobús', 'Para aparcar', 'Es un taxi'], correcta: 0 },
          { senal: '🚇', nombre: 'Metro', tipo: 'senal-informacion-picto', opciones: ['Tren de superficie', 'Tren subterráneo', 'Autobús'], correcta: 1 },
          { senal: '🚆', nombre: 'Tren', tipo: 'senal-informacion-picto', opciones: ['Barco', 'Tren / Ferrocaril', 'Avión'], correcta: 1 },
          { senal: '✈️', nombre: 'Avión', tipo: 'senal-informacion-picto', opciones: ['Barco', 'Tren', 'Avión'], correcta: 2 },
          { senal: '🚢', nombre: 'Barco', tipo: 'senal-informacion-picto', opciones: ['Avión', 'Tren', 'Barco'], correcta: 2 },
          { senal: '🚕', nombre: 'Taxi', tipo: 'senal-informacion-picto', opciones: ['Autobús', 'Taxi', 'Coche privado'], correcta: 1 },
          { senal: '⛽', nombre: 'Gasolinera', tipo: 'senal-informacion-picto', opciones: ['Para comer', 'Para repostar combustible', 'Para dormir'], correcta: 1 },
          { senal: '🚗', nombre: 'Aparcamiento', tipo: 'senal-informacion-picto', opciones: ['Zona verde', 'Zona para aparcar', 'Zona de juegos'], correcta: 1 },
          { senal: '🛤️', nombre: 'Vías del tren', tipo: 'senal-peligro-picto', opciones: ['Zona segura', 'Peligro, vías de tren', 'Zona de paso'], correcta: 1 },
          { senal: '⚓', nombre: 'Puerto', tipo: 'senal-informacion-picto', opciones: ['Aeropuerto', 'Puerto marítimo', 'Estación de tren'], correcta: 1 }
        ]
      },
      {
        id: 7,
        nombre: 'Nivel 7',
        descripcion: 'Siglas importantes',
        estrellas: 3,
        items: [
          { senal: 'WC', nombre: 'Baño', tipo: 'senal-siglas-picto', opciones: ['Es un restaurante', 'Baño / aseo público', 'Es una tienda'], correcta: 1 },
          { senal: 'DNI', nombre: 'Documento de identidad', tipo: 'senal-siglas-picto', opciones: ['El documento que dice quién eres', 'Un tipo de coche', 'Un billete de tren'], correcta: 0 },
          { senal: 'ITV', nombre: 'Revisión del coche', tipo: 'senal-siglas-picto', opciones: ['Un canal de televisión', 'Revisión obligatoria del coche', 'Un tipo de gasolina'], correcta: 1 },
          { senal: 'IVA', nombre: 'Impuesto', tipo: 'senal-siglas-picto', opciones: ['Impuesto que pagas al comprar', 'El nombre de una tienda', 'Un tipo de pan'], correcta: 0 },
          { senal: 'ONG', nombre: 'Organización solidaria', tipo: 'senal-siglas-picto', opciones: ['Una organización que ayuda sin ánimo de lucro', 'Un banco', 'Una marca de coches'], correcta: 0 },
          { senal: 'SOS', nombre: 'Pide ayuda', tipo: 'senal-siglas-picto', opciones: ['Todo va bien', 'Pide ayuda urgente', 'Es un saludo'], correcta: 1 },
          { senal: 'PVP', nombre: 'Precio', tipo: 'senal-siglas-picto', opciones: ['El precio que pagas por el producto', 'El nombre del producto', 'La fecha de caducidad'], correcta: 0 },
          { senal: 'CP', nombre: 'Código postal', tipo: 'senal-siglas-picto', opciones: ['El número de tu calle', 'El código para las cartas y paquetes', 'Tu número de teléfono'], correcta: 1 },
          { senal: 'UCI', nombre: 'Parte del hospital', tipo: 'senal-siglas-picto', opciones: ['Zona del hospital para casos muy graves', 'La entrada del hospital', 'La cafetería del hospital'], correcta: 0 }
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
        descripcion: 'Danger signs and warnings',
        estrellas: 1,
        items: [
          { senal: '⚠️', nombre: 'Danger', tipo: 'senal-peligro-picto', opciones: ['Be careful, there is danger', 'Go fast', 'Safe zone'], correcta: 0 },
          { senal: '🚫', nombre: 'Prohibited', tipo: 'senal-prohibicion-picto', opciones: ['You can do it', 'Not allowed', 'Mandatory'], correcta: 1 },
          { senal: '🔥', nombre: 'Fire', tipo: 'senal-peligro-picto', opciones: ['You can touch it', 'Be careful with fire', 'It is safe'], correcta: 1 },
          { senal: '⚡', nombre: 'Electrocution hazard', tipo: 'senal-peligro-picto', opciones: ['It is safe to touch', 'Risk of electric shock, do not touch', 'It is a toy'], correcta: 1 },
          { senal: '☣️', nombre: 'Radioactive', tipo: 'senal-peligro-picto', opciones: ['Safe to touch', 'Do not get close', 'You can play'], correcta: 1 },
          { senal: '☠️', nombre: 'Poison', tipo: 'senal-peligro-picto', opciones: ['It is food', 'Do not touch or eat', 'You can try it'], correcta: 1 },
          { senal: '⚠️', nombre: 'Caution', tipo: 'senal-peligro-picto', opciones: ['Pass without looking', 'Be careful', 'It is a play area'], correcta: 1 },
          { senal: '🔴', nombre: 'Stop', tipo: 'senal-peligro-picto', opciones: ['Keep going', 'Stop and wait', 'Run fast'], correcta: 1 },
          { senal: '💀', nombre: 'Danger of death', tipo: 'senal-peligro-picto', opciones: ['Safe zone', 'Extremely dangerous', 'You can enter'], correcta: 1 },
          { senal: '🛑', nombre: 'Stop', tipo: 'senal-peligro-picto', opciones: ['Keep walking', 'Stop completely', 'Run'], correcta: 1 },
          { senal: '🚧', nombre: 'Roadworks', tipo: 'senal-peligro-picto', opciones: ['You can pass without worry', 'Roadworks warning, be careful', 'It is a shop'], correcta: 1 },
          { senal: '💦', nombre: 'Wet floor', tipo: 'senal-peligro-picto', opciones: ['The floor is dry', 'Warning: the floor is wet', 'You can run'], correcta: 1 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Bathroom and hygiene signs',
        estrellas: 2,
        items: [
          { senal: '🚽', nombre: 'Toilet / WC', tipo: 'senal-informacion-picto', opciones: ['It is a kitchen', 'To go to the bathroom', 'It is a bedroom'], correcta: 1 },
          { senal: '🚹', nombre: 'Men’s restroom', tipo: 'senal-informacion-picto', opciones: ['Women’s restroom', 'Restroom for men', 'It is the exit'], correcta: 1 },
          { senal: '🚺', nombre: 'Women’s restroom', tipo: 'senal-informacion-picto', opciones: ['Men’s restroom', 'Restroom for women', 'It is the entrance'], correcta: 1 },
          { senal: '🚿', nombre: 'Shower', tipo: 'senal-informacion-picto', opciones: ['To eat', 'To shower', 'To sleep'], correcta: 1 },
          { senal: '🛁', nombre: 'Bathtub', tipo: 'senal-informacion-picto', opciones: ['To play', 'To take a bath', 'To work'], correcta: 1 },
          { senal: '🚰', nombre: 'Drinking water', tipo: 'senal-informacion-picto', opciones: ['Not drinkable', 'Water you can drink', 'It is colorful'], correcta: 1 },
          { senal: '🧴', nombre: 'Soap', tipo: 'senal-obligacion-picto', opciones: ['It is food', 'To wash', 'It is perfume'], correcta: 1 },
          { senal: '🧻', nombre: 'Toilet paper', tipo: 'senal-informacion-picto', opciones: ['To dry yourself', 'To play', 'To eat'], correcta: 0 },
          { senal: '🚴', nombre: 'Changing rooms', tipo: 'senal-informacion-picto', opciones: ['To shower and change', 'To eat', 'To study'], correcta: 0 },
          { senal: '🧼', nombre: 'Sink', tipo: 'senal-informacion-picto', opciones: ['To sleep', 'To wash hands and face', 'To cook'], correcta: 1 },
          { senal: '💧', nombre: 'Water', tipo: 'senal-informacion-picto', opciones: ['It is fire', 'It is water', 'It is earth'], correcta: 1 },
          { senal: '🧹', nombre: 'Cleaning', tipo: 'senal-obligacion-picto', opciones: ['Dirty area', 'Keep it clean', 'Throw trash'], correcta: 1 }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'Obligation and prohibition signs',
        estrellas: 2,
        items: [
          { senal: '⛔', nombre: 'No entry', tipo: 'senal-prohibicion-picto', opciones: ['You can pass', 'You cannot pass', 'Enter quickly'], correcta: 1 },
          { senal: '🚭', nombre: 'No smoking', tipo: 'senal-prohibicion-picto', opciones: ['You can smoke', 'No smoking here', 'Smoke outside'], correcta: 1 },
          { senal: '📵', nombre: 'No mobile phones', tipo: 'senal-prohibicion-picto', opciones: ['Use your phone as much as you want', 'Do not use your phone', 'Make phone calls'], correcta: 1 },
          { senal: '🐕', nombre: 'No dogs', tipo: 'senal-prohibicion-picto', opciones: ['You can bring dogs', 'Do not bring animals', 'Dogs allowed'], correcta: 1 },
          { senal: '🚳', nombre: 'No bicycles', tipo: 'senal-prohibicion-picto', opciones: ['Enter on bike', 'Do not enter on bike', 'Leave bike outside'], correcta: 1 },
          { senal: '🈲', nombre: 'Prohibited', tipo: 'senal-prohibicion-picto', opciones: ['It is allowed', 'Not allowed', 'It is mandatory'], correcta: 1 },
          { senal: '⭕', nombre: 'Traffic circle', tipo: 'senal-informacion-picto', opciones: ['Running zone', 'Walking area', 'Prohibited zone'], correcta: 1 },
          { senal: '🚸', nombre: 'Pedestrian crossing', tipo: 'senal-obligacion-picto', opciones: ['For cars', 'Cross here', 'Run'], correcta: 1 },
          { senal: '⏱️', nombre: 'Time limit', tipo: 'senal-informacion-picto', opciones: ['Unlimited time', 'Maximum time', 'No time limit'], correcta: 1 },
          { senal: '🔒', nombre: 'Closed', tipo: 'senal-prohibicion-picto', opciones: ['Open', 'Closed, do not enter', 'Enter without stopping'], correcta: 1 }
        ]
      },
      {
        id: 4,
        nombre: 'Level 4',
        descripcion: 'Information and exit signs',
        estrellas: 2,
        items: [
          { senal: '🚪', nombre: 'Exit', tipo: 'senal-salida-picto', opciones: ['Entrance', 'Exit, this way out', 'It is the kitchen'], correcta: 1 },
          { senal: '🏃', nombre: 'Emergency exit', tipo: 'senal-salida-picto', opciones: ['Dangerous zone', 'Exit this way in case of emergency', 'It is a bathroom'], correcta: 1 },
          { senal: '🔓', nombre: 'Open', tipo: 'senal-informacion-picto', opciones: ['Closed', 'Open, you can enter', 'It is private'], correcta: 1 },
          { senal: '🅿️', nombre: 'Parking', tipo: 'senal-informacion-picto', opciones: ['To play', 'To park cars', 'To eat'], correcta: 1 },
          { senal: 'ℹ️', nombre: 'Information', tipo: 'senal-informacion-picto', opciones: ['It is dangerous', 'There is information here', 'Do not look'], correcta: 1 },
          { senal: '📍', nombre: 'Location', tipo: 'senal-informacion-picto', opciones: ['You are here', 'It is far', 'Do not look at the map'], correcta: 0 },
          { senal: '🗺️', nombre: 'Map', tipo: 'senal-informacion-picto', opciones: ['To get lost', 'To find your way', 'It is decorative'], correcta: 1 },
          { senal: '🛗', nombre: 'Elevator', tipo: 'senal-informacion-picto', opciones: ['Use the stairs', 'To go up and down', 'It is a door'], correcta: 1 },
          { senal: '📶', nombre: 'WiFi', tipo: 'senal-informacion-picto', opciones: ['No connection', 'There is WiFi here', 'It is a phone'], correcta: 1 },
          { senal: '🔋', nombre: 'Charger', tipo: 'senal-informacion-picto', opciones: ['To play', 'To charge devices', 'It is a battery'], correcta: 1 }
        ]
      },
      {
        id: 5,
        nombre: 'Level 5',
        descripcion: 'Emergency and first aid signs',
        estrellas: 3,
        items: [
          { senal: '🚑', nombre: 'Ambulance / Help', tipo: 'senal-salida-picto', opciones: ['For the car', 'Medical emergency', 'It is a taxi'], correcta: 1 },
          { senal: '🚒', nombre: 'Firefighters', tipo: 'senal-peligro-picto', opciones: ['For food', 'Fire emergency', 'It is the police'], correcta: 1 },
          { senal: '🚓', nombre: 'Police', tipo: 'senal-informacion-picto', opciones: ['To play', 'Safety and order', 'It is an ambulance'], correcta: 1 },
          { senal: '🆘', nombre: 'Help', tipo: 'senal-peligro-picto', opciones: ['Everything is fine', 'I need help', 'Nothing is wrong'], correcta: 1 },
          { senal: '🆗', nombre: 'OK / Good', tipo: 'senal-informacion-picto', opciones: ['Not okay', 'It is okay / correct', 'There is a problem'], correcta: 1 },
          { senal: '🩹', nombre: 'Bandage', tipo: 'senal-informacion-picto', opciones: ['To cut', 'To treat wounds', 'To play'], correcta: 1 },
          { senal: '💊', nombre: 'Medicine', tipo: 'senal-informacion-picto', opciones: ['It is food', 'Medications', 'It is poison'], correcta: 1 },
          { senal: '🩺', nombre: 'Stethoscope', tipo: 'senal-informacion-picto', opciones: ['To listen to the heart', 'It is a toy', 'To decorate'], correcta: 0 },
          { senal: '🏥', nombre: 'Hospital', tipo: 'senal-informacion-picto', opciones: ['To shop', 'Health center', 'It is a shop'], correcta: 1 },
          { senal: '🧯', nombre: 'Fire extinguisher', tipo: 'senal-peligro-picto', opciones: ['To start fire', 'To put out fire', 'It is decoration'], correcta: 1 }
        ]
      },
      {
        id: 6,
        nombre: 'Level 6',
        descripcion: 'Public transport signs',
        estrellas: 3,
        items: [
          { senal: '🚌', nombre: 'Bus stop', tipo: 'senal-informacion-picto', opciones: ['To wait for the bus', 'To park', 'It is a taxi'], correcta: 0 },
          { senal: '🚇', nombre: 'Metro / Subway', tipo: 'senal-informacion-picto', opciones: ['Surface train', 'Underground train', 'Bus'], correcta: 1 },
          { senal: '🚆', nombre: 'Train', tipo: 'senal-informacion-picto', opciones: ['Ship', 'Train / Railway', 'Plane'], correcta: 1 },
          { senal: '✈️', nombre: 'Airplane', tipo: 'senal-informacion-picto', opciones: ['Ship', 'Train', 'Airplane'], correcta: 2 },
          { senal: '🚢', nombre: 'Ship / Boat', tipo: 'senal-informacion-picto', opciones: ['Airport', 'Seaport', 'Train station'], correcta: 1 },
          { senal: '🚕', nombre: 'Taxi', tipo: 'senal-informacion-picto', opciones: ['Bus', 'Taxi', 'Private car'], correcta: 1 },
          { senal: '⛽', nombre: 'Gas station', tipo: 'senal-informacion-picto', opciones: ['To eat', 'To refuel', 'To sleep'], correcta: 1 },
          { senal: '🚗', nombre: 'Parking', tipo: 'senal-informacion-picto', opciones: ['Green zone', 'Parking area', 'Play zone'], correcta: 1 },
          { senal: '🛤️', nombre: 'Railway tracks', tipo: 'senal-peligro-picto', opciones: ['Safe zone', 'Danger, railway tracks', 'Walking area'], correcta: 1 },
          { senal: '⚓', nombre: 'Port', tipo: 'senal-informacion-picto', opciones: ['Airport', 'Seaport', 'Train station'], correcta: 1 }
        ]
      },
      {
        id: 7,
        nombre: 'Level 7',
        descripcion: 'Important abbreviations',
        estrellas: 3,
        items: [
          { senal: 'WC', nombre: 'Restroom', tipo: 'senal-siglas-picto', opciones: ['It is a restaurant', 'Toilet / restroom', 'It is a shop'], correcta: 1 },
          { senal: 'ID', nombre: 'Identity document', tipo: 'senal-siglas-picto', opciones: ['The document that says who you are', 'A type of car', 'A train ticket'], correcta: 0 },
          { senal: 'ATM', nombre: 'Cash machine', tipo: 'senal-siglas-picto', opciones: ['A machine to get cash', 'A type of shop', 'A bus stop'], correcta: 0 },
          { senal: 'VIP', nombre: 'Very important person', tipo: 'senal-siglas-picto', opciones: ['A special area for important guests', 'A type of food', 'A parking fine'], correcta: 0 },
          { senal: 'SOS', nombre: 'Call for help', tipo: 'senal-siglas-picto', opciones: ['Everything is fine', 'Call for urgent help', 'It is a greeting'], correcta: 1 },
          { senal: 'FAQ', nombre: 'Common questions', tipo: 'senal-siglas-picto', opciones: ['Common questions and answers', 'A type of ticket', 'A closing time'], correcta: 0 },
          { senal: 'RIP', nombre: 'On a gravestone', tipo: 'senal-siglas-picto', opciones: ['Words seen on a gravestone', 'A type of sandwich', 'A road sign'], correcta: 0 },
          { senal: 'ASAP', nombre: 'As soon as possible', tipo: 'senal-siglas-picto', opciones: ['As soon as possible', 'Never again', 'Once a year'], correcta: 0 },
          { senal: 'ICU', nombre: 'Hospital area', tipo: 'senal-siglas-picto', opciones: ['Hospital area for very serious cases', 'The hospital entrance', 'The hospital cafeteria'], correcta: 0 }
        ]
      }
    ]
  }
};
