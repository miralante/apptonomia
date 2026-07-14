# SPEC.md — Especificación técnica de Apptonomia

## 0. Mapa de la documentación

| Documento | Qué contiene | Cuándo leerlo |
|---|---|---|
| `CLAUDE.md` | Reglas obligatorias (accesibilidad, convenciones, qué NO hacer) y estado del proyecto | **Siempre**, antes de cualquier cambio |
| `SPEC.md` (este) | Arquitectura, diseño modular, APIs del núcleo, contratos y recetas de desarrollo | Al desarrollar o modificar módulos |
| `PLAN.md` | Hoja de ruta por fases, catálogo de actividades y taxonomía terapéutica (§4.1) | Antes de cambios grandes; para elegir qué construir |
| `README.md` | Presentación breve, cómo ejecutar y desplegar | Primer contacto con el repo |
| `equipo/index.html` | Guía para familias/profesionales (ruta oculta, ver §8) | Al añadir actividades: mantenerla al día |
| `agent.md` | Puntero a esta documentación (histórico) | No usar como fuente |

Si un documento contradice a `CLAUDE.md`, **gana `CLAUDE.md`**.

---

## 1. Producto y restricciones

Aplicación web de terapia ocupacional para personas con discapacidad intelectual,
usable **de forma autónoma** (sin profesional al lado). Interfaz en español de España,
en Lectura Fácil.

Restricciones técnicas **innegociables**:

- **HTML5 + CSS3 + JavaScript vanilla.** Sin frameworks, sin bundlers, sin build step,
  sin backend, sin dependencias npm de ejecución (las devDependencies de despliegue
  como `firebase-tools` sí están permitidas).
- **Scripts clásicos**, no ES modules (compatibilidad con `file://` y navegadores viejos).
  Todo el código compartido se expone en `window.App.*`.
- **Sin CDNs de JS.** Única excepción externa: Google Fonts (Atkinson Hyperlegible y Nunito).
- **Persistencia solo en `localStorage`.** Sin login, sin cookies, sin datos personales,
  sin analítica.
- **PWA offline-first**: `manifest.json` + `sw.js` (cache-first del app shell).
- Estilo de código: JS estilo ES5 en las herramientas (`var`, funciones clásicas,
  IIFE con `'use strict'`); nombres de variables/funciones en inglés o español según
  el archivo existente — seguir el estilo del archivo que se toca. Comentarios en español.

---

## 2. Arquitectura y diseño modular

El proyecto tiene **tres niveles de modularidad**:

```
apptonomia/
├── index.html             # Nivel 0: redirección a site/index.html
├── site/index.html        # Nivel 0: landing = menú de actividades (6 módulos)
├── assets/                # Nivel 1: NÚCLEO COMPARTIDO
│   ├── css/tokens.css     #   variables de diseño (colores, tipografía, táctil)
│   ├── css/base.css       #   reset, foco visible, prefers-reduced-motion
│   ├── css/components.css #   componentes reutilizables (.btn, .card, …)
│   ├── js/utils.js        #   window.App.utils
│   ├── js/tts.js          #   window.App.tts
│   ├── js/storage.js      #   window.App.storage
│   ├── js/feedback.js     #   window.App.feedback
│   └── img/               #   pictogramas SVG e iconos PWA
├── tools/<slug>/          # Nivel 2: una carpeta por ACTIVIDAD (55 actuales)
│   ├── index.html         #   estructura y carga de assets
│   ├── app.js             #   solo lógica
│   ├── data.js            #   solo datos (const DATA = … o { es: […], en: […] })
│   ├── strings.js         #   solo texto ES/EN, registrado con App.i18n.register()
│   └── styles.css         #   solo estilos específicos (< 150 líneas)
├── equipo/                # Ruta oculta: guía para el equipo de apoyo (§8.1)
├── ajustes/               # Ruta oculta: ver/borrar localStorage (§8.2)
├── manifest.json          # PWA
├── sw.js                  # Service worker: lista de caché + VERSION (§7)
├── firebase.json          # Hosting (despliegue)
└── .firebaserc            # Proyecto Firebase: apptonomia
```

### 2.1 Nivel 1 — Núcleo compartido (`assets/`)

Un cambio aquí afecta a **todas** las actividades. `i18n.js` debe cargar antes que
`tts.js`/`feedback.js` (ambos leen el idioma activo) y antes que `strings.js`/`data.js`
de la actividad (que registran/consultan textos). Orden de carga estándar en cada
`index.html`:

```html
<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/i18n.js"></script>
<script src="../../assets/js/tts.js"></script>
<script src="../../assets/js/storage.js"></script>
<script src="../../assets/js/feedback.js"></script>
<script src="strings.js"></script>
<script src="data.js"></script>
<script src="app.js"></script>
```

### 2.2 Nivel 2 — Módulos terapéuticos (agrupación de la landing)

Las actividades se agrupan en **6 módulos** (áreas terapéuticas). Cada módulo es solo
una `<section class="modulo">` en `site/index.html` con dos variables CSS de acento —
no hay código por módulo:

| Módulo | Área | Token de color | Actividades |
|---|---|---|---|
| 🎯 Puntería y manos | Coordinación y motricidad | `--mod-coordinacion` (azul) | atrapa, keyboard-typing, trazos, colorear |
| 📋 Mi día a día | Autonomía y hogar | `--mod-secuencia` (verde) | rutinas, la-casa, situaciones, chat-seguro |
| 🧠 Memoria y atención | Memoria y atención | `--mod-memoria` (naranja) | parejas, diferencias, que-falta, ecos |
| 🔢 Pensar y contar | Razonamiento y matemáticas | `--mod-razonamiento` (teal) | adivinanzas, patrones, numeros, monedero, reloj, historias, que-no-encaja, puzzle, oca |
| 💬 Lenguaje y palabras | Lenguaje y comunicación | `--mod-lenguaje` (frambuesa) | comedy-club, dichos, categorias, la-frase, palabras |
| 💜 Emociones | Emociones y relaciones | `--mod-emocional` (morado) | emociones, calma, entre-amigos |

Cada token tiene su par suave: `--mod-<x>` y `--mod-<x>-suave` (fondos).
El propósito terapéutico de cada actividad está en `PLAN.md` §4 y en `equipo/index.html`.

### 2.3 Nivel 3 — Actividades (`tools/<slug>/`)

Cada actividad es **autónoma y aislada**:

- No comparte estado con otras actividades (cada una lee/escribe solo su clave de storage).
- No importa nada de otra carpeta `tools/`.
- Funciona si se abre su `index.html` directamente.
- Separación estricta: datos en `data.js` (formato documentado en comentario de
  cabecera), lógica en `app.js`, texto ES/EN en `strings.js`, estilos propios en
  `styles.css` (< 150 líneas, usando los tokens del núcleo).

---

## 3. API del núcleo compartido (referencia)

### 3.1 `window.App.utils` (utils.js)

| Función | Firma | Descripción |
|---|---|---|
| `shuffle` | `(array) → array` | Copia barajada (Fisher-Yates). **Nunca** `sort(() => Math.random()-0.5)` |
| `$` | `(selector) → Element` | Atajo de `querySelector` |
| `$$` | `(selector) → Array<Element>` | Atajo de `querySelectorAll` (devuelve Array real) |
| `hoy` | `() → 'YYYY-MM-DD'` | Fecha local de hoy (para rutinas diarias) |
| `reducedMotion` | `() → boolean` | true si el sistema pide menos animación |
| `esTactil` | `() → boolean` | true si el dispositivo es principalmente táctil (`hover:none, pointer:coarse`) — sin teclado/ratón físico esperable. Usado por `keyboard-typing` para preseleccionar el teclado de móvil |

### 3.2 `window.App.tts` (tts.js)

| Función | Firma | Descripción |
|---|---|---|
| `speak` | `(texto, [onEnd])` | Lee en el idioma activo (`App.i18n.lang()`: es-ES o en-US) a velocidad 0.9. Cancela la lectura anterior. Si no hay síntesis disponible, llama a `onEnd` igualmente |
| `stop` | `()` | Detiene la lectura |
| `disponible` | `boolean` | Si el navegador soporta speechSynthesis |

### 3.2b `window.App.i18n` (i18n.js)

Sistema ES/EN. Idioma activo: `localStorage['apptonomia:locale']`, o se detecta de
`navigator.language` si no hay nada guardado. Cambiar de idioma recarga la página.
**Referencia completa de la arquitectura y receta para añadir un idioma nuevo:
`I18N.md`.**

| Función | Firma | Descripción |
|---|---|---|
| `locale` | `() → 'es'\|'en'` | Idioma activo |
| `setLocale` | `(loc)` | Guarda el idioma y recarga la página |
| `lang` | `() → 'es-ES'\|'en-US'` | Código BCP-47 para `App.tts.speak` |
| `register` | `({es:{…}, en:{…}})` | Fusiona un diccionario de textos propio de una herramienta (llamar desde `strings.js`) |
| `t` | `(clave) → string` | Busca `clave` (con puntos, p. ej. `'core.volver'` o `'nivel.c1'`) en el idioma activo; si falta, cae a español; si no existe, devuelve la propia clave |
| `pick` | `(clave) → string` | Como `t`, pero si el valor es un array (p. ej. `feedback.acierto`) devuelve un elemento al azar |
| `apply` | `([raíz])` | Aplica `data-i18n` (textContent) y `data-i18n-aria` (aria-label) a todo el DOM bajo `raíz` (por defecto, `document`) |

Claves comunes ya registradas en `core.*` (no redefinir en `strings.js` de cada
herramienta): `volver`, `volverAlMenu`, `jugarOtraVez`, `siguiente`, `escuchar`,
`escucharInstrucciones`, `escucharTexto`, `cargando`, `rondaCompletada`.

**Patrón de `strings.js`**: registrar `{ title, instruccion, …clave: 'texto', … }` en
`es` y `en` con las mismas claves en ambos idiomas (verificable con un script que
compare `Object.keys` recursivamente — ver `PLAN-I18N.md` §3). Placeholders con
llaves (`'{n} veces'`) se sustituyen en `app.js` con `.replace('{n}', valor)`.
Datos con texto en `data.js` (nombres, enunciados) se separan del array estructural
y se indexan por `id` desde `strings.js`, o se duplica `DATA = {es:[…], en:[…]}`
completo si casi todos los campos son texto (ver ambos patrones en `tools/colorear/`
y `tools/adivinanzas/`). **Números y fechas no son solo estilo**: el separador de
miles/decimales y la escala numérica (millón/billón vs. million/billion/trillion)
cambian entre idiomas — ver `tools/numeros/app.js` (`separadorMiles`,
`separadorDecimal`) y `tools/numeros/data.js` (`DATA.lecturas`).

### 3.3 `window.App.storage` (storage.js)

Clave interna: `apptonomia:<toolId>`. Todas las funciones son tolerantes a fallos
(modo privado, storage lleno): nunca lanzan.

| Función | Firma | Descripción |
|---|---|---|
| `get` | `(toolId) → object` | Progreso guardado, o `{}` si no hay nada o hay error |
| `set` | `(toolId, data) → boolean` | Guarda JSON. `false` si falló |
| `remove` | `(toolId) → boolean` | Borra el progreso de la herramienta |
| `estrellasTotales` | `() → number` | Suma `datos.estrellas` de todas las claves `apptonomia:*` (la usa la landing) |
| `listaToolIds` | `() → string[]` | Ids de las herramientas con algo guardado, sin `'locale'` (la usa `ajustes/`) |

**Contrato de progreso**: el objeto guardado debe incluir `estrellas` (number) si la
actividad da estrellas — es lo que suma la landing. El resto del objeto es libre por
actividad. Ejemplo típico: `{ estrellas: 3, completado: { nivel1: true }, opciones: {...} }`.

### 3.4 `window.App.feedback` (feedback.js)

| Función | Firma | Descripción |
|---|---|---|
| `acierto` | `([zona]) → string` | Mensaje positivo aleatorio + sonido suave. Escribe en `zona` (elemento con `aria-live="polite"`) y le pone clase `.acierto` |
| `animo` | `([zona]) → string` | Mensaje de ánimo tras fallo (nunca punitivo) + tono neutro. Clase `.animo` |
| `celebrar` | `(mensaje, [despues])` | Capa de celebración a pantalla completa ≤ 2 s (1,2 s con reduced motion); llama a `despues` al ocultarse |

Sonidos: generados con Web Audio (sin archivos), fallan en silencio.

### 3.5 Componentes CSS (components.css)

Clases disponibles — **no duplicarlas** en los `styles.css` locales:

- Estructura: `.container` (máx. 900 px), `.pila` (columna con gap), `.fila`
  (fila con wrap), `.centrado`, `.oculto` (display none !important).
- Botones: `.btn` (primario, ≥ 64 px), `.btn-secundario`, `.btn-acierto`, `.btn-audio`
  (botón 🔊; estado `.hablando` o `aria-pressed="true"`), `.btn-opcion`
  (respuesta de opción múltiple; estados `.correcta` / `.animo`), `.back-link`.
- Juego: `.card`, `.progress-bar` + `.progress-fill` + `.progress-text`, `.stars`,
  `.feedback` (zona aria-live; estados `.acierto` / `.animo`), `.celebration`
  (la crea feedback.js), `.tool-header`, `.grid-tarjetas`.

Tokens principales (tokens.css): colores base (`--color-fondo/superficie/texto/
texto-suave/borde`), 6 pares de módulo (`--mod-*` / `--mod-*-suave`), feedback
(`--color-acierto`, `--color-animo` — naranja, nunca rojo agresivo —, `--color-estrella`),
tipografía (`--texto-base` 20px, `--texto-pequeno` 17px, `--texto-grande`, `--texto-titulo`),
táctil (`--boton-min` 64px, `--espacio` 16px, `--radio`, `--sombra`).

---

## 4. Receta: desarrollar una actividad nueva

1. **Elegir módulo y objetivo terapéutico.** Consultar la taxonomía en `PLAN.md` §4.1
   (qué áreas están cubiertas y cuáles no) y el backlog §7.
2. **Crear `tools/<slug>/`** con los 5 archivos. Copiar la cabecera `<head>` y el pie
   de scripts de una herramienta existente del mismo módulo (rutas `../../assets/...`).
3. **`data.js`**: `const DATA = {...}` — solo datos, con el formato documentado en un
   comentario de cabecera. Sin lógica ni texto (los nombres/enunciados van a `strings.js`).
   Si la actividad es tipo quiz (pregunta + varias opciones + una correcta): **máximo 3
   opciones** y cada opción lleva su propia clave de explicación (por qué es correcta o
   incorrecta) — ver regla 11 de `CLAUDE.md`. Además, una **pista** para el primer
   fallo (método socrático, regla 12): redirige a la pista/dato ya visible sin dar
   la respuesta; solo en el segundo fallo se muestra la explicación completa.
   Si la actividad tiene niveles: cada nivel cambia **una sola** variable de
   dificultad respecto al anterior (regla 13, carga cognitiva) — documentar
   cuál en el comentario de cabecera de `data.js`.
4. **`strings.js`**: `App.i18n.register({ es: {...}, en: {...} })` con los mismos textos
   en ambos idiomas (ver §3.2b). Los números grandes y el dinero necesitan cuidado con
   la escala y los separadores, no solo traducción literal.
5. **`app.js`**: IIFE con `'use strict'`. Leer progreso con `App.storage.get('<slug>')`
   al arrancar, guardar con `set` en cada cambio relevante. Usar `App.utils.shuffle`,
   `App.tts.speak`, `App.feedback.acierto/animo/celebrar`, `App.i18n.t/pick`.
6. **`styles.css`**: solo lo específico (< 150 líneas), usando tokens. El acento de la
   herramienta es el color de su módulo.
7. **Cumplir las 13 reglas de accesibilidad de `CLAUDE.md`** (Lectura Fácil en ambos
   idiomas, botones ≥ 64 px, audio 🔊 en textos importantes, sin presión ni castigo,
   reduced motion, teclado + foco visible, ARIA, máx. 4–6 opciones por pantalla, máx.
   3 opciones + explicación en preguntas tipo quiz, pista socrática en el primer fallo,
   progresión de un solo cambio por nivel).
8. **Registrar la actividad**:
   - Tarjeta en `site/index.html`, dentro de la `<section>` de su módulo
     (patrón `<a class="tarjeta">` con picto, nombre y detalle corto, con `data-i18n`).
   - Los 5 archivos en la lista `ARCHIVOS` de `sw.js` **y subir `VERSION`** (§7).
   - Fila en la tabla de su módulo en `equipo/index.html` (qué hace / qué trabaja).
   - Estado en `CLAUDE.md` y catálogo en `PLAN.md` §4 si procede.
9. **Verificar** (checklist de `PLAN.md` §5 Fase 5): jugable sin errores de consola en
   ambos idiomas, progreso persiste tras recargar y al cambiar de idioma, audio
   funciona, navegable por teclado, botones ≥ 64 px reales, responsive a 360 px.
10. **Commit** pequeño, uno por actividad, mensaje en inglés.

## 5. Receta: añadir un módulo terapéutico nuevo (área)

Solo si el área no encaja en los 6 módulos existentes (comprobar `PLAN.md` §4.1):

1. Añadir el par de tokens en `assets/css/tokens.css`:
   `--mod-<nombre>: <color AA sobre blanco>;` y `--mod-<nombre>-suave: <fondo claro>;`.
   Verificar contraste AA del color sobre `--color-superficie`.
2. Añadir la `<section class="modulo">` en `site/index.html` con
   `style="--acento: var(--mod-<nombre>); --acento-suave: var(--mod-<nombre>-suave);"`,
   un `<h2>` con emoji + nombre en Lectura Fácil, y su `grid-tarjetas`.
3. Documentar el módulo: tabla en `PLAN.md` §4, tarjeta-artículo en `equipo/index.html`,
   lista de colores en `CLAUDE.md` ("Cómo añadir una actividad nueva") y §2.2 de este SPEC.
4. Crear la primera actividad del módulo (receta §4).

## 6. Contratos transversales

- **Aislamiento**: una actividad nunca lee la clave de storage de otra. El único
  acoplamiento permitido es `estrellasTotales()` desde la landing.
- **El error nunca castiga**: no restar estrellas ni progreso; el fallo produce
  `animo()` y se puede reintentar sin límite.
- **Sin cronómetros visibles**: medir tiempos internamente está permitido (dato en
  storage), mostrarlos como presión no.
- **Textos de la UI**: español de España e inglés, Lectura Fácil en los dos, sin
  lenguaje clínico ("paciente", "terapia", "discapacidad"). El lenguaje clínico solo
  se permite en `equipo/` y en la documentación del repo. Todo texto vive en
  `strings.js` (nunca hardcodeado en `app.js` ni como único contenido de un nodo HTML
  sin `data-i18n`) — ver §3.2b.
- **Teclados en pantalla decorativos** (keyboard-typing): elementos visuales con
  `pointer-events: none`; la entrada real es el teclado físico. **Excepción
  deliberada**: el tipo de teclado `movil` (`DATA.layouts.movil`, clase CSS
  `.tocable`) sí se puede tocar, porque en un móvil/tablet no hay teclado físico
  que pulsar — la pantalla es la única entrada real. Se detecta y se preselecciona
  solo (`App.utils.esTactil()`, basado en `matchMedia('(hover:none) and
  (pointer:coarse)')`) sin que el usuario tenga que elegir nada; sigue pudiéndose
  cambiar a mano con los mismos botones de tipo de teclado. Enseña a escribir con
  los dos pulgares (mitad izquierda/derecha de cada fila) para trabajar
  lateralidad, no el método de mecanografía de 8 dedos de los otros tipos.

## 7. PWA y service worker

- `sw.js` es **cache-first** del app shell. Contrato al tocar archivos:
  1. Archivo nuevo → añadirlo a la lista `ARCHIVOS`.
  2. Cualquier cambio en archivos cacheados → **subir `VERSION`** (`apptonomia-vNN`),
     si no, los usuarios con la PWA instalada no reciben el cambio.
- El fetch handler cachea también recursos nuevos del mismo origen bajo demanda y
  hace fallback a `site/index.html` sin conexión.
- **Aviso de actualización** (`site/index.html`): como el SW hace `skipWaiting()` +
  `clients.claim()` sin preguntar, la landing detecta el cambio de controlador
  (`navigator.serviceWorker.oncontrollerchange`) y muestra un aviso con botón
  "Actualizar ahora" (recarga la página). Distingue la primera instalación (sin
  controlador previo: no se avisa) de una actualización real (ya había uno).
  Solo en la landing, no en cada herramienta.
- `manifest.json`: `display: standalone`, `start_url` en `site/index.html`,
  iconos 192/512 en `assets/img/`.
- Para comprobar instalabilidad de forma objetiva: DevTools → Lighthouse →
  categoría "PWA" (criterio de aceptación de `PLAN.md` Fase 4).

## 8. Rutas ocultas

Páginas para adultos (familia/profesorado/agente IA) que gestionan el dispositivo,
no para la persona usuaria. Reglas comunes a todas: **no enlazarlas nunca** desde
`site/index.html` ni desde las actividades (acceso solo por URL conocida), llevan
`<meta name="robots" content="noindex, nofollow">`, y son las únicas páginas del
producto donde se permite lenguaje clínico o de administración del dispositivo.

### 8.1 `/equipo/`

Guía para familias, terapeutas y profesorado + nota técnica para agentes de IA
sobre el proyecto, el diseño y el catálogo de actividades. Mantenerla actualizada
al añadir actividades o módulos.

### 8.2 `/ajustes/`

Ver y borrar lo guardado en `localStorage` de este navegador. Dos acciones,
cada una con confirmación en dos pasos (un clic pide confirmar, el segundo
borra — mismo patrón que "Borrar mi progreso" de `keyboard-typing`):

- **Restablecer datos de la persona**: `App.storage.remove('locale')` +
  vaciar el campo `nombre` de las herramientas que lo piden (hoy
  `keyboard-typing` y `piano-teclas` — mantener esta lista en
  `ajustes/app.js` si una herramienta nueva pide un nombre). El progreso
  de todas las actividades se conserva.
- **Restablecer toda la aplicación**: borra todas las claves `apptonomia:*`
  (`App.storage.listaToolIds()` + `remove('locale')`). Equivale a un
  primer uso.

No usa `App.i18n.register()` (página en español fijo, como `equipo/`), pero sí
lee `App.i18n.locale()` para mostrar el idioma activo en el estado.

## 9. Ejecución y despliegue

```bash
# Desarrollo local (elegir uno)
python -m http.server 8080          # → http://localhost:8080/site/index.html
npx serve .                         # alternativa si no hay Python

# Despliegue (Firebase Hosting, proyecto "apptonomia")
npm run firebase:hosting            # canal de preview (para probar)
npm run firebase:deploy             # producción
```

En sesiones **remote-control** (sin navegador local) la única forma de probar es el
canal de preview de Firebase — avisar al usuario antes de desplegar (ver `CLAUDE.md`).

No hay tests automatizados ni linter: la verificación es el checklist manual de
`PLAN.md` §5 Fase 5. Comprobación mínima de sintaxis: `node --check tools/<slug>/app.js`.
