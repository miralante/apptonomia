/* ============================================================
   Datos: Trazos (motricidad fina — repasar formas y letras). ES/EN.

   Sistema progresivo en 5 niveles:
     1. Líneas rectas (horizontal, vertical, diagonal) en todas
        las direcciones.
     2. Ángulos y combinaciones de direcciones (arriba, abajo,
        izquierda, derecha).
     3. Curvas básicas (círculo, óvalo, onda, bucle).
     4. Letras rectas del alfabeto (vocales y consonantes sin
        curva).
     5. Letras curvas del alfabeto (consonantes con curva).

   Además hay un "Modo libre" donde el usuario elige qué letras
   practicar (mayúsculas / minúsculas / mezcladas) y la app
   genera una ronda con esa selección.

   Estructura:
     - FORMAS_COMUNES: catálogo geométrico compartido (ES y EN
       reutilizan los mismos puntos).
     - DATA.<idioma>.niveles: los 5 niveles guiados.
     - DATA.<idioma>.alfabeto: listas de letras mayúsculas y
       minúsculas disponibles en ese idioma, con un id de
       referencia y un nombre a mostrar.
     - DATA.<idioma>.porRondaLibre: tamaño de la ronda cuando
       el usuario practica en modo libre.

   Para ampliar: añadir la forma común al catálogo y luego
   referenciarla en las 'formas' del idioma correspondiente.
   ============================================================ */

/* Catálogo compartido de geometría. Los nombres a mostrar se
   definen en cada idioma. Si una letra no existe en un alfabeto,
   basta con no incluirla en su lista 'alfabeto'. */
const FORMAS_COMUNES = {
  /* --- Nivel 1: líneas rectas, distintas direcciones --- */
  lineaHorizontal:  { puntos: [[10, 50], [90, 50]], pista: 'recta-horizontal' },
  lineaVertical:    { puntos: [[50, 10], [50, 90]], pista: 'recta-vertical' },
  lineaDiagonal:    { puntos: [[15, 85], [85, 15]], pista: 'recta-diagonal' },
  lineaDiagonalInv: { puntos: [[15, 15], [85, 85]], pista: 'recta-diagonal' },
  /* --- Nivel 2: ángulos y combinaciones de direcciones --- */
  angulo:           { puntos: [[20, 15], [20, 85], [80, 85]], pista: 'angulo-L' },
  triangulo:        { puntos: [[50, 15], [85, 85], [15, 85], [50, 15]], pista: 'triangulo' },
  cuadrado:         { puntos: [[20, 20], [80, 20], [80, 80], [20, 80], [20, 20]], pista: 'cuadrado' },
  cruz:             { puntos: [[50, 15], [50, 85], [50, 50], [15, 50], [85, 50]], pista: 'cruz' },
  flechaDerecha:    { puntos: [[15, 50], [85, 50], [65, 30], [85, 50], [65, 70]], pista: 'flecha-derecha' },
  flechaArriba:     { puntos: [[50, 85], [50, 15], [30, 35], [50, 15], [70, 35]], pista: 'flecha-arriba' },
  /* --- Nivel 3: curvas básicas --- */
  circulo: {
    puntos: [[50, 17], [62.6, 19.5], [73.3, 26.7], [80.5, 37.4], [83, 50],
             [80.5, 62.6], [73.3, 73.3], [62.6, 80.5], [50, 83],
             [37.4, 80.5], [26.7, 73.3], [19.5, 62.6], [17, 50],
             [19.5, 37.4], [26.7, 26.7], [37.4, 19.5], [50, 17]],
    pista: 'circulo'
  },
  ovalo: {
    puntos: [[50, 17], [68, 19.5], [80, 35], [83, 50], [80, 65], [68, 80.5],
             [50, 83], [32, 80.5], [20, 65], [17, 50], [20, 35], [32, 19.5], [50, 17]],
    pista: 'ovalo'
  },
  onda: {
    puntos: [[15, 50], [30, 25], [45, 50], [60, 75], [75, 50], [85, 50]],
    pista: 'onda'
  },
  bucle: {
    puntos: [[20, 50], [20, 30], [35, 22], [50, 30], [50, 50],
             [50, 70], [35, 78], [20, 70], [20, 50], [80, 50]],
    pista: 'bucle'
  },
  /* --- Nivel 4: letras mayúsculas rectas (sin curva) --- */
  letraA: { puntos: [[20, 85], [50, 15], [80, 85], [65, 60], [35, 60]], pista: 'letra-A' },
  letraE: { puntos: [[25, 15], [25, 85], [75, 85], [25, 85], [70, 50],
                      [25, 50], [25, 15], [75, 15]], pista: 'letra-E' },
  letraF: { puntos: [[25, 15], [25, 85], [75, 85], [25, 85], [70, 50],
                      [25, 50], [25, 15]], pista: 'letra-F' },
  letraH: { puntos: [[25, 15], [25, 85], [25, 50], [75, 50],
                      [75, 85], [75, 15]], pista: 'letra-H' },
  letraI: { puntos: [[50, 15], [50, 85]], pista: 'letra-I' },
  letraK: { puntos: [[25, 15], [25, 85], [25, 50], [75, 15],
                      [25, 50], [75, 85]], pista: 'letra-K' },
  letraL: { puntos: [[25, 15], [25, 85], [75, 85]], pista: 'letra-L' },
  letraN: { puntos: [[20, 85], [20, 15], [80, 85], [80, 15]], pista: 'letra-N' },
  letraT: { puntos: [[20, 15], [80, 15], [50, 15], [50, 85]], pista: 'letra-T' },
  letraV: { puntos: [[20, 15], [50, 85], [80, 15]], pista: 'letra-V' },
  letraX: { puntos: [[20, 15], [80, 85], [50, 50], [20, 85], [80, 15]], pista: 'letra-X' },
  letraY: { puntos: [[20, 15], [50, 50], [80, 15], [50, 50], [50, 85]], pista: 'letra-Y' },
  letraZ: { puntos: [[20, 15], [80, 15], [20, 85], [80, 85]], pista: 'letra-Z' },
  /* --- Nivel 5: letras mayúsculas curvas --- */
  letraB: {
    puntos: [[25, 15], [25, 85], [55, 85], [70, 78], [75, 65], [70, 50],
             [25, 50], [55, 50], [70, 35], [75, 22], [55, 15], [25, 15]],
    pista: 'letra-B'
  },
  letraC: {
    puntos: [[75.3, 71.2], [64.8, 79.5], [51.9, 82.9], [38.7, 81], [27.4, 74],
             [19.7, 63.1], [17, 50], [19.7, 36.9], [27.4, 26], [38.7, 19],
             [51.9, 17.1], [64.8, 20.5], [75.3, 28.8]],
    pista: 'letra-C'
  },
  letraD: {
    puntos: [[25, 15], [25, 85], [55, 85], [70, 78], [78, 65], [80, 50],
             [78, 35], [70, 22], [55, 15], [25, 15]],
    pista: 'letra-D'
  },
  letraG: {
    puntos: [[75.3, 71.2], [64.8, 79.5], [51.9, 82.9], [38.7, 81], [27.4, 74],
             [19.7, 63.1], [17, 50], [19.7, 36.9], [27.4, 26], [38.7, 19],
             [51.9, 17.1], [64.8, 20.5], [75.3, 28.8], [75.3, 50], [55, 50]],
    pista: 'letra-G'
  },
  letraJ: {
    puntos: [[60, 15], [60, 65], [58.5, 75], [50, 82], [40, 80],
             [33, 73], [30, 65]],
    pista: 'letra-J'
  },
  letraM: {
    puntos: [[20, 85], [20, 15], [50, 55], [80, 15], [80, 85]],
    pista: 'letra-M'
  },
  letraO: {
    puntos: [[50, 17], [62.6, 19.5], [73.3, 26.7], [80.5, 37.4], [83, 50],
             [80.5, 62.6], [73.3, 73.3], [62.6, 80.5], [50, 83],
             [37.4, 80.5], [26.7, 73.3], [19.5, 62.6], [17, 50],
             [19.5, 37.4], [26.7, 26.7], [37.4, 19.5], [50, 17]],
    pista: 'letra-O'
  },
  letraP: {
    puntos: [[25, 85], [25, 15], [55, 15], [70, 22], [75, 35], [70, 50],
             [55, 50], [25, 50]],
    pista: 'letra-P'
  },
  letraQ: {
    puntos: [[50, 17], [62.6, 19.5], [73.3, 26.7], [80.5, 37.4], [83, 50],
             [80.5, 62.6], [73.3, 73.3], [62.6, 80.5], [50, 83],
             [37.4, 80.5], [26.7, 73.3], [19.5, 62.6], [17, 50],
             [19.5, 37.4], [26.7, 26.7], [37.4, 19.5], [50, 17],
             [55, 55], [85, 85]],
    pista: 'letra-Q'
  },
  letraR: {
    puntos: [[25, 85], [25, 15], [55, 15], [70, 22], [75, 35], [70, 50],
             [55, 50], [25, 50], [55, 50], [75, 85]],
    pista: 'letra-R'
  },
  letraS: {
    puntos: [[70, 20], [35, 20], [30, 35], [70, 50], [65, 70], [30, 80]],
    pista: 'letra-S'
  },
  letraU: {
    puntos: [[28, 20], [28, 62], [29.7, 53.6], [34.4, 46.4], [41.6, 41.7],
             [50, 40], [58.4, 41.7], [65.6, 46.4], [70.3, 53.6], [72, 62],
             [72, 20]],
    pista: 'letra-U'
  },
  letraW: {
    puntos: [[20, 15], [20, 85], [50, 45], [80, 85], [80, 15]],
    pista: 'letra-W'
  },
  /* --- Letra especial española: Ñ mayúscula y minúscula --- */
  letraEnye: {
    puntos: [[20, 85], [20, 15], [80, 15], [80, 85], [20, 15],
             [20, 35], [80, 35]],
    pista: 'letra-Ñ'
  },
  /* --- Letras minúsculas: rectas (sin curva) --- */
  minusculaA: { puntos: [[50, 85], [30, 25], [70, 25], [50, 85],
                         [40, 55], [60, 55]], pista: 'letra-a' },
  minusculaE: { puntos: [[70, 35], [40, 30], [25, 45], [30, 65], [50, 75],
                         [70, 70], [60, 50], [40, 50], [25, 50]], pista: 'letra-e' },
  minusculaF: { puntos: [[60, 22], [45, 22], [35, 35], [35, 78],
                         [25, 85], [40, 75]], pista: 'letra-f' },
  minusculaH: { puntos: [[25, 78], [25, 25], [25, 50], [60, 50], [70, 60],
                         [70, 85]], pista: 'letra-h' },
  minusculaI: { puntos: [[50, 30], [50, 85], [40, 25], [60, 25], [50, 30]],
                pista: 'letra-i' },
  minusculaK: { puntos: [[25, 78], [25, 25], [25, 55], [65, 35],
                         [25, 55], [65, 80]], pista: 'letra-k' },
  minusculaL: { puntos: [[35, 25], [35, 80], [60, 80]], pista: 'letra-l' },
  minusculaN: { puntos: [[25, 78], [25, 35], [25, 50], [60, 50], [70, 60],
                         [70, 85]], pista: 'letra-n' },
  minusculaT: { puntos: [[30, 30], [70, 30], [50, 30], [50, 80],
                         [40, 85], [60, 80]], pista: 'letra-t' },
  minusculaV: { puntos: [[25, 30], [50, 80], [75, 30]], pista: 'letra-v' },
  minusculaX: { puntos: [[25, 30], [70, 80], [50, 55], [25, 80], [70, 30]],
                pista: 'letra-x' },
  minusculaY: { puntos: [[25, 30], [50, 55], [75, 30], [50, 55], [50, 88],
                         [40, 92], [60, 92]], pista: 'letra-y' },
  minusculaZ: { puntos: [[25, 30], [70, 30], [25, 80], [70, 80]], pista: 'letra-z' },
  /* --- Letras propias del español (Ñ minúscula) --- */
  minusculaEnye: {
    puntos: [[25, 78], [25, 35], [25, 50], [60, 50], [70, 60], [70, 85],
             [55, 70], [40, 70], [70, 50], [25, 50], [40, 30], [55, 30], [70, 50]],
    pista: 'letra-ñ'
  },
  /* --- Letras minúsculas: curvas --- */
  minusculaB: { puntos: [[30, 20], [30, 85], [55, 85], [70, 78], [72, 65],
                         [60, 55], [45, 55], [30, 55], [55, 55], [70, 45],
                         [72, 30], [55, 20], [30, 20]], pista: 'letra-b' },
  minusculaC: {
    puntos: [[70, 50], [65, 35], [50, 28], [35, 35], [28, 50], [35, 65],
             [50, 72], [65, 65]],
    pista: 'letra-c'
  },
  minusculaD: { puntos: [[70, 20], [70, 85], [45, 85], [30, 78], [25, 65],
                         [30, 50], [45, 42], [70, 50]], pista: 'letra-d' },
  minusculaG: {
    puntos: [[70, 50], [65, 35], [50, 28], [35, 35], [28, 50], [35, 65],
             [50, 72], [65, 65], [70, 60], [70, 85], [55, 92], [38, 85]],
    pista: 'letra-g'
  },
  minusculaJ: { puntos: [[60, 30], [60, 80], [55, 92], [40, 92], [35, 80]],
                pista: 'letra-j' },
  minusculaM: { puntos: [[25, 78], [25, 35], [45, 50], [55, 50], [75, 35],
                         [75, 78]], pista: 'letra-m' },
  minusculaO: {
    puntos: [[50, 28], [65, 32], [73, 50], [65, 68], [50, 72], [35, 68],
             [27, 50], [35, 32], [50, 28]],
    pista: 'letra-o'
  },
  minusculaP: { puntos: [[25, 30], [25, 92], [25, 55], [50, 55], [65, 50],
                         [68, 40], [60, 30], [45, 30], [25, 30]], pista: 'letra-p' },
  minusculaQ: {
    puntos: [[50, 28], [65, 32], [73, 50], [65, 68], [50, 72], [35, 68],
             [27, 50], [35, 32], [50, 28], [60, 65], [80, 90]],
    pista: 'letra-q'
  },
  minusculaR: { puntos: [[25, 78], [25, 35], [25, 50], [50, 50], [60, 45],
                         [55, 35], [40, 30], [25, 30]], pista: 'letra-r' },
  minusculaS: {
    puntos: [[65, 35], [35, 35], [28, 45], [35, 55], [60, 60], [65, 70],
             [58, 75], [32, 72]],
    pista: 'letra-s'
  },
  minusculaU: { puntos: [[25, 35], [25, 60], [32, 70], [48, 72], [64, 70],
                         [70, 60], [70, 35], [70, 78], [85, 88]], pista: 'letra-u' },
  minusculaW: { puntos: [[20, 30], [35, 80], [50, 50], [65, 80], [80, 30]],
                pista: 'letra-w' }
};

const DATA = {
  es: {
    porRonda: 6,
    tolerancia: 9,
    porRondaLibre: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Líneas en todas las direcciones',
        estrellas: 1,
        formas: [
          { nombre: 'Línea horizontal',  ref: 'lineaHorizontal' },
          { nombre: 'Línea vertical',    ref: 'lineaVertical' },
          { nombre: 'Línea diagonal ↘',  ref: 'lineaDiagonal' },
          { nombre: 'Línea diagonal ↗',  ref: 'lineaDiagonalInv' },
          { nombre: 'Línea horizontal',  ref: 'lineaHorizontal' },
          { nombre: 'Línea vertical',    ref: 'lineaVertical' }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Ángulos y cambios de dirección',
        estrellas: 2,
        formas: [
          { nombre: 'Ángulo',     ref: 'angulo' },
          { nombre: 'Triángulo',  ref: 'triangulo' },
          { nombre: 'Cuadrado',   ref: 'cuadrado' },
          { nombre: 'Cruz',       ref: 'cruz' },
          { nombre: 'Flecha →',   ref: 'flechaDerecha' },
          { nombre: 'Flecha ↑',   ref: 'flechaArriba' }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Curvas básicas',
        estrellas: 3,
        formas: [
          { nombre: 'Círculo', ref: 'circulo' },
          { nombre: 'Óvalo',   ref: 'ovalo' },
          { nombre: 'Onda',    ref: 'onda' },
          { nombre: 'Bucle',   ref: 'bucle' },
          { nombre: 'Círculo', ref: 'circulo' },
          { nombre: 'Onda',    ref: 'onda' }
        ]
      },
      {
        id: 4,
        nombre: 'Nivel 4',
        descripcion: 'Letras rectas del abecedario',
        estrellas: 4,
        formas: [
          { nombre: 'Mayúscula I', ref: 'letraI' },
          { nombre: 'Mayúscula L', ref: 'letraL' },
          { nombre: 'Mayúscula T', ref: 'letraT' },
          { nombre: 'Mayúscula V', ref: 'letraV' },
          { nombre: 'Mayúscula E', ref: 'letraE' },
          { nombre: 'Mayúscula H', ref: 'letraH' }
        ]
      },
      {
        id: 5,
        nombre: 'Nivel 5',
        descripcion: 'Letras curvas del abecedario',
        estrellas: 5,
        formas: [
          { nombre: 'Mayúscula O', ref: 'letraO' },
          { nombre: 'Mayúscula C', ref: 'letraC' },
          { nombre: 'Mayúscula U', ref: 'letraU' },
          { nombre: 'Mayúscula S', ref: 'letraS' },
          { nombre: 'Mayúscula D', ref: 'letraD' },
          { nombre: 'Mayúscula P', ref: 'letraP' }
        ]
      }
    ],
    /* Catálogo del abecedario para el modo libre. Mayúsculas y
       minúsculas se eligen por separado. La Ñ solo existe en
       español; en inglés se omite. */
    alfabeto: {
      mayusculas: [
        { id: 'A', ref: 'letraA' }, { id: 'B', ref: 'letraB' },
        { id: 'C', ref: 'letraC' }, { id: 'D', ref: 'letraD' },
        { id: 'E', ref: 'letraE' }, { id: 'F', ref: 'letraF' },
        { id: 'G', ref: 'letraG' }, { id: 'H', ref: 'letraH' },
        { id: 'I', ref: 'letraI' }, { id: 'J', ref: 'letraJ' },
        { id: 'K', ref: 'letraK' }, { id: 'L', ref: 'letraL' },
        { id: 'M', ref: 'letraM' }, { id: 'N', ref: 'letraN' },
        { id: 'Ñ', ref: 'letraEnye' }, { id: 'O', ref: 'letraO' },
        { id: 'P', ref: 'letraP' }, { id: 'Q', ref: 'letraQ' },
        { id: 'R', ref: 'letraR' }, { id: 'S', ref: 'letraS' },
        { id: 'T', ref: 'letraT' }, { id: 'U', ref: 'letraU' },
        { id: 'V', ref: 'letraV' }, { id: 'W', ref: 'letraW' },
        { id: 'X', ref: 'letraX' }, { id: 'Y', ref: 'letraY' },
        { id: 'Z', ref: 'letraZ' }
      ],
      minusculas: [
        { id: 'a', ref: 'minusculaA' }, { id: 'b', ref: 'minusculaB' },
        { id: 'c', ref: 'minusculaC' }, { id: 'd', ref: 'minusculaD' },
        { id: 'e', ref: 'minusculaE' }, { id: 'f', ref: 'minusculaF' },
        { id: 'g', ref: 'minusculaG' }, { id: 'h', ref: 'minusculaH' },
        { id: 'i', ref: 'minusculaI' }, { id: 'j', ref: 'minusculaJ' },
        { id: 'k', ref: 'minusculaK' }, { id: 'l', ref: 'minusculaL' },
        { id: 'm', ref: 'minusculaM' }, { id: 'n', ref: 'minusculaN' },
        { id: 'ñ', ref: 'minusculaEnye' },
        { id: 'o', ref: 'minusculaO' }, { id: 'p', ref: 'minusculaP' },
        { id: 'q', ref: 'minusculaQ' }, { id: 'r', ref: 'minusculaR' },
        { id: 's', ref: 'minusculaS' }, { id: 't', ref: 'minusculaT' },
        { id: 'u', ref: 'minusculaU' }, { id: 'v', ref: 'minusculaV' },
        { id: 'w', ref: 'minusculaW' }, { id: 'x', ref: 'minusculaX' },
        { id: 'y', ref: 'minusculaY' }, { id: 'z', ref: 'minusculaZ' }
      ]
    }
  },
  en: {
    porRonda: 6,
    tolerancia: 9,
    porRondaLibre: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: 'Lines in every direction',
        estrellas: 1,
        formas: [
          { nombre: 'Horizontal line',  ref: 'lineaHorizontal' },
          { nombre: 'Vertical line',    ref: 'lineaVertical' },
          { nombre: 'Diagonal line ↘',  ref: 'lineaDiagonal' },
          { nombre: 'Diagonal line ↗',  ref: 'lineaDiagonalInv' },
          { nombre: 'Horizontal line',  ref: 'lineaHorizontal' },
          { nombre: 'Vertical line',    ref: 'lineaVertical' }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Corners and direction changes',
        estrellas: 2,
        formas: [
          { nombre: 'Corner',   ref: 'angulo' },
          { nombre: 'Triangle', ref: 'triangulo' },
          { nombre: 'Square',   ref: 'cuadrado' },
          { nombre: 'Cross',    ref: 'cruz' },
          { nombre: 'Arrow →',  ref: 'flechaDerecha' },
          { nombre: 'Arrow ↑',  ref: 'flechaArriba' }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'Basic curves',
        estrellas: 3,
        formas: [
          { nombre: 'Circle', ref: 'circulo' },
          { nombre: 'Oval',   ref: 'ovalo' },
          { nombre: 'Wave',   ref: 'onda' },
          { nombre: 'Loop',   ref: 'bucle' },
          { nombre: 'Circle', ref: 'circulo' },
          { nombre: 'Wave',   ref: 'onda' }
        ]
      },
      {
        id: 4,
        nombre: 'Level 4',
        descripcion: 'Straight alphabet letters',
        estrellas: 4,
        formas: [
          { nombre: 'Uppercase I', ref: 'letraI' },
          { nombre: 'Uppercase L', ref: 'letraL' },
          { nombre: 'Uppercase T', ref: 'letraT' },
          { nombre: 'Uppercase V', ref: 'letraV' },
          { nombre: 'Uppercase E', ref: 'letraE' },
          { nombre: 'Uppercase H', ref: 'letraH' }
        ]
      },
      {
        id: 5,
        nombre: 'Level 5',
        descripcion: 'Curved alphabet letters',
        estrellas: 5,
        formas: [
          { nombre: 'Uppercase O', ref: 'letraO' },
          { nombre: 'Uppercase C', ref: 'letraC' },
          { nombre: 'Uppercase U', ref: 'letraU' },
          { nombre: 'Uppercase S', ref: 'letraS' },
          { nombre: 'Uppercase D', ref: 'letraD' },
          { nombre: 'Uppercase P', ref: 'letraP' }
        ]
      }
    ],
    /* El alfabeto inglés comparte geometría con el español; los
       nombres se localizan. Aquí no incluimos la Ñ (no existe en
       inglés). */
    alfabeto: {
      mayusculas: [
        { id: 'A', ref: 'letraA' }, { id: 'B', ref: 'letraB' },
        { id: 'C', ref: 'letraC' }, { id: 'D', ref: 'letraD' },
        { id: 'E', ref: 'letraE' }, { id: 'F', ref: 'letraF' },
        { id: 'G', ref: 'letraG' }, { id: 'H', ref: 'letraH' },
        { id: 'I', ref: 'letraI' }, { id: 'J', ref: 'letraJ' },
        { id: 'K', ref: 'letraK' }, { id: 'L', ref: 'letraL' },
        { id: 'M', ref: 'letraM' }, { id: 'N', ref: 'letraN' },
        { id: 'O', ref: 'letraO' }, { id: 'P', ref: 'letraP' },
        { id: 'Q', ref: 'letraQ' }, { id: 'R', ref: 'letraR' },
        { id: 'S', ref: 'letraS' }, { id: 'T', ref: 'letraT' },
        { id: 'U', ref: 'letraU' }, { id: 'V', ref: 'letraV' },
        { id: 'W', ref: 'letraW' }, { id: 'X', ref: 'letraX' },
        { id: 'Y', ref: 'letraY' }, { id: 'Z', ref: 'letraZ' }
      ],
      minusculas: [
        { id: 'a', ref: 'minusculaA' }, { id: 'b', ref: 'minusculaB' },
        { id: 'c', ref: 'minusculaC' }, { id: 'd', ref: 'minusculaD' },
        { id: 'e', ref: 'minusculaE' }, { id: 'f', ref: 'minusculaF' },
        { id: 'g', ref: 'minusculaG' }, { id: 'h', ref: 'minusculaH' },
        { id: 'i', ref: 'minusculaI' }, { id: 'j', ref: 'minusculaJ' },
        { id: 'k', ref: 'minusculaK' }, { id: 'l', ref: 'minusculaL' },
        { id: 'm', ref: 'minusculaM' }, { id: 'n', ref: 'minusculaN' },
        { id: 'o', ref: 'minusculaO' }, { id: 'p', ref: 'minusculaP' },
        { id: 'q', ref: 'minusculaQ' }, { id: 'r', ref: 'minusculaR' },
        { id: 's', ref: 'minusculaS' }, { id: 't', ref: 'minusculaT' },
        { id: 'u', ref: 'minusculaU' }, { id: 'v', ref: 'minusculaV' },
        { id: 'w', ref: 'minusculaW' }, { id: 'x', ref: 'minusculaX' },
        { id: 'y', ref: 'minusculaY' }, { id: 'z', ref: 'minusculaZ' }
      ]
    }
  }
};