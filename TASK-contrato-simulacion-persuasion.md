# Tarea: contrato de simulación / habilidad pura / aprendizaje significativo / comunicación persuasiva

> **Documento de trabajo interno, no es documentación canónica de producto.**
> No sigue la convención de paridad `doc/en` + `doc/es` (ver `CLAUDE.md` §4: los
> encargos de trabajo y el histórico de bugs no son fuente canónica). Se puede
> borrar o archivar cuando el trabajo esté terminado.
>
> Generado: revisar `git log -1 -- TASK-contrato-simulacion-persuasion.md` para
> la fecha real. Los datos de la auditoría son un snapshot: **vuelve a
> generarlos antes de empezar** (ver §1), porque este repo recibe cambios de
> varias sesiones en paralelo.

## 0. Contexto y fuente de verdad

Tres documentos canónicos definen el contrato que debe cumplir cada actividad.
Léelos antes de tocar código, en este orden:

1. [doc/es/SPEC.md](doc/es/SPEC.md) §3.6 "Entrenar mediante simulación de la
   vida diaria siempre que sea posible" **+ el nuevo §3.6.b "Decisión de
   diseño: entrenamiento de habilidad pura"** y §3.7 "Comunicación persuasiva al
   servicio del aprendizaje" — el **qué y el porqué**. El producto reconoce
   dos vehículos, **no equivalentes**: la **simulación de la vida diaria** es
   el **vehículo preferente** y la **habilidad pura** (memoria, motricidad
   fina, lógica, puzzles, percepción) es un vehículo válido que ocupa un
   segundo plano justificado por el objetivo terapéutico. La habilidad pura
   **no** es una excepción a justificar caso por caso: es una **decisión de
   diseño priorizada** del producto.
2. [doc/es/guia-crear-actividades.md](doc/es/guia-crear-actividades.md) §2.3
   (ahora con tres patrones mecánicos: **escena + decisión**, **diálogo o
   chat seguro** y **rutina paso a paso**, más el cuarto **entrenamiento de
   habilidad pura**), §2.4, §5.8 y **§7.6 (plantilla de código)** — el
   **cómo**, con el patrón de claves i18n `contexto` / `instruccion` /
   `transferencia` y el flujo `App.tts.speak` → `App.feedback.success/
   encourage` → `mostrarPista` / `mostrarExplicacion`.
3. [doc/es/tecnico.md](doc/es/tecnico.md) §7 "Contratos transversales" — los
   cuatro contratos exigibles: *simulación de la vida diaria* (cuando aplica),
   *anclas de aprendizaje significativo* (siempre), *comunicación persuasiva*
   (siempre, con la lista de patrones prohibidos en `SPEC §3.7`) y
   *entrenamiento de habilidad pura como decisión de diseño priorizada*.

Si un documento parece incompleto o distinto a lo aquí resumido, **el
documento canónico manda**, no este archivo.

### Implementaciones de referencia

- `tools/doctor-visit/`, `tools/self-esteem/`, `tools/resilience/`,
  `tools/first-aid-kit/` — simulaciones completas (`contexto`,
  `instruccion`, `transferencia`, `pista`, `explicacion`, feedback y TTS
  todos presentes).
- `tools/be-prepared/`, `tools/while-help-arrives/`, `tools/trust-circle/` —
  mismo nivel de cumplimiento, traen además variantes de TTS contextual.

Copia su estructura de `strings.es.js` / `strings.en.js` / `app.js` como
plantilla en vez de reinventar el patrón.

## 1. Antes de empezar (obligatorio)

```powershell
git status --short
node scripts/check.js
node scripts/audit-activities.v2.js
```

- `scripts/audit-activities.v2.js` (raíz del repo, sin seguimiento en git
  todavía) regenera el CSV de cumplimiento por actividad. **Los números de
  este documento son del snapshot tomado al escribirlo**; si han pasado días o
  hay commits nuevos en `tools/**`, vuelve a correrlo y usa esos datos, no los
  de abajo.
- **Aviso conocido**: la columna `banco` del script infravalora el tamaño real
  del banco de casos en archivos `data.js` que envuelven los datos en una
  IIFE (el sandbox de `vm` no siempre ve la asignación). No uses `banco` para
  decidir que faltan casos sin abrir el `data.js` y contar a mano.
- Sigue el flujo de `CLAUDE.md` §2: no descartes cambios de otras sesiones,
  reconcilia si un archivo cambió desde que lo leíste, actualiza la fuente
  canónica del tema (no copias), mantén paridad ES/EN, corre
  `node scripts/check.js` antes de cerrar cada PR.

## 2. Cómo clasificar cada actividad

Para cada actividad en la lista de la §3, decide primero en qué caso está.
**"Excepción" ya no es una categoría**: el producto reconoce explícitamente
dos vehículos, con la simulación como preferente.

### Caso A · Simulación de la vida diaria (vehículo preferente)

La actividad representa una decisión o tarea cotidiana (comprar, pedir ayuda,
seguir una rutina, reconocer una señal de peligro, etc.). Vehículo:
**simulación** — preferente. Contrato completo:

- Claves i18n `contexto`, `instruccion`, `transferencia` (frase de cierre que
  conecta con la vida real, anclas de aprendizaje significativo, ver guía
  §5.8).
- `pista` + `explicacion` y las llamadas correspondientes `mostrarPista()` /
  `mostrarExplicacion()` en `app.js` (patrón socrático: nunca decir
  "incorrecto", ofrecer pista antes que solución).
- `App.feedback.success(...)` y `App.feedback.encourage(...)` llamados en el
  flujo de acierto/error.
- Banco de casos ≥ 25 salvo justificación (verificar a mano, ver aviso de
  arriba).

### Caso B · Entrenamiento de habilidad pura (decisión de diseño priorizada)

La actividad entrena una habilidad perceptiva, motriz, lógica o de memoria
donde el **estímulo es el contexto** (el piano, la cuadrícula, las piezas, la
secuencia). Vehículo: **habilidad pura** — válido pero no equivalente a la
simulación. **No es una excepción** a justificar caso por caso: es una
**decisión de diseño priorizada** del producto. Contrato casi-completo
(relajado solo donde el estímulo hace el contenido forzado):

- Clave i18n `contexto` (verbal, una frase que sitúa el estímulo en la vida
  diaria) **cuando aporte**.
- Clave i18n `transferencia` (una línea, ES+EN) cuando aporte — ancla lo
  entrenado a un momento del día.
- `pista` + `explicacion` y sus llamadas en `app.js` **cuando aporten** (no
  obligatorias si la actividad no tiene "respuesta correcta" que explicar,
  p. ej. `builders` o `piano-keys` en modo libre).
- `App.feedback.success(...)` y `App.feedback.encourage(...)` **siempre**
  llamados en el flujo de acierto/error (el refuerzo sin castigo aplica
  siempre, sea o no simulación).
- Entrada priorizada como tal en `team/strings.{es,en}.js`: el `works` /
  `daily` debe decir explícitamente que la actividad entrena una **habilidad
  pura** priorizada por el producto, no que es una "excepción".

> Si dudas entre A y B para una actividad concreta, pregunta antes de
> adivinar — clasificar mal genera trabajo innecesario o contenido forzado.

## 3. Snapshot de la auditoría (regenerar antes de usar, ver §1)

Total actividades auditadas: **81** (`tools/*`). Conteo de la auditoría
ejecutada el 2026-07-23 — los nombres concretos pueden haber cambiado desde
entonces.

### 🔴 Prioridad alta — cableado incompleto (Caso A)

Estas actividades tienen el contenido i18n de la simulación (`contexto`,
`instruccion`, `pista`, `explicacion`, `transferencia`) pero `app.js` **no
llama** a `mostrarPista()` ni `mostrarExplicacion()`. La persona no ve el
texto de ayuda aunque exista. Hay que **cablear**, no inventar contenido.

`bullying-chat`, `dictionary`, `double-meaning`, `good-manners`, `math-tables`,
`my-agenda`, `phone-numbers`, `quantities`, `roman-numerals`, `routines`,
`safe-chat`, `social-safety`, `spelling`, `task-list`, `theatre`,
`visual-sudoku` (las claves `pista`/`explicacion` ya existen — bug de
cableado, no de contenido), `wallet`, `word-search`.

### 🟡 Prioridad media — falta `transferencia` (Caso A)

Todo lo demás del contrato de simulación ya está. Solo añadir la frase de
cierre `transferencia` (una línea, ES+EN, sin repetir la instrucción):

`clock`, `numbers`.

### 🟢 Prioridad baja — refuerzo `feedback.success` / `encourage` ausente

El error nunca debe quedar sin refuerzo positivo posterior. Revisar el flujo
de acierto/error en `app.js` y añadir la llamada que falte:

- `success` ausente: `builders`, `calm`, `coloring`, `emotions`, `path`,
  `piano-keys`.
- `encourage` ausente: `calm`, `catch`, `coloring`, `emotions`, `oca`,
  `piano-keys`.

(`builders`, `catch`, `oca`, `path` aparecen también en la lista de prioridad
alta del Caso A — cablearlos juntos, no dos veces.)

### 🎮 Prioridad 1 (decisión del usuario, 2026-07-23) · Elevar la habilidad pura

Esta es la prioridad **estructural** de esta tarea. Las actividades Caso B
deben declararse como **decisión de diseño priorizada**, no como excepción:

1. Reescribir la entrada de cada actividad Caso B en
   `team/strings.{es,en}.js` (`works` + `daily`) declarando que entrena una
   habilidad pura priorizada por el producto.
2. Añadir clave i18n `transferencia` (una línea, ES+EN) en
   `tools/<caso-b>/strings.{es,en}.js` cuando aporte. **No** se modifica
   `app.js` en este lote (se deja la frase disponible para una segunda
   iteración; el cableado no rompe el contrato del producto).

Actividades Caso B (las 24 del snapshot): `blocks`, `builders`, `catch`,
`checkers`, `chess`, `coloring`, `connect-dots`, `connect-four`,
`differences`, `domino`, `ecos`, `emotions`, `fit`, `keyboard-typing`, `oca`,
`pairs`, `path`, `piano-keys`, `puzzle`, `stories`, `tic-tac-toe`,
`tracing`, `turns-mirrors`, `visual-sudoku`, `where-is`.

> `phone-numbers` y `stories` están en el límite A↔B; si se mantiene como
> simulación, pasa a la lista de prioridad alta (cableado).

### Banco de casos a revisar a mano (script reporta < 25)

Aviso: cifra poco fiable para `data.js` con IIFE (ver §1). Antes de ampliar un
banco, ábrelo y cuenta a mano. Actividades reportadas con banco pequeño en el
snapshot: `be-prepared`, `blocks`, `builders`, `calm`, `catch`, `categories`,
`checkers`, `chess`, `colored-spelling`, `coloring`, `comedy-club`,
`connect-dots`, `connect-four`, `dictionary`, `differences`, `doctor-visit`,
`domino`, `double-meaning`, `ecos`, `emergencies`, `emotions`, `first-aid-kit`,
`fit`, `friends`, `healthy-food`, `idioms`, `keyboard-typing`, `math-tables`,
`my-agenda`, `my-body`, `my-details`, `numbers`, `oca`, `odd-one-out`,
`pairs`, `path`, `patterns`, `phone-numbers`, `piano-keys`, `post-or-not`,
`puzzle`, `quantities`, `resilience`, `riddles`, `roman-numerals`,
`safe-chat`, `self-esteem`, `sentence`, `sexual-health`, `shop`, `shopping`,
`signs`, `situations`, `social-safety`, `spelling`, `stories`, `street`,
`task-list`, `theatre` (lista parcial — usa la salida real del comando).

## 4. Flujo de trabajo sugerido

1. Trabaja por lotes pequeños (una actividad o un grupo temático de 3-5 por
   commit), no un commit gigante — esto es un repo con varias sesiones en
   paralelo y los commits grandes son más difíciles de reconciliar.
2. **Lote 1 (esta tarea)** — regeneración del snapshot + framing. Sin
   código.
3. **Lote 2** — `doc/{en,es}/SPEC.md`: §3.6 + nuevo §3.6.b + principio 11 +
   §5 éxito 8 + §6 NO-hace.
4. **Lote 3** — `doc/{en,es}/technical.md` §7: reformular la cláusula de
   "excepción" como decisión de diseño priorizada.
5. **Lote 4** — `doc/{en,es}/creating-activities-guide.md` §2.3 (nuevo
   patrón "entrenamiento de habilidad pura") + §9 checklist.
6. **Lote 5** — `team/strings.{es,en}.js`: reescribir las entradas Caso B
   como decisiones de diseño priorizadas.
7. **Lote 6** — `tools/<caso-b>/strings.{es,en}.js`: añadir `transferencia`
   corta donde aporte (sin tocar `app.js`).
8. Para cada actividad Caso A con prioridad alta: sigue la plantilla de
   `doc/es/guia-crear-actividades.md` §7.6, usando `tools/doctor-visit/`,
   `tools/self-esteem/` o `tools/first-aid-kit/` como ejemplo real.
9. Mantén paridad ES/EN en cada cambio de i18n (`scripts/check.js` lo
   valida).
10. Antes de cerrar cada lote: `node scripts/check.js` debe seguir con el
    mismo estado que al empezar (los fallos nuevos son trabajo previo, no
    tocar).
11. No hagas deploy ni push sin aprobación explícita (regla de `CLAUDE.md`
    §3).