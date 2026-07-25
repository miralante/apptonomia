/* ============================================================
   Datos: Mis Rutinas — rutinas diarias paso a paso.
   Formato: DATA.es / DATA.en, cada uno un array:
   [{ id, nombre, picto, momento, pasos: [{ texto, picto }] }]
   - texto: en Lectura Fácil (frase corta, una idea).
   - picto: emoji grande que representa el paso.
   - momento: agrupador del menú
     ('manana' | 'comida' | 'limpieza' | 'personal' | 'mascotas'
      | 'salida' | 'tarde' | 'noche').
   Para ampliar: añadir un objeto nuevo al array del idioma.
   El progreso se reinicia cada día de forma automática.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: [
    /* ---------- Por la mañana ---------- */
    {
      id: 'manana',
      nombre: 'Por la mañana',
      picto: '🌅',
      momento: 'manana',
      pasos: [
        { texto: 'Me levanto de la cama.', picto: '🛏️' },
        { texto: 'Voy al baño.', picto: '🚽' },
        { texto: 'Me lavo la cara.', picto: '🧼' },
        { texto: 'Me visto.', picto: '👕' },
        { texto: 'Desayuno.', picto: '🥛' },
        { texto: 'Me lavo los dientes.', picto: '🪥' }
      ]
    },
    {
      id: 'hacer-cama',
      nombre: 'Hacer la cama',
      picto: '🛏️',
      momento: 'manana',
      pasos: [
        { texto: 'Quito la manta y la almohada.', picto: '🛌' },
        { texto: 'Estiro la sábana.', picto: '🟦' },
        { texto: 'Pongo la manta.', picto: '🛌' },
        { texto: 'Pongo la almohada.', picto: '🪶' }
      ]
    },

    /* ---------- Cuidado personal ---------- */
    {
      id: 'ducha',
      nombre: 'Ducharme',
      picto: '🚿',
      momento: 'personal',
      pasos: [
        { texto: 'Me quito la ropa.', picto: '👕' },
        { texto: 'Abro el grifo.', picto: '🚰' },
        { texto: 'Me mojo el cuerpo.', picto: '💧' },
        { texto: 'Me enjabono.', picto: '🧼' },
        { texto: 'Me aclaro.', picto: '🚿' },
        { texto: 'Me seco con la toalla.', picto: '🛁' }
      ]
    },
    {
      id: 'lavarse-dientes',
      nombre: 'Lavarme los dientes',
      picto: '🪥',
      momento: 'personal',
      pasos: [
        { texto: 'Cojo el cepillo.', picto: '🪥' },
        { texto: 'Pongo pasta.', picto: '🪥' },
        { texto: 'Me cepillo arriba.', picto: '🪥' },
        { texto: 'Me cepillo abajo.', picto: '🪥' },
        { texto: 'Enjuago la boca.', picto: '💧' }
      ]
    },
    {
      id: 'vestirse',
      nombre: 'Vestirme',
      picto: '👕',
      momento: 'personal',
      pasos: [
        { texto: 'Elijo la ropa.', picto: '👕' },
        { texto: 'Me pongo la camiseta.', picto: '👕' },
        { texto: 'Me pongo los pantalones.', picto: '👖' },
        { texto: 'Me pongo los calcetines.', picto: '🧦' },
        { texto: 'Me pongo los zapatos.', picto: '👟' }
      ]
    },
    {
      id: 'peinarse',
      nombre: 'Peinarme',
      picto: '💇',
      momento: 'personal',
      pasos: [
        { texto: 'Cojo el peine.', picto: '🪮' },
        { texto: 'Me peino el pelo.', picto: '💇' },
        { texto: 'Me miro al espejo.', picto: '🪞' }
      ]
    },

    /* ---------- Comidas ---------- */
    {
      id: 'comer',
      nombre: 'Antes de comer',
      picto: '🍽️',
      momento: 'comida',
      pasos: [
        { texto: 'Me lavo las manos.', picto: '🧼' },
        { texto: 'Pongo la mesa.', picto: '🍽️' },
        { texto: 'Me siento en la mesa.', picto: '🪑' },
        { texto: 'Como despacio.', picto: '🥄' },
        { texto: 'Recojo mi plato.', picto: '🧽' }
      ]
    },
    {
      id: 'preparar-desayuno',
      nombre: 'Preparar el desayuno',
      picto: '🥣',
      momento: 'comida',
      pasos: [
        { texto: 'Saco un bol.', picto: '🥣' },
        { texto: 'Echo los cereales.', picto: '🥣' },
        { texto: 'Echo la leche.', picto: '🥛' },
        { texto: 'Cojo una cuchara.', picto: '🥄' },
        { texto: 'Me siento a desayunar.', picto: '🪑' }
      ]
    },
    {
      id: 'preparar-merienda',
      nombre: 'Preparar la merienda',
      picto: '🥪',
      momento: 'comida',
      pasos: [
        { texto: 'Saco pan.', picto: '🍞' },
        { texto: 'Unto mantequilla.', picto: '🧈' },
        { texto: 'Pongo el fiambre.', picto: '🥩' },
        { texto: 'Corto por la mitad.', picto: '🔪' },
        { texto: 'Lo pongo en un plato.', picto: '🍽️' }
      ]
    },
    {
      id: 'cocinar',
      nombre: 'Cocinar un plato',
      picto: '🍳',
      momento: 'comida',
      pasos: [
        { texto: 'Lavo los alimentos.', picto: '🚿' },
        { texto: 'Los corto.', picto: '🔪' },
        { texto: 'Caliento la sartén.', picto: '🍳' },
        { texto: 'Los cocino.', picto: '🍳' },
        { texto: 'Sirvo en el plato.', picto: '🍽️' }
      ]
    },

    /* ---------- Limpieza del hogar ---------- */
    {
      id: 'recoger-mesa',
      nombre: 'Recoger la mesa',
      picto: '🧽',
      momento: 'limpieza',
      pasos: [
        { texto: 'Quito los platos.', picto: '🍽️' },
        { texto: 'Tiro los restos.', picto: '🗑️' },
        { texto: 'Limpio la mesa.', picto: '🧽' },
        { texto: 'Friego los platos.', picto: '🧼' }
      ]
    },
    {
      id: 'barrer',
      nombre: 'Barrer el suelo',
      picto: '🧹',
      momento: 'limpieza',
      pasos: [
        { texto: 'Cojo la escoba.', picto: '🧹' },
        { texto: 'Barro la habitación.', picto: '🧹' },
        { texto: 'Junto la basura.', picto: '../../assets/img/pile-dust.svg' },
        { texto: 'La echo al cubo.', picto: '🗑️' }
      ]
    },
    {
      id: 'fregar',
      nombre: 'Fregar el suelo',
      picto: '🪣',
      momento: 'limpieza',
      pasos: [
        { texto: 'Cojo el cubo.', picto: '🪣' },
        { texto: 'Echo agua y producto.', picto: '🧴' },
        { texto: 'Mojo la fregona.', picto: '🧹' },
        { texto: 'Friego el suelo.', picto: '🧹' },
        { texto: 'Dejo que se seque.', picto: '☀️' }
      ]
    },
    {
      id: 'limpiar-polvo',
      nombre: 'Limpiar el polvo',
      picto: '🪑',
      momento: 'limpieza',
      pasos: [
        { texto: 'Cojo un trapo.', picto: '🧽' },
        { texto: 'Le echo producto.', picto: '🧴' },
        { texto: 'Paso por los muebles.', picto: '🪑' },
        { texto: 'Recojo el trapo.', picto: '🧺' }
      ]
    },
    {
      id: 'limpiar-bano',
      nombre: 'Limpiar el baño',
      picto: '🛁',
      momento: 'limpieza',
      pasos: [
        { texto: 'Echo producto en el váter.', picto: '🧴' },
        { texto: 'Limpio el lavabo.', picto: '🚰' },
        { texto: 'Limpio la bañera.', picto: '🛁' },
        { texto: 'Friego el suelo.', picto: '🪣' }
      ]
    },
    {
      id: 'ordenar-habitacion',
      nombre: 'Ordenar mi habitación',
      picto: '🧸',
      momento: 'limpieza',
      pasos: [
        { texto: 'Recojo la ropa del suelo.', picto: '👕' },
        { texto: 'Recojo los juguetes.', picto: '🧸' },
        { texto: 'Los pongo en su sitio.', picto: '📦' },
        { texto: 'Hago la cama.', picto: '🛏️' }
      ]
    },
    {
      id: 'lavadora',
      nombre: 'Poner la lavadora',
      picto: '🌀',
      momento: 'limpieza',
      pasos: [
        { texto: 'Cojo la ropa sucia.', picto: '🧺' },
        { texto: 'Echo detergente.', picto: '🧴' },
        { texto: 'Enciendo la lavadora.', picto: '🌀' },
        { texto: 'Tiendo la ropa.', picto: '☀️' }
      ]
    },
    {
      id: 'doblar-ropa',
      nombre: 'Doblar la ropa',
      picto: '👕',
      momento: 'limpieza',
      pasos: [
        { texto: 'Cojo la ropa seca.', picto: '🧺' },
        { texto: 'Doblo las camisetas.', picto: '👕' },
        { texto: 'Doblo los pantalones.', picto: '👖' },
        { texto: 'Lo guardo en el armario.', picto: '🗄️' }
      ]
    },
    {
      id: 'sacar-basura',
      nombre: 'Sacar la basura',
      picto: '🚮',
      momento: 'limpieza',
      pasos: [
        { texto: 'Cierro la bolsa.', picto: '🪢' },
        { texto: 'La llevo al contenedor.', picto: '🚮' },
        { texto: 'Echo una bolsa nueva.', picto: '🗑️' }
      ]
    },
    {
      id: 'regar-plantas',
      nombre: 'Regar las plantas',
      picto: '🪴',
      momento: 'limpieza',
      pasos: [
        { texto: 'Cojo la regadera.', picto: '🚰' },
        { texto: 'Echo agua en la planta.', picto: '💧' },
        { texto: 'Compruebo la tierra.', picto: '🪴' }
      ]
    },

    /* ---------- Mascotas ---------- */
    {
      id: 'pasear-perro',
      nombre: 'Pasear al perro',
      picto: '🐶',
      momento: 'mascotas',
      pasos: [
        { texto: 'Pongo la correa.', picto: '🦮' },
        { texto: 'Salgo a la calle.', picto: '🚪' },
        { texto: 'Paseo con el perro.', picto: '🌳' },
        { texto: 'Volvemos a casa.', picto: '🏠' }
      ]
    },
    {
      id: 'dar-comer-perro',
      nombre: 'Dar de comer al perro',
      picto: '🦴',
      momento: 'mascotas',
      pasos: [
        { texto: 'Cojo su plato.', picto: '🥣' },
        { texto: 'Echo su comida.', picto: '🥄' },
        { texto: 'Se lo doy.', picto: '🐶' },
        { texto: 'Lavo el plato.', picto: '🧼' }
      ]
    },
    {
      id: 'dar-comer-gato',
      nombre: 'Dar de comer al gato',
      picto: '🐱',
      momento: 'mascotas',
      pasos: [
        { texto: 'Cojo su plato.', picto: '🥣' },
        { texto: 'Abro la lata.', picto: '🥫' },
        { texto: 'Sirvo la comida.', picto: '🥄' },
        { texto: 'Lavo el plato.', picto: '🧼' }
      ]
    },
    {
      id: 'limpiar-arenero',
      nombre: 'Limpiar el arenero',
      picto: '🐈',
      momento: 'mascotas',
      pasos: [
        { texto: 'Cojo la pala.', picto: '🧹' },
        { texto: 'Quito la arena sucia.', picto: '🪣' },
        { texto: 'Echo arena limpia.', picto: '🧴' }
      ]
    },

    /* ---------- Salir de casa ---------- */
    {
      id: 'salir',
      nombre: 'Salir de casa',
      picto: '🚪',
      momento: 'salida',
      pasos: [
        { texto: 'Voy al baño.', picto: '🚽' },
        { texto: 'Cojo mis llaves.', picto: '🔑' },
        { texto: 'Cojo mi teléfono.', picto: '📱' },
        { texto: 'Miro el tiempo. ¿Necesito abrigo?', picto: '🌦️' },
        { texto: 'Cierro la puerta.', picto: '🚪' }
      ]
    },
    {
      id: 'mochila-cole',
      nombre: 'Preparar la mochila del cole',
      picto: '🎒',
      momento: 'salida',
      pasos: [
        { texto: 'Cojo la mochila.', picto: '🎒' },
        { texto: 'Pongo los libros.', picto: '📚' },
        { texto: 'Pongo el estuche.', picto: '✏️' },
        { texto: 'Pongo el almuerzo.', picto: '🍎' }
      ]
    },

    /* ---------- Por la tarde ---------- */
    {
      id: 'merendar',
      nombre: 'La merienda',
      picto: '🥪',
      momento: 'tarde',
      pasos: [
        { texto: 'Me lavo las manos.', picto: '🧼' },
        { texto: 'Me siento a la mesa.', picto: '🪑' },
        { texto: 'Como la merienda.', picto: '🥪' },
        { texto: 'Recojo.', picto: '🧽' }
      ]
    },
    {
      id: 'deberes',
      nombre: 'Hacer los deberes',
      picto: '📚',
      momento: 'tarde',
      pasos: [
        { texto: 'Pongo la mesa para estudiar.', picto: '📚' },
        { texto: 'Saco el cuaderno.', picto: '📓' },
        { texto: 'Hago las tareas.', picto: '✏️' },
        { texto: 'Guardo todo en la mochila.', picto: '🎒' }
      ]
    },

    /* ---------- Por la noche ---------- */
    {
      id: 'noche',
      nombre: 'Por la noche',
      picto: '🌙',
      momento: 'noche',
      pasos: [
        { texto: 'Ceno.', picto: '🍽️' },
        { texto: 'Me pongo el pijama.', picto: '🩳' },
        { texto: 'Me lavo los dientes.', picto: '🪥' },
        { texto: 'Preparo la ropa de mañana.', picto: '👕' },
        { texto: 'Me acuesto.', picto: '🛏️' }
      ]
    }
  ],

  en: [
    /* ---------- In the morning ---------- */
    {
      id: 'manana',
      nombre: 'In the morning',
      picto: '🌅',
      momento: 'manana',
      pasos: [
        { texto: 'I get out of bed.', picto: '🛏️' },
        { texto: 'I go to the bathroom.', picto: '🚽' },
        { texto: 'I wash my face.', picto: '🧼' },
        { texto: 'I get dressed.', picto: '👕' },
        { texto: 'I have breakfast.', picto: '🥛' },
        { texto: 'I brush my teeth.', picto: '🪥' }
      ]
    },
    {
      id: 'hacer-cama',
      nombre: 'Make the bed',
      picto: '🛏️',
      momento: 'manana',
      pasos: [
        { texto: 'I pull back the blanket and pillow.', picto: '🛌' },
        { texto: 'I straighten the sheet.', picto: '🟦' },
        { texto: 'I spread the blanket.', picto: '🛌' },
        { texto: 'I put the pillow back.', picto: '🪶' }
      ]
    },

    /* ---------- Personal care ---------- */
    {
      id: 'ducha',
      nombre: 'Take a shower',
      picto: '🚿',
      momento: 'personal',
      pasos: [
        { texto: 'I take my clothes off.', picto: '👕' },
        { texto: 'I turn on the water.', picto: '🚰' },
        { texto: 'I wet my body.', picto: '💧' },
        { texto: 'I put soap on.', picto: '🧼' },
        { texto: 'I rinse off.', picto: '🚿' },
        { texto: 'I dry with a towel.', picto: '🛁' }
      ]
    },
    {
      id: 'lavarse-dientes',
      nombre: 'Brush my teeth',
      picto: '🪥',
      momento: 'personal',
      pasos: [
        { texto: 'I take the toothbrush.', picto: '🪥' },
        { texto: 'I put toothpaste on.', picto: '🪥' },
        { texto: 'I brush the top.', picto: '🪥' },
        { texto: 'I brush the bottom.', picto: '🪥' },
        { texto: 'I rinse my mouth.', picto: '💧' }
      ]
    },
    {
      id: 'vestirse',
      nombre: 'Get dressed',
      picto: '👕',
      momento: 'personal',
      pasos: [
        { texto: 'I pick my clothes.', picto: '👕' },
        { texto: 'I put on my t-shirt.', picto: '👕' },
        { texto: 'I put on my trousers.', picto: '👖' },
        { texto: 'I put on my socks.', picto: '🧦' },
        { texto: 'I put on my shoes.', picto: '👟' }
      ]
    },
    {
      id: 'peinarse',
      nombre: 'Comb my hair',
      picto: '💇',
      momento: 'personal',
      pasos: [
        { texto: 'I take the comb.', picto: '🪮' },
        { texto: 'I comb my hair.', picto: '💇' },
        { texto: 'I look in the mirror.', picto: '🪞' }
      ]
    },

    /* ---------- Meals ---------- */
    {
      id: 'comer',
      nombre: 'Before eating',
      picto: '🍽️',
      momento: 'comida',
      pasos: [
        { texto: 'I wash my hands.', picto: '🧼' },
        { texto: 'I set the table.', picto: '🍽️' },
        { texto: 'I sit at the table.', picto: '🪑' },
        { texto: 'I eat slowly.', picto: '🥄' },
        { texto: 'I clear my plate.', picto: '🧽' }
      ]
    },
    {
      id: 'preparar-desayuno',
      nombre: 'Make breakfast',
      picto: '🥣',
      momento: 'comida',
      pasos: [
        { texto: 'I take a bowl.', picto: '🥣' },
        { texto: 'I pour the cereal.', picto: '🥣' },
        { texto: 'I pour the milk.', picto: '🥛' },
        { texto: 'I take a spoon.', picto: '🥄' },
        { texto: 'I sit down for breakfast.', picto: '🪑' }
      ]
    },
    {
      id: 'preparar-merienda',
      nombre: 'Make a snack',
      picto: '🥪',
      momento: 'comida',
      pasos: [
        { texto: 'I take bread.', picto: '🍞' },
        { texto: 'I spread butter.', picto: '🧈' },
        { texto: 'I add the filling.', picto: '🥩' },
        { texto: 'I cut it in half.', picto: '🔪' },
        { texto: 'I put it on a plate.', picto: '🍽️' }
      ]
    },
    {
      id: 'cocinar',
      nombre: 'Cook a dish',
      picto: '🍳',
      momento: 'comida',
      pasos: [
        { texto: 'I wash the food.', picto: '🚿' },
        { texto: 'I cut it.', picto: '🔪' },
        { texto: 'I heat the pan.', picto: '🍳' },
        { texto: 'I cook it.', picto: '🍳' },
        { texto: 'I serve it on a plate.', picto: '🍽️' }
      ]
    },

    /* ---------- Cleaning ---------- */
    {
      id: 'recoger-mesa',
      nombre: 'Clear the table',
      picto: '🧽',
      momento: 'limpieza',
      pasos: [
        { texto: 'I take the plates away.', picto: '🍽️' },
        { texto: 'I throw the leftovers.', picto: '🗑️' },
        { texto: 'I wipe the table.', picto: '🧽' },
        { texto: 'I wash the dishes.', picto: '🧼' }
      ]
    },
    {
      id: 'barrer',
      nombre: 'Sweep the floor',
      picto: '🧹',
      momento: 'limpieza',
      pasos: [
        { texto: 'I take the broom.', picto: '🧹' },
        { texto: 'I sweep the room.', picto: '🧹' },
        { texto: 'I gather the dust.', picto: '../../assets/img/pile-dust.svg' },
        { texto: 'I throw it in the bin.', picto: '🗑️' }
      ]
    },
    {
      id: 'fregar',
      nombre: 'Mop the floor',
      picto: '🪣',
      momento: 'limpieza',
      pasos: [
        { texto: 'I take the bucket.', picto: '🪣' },
        { texto: 'I add water and cleaner.', picto: '🧴' },
        { texto: 'I wet the mop.', picto: '🧹' },
        { texto: 'I mop the floor.', picto: '🧹' },
        { texto: 'I let it dry.', picto: '☀️' }
      ]
    },
    {
      id: 'limpiar-polvo',
      nombre: 'Dust the furniture',
      picto: '🪑',
      momento: 'limpieza',
      pasos: [
        { texto: 'I take a cloth.', picto: '🧽' },
        { texto: 'I add some cleaner.', picto: '🧴' },
        { texto: 'I wipe the furniture.', picto: '🪑' },
        { texto: 'I put the cloth away.', picto: '🧺' }
      ]
    },
    {
      id: 'limpiar-bano',
      nombre: 'Clean the bathroom',
      picto: '🛁',
      momento: 'limpieza',
      pasos: [
        { texto: 'I put cleaner in the toilet.', picto: '🧴' },
        { texto: 'I clean the sink.', picto: '🚰' },
        { texto: 'I clean the bathtub.', picto: '🛁' },
        { texto: 'I mop the floor.', picto: '🪣' }
      ]
    },
    {
      id: 'ordenar-habitacion',
      nombre: 'Tidy my bedroom',
      picto: '🧸',
      momento: 'limpieza',
      pasos: [
        { texto: 'I pick up the clothes.', picto: '👕' },
        { texto: 'I pick up the toys.', picto: '🧸' },
        { texto: 'I put them away.', picto: '📦' },
        { texto: 'I make the bed.', picto: '🛏️' }
      ]
    },
    {
      id: 'lavadora',
      nombre: 'Do the laundry',
      picto: '🌀',
      momento: 'limpieza',
      pasos: [
        { texto: 'I take the dirty clothes.', picto: '🧺' },
        { texto: 'I add detergent.', picto: '🧴' },
        { texto: 'I turn on the washing machine.', picto: '🌀' },
        { texto: 'I hang out the clothes.', picto: '☀️' }
      ]
    },
    {
      id: 'doblar-ropa',
      nombre: 'Fold the clothes',
      picto: '👕',
      momento: 'limpieza',
      pasos: [
        { texto: 'I take the dry clothes.', picto: '🧺' },
        { texto: 'I fold the t-shirts.', picto: '👕' },
        { texto: 'I fold the trousers.', picto: '👖' },
        { texto: 'I put them in the wardrobe.', picto: '🗄️' }
      ]
    },
    {
      id: 'sacar-basura',
      nombre: 'Take out the trash',
      picto: '🚮',
      momento: 'limpieza',
      pasos: [
        { texto: 'I tie the bag.', picto: '🪢' },
        { texto: 'I take it to the bin.', picto: '🚮' },
        { texto: 'I put a new bag in.', picto: '🗑️' }
      ]
    },
    {
      id: 'regar-plantas',
      nombre: 'Water the plants',
      picto: '🪴',
      momento: 'limpieza',
      pasos: [
        { texto: 'I take the watering can.', picto: '🚰' },
        { texto: 'I pour water on the plant.', picto: '💧' },
        { texto: 'I check the soil.', picto: '🪴' }
      ]
    },

    /* ---------- Pets ---------- */
    {
      id: 'pasear-perro',
      nombre: 'Walk the dog',
      picto: '🐶',
      momento: 'mascotas',
      pasos: [
        { texto: 'I put on the leash.', picto: '🦮' },
        { texto: 'I go outside.', picto: '🚪' },
        { texto: 'I walk the dog.', picto: '🌳' },
        { texto: 'We go back home.', picto: '🏠' }
      ]
    },
    {
      id: 'dar-comer-perro',
      nombre: 'Feed the dog',
      picto: '🦴',
      momento: 'mascotas',
      pasos: [
        { texto: 'I take its bowl.', picto: '🥣' },
        { texto: 'I pour the food.', picto: '🥄' },
        { texto: 'I give it to the dog.', picto: '🐶' },
        { texto: 'I wash the bowl.', picto: '🧼' }
      ]
    },
    {
      id: 'dar-comer-gato',
      nombre: 'Feed the cat',
      picto: '🐱',
      momento: 'mascotas',
      pasos: [
        { texto: 'I take its bowl.', picto: '🥣' },
        { texto: 'I open the can.', picto: '🥫' },
        { texto: 'I serve the food.', picto: '🥄' },
        { texto: 'I wash the bowl.', picto: '🧼' }
      ]
    },
    {
      id: 'limpiar-arenero',
      nombre: 'Clean the litter box',
      picto: '🐈',
      momento: 'mascotas',
      pasos: [
        { texto: 'I take the scoop.', picto: '🧹' },
        { texto: 'I remove the dirty litter.', picto: '🪣' },
        { texto: 'I add clean litter.', picto: '🧴' }
      ]
    },

    /* ---------- Leaving home ---------- */
    {
      id: 'salir',
      nombre: 'Leaving home',
      picto: '🚪',
      momento: 'salida',
      pasos: [
        { texto: 'I go to the bathroom.', picto: '🚽' },
        { texto: 'I grab my keys.', picto: '🔑' },
        { texto: 'I grab my phone.', picto: '📱' },
        { texto: 'I check the weather. Do I need a coat?', picto: '🌦️' },
        { texto: 'I close the door.', picto: '🚪' }
      ]
    },
    {
      id: 'mochila-cole',
      nombre: 'Pack the school bag',
      picto: '🎒',
      momento: 'salida',
      pasos: [
        { texto: 'I take the backpack.', picto: '🎒' },
        { texto: 'I put the books in.', picto: '📚' },
        { texto: 'I put the pencil case in.', picto: '✏️' },
        { texto: 'I put the snack in.', picto: '🍎' }
      ]
    },

    /* ---------- In the afternoon ---------- */
    {
      id: 'merendar',
      nombre: 'Afternoon snack',
      picto: '🥪',
      momento: 'tarde',
      pasos: [
        { texto: 'I wash my hands.', picto: '🧼' },
        { texto: 'I sit at the table.', picto: '🪑' },
        { texto: 'I eat the snack.', picto: '🥪' },
        { texto: 'I tidy up.', picto: '🧽' }
      ]
    },
    {
      id: 'deberes',
      nombre: 'Do homework',
      picto: '📚',
      momento: 'tarde',
      pasos: [
        { texto: 'I set up a study space.', picto: '📚' },
        { texto: 'I take out my notebook.', picto: '📓' },
        { texto: 'I do my tasks.', picto: '✏️' },
        { texto: 'I pack everything away.', picto: '🎒' }
      ]
    },

    /* ---------- At night ---------- */
    {
      id: 'noche',
      nombre: 'At night',
      picto: '🌙',
      momento: 'noche',
      pasos: [
        { texto: 'I have dinner.', picto: '🍽️' },
        { texto: 'I put on my pajamas.', picto: '🩳' },
        { texto: 'I brush my teeth.', picto: '🪥' },
        { texto: "I get tomorrow's clothes ready.", picto: '👕' },
        { texto: 'I go to bed.', picto: '🛏️' }
      ]
    }
  ]
};
