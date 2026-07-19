# Guía para crear actividades / herramientas

> **Cómo diseñar y construir una actividad nueva en Apptonomia aplicando las
> reglas de producto de [`SPEC.md`](SPEC.md) §3, las 13 reglas de
> accesibilidad de [`tecnico.md`](tecnico.md) §5, la receta técnica de
> §9, y un conjunto de técnicas de **didáctica**, **gamificación**,
> **persuasión** y **neuromarketing** adaptadas a personas con discapacidad
> intelectual.
>
> Este documento **no sustituye** a [`tecnico.md`](tecnico.md): cuando una
> regla choque, prevalece la fuente canónica técnica. Esta guía aporta la
> capa **pedagógica, comunicativa y emocional** que `tecnico.md` no cubre.

---

## 1. Principios que nunca se rompen

Antes de crear nada, vuelve a leer y tener presente:

| Documento | Qué recordar |
|---|---|
| [`SPEC.md` §3.1](SPEC.md) | El error nunca castiga; pista antes de respuesta (método socrático). |
| [`SPEC.md` §3.2](SPEC.md) | Sin cronómetros visibles ni presión temporal. |
| [`SPEC.md` §3.3](SPEC.md) | Lectura Fácil siempre. |
| [`SPEC.md` §3.4](SPEC.md) | Sin datos personales; progreso solo en `localStorage`. |
| [`SPEC.md` §3.5](SPEC.md) | Accesibilidad universal. |
| [`tecnico.md` §5](tecnico.md) | Las **13 reglas obligatorias** (resumidas en §3 de esta guía). |
| [`tecnico.md` §9](tecnico.md) | Receta técnica para crear la actividad. |

---

## 2. Cómo debe ser una actividad

Una actividad de Apptonomia debe ser **autónoma** (usable sin profesional),
**segura emocionalmente**, **progresiva** (una variable nueva por nivel) y
**significativa** (lo que se practica conecta con la vida diaria).

### 2.1 Rasgos obligatorios

1. **Didáctica clara**: cada pantalla tiene **una sola idea** y un objetivo
   explícito en lenguaje cotidiano.
2. **Socrática**: nunca se da la respuesta directamente. Primer fallo →
   `mostrarPista()`; segundo fallo → `mostrarExplicacion()` (ver
   [`tecnico.md` §9 paso 3](tecnico.md)).
3. **Gamificada con moderación**: refuerzo positivo, sin castigos, sin
   "game over", sin restar puntos. Las estrellas se suman, no se quitan.
4. **Concreta**: la persona sabe qué ha hecho bien sin tener que
   interpretar mensajes abstractos.
5. **Repetible**: el progreso se guarda en `localStorage` y la ronda es
   aleatoria para que practicar no se agote.
6. **Persistente y mínimo**: solo se guardan `estrellas` y `completados`,
   más — como excepción justificada — un **historial corto sin datos
   personales** (≤ 30 días, p. ej. `tools/emotions/` guarda
   `[{fecha, idEmocion}]` para no repetir preguntas). Nunca se guardan
   fallos, tiempos, intentos ni datos identificables.

### 2.2 Lo que la actividad **no** debe hacer

- Decir **"incorrecto"** o **"te has equivocado"** → usar `App.feedback.encourage()`.
- Mostrar **cronómetros** en pantalla, ni medir el tiempo visiblemente.
- Pedir **datos personales** ni enviar nada a internet.
- Usar **lenguaje clínico** en la interfaz (ver [`SPEC.md` §3.3](SPEC.md)).
- Saturar la pantalla: máximo 4–6 opciones (§5 regla 10) y 3 opciones en
  un quiz (regla 11).

---

## 3. Checklist rápido de las 13 reglas de accesibilidad

Resumen operativo (fuente completa: [`tecnico.md` §5](tecnico.md)):

| # | Regla | Cómo verificarla |
|---|---|---|
| 1 | Lectura Fácil | Frases cortas; una idea por frase; sin tecnicismos. |
| 2 | Botones ≥ 64×64 px, separación ≥ 16 px | Medir con DevTools el `.btn` de la actividad. |
| 3 | Alto contraste WCAG AA | Comprobar el color del módulo sobre `--color-superficie`. |
| 4 | Audio en todo texto importante | Botón 🔊 con `App.tts.speak()` en cada `data-i18n`. |
| 5 | Sin presión | Cero cronómetros; cero "game over". |
| 6 | Refuerzo positivo | `App.feedback.success()` al acertar. |
| 7 | `prefers-reduced-motion` | Animaciones se reducen o eliminan en ese modo. |
| 8 | Teclado completo | `Tab` recorre, `Enter` activa, foco visible. |
| 9 | ARIA | `aria-label` en botones de icono y `role`/`aria-live` en feedback. |
| 10 | 4–6 opciones máx. | Contar `<button>` por pantalla de juego. |
| 11 | Quiz: 3 opciones + explicación | Ver `data.js` del quiz. |
| 12 | Método socrático | Contador `intentos` → pista en 1, explicación en 2. |
| 13 | Progresión gradual | Cada nivel cambia **una sola variable**. |

> **Excepciones conocidas y legítimas**: la regla 12 admite un **tercer
> escalón de auto-resolución** solo en puzzles con manipulación física
> directa (ver `tools/fit/app.js:223-225`: "La pieza encaja así. Ya
> está colocada") para cumplir la regla 11 ("nadie se queda atascado").
> Este escalón documenta la pieza ya colocada y se acepta como ayuda
> final, no como corrección silenciosa.

---

## 4. Diseño paso a paso

Sigue este orden **antes** de tocar código. Saltarse pasos suele terminar
refactorizando a posteriori.

### Paso 1 · Definir el objetivo terapéutico

Responde en una sola frase:

> *«Con esta actividad la persona va a practicar ______ para ______ en su
> vida diaria.»*

Ejemplos (reales del catálogo):

- «Practicar la **clasificación de palabras por categoría semántica**
  para desenvolverse mejor en conversaciones cotidianas»
  (`tools/categories/`).
- «Practicar **la suma y la descomposición del 10** para resolver cálculos
  mentales del día a día» (`tools/math-tables/`).
- «Practicar **el seguimiento de una rutina de mañana** para ganar
  autonomía al prepararse solo/a» (`tools/routines/`).

Si el objetivo no se puede enunciar así, vuelve a pensarlo. Una actividad
sin objetivo claro se convierte en un juego sin aprendizaje.

### Paso 2 · Elegir módulo y ver cobertura

Abre [`equipo.md`](equipo.md) y comprueba si el área ya está cubierta y
dónde. No dupliques: si existe una actividad muy parecida, **mejórala**
en lugar de crear otra nueva.

### Paso 3 · Escribir la mecánica con palabras

Antes de HTML, describe en 5–10 líneas:

1. ¿Qué ve la persona al entrar?
2. ¿Qué tiene que hacer?
3. ¿Cómo sabe que ha acertado?
4. ¿Qué pasa si falla?
5. ¿Cuándo termina la ronda y qué siente al terminar?

Si la mecánica no se entiende escrita, no se entenderá en pantalla.

### Paso 4 · Diseñar la progresión (regla 13)

Cada nivel **cambia una sola variable** respecto al anterior. Elige la
variable antes de tocar `data.js`:

- **Cantidad**: nivel 1 tiene 2 categorías, nivel 2 tiene 3, nivel 3
  mantiene 3 y afina la dificultad semántica.
  (Ejemplo: [`tools/categories/data.js`](../../tools/categories/data.js).)
- **Tamaño del estímulo**: número de piezas, número de dígitos, longitud
  de la palabra.
- **Tiempo de exposición**: cuántas cosas se ven a la vez.
- **Tipo de distractores**: cuán "parecidos" son entre sí.

Nunca cambies **dos** variables a la vez: la persona no sabrá qué le ha
costado más y se frustra.

### Paso 5 · Pensar el banco de datos

- Mínimo **25 casos** para simulaciones/entrenamiento (ver
  [`tecnico.md` §7](tecnico.md)).
- Datos en `data.js` (`var DATA = { es: {...}, en: {...} }`), **nunca**
  textos de UI en `data.js`.
- Pictogramas iguales en ambos idiomas; lo que cambia es la palabra.

### Paso 6 · Escribir los textos (`strings.<locale>.js`)

- Frases de **máximo 12 palabras** en la `instruccion`.
- Una sola idea por frase en `pista` y `explicacion`.
- Tono cálido, segunda persona ("Toca", "Mira", "Busca").
- Evitar imperativos negativos ("No pulses aquí").
- Emojis solo cuando **acompañan** un texto que también se entiende sin
  emoji (no todo el mundo distingue todos los emojis; algunos se leen mal
  en voz alta con TTS).

### Paso 7 · Implementar la lógica con el patrón socrático

Copia el patrón de [`tools/categories/app.js`](../../tools/categories/app.js)
líneas ~120–160: un contador `intentos`, `mostrarPista()` en el primer
fallo, `mostrarExplicacion()` en el segundo. **Nunca** des la respuesta
correcta en el primer fallo.

### Paso 8 · Audio y feedback

- `App.tts.speak(App.i18n.t('instruccion'))` al entrar en cada pantalla.
- `App.feedback.success(el)` al acertar.
- `App.feedback.encourage(el)` al fallar (mensaje de **ánimo**, no de error).

### Paso 9 · Persistencia y registro

- Guardar en `App.storage.get/set('<slug>')` solo `estrellas` y
  `completados` (contrato [`tecnico.md` §7](tecnico.md)).
- Registrar la actividad en los **6 puntos canónicos** enumerados en
  [`tecnico.md` §9 paso 8](tecnico.md).

### Paso 10 · Verificar

Ejecuta antes de cerrar la tarea:

```bash
node scripts/check.js
node scripts/smoke.js
```

Si la actividad tiene banco de simulaciones ≥ 25, comprueba también el
contrato de §7.

---

## 5. Técnicas a aplicar

### 5.1 Ser muy didáctico

- **Objetivo visible**: la pantalla inicial dice qué se va a practicar
  ("Vas a buscar las dos cartas iguales").
- **Modelado**: antes de la primera ronda, muestra un ejemplo resuelto
  en un paso lento y con audio.
- **Andamiaje**: ofrece un botón de "ver pista" siempre presente, no
  solo después de fallar.
- **Andamiaje inverso**: en las pantallas iniciales la primera ronda es
  guiada (se resaltan las opciones válidas, hay un dedo que apunta en
  `prefers-reduced-motion: no-preference`).
- **Transferencia**: termina cada actividad con una pantalla que conecte
  lo practicado con la vida real ("Esto te servirá para…").

### 5.2 Método socrático (regla 12 + algo más)

El método socrático en Apptonomia tiene tres niveles:

| Momento | Lo que muestra la app | Mensaje implícito |
|---|---|---|
| Primer fallo | `pista` (pregunta que reorienta el pensamiento) | "Tú puedes; vuelve a pensarlo". |
| Segundo fallo | `explicacion` con la respuesta y por qué | "Ahora ya lo ves; a la próxima lo harás solo/a". |
| Acierto | `explicacionCorrecta` celebrando | "Has pensado bien; eso es lo que importa". |

> Truco pedagógico: en la `pista` **no** uses la palabra "no" ni
> "incorrecto". Formula en positivo lo que la persona tiene que buscar
> ("Mira el dibujo; ¿a qué grupo pertenece?" en vez de "Esa no es la
> caja correcta").

### 5.3 Gamificación

- **Estrellas progresivas**: 1 ⭐ fácil → 2 ⭐ → 3 ⭐ según nivel. Nunca
  restar.
- **Logros visuales**: al terminar una ronda, pantalla final con el
  número de estrellas conseguidas **y** el total acumulado.
- **Micro-celebraciones**: en cada acierto, una pequeña animación
  (`App.feedback.success()` ya integra esto). Sin fuegos artificiales
  invasivos.
- **Reto opcional**: ofrece un botón "otra vez" en la pantalla final
  para repetir sin presión.
- **Sin tablas de clasificación**: nunca comparar con otras personas;
  choca con `SPEC.md` §1.1 y §3.4.

### 5.4 Art effects (animación y arte con cuidado)

Las animaciones sirven para **guiar la mirada**, no para decorar. Para
personas con discapacidad intelectual, los efectos mal medidos saturan
y pueden distraer o activar incomodidad sensorial. Aplica estas reglas:

| ✅ Sí | ❌ No |
|---|---|
| Movimiento intencional y lento (≥ 300 ms) | Movimientos bruscos o parpadeos |
| Un solo elemento se mueve a la vez | Toda la pantalla cambia de golpe |
| Animación desactivada con `prefers-reduced-motion: reduce` | Animación obligatoria para entender la tarea |
| Refuerzo en el acierto (escala breve, brillo suave) | Refuerzo invasivo cada 2 segundos |
| Colores con significado (acierto = verde, ánimo = amarillo cálido) | Rojo para error (no se usa "incorrecto" en este producto) |

> Si dudas, **no** lo animes. Una interfaz quieta y clara es más usable
> que una muy vistosa.

### 5.5 Buen copy (textos de interfaz)

- **Largo**: ≤ 12 palabras por frase; ≤ 2 frases por pantalla.
- **Voz**: activa, cercana, segunda persona. ("Toca la caja" / no
  "Debería tocarse la caja").
- **Concreto**: verbos de acción, no abstractos.
  ✅ "Mira la palabra. Toca la caja del grupo correcto."
  ❌ "Identifica la categoría semántica correspondiente."
- **Consistente**: si en una actividad "pista" significa X, significa X
  en todas.
- **Positivo**: siempre que se pueda, di lo que la persona **debe**
  hacer, no lo que no debe hacer.
- **Sin sarcasmo, ironía ni dobles sentidos**: el `SPEC.md` §3.3 lo
  prohíbe implícitamente (Lectura Fácil).
- **TTS-friendly**: evita abreviaturas, números romanos sin contexto,
  símbolos sueltos que el motor lea mal.

### 5.6 Storytelling (micro-relato por actividad)

Cada actividad puede tener un mini-relato de fondo, sin convertirlo en
historia larga:

- **Marco cotidiano**: ambienta la actividad en una escena de la vida
  real (la cocina, la tienda, el parque).
- **Personaje guía**: si la actividad tiene mascota/guía, mantenla
  estable entre niveles para que la persona la reconozca.
- **Cierre emocional**: la pantalla final puede incluir una frase que
  conecte lo aprendido con un momento del día
  ("Hoy ya sabes clasificar palabras. Mañana podrás ayudar en la
  cocina a guardar la compra").

> El storytelling **no** debe añadir pantallas obligatorias ni
> retrasar la práctica. Si para llegar al juego hay que pasar dos
> pantallas de diálogo, sobra.

### 5.7 Llamada a la acción (CTA)

En Apptonomia el CTA es **la propia acción** ("Toca", "Busca",
"Escucha"). Pero además:

- **CTA visible y único** por pantalla. Si hay un botón principal,
  los demás quedan en segundo plano visual.
- **Verbo en imperativo**: "Empezar", "Jugar", "Otra vez".
- **CTA final celebratorio**: la pantalla de cierre siempre invita a
  "Elegir otro nivel" o "Volver al menú", **nunca** a "compartir
  puntuación" o "desbloquear el siguiente reto".
- **Sin urgencia falsa**: nada de "¡Solo te queda 1!" o "Date prisa".
  Choca con `SPEC.md` §3.2.

### 5.8 Aprendizaje significativo

Ausubel y Novak hablan de **anclar lo nuevo en lo que la persona ya
sabe**. En la práctica:

- **Usa vocabulario cotidiano** que la persona ya maneja en casa
  (perro, camiseta, pan), no taxonomías técnicas (canino, prenda
 纺织品, cereal).
- **Conecta con su vida**: si la actividad es sobre dinero, usa
  precios reales de un supermercado cercano al usuario.
- **Permite personalización ligera**: dejar que la persona escriba su
  nombre o elija un avatar estable aumenta la **propiedad** sobre lo
  aprendido (ver `tools/piano-keys/`, `tools/keyboard-typing/`).
- **Espacia la práctica**: en `localStorage` puedes guardar el nivel
  alcanzado; en la landing, sugiere retomar ese nivel y no uno
  aleatorio.

---

## 6. Neuromarketing y persuasión ética

> El neuromarketing se aplica **al servicio del aprendizaje**, no para
> vender nada. No hay compra, no hay datos. Las técnicas aquí son para
> **mantener la atención, despertar emoción positiva y anclar mejor los
> conceptos**, respetando siempre `SPEC.md` §3 (sin presión, sin
> castigo, sin datos).

### 6.1 Las 7 claves del neuromarketing aplicadas a Apptonomia

| Clave | Aplicación concreta |
|---|---|
| **1. Menos es más** | Una idea por pantalla; 3–6 opciones; una sola variable por nivel. |
| **2. Captar la mirada** | Un único elemento en movimiento a la vez; uso de tamaño/color para jerarquizar. |
| **3. Tocar para creer** | Botones grandes, feedback táctil al pulsar, resultado inmediato al acertar. |
| **4. Las metáforas funcionan** | Pictogramas que conectan con cosas que la persona ya conoce (un pan 🥖 para "tienda", una cama 🛏️ para "descanso"). |
| **5. Lo novedoso llama la atención** | Una variante nueva cada 3–4 rondas (nuevo pictograma, nuevo color, nueva categoría) **sin** romper la regla 13 (progresión de una sola variable). |
| **6. Utilizar los sentidos** | Audio (TTS) + visual (pictogramas grandes) + háptico (botones grandes) + color emocional (acierto verde suave, ánimo amarillo). |
| **7. Relax y buen humor** | Mensajes cálidos, audios tranquilos, ausencia de castigos; celebramos el proceso, no solo el resultado. |

### 6.2 Persuasión ética (Cialdini adaptado)

| Principio | Cómo se aplica sin manipulación |
|---|---|
| **Reciprocidad** | La app "da" ánimos y pistas; la persona se siente acompañada, no exigida. |
| **Compromiso** | La persona elige nivel → se compromete con su propia elección → practica más. |
| **Aprecio** | Mensajes cálidos y personalizados ("Has elegido el nivel 2. ¡Vamos!"). |
| **Autoridad** | La app aparece como herramienta del terapeuta, no como autoridad fría. |
| **Unidad** | El mini-relato y el avatar unen a la persona con la actividad, no con una marca. |

> Las técnicas persuasivas se usan siempre **al servicio del aprendizaje**
> y nunca para presionar, comparar, excluir o crear urgencia artificial
> (ver `SPEC.md` §3.2). Cualquier añadido que sugiera "te falta algo",
> "estás por detrás" o "esto se acaba pronto" se descarta.

### 6.3 Anclaje de conceptos

- **Repetición espaciada ligera**: una actividad puede ofrecer
  "Repaso del nivel 1" como botón después de terminar el nivel 3.
- **Estímulos multisensoriales coherentes**: si el concepto es "manzana",
  aparece el pictograma 🍎 + la palabra escrita + el audio que la lee
  **al mismo tiempo**. El cerebro ancla mejor cuando recibe la misma
  información por varias vías.
- **Asociación con recuerdo personal**: si la persona escribe su nombre,
  el avatar o la palabra aprendida se muestra al final ("Hoy has
  practicado: 🐶 perro, 🐱 gato").
- **Contraste dosificado**: para enseñar la diferencia, una opción debe
  ser claramente distinta y la otra razonablemente parecida (ejemplo:
  "perro" vs "gato" es más difícil que "perro" vs "🍞").

### 6.4 Optimizar la retención y el interés

- **Sorpresa positiva, nunca negativa**: introduce un elemento visual
  nuevo en la pantalla final cada pocas sesiones (un gato que aparece
  y dice "¡Bien!" — no un fallo que asuste).
- **Refuerzo variable**: no siempre el mismo "¡Muy bien!"; usa el
  array `feedback.success` de `App.i18n` para variar.
- **Progresión invisible**: la persona no debería sentir que el nivel
  2 es "más difícil", sino "más interesante".
- **Avance sin marcar regresión**: nunca mostrar "has perdido lo que
  tenías"; siempre "ahora tienes X estrellas" sin restar.

### 6.5 Llamar a los sentidos sin saturar

| Sentido | Estímulo | Límite |
|---|---|---|
| Vista | Pictograma + color + texto + botón grande | ≤ 6 elementos visuales por pantalla |
| Oído | Audio TTS + sonido de acierto suave | Un sonido a la vez; volumen respetuoso |
| Tacto | Botón ≥ 64 px + feedback al pulsar | Sin vibración intrusiva |
| Gusto/olfato | No aplicables | — |

> La limitación cognitiva y sensorial del usuario final es la **razón
> de ser** del producto. Cualquier decisión de diseño que aumente la
> carga sensorial sin ganancia clara de aprendizaje va en contra del
> `SPEC.md`.

### 6.6 Apelar a emociones y deseos

- **Emoción diana**: orgullo, pertenencia, seguridad, curiosidad.
  **Evitar**: vergüenza, miedo, prisa.
- **Deseos básicos**: autonomía (hacerlo solo/a), competencia (lo estoy
  logrando), reconocimiento ("hoy he ganado 3 ⭐").
- **Micro-emociones**: una carita feliz al acertar, una carita pensativa
  con "🤔 Prueba otra vez" al fallar. **Nunca** carita triste.

### 6.7 Ser innovador

- Innovar **dentro** de las 13 reglas, no contra ellas.
- Probar mecánicas nuevas con un **MVP de un nivel** antes de
  extender.
- Pedir a familias/terapeutas que prueben (ver [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md))
  cuando la mecánica no sea estándar.

---

## 7. Plantillas

### 7.1 Plantilla de `pista` (1 frase, positiva)

```
🤔 Mira el dibujo. ¿A qué grupo pertenece {palabra}?
```

### 7.2 Plantilla de `explicacionCorrecta`

```
✅ ¡Correcto! {palabra} va en ese grupo.
```

### 7.3 Plantilla de `explicacionIncorrecta`

```
❌ {palabra} va en: {categoriaCorrecta}.
```

### 7.4 Pantalla final

Dos párrafos opcionales: el **logro** y la **transferencia**.

```html
<p id="resumenFinal"></p>
<p id="transferencia" class="transferencia" data-i18n="transferencia"></p>
```

```js
/* Logro: cuántas estrellas se han ganado. */
$('#resumenFinal').textContent =
  App.i18n.t('resumenFinal').replace('{n}', n).replace('{total}', total);

/* Transferencia: anclar lo aprendido a la vida diaria. */
$('#transferencia').textContent = App.i18n.t('transferencia');
```

**Claves i18n** (mismo nombre en ES y EN):

```json
"resumenFinal": "Has ganado {n} estrellas. Ahora tienes {total} estrellas.",
"transferencia": "Esto te servirá para {vidaDiaria}."
```

Frases de transferencia ya usadas en el catálogo:

- `tools/routines/`: "Ahora ya sabes hacerlo solo/a. Te servirá hoy y mañana."
- Plantilla genérica: `"Esto que practicaste te servirá para {vidaDiaria}."`

### 7.5 Plantilla de objetivo en `instruccion`

```
{Verbo en imperativo} {objeto directo}. {Frase de ampliación corta}.
```

Ejemplos buenos:

- 🃏 "Busca las dos cartas iguales."
- 🗂️ "Mira la palabra. Toca la caja del grupo correcto."
- 🧮 "Suma los números. Toca el resultado."

---

## 8. Errores frecuentes

| Error | Por qué es un problema | Solución |
|---|---|---|
| Decir "incorrecto" | Choca con `SPEC.md` §3.1 | Usar `App.feedback.encourage()`. |
| Dar la respuesta en el primer fallo | Rompe la regla 12 y el método socrático | Mostrar `pista` primero. |
| Cambiar dos variables entre niveles | Rompe la regla 13 y frustra | Cambiar **una sola**. |
| Tono condescendiente ("¡Muy bien, campeón!") | Infantiliza | Tono cercano pero digno: "¡Lo has hecho muy bien!". |
| Saturar la pantalla | Cansancio visual, peor aprendizaje | 3–6 elementos, una idea. |
| Cronómetro visible | Rompe `SPEC.md` §3.2 | Sin reloj en pantalla. |
| Texto clínico en UI | Rompe `SPEC.md` §3.3 | Solo en `team/` y en `doc/`. |
| Comprometer `localStorage` con datos personales | Rompe `SPEC.md` §3.4 | Solo `estrellas` y `completados`. |
| Olvidar TTS en la `instruccion` | Rompe la regla 4 | `App.tts.speak()` al entrar. |
| Olvidar `data-i18n` y hardcodear en HTML | Rompe la paridad de idiomas | Toda cadena va en `strings.<locale>.js`. |

---

## 9. Antes de hacer commit

Checklist final (combina [`tecnico.md` §9](tecnico.md) con esta guía):

- [ ] El objetivo terapéutico se explica en una frase (Paso 1).
- [ ] La mecánica se entiende escrita antes de ver la pantalla (Paso 3).
- [ ] Cada nivel cambia **una sola** variable (regla 13).
- [ ] Banco de datos ≥ 25 casos si es simulación (`tecnico.md` §7).
- [ ] `pista` y `explicacion` existen en `strings.es.js` **y** `strings.en.js`.
- [ ] `App.tts.speak()` se llama al entrar en cada pantalla de juego.
- [ ] `App.feedback.success()` y `App.feedback.encourage()` están conectados.
- [ ] Primer fallo → `mostrarPista()`; segundo → `mostrarExplicacion()`.
- [ ] Persistencia: solo `estrellas` y `completados` en `localStorage`.
- [ ] Botones ≥ 64×64 px, separación ≥ 16 px (regla 2).
- [ ] ≤ 6 opciones por pantalla; ≤ 3 en quiz (reglas 10–11).
- [ ] Animaciones respetan `prefers-reduced-motion`.
- [ ] Actividad registrada en los 6 puntos canónicos
      ([`tecnico.md` §9 paso 8](tecnico.md)).
- [ ] `node scripts/check.js` pasa sin errores.
- [ ] `node scripts/smoke.js` pasa sin errores.
- [ ] Commit pequeño, mensaje en inglés.

---

## 10. Referencias cruzadas

- Producto y restricciones: [`SPEC.md`](SPEC.md)
- Receta técnica: [`tecnico.md` §9](tecnico.md)
- 13 reglas de accesibilidad: [`tecnico.md` §5](tecnico.md)
- Catálogo de actividades: [`actividades.md`](actividades.md)
- Cobertura terapéutica: [`equipo.md`](equipo.md)
- Internacionalización: [`I18N.md`](I18N.md)
- Roles del proyecto: [`roles.md`](roles.md)
- Cómo contribuir (personas): [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md)