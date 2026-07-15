# Apptonomia — Plan Director

> Aplicación web interactiva, ligera y de bajo coste para personas con **discapacidad intelectual**.
> Objetivo: ejercicios de terapia ocupacional de forma **autónoma** desde el navegador,
> promoviendo independencia, estimulación cognitiva y habilidades de la vida diaria.

---

## Índice

1. [Diagnóstico de lo existente](#1-diagnóstico-de-lo-existente)
2. [Principios de diseño](#2-principios-de-diseño)
3. [Estructura de proyecto](#3-estructura-de-proyecto)
4. [Catálogo de módulos y actividades](#4-catálogo-de-módulos-y-actividades)
5. [Taxonomía terapéutica](#5-taxonomía-terapéutica)
6. [Fases de ejecución](#6-fases-de-ejecución)
7. [Cómo añadir una actividad nueva](#7-cómo-añadir-una-actividad-nueva)
8. [Backlog priorizado](#8-backlog-priorizado)
9. [Planes complementarios](#9-planes-complementarios)

---

## 1. Diagnóstico de lo existente

### 1.1 Lo que ya hay (se conserva)

| Herramienta | Carpeta | Estado |
|---|---|---|
| Teclado Pro | `tools/keyboard-typing/` | ✔ Funcional, guarda progreso en localStorage |
| Club de la Comedia | `tools/comedy-club/` | ✔ Funcional, 100 chistes, audio TTS |
| Dichos de España | `tools/dichos/` | ✔ Funcional, 100 dichos, audio TTS |
| Adivinanzas | `tools/adivinanzas/` | ✔ Funcional, 100 adivinanzas, audio TTS |
| Landing | `site/` | ✔ Funcional, tema claro con 6 módulos |

### 1.2 Problemas detectados originalmente (ya corregidos)

1. **Código duplicado**: cada herramienta repetía ~380 líneas de CSS y las mismas funciones JS. → **Corregido** con núcleo compartido en `assets/`.
2. **Datos mezclados con lógica**: los datos estaban dentro de `app.js`. → **Corregido** con `data.js` separado por herramienta.
3. **Progreso no persistente**: solo Teclado Pro usaba localStorage. → **Corregido** con `App.storage` compartido.
4. **Accesibilidad cognitiva insuficiente**: tema oscuro con neón, textos largos, botones pequeños. → **Corregido** con tema claro, tipografía grande (Atkinson Hyperlegible), botones ≥64px.
5. **PWA no implementada**: sin `manifest.json` ni service worker. → **Corregido** con `sw.js` y `manifest.json`.
6. **Landing orientada a marketing**: demasiadas secciones y texto. → **Corregido** con menú simple de actividades.

### 1.3 Estado actual verificado (2026-07-15)

| Componente | Estado |
|---|---|
| Núcleo compartido (`assets/`) | ✔ Completo (tokens.css, base.css, components.css, utils.js, tts.js, storage.js, feedback.js, i18n.js) |
| i18n ES/EN | ✔ Completo (30 herramientas + landing + sw.js) |
| Landing con 6 módulos | ✔ Completa |
| PWA offline | ✔ Funcional |
| Scripts de verificación | ✔ check.js (304 checks), smoke.js (98 pruebas Playwright) |
| Preferencias de usuario | ✔ Tamaño de letra, sonidos on/off |
| Exportar/importar progreso | ✔ En `/ajustes/` |
| Fuentes autoalojadas | ✔ Atkinson Hyperlegible + Nunito en `assets/fonts/` |
| Wake Lock (pantalla encendida) | ✔ Implementado en utils.js |
| Guía para equipo de apoyo | ✔ `/equipo/` con columna "En el día a día" |
| Aviso de descanso (cada 5 rondas) | ✔ Implementado |

---

## 2. Principios de diseño

Estos principios mandan sobre cualquier otra decisión. Si una tarea entra en conflicto con ellos, ganan los principios.

1. **Lectura Fácil**: frases cortas, una idea por frase, vocabulario cotidiano, sin metáforas.
2. **Una acción por pantalla**: el usuario nunca debe decidir entre más de 4–6 opciones visibles.
3. **Objetivos táctiles grandes**: botones mínimo **64×64 px**, separación mínima 16 px.
4. **Tipografía grande**: base 20 px, títulos 28–36 px, fuente legible (Atkinson Hyperlegible o Nunito).
5. **Tema claro por defecto** con alto contraste (WCAG AA mínimo, AAA cuando sea posible).
6. **Audio en todo**: cada texto importante tiene botón 🔊 (Web Speech API, es-ES/en-US, velocidad 0.9).
7. **Sin presión**: sin cronómetros visibles, sin puntuación negativa, sin "game over".
8. **Refuerzo positivo inmediato**: celebración visual + sonora al acertar (≤2 s).
9. **`prefers-reduced-motion`**: todas las animaciones se desactivan si el sistema lo pide.
10. **Autonomía**: funciona offline (PWA), sin login, sin coste, sin datos personales.

---

## 3. Estructura de proyecto

```
apptonomia/
├── CLAUDE.md                  # Guía para trabajar con Claude
├── PLAN.md                    # Este plan director
├── README.md                  # Documentación breve
├── SPEC.md                    # Especificación técnica
├── package.json
├── index.html                 # Redirección a site/index.html
├── manifest.json              # PWA
├── sw.js                      # Service worker (cache offline)
├── assets/
│   ├── css/
│   │   ├── tokens.css         # Variables CSS
│   │   ├── base.css           # Reset + estilos base
│   │   └── components.css     # Componentes reutilizables
│   ├── js/
│   │   ├── utils.js           # shuffle, helpers DOM, Wake Lock
│   │   ├── tts.js             # Texto a voz
│   │   ├── storage.js         # localStorage + exportar/importar
│   │   ├── feedback.js        # Celebración, sonidos, ánimo
│   │   └── i18n.js            # Sistema de internacionalización
│   ├── fonts/                 # Atkinson Hyperlegible + Nunito
│   └── img/
├── site/
│   ├── index.html             # Landing con 6 módulos
│   ├── strings.js             # Textos ES/EN
│   └── styles.css
├── ajustes/
│   ├── index.html             # Preferencias + exportar/importar progreso
│   └── app.js
├── equipo/
│   ├── index.html             # Guía para el equipo de apoyo
│   └── styles.css
├── scripts/
│   ├── check.js               # Verificación estructural (304 checks)
│   └── smoke.js              # Smoke test con Playwright (98 pruebas)
└── tools/                     # Una carpeta por actividad (60+ herramientas)
```

### Anatomía estándar de una herramienta

```
tools/<slug>/
├── index.html     # Carga assets/css/*.css + styles.css
├── app.js         # Solo lógica. Importa módulos compartidos de assets/js/
├── data.js        # Solo datos (const DATA = {...} por idioma si aplica)
├── strings.js     # Textos ES/EN (registrados en App.i18n)
└── styles.css     # Estilos propios (< 150 líneas)
```

---

## 4. Catálogo de módulos y actividades

### Módulo 1 — Coordinación y motricidad (azul `--mod-coordinacion`)

| Actividad | Carpeta | Estado |
|---|---|---|
| Atrapa — pulsar objetivo que cambia de posición | `tools/atrapa/` | ✔ |
| Teclado — mecanografía guiada | `tools/keyboard-typing/` | ✔ |
| Trazos — repasar formas y letras | `tools/trazos/` | ✔ |
| Colorear — pintar dibujos por zonas | `tools/colorear/` | ✔ |
| Piano — tocar el teclado como piano | `tools/piano-teclas/` | ✔ |
| Constructores — bloques estilo Minecraft | `tools/constructores/` | ✔ |

### Módulo 2 — Autonomía y hogar (verde `--mod-secuencia`)

| Actividad | Carpeta | Estado |
|---|---|---|
| Mis Rutinas — rutinas diarias paso a paso | `tools/rutinas/` | ✔ |
| La Casa — ordenar pasos de tareas del hogar | `tools/la-casa/` | ✔ |
| Situaciones — ¿qué haces si…? | `tools/situaciones/` | ✔ |
| Chat Seguro — practicar ante manipulación en línea | `tools/chat-seguro/` | ✔ |
| Chat Acoso — reconocer acoso entre iguales | `tools/chat-acoso/` | ✔ |
| ¿Lo público? — decisiones en redes sociales | `tools/lo-publico/` | ✔ |
| Señales — reconocer señalética cotidiana | `tools/senales/` | ✔ |
| Partes del Día — clasificar tareas por momento | `tools/partes-del-dia/` | ✔ |
| ¿Qué hago primero? — priorización | `tools/que-primero/` | ✔ |
| ¿Qué necesito? — planificación | `tools/que-necesito/` | ✔ |
| ¿Dónde lo guardo? — organización | `tools/donde-lo-guardo/` | ✔ |
| Lista de Tareas — ordenar tareas del día | `tools/lista-tareas/` | ✔ |
| ¿Qué me pongo? — ropa según el tiempo | `tools/que-me-pongo/` | ✔ |
| La Calle — movilidad comunitaria | `tools/la-calle/` | ✔ |
| Emergencias — reconocer y pedir ayuda (112) | `tools/emergencias/` | ✔ |
| La Compra — secciones del supermercado | `tools/la-compra/` | ✔ |
| La Tienda — usar dinero en compra real | `tools/la-tienda/` | ✔ |

### Módulo 3 — Memoria y atención (naranja `--mod-memoria`)

| Actividad | Carpeta | Estado |
|---|---|---|
| Parejas — emparejar cartas | `tools/parejas/` | ✔ |
| Diferencias — encontrar diferencias entre escenas | `tools/diferencias/` | ✔ |
| ¿Qué falta? — memorizar y detectar ausencia | `tools/que-falta/` | ✔ |
| Ecos — repetir secuencias de sonidos/colores | `tools/ecos/` | ✔ |
| Giros y Espejos — rotación mental | `tools/giros-espejos/` | ✔ |
| Los Bloques — copiar modelo en cuadrícula | `tools/los-bloques/` | ✔ |
| ¿Dónde está? — vocabulario espacial | `tools/donde-esta/` | ✔ |
| El Camino — orientación estilo robot | `tools/el-camino/` | ✔ |
| Encaja la Pieza — tetris adaptado sin caída | `tools/encajar/` | ✔ |
| El Teatro — profundidad con personajes | `tools/el-teatro/` | ✔ |

### Módulo 4 — Razonamiento y matemáticas (teal `--mod-razonamiento`)

| Actividad | Carpeta | Estado |
|---|---|---|
| Adivinanzas — inferencia y deducción | `tools/adivinanzas/` | ✔ |
| Patrones — completar series | `tools/patrones/` | ✔ |
| El Monedero — dinero físico y cambio | `tools/monedero/` | ✔ |
| El Reloj — leer horas | `tools/reloj/` | ✔ |
| ¿Qué no encaja? — detectar el intruso | `tools/que-no-encaja/` | ✔ |
| Historias — ordenar viñetas | `tools/historias/` | ✔ |
| Puzzle — recomponer imagen | `tools/puzzle/` | ✔ |
| La Oca — juego en solitario | `tools/oca/` | ✔ |
| Tres en Raya — lógica contra rival | `tools/tres-en-raya/` | ✔ |
| Sudoku Visual — sudoku 4×4 con pictos | `tools/sudoku-visual/` | ✔ |
| Dominó — partida contra rival | `tools/domino/` | ✔ |
| Las Damas — damas adaptadas 6×6 | `tools/damas/` | ✔ |
| El Ajedrez — puzzles de piezas | `tools/ajedrez/` | ✔ |
| Cuatro en Raya — conecta 4 adaptado | `tools/cuatro-en-raya/` | ✔ |

### Módulo 5 — Lenguaje y comunicación (frambuesa `--mod-lenguaje`)

| Actividad | Carpeta | Estado |
|---|---|---|
| Chistes — Club de la Comedia | `tools/comedy-club/` | ✔ |
| Dichos — lenguaje figurado | `tools/dichos/` | ✔ |
| Categorías — clasificar palabras | `tools/categorias/` | ✔ |
| La Frase — quién / qué / dónde | `tools/la-frase/` | ✔ |
| Palabras — vocabulario temático | `tools/palabras/` | ✔ |
| Números — matemáticas del día a día | `tools/numeros/` | ✔ |

### Módulo 6 — Emociones y relaciones (morado `--mod-emocional`)

| Actividad | Carpeta | Estado |
|---|---|---|
| ¿Cómo me siento? — identificador de emociones | `tools/emociones/` | ✔ |
| Calma — respiración y relajación | `tools/calma/` | ✔ |
| Entre Amigos — emociones y conflictos | `tools/entre-amigos/` | ✔ |
| Mi Cuerpo Me Avisa — interocepción | `tools/mi-cuerpo-avisa/` | ✔ |

---

## 5. Taxonomía terapéutica

Estado de cobertura de áreas de la taxonomía de objetivos:

| Área | Estado | Herramienta |
|---|---|---|
| Montar piezas (puzzles) | ✔ | `puzzle` |
| Razonamiento: patrones | ✔ | `patrones` |
| Razonamiento: deducción, inferencia | ✔ | `adivinanzas` |
| Razonamiento: ordenación, priorización | ✔ | `historias`, `la-casa` |
| Razonamiento: coherencia temática | ✔ | `que-no-encaja` |
| Razonamiento: codificación/decodificación | ✔ | `patrones` nivel 4 |
| Atención | ✔ | `diferencias`, `que-falta` |
| Espacio / tiempo, orientación espacial | ✔ | `reloj`, `historias`, `puzzle` |
| Memoria visual / corto plazo | ✔ | `parejas`, `que-falta` |
| Memoria auditiva / verbal | ✔ | `ecos` |
| Lenguaje: vocabulario, categorías | ✔ | `categorias`, `palabras` |
| Lenguaje: comprensión | ✔ | `la-frase` |
| Lenguaje: frases hechas, refranes, chistes | ✔ | `dichos`, `comedy-club` |
| Lenguaje: ortografía, escritura | ✔ | `keyboard-typing`, `trazos` |
| Interacción social: sentimientos, conflictos | ✔ | `emociones`, `situaciones`, `entre-amigos` |
| Seguridad en internet | ✔ | `chat-seguro`, `chat-acoso`, `lo-publico` |
| Matemáticas: operaciones, dinero | ✔ | `monedero`, `numeros` |
| Tiempo, horas | ✔ | `reloj` |
| Musicalidad y ritmo | ✔ | `ecos`, `piano-teclas` |
| Hogar: aseo, tareas, organización | ✔ | `rutinas`, `la-casa`, `emergencias` |
| Creatividad, dibujar y colorear | ✔ | `colorear`, `trazos` |
| Percepción global y de detalles | ✔ | `diferencias` |
| Respiración, conciencia interior | ✔ | `emociones`, `calma`, `mi-cuerpo-avisa` |
| Coordinación ojo-mano, motricidad fina | ✔ | `atrapa`, `keyboard-typing`, `trazos` |
| Juegos de mesa | ✔ | `oca`, `tres-en-raya`, `domino`, `damas`, `ajedrez`, `cuatro-en-raya` |
| Movilidad comunitaria | ✔ | `la-calle` |
| Autonomía en salud | ✔ | `emergencias`, `mi-cuerpo-avisa` |
| Compra y dinero en contexto real | ✔ | `la-compra`, `la-tienda`, `monedero` |
| Motricidad gruesa, coordinación postural | ✖ | Requiere espacio físico y acompañante |
| Trabajo en equipo | ✖ | App individual, sin conexión entre usuarios |
| Expresión oral evaluada | ✖ | Reconocimiento de voz no fiable |

---

## 6. Fases de ejecución

### Fase 0 — Preparación ✔ Completada

- [x] Repositorio git inicializado
- [x] Carpetas `assets/css/`, `assets/js/`, `assets/img/` creadas
- [x] `index.html` de redirección a `site/index.html`

### Fase 1 — Núcleo compartido (assets/) ✔ Completada

- [x] `assets/css/tokens.css` — Variables CSS
- [x] `assets/css/base.css` — Reset, tipografía, accesibilidad
- [x] `assets/css/components.css` — Botones, tarjetas, modales
- [x] `assets/js/utils.js` — shuffle, helpers DOM
- [x] `assets/js/tts.js` — Texto a voz es-ES/en-US
- [x] `assets/js/storage.js` — Progreso en localStorage
- [x] `assets/js/feedback.js` — Celebración, sonidos, ánimo

### Fase 2 — Refactor de herramientas existentes ✔ Completada

Refactorizadas: comedy-club, dichos, adivinanzas, keyboard-typing.

### Fase 3 — Nuevos módulos (atrapa, rutinas, parejas, emociones) ✔ Completada

### Fase 4 — Nueva landing + PWA ✔ Completada

### Fase 5 — Verificación final ✔ Completada

Automatizado con Playwright:
- [x] Consola limpia en las 98 pruebas (49 actividades × es/en)
- [x] Rondas completas sin errores
- [x] Persistencia verificada
- [x] i18n funcional en ambos idiomas

### Fase 6 — Reorganización en 6 módulos ✔ Completada

- [x] Módulo Razonamiento (teal) añadido
- [x] Módulo Lenguaje (frambuesa) añadido
- [x] Herramientas reubicadas correctamente

### Fase 7 — Ola 1 de nuevas actividades ✔ Completada

Patrones, diferencias, monedero, reloj, categorias.

---

## 7. Cómo añadir una actividad nueva

1. **Crear carpeta** `tools/<slug>/` con los 4 archivos de la anatomía estándar.
2. **Copiar cabecera HTML** de otra herramienta (carga de `assets/css/*` y `assets/js/*`).
3. **Crear `strings.js`** con textos en ES y EN (registrados en `App.i18n`).
4. **Poner datos en `data.js`**, lógica en `app.js`, estilos propios en `styles.css`.
5. **Guardar progreso** con `App.storage.set('<slug>', {...})`.
6. **Añadir tarjeta** en `site/index.html` dentro del módulo correspondiente + `site/strings.js`.
7. **Añadir archivos a `sw.js`** (lista `ARCHIVOS`) y subir `VERSION`.
8. **Añadir fila en `/equipo/`** con columna "En el día a día" (E1).
9. **Ejecutar verificación**: `node scripts/check.js` y `node scripts/smoke.js`.

---

## 8. Backlog priorizado

### Completados

| Actividad | Módulo | Commit |
|---|---|---|
| `historias` | Razonamiento | ✔ |
| `que-no-encaja` | Razonamiento | ✔ |
| `la-frase` | Lenguaje | ✔ |
| `que-falta` | Memoria | ✔ |
| `ecos` | Memoria | ✔ |
| `la-casa` | Autonomía | ✔ |
| `situaciones` | Autonomía | ✔ |
| `trazos` | Coordinación | ✔ |
| `colorear` | Coordinación | ✔ |
| `puzzle` | Razonamiento | ✔ |
| `oca` | Razonamiento | ✔ |
| `palabras` | Lenguaje | ✔ |
| `calma` | Emociones | ✔ |
| `entre-amigos` | Emociones | ✔ |
| `la-calle` | Autonomía | ✔ |
| `mi-cuerpo-avisa` | Emociones | ✔ |
| `emergencias` | Autonomía | ✔ |
| `la-compra` | Autonomía | ✔ |
| `la-tienda` | Autonomía | ✔ |
| `giros-espejos` | Memoria | ✔ |
| `los-bloques` | Memoria | ✔ |
| `donde-esta` | Memoria | ✔ |
| `el-camino` | Memoria | ✔ |
| `encajar` | Memoria | ✔ |
| `el-teatro` | Memoria | ✔ |
| `senales` | Autonomía | ✔ |
| `partes-del-dia` | Autonomía | ✔ |
| `que-primero` | Autonomía | ✔ |
| `que-necesito` | Autonomía | ✔ |
| `donde-lo-guardo` | Autonomía | ✔ |
| `lista-tareas` | Autonomía | ✔ |
| `que-me-pongo` | Autonomía | ✔ |
| `constructores` | Coordinación | ✔ |
| `chat-seguro` | Autonomía | ✔ |
| `chat-acoso` | Autonomía | ✔ |
| `lo-publico` | Autonomía | ✔ |
| `sudoku-visual` | Razonamiento | ✔ |
| `domino` | Razonamiento | ✔ |
| `damas` | Razonamiento | ✔ |
| `ajedrez` | Razonamiento | ✔ |
| `cuatro-en-raya` | Razonamiento | ✔ |
| `numeros` | Razonamiento | ✔ |

### Retirados del plan (a petición del usuario, 2026-07-10)

- Pictogramas ARASAAC locales para sustituir emojis
- Multi-perfil local
- Dificultad adaptativa

### Pendiente de aprobación

| Propuesta | Descripción |
|---|---|
| Publicación HTTPS | Firebase Hosting o GitHub Pages |

---

## 9. Planes complementarios

### 9.1 PLAN-I18N.md — Migración i18n (COMPLETADO)

**Estado**: ✔ Completado (2026-07-07)

Migración completa de la aplicación a bilingüe español/inglés:
- 30 herramientas con `strings.js` y uso de `App.i18n`
- Landing con selector de idioma
- Service worker cacheando todos los archivos i18n
- TTS funcionando en ambos idiomas

**Commits**:
- `37bce3a` — i18n: estado inicial (25 tools)
- `33a2deb` — i18n: colorear ES/EN
- `8550784` — i18n: historias ES/EN
- `7643fac` — i18n: reloj ES/EN
- `7cca8b7` — i18n: keyboard-typing ES/EN
- `a1d4b19` — i18n: numeros ES/EN
- `0556751` — i18n: cache i18n.js and strings.js in service worker (v29)
- Commits finales de verificación

### 9.2 PLAN-MEJORAS.md — Auditoría y mejoras (COMPLETADO)

**Estado**: ✔ Completado (2026-07-15)

Revisión completa con 4 partes:

**Parte A — Bugs reales** (completados):
- A1: Fix `DATA.porRonda` en la-frase y palabras
- A2: Teclas de keyboard-typing a 64px mínimo

**Parte B — Consistencia técnica** (completados):
- B1: `fallo` → `animo` en piano-teclas
- B2: TTS onvoiceschanged para cargar voces async
- B3: Comentario desfasado en que-necesito
- B4: Documentación de progresión en historias

**Parte C — Documentación** (completados):
- C1: Actualizada referencia a módulos en CLAUDE.md
- C2: Notas de obsolescencia en PLAN-I18N.md
- C3: Estado de verificación en PLAN.md

**Parte D — Producto** (resuelto):
- D1: Módulo Emociones ampliado con mi-cuerpo-avisa
- D2: Preferencias de usuario + Progreso por actividad en /ajustes/
- D3: Patrones nivel 4 (codificación/decodificación)

**Parte E — Terapia ocupacional** (completados):
- E1: Columna "En el día a día" en /equipo/
- E2: Aviso de descanso cada 5 rondas
- E3: La Calle (✔)
- E4: Mi cuerpo me avisa (✔)
- E5: Emergencias (✔)
- E6: La Compra (✔)

**Parte F — Experto tecnológico** (completados):
- F1: Exportar/importar progreso en /ajustes/
- F2: Fuentes autoalojadas (Atkinson + Nunito)
- F3: scripts/check.js (304 checks)
- F4: Wake Lock en utils.js

**Parte G — Segunda revisión** (completados):
- G1: check.js ampliado con paridad equipo, conteos, lint porRonda
- G2: Borrado temp_original_data.js
- G3: Anclas de módulo en portada
- G4: Nota de coordinación en CLAUDE.md
- G5: scripts/smoke.js con Playwright

---

## Historial de versiones del plan

| Fecha | Versión | Cambios |
|---|---|---|
| 2026-07-07 | 1.0 | Plan inicial creado |
| 2026-07-07 | 2.0 | Plan-I18N.md completado |
| 2026-07-10 | 3.0 | Plan-MEJORAS.md partes A-G1 |
| 2026-07-15 | 4.0 | Unificación en PLAN.md único, todas las partes completadas |
