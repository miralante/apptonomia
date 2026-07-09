/* ============================================================
   Apptonomia — Dominó Espacial (datos)
   Fichas de dominó y configuraciones por nivel.
   
   Niveles de dificultad:
   - Fácil: Fichas 0-3 (10 fichas)
   - Medio: Fichas 0-5 (15 fichas)
   - Difícil: Fichas 0-6 (21 fichas)
   
   ============================================================ */

var DATA = {};

// Configuración de niveles
DATA.niveles = {
  facil: {
    maxValor: 3,
    numFichas: 10,
    nombre: 'nivelFacil'
  },
  medio: {
    maxValor: 5,
    numFichas: 15,
    nombre: 'nivelMedio'
  },
  dificil: {
    maxValor: 6,
    numFichas: 21,
    nombre: 'nivelDificil'
  }
};

// Patrones de puntos para cada valor (0-6)
DATA.patrones = {
  0: [],
  1: [5], // centro
  2: [2, 7], // esquinas superiores e inferiores derechas
  3: [2, 5, 7],
  4: [1, 2, 6, 7], // cuatro esquinas
  5: [1, 2, 5, 6, 7], // cuatro esquinas + centro
  6: [1, 2, 3, 5, 6, 7] // dos columnas
};

// Generar todas las fichas posibles para un valor máximo
DATA.generarFichas = function(maxValor) {
  var fichas = [];
  var usadas = {};
  
  for (var i = 0; i <= maxValor; i++) {
    for (var j = i; j <= maxValor; j++) {
      var id1 = Math.min(i, j);
      var id2 = Math.max(i, j);
      var clave = id1 + '-' + id2;
      
      if (!usadas[clave]) {
        fichas.push({
          id: fichas.length,
          izquierda: id1,
          derecha: id2
        });
        usadas[clave] = true;
      }
    }
  }
  
  return fichas;
};

// Obtener fichas para un nivel
DATA.getFichasParaNivel = function(nivel) {
  var config = DATA.niveles[nivel];
  var todas = DATA.generarFichas(config.maxValor);
  
  // Barajar y tomar el número de fichas deseado
  var fichas = DATA.barajar(todas).slice(0, config.numFichas);
  
  // Mezclar los valores izquierda/derecha para que no estén siempre en orden
  fichas.forEach(function(f) {
    if (Math.random() > 0.5) {
      var temp = f.izquierda;
      f.izquierda = f.derecha;
      f.derecha = temp;
    }
  });
  
  return fichas;
};

// Barajar array (Fisher-Yates)
DATA.barajar = function(array) {
  var result = array.slice();
  for (var i = result.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
};

// Crear representación visual de puntos
DATA.renderizarPuntos = function(valor) {
  var html = '';
  var patrones = DATA.patrones[valor] || [];
  
  for (var i = 1; i <= 7; i++) {
    var clase = patrones.indexOf(i) !== -1 ? 'punto lleno p' + i : 'punto p' + i;
    html += '<div class="' + clase + '"></div>';
  }
  
  return html;
};

// Consejos socráticos por situación
DATA.consejosSocraticos = {
  inicio: [
    'El dominó es como construir una cadena. Cada ficha tiene dos lados.',
    'Mira la ficha de inicio: tiene el número {valor} en ambos lados.',
    'Busca una ficha que tenga el número {valor} en uno de sus lados.'
  ],
  sinFicha: [
    'No todas las fichas sirven. Solo las que tienen el número {valor}.',
    'El número {valor} aparece en muchas fichas. ¡Sigue buscando!',
    'Piensa: ¿qué fichas tienen un {valor}?'
  ],
  rotacion: [
    'Las fichas de dominó se pueden girar. El {valor1}-{valor2} es igual que {valor2}-{valor1}.',
    '¿Has probado a girar la ficha? A veces el lado que necesitas está detrás.',
    'Girar una ficha no cambia su valor, solo qué lado está visible.'
  ],
  colocar: [
    '¡Genial! Ahora coloca la ficha al final de la cadena.',
    'La ficha encaja cuando el número de un lado coincide con el número del extremo.',
    'Después de colocar, buscaremos la siguiente ficha que encaje.'
  ],
  error: [
    'Esa ficha no encaja. El número de la cadena es {valor}.',
    'Revisa los números en el extremo de la cadena.',
    'La ficha que buscas debe tener un {valor} en uno de sus lados.'
  ],
  ayuda: [
    '¿Cuántos puntos tiene el lado de la ficha de inicio? Ese número te dice qué buscar.',
    'Cada ficha de dominó tiene dos números. Puedes girarla para poner el número que necesites.',
    'Busca en las fichas disponibles. Las que tienen el número {valor} son las que pueden ir ahora.'
  ]
};

// Obtener consejo socrático según contexto
DATA.getConsejoSocratico = function(contexto, params) {
  var consejos = DATA.consejosSocraticos[contexto] || DATA.consejosSocraticos.inicio;
  var consejo = consejos[Math.floor(Math.random() * consejos.length)];
  
  // Reemplazar parámetros
  for (var key in params) {
    consejo = consejo.replace('{' + key + '}', params[key]);
  }
  
  return consejo;
};

// Opciones de ayuda para elegir
DATA.opcionesAyuda = [
  {
    texto: '¿Qué número busco?',
    accion: 'mostrarNumero'
  },
  {
    texto: '¿Qué fichas tienen ese número?',
    accion: 'resaltarFichas'
  },
  {
    texto: '¿Cómo giro una ficha?',
    accion: 'explicarRotacion'
  },
  {
    texto: 'Quiero intentarlo solo',
    accion: 'cerrar'
  }
];
