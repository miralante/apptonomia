# Apptonomia — Plan de Refactorización y Ampliación

> Aplicación web interactiva, ligera y de bajo coste para personas con **discapacidad intelectual**.
> Objetivo: ejercicios de terapia ocupacional de forma **autónoma** desde el navegador,
> promoviendo independencia, estimulación cognitiva y habilidades de la vida diaria.

Este plan está escrito para ser ejecutado **paso a paso por un modelo LLM sencillo**:
cada fase tiene tareas concretas, archivos exactos y criterios de aceptación verificables.
No se requiere build step, frameworks ni backend. Solo HTML + CSS + JS vanilla.

---

## 1. Diagnóstico de lo existente

### Lo que ya hay (se conserva)

| Herramienta | Carpeta | Estado |
|---|---|---|
| Teclado Pro | `tools/keyboard-typing/` | Funcional, guarda progreso en localStorage |
| Club de la Comedia | `tools/comedy-club/` | Funcional, 100 chistes, audio TTS |
| Dichos de España | `tools/dichos/` | Funcional, 100 dichos, audio TTS |
| Adivinanzas | `tools/adivinanzas/` | Funcional, 100 adivinanzas, audio TTS |
| Landing | `site/` | Funcional, tema oscuro neón |

### Problemas detectados (a corregir en la refactorización)

1. **Código duplicado**: cada herramienta repite ~380 líneas de CSS y las mismas
   funciones JS (shuffle, TTS, progreso, celebración). Un cambio hay que hacerlo 4 veces.
2. **Datos mezclados con lógica**: los 100 chistes/dichos/adivinanzas están dentro de
   `app.js`. Deben ir en un `data.js` separado para poder ampliarlos sin tocar lógica.
3. **Progreso no persistente**: solo Teclado Pro usa localStorage. En los 3 juegos,
   al cerrar el navegador se pierden las estrellas.
4. **Accesibilidad cognitiva insuficiente** (lo más importante):
   - Tema oscuro con neón y mucho texto de marketing: distrae y dificulta la lectura.
   - Textos largos y metáforas ("sin excusas", "tu progreso, tu camino") — no cumplen
     pautas de **Lectura Fácil**.
   - Botones y tipografía pequeños para usuarios con dificultades motoras finas.
   - Sin ARIA consistente, sin soporte `prefers-reduced-motion`, sin navegación por teclado garantizada.
   - Emojis como única iconografía: mejor pictogramas grandes y consistentes (estilo ARASAAC).
5. **PWA no implementada**: se declara "PWA ready" pero no hay `manifest.json` ni service worker.
   Sin offline no hay verdadera autonomía.
6. **Landing orientada a marketing**, no al usuario final con discapacidad intelectual:
   demasiadas secciones, CTAs y texto. Debe ser un menú simple de actividades.

---

## 2. Principios de diseño (obligatorios en todo el proyecto)

Estos principios mandan sobre cualquier otra decisión. Si una tarea entra en conflicto
con ellos, ganan los principios.

1. **Lectura Fácil**: frases cortas, una idea por frase, vocabulario cotidiano,
   sin metáforas, sin ironía en la interfaz (el humor solo dentro de las actividades que lo trabajan).
2. **Una acción por pantalla**: el usuario nunca debe decidir entre más de 4–6 opciones visibles.
3. **Objetivos táctiles grandes**: botones mínimo **64×64 px**, separación mínima 16 px.
4. **Tipografía grande**: base 20 px, títulos 28–36 px, fuente redonda y legible (Atkinson Hyperlegible o Nunito).
5. **Tema claro por defecto** con alto contraste (WCAG AA mínimo, AAA cuando sea posible).
   Modo oscuro opcional, nunca neón como color de texto.
6. **Audio en todo**: cada texto importante tiene botón 🔊 (Web Speech API, es-ES, velocidad 0.9).
7. **Sin presión**: sin cronómetros visibles, sin puntuación negativa, sin "game over".
   El error nunca se castiga: se anima a intentarlo otra vez.
8. **Refuerzo positivo inmediato**: celebración visual + sonora al acertar. Breve (≤2 s) y desactivable.
9. **`prefers-reduced-motion`**: todas las animaciones se desactivan si el sistema lo pide.
10. **Autonomía**: la app funciona offline (PWA), sin login, sin coste, sin datos personales.
    Todo el progreso se guarda solo en `localStorage`.

---

## 3. Estructura de proyecto objetivo

```
apptonomia/
├── CLAUDE.md                  # Guía para trabajar con Claude (ya creada)
├── PLAN.md                    # Este plan
├── README.md                  # Documentación breve
├── package.json
├── index.html                 # Redirección a site/index.html
├── manifest.json              # PWA
├── sw.js                      # Service worker (cache offline)
├── assets/                    # ← NÚCLEO COMPARTIDO (nuevo)
│   ├── css/
│   │   ├── tokens.css         # Variables: colores, tipografía, espaciado
│   │   ├── base.css           # Reset + estilos base accesibles
│   │   └── components.css     # Botones, tarjetas, barra de progreso, modales
│   ├── js/
│   │   ├── tts.js             # Texto a voz (speak, stop)
│   │   ├── storage.js         # Progreso en localStorage (get/set por herramienta)
│   │   ├── feedback.js        # Celebración, sonidos, mensajes de ánimo
│   │   └── utils.js           # shuffle, helpers DOM
│   └── img/                   # Pictogramas SVG compartidos
├── site/
│   ├── index.html             # Menú principal simple (rediseñado)
│   └── styles.css             # Solo estilos propios de la landing
└── tools/                     # Una carpeta por actividad
    ├── keyboard-typing/       # EXISTENTE (refactor ligero)
    ├── comedy-club/           # EXISTENTE (refactor)
    ├── dichos/                # EXISTENTE (refactor)
    ├── adivinanzas/           # EXISTENTE (refactor)
    ├── atrapa/                # NUEVO — Módulo 1: Coordinación oculomanual
    ├── rutinas/               # NUEVO — Módulo 2: Secuenciación y autonomía
    ├── parejas/               # NUEVO — Módulo 3: Memoria y funciones ejecutivas
    └── emociones/             # NUEVO — Módulo 4: Gestión emocional
```

**Anatomía estándar de una herramienta** (obligatoria para toda herramienta nueva o refactorizada):

```
tools/<slug>/
├── index.html    # Usa assets/css/*.css + styles.css propio mínimo
├── app.js        # Solo lógica. Importa módulos compartidos de assets/js/
├── data.js       # Solo datos (const DATA = [...]) — sin lógica
└── styles.css    # Solo lo específico de esta herramienta (< 150 líneas)
```

Los módulos compartidos se cargan con `<script src="../../assets/js/tts.js"></script>` (sin ES modules,
para máxima compatibilidad y simplicidad con `file://`).

---

## 4. Catálogo de módulos y actividades

La landing agrupa las herramientas en **6 módulos** (áreas terapéuticas), derivados de la
taxonomía completa de objetivos (ver §4.1). Cada módulo tiene un color y pictograma propios.
Estructura pensada para añadir actividades sin rediseñar nada.

### Módulo 1 — Coordinación y motricidad (azul `--mod-coordinacion`)
Cubre: coordinación ojo-mano, motricidad fina, escritura y copia, dibujo.

| Actividad | Carpeta | Estado |
|---|---|---|
| Atrapa — pulsar un objetivo que cambia de posición | `tools/atrapa/` | ✔ Hecha |
| Teclado — mecanografía guiada | `tools/keyboard-typing/` | ✔ Hecha |
| Trazos — repasar formas y letras con el dedo/ratón | `tools/trazos/` | ✔ Hecha |
| Colorear — pintar dibujos por zonas | `tools/colorear/` | ✔ Hecha |
| Piano — tocar el teclado del ordenador como un piano (libre, seguir melodía, Simón dice, canciones, compositor) | `tools/piano-teclas/` | ✔ Hecha |

### Módulo 2 — Autonomía y hogar (verde `--mod-secuencia`)
Cubre: AVD, aseo, tareas del hogar, organización, situaciones cotidianas, gestión del tiempo.

| Actividad | Carpeta | Estado |
|---|---|---|
| Mis Rutinas — rutinas diarias paso a paso | `tools/rutinas/` | ✔ Hecha |
| La Casa — ordenar los pasos de una tarea del hogar (hacer la cama, poner la lavadora) | `tools/la-casa/` | ✔ Hecha |
| Situaciones — ¿qué haces si…? (situaciones cotidianas con opciones) | `tools/situaciones/` | ✔ Hecha |
| Chat Seguro — chats simulados para practicar respuestas ante manipulación en línea | `tools/chat-seguro/` | ✔ Hecha |
| Chat Acoso — chats simulados para reconocer el acoso entre iguales (insultos, exclusión, rumores, fotos, amenazas, presión de grupo) y saber cómo actuar | `tools/chat-acoso/` | ✔ Hecha |
| ¿Lo publico? — decidir qué es más seguro en situaciones de redes sociales (fotos con datos personales, perfiles falsos, retos virales, bulos, estafas, privacidad) | `tools/lo-publico/` | ✔ Hecha |
| Partes del Día — clasificar tareas diarias en Mañana/Tarde/Noche, listas se van construyendo por caja | `tools/partes-del-dia/` | ✔ Hecha |
| ¿Qué hago primero? — priorización: elegir la tarea más urgente entre varias posibles | `tools/que-primero/` | ✔ Hecha |
| ¿Qué necesito? — planificación: elegir qué preparar antes de una tarea u objetivo | `tools/que-necesito/` | ✔ Hecha |
| ¿Dónde lo guardo? — organización: clasificar objetos por su sitio de almacenaje (armario/nevera/mochila) | `tools/donde-lo-guardo/` | ✔ Hecha |
| Lista de Tareas — ordenar tareas mixtas de casa, trabajo y cuidado personal en su orden lógico del día | `tools/lista-tareas/` | ✔ Hecha |

### Módulo 3 — Memoria y atención (naranja `--mod-memoria`)
Cubre: memoria visual/auditiva/verbal, corto plazo, atención sostenida, percepción global y de detalles.

| Actividad | Carpeta | Estado |
|---|---|---|
| Parejas — emparejar cartas idénticas | `tools/parejas/` | ✔ Hecha |
| Diferencias — encontrar las diferencias entre dos escenas | `tools/diferencias/` | ✔ Hecha |
| ¿Qué falta? — memorizar objetos y detectar cuál desaparece | `tools/que-falta/` | ✔ Hecha |
| Ecos — repetir secuencias de sonidos/colores (memoria auditiva y ritmo) | `tools/ecos/` | ✔ Hecha |

### Módulo 4 — Razonamiento y matemáticas (teal `--mod-razonamiento`, color NUEVO)
Cubre: patrones, deducción, inferencia, ordenación, priorización, números, operaciones
cotidianas, dinero, horas y fechas, medidas, representaciones gráficas.

| Actividad | Carpeta | Estado |
|---|---|---|
| Adivinanzas — inferencia y deducción | `tools/adivinanzas/` | ✔ Hecha (se mueve aquí en Fase 6) |
| Patrones — completar series (formas, colores, números) | `tools/patrones/` | ✔ Hecha |
| El Monedero — pagar con euros y comprobar el cambio | `tools/monedero/` | ✔ Hecha |
| El Reloj — leer horas y asociarlas a momentos del día | `tools/reloj/` | ✔ Hecha |
| ¿Qué no encaja? — detectar el elemento que no pertenece al grupo | `tools/que-no-encaja/` | ✔ Hecha |
| Historias — ordenar viñetas de una historia en secuencia temporal | `tools/historias/` | ✔ Hecha |
| Puzzle — recomponer una imagen tocando piezas y su sitio | `tools/puzzle/` | ✔ Hecha |
| La Oca — juego de la oca en solitario (dado y casillas) | `tools/oca/` | ✔ Hecha |
| Tres en Raya — lógica y anticipación contra un rival amable (niveles: azar → remata → bloquea) | `tools/tres-en-raya/` | ✔ Hecha |
| Sudoku Visual — sudoku 4×4 con pictos, sin repetir en fila/columna/caja (niveles: 4/6/8 huecos) | `tools/sudoku-visual/` | ✔ Hecha |

### Módulo 5 — Lenguaje y comunicación (frambuesa `--mod-lenguaje`, color NUEVO)
Cubre: vocabulario, categorías, comprensión, quién/qué/cómo/dónde/porqué, frases hechas,
ideas principales, léxico comprensivo y expresivo, ortografía.

| Actividad | Carpeta | Estado |
|---|---|---|
| Chistes (Club de la Comedia) — comprensión del humor | `tools/comedy-club/` | ✔ Hecha (se mueve aquí en Fase 6) |
| Dichos — lenguaje figurado | `tools/dichos/` | ✔ Hecha (se mueve aquí en Fase 6) |
| Categorías — clasificar palabras/pictos (animales, comida, ropa…) | `tools/categorias/` | ✔ Hecha |
| La Frase — leer una frase y responder quién / qué / dónde | `tools/la-frase/` | ✔ Hecha |
| Palabras — vocabulario temático con imagen, texto y audio | `tools/palabras/` | ✔ Hecha |

### Módulo 6 — Emociones y relaciones (morado `--mod-emocional`)
Cubre: reconocimiento de sentimientos, autocontrol, autoestima, gestión del estrés,
gestión de conflictos, respiración, conciencia interior.

| Actividad | Carpeta | Estado |
|---|---|---|
| ¿Cómo me siento? — identificador de emociones + registro semanal | `tools/emociones/` | ✔ Hecha |
| Calma — sesiones guiadas de respiración y relajación | `tools/calma/` | ✔ Hecha |
| Entre Amigos — reconocer emociones en otros y resolver conflictos sencillos | `tools/entre-amigos/` | ✔ Hecha |

### 4.1 Mapa de cobertura de la taxonomía terapéutica

Estado de cada área de la taxonomía de objetivos:
✔ = ya cubierta · ⏳ = en backlog (con su ola) · ✖ = fuera de alcance de una web autónoma.

| Área | Estado | Dónde |
|---|---|---|
| Montar piezas (puzzles, configuraciones) | ✔ | `puzzle` |
| Razonamiento: patrones | ✔ | `patrones` |
| Razonamiento: deducción, inferencia, adivinación | ✔ | `adivinanzas` |
| Razonamiento: ordenación de ideas, priorización | ✔ | `historias`, `la-casa` |
| Razonamiento: coherencia temática | ✔ | `que-no-encaja` |
| Razonamiento: codificación/decodificación | ⏳ Ola 3 | `patrones` nivel avanzado (símbolo→letra) |
| Atención | ✔ | `diferencias`, `que-falta` |
| Espacio / tiempo, orientación espacial | ✔ | `reloj`, `historias`, `puzzle` |
| Memoria visual / corto plazo | ✔ | `parejas`, `que-falta` |
| Memoria auditiva / verbal | ✔ | `ecos` |
| Lenguaje: vocabulario, categorías | ✔ | `categorias`, `palabras` |
| Lenguaje: comprensión, quién/qué/dónde | ✔ | `la-frase` |
| Lenguaje: frases hechas, refranes, chistes | ✔ | `dichos`, `comedy-club` |
| Lenguaje: ortografía, escritura y copia | ✔ | `keyboard-typing`, `trazos` |
| Interacción social: sentimientos, conflictos | ✔ | `emociones`, `situaciones`, `entre-amigos` |
| Seguridad en internet: manipulación, datos, fotos | ✔ | `chat-seguro`, `chat-acoso`, `lo-publico` |
| Matemáticas: operaciones, dinero, medidas | ✔ | `monedero`, `patrones` (series numéricas) |
| Tiempo, fechas y horas | ✔ | `reloj` |
| Musicalidad y ritmo | ✔ | `ecos` (secuencias rítmicas), `piano-teclas` (tocar melodías) |
| Hogar: aseo, tareas, organización | ✔ | `rutinas`, `la-casa` |
| Creatividad, dibujar y colorear | ✔ | `colorear`, `trazos` |
| Percepción global y de detalles | ✔ | `diferencias` |
| Respiración, conciencia interior | ✔ | `emociones` (respiración), `calma` |
| Coordinación ojo-mano, motricidad fina | ✔ | `atrapa`, `keyboard-typing`, `trazos` |
| Juegos de mesa (damas, oca, ajedrez) | ✔ | `oca` (turnos simples) |
| Motricidad gruesa, coordinación postural/corporal | ✖ | Requiere espacio físico y acompañante |
| Trabajo en equipo | ✖ | La app es individual, sin conexión entre usuarios |
| Expresión oral evaluada | ✖ por ahora | El reconocimiento de voz del navegador no es fiable aquí |

---

## 5. Fases de ejecución

Ejecutar en orden. **No empezar una fase sin cumplir los criterios de la anterior.**

---

### FASE 0 — Preparación (30 min)

1. Si no existe repositorio git: `git init` y commit inicial con el estado actual.
2. Crear las carpetas: `assets/css/`, `assets/js/`, `assets/img/`.
3. Crear `index.html` en la raíz con `<meta http-equiv="refresh" content="0; url=site/index.html">`.

**Criterio de aceptación**: commit "estado inicial" existe; carpetas creadas.

---

### FASE 1 — Núcleo compartido (assets/)

#### 1.1 `assets/css/tokens.css`
Variables CSS. Contenido de referencia:

```css
:root {
  /* Colores base — tema claro accesible */
  --color-fondo: #FAF7F2;
  --color-superficie: #FFFFFF;
  --color-texto: #1A1A2E;
  --color-texto-suave: #4A4A68;
  /* Colores de módulo */
  --mod-coordinacion: #1B6CA8;   /* azul */
  --mod-secuencia: #2E7D32;      /* verde */
  --mod-memoria: #C05621;        /* naranja */
  --mod-emocional: #6B3FA0;      /* morado */
  /* Feedback */
  --color-acierto: #2E7D32;
  --color-animo: #C05621;        /* nunca rojo agresivo para el error */
  /* Tipografía */
  --fuente: 'Atkinson Hyperlegible', 'Nunito', system-ui, sans-serif;
  --texto-base: 20px;
  --texto-grande: 28px;
  --texto-titulo: 36px;
  /* Táctil */
  --boton-min: 64px;
  --espacio: 16px;
  --radio: 16px;
}
```

#### 1.2 `assets/css/base.css`
Reset simple, `font-size` base, foco visible (`:focus-visible` con contorno 3 px),
`@media (prefers-reduced-motion: reduce)` que anula animaciones y transiciones.

#### 1.3 `assets/css/components.css`
Clases reutilizables: `.btn` (≥64 px, texto grande), `.btn-audio`, `.card`,
`.progress-bar`, `.celebration`, `.stars`, `.back-link` (botón "← Volver" grande, siempre arriba a la izquierda).

#### 1.4 `assets/js/utils.js`
```js
// Expone window.App.utils
function shuffle(array) { /* Fisher-Yates, copia */ }
function $(sel) { return document.querySelector(sel); }
```

#### 1.5 `assets/js/tts.js`
```js
// Expone window.App.tts.speak(texto) y .stop()
// SpeechSynthesisUtterance con lang 'es-ES', rate 0.9
// Cancela lectura anterior antes de hablar
```

#### 1.6 `assets/js/storage.js`
```js
// Expone window.App.storage
// get(toolId)  -> objeto de progreso o {}
// set(toolId, data) -> guarda JSON en localStorage clave 'apptonomia:<toolId>'
// Siempre envuelto en try/catch (modo privado puede fallar)
```

#### 1.7 `assets/js/feedback.js`
```js
// Expone window.App.feedback
// acierto()  -> mensaje "¡Muy bien!" + animación breve + sonido suave (Web Audio, opcional)
// animo()    -> mensaje "Casi. ¡Inténtalo otra vez!" — nunca punitivo
// Respeta prefers-reduced-motion
```

**Criterios de aceptación Fase 1**
- Los 7 archivos existen y no dan errores en consola al cargarlos en una página en blanco.
- `App.tts.speak('hola')` reproduce voz en español.
- `App.storage.set('test',{a:1})` y `App.storage.get('test')` funcionan.

---

### FASE 2 — Refactor de herramientas existentes

Aplicar a `comedy-club`, `dichos` y `adivinanzas` (una por una, commit por herramienta):

1. **Extraer datos**: mover el array de preguntas a `data.js` (`const DATA = [...]`).
2. **Sustituir funciones locales** (shuffle, TTS, celebración) por las de `assets/js/`.
3. **Persistir progreso**: estrellas y preguntas superadas con `App.storage`.
4. **Adaptar estilos**: cargar `tokens.css`, `base.css`, `components.css`;
   dejar en `styles.css` local solo lo específico. Migrar a tema claro accesible.
5. **Accesibilidad**: botones ≥64 px, texto base 20 px, `aria-live="polite"` en feedback,
   navegación completa por teclado (Tab + Enter), foco visible.
6. **Lectura Fácil**: revisar todos los textos de la interfaz (instrucciones, botones, mensajes).

Para `keyboard-typing`: refactor ligero — solo puntos 4, 5 y 6 (su lógica y storage ya funcionan).

**Criterios de aceptación Fase 2** (por herramienta)
- Jugable de principio a fin sin errores en consola.
- Cerrar y reabrir el navegador conserva las estrellas.
- `styles.css` local < 150 líneas.
- Todos los botones alcanzables con Tab y activables con Enter.

---

### FASE 3 — Nuevos módulos (una herramienta por sub-fase, commit cada una)

Todas siguen la anatomía estándar (§3) y los principios (§2).

#### 3.1 `tools/atrapa/` — Atrapa el objetivo (Coordinación oculomanual)

- **Pantalla inicial**: título, instrucción en Lectura Fácil ("Toca el círculo. Se mueve cuando lo tocas."),
  botón 🔊, botón grande "Empezar", selector de tamaño del objetivo (Grande / Mediano / Pequeño = niveles).
- **Juego**: un objetivo circular colorido (SVG animado suave, p. ej. una estrella o pelota)
  aparece en posición aleatoria dentro del área de juego. Al pulsarlo: celebración breve,
  +1 estrella, se recoloca en otra posición aleatoria (mínimo a 30 % de distancia).
- **Sesión**: 10 toques = ronda completada → pantalla de celebración con estrellas y
  botones "Jugar otra vez" / "Volver al menú".
- **Progresión**: tamaños 120 px / 90 px / 64 px. Nunca menor de 64 px.
- **Datos guardados**: rondas completadas por nivel, mejor precisión (toques acertados/total).
- **Sin cronómetro visible.** Opcionalmente registrar tiempo medio de reacción en storage
  (solo dato interno, nunca mostrado como presión).

#### 3.2 `tools/rutinas/` — Mis Rutinas (Secuenciación y autonomía)

- **Datos** (`data.js`): 4 rutinas predefinidas, cada una con 4–7 pasos.
  Cada paso: `{ texto: "Me lavo las manos", picto: "🧼" (o SVG), audio: true }`.
  Rutinas iniciales: "Por la mañana", "Antes de comer", "Por la noche", "Salir de casa".
- **Pantalla inicial**: tarjetas grandes, una por rutina, con pictograma y nombre.
- **Vista de rutina**: pasos en vertical, uno resaltado a la vez. Cada paso tiene:
  pictograma grande, texto en Lectura Fácil, botón 🔊 y botón grande "✔ Hecho".
  Al marcar "Hecho": check verde animado, se avanza al siguiente paso.
- **Final**: al completar todos los pasos, celebración + "¡Rutina completada!".
- **Persistencia**: estado de la rutina del día (se reinicia automáticamente cada día
  comparando la fecha guardada con la actual).
- **Ampliable**: el formato de `data.js` debe permitir añadir rutinas nuevas solo
  añadiendo objetos al array (documentar el formato en comentario cabecera).

#### 3.3 `tools/parejas/` — Parejas (Memoria y funciones ejecutivas)

- **Niveles**: Fácil = 3 parejas (6 cartas), Medio = 4 parejas, Difícil = 6 parejas. Se elige al inicio.
- **Cartas**: pictogramas/emojis grandes de categorías cotidianas (animales, comida, objetos de casa).
  Carta mínima 90×90 px, rejilla con separación amplia.
- **Mecánica**: destapar 2 cartas. Si coinciden: quedan descubiertas + refuerzo positivo.
  Si no: mensaje de ánimo neutro y se vuelven a tapar tras 1,5 s.
- **Sin límite de intentos ni tiempo.** Contador solo de parejas encontradas ("2 de 4").
- **Final**: celebración + estrellas (1 por nivel fácil, 2 medio, 3 difícil) + repetir/volver.
- **Persistencia**: estrellas acumuladas y niveles completados.

#### 3.4 `tools/emociones/` — ¿Cómo me siento? (Gestión emocional)

- **Pantalla única principal**: pregunta "¿Cómo te sientes hoy?" con audio automático opcional.
  6 emociones básicas como botones muy grandes (mín. 120 px) con cara pictográfica y nombre:
  Contento, Triste, Enfadado, Asustado, Cansado, Tranquilo.
- **Respuesta adaptada** al seleccionar una emoción:
  - Validación verbal y sonora: "Estás contento. ¡Qué bien!" / "Estás triste. No pasa nada. A veces nos sentimos así."
  - Pantalla de respuesta con color e ilustración acordes (colores calmados para emociones difíciles).
  - **Sugerencia de regulación** en Lectura Fácil: p. ej. para "Enfadado" → ejercicio de respiración
    guiada visual (círculo que crece y decrece, "Coge aire… suelta el aire…", 3 ciclos).
- **Registro**: guarda la emoción con fecha en storage → vista simple "Mi semana" con
  los pictogramas de los últimos 7 días (autoconocimiento, y útil si un profesional lo consulta).
- **Nunca** juzgar la emoción ("está mal enfadarse" ❌). Todas las emociones son válidas.

**Criterios de aceptación Fase 3** (por herramienta)
- Cumple la anatomía estándar y usa los módulos compartidos.
- Usable solo con toques/clics (sin teclado obligatorio) y también navegable por teclado.
- Todos los textos con audio disponible.
- Sin errores en consola; progreso persiste tras recargar.

---

### FASE 4 — Nueva landing + PWA

#### 4.1 Rediseño de `site/index.html`
- Estructura: saludo breve ("Hola. ¿Qué quieres hacer hoy?" + 🔊) y las actividades
  agrupadas por los 4 módulos (§4), cada módulo con su color y pictograma.
- Tarjetas grandes (mín. 160 px de alto), pictograma dominante, nombre corto, sin párrafos largos.
- Eliminar: hero de marketing, sección "info", CTA final, footer con metáforas.
  La landing es un **menú**, no una web promocional.
- Mostrar estrellas totales acumuladas (leídas de storage) como refuerzo, sin rankings.

#### 4.2 PWA
- `manifest.json`: nombre, iconos (192/512 px, generar SVG→PNG), `display: standalone`,
  colores de tema, `start_url: ./site/index.html`.
- `sw.js`: cache-first de todos los archivos estáticos (app shell). Versión de caché
  incrementable en una constante.
- Registrar el SW desde la landing y las herramientas.

**Criterios de aceptación Fase 4**
- Lighthouse: Accesibilidad ≥ 95, PWA instalable.
- Con el servidor apagado tras una primera visita, la app sigue funcionando (offline).
- La landing no contiene ningún párrafo de más de 2 frases.

---

### FASE 5 — Verificación final

> Estado 2026-07-07: lo automatizable se verifica con Playwright en cada cambio (consola limpia, rondas completas, i18n, persistencia). Sigue pendiente la pasada manual: móvil real, contraste AA sistemático y revisión humana de Lectura Fácil.

Checklist manual completo (ejecutar y anotar resultado):

- [ ] Cada herramienta jugable de principio a fin sin errores de consola.
- [ ] Progreso persiste en todas las herramientas tras cerrar el navegador.
- [ ] Audio funciona en todas las pantallas con texto.
- [ ] Navegación por teclado completa (Tab/Enter) en todo el sitio.
- [ ] Botones ≥ 64 px reales (medir con DevTools).
- [ ] Contraste AA verificado (herramienta: DevTools > Lighthouse o WebAIM).
- [ ] `prefers-reduced-motion` desactiva animaciones (probar con emulación de DevTools).
- [ ] Funciona en móvil (responsive, viewport 360 px) y escritorio.
- [ ] Textos revisados con criterios de Lectura Fácil.
- [ ] PWA instalable y funcional offline.
- [ ] Actualizar `README.md` y `SPEC.md` con la estructura final.

---

### FASE 6 — Reorganización en 6 módulos (tras completar Fases 0–5)

1. Añadir a `assets/css/tokens.css` los dos colores nuevos:
   ```css
   --mod-razonamiento: #00695C;        /* teal */
   --mod-razonamiento-suave: #E0F0EE;
   --mod-lenguaje: #B3446C;            /* frambuesa */
   --mod-lenguaje-suave: #F7E8EE;
   ```
2. Reorganizar `site/index.html` en los 6 módulos del §4 (mismo patrón de secciones con
   `--acento`/`--acento-suave`). Mover `adivinanzas` a Razonamiento y
   `comedy-club`/`dichos` a Lenguaje.
3. Actualizar los `styles.css` de `adivinanzas` (→ `--mod-razonamiento`) y de
   `comedy-club`/`dichos` (→ `--mod-lenguaje`).
4. Subir la versión de caché en `sw.js`.
5. Actualizar CLAUDE.md (lista de módulos en "Cómo añadir una actividad nueva").

**Criterio de aceptación**: landing con 6 módulos; ninguna herramienta rota; colores AA.

---

### FASE 7 — Ola 1 de nuevas actividades (una por sub-fase, en este orden)

Todas siguen la anatomía estándar (§3) y los principios (§2). Persisten `{estrellas, ...}`.

#### 7.1 `tools/patrones/` — Patrones (Razonamiento)
- **Mecánica**: se muestra una serie con un hueco (p. ej. 🔵🔴🔵🔴🔵❓) y 3 opciones grandes.
  Elegir la que continúa la serie.
- **Niveles**: 1) colores/formas AB, 2) ABC y tamaños, 3) series numéricas simples (+1, +2, dobles).
- **Datos**: `data.js` con series predefinidas por nivel `{ serie: [...], opciones: [...], correcta }`.
  Mínimo 20 por nivel.
- **Ronda**: 8 series. Estrellas por nivel (1/2/3).

#### 7.2 `tools/diferencias/` — Diferencias (Atención / Percepción)
- **Mecánica**: dos escenas lado a lado (composición de emojis/SVG posicionados, NO fotos:
  así las diferencias se generan por datos). Tocar en la escena derecha lo que es distinto.
- **Datos**: `data.js` con escenas `{ fondo, objetos: [{picto, x, y, cambiado?}] }`;
  3–5 diferencias por escena; objetos ≥ 56 px con zona táctil ≥ 64 px.
- **Ayuda sin castigo**: tras 3 toques fallidos, una diferencia parpadea suavemente.
- **Ronda**: 3 escenas.

#### 7.3 `tools/monedero/` — El Monedero (Matemáticas cotidianas)
- **Mecánica**: "El pan cuesta 1,50 €". Arrastrar o tocar monedas/billetes grandes
  (SVG de euros) para llegar al precio exacto. Botón "Comprobar".
- **Niveles**: 1) precios enteros con monedas de 1-2 €, 2) con 50 céntimos, 3) céntimos variados.
- **Feedback**: si falta o sobra dinero, decirlo en Lectura Fácil ("Falta dinero. Añade más.")
  sin contar como error.
- **Datos**: productos cotidianos con picto y precio en `data.js`.

#### 7.4 `tools/reloj/` — El Reloj (Tiempo)
- **Mecánica A (leer)**: reloj analógico SVG → elegir la hora correcta entre 3 opciones.
- **Mecánica B (asociar)**: "¿Qué hora es la de comer?" → elegir entre relojes.
- **Niveles**: 1) horas en punto, 2) y media, 3) y cuarto / menos cuarto.
- **Datos**: momentos del día con picto (desayuno, comida, cena, dormir) en `data.js`.

#### 7.5 `tools/categorias/` — Categorías (Lenguaje)
- **Mecánica**: aparece un picto+palabra (🍎 Manzana) y 2–3 cajas grandes
  ("Comida", "Animales", "Ropa"). Tocar la caja correcta.
- **Audio**: la palabra se lee al aparecer; las cajas tienen 🔊.
- **Niveles**: 1) 2 categorías muy distintas, 2) 3 categorías, 3) categorías próximas
  (frutas vs verduras).
- **Datos**: `data.js` con `{ palabra, picto, categoria }`, mínimo 60 ítems.
- **Ronda**: 10 palabras.

**Criterios de aceptación Fase 7** (por herramienta): los de la Fase 3, más:
tarjeta añadida a la landing en su módulo, archivos en `sw.js` con versión subida,
y checklist §5-Fase 5 pasado.

---

## 6. Cómo añadir una actividad nueva (receta para el futuro)

1. Crear `tools/<slug>/` con los 4 archivos de la anatomía estándar (§3).
2. Copiar la cabecera HTML de otra herramienta (carga de `assets/css/*` y `assets/js/*`).
3. Poner los datos en `data.js`, la lógica en `app.js`, estilos propios mínimos en `styles.css`.
4. Guardar progreso con `App.storage.set('<slug>', {...})`.
5. Añadir la tarjeta en `site/index.html` dentro del módulo que corresponda.
6. Añadir los archivos nuevos a la lista de caché de `sw.js` y subir la versión.
7. Pasar el checklist de la Fase 5 para la nueva herramienta.

---

## 7. Backlog priorizado (Olas 2 y 3 + transversales)

### Ola 2 — Ampliar razonamiento, memoria y comprensión (✔ completada)
| Actividad | Módulo | Áreas de la taxonomía |
|---|---|---|
| `historias` — ordenar viñetas en secuencia temporal | Razonamiento | Ordenación, espacio/tiempo, análisis |
| `que-no-encaja` — el intruso del grupo | Razonamiento | Coherencia temática, categorización |
| `la-frase` — quién / qué / dónde sobre una frase leída | Lenguaje | Comprensión, análisis de texto |
| `que-falta` — memorizar y detectar el objeto que desaparece | Memoria | Memoria visual a corto plazo, atención |
| `ecos` — repetir secuencias de sonidos/colores | Memoria | Memoria auditiva, ritmo, atención |
| `la-casa` — ordenar pasos de tareas del hogar | Autonomía | Tareas del hogar, secuenciación, priorización |
| `situaciones` — ¿qué haces si…? | Autonomía | Situaciones cotidianas, conducta, autocontrol |

### Ola 3 — Creatividad, juego y calma (✔ completada)
| Actividad | Módulo | Áreas de la taxonomía |
|---|---|---|
| `trazos` — repasar formas y letras | Coordinación | Motricidad fina, escritura y copia, grafomotricidad |
| `colorear` — pintar por zonas | Coordinación | Creatividad, percepción, motricidad fina |
| `puzzle` — recomponer una imagen (arrastrar piezas) | Razonamiento | Montar piezas, orientación espacial, percepción global |
| `oca` — juego de la oca en solitario (dado y casillas con mini-retos) | Razonamiento | Juegos de mesa, turnos, conteo |
| `palabras` — vocabulario temático con imagen y audio | Lenguaje | Léxico comprensivo y expresivo, vocabulario temático |
| `calma` — respiración y relajación guiadas | Emociones | Respiración, gestión del estrés, conciencia interior |
| `entre-amigos` — emociones en otros y conflictos sencillos | Emociones | Interacción social, gestión de conflictos, autoestima |

### Ola 4 — Matemáticas para el día a día (✔ completada)
| Actividad | Módulo | Áreas de la taxonomía |
|---|---|---|
| `numeros` — 8 actividades con cifras coloreadas por posición (azul unidades, verde decenas, morado centenas; coma y signos en naranja): contar de 1/2/5/10 en 10, unidades-decenas-centenas con bloques y lectura de números hasta el billón, fracciones con figuras, decimales con precios, tablas de sumar con puntos, tablas de multiplicar con filas, cálculo mental (dobles, +10/+100/+1.000) y conversión de medidas (metro, kilo, litro) | Razonamiento/Matemáticas | Numeración, valor posicional, operaciones, fracciones, decimales, dinero, medidas |

### Transversales (cuando haya masa crítica de actividades)
- Modo cuidador/profesional: pantalla opcional con historial de progreso por actividad.
- Rutinas personalizables desde la interfaz (editor simple para familiares).
- Pictogramas ARASAAC descargados localmente (licencia CC BY-NC-SA, citar autoría) para
  sustituir emojis donde la precisión del picto importe (rutinas, categorías, emociones).
- Ajustes de usuario: tamaño de letra, activar/desactivar sonidos, modo oscuro.
  (No confundir con `/ajustes/`, la ruta oculta ya implementada para ver/borrar
  `localStorage` — ver `CLAUDE.md` y `SPEC.md` §8.2. Si se construye esta lista de
  ajustes visibles para la persona usuaria, sería una pantalla nueva y distinta.)
- Multi-perfil local (varios usuarios en el mismo dispositivo).
- Dificultad adaptativa suave: si hay muchos fallos seguidos, bajar de nivel sin avisar
  como castigo; si hay muchos aciertos, ofrecer subir ("¿Quieres probar uno más difícil?").
