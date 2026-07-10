/* ============================================================
   Datos: La Compra (razonamiento/autonomía — AVD instrumental:
   secciones del supermercado y planificar la lista de la compra).
   Formato: DATA.es / DATA.en, cada uno con:
   { secciones: { porRonda, niveles: [{ id, nombre, descripcion,
       estrellas, categorias: string[3], items: [{ picto, palabra,
       categoria }] }] },
     lista: { porRonda, momentos: string[3] (compartidos por todos
       los niveles), niveles: [{ id, nombre, descripcion, estrellas,
       items: [{ picto, palabra, momento }] }] } }
   Dos actividades independientes elegibles desde un menú (regla 10):
   - 'secciones': clon exacto del motor de ¿Dónde lo guardo? —
     producto → sección del supermercado (Frutería/Carnicería/
     Limpieza). Regla 13: única variable por nivel es lo evidente del
     producto.
   - 'lista': clon exacto del motor de Partes del Día — producto →
     para qué comida del día (Desayuno/Comida/Cena), acumulando una
     lista visual por caja. Regla 13: única variable por nivel es lo
     evidente del producto.
   Cierra la cadena de AVD instrumental junto con El Monedero (pagar)
   y La Casa (cocinar/guardar).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    secciones: {
      porRonda: 10,
      niveles: [
        {
          id: 1,
          nombre: 'Nivel 1',
          descripcion: 'Productos muy claros',
          estrellas: 1,
          categorias: ['Frutería', 'Carnicería', 'Limpieza'],
          items: [
            { picto: '🍎', palabra: 'Manzana', categoria: 'Frutería' },
            { picto: '🍌', palabra: 'Plátano', categoria: 'Frutería' },
            { picto: '🍇', palabra: 'Uvas', categoria: 'Frutería' },
            { picto: '🍊', palabra: 'Naranja', categoria: 'Frutería' },
            { picto: '🍗', palabra: 'Pollo', categoria: 'Carnicería' },
            { picto: '🥩', palabra: 'Filete de ternera', categoria: 'Carnicería' },
            { picto: '🌭', palabra: 'Salchichas', categoria: 'Carnicería' },
            { picto: '🥓', palabra: 'Bacon', categoria: 'Carnicería' },
            { picto: '🧽', palabra: 'Estropajo', categoria: 'Limpieza' },
            { picto: '🧴', palabra: 'Detergente', categoria: 'Limpieza' },
            { picto: '🧻', palabra: 'Papel higiénico', categoria: 'Limpieza' },
            { picto: '🧹', palabra: 'Escoba', categoria: 'Limpieza' }
          ]
        },
        {
          id: 2,
          nombre: 'Nivel 2',
          descripcion: 'Productos menos evidentes',
          estrellas: 2,
          categorias: ['Frutería', 'Carnicería', 'Limpieza'],
          items: [
            { picto: '🍋', palabra: 'Limón', categoria: 'Frutería' },
            { picto: '🥔', palabra: 'Patata', categoria: 'Frutería' },
            { picto: '🧄', palabra: 'Ajo', categoria: 'Frutería' },
            { picto: '🍅', palabra: 'Tomate', categoria: 'Frutería' },
            { picto: '🦃', palabra: 'Pavo', categoria: 'Carnicería' },
            { picto: '🍖', palabra: 'Costillas', categoria: 'Carnicería' },
            { picto: '🥚', palabra: 'Huevos', categoria: 'Carnicería' },
            { picto: '🐔', palabra: 'Muslos de pollo', categoria: 'Carnicería' },
            { picto: '🧼', palabra: 'Jabón de manos', categoria: 'Limpieza' },
            { picto: '🪣', palabra: 'Cubo', categoria: 'Limpieza' },
            { picto: '🧺', palabra: 'Cesta de la ropa', categoria: 'Limpieza' },
            { picto: '🧤', palabra: 'Guantes de goma', categoria: 'Limpieza' }
          ]
        }
      ]
    },
    lista: {
      porRonda: 8,
      momentos: ['Desayuno', 'Comida', 'Cena'],
      niveles: [
        {
          id: 1,
          nombre: 'Nivel 1',
          descripcion: 'Productos muy claros',
          estrellas: 1,
          items: [
            { picto: '🥛', palabra: 'Leche', momento: 'Desayuno' },
            { picto: '🥐', palabra: 'Cruasán', momento: 'Desayuno' },
            { picto: '🍞', palabra: 'Pan de molde', momento: 'Desayuno' },
            { picto: '🍯', palabra: 'Miel', momento: 'Desayuno' },
            { picto: '🍚', palabra: 'Arroz', momento: 'Comida' },
            { picto: '🥔', palabra: 'Patatas', momento: 'Comida' },
            { picto: '🍅', palabra: 'Tomate frito', momento: 'Comida' },
            { picto: '🐟', palabra: 'Filetes de merluza', momento: 'Comida' },
            { picto: '🥣', palabra: 'Sopa de sobre', momento: 'Cena' },
            { picto: '🥗', palabra: 'Lechuga para ensalada', momento: 'Cena' },
            { picto: '🧀', palabra: 'Queso', momento: 'Cena' },
            { picto: '🍳', palabra: 'Huevos para tortilla', momento: 'Cena' }
          ]
        },
        {
          id: 2,
          nombre: 'Nivel 2',
          descripcion: 'Productos menos evidentes',
          estrellas: 2,
          items: [
            { picto: '🥣', palabra: 'Cereales', momento: 'Desayuno' },
            { picto: '🍊', palabra: 'Zumo de naranja', momento: 'Desayuno' },
            { picto: '🧈', palabra: 'Mantequilla', momento: 'Desayuno' },
            { picto: '🍫', palabra: 'Cacao en polvo', momento: 'Desayuno' },
            { picto: '🍝', palabra: 'Pasta', momento: 'Comida' },
            { picto: '🫘', palabra: 'Lentejas', momento: 'Comida' },
            { picto: '🌽', palabra: 'Maíz en lata', momento: 'Comida' },
            { picto: '🧅', palabra: 'Cebolla para el sofrito', momento: 'Comida' },
            { picto: '🍲', palabra: 'Caldo', momento: 'Cena' },
            { picto: '🥒', palabra: 'Pepino', momento: 'Cena' },
            { picto: '🥪', palabra: 'Pan de sándwich', momento: 'Cena' },
            { picto: '🍇', palabra: 'Uvas de postre', momento: 'Cena' }
          ]
        }
      ]
    }
  },
  en: {
    secciones: {
      porRonda: 10,
      niveles: [
        {
          id: 1,
          nombre: 'Level 1',
          descripcion: 'Very clear products',
          estrellas: 1,
          categorias: ['Fruit shop', 'Butcher', 'Cleaning'],
          items: [
            { picto: '🍎', palabra: 'Apple', categoria: 'Fruit shop' },
            { picto: '🍌', palabra: 'Banana', categoria: 'Fruit shop' },
            { picto: '🍇', palabra: 'Grapes', categoria: 'Fruit shop' },
            { picto: '🍊', palabra: 'Orange', categoria: 'Fruit shop' },
            { picto: '🍗', palabra: 'Chicken', categoria: 'Butcher' },
            { picto: '🥩', palabra: 'Beef steak', categoria: 'Butcher' },
            { picto: '🌭', palabra: 'Sausages', categoria: 'Butcher' },
            { picto: '🥓', palabra: 'Bacon', categoria: 'Butcher' },
            { picto: '🧽', palabra: 'Scourer', categoria: 'Cleaning' },
            { picto: '🧴', palabra: 'Detergent', categoria: 'Cleaning' },
            { picto: '🧻', palabra: 'Toilet paper', categoria: 'Cleaning' },
            { picto: '🧹', palabra: 'Broom', categoria: 'Cleaning' }
          ]
        },
        {
          id: 2,
          nombre: 'Level 2',
          descripcion: 'Less obvious products',
          estrellas: 2,
          categorias: ['Fruit shop', 'Butcher', 'Cleaning'],
          items: [
            { picto: '🍋', palabra: 'Lemon', categoria: 'Fruit shop' },
            { picto: '🥔', palabra: 'Potato', categoria: 'Fruit shop' },
            { picto: '🧄', palabra: 'Garlic', categoria: 'Fruit shop' },
            { picto: '🍅', palabra: 'Tomato', categoria: 'Fruit shop' },
            { picto: '🦃', palabra: 'Turkey', categoria: 'Butcher' },
            { picto: '🍖', palabra: 'Ribs', categoria: 'Butcher' },
            { picto: '🥚', palabra: 'Eggs', categoria: 'Butcher' },
            { picto: '🐔', palabra: 'Chicken thighs', categoria: 'Butcher' },
            { picto: '🧼', palabra: 'Hand soap', categoria: 'Cleaning' },
            { picto: '🪣', palabra: 'Bucket', categoria: 'Cleaning' },
            { picto: '🧺', palabra: 'Laundry basket', categoria: 'Cleaning' },
            { picto: '🧤', palabra: 'Rubber gloves', categoria: 'Cleaning' }
          ]
        }
      ]
    },
    lista: {
      porRonda: 8,
      momentos: ['Breakfast', 'Lunch', 'Dinner'],
      niveles: [
        {
          id: 1,
          nombre: 'Level 1',
          descripcion: 'Very clear products',
          estrellas: 1,
          items: [
            { picto: '🥛', palabra: 'Milk', momento: 'Breakfast' },
            { picto: '🥐', palabra: 'Croissant', momento: 'Breakfast' },
            { picto: '🍞', palabra: 'Sliced bread', momento: 'Breakfast' },
            { picto: '🍯', palabra: 'Honey', momento: 'Breakfast' },
            { picto: '🍚', palabra: 'Rice', momento: 'Lunch' },
            { picto: '🥔', palabra: 'Potatoes', momento: 'Lunch' },
            { picto: '🍅', palabra: 'Tomato sauce', momento: 'Lunch' },
            { picto: '🐟', palabra: 'Hake fillets', momento: 'Lunch' },
            { picto: '🥣', palabra: 'Instant soup', momento: 'Dinner' },
            { picto: '🥗', palabra: 'Lettuce for salad', momento: 'Dinner' },
            { picto: '🧀', palabra: 'Cheese', momento: 'Dinner' },
            { picto: '🍳', palabra: 'Eggs for omelette', momento: 'Dinner' }
          ]
        },
        {
          id: 2,
          nombre: 'Level 2',
          descripcion: 'Less obvious products',
          estrellas: 2,
          items: [
            { picto: '🥣', palabra: 'Cereal', momento: 'Breakfast' },
            { picto: '🍊', palabra: 'Orange juice', momento: 'Breakfast' },
            { picto: '🧈', palabra: 'Butter', momento: 'Breakfast' },
            { picto: '🍫', palabra: 'Cocoa powder', momento: 'Breakfast' },
            { picto: '🍝', palabra: 'Pasta', momento: 'Lunch' },
            { picto: '🫘', palabra: 'Lentils', momento: 'Lunch' },
            { picto: '🌽', palabra: 'Tinned sweetcorn', momento: 'Lunch' },
            { picto: '🧅', palabra: 'Onion for the sauce', momento: 'Lunch' },
            { picto: '🍲', palabra: 'Broth', momento: 'Dinner' },
            { picto: '🥒', palabra: 'Cucumber', momento: 'Dinner' },
            { picto: '🥪', palabra: 'Sandwich bread', momento: 'Dinner' },
            { picto: '🍇', palabra: 'Grapes for dessert', momento: 'Dinner' }
          ]
        }
      ]
    }
  }
};
