/* ============================================================
   Datos: El Monedero (matemáticas cotidianas — precios y monedas).
   Formato: DATA[locale].niveles = [{ id, nombre, descripcion, estrellas,
     monedas: number[] (valores en euros que se pueden tocar),
     productos: [{ picto, nombre, precio (euros) }] }]
   Los precios, monedas y pictogramas son iguales en los dos idiomas
   (se mantiene el euro). Solo cambian nombre/descripción del nivel y
   el nombre de cada producto (ver NOMBRES_NIVEL y NOMBRES_PRODUCTO).
   Los precios de cada nivel se pueden pagar exactos combinando
   solo las monedas de ese nivel. Para ampliar: añadir productos
   al array del nivel correspondiente en NIVELES_BASE (con su "clave").
   ============================================================ */
const NIVELES_BASE = [
  {
    id: 1,
    estrellas: 1,
    monedas: [1, 2, 5],
    productos: [
      { picto: '🍞', clave: 'pan', precio: 2 },
      { picto: '🥛', clave: 'leche', precio: 1 },
      { picto: '🍎', clave: 'manzanas', precio: 3 },
      { picto: '🧴', clave: 'champu', precio: 4 },
      { picto: '🖊️', clave: 'lapiz', precio: 1 },
      { picto: '🧦', clave: 'calcetines', precio: 5 },
      { picto: '🍌', clave: 'platanos', precio: 2 },
      { picto: '🥚', clave: 'huevos', precio: 3 }
    ]
  },
  {
    id: 2,
    estrellas: 2,
    monedas: [0.5, 1, 2],
    productos: [
      { picto: '🍞', clave: 'pan', precio: 1.5 },
      { picto: '🧃', clave: 'zumo', precio: 2.5 },
      { picto: '🍫', clave: 'chocolate', precio: 1 },
      { picto: '🧻', clave: 'papel', precio: 3.5 },
      { picto: '🍪', clave: 'galletas', precio: 2 },
      { picto: '🥤', clave: 'refresco', precio: 0.5 },
      { picto: '🧀', clave: 'queso', precio: 4.5 },
      { picto: '🍯', clave: 'miel', precio: 3 }
    ]
  },
  {
    id: 3,
    estrellas: 3,
    monedas: [0.1, 0.2, 0.5, 1, 2],
    productos: [
      { picto: '🍬', clave: 'caramelos', precio: 0.7 },
      { picto: '🥖', clave: 'barraPan', precio: 1.2 },
      { picto: '🧃', clave: 'zumo', precio: 2.3 },
      { picto: '🍎', clave: 'manzana', precio: 0.9 },
      { picto: '🥐', clave: 'cruasan', precio: 1.1 },
      { picto: '🧻', clave: 'panuelos', precio: 2.7 },
      { picto: '🍫', clave: 'chocolatina', precio: 1.8 },
      { picto: '🧀', clave: 'trozoQueso', precio: 3.4 }
    ]
  }
];

/* Nombre y descripción de cada nivel, por idioma. */
const NOMBRES_NIVEL = {
  es: {
    1: { nombre: 'Nivel 1', descripcion: 'Euros enteros' },
    2: { nombre: 'Nivel 2', descripcion: 'Euros y 50 céntimos' },
    3: { nombre: 'Nivel 3', descripcion: 'Céntimos variados' }
  },
  en: {
    1: { nombre: 'Level 1', descripcion: 'Whole euros' },
    2: { nombre: 'Level 2', descripcion: 'Euros and 50 cents' },
    3: { nombre: 'Level 3', descripcion: 'Mixed cents' }
  }
};

/* Nombre de cada producto, por idioma (clave -> nombre). */
const NOMBRES_PRODUCTO = {
  es: {
    pan: 'El pan', leche: 'La leche', manzanas: 'Las manzanas', champu: 'El champú',
    lapiz: 'El lápiz', calcetines: 'Los calcetines', platanos: 'Los plátanos', huevos: 'Los huevos',
    zumo: 'El zumo', chocolate: 'El chocolate', papel: 'El papel', galletas: 'Las galletas',
    refresco: 'El refresco', queso: 'El queso', miel: 'La miel',
    caramelos: 'Los caramelos', barraPan: 'La barra de pan', manzana: 'La manzana',
    cruasan: 'El cruasán', panuelos: 'El paquete de pañuelos', chocolatina: 'La chocolatina',
    trozoQueso: 'El trozo de queso'
  },
  en: {
    pan: 'The bread', leche: 'The milk', manzanas: 'The apples', champu: 'The shampoo',
    lapiz: 'The pencil', calcetines: 'The socks', platanos: 'The bananas', huevos: 'The eggs',
    zumo: 'The juice', chocolate: 'The chocolate', papel: 'The paper', galletas: 'The biscuits',
    refresco: 'The soft drink', queso: 'The cheese', miel: 'The honey',
    caramelos: 'The sweets', barraPan: 'The loaf of bread', manzana: 'The apple',
    cruasan: 'The croissant', panuelos: 'The packet of tissues', chocolatina: 'The chocolate bar',
    trozoQueso: 'The piece of cheese'
  }
};

function nivelesMonedero(loc) {
  var nombresNivel = NOMBRES_NIVEL[loc] || NOMBRES_NIVEL.es;
  var nombresProd = NOMBRES_PRODUCTO[loc] || NOMBRES_PRODUCTO.es;
  return NIVELES_BASE.map(function (n) {
    var etiquetas = nombresNivel[n.id] || {};
    return {
      id: n.id,
      nombre: etiquetas.nombre,
      descripcion: etiquetas.descripcion,
      estrellas: n.estrellas,
      monedas: n.monedas,
      productos: n.productos.map(function (p) {
        return { picto: p.picto, nombre: nombresProd[p.clave] || p.clave, precio: p.precio };
      })
    };
  });
}

const DATA = {
  es: { porRonda: 6, niveles: nivelesMonedero('es') },
  en: { porRonda: 6, niveles: nivelesMonedero('en') }
};
