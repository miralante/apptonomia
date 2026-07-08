/* ============================================================
   Datos: Trazos (motricidad fina — repasar formas y letras). ES/EN.
   Formato: DATA.<idioma> = { porRonda, tolerancia, niveles: [{ id,
     nombre, descripcion, estrellas, formas: [{ nombre, puntos: [x,y][] }] }] }
   'puntos' son los vértices de la guía en un lienzo de 0 a 100.
   Se dibujan como líneas rectas entre vértices (las curvas se
   aproximan con varios puntos). Las letras (L, T, V, Z, N, O, C, U,
   S, M, W) existen igual en el alfabeto español y en el inglés, así
   que los puntos se reutilizan: solo cambian los nombres mostrados.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   Para ampliar: añadir formas al idioma correspondiente.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 6,
    tolerancia: 9,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Formas simples',
        estrellas: 1,
        formas: [
          { nombre: 'Línea', puntos: [[10, 50], [90, 50]] },
          { nombre: 'Línea de pie', puntos: [[50, 10], [50, 90]] },
          { nombre: 'Diagonal', puntos: [[15, 15], [85, 85]] },
          { nombre: 'Ángulo', puntos: [[20, 15], [20, 85], [80, 85]] },
          { nombre: 'Triángulo', puntos: [[50, 15], [85, 85], [15, 85], [50, 15]] },
          {
            nombre: 'Círculo',
            puntos: [[50, 17], [62.6, 19.5], [73.3, 26.7], [80.5, 37.4], [83, 50], [80.5, 62.6], [73.3, 73.3], [62.6, 80.5], [50, 83], [37.4, 80.5], [26.7, 73.3], [19.5, 62.6], [17, 50], [19.5, 37.4], [26.7, 26.7], [37.4, 19.5], [50, 17]]
          }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Letras rectas',
        estrellas: 2,
        formas: [
          { nombre: 'Letra I', puntos: [[50, 15], [50, 85]] },
          { nombre: 'Letra L', puntos: [[25, 15], [25, 85], [75, 85]] },
          { nombre: 'Letra T', puntos: [[20, 15], [80, 15], [50, 15], [50, 85]] },
          { nombre: 'Letra V', puntos: [[20, 15], [50, 85], [80, 15]] },
          { nombre: 'Letra Z', puntos: [[20, 15], [80, 15], [20, 85], [80, 85]] },
          { nombre: 'Letra N', puntos: [[20, 85], [20, 15], [80, 85], [80, 15]] }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Letras curvas',
        estrellas: 3,
        formas: [
          {
            nombre: 'Letra O',
            puntos: [[50, 17], [62.6, 19.5], [73.3, 26.7], [80.5, 37.4], [83, 50], [80.5, 62.6], [73.3, 73.3], [62.6, 80.5], [50, 83], [37.4, 80.5], [26.7, 73.3], [19.5, 62.6], [17, 50], [19.5, 37.4], [26.7, 26.7], [37.4, 19.5], [50, 17]]
          },
          {
            nombre: 'Letra C',
            puntos: [[75.3, 71.2], [64.8, 79.5], [51.9, 82.9], [38.7, 81], [27.4, 74], [19.7, 63.1], [17, 50], [19.7, 36.9], [27.4, 26], [38.7, 19], [51.9, 17.1], [64.8, 20.5], [75.3, 28.8]]
          },
          {
            nombre: 'Letra U',
            puntos: [[28, 20], [28, 62], [29.7, 53.6], [34.4, 46.4], [41.6, 41.7], [50, 40], [58.4, 41.7], [65.6, 46.4], [70.3, 53.6], [72, 62], [72, 20]]
          },
          { nombre: 'Letra S', puntos: [[70, 20], [35, 20], [30, 35], [70, 50], [65, 70], [30, 80]] },
          { nombre: 'Letra M', puntos: [[20, 85], [20, 15], [50, 55], [80, 15], [80, 85]] },
          { nombre: 'Letra W', puntos: [[20, 15], [20, 85], [50, 45], [80, 85], [80, 15]] }
        ]
      }
    ]
  },
  en: {
    porRonda: 6,
    tolerancia: 9,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: 'Simple shapes',
        estrellas: 1,
        formas: [
          { nombre: 'Line', puntos: [[10, 50], [90, 50]] },
          { nombre: 'Vertical line', puntos: [[50, 10], [50, 90]] },
          { nombre: 'Diagonal', puntos: [[15, 15], [85, 85]] },
          { nombre: 'Angle', puntos: [[20, 15], [20, 85], [80, 85]] },
          { nombre: 'Triangle', puntos: [[50, 15], [85, 85], [15, 85], [50, 15]] },
          {
            nombre: 'Circle',
            puntos: [[50, 17], [62.6, 19.5], [73.3, 26.7], [80.5, 37.4], [83, 50], [80.5, 62.6], [73.3, 73.3], [62.6, 80.5], [50, 83], [37.4, 80.5], [26.7, 73.3], [19.5, 62.6], [17, 50], [19.5, 37.4], [26.7, 26.7], [37.4, 19.5], [50, 17]]
          }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Straight letters',
        estrellas: 2,
        formas: [
          { nombre: 'Letter I', puntos: [[50, 15], [50, 85]] },
          { nombre: 'Letter L', puntos: [[25, 15], [25, 85], [75, 85]] },
          { nombre: 'Letter T', puntos: [[20, 15], [80, 15], [50, 15], [50, 85]] },
          { nombre: 'Letter V', puntos: [[20, 15], [50, 85], [80, 15]] },
          { nombre: 'Letter Z', puntos: [[20, 15], [80, 15], [20, 85], [80, 85]] },
          { nombre: 'Letter N', puntos: [[20, 85], [20, 15], [80, 85], [80, 15]] }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'Curved letters',
        estrellas: 3,
        formas: [
          {
            nombre: 'Letter O',
            puntos: [[50, 17], [62.6, 19.5], [73.3, 26.7], [80.5, 37.4], [83, 50], [80.5, 62.6], [73.3, 73.3], [62.6, 80.5], [50, 83], [37.4, 80.5], [26.7, 73.3], [19.5, 62.6], [17, 50], [19.5, 37.4], [26.7, 26.7], [37.4, 19.5], [50, 17]]
          },
          {
            nombre: 'Letter C',
            puntos: [[75.3, 71.2], [64.8, 79.5], [51.9, 82.9], [38.7, 81], [27.4, 74], [19.7, 63.1], [17, 50], [19.7, 36.9], [27.4, 26], [38.7, 19], [51.9, 17.1], [64.8, 20.5], [75.3, 28.8]]
          },
          {
            nombre: 'Letter U',
            puntos: [[28, 20], [28, 62], [29.7, 53.6], [34.4, 46.4], [41.6, 41.7], [50, 40], [58.4, 41.7], [65.6, 46.4], [70.3, 53.6], [72, 62], [72, 20]]
          },
          { nombre: 'Letter S', puntos: [[70, 20], [35, 20], [30, 35], [70, 50], [65, 70], [30, 80]] },
          { nombre: 'Letter M', puntos: [[20, 85], [20, 15], [50, 55], [80, 15], [80, 85]] },
          { nombre: 'Letter W', puntos: [[20, 15], [20, 85], [50, 45], [80, 85], [80, 15]] }
        ]
      }
    ]
  }
};
