# Información técnica

> Documentación para desarrolladores que quieran entender, mantener o ampliar Apptonomia.
>
> Mapa de la documentación del repo:

| Documento | Qué contiene | Cuándo leerlo |
|---|---|---|
| `CLAUDE.md` | Flujo operativo y coordinación para agentes IA | Solo si el cambio lo realiza un agente IA |
| `doc/<es\|en>/tecnico.md` (este) | Arquitectura, APIs del núcleo, contratos y recetas de desarrollo | Al desarrollar o modificar módulos |
| Historial del proyecto | Sigue en Git (`git log`); sin hoja de ruta externa. |
| `README.md` | Presentación breve, cómo ejecutar y desplegar | Primer contacto con el repo |
| `team/index.html` | Guía para familias/profesionales (ruta oculta, ver §8) | Al añadir actividades: mantenerla al día |
| `agent.md` | Puntero de compatibilidad hacia `CLAUDE.md` | No usar como fuente |

Cada materia tiene una única fuente canónica: producto en `SPEC.md`, técnica
en este documento, i18n en `I18N.md` (y `../en/I18N.md`). El roadmap
cerrado del proyecto vive en
`git log`. `CLAUDE.md` solo regula el flujo de trabajo de los agentes IA y no
redefine estas reglas.

---

## 1. Producto y restricciones

Aplicación web de terapia ocupacional para personas con discapacidad intelectual, usable **de forma autónoma** (sin profesional al lado). Interfaz en español de España, en Lectura Fácil.

### Restricciones técnicas innegociables

- **HTML5 + CSS3 + JavaScript vanilla.** Sin frameworks, sin bundlers, sin build step,
  sin backend, sin dependencias npm de ejecución (las devDependencies de despliegue
  como `firebase-tools` sí están permitidas).
- **Scripts clásicos**, no ES modules (compatibilidad con `file://` y navegadores viejos).
  Todo el código compartido se expone en `window.App.*`.
- **Sin CDNs de JS.** Única excepción externa: Google Fonts (Atkinson Hyperlegible y Nunito).
- **Persistencia solo en `localStorage`.** Sin login, sin cookies, sin datos personales,
  sin analítica.
- **PWA offline-first**: `manifest.json` + `sw.js` (cache-first del app shell).
- **Estilo de código**: JS estilo ES5 en las herramientas (`var`, funciones clásicas,
  IIFE con `'use strict'`); nombres de variables/funciones e identificadores en
  inglés siempre que se toque un archivo — el código pertenece al ámbito
  tecnológico. Comentarios también en inglés. Excepción: los propios textos de
  interfaz (`strings.es.js`, contenido de `data.js` como palabras o frases) van
  en el idioma que representan. Archivos existentes en español (identificadores
  o comentarios) se migran al tocarlos, no de golpe.

---

## 2. Arquitectura y diseño modular

El proyecto tiene **tres niveles de modularidad**:

```
apptonomia/
├── index.html             # Nivel 0: redirección a site/index.html
├── site/index.html        # Nivel 0: landing = menú de actividades (7 módulos)
├── assets/                # Nivel 1: NÚCLEO COMPARTIDO
│   ├── css/tokens.css     #   variables de diseño (colores, tipografía, táctil)
│   ├── css/base.css       #   reset, foco visible, prefers-reduced-motion
│   ├── css/components.css #   componentes reutilizables (.btn, .card, …)
│   ├── js/utils.js        #   window.App.utils
│   ├── js/i18n.js         #   window.App.i18n
│   ├── js/tts.js          #   window.App.tts
│   ├── js/storage.js      #   window.App.storage
│   ├── js/feedback.js     #   window.App.feedback
│   ├── js/dinero.js       #   window.App.dinero (actividades de euros)
│   └── img/               #   pictogramas SVG e iconos PWA; la interfaz usa primero iconos del sistema y emojis para gráficos simples; si hace falta algo más, usar imágenes libres descargadas localmente desde fuentes CC0/domino público
├── tools/<slug>/          # Nivel 2: una carpeta por ACTIVIDAD (74 actuales)
│   ├── index.html         #   estructura y carga de assets
│   ├── app.js             #   solo lógica
│   ├── data.js            #   solo datos
│   ├── strings.es.js      #   textos en español
│   ├── strings.en.js      #   textos en inglés
│   └── styles.css         #   solo estilos específicos (< 150 líneas)
├── equipo/                # Ruta oculta: guía para el equipo de apoyo (§8)
├── ajustes/               # Ruta oculta: ver/borrar localStorage (§8.2)
├── presentacion/          # Ruta oculta: presentación pública del proyecto (§8.3)
├── manifest.json          # PWA
├── sw.js                  # Service worker: lista de caché + VERSION (§7)
├── firebase.json          # Hosting (despliegue)
└── .firebaserc            # Proyecto Firebase: apptonomia
```

### 2.1 Nivel 1 — Núcleo compartido (`assets/`)

Un cambio aquí afecta a **todas** las actividades. `i18n.js` debe cargar después de
`utils.js` y antes de `tts.js`/`feedback.js`, porque ambos leen el idioma activo.
Después del núcleo se carga **solo** `strings.<locale>.js`, seguido de `data.js` y
`app.js`. La carga condicional exacta está documentada en §6.2 y forma parte de la
anatomía estándar de §4.

### 2.2 Nivel 2 — Módulos terapéuticos (agrupación de la landing)

Las actividades se agrupan en **7 módulos** (áreas terapéuticas). Cada módulo es solo
una `<section class="modulo">` en `site/index.html` con dos variables CSS de acento —
no hay código por módulo:

| Módulo | Área | Token de color | Actividades |
|---|---|---|---|
| 🎯 Puntería y manos | Coordinación y motricidad | `--mod-coordinacion` (azul) | catch, connect-dots, keyboard-typing, tracing, coloring, piano-keys, builders |
| 📋 Mi día a día | Autonomía y hogar | `--mod-secuencia` (verde) | routines, house, situations, safe-chat, bullying-chat, post-or-not, social-safety, signs, times-of-day, what-first, what-do-i-need, where-to-store, task-list, my-agenda, what-to-wear, street, emergencies, phone-numbers, my-details, shopping, shop, healthy-food |
| 🧠 Memoria y atención | Memoria y atención | `--mod-memoria` (naranja) | pairs, differences, whats-missing, ecos, turns-mirrors, blocks, where-is, path, fit, theatre |
| 🔢 Pensar y contar | Razonamiento y matemáticas | `--mod-razonamiento` (teal) | riddles, patterns, numbers, quantities, math-tables, roman-numerals, wallet, clock, stories, odd-one-out, puzzle, oca, tic-tac-toe, visual-sudoku, domino, checkers, chess, connect-four |
| 💬 Lenguaje y palabras | Lenguaje y comunicación | `--mod-lenguaje` (frambuesa) | comedy-club, idioms, double-meaning, categories, sentence, words, vocabulary, dictionary, spelling, colored-spelling, word-search |
| 💜 Emociones | Emociones y relaciones | `--mod-emocional` (morado) | emotions, calm, friends, my-body, good-manners |
| 💗 Cuerpo y relaciones | Educación afectivo-sexual | `--mod-cuerpo` (terracota) | sexual-health |

> **Nota multi-área**: una actividad puede trabajar más de un área terapéutica
> (por ejemplo, `keyboard-typing` trabaja coordinación pero también lenguaje y
> escritura). En la landing aparece **una sola vez**, dentro de su **módulo
> principal**: el que mejor representa su objetivo principal. Los módulos
> terapéuticos sirven para navegar; las áreas se reflejan en la descripción de
> cada actividad en `team/index.html`. El catálogo global se reconstruye a
> partir de los slugs reales en `tools/` (verificado por `scripts/check.js`).

Cada token tiene su par suave: `--mod-<x>` y `--mod-<x>-suave` (fondos).
El catálogo funcional está en [`actividades.md`](actividades.md) y el propósito
terapéutico en [`equipo.md`](equipo.md) y `team/index.html`.

### 2.3 Nivel 3 — Actividades (`tools/<slug>/`)

Cada actividad es **autónoma y aislada**:

- No comparte estado con otras actividades (cada una lee/escribe solo su clave de storage).
- No importa nada de otra carpeta `tools/`.
- Funciona si se abre su `index.html` directamente.
- Separación estricta: datos en `data.js` (formato documentado en comentario de
  cabecera), lógica en `app.js`, un archivo de texto por idioma
  (`strings.es.js` / `strings.en.js`) y estilos propios en `styles.css`
  (< 150 líneas, usando los tokens del núcleo).

---

## 3. API del núcleo compartido (referencia)

### 3.1 `window.App.utils` (`utils.js`)

| Función | Firma | Descripción |
|---|---|---|
| `shuffle` | `(array) → array` | Copia barajada (Fisher-Yates). **Nunca** `sort(() => Math.random()-0.5)` |
| `$` | `(selector) → Element` | Atajo de `querySelector` |
| `$$` | `(selector) → Array<Element>` | Atajo de `querySelectorAll` (devuelve Array real) |
| `hoy` | `() → 'YYYY-MM-DD'` | Fecha local de hoy (para rutinas diarias) |
| `reducedMotion` | `() → boolean` | true si el sistema pide menos animación |
| `esTactil` | `() → boolean` | true si el dispositivo es principalmente táctil (`hover:none, pointer:coarse`) — sin teclado/ratón físico esperable. Usado por `keyboard-typing` para preseleccionar el teclado de móvil |

### 3.2 `window.App.tts` (`tts.js`)

| Función | Firma | Descripción |
|---|---|---|
| `speak` | `(texto, [onEnd])` | Lee en el idioma activo (`App.i18n.lang()`: es-ES o en-US) a velocidad 0.9. Cancela la lectura anterior. Si no hay síntesis disponible, llama a `onEnd` igualmente |
| `stop` | `()` | Detiene la lectura |
| `disponible` | `boolean` | Si el navegador soporta speechSynthesis |

### 3.3 `window.App.i18n` (`i18n.js`)

Sistema ES/EN. Idioma activo: `localStorage['apptonomia:locale']`, o se detecta de
`navigator.language` si no hay nada guardado. Cambiar de idioma recarga la página.
**Referencia completa de la arquitectura y receta para añadir un idioma nuevo: `I18N.md`.**

| Función | Firma | Descripción |
|---|---|---|
| `locale` | `() → 'es'\|'en'` | Idioma activo |
| `setLocale` | `(loc)` | Guarda el idioma y recarga la página |
| `lang` | `() → 'es-ES'\|'en-US'` | Código BCP-47 para `App.tts.speak` |
| `register` | `(dict, locale)` | Registra el diccionario de un solo idioma desde `strings.<locale>.js`. La firma antigua `({es:{…}, en:{…}})` sigue disponible por compatibilidad |
| `t` | `(clave) → string` | Busca `clave` (con puntos, p. ej. `'core.back'` o `'nivel.c1'`) en el idioma activo; si falta, cae a español; si no existe, devuelve la propia clave |
| `pick` | `(clave) → string` | Como `t`, pero si el valor es un array (p. ej. `feedback.success`) devuelve un elemento al azar |
| `apply` | `([raíz])` | Aplica `data-i18n` (textContent) y `data-i18n-aria` (aria-label) a todo el DOM bajo `raíz` (por defecto, `document`) |

Claves comunes ya registradas en `core.*` (no redefinir en los archivos de cada
actividad): `back`, `backToMenu`, `playAgain`, `next`, `listen`,
`listenInstructions`, `listenText`, `loading`, `roundComplete`, `rest`.

Cada `strings.<locale>.js` registra `{ title, instruccion, … }` con su locale, y
`strings.es.js` / `strings.en.js` deben conservar exactamente las mismas claves.
`scripts/check.js` comprueba esa paridad. Los placeholders con llaves
(`'{n} veces'`) se sustituyen en `app.js` con `.replace('{n}', valor)`. La
arquitectura, los patrones de datos traducibles y las reglas para números y fechas
están desarrollados en [`I18N.md`](I18N.md).

### 3.4 `window.App.storage` (`storage.js`)

Clave interna: `apptonomia:<toolId>`. Todas las funciones son tolerantes a fallos
(modo privado, storage lleno): nunca lanzan.

| Función | Firma | Descripción |
|---|---|---|
| `get` | `(toolId) → object` | Progreso guardado, o `{}` si no hay nada o hay error |
| `set` | `(toolId, data) → boolean` | Guarda JSON. `false` si falló |
| `remove` | `(toolId) → boolean` | Borra el progreso de la herramienta |
| `estrellasTotales` | `() → number` | Suma `datos.estrellas` de todas las claves `apptonomia:*` (la usa la landing) |
| `listaToolIds` | `() → string[]` | Ids de las herramientas con algo guardado, sin `'locale'` (la usa `settings/`) |

**Contrato de progreso**: el objeto guardado debe incluir `estrellas` (number) si la
actividad da estrellas — es lo que suma la landing. El resto del objeto es libre por
actividad. Ejemplo típico: `{ estrellas: 3, completado: { nivel1: true }, opciones: {...} }`.

### 3.5 `window.App.feedback` (`feedback.js`)

| Función | Firma | Descripción |
|---|---|---|
| `acierto` | `([zona]) → string` | Mensaje positivo aleatorio + sonido suave. Escribe en `zona` (elemento con `aria-live="polite"`) y le pone clase `.acierto` |
| `animo` | `([zona]) → string` | Mensaje de ánimo tras fallo (nunca punitivo) + tono neutro. Clase `.animo` |
| `celebrar` | `(mensaje, [despues])` | Capa de celebración a pantalla completa ≤ 2 s (1,2 s con reduced motion); llama a `despues` al ocultarse |

Sonidos: generados con Web Audio (sin archivos), fallan en silencio.

### 3.6 `window.App.dinero` (`dinero.js`)

Módulo compartido para representar y explicar euros en El Monedero y La Tienda.
Todos los importes se expresan como **céntimos enteros**, nunca como decimales en
coma flotante. Las actividades que lo usan cargan `dinero.js` después de
`feedback.js` y antes de `strings.<locale>.js`. El aspecto visual vive en
`components.css`.

| Miembro | Descripción |
|---|---|
| `CATALOGO` | Denominaciones disponibles de 5 céntimos a 50 euros |
| `info(cent)` | Devuelve tipo y clase CSS de una denominación |
| `etiqueta(cent)` | Etiqueta corta impresa en la ficha (`2 €`, `50 cts`) |
| `formatear(cent)` | Importe localizado (`1,50 €` / `1.50 €`) |
| `hablado(cent)` | Importe escrito para TTS y explicaciones |
| `aria(cent)` | Nombre accesible de una moneda o billete |
| `crearFicha(cent, interactiva)` | Crea el elemento visual, decorativo o botón |
| `descomponer(cent)` | Descompone un importe en fichas de mayor a menor |
| `desglose(piezas)` | Explica verbalmente una colección de fichas |
| `pintarFichas(contenedor, piezas)` | Renderiza fichas decorativas con ARIA |

### 3.7 Componentes CSS (`components.css`)

Clases disponibles — **no duplicarlas** en los `styles.css` locales:

- Estructura: `.container` (máx. 900 px), `.pila` (columna con gap), `.fila`
  (fila con wrap), `.centrado`, `.oculto` (display none !important).
- Botones: `.btn` (primario, ≥ 64 px), `.btn-secundario`, `.btn-acierto`, `.btn-audio`
  (botón 🔊; estado `.hablando` o `aria-pressed="true"`), `.btn-opcion`
  (respuesta de opción múltiple; estados `.correcta` / `.animo`), `.back-link`.
- Juego: `.card`, `.progress-bar` + `.progress-fill` + `.progress-text`, `.stars`,
  `.feedback` (zona aria-live; estados `.acierto` / `.animo`), `.celebration`
  (la crea feedback.js), `.tool-header`, `.grid-tarjetas`.

**Tokens principales** (`tokens.css`): colores base (`--color-fondo/superficie/texto/
texto-suave/borde`), 6 pares de módulo (`--mod-*` / `--mod-*-suave`), feedback
(`--color-acierto`, `--color-animo` — naranja, nunca rojo agresivo —, `--color-estrella`),
tipografía (`--texto-base` 20px, `--texto-pequeno` 17px, `--texto-grande`, `--texto-titulo`),
táctil (`--boton-min` 64px, `--espacio` 16px, `--radio`, `--sombra`).

---

## 4. Anatomía de una actividad

Cada actividad en `tools/<slug>/` sigue este patrón:

### 4.1 `index.html`

```html
<!DOCTYPE html>
<html lang="es" data-i18n-title="title">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apptonomia</title>
    <link rel="stylesheet" href="../../assets/css/tokens.css">
    <link rel="stylesheet" href="../../assets/css/base.css">
    <link rel="stylesheet" href="../../assets/css/components.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <a href="../../site/index.html" class="back-link" data-i18n="core.back">← Volver</a>
    <h1 data-i18n="title">Parejas</h1>
    <div id="app"></div>
    <script src="../../assets/js/utils.js"></script>
    <script src="../../assets/js/i18n.js"></script>
    <script src="../../assets/js/tts.js"></script>
    <script src="../../assets/js/storage.js"></script>
    <script src="../../assets/js/feedback.js"></script>
    <script>
      (function () {
        var loc = window.App.i18n.locale();
        document.write('<script src="strings.' + loc + '.js?v=' + Date.now() + '"><\/script>');
      })();
    </script>
    <script src="data.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

### 4.2 `data.js`

```javascript
// Los datos de la actividad van aquí.
// NO poner lógica ni texto de UI.
// Formato: documentado en comentario de cabecera según la actividad.

var DATA = {
    // Niveles de dificultad
    niveles: [
        { nombre: 'nivel.nivel1', pares: 3 },
        { nombre: 'nivel.nivel2', pares: 4 },
        { nombre: 'nivel.nivel3', pares: 6 }
    ]
};
```

### 4.3 `strings.es.js` y `strings.en.js`

Cada archivo contiene un solo idioma y ambos mantienen las mismas claves:

```javascript
// strings.es.js
(function () {
    'use strict';
    App.i18n.register({
        title: 'Parejas',
        instruction: 'Toca las cartas para encontrar las que son iguales.',
        nivel1: 'Fácil',
        nivel2: 'Medio',
        nivel3: 'Difícil'
    }, 'es');
})();
```

```javascript
// strings.en.js
(function () {
    'use strict';
    App.i18n.register({
        title: 'Pairs',
        instruction: 'Tap the cards to find the matching ones.',
        nivel1: 'Easy',
        nivel2: 'Medium',
        nivel3: 'Hard'
    }, 'en');
})();
```

### 4.4 `app.js`

```javascript
// Lógica de la actividad
(function() {
    'use strict';

    // Leer progreso guardado
    var saved = App.storage.get('parejas') || {};

    function init() {
        // Aplicar traducciones
        App.i18n.apply();

        // Generar contenido dinámico
        var instruction = App.i18n.t('instruction');
        // ... resto de la lógica
    }

    // Iniciar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', init);
})();
```

### 4.5 `styles.css`

```css
/* Estilos específicos de la actividad */
/* Usar tokens CSS disponibles en tokens.css */

.actividad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--espacio);
}
```

---

## 5. Reglas de accesibilidad

Al crear actividades nuevas, seguir estas **13 reglas obligatorias**:

1. **Lectura Fácil**: frases cortas, una idea por frase
2. **Botones ≥ 64×64 px**, separación ≥ 16 px
3. **Alto contraste** (WCAG AA mínimo)
4. **Audio en todo texto importante**: botón 🔊 con `App.tts.speak()`
5. **Sin presión**: sin cronómetros, puntuación negativa ni "game over"
6. **Refuerzo positivo** al acertar: `App.feedback.acierto()`
7. **Respetar `prefers-reduced-motion`**
8. **Navegación por teclado** completa
9. **ARIA** en botones de icono y zonas de feedback
10. **Máximo 4-6 opciones** por pantalla
11. **Preguntas tipo quiz**: máximo 3 opciones, siempre con explicación
12. **Método socrático** al fallar: pista antes de dar la respuesta
13. **Progresión gradual**: cada nivel cambia una sola variable

---

## 6. Internacionalización

### 6.1 Sistema multi-archivo por idioma

Los textos de cada actividad/landing viven en **archivos separados por idioma** (no
en un único monolítico). Así, el cliente solo descarga el idioma activo y el
mantenimiento es independiente por idioma.

```
site/strings.es.js    ← solo español (registra en locale 'es')
site/strings.en.js    ← solo inglés (registra en locale 'en')

tools/pairs/strings.es.js    ← solo español
tools/pairs/strings.en.js    ← solo inglés
... (mismo patrón para todas las 69 actividades)
```

Cada archivo sigue este patrón:

```js
(function () {
  'use strict';
  App.i18n.register({
    title: '🃏 Parejas',
    instruccion: 'Busca las dos cartas iguales.',
    // ... resto de claves en su idioma
  }, 'es');  // o 'en', 'fr'...
})();
```

`register(dict, locale)` (con segundo argumento) registra los textos solo en ese idioma.
La API completa está en `assets/js/i18n.js` (también tiene una firma legacy
`register({es:..., en:...})` retrocompatible).

### 6.2 Carga condicional en `index.html`

`assets/js/i18n.js` debe cargarse **antes** que los `tts.js`/`feedback.js`, que
leen el idioma activo. El archivo de textos se inyecta de forma síncrona según
el locale:

```html
<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/i18n.js"></script>
<script src="../../assets/js/tts.js"></script>
<script src="../../assets/js/storage.js"></script>
<script src="../../assets/js/feedback.js"></script>
<script>
  /* Carga condicional del archivo de idioma activo (es|en). */
  (function () {
    var loc = window.App.i18n.locale();
    document.write('<script src="strings.' + loc + '.js?v=' + Date.now() + '"><\/script>');
  })();
</script>
<script src="data.js"></script>
<script src="app.js"></script>
```

El `document.write` durante el parseo del HTML es síncrono, así que el `<script>`
inyectado se ejecuta antes que los siguientes — preserva el orden de dependencias.

### 6.3 Claves comunes (`core.*`, `feedback.*`)

Ya están definidas en `assets/js/i18n.js` (no redefinir en `strings.<locale>.js`):

| Clave | ES | EN |
|-------|----|----|
| `core.back` | ← Volver | ← Back |
| `core.backToMenu` | Volver al menú | Back to menu |
| `core.playAgain` | Jugar otra vez | Play again |
| `core.next` | Siguiente → | Next → |
| `core.listen` | 🔊 Escuchar | 🔊 Listen |
| `feedback.success` | [array] | [array] |
| `feedback.encourage` | [array] | [array] |

### 6.4 Añadir un idioma nuevo (pasos)

1. Añadir el código a `SOPORTADOS` en `assets/js/i18n.js`
2. Añadir textos core y feedback en `i18n.js` §1.2
3. Añadir botón al selector en `site/index.html`
4. Crear `site/strings.<locale>.js`
5. Crear `tools/<slug>/strings.<locale>.js` para cada actividad (mismas claves)
6. Subir `VERSION` en `sw.js` y añadir los nuevos archivos a `ARCHIVOS`
7. Añadir `'fr'` (o el nuevo idioma) a `STRING_LOCALES` en `scripts/check.js`
8. Ejecutar `node scripts/check.js` (valida paridad de claves)
9. Ejecutar `node scripts/smoke.js --lang <locale>` (valida carga en navegadores)

Receta detallada y consideraciones (números, horas, contenido cultural) en
`I18N.md` §5.

---

## 7. Contratos transversales

- **Aislamiento**: una actividad nunca lee la clave de storage de otra. El único
  acoplamiento permitido es `estrellasTotales()` desde la landing.
- **El error nunca castiga**: no restar estrellas ni progreso; el fallo produce
  `animo()` y se puede reintentar sin límite.
- **Sin cronómetros visibles**: medir tiempos internamente está permitido (dato en
  storage), mostrarlos como presión no.
- **Textos de la UI**: español de España e inglés, Lectura Fácil en los dos, sin
  lenguaje clínico ("paciente", "terapia", "discapacidad"). El lenguaje clínico solo
  se permite en `team/` y en la documentación del repo. Todo texto vive en
  `strings.<locale>.js` (nunca hardcodeado en `app.js` ni como único contenido de un nodo HTML
  sin `data-i18n`).
- **Banco de casos en simulaciones**: una actividad de simulación o entrenamiento
  debe ofrecer al menos **25 casos** para evitar que las rondas se memoricen. En
  chats pueden ser variantes de tarjetas temáticas, siempre sin superar el máximo
  de opciones visibles de §5.
- **Teclados en pantalla decorativos** (`keyboard-typing`): elementos visuales con
  `pointer-events: none`; la entrada real es el teclado físico. **Excepción
  deliberada**: el tipo de teclado `movil` (`DATA.layouts.movil`, clase CSS
  `.tocable`) sí se puede tocar, porque en un móvil/tablet no hay teclado físico
  que pulsar — la pantalla es la única entrada real. Se detecta y se preselecciona
  solo (`App.utils.esTactil()`, basado en `matchMedia('(hover:none) and
  (pointer:coarse)')`) sin que el usuario tenga que elegir nada.

---

## 8. Rutas ocultas

Páginas para adultos (familia/profesorado/agente IA) que gestionan el dispositivo,
no para la persona usuaria. Reglas comunes a todas: **no enlazarlas nunca** desde
`site/index.html` ni desde las actividades (acceso solo por URL conocida), llevan
`<meta name="robots" content="noindex, nofollow">`, son las únicas páginas del
producto donde se permite lenguaje clínico o de administración del dispositivo, y
siguen el mismo patrón multiidioma que el resto del sitio (`strings.es.js` /
`strings.en.js`, `data-i18n`, selector de idioma) — verificado por `scripts/check.js`
igual que en `tools/`.

### 8.1 `/team/`

Guía para familias, terapeutas y profesorado + nota técnica para agentes de IA
sobre el proyecto, el diseño y el catálogo de actividades. Mantenerla actualizada
al añadir actividades o módulos, en los dos idiomas.

### 8.2 `/settings/`

Ver y borrar lo guardado en `localStorage` de este navegador. Dos acciones,
cada una con confirmación en dos pasos (un clic pide confirmar, el segundo
borra):

- **Restablecer datos de la persona**: `App.storage.remove('locale')` +
  vaciar el campo `nombre` de las herramientas que lo piden (hoy
  `keyboard-typing` y `piano-keys` — mantener esta lista en
  `settings/app.js` si una herramienta nueva pide un nombre).
- **Restablecer toda la aplicación**: borra todas las claves `apptonomia:*`
  (`App.storage.listaToolIds()` + `remove('locale')`). Equivale a un primer uso.

### 8.3 `/about/`

Página pública de presentación del proyecto, pensada para periodistas,
financiadores, nuevos colaboradores y cualquier persona que llega al sitio o al
repositorio y quiere entender qué es Apptonomia sin abrir el código.

Tiene seis secciones: el origen del proyecto, los seis principios que no se
negocian (autonomía, sin presión, privacidad, Lectura Fácil, accesibilidad,
tecnología sobria), cómo está hecha la aplicación (PWA estática, sin backend,
`localStorage` único, MIT, sólo fuentes externas), las seis áreas terapéuticas
con el total de 69 actividades, autoría y cinco formas de colaborar (probar,
proponer, revisar, contribuir código, difundir). El pie enlaza al menú de
actividades y a la guía del equipo de apoyo, pero ningún enlace público apunta
a ella: solo se llega escribiendo la URL.

Actualizarla cuando se añadan módulos o cuando cambie el número total de
actividades, en los dos idiomas. No añadir aquí texto dirigido a la persona
usuaria: esa página no es para ella.

### 8.4 `/legal/`

Página de protección de datos: qué guarda Apptonomia (solo `localStorage`
— ver §3.4/SPEC.md), dónde, para qué, cómo verlo o borrarlo (enlaza a
`/settings/`) y cómo plantear una pregunta (el repositorio público de
GitHub). Es la única excepción a las reglas de "ruta oculta" de arriba:
**sí** está enlazada desde el pie de todas las demás páginas (`site/`,
`settings/`, `team/`, `about/` y todas las `tools/<slug>/`, mediante la
clave i18n compartida `core.dataProtection` en `assets/js/i18n.js` y los
estilos `.pie-app`/`.enlace-legal` de `assets/css/components.css`), no
lleva `noindex`, y su lenguaje se mantiene claro y accesible en vez de
clínico, porque cualquiera —incluida la persona usuaria— puede llegar a
ella. Sigue igualmente el patrón `strings.es.js`/`strings.en.js`
verificado por `scripts/check.js`.

Mantenerla actualizada, en los dos idiomas, cada vez que cambie lo que la
aplicación guarda localmente (una herramienta nueva que pida un nombre o
datos personales, una acción nueva de borrado en `settings/`, etc.).

---

## 9. Receta: desarrollar una actividad nueva

1. **Elegir módulo y objetivo terapéutico.** Consultar la cobertura en
   [`equipo.md`](equipo.md). Las prioridades pendientes, si las hay, viven
   en issues de GitHub; el plan del proyecto cerrado se reconstruye con
   `git log`.
2. **Crear `tools/<slug>/`** con los 6 archivos de §4: `index.html`, `app.js`,
   `data.js`, `strings.es.js`, `strings.en.js` y `styles.css`. Copiar la estructura
   HTML y el pie de scripts de una actividad existente del mismo módulo.
3. **`data.js`**: `var DATA = {...}` — solo datos, con el formato documentado en un
   comentario de cabecera. Sin lógica ni textos de interfaz. En un quiz debe haber
   como máximo 3 opciones, una explicación por opción y una pista para el primer
   fallo. Si hay niveles, cada uno cambia una sola variable de dificultad (§5).
4. **`strings.es.js` y `strings.en.js`**: registrar un diccionario por archivo con
   `App.i18n.register(dict, 'es' | 'en')`. Ambos deben tener las mismas claves (§6).
5. **`app.js`**: IIFE con `'use strict'`. Leer y guardar con
   `App.storage.get/set('<slug>')`; reutilizar las APIs de `App.*` antes de crear
   lógica compartida nueva.
6. **`styles.css`**: solo estilos específicos (< 150 líneas), usando tokens y el
   color de acento del módulo.
7. **Cumplir las 13 reglas de accesibilidad** (§5).
8. **Registrar la actividad en todos los puntos canónicos**:
   - Tarjeta en `site/index.html` y claves correspondientes en
     `site/strings.es.js` / `site/strings.en.js`.
   - Los 6 archivos de la actividad en `ARCHIVOS` de `sw.js`, y subir `VERSION` (§11).
   - Fila en `team/index.html` y entrada bilingüe en `actividades.md` / `activities.md`.
9. **Verificar** con los comandos y criterios de §12: estructura, ambos idiomas,
   persistencia, audio, teclado, objetivos táctiles y vista responsive.
10. **Crear un commit** pequeño y coherente, con mensaje en inglés.

---

## 10. Receta: añadir un módulo terapéutico nuevo

Solo si el área no encaja en los 7 módulos existentes (comprobar la cobertura en
[`equipo.md`](equipo.md)):

1. Añadir el par de tokens en `assets/css/tokens.css`:
   `--mod-<nombre>: <color AA sobre blanco>;` y `--mod-<nombre>-suave: <fondo claro>;`.
   Verificar contraste AA del color sobre `--color-superficie`.
2. Añadir la `<section class="modulo">` en `site/index.html` con
   `style="--acento: var(--mod-<nombre>); --acento-suave: var(--mod-<nombre>-suave);"`,
   un `<h2>` con emoji + nombre en Lectura Fácil, y su `grid-tarjetas`.
3. Documentar el módulo en `actividades.md` / `activities.md`, `equipo.md` /
   `team.md`, `team/index.html` y §2.2 de esta documentación.
4. Crear la primera actividad del módulo (receta §9).

---

## 11. PWA y service worker

- `sw.js` es **cache-first** del app shell. Contrato al tocar archivos:
  1. Archivo nuevo → añadirlo a la lista `ARCHIVOS`.
  2. Cualquier cambio en archivos cacheados → **subir `VERSION`** (`apptonomia-vNN`),
     si no, los usuarios con la PWA instalada no reciben el cambio.
- El fetch handler cachea también recursos nuevos del mismo origen bajo demanda y
  hace fallback a `site/index.html` sin conexión.
- Sin aviso de actualización: el SW hace `skipWaiting()` + `clients.claim()`
  sin preguntar y los recursos nuevos se sirven de forma transparente en la
  siguiente navegación, sin interrumpir a la persona usuaria con un diálogo.
- `manifest.json`: `display: standalone`, `start_url` en `site/index.html`,
  iconos 192/512 en `assets/img/`.
- Para comprobar instalabilidad de forma objetiva: DevTools → Lighthouse →
  categoría "PWA".

---

## 12. Ejecución, verificación y despliegue

### 12.1 Servidor local

```bash
# Opción 1: Python
python -m http.server 8080          # → http://localhost:8080/site/index.html

# Opción 2: npx serve
npx serve .                         # alternativa si no hay Python
```

### 12.2 Comprobaciones de sintaxis y estructura

```bash
# Comprobación rápida de sintaxis de un archivo JS
node --check tools/<slug>/app.js

# Check estructural completo
node scripts/check.js
```

`scripts/check.js` comprueba, entre otros aspectos:
- Sintaxis JavaScript
- Estructura de carpetas de actividades
- Paridad de claves entre `strings.es.js` y `strings.en.js`
- Caché del service worker

### 12.3 Smoke test

```bash
node scripts/smoke.js
```

Abre las 69 actividades en Chromium (ES y EN) y verifica que no hay errores de consola.

### 12.4 Test cross-browser y cross-device

```bash
# Solo prueba (3 navegadores × 3 dispositivos × 1 idioma = 9 pruebas por actividad)
node scripts/cross-browser.js

# Probar también en ambos idiomas (× 2 idiomas = 18 pruebas por actividad)
node scripts/cross-browser.js --all-langs

# Probar una sola actividad
node scripts/cross-browser.js parejas

# Vía npm
npm run test:cross
npm test          # check + smoke + cross-browser
```

`scripts/cross-browser.js` abre cada actividad en **Chromium (Chrome/Edge),
Firefox y WebKit (Safari)**, en **escritorio, iPhone 12 y Pixel 5**, y
verifica:

- Sin errores de consola ni de página
- Botón "Volver" visible
- Botón de audio (`.btn-audio`) presente
- Todos los `.btn` son ≥ 64×64 px (regla 2 de accesibilidad)
- Cambio de idioma ES → EN funciona (si hay selector en la actividad)
- En móvil: no hay scroll horizontal (responsive 360 px)

Requisitos:

```bash
npm install
npx playwright install chromium firefox webkit
```

### 12.5 Despliegue

```bash
# Firebase Hosting (proyecto "apptonomia")
npm run firebase:hosting            # canal de preview (para probar)
npm run firebase:deploy             # producción
```

En sesiones **remote-control** (sin navegador local) la única forma de probar es el
canal de preview de Firebase — avisar al usuario antes de desplegar.

Los scripts automatizan estructura y carga básica. Los recorridos funcionales
completos, la calidad del contenido y la revisión de accesibilidad siguen
requiriendo comprobación manual.

---

## 13. Licencia

Este proyecto es de código abierto bajo licencia MIT. Consulta el repositorio para más detalles.
