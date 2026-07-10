# PLAN-MEJORAS.md — Plan de mejoras auditadas (2026-07-07)

> **ESTADO (2026-07-10): TODO EL PLAN ESTÁ EJECUTADO** — Partes A, B, C,
> E1-E6, F1-F4, toda la G (G1-G5), D2-ítems 1 y 3, y D3 (verificado en el
> repo: fuentes en `assets/fonts/`, `scripts/check.js` con 8
> comprobaciones, `scripts/smoke.js` con Playwright, wake lock en
> `utils.js`, `core.descanso`, export/import en `/ajustes/`, 4ª columna en
> `equipo/`, anclas de módulo en la portada, `temp_original_data.js`
> borrado, `tools/la-calle/`, `tools/mi-cuerpo-avisa/`,
> `tools/emergencias/`, `tools/la-compra/`, `patrones` nivel 4,
> preferencias de tamaño de letra y sonidos, "Progreso por actividad" en
> `/ajustes/`). NO volver a ejecutar nada de esto. Solo quedan D1
> (resuelto de facto por E4/mi-cuerpo-avisa, sin acción propia) y
> D2-ítems 2 y 4 (pictogramas ARASAAC, multi-perfil — el propio plan dice
> "no empezar en frío", requieren diseño previo con el usuario si algún
> día se retoman).

Plan ejecutable escrito para que lo siga **cualquier modelo/agente, incluso uno
poco capaz**. Cada tarea tiene: archivo exacto, cambio exacto (texto viejo →
texto nuevo cuando es posible), y cómo verificar. **No improvises**: si algo no
coincide con lo descrito, para y pregunta al usuario.

Origen: auditoría de 2026-07-07 (4 revisiones paralelas: núcleo compartido,
reglas de accesibilidad, documentación, i18n). Los hallazgos ya fueron
**verificados contra el código real** — no son hipótesis. La Parte E añade la
revisión desde el punto de vista de terapia ocupacional (misma fecha). La
Parte G es la segunda revisión tecnológica (2026-07-10), tras crecer la app
de 36 a 49 actividades en tres días con varias sesiones en paralelo.

---

## Reglas para el ejecutor (leer antes de empezar)

1. Lee `CLAUDE.md` entero antes de tocar nada. Sus 13 reglas de accesibilidad
   son obligatorias y este plan nunca te pide incumplirlas.
2. **Un commit por tarea** (A1, A2, B1…), mensaje en inglés explicando el porqué.
3. Después de editar cualquier `.js`: ejecuta `node --check <archivo>` y no
   hagas commit si falla.
4. Si cambias CUALQUIER archivo que está en la lista `ARCHIVOS` de `sw.js`
   (todos los de `tools/`, `site/`, `assets/` lo están): sube la constante
   `VERSION` de `sw.js` (línea 6) **una sola vez al final de todo el plan**,
   de `apptonomia-v40` a `apptonomia-v41`, en su propio commit.
5. No añadas frameworks, npm dependencies, ni borres herramientas.
6. Verificación en navegador: servir con `npx serve .` desde la raíz del repo
   (puerto 3000; **no** usar `python`, no está instalado de verdad en esta
   máquina) y abrir `http://localhost:3000/site/index.html`. Ojo: `npx serve`
   redirige `/site/index.html` → `/site`; si las rutas relativas fallan por
   eso, prueba la URL con barra final (`/site/`).
7. Las tareas están ordenadas por prioridad. Haz la Parte A sí o sí; la B y C
   son seguras y recomendadas; la D **requiere aprobación del usuario antes
   de empezar** (es producto nuevo, no corrección).

---

## PARTE A — Bugs reales (prioridad máxima)

### A1. `la-frase` y `palabras` crashean al terminar la ronda

**Problema.** En estas 2 herramientas `DATA` tiene la forma `{ es: {...},
en: {...} }`, así que `DATA.porRonda` es `undefined`. La comparación
`idx >= undefined` siempre es `false`, la ronda **nunca termina**: tras el
último ítem, `render()` se ejecuta con `items[idx] === undefined` y lanza un
TypeError (pantalla rota, sin pantalla final, sin estrella de ronda). El resto
del archivo ya usa la forma correcta `banco().porRonda` (líneas 65 y 75) —
solo la función `siguiente()` quedó mal.

**Cambio 1** — `tools/la-frase/app.js` línea 156:

```js
// ANTES
    if (idx >= DATA.porRonda) {
// DESPUÉS
    if (idx >= banco().porRonda) {
```

**Cambio 2** — `tools/palabras/app.js` línea 162:

```js
// ANTES
    if (idx >= DATA.porRonda) {
// DESPUÉS
    if (idx >= banco().porRonda) {
```

**No toques** `tools/historias`, `tools/numeros` ni `tools/reloj` aunque usen
`DATA.porRonda`: en esos tres, `porRonda` SÍ está en el nivel superior de
`DATA` (verificado), funcionan bien.

**Verificar.** `node --check` en ambos archivos. Después, en el navegador:
jugar una ronda COMPLETA de La Frase (8 frases) y de Palabras (10 palabras)
hasta ver la pantalla final "¡Ronda completada!" sin errores en la consola
(F12 → Console). Antes del arreglo, el error aparece justo al pulsar
"Siguiente" tras el último ítem.

### A2. Teclas del "Teclado del móvil" por debajo del mínimo de 64 px (regla 2)

**Problema.** En `tools/keyboard-typing/styles.css`, la clase `.tecla` tiene
`min-height: 58px` (línea 86) y baja a `min-height: 44px` en la media query
`@media (max-width: 640px)` (línea 153). La regla 2 de `CLAUDE.md` exige
botones ≥ 64×64 px. Esto importa especialmente aquí: el modo "Teclado del
móvil" es el único teclado de esta herramienta que se toca de verdad
(ver `CLAUDE.md`, Estado actual), y justo en pantallas táctiles pequeñas es
donde la tecla se queda en 44 px.

**Cambio 1** — `tools/keyboard-typing/styles.css` línea 86: sustituir
`min-height: 58px` por `min-height: 64px`.

**Cambio 2** — misma hoja, línea 153 (dentro de `@media (max-width: 640px)`):
sustituir `min-height: 44px` por `min-height: 64px`.

**Verificar.** Abrir la herramienta en el navegador con la ventana estrecha
(≤ 640 px de ancho, o con el modo responsive de las DevTools a 375 px),
elegir "Teclado del móvil" y comprobar: (a) las teclas se ven y se pueden
tocar, (b) el teclado completo sigue cabiendo en pantalla sin scroll
horizontal. Si el teclado se desborda horizontalmente, NO recortes el
min-height otra vez: reduce el `gap` del contenedor del teclado o el
`max-width: 76px` de `.tecla`, y verifica de nuevo.

---

## PARTE B — Consistencia técnica (prioridad media)

### B1. `piano-teclas` usa la clase `fallo` en vez de la convención `animo`

**Problema.** Todo el proyecto usa la clase CSS `animo` para el feedback de
error amable (la genera `App.feedback.animo()` en `assets/js/feedback.js`).
`tools/piano-teclas/` es la única herramienta que usa una clase propia
`fallo` (definida en su `styles.css` línea 435 y usada 4 veces en su
`app.js`: líneas 368, 559, 578 y 657). Funciona, pero rompe la convención y
duplica estilos.

**Cambio.** En `tools/piano-teclas/app.js`, sustituir el string `'fallo'` por
`'animo'` en las 4 llamadas a `mostrarFeedback(...)` (líneas 368, 559, 578,
657). En `tools/piano-teclas/styles.css`, renombrar el selector
`.feedback.fallo` (línea 435) a `.feedback.animo`.

**No hagas más que eso**: no intentes migrar piano-teclas a
`App.feedback.acierto()/animo()` (su `mostrarFeedback()` local escribe en
varios contenedores distintos por id, el módulo compartido no cubre ese caso).

**Verificar.** `node --check tools/piano-teclas/app.js`. En el navegador:
en el modo "Simón dice", fallar a propósito una nota y comprobar que el
mensaje de ánimo aparece con fondo/color correcto (no en texto plano sin
estilo).

### B2. Carrera de voces TTS al arrancar

**Problema.** `assets/js/tts.js` llama a `cargarVoces()` una sola vez al
cargar (línea 36), pero la mayoría de navegadores rellenan
`speechSynthesis.getVoices()` de forma asíncrona (solo tras el evento
`voiceschanged`). Si el usuario pulsa 🔊 antes de ese evento, la utterance usa
la voz por defecto del navegador (acento posiblemente incorrecto). No crashea,
pero es mejorable con 2 líneas.

**Cambio** — `assets/js/tts.js`, justo después de la llamada existente a
`cargarVoces();` (línea 36), añadir:

```js
  if (typeof speechSynthesis !== 'undefined' && 'onvoiceschanged' in speechSynthesis) {
    speechSynthesis.onvoiceschanged = cargarVoces;
  }
```

**Verificar.** `node --check assets/js/tts.js`. En el navegador: recargar
cualquier herramienta y pulsar un botón 🔊 inmediatamente; debe hablar (con
cualquier voz) sin errores de consola.

### B3. Comentario de cabecera desfasado en `que-necesito`

**Problema.** El comentario de formato en `tools/que-necesito/data.js`
menciona un campo `answer` (`'answer' (= options[correct])`) que no existe en
los datos reales (los items solo tienen `text`, `options`, `correct`).

**Cambio.** En ese comentario de cabecera, eliminar la mención a `answer`,
dejando la descripción del formato como:
`items: [{ text, options: string[3], correct: indice }]`.

**Verificar.** `node --check tools/que-necesito/data.js`.

### B4. `historias` no documenta su variable de progresión (regla 13)

**Problema.** La regla 13 exige documentar en el comentario de cabecera de
`data.js` qué única variable de dificultad cambia entre niveles. En
`tools/historias/data.js` falta esa línea. Los datos reales sí cumplen la
regla (solo cambia el nº de viñetas por historia: 3 → 4 → 5), pero no está
escrito.

**Cambio.** Añadir al comentario de cabecera de `tools/historias/data.js` una
línea:
`Progresión (regla 13, un solo cambio por nivel): solo cambia el número de viñetas por historia (nivel 1: 3, nivel 2: 4, nivel 3: 5).`
(Comprueba primero contra los datos reales del archivo que esos números son
correctos; si no lo son, escribe los números reales que veas.)

**Verificar.** `node --check tools/historias/data.js`.

---

## PARTE C — Documentación desfasada (prioridad baja, sin riesgo)

### C1. Frase obsoleta en `CLAUDE.md` sobre los módulos teal y frambuesa

**Problema.** `CLAUDE.md` (sección "Cómo añadir una actividad nueva", paso 4)
dice "(Los módulos teal y frambuesa se activan en la Fase 6 de PLAN.md.)" —
pero la Fase 6 ya está hecha y hoy son de los módulos más poblados (9 y 5
herramientas). La frase confunde: parece que siguen inactivos.

**Cambio.** Sustituir esa frase entre paréntesis por:
`(Los 6 módulos están activos desde la Fase 6.)`

### C2. Secciones "PENDIENTE" obsoletas en `PLAN-I18N.md`

**Problema.** `PLAN-I18N.md` tiene al principio (líneas ~22-36) una tabla
"PENDIENTE — es lo que hay que hacer" con las fases 1-7 sin marcar, pero su
propia sección §5 "Progreso" (líneas ~283-290) las da todas por completadas.
Además la nota de las líneas ~308-311 sobre "gap preexistente" de
piano-teclas en `sw.js` ya no es cierta (piano-teclas está cacheado desde
hace tiempo).

**Cambio 1.** Encima de la tabla PENDIENTE, añadir una línea:
`> NOTA (2026-07-07): esta tabla quedó obsoleta — todas las fases están completadas, ver §5 Progreso. Se conserva solo como registro del plan original.`

**Cambio 2.** En la nota del gap de piano-teclas, añadir al final:
`(RESUELTO después: piano-teclas está en sw.js desde su integración completa, ver CLAUDE.md.)`

No borres las secciones: este proyecto conserva los planes como registro.

### C3. Checklist de la FASE 5 de `PLAN.md` sin marcar

**Problema.** `PLAN.md` §5 FASE 5 tiene 11 casillas de verificación final
todas sin marcar, pero gran parte de esa verificación se ha ido haciendo con
Playwright a lo largo de las sesiones (jugabilidad sin errores de consola,
persistencia, i18n). Otras siguen genuinamente pendientes (prueba manual en
móvil real, revisión de contraste AA sistemática, revisión de Lectura Fácil
por un humano).

**Cambio.** No marques casillas que no puedas demostrar. Añade una línea justo
debajo del encabezado de FASE 5:
`> Estado 2026-07-07: lo automatizable se verifica con Playwright en cada cambio (consola limpia, rondas completas, i18n, persistencia). Sigue pendiente la pasada manual: móvil real, contraste AA sistemático y revisión humana de Lectura Fácil.`

---

## PARTE D — Producto (REQUIERE APROBACIÓN DEL USUARIO — no empezar sin ella)

Hallazgos de producto, en orden de valor. Son propuestas, no tareas: presenta
esta lista al usuario y que él elija.

### D1. ✔ Resuelto de facto (sin acción propia) — El módulo Emociones es el más pequeño

Recuento en 2026-07-07: Coordinación 5, Autonomía/hogar 10, Memoria 4,
Razonamiento 9, Lenguaje 5, **Emociones 3** (emociones, calma, entre-amigos).
No se ejecutó la propuesta genérica de D1 tal cual porque **E4
(`tools/mi-cuerpo-avisa/`)** le da a Emociones su 4ª herramienta con una base
clínica más sólida (interocepción, no solo un registro de emoción) — ver E4
más abajo. Emociones ya no es el módulo más pequeño.

### D2. Backlog transversal ya priorizado en `PLAN.md` §7

Ítems que el propio proyecto tiene apuntados, de más a menos encajable para
un agente:

1. **✔ Hecho — Ajustes de usuario** (tamaño de letra, sonidos on/off):
   sección nueva "Preferencias de la persona usuaria" en `/ajustes/`,
   aplicada una sola vez en el núcleo compartido (`--escala-texto` en
   `tokens.css`, leída y aplicada por `storage.js` en toda página, sonidos
   respetados por `feedback.js`). Commit `b12d85f`.
2. **Pendiente** — Pictogramas ARASAAC locales (licencia CC BY-NC-SA, citar
   autoría) para sustituir emojis donde la precisión importa (rutinas,
   categorías, emociones): trabajo mecánico pero voluminoso; requiere
   descargar assets. No ejecutado.
3. **✔ Hecho** — Modo cuidador: nueva sección "Progreso por actividad" en
   `/ajustes/`, vista de solo lectura con las estrellas guardadas de las 53
   actividades agrupadas por módulo (igual que las tablas de `/equipo/`,
   filas estáticas en el HTML con `data-tool="<slug>"`; JS solo rellena el
   texto — "⭐ N" o "Sin empezar" — sin generar el catálogo). `/equipo/`
   enlaza a esta vista desde "Progreso y privacidad". Verificado con
   Playwright: 53 celdas, todas "Sin empezar" en limpio, dos claves
   sembradas en localStorage se reflejan correctamente tras recargar, sin
   errores de consola. `sw.js` v52→v53 (solo contenido, ningún archivo
   nuevo).
4. **Pendiente** — Multi-perfil local y dificultad adaptativa: los más
   grandes; requieren diseño previo con el usuario, no empezar en frío. No
   ejecutado.

### D3. ✔ Hecho — Hueco de la taxonomía: "codificación/decodificación"

`PLAN.md` §4.1 marcaba `Razonamiento: codificación/decodificación` como `⏳`
(patrones nivel avanzado símbolo→letra) sin completar pese a que la Ola 3 se
dio por cerrada. Ejecutado: `tools/patrones/` nivel 4 "Descifra el código" —
mismo motor de completar secuencia (sin tocar `app.js`), 12 series donde cada
patrón repite un par [símbolo, letra] dos veces completas y pide la letra que
falta (p. ej. ★ A ● B ★ A ● ❓ → B). Regla 13: única variable respecto al
nivel 3 es el tipo de contenido a decodificar. Commit `b12d85f`, verificado
con Playwright (nivel 4 selecciona bien, opciones correctas, explicación
correcta).

---

## PARTE E — Revisión de terapia ocupacional (propuestas clínicas)

Revisión del catálogo con criterio de terapia ocupacional para discapacidad
intelectual. Marco: la app cubre bien motricidad, cognición y varias AVD
instrumentales (dinero con `monedero`, tiempo con `reloj`, hogar con
`la-casa`/`rutinas`, contexto laboral con `lista-tareas`), y muy bien la
seguridad digital (`chat-seguro`, `chat-acoso`). Los huecos reales, por orden
de impacto en la vida independiente de la persona:

- **Movilidad comunitaria y seguridad en la calle**: no hay ni una actividad
  sobre desenvolverse fuera de casa (cruzar, transporte, perderse). Es de los
  objetivos nº 1 en terapia ocupacional para vida independiente.
- **Respuesta a emergencias / pedir ayuda**: "cuéntaselo a un adulto" aparece
  en los chats, pero no existe la habilidad concreta de reconocer una
  emergencia y saber llamar al 112 y decir quién eres y dónde estás.
- **Interocepción / autorregulación**: `emociones` trabaja reconocer emociones
  en otros y `calma` da una técnica, pero falta el puente: notar las señales
  del propio cuerpo (hambre, sed, dolor, cansancio, nervios) y elegir qué
  hacer. En discapacidad intelectual esta es la base de la autonomía en salud.
- **Generalización**: el riesgo clínico clásico de cualquier app es que la
  habilidad se quede en la pantalla. El equipo de apoyo necesita saber cómo
  trasladar cada actividad a la vida real.

Ordenadas de más baratas a más caras. E1 y E2 son ejecutables directamente
(bajo riesgo, sin producto nuevo); E3-E6 son herramientas nuevas y **requieren
aprobación del usuario** como la Parte D.

### E1. [Ejecutable] Columna "Cómo trasladarlo al día a día" en `/equipo/`

**Justificación clínica.** Sin práctica en el entorno real, lo aprendido en
pantalla no se transfiere (generalización — la limitación más documentada del
entrenamiento con apps en discapacidad intelectual). La guía del equipo de
apoyo (`equipo/index.html`) hoy dice qué hace cada actividad y qué trabaja,
pero no cómo continuar el trabajo fuera de la app.

**Cambio.** En `equipo/index.html`, añadir a cada tabla de módulo una cuarta
columna `<th>` "En el día a día" con UNA sugerencia concreta y breve por
actividad para el acompañante. Ejemplos del tono esperado (frase única,
imperativa, dirigida al adulto de apoyo):
- Mis Rutinas → "Imprimid o copiad la rutina y colgadla donde se hace (baño, cocina)."
- Monedero → "Dejad que pague en efectivo compras pequeñas reales."
- La Casa → "Haced la tarea real justo después de practicarla en la app."
- Chat Acoso → "Acordad quién es la persona de confianza a la que contarle algo."
- Lista de Tareas → "Escribid juntos la lista de tareas real de mañana."
Escribir las 36 (una por actividad, en español; `/equipo/` no está
internacionalizado, es solo para el equipo de apoyo). Mantener lenguaje llano.

**Verificar.** Abrir `/equipo/` en el navegador: las 6 tablas tienen 4
columnas y ninguna celda queda vacía.

### E2. [Ejecutable] Pausas sin presión: aviso amable de descanso

**Justificación clínica.** La app dosifica bien dentro de la ronda (cortas,
con refuerzo), pero no hay ninguna señal de descanso entre rondas: una persona
con poca autorregulación puede encadenar rondas en bucle hasta la fatiga o
frustración. En terapia ocupacional la dosificación de la sesión es parte del
tratamiento.

**Cambio.** En `assets/js/feedback.js`, dentro de `celebrar()` (que ya se
llama al completar cada ronda), llevar una cuenta de rondas por sesión de
página (variable de módulo, NO localStorage — debe reiniciarse al recargar).
Cada 5 rondas completadas, añadir al mensaje de celebración una frase de
descanso desde una clave i18n compartida nueva en `assets/js/i18n.js`
(bloque `core`), p. ej.:
- es: `core.descanso: '¡Llevas un buen rato! Puedes descansar si quieres.'`
- en: `core.descanso: 'You have been playing a while! You can rest if you want.'`
**Prohibido**: bloquear el juego, poner cuenta atrás, atenuar la pantalla o
cualquier cosa que se parezca a un castigo o a presión (regla 5). Es solo una
frase más en la celebración, con su mismo audio.

**Verificar.** Completar 5 rondas seguidas de cualquier actividad: en la 5ª,
la celebración incluye la frase de descanso; en la 6ª ya no (contador
reiniciado o umbral solo en múltiplos de 5 — elegir múltiplos de 5). Recargar
la página reinicia la cuenta. `node --check` en los 2 archivos tocados.

### E3. ✔ Hecho — Herramienta nueva: "La Calle" (movilidad comunitaria)

Situaciones de calle y transporte con el motor de `situaciones` (clon, como
se hizo con `que-primero`): cruzar con semáforo y sin él, esperar el autobús,
qué hacer si te pierdes (parar, no alejarse, pedir ayuda a policía o
dependiente, enseñar tu tarjeta de identificación), a quién sí/no seguir.
2 niveles (regla 13: nivel 1 situaciones muy claras, nivel 2 menos claras,
mismas 3 opciones). Módulo Autonomía/hogar. Es la extensión natural del
catálogo actual hacia fuera de casa.

### E4. ✔ Hecho — Herramienta nueva: "Mi cuerpo me avisa" (interocepción)

El cuerpo manda una señal (con picto): tripa que suena, boca seca, ojos que se
cierran, dolor de cabeza, corazón acelerado… y la persona elige entre 3 qué
hacer (comer algo / beber agua / descansar / avisar a alguien si duele).
Motor de `que-necesito` (clon). Módulo Emociones (le da una 4ª herramienta al
módulo más pequeño y conecta `emociones` con `calma`: notar → actuar).

### E5. ✔ Hecho — Herramienta nueva: "Emergencias" (pedir ayuda)

Dos partes con motores ya existentes: (a) quiz con motor de `situaciones`
para distinguir emergencia de no-emergencia ("se quema la sartén" vs "no
encuentro el mando") y qué hacer en cada caso; (b) práctica guiada de llamar:
pantalla de teléfono simulada donde marcar 112 y una secuencia con el motor
de `la-casa` para ordenar qué decir (mi nombre → qué pasa → dónde estoy).
Módulo Autonomía/hogar. Nota de seguridad: dejar clarísimo en Lectura Fácil
que 112 solo se llama en emergencias de verdad — incluir esa distinción como
contenido del quiz, no solo como aviso.

### E6. ✔ Hecho — Herramienta nueva: "La Compra" (AVD instrumental)

Clasificar productos por sección del supermercado (frutería, carnicería,
limpieza…) con el motor de `donde-lo-guardo`/`categorias`, y un nivel 2 que
reutilice el patrón de lista acumulativa de `partes-del-dia` para "construir
la lista de la compra" del menú del día. Cierra el ciclo con `monedero`
(pagar) y `la-casa` (cocinar/guardar): la cadena completa de una AVD
instrumental real.

**Nota transversal para E3-E6**: seguir la receta de `SPEC.md` §4, el patrón
de commits de las herramientas recientes (`git log --oneline -10`), y las 13
reglas de `CLAUDE.md` (en especial 11-13). Cada herramienta nueva: 5 archivos,
tarjeta en `site/index.html` + claves en `site/strings.js`, `sw.js` ARCHIVOS
+ VERSION, fila en `equipo/index.html` (con la columna de E1 si ya existe),
fila en `PLAN.md`, estado en `CLAUDE.md`, conteo en `README.md`/`SPEC.md`,
y verificación Playwright en ambos idiomas.

---

## PARTE F — Revisión de experto tecnológico (presupuesto cero, producto simple)

Criterio: sin backend, sin frameworks, sin servicios de pago, sin añadir
superficie de producto que haya que mantener. Solo mejoras que refuercen lo
que la app ya promete (funciona offline, sin datos personales, progreso que
persiste) usando lo que ya hay. Ordenadas por valor/coste.

**Descartado a propósito** (decisión experta, no olvido): unificar los motores
de quiz clonados en un módulo compartido (violaría el principio "cada
herramienta funciona aislada" de `CLAUDE.md` y su regla de no hacer refactors
masivos — la mitigación correcta y barata es F3); bundlers/TypeScript/test
frameworks (el proyecto prohíbe build step y dependencias npm); analítica de
uso (rompería la promesa de privacidad); login/backend (coste y complejidad).

### F1. [Ejecutable] Exportar e importar el progreso en `/ajustes/`

**Justificación.** Todo el progreso vive SOLO en `localStorage`: si el
navegador borra datos (limpieza automática, modo invitado, cambio de
dispositivo), la persona pierde todas sus estrellas — su moneda de motivación
— sin remedio. Es el único punto de pérdida de datos real de la app y se
arregla sin backend.

**Cambio.** En `/ajustes/` (página oculta ya existente), añadir una sección
"Copia de mi progreso" con dos acciones:
1. **Guardar copia**: recorre `localStorage`, toma todas las claves que
   empiezan por `apptonomia:`, y descarga un archivo
   `apptonomia-progreso.json` (usar `Blob` + `URL.createObjectURL` + un `<a
   download>` programático; sin librerías).
2. **Recuperar copia**: un `<input type="file" accept=".json">`; al elegir
   archivo, parsearlo con try/catch, validar que TODAS sus claves empiezan
   por `apptonomia:` (si no, mostrar error amable y no tocar nada), y
   escribirlas en `localStorage` con confirmación en dos pasos (mismo patrón
   de doble confirmación que ya usan los borrados de esa página).
Seguir el estilo visual y de Lectura Fácil de la página. Texto solo en
español (como el resto de `/ajustes/`).

**Verificar.** Jugar algo, guardar copia, borrar todo desde `/ajustes/`,
recuperar la copia, comprobar que las estrellas vuelven (recargar la landing
y una herramienta). Probar también un JSON inválido: debe rechazarse sin
romper nada.

### F2. [Ejecutable] Autoalojar las fuentes (quitar la única dependencia externa)

**Justificación.** Google Fonts es la ÚNICA petición externa de la app. Eso
significa: (a) offline —la razón de ser de la PWA— la tipografía degrada al
fallback del sistema, porque `sw.js` no puede cachear ese origen cruzado con
su estrategia actual; (b) cada carga hace peticiones a Google, cuando la app
promete cero rastreo. Ambas fuentes (Atkinson Hyperlegible y Nunito) tienen
licencia SIL OFL: autoalojarlas es legal y gratis.

**Cambio.**
1. Descargar los `.woff2` (subset latin) de Atkinson Hyperlegible 400/700 y
   Nunito 400/700/800 y guardarlos en `assets/fonts/` (5 archivos).
2. Crear las reglas `@font-face` al principio de `assets/css/base.css`
   apuntando a `../fonts/*.woff2` con `font-display: swap`.
3. Quitar las 3 líneas de Google Fonts (`preconnect` ×2 + `<link href=
   "https://fonts.googleapis.com/css2...">`) de TODAS las páginas: 36
   `tools/*/index.html` + `site/index.html` + `equipo/index.html` +
   `ajustes/index.html` (usar grep para encontrarlas todas; son idénticas).
4. Añadir los 5 archivos de fuente a `ARCHIVOS` en `sw.js`.

**Verificar.** Grep: cero apariciones de `fonts.googleapis` en el repo. En el
navegador con DevTools → Network: cargar la landing y una herramienta y
comprobar que no hay ninguna petición a dominios externos y que la tipografía
se ve igual (no serif del sistema).

### F3. [Ejecutable] Script de comprobación estructural `scripts/check.js`

**Justificación.** "No hay tests automatizados ni linter" (`CLAUDE.md`) y los
motores se clonan entre herramientas: el bug A1 de este mismo plan (la-frase
y palabras crasheando al fin de ronda) es exactamente el tipo de deriva que
un chequeo estructural barato habría cazado. Un solo script Node **sin
dependencias** codifica las comprobaciones de la auditoría para siempre.

**Cambio.** Crear `scripts/check.js` (Node puro, sin npm install) que:
1. Ejecute el equivalente de `node --check` (usar `new Function` no — usar
   `child_process` con `node --check`) sobre todos los `.js` de `tools/`,
   `site/`, `assets/js/` y falle listando los que no parsean.
2. Verifique que cada carpeta `tools/<slug>/` tiene exactamente los 5
   archivos canónicos.
3. Verifique paridad `sw.js` ↔ disco: toda ruta de `ARCHIVOS` existe, y todo
   archivo de herramienta está en `ARCHIVOS`.
4. Verifique en cada `tools/*/strings.js` que los bloques `es` y `en`
   definen exactamente el mismo conjunto de claves (parsear con regex simple
   o `require()` tras stub de `App.i18n.register` — más fiable: crear un
   objeto global `App` falso con `vm.runInContext`, patrón ya usado en las
   verificaciones de esta sesión).
5. Verifique paridad de catálogo: cada `tools/<slug>/` tiene tarjeta en
   `site/index.html` (buscar `href="../tools/<slug>/`), y viceversa.
Salida: lista de fallos con archivo exacto, exit code 1 si hay alguno, "OK
(N checks)" si no. Documentar en `README.md` (sección de comandos):
`node scripts/check.js`.

**Verificar.** Ejecutarlo: debe salir OK. Romper algo a propósito (quitar
temporalmente una línea de `sw.js`), ejecutarlo: debe fallar señalándolo.
Deshacer la rotura.

### F4. [Ejecutable] Mantener la pantalla encendida durante la actividad (Wake Lock)

**Justificación.** El público de la app responde despacio. En tablet/móvil,
la pantalla se apaga a mitad de ejercicio si la persona tarda en decidir —
interrupción y desorientación gratuitas. La Screen Wake Lock API lo evita
con ~15 líneas, es mejora progresiva (si el navegador no la soporta, no pasa
nada) y solo actúa mientras la pestaña está visible.

**Cambio.** En `assets/js/utils.js`, añadir un bloque autocontenido:
- En el primer `pointerdown` del documento (los navegadores exigen gesto de
  usuario), pedir `navigator.wakeLock.request('screen')` dentro de
  try/catch; guardar el sentinel.
- En `visibilitychange` a visible, volver a pedirlo (el lock se libera solo
  al ocultar la pestaña).
- Todo envuelto en `if ('wakeLock' in navigator)`; cero cambios por
  herramienta (utils.js ya se carga en todas las páginas).

**Verificar.** `node --check assets/js/utils.js`; en navegador de escritorio
basta comprobar que no hay errores de consola al interactuar (el efecto real
solo se aprecia en móvil/tablet).

### F5. [Con aprobación] Publicación gratuita con HTTPS real

La app ya es una PWA instalable, pero solo con HTTPS real. Hay dos caminos
gratis y el proyecto ya tiene `.firebaserc` (proyecto `apptonomia`):
`firebase deploy` al hosting gratuito de Firebase, o GitHub Pages si el repo
se sube a GitHub. Requiere aprobación del usuario porque publica contenido
en un servicio externo. Sin esto, todo el trabajo de PWA/offline solo
beneficia a quien sepa levantar un servidor local.

---

## PARTE G — Segunda revisión tecnológica (2026-07-10, presupuesto cero, simple)

Contexto: en tres días la app pasó de 36 a 49 actividades, con el usuario y
varias sesiones de agente trabajando EN PARALELO sobre el mismo repo. Los
hallazgos de abajo no son teóricos: cada uno corresponde a un incidente real
de esta semana. Criterio idéntico a la Parte F: nada de backend, frameworks
ni dependencias; solo reforzar lo que ya existe.

**Descartado a propósito** (mantener simple): actualizaciones diferenciales
del Service Worker (la app entera pesa poco, cache-first completo vale);
buscador en la portada (6 módulos con anclas bastan); framework de tests
(check.js sin dependencias cumple).

### G1. [Ejecutable] Ampliar `scripts/check.js` con los 3 huecos demostrados

**Justificación.** El checker ya evitó un desastre (detectó 12 fallos de
registro de domino/senales), pero esta semana se colaron por sus huecos:
(a) constructores/domino/senales faltaban en `equipo/index.html` y el checker
dio OK; (b) el conteo de actividades de `README.md`/`SPEC.md` se quedó
desactualizado VARIAS veces (36→48 se corrigió a mano cinco veces);
(c) el crash de la-frase/palabras (`DATA.porRonda` con `DATA` partido es/en)
es un patrón detectable mecánicamente y hay 40+ clones donde puede reaparecer.

**Cambio.** Añadir a `scripts/check.js` tres comprobaciones:
1. **Paridad con equipo/**: para cada `tools/<slug>/`, leer el `title` de su
   `strings.js` (bloque es, sin el emoji inicial) y comprobar que aparece
   como texto en alguna celda `<td>` de `equipo/index.html`. Avisar también
   del caso inverso solo si es barato (no obligatorio).
2. **Conteos sincronizados**: extraer el número de `## Actividades (N)` en
   `README.md` y de `(N actuales)` en `SPEC.md` y compararlos con el número
   real de carpetas en `tools/`. Fallo si no coinciden.
3. **Lint del patrón porRonda** (clase del bug A1): para cada herramienta,
   si su `data.js` define `es:` y `en:` al nivel superior Y su `app.js`
   contiene `DATA.porRonda`, fallo con mensaje "usar banco().porRonda".
   (Regex simple sobre el texto es suficiente; no hace falta ejecutar nada.)

**Verificar.** `node scripts/check.js` debe seguir dando OK. Romper cada
caso a propósito (quitar una fila de equipo, cambiar un conteo, poner
`DATA.porRonda` en un app.js con data es/en), comprobar que falla con el
mensaje correcto, y deshacer.

### G2. [Confirmar con el usuario] Borrar `temp_original_data.js` de la raíz

**Justificación.** Es una copia de seguridad temporal del `data.js` de
Atrapa, en UTF-16 (se ve corrupta con herramientas normales), committeada en
la raíz del repo — y como `firebase.json` no la excluye, **se publica en el
hosting** con cada deploy. El archivo original ya está en su sitio
(`tools/atrapa/data.js`), así que la copia no aporta nada.

**Cambio.** Confirmar con el usuario que no la necesita (la creó él) y
entonces: `git rm temp_original_data.js` + añadir `temp_*` a `.gitignore`.

### G3. [Ejecutable] Anclas de módulo en la portada

**Justificación.** La portada tiene ya 49 tarjetas grandes en una sola
columna de scroll: para el público de la app, llegar al módulo de Emociones
son 40+ tarjetas de desplazamiento. Seis botones-ancla arriba (uno por
módulo, con su emoji y color) reducen eso a un toque, sin cambiar nada de la
estructura ni añadir estado.

**Cambio.** En `site/index.html`, tras la cabecera: una fila de 6 botones
`<a href="#mod-N">` con el emoji y nombre corto del módulo (claves `mod1..6`
ya existentes en strings.js); poner `id="mod-N"` a cada
`<section class="modulo">`. CSS: fila con `flex-wrap`, botones ≥64px,
`scroll-behavior: smooth` respetando `prefers-reduced-motion` (media query
que lo desactive). Verificar con Playwright que cada ancla desplaza a su
módulo y que el foco por teclado los alcanza (son enlaces normales).

### G4. [Ejecutable] Nota de coordinación entre sesiones en `CLAUDE.md`

**Justificación.** El usuario trabaja con varias sesiones de agente en
paralelo: esta semana una sesión commiteó el trabajo de otra a medias
(`dc76398`), y hubo tres herramientas completas sin registrar durante horas.
No se puede impedir, pero sí abaratar la reconciliación.

**Cambio.** Añadir a `CLAUDE.md` (sección Comandos o nueva "Coordinación")
tres líneas: al EMPEZAR cualquier sesión, ejecutar `git status` +
`git log --oneline -3` + `node scripts/check.js`; si hay archivos sin
registrar o fallos, reconciliar ANTES de construir nada nuevo; no asumir que
el estado del repo coincide con la última conversación.

### G5. [Con aprobación] Smoke-test genérico de las 49 actividades

Un `scripts/smoke.js` que abra cada herramienta con Playwright en ambos
idiomas, pulse el primer nivel/botón de inicio y falle si hay errores de
consola. Cubriría de golpe la clase de bug "carga pero revienta al empezar".
Requiere aprobación porque Playwright tendría que entrar como devDependency
(hoy se usa desde el caché de npx del desarrollador, no está en
`package.json`) — decisión de política del repo, no técnica.

---

## Orden de ejecución resumido

| # | Tarea | Riesgo | Archivos |
|---|-------|--------|----------|
| 1 | A1 fix porRonda | Nulo (2 líneas) | la-frase/app.js, palabras/app.js |
| 2 | A2 teclas 64px | Bajo (verificar layout móvil) | keyboard-typing/styles.css |
| 3 | B1 fallo→animo | Nulo (rename) | piano-teclas/app.js + styles.css |
| 4 | B2 onvoiceschanged | Nulo (2 líneas) | assets/js/tts.js |
| 5 | B3+B4 comentarios | Nulo (solo comentarios) | que-necesito/data.js, historias/data.js |
| 6 | C1+C2+C3 docs | Nulo (solo .md) | CLAUDE.md, PLAN-I18N.md, PLAN.md |
| 7 | E1 columna "En el día a día" | Nulo (solo /equipo/, contenido nuevo) | equipo/index.html |
| 8 | E2 aviso de descanso | Bajo (2 archivos compartidos) | assets/js/feedback.js, assets/js/i18n.js |
| 9 | F1 exportar/importar progreso | Bajo (solo /ajustes/) | ajustes/index.html + su js |
| 10 | F2 fuentes autoalojadas | Medio (toca ~40 HTML, mecánico) | assets/fonts/, base.css, todos los index.html, sw.js |
| 11 | F3 scripts/check.js | Nulo (solo tooling dev) | scripts/check.js, README.md |
| 12 | F4 Wake Lock | Nulo (~15 líneas progresivas) | assets/js/utils.js |
| 13 | Subir VERSION sw.js v40→v41 | Nulo | sw.js |
| 14 | Parte D, E3-E6 y F5 | — | Solo con aprobación del usuario |

Parte G (pendiente, 2026-07-10):

| # | Tarea | Riesgo | Archivos |
|---|-------|--------|----------|
| G1 | ✔ Hecho — check.js: paridad equipo + conteos + lint porRonda | Nulo (tooling dev) | scripts/check.js |
| G2 | ✔ Hecho — Borrado temp_original_data.js + temp_* en .gitignore | Nulo (usuario confirmó) | raíz + .gitignore |
| G3 | ✔ Hecho — Anclas de módulo en la portada | Bajo (solo HTML/CSS) | site/index.html, site/styles.css |
| G4 | ✔ Hecho — Nota de coordinación entre sesiones | Nulo (solo docs) | CLAUDE.md |
| G5 | ✔ Hecho — scripts/smoke.js + playwright devDependency | Bajo (usuario aprobó la devDependency) | package.json, scripts/smoke.js |

Commit G1/G3/G4: `39a1eba` (2026-07-10). G2/G5: commit siguiente, mismo día
(usuario aprobó ambos explícitamente). `node scripts/smoke.js` (49
actividades × es/en = 98 pruebas) pasó limpio en la primera ejecución tras
crearlo — verificado además rompiendo `tools/atrapa/app.js` a propósito
para confirmar que el runner detecta un crash real antes de confiar en él.

Verificado: `node scripts/check.js` → OK (304 checks), y cada uno de los
3 checks nuevos de G1 probado rompiendo el caso
real primero. Anclas verificadas con Playwright en ES/EN.
