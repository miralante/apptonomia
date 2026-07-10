# CLAUDE.md — Apptonomia

Guía para Claude (y cualquier LLM) al trabajar en este proyecto.
Leer también `SPEC.md` (especificación técnica: arquitectura, APIs del núcleo y
recetas de desarrollo), `I18N.md` (arquitectura multiidioma y cómo añadir un idioma
nuevo) y `PLAN.md` (hoja de ruta) antes de hacer cambios grandes.
Si algún documento contradice a este, gana este.

## Qué es este proyecto

Aplicación web de terapia ocupacional para **personas con discapacidad intelectual**.
El usuario final usa la app **solo**, sin profesional al lado. Todo lo que se construya
debe poder entenderse y usarse de forma autónoma.

- **Idioma de la interfaz**: español (España) e inglés, en **Lectura Fácil** en los dos.
  Selector de idioma en la landing (`App.i18n`, ver `I18N.md` y `SPEC.md` §3.2b);
  recuerda la elección en `localStorage`.
- **Idioma del código**: inglés (nombres de variables/funciones); comentarios pueden ir en español.
- **Stack**: HTML5 + CSS3 + JavaScript vanilla. **Sin frameworks, sin build step, sin backend, sin dependencias npm.**
- **Persistencia**: solo `localStorage`. Sin login, sin cookies, sin datos personales, sin analítica.

## Comandos

```bash
# Servidor local (desde la raíz del repo)
python -m http.server 8080
# Abrir: http://localhost:8080/site/index.html

# Comprobación estructural (sin dependencias, antes de cualquier commit)
node scripts/check.js

# Smoke test dinámico (requiere `npm install`; usa Playwright + Chromium)
node scripts/smoke.js               # las 49 actividades, es + en
node scripts/smoke.js domino oca    # solo esos slugs, para depurar rápido
```

`scripts/check.js` cubre lo estructural (sintaxis, anatomía de
`tools/<slug>/`, caché de `sw.js`, paridad es/en, paridad de catálogo con
`site/` y `equipo/`, conteos de actividades, y el patrón `DATA.porRonda`
que ya rompió dos herramientas). `scripts/smoke.js` cubre lo que check.js
NO puede: abre cada actividad de verdad en Chromium (español e inglés),
pulsa el primer nivel si lo hay, y falla si aparece cualquier error de
consola — la clase de bug "carga bien pero revienta al usarla" (así se
encontró originalmente el crash de la-frase/palabras: solo pasaba al
completar una ronda entera). `playwright` es devDependency de test, igual
que `firebase-tools` lo es de despliegue: ninguna de las dos se sirve a la
persona usuaria. No hay tests de comportamiento más allá de esto ni linter
de estilo; el resto de la verificación es manual (ver checklist en
PLAN.md §5, Fase 5).

**Coordinación entre sesiones**: este repo se trabaja con varias sesiones
de agente en paralelo (y el usuario también commitea directamente). Al
EMPEZAR cualquier sesión, antes de construir nada:
```bash
git status && git log --oneline -3 && node scripts/check.js
```
Si hay cambios sin commitear que no son tuyos, o `check.js` falla, es
trabajo de otra sesión — reconciliar primero (leer qué cambió, decidir si
hace falta terminarlo) en vez de asumir que el estado del repo coincide
con la última conversación.

Es una PWA: una vez desplegada (HTTPS real), es instalable como aplicación de
escritorio o de móvil.

**En remote-control** (sesión en la nube, sin Python ni navegador local) no se puede
levantar el servidor local ni abrir un navegador para probar los cambios. En ese caso,
para probar la app hay que desplegar un canal de preview en Firebase Hosting y abrir la
URL que devuelve:

```bash
npm run firebase:hosting
```

(usa `firebase-tools hosting:channel:deploy preview`, proyecto `apptonomia` definido en
`.firebaserc`). Avisar al usuario antes de desplegar, ya que sube contenido a un servicio
externo aunque sea un canal de preview temporal.

## Estructura

```
apptonomia/
├── assets/            # Código compartido — CAMBIOS AQUÍ AFECTAN A TODO
│   ├── css/           # tokens.css (variables), base.css, components.css
│   ├── js/            # i18n.js, tts.js, storage.js, feedback.js, utils.js (exponen window.App.*)
│   └── img/           # Pictogramas SVG
├── site/              # Menú principal (landing simple) + strings.js (ES/EN)
├── equipo/            # Guía para el equipo de apoyo — RUTA OCULTA (ver nota abajo)
├── ajustes/           # Ver/borrar localStorage — RUTA OCULTA (ver nota abajo)
├── tools/<slug>/      # Una carpeta por actividad
│   ├── index.html
│   ├── app.js         # Solo lógica
│   ├── data.js        # Solo datos (const DATA = [...] o { es: [...], en: [...] })
│   ├── strings.js     # Solo texto ES/EN, registrado con App.i18n.register()
│   └── styles.css     # Solo estilos específicos (< 150 líneas)
├── manifest.json      # PWA
└── sw.js              # Service worker (al añadir archivos: actualizar lista de caché y versión)
```

Los módulos compartidos se cargan con `<script src="../../assets/js/x.js"></script>`
(scripts clásicos, no ES modules) y exponen `window.App.tts`, `App.storage`, `App.feedback`,
`App.utils`, `App.i18n`. Orden de carga: `utils.js` → `i18n.js` → `tts.js` → `storage.js`
→ `feedback.js` → `strings.js` de la herramienta → `data.js` → `app.js`.

**Rutas ocultas** (`/equipo/`, `/ajustes/`): páginas para adultos que gestionan el
dispositivo, no para la persona usuaria. Solo se llega conociendo la URL: **no
enlazarlas nunca** desde `site/index.html` ni desde las actividades, y llevan
`<meta name="robots" content="noindex, nofollow">`. Son las únicas páginas donde se
permite lenguaje clínico o de administración. `/equipo/` es la guía (objetivos,
áreas terapéuticas, propósito de cada actividad) — mantenerla al día al añadir
actividades o módulos. `/ajustes/` deja ver y borrar lo guardado en `localStorage`
(datos de la persona: idioma + nombre; o restablecimiento completo) — ver `SPEC.md` §8.2.

## Reglas de accesibilidad (OBLIGATORIAS — nunca las incumplas)

1. **Lectura Fácil**: frases cortas, una idea por frase, sin metáforas ni ironía en la UI.
   Ejemplo bueno: "Toca el círculo." Ejemplo malo: "¡Demuestra tus reflejos felinos!"
2. **Botones ≥ 64×64 px**, separación ≥ 16 px. Texto base 20 px mínimo.
3. **Tema claro de alto contraste** (WCAG AA mínimo). Nunca texto neón sobre fondo oscuro.
4. **Audio en todo texto importante**: botón 🔊 usando `App.tts.speak()` (idioma activo
   vía `App.i18n.lang()`, rate 0.9).
5. **Sin presión**: nunca cronómetros visibles, puntuación negativa, "game over" ni castigos.
   El error se responde con ánimo ("Casi. ¡Inténtalo otra vez!"), nunca con rojo agresivo ni sonidos duros.
6. **Refuerzo positivo** al acertar: usar `App.feedback.acierto()`. Breve (≤ 2 s).
7. **`prefers-reduced-motion`**: toda animación nueva debe respetarlo.
8. **Navegación por teclado**: todo interactivo alcanzable con Tab y activable con Enter; foco visible.
9. **ARIA**: `aria-label` en botones de icono, `aria-live="polite"` en zonas de feedback.
10. **Máximo 4–6 opciones visibles** por pantalla. Una acción principal por pantalla.
11. **Preguntas tipo quiz** (una pregunta, varias opciones, una correcta): **máximo 3
    opciones**, nunca más. Al elegir una opción (acierte o falle), mostrar siempre una
    **explicación breve de por qué es correcta o incorrecta** — nunca solo un
    "¡Bien!"/"Casi" genérico sin motivo. La explicación va en `strings.js` (con audio
    🔊) y se guarda en `data.js` junto a cada pregunta/opción.
12. **Método socrático al fallar**: en el **primer** fallo de una pregunta, no dar
    la respuesta directa. Mostrar antes una **pista corta** que redirija la
    atención al dato ya disponible (repetir el enunciado, señalar el detalle
    clave) — nunca una pregunta abierta o ambigua, sigue siendo Lectura Fácil.
    Solo en el **segundo** fallo de la misma pregunta se muestra la explicación
    completa con la respuesta correcta (regla 11) — nunca se deja a la persona
    sin resolución. La pista va en `strings.js`/`data.js` junto a la pregunta,
    con audio 🔊 igual que la explicación.
13. **Progresión gradual entre niveles** (carga cognitiva: estimulante sin
    saturar): si una actividad tiene niveles, cada nivel solo puede cambiar
    **una** variable de dificultad respecto al anterior (más opciones, más
    elementos que memorizar, un concepto más fino…) — nunca varias a la vez.
    Documentar en el comentario de cabecera de `data.js` qué variable cambia
    en cada nivel, para poder revisarlo de un vistazo.

## Convenciones de código

- Datos siempre en `data.js`, separados de la lógica. Formato documentado en comentario de cabecera.
- Texto siempre en `strings.js` (`App.i18n.register({es:{...}, en:{...}})`), nunca
  hardcodeado en `app.js` ni como único contenido de un nodo sin `data-i18n`/`data-i18n-aria`.
  Leer con `App.i18n.t('clave')`; frase al azar con `App.i18n.pick('clave')`.
- Progreso: `App.storage.get('<slug>')` / `App.storage.set('<slug>', obj)`
  (clave interna `apptonomia:<slug>`). Siempre tolerante a fallos (try/catch ya incluido en storage.js).
- Barajar con `App.utils.shuffle()` — nunca `sort(() => Math.random()-0.5)`.
- CSS: usar las variables de `assets/css/tokens.css` (`--color-*`, `--mod-*`, `--boton-min`…).
  No duplicar componentes que ya existen en `components.css`.
- Cada herramienta debe funcionar de forma aislada: sin estado global compartido entre herramientas.
- Commits pequeños, uno por herramienta o cambio coherente, mensaje en inglés.

## Cómo añadir una actividad nueva

(Receta detallada con APIs y contratos: `SPEC.md` §4. Módulo terapéutico nuevo: `SPEC.md` §5.)

1. Crear `tools/<slug>/` con `index.html`, `app.js`, `data.js`, `strings.js`, `styles.css`.
2. Copiar la cabecera HTML de una herramienta existente (enlaces a assets/ y orden de
   scripts, incluido `i18n.js` y `strings.js` propio).
3. Escribir los textos en `strings.js` en español e inglés con las mismas claves.
4. Añadir tarjeta en `site/index.html` dentro del módulo correspondiente (ver PLAN.md §4):
   Coordinación=azul, Autonomía/hogar=verde, Memoria/atención=naranja,
   Razonamiento/matemáticas=teal, Lenguaje=frambuesa, Emociones=morado.
   (Los 6 módulos están activos desde la Fase 6.)
5. Añadir archivos (incluido `strings.js`) a la caché de `sw.js` y subir la versión.
6. Verificar: jugable sin errores de consola en ambos idiomas, progreso persiste al
   recargar y al cambiar de idioma, audio funciona, navegable por teclado, botones ≥ 64 px.

## Qué NO hacer

- No añadir frameworks, bundlers, npm dependencies ni CDNs de JS (Google Fonts sí está permitido).
- No pedir ni almacenar datos personales.
- No usar lenguaje clínico ("paciente", "terapia", "discapacidad") en la interfaz de usuario.
- No añadir mecánicas competitivas, rankings ni comparación entre usuarios.
- No eliminar herramientas existentes: `keyboard-typing`, `comedy-club`, `dichos`, `adivinanzas` se conservan.
- No hacer refactors masivos en un solo commit; seguir las fases de `PLAN.md`.

## Estado actual (actualizar al avanzar)

- [x] Herramientas existentes funcionales: keyboard-typing, comedy-club, dichos, adivinanzas
- [x] Fase 1 — Núcleo compartido `assets/`
- [x] Fase 2 — Refactor de herramientas existentes
- [x] Fase 3 — Nuevas herramientas: atrapa, rutinas, parejas, emociones
- [x] Fase 4 — Nueva landing + PWA
- [x] Fase 5 — Verificación final (checks automáticos; pendiente prueba manual en navegador)
- [x] Fase 6 — Reorganización de la landing en 6 módulos (colores nuevos: teal y frambuesa)
- [x] Fase 7 — Ola 1: patrones, diferencias, monedero, reloj, categorias
- [x] Ola 2 — historias, que-no-encaja, la-frase, que-falta, ecos, la-casa, situaciones
- [x] Ola 3 — trazos, colorear, puzzle, oca, palabras, calma, entre-amigos
- [x] Ola 4 — numeros (matemáticas del día a día: contar, valor posicional hasta el billón, fracciones, decimales, tablas, cálculo mental y medidas)
- [x] Ola 5 — chat-seguro (seguridad en internet: chats simulados para practicar respuestas ante manipulación — fotos, datos, contraseñas, secretos, quedadas)
- [x] i18n — aplicación bilingüe ES/EN (`App.i18n` + `strings.js` por herramienta en
      las 30 actividades; caché de `sw.js` al día). Ver `PLAN-I18N.md`.
- [x] Teclado — modo "Teclado del móvil" (`DATA.layouts.movil`): se detecta y
      preselecciona solo en dispositivos táctiles (`App.utils.esTactil()`), enseña
      a escribir con los dos pulgares (mitad izquierda/derecha) para trabajar
      lateralidad. Único tipo de teclado tocable de verdad (ver SPEC.md §6).
- [x] Piano — `tools/piano-teclas/` (toca el teclado del ordenador como un piano:
      libre, seguir melodía, Simón dice, canciones, compositor). Existía sin
      terminar (sin `data.js`, i18n sin conectar, `prompt()` nativo, teclas sin
      accesibilidad, 3 funciones a medias); revisada y completada por petición
      del usuario — ver `git log --oneline -- tools/piano-teclas/`.
- [x] `/ajustes/` — ruta oculta para ver y borrar `localStorage`: datos de la
      persona (idioma + nombre, progreso intacto) o restablecimiento completo,
      cada uno con confirmación en dos pasos. Ver `SPEC.md` §8.2.
- [x] Aviso de actualización en la landing: cuando el Service Worker cambia de
      versión, aparece un aviso con botón para recargar y aplicar lo nuevo. Ver
      `SPEC.md` §7.
- [x] Preguntas tipo quiz — regla 11 de accesibilidad aplicada a las 14
      actividades existentes: máximo 3 opciones (bajadas de 4 en adivinanzas,
      chistes, dichos y ¿qué no encaja?) y explicación al elegir cualquier
      opción, acierto o fallo (generada a partir del propio dato de la
      pregunta en la mayoría; escrita a mano solo en Chat Seguro, donde el
      razonamiento de seguridad es el objetivo real). Ver `CLAUDE.md` regla 11
      y `SPEC.md` §4.
- [x] Método socrático — regla 12 de accesibilidad aplicada a las 13
      actividades quiz de arriba (todas menos Chat Seguro, que ya cumplía por
      su propio diseño: nunca revela directamente la respuesta correcta,
      solo explica por qué la opción elegida es arriesgada). En el primer
      fallo se muestra una pista corta (repetir el enunciado o animar a
      mirar/pensar otra vez), nunca la respuesta; solo en el segundo fallo se
      explica la respuesta correcta. Ver `CLAUDE.md` regla 12 y `SPEC.md` §4.
- [x] Progresión de niveles — regla 13 de accesibilidad (carga cognitiva).
      Auditadas las 19 actividades con niveles; 5 incumplían (cambiaban más
      de una variable de dificultad a la vez) y se han corregido: Categorías
      (nivel 3 mantiene 3 cajas, ya no baja a 2, y añade "Frutos secos"),
      La Oca (las casillas de regalo se calculan a partir del tamaño del
      tablero en vez de guardarse aparte), Parejas (columnas fijas en 4,
      solo sube el nº de parejas), Los Números (`contar`, `unidades`,
      `fracciones`, `cabeza`: reordenadas o con `max` derivado de la otra
      variable), y Entre Amigos (ahora 4 niveles: identificar emoción básica
      → emociones menos comunes → conflictos simples → conflictos difíciles,
      en vez de saltar de emociones a conflictos en un solo paso). Ver
      `CLAUDE.md` regla 13 y `SPEC.md` §4.
- [x] Chat Acoso (`tools/chat-acoso/`, módulo Autonomía/hogar) — nueva actividad:
      chats simulados para reconocer acoso entre compañeros (insultos,
      exclusión, rumores, fotos para reírse, amenazas, presión de grupo para
      molestar a otro) y saber cómo actuar. La respuesta correcta siempre
      incluye contárselo a un adulto de confianza — nunca defenderse solo ni
      ignorarlo. Reutiliza el motor de Chat Seguro (mismo patrón de
      aviso/avisoSeguro).
- [x] Partes del Día (`tools/partes-del-dia/`, módulo Autonomía/hogar) — nueva
      actividad: clasificar tareas diarias (desayunar, hacer los deberes,
      cenar…) en Mañana/Tarde/Noche. A diferencia de Categorías, cada acierto
      se añade a una lista visual que se va construyendo en su caja durante
      toda la ronda (no desaparece). 2 niveles (regla 13: solo cambia lo obvio
      que es el momento del día, nunca el nº de cajas).
- [x] Organización, planificación y priorización (módulo Autonomía/hogar) —
      3 actividades nuevas, cada una centrada en una sola habilidad:
      `tools/que-primero/` (priorización: situación con 2-3 cosas posibles
      que hacer, elegir la más urgente entre 3 opciones — reutiliza el motor
      de Situaciones), `tools/que-necesito/` (planificación: dada una tarea u
      objetivo, elegir qué hace falta preparar antes — motor de Situaciones
      con preguntas de una sola frase, sin picto), `tools/donde-lo-guardo/`
      (organización: objeto cotidiano → su sitio de guardado en casa —
      armario/nevera/mochila — clon exacto del motor de Categorías). Las 3
      con 2 niveles cada una (regla 13: mismo nº de opciones/cajas, solo
      cambia lo obvio de la respuesta correcta).
- [x] Lista de Tareas (`tools/lista-tareas/`, módulo Autonomía/hogar) — nueva
      actividad: ordenar tareas independientes de casa, trabajo y cuidado
      personal (no pasos de una sola tarea del hogar, como La Casa) en el
      orden lógico del día — p. ej. vestirte → coger el bus → fichar entrada
      → hacer un encargo → fichar salida → volver a casa → cenar. Adapta el
      motor de La Casa (tocar en orden, un toque fuera de orden solo anima a
      seguir, sin castigo) mostrando picto + texto en vez de solo picto,
      porque las tareas de ámbitos abstractos (trabajo) no se identifican
      solo con un emoji. 2 niveles (regla 13: 3 tareas → 4 tareas por lista,
      mismo patrón que ya usaba La Casa).
- [x] ¿Lo publico? (`tools/lo-publico/`, módulo Autonomía/hogar) — nueva
      actividad: peligros de las redes sociales no cubiertos aún por Chat
      Seguro (manipulación en chat privado) ni Chat Acoso (acoso entre
      iguales) — decidir qué es más seguro ante situaciones de publicación
      pública y contenido viral: fotos con datos personales visibles
      (dirección, colegio), perfiles falsos, retos virales peligrosos,
      bulos/cadenas, estafas (premios, tarjetas regalo) y ajustes de
      privacidad de la cuenta. Reutiliza el motor de Situaciones/¿Qué hago
      primero? (situación + picto + 3 opciones, pista socrática en el primer
      fallo). 2 niveles (regla 13: nivel 1 son casos claros de datos
      personales, nivel 2 mantiene el mismo formato y pasa a casos más
      sutiles — perfiles falsos, retos, bulos — sin añadir más variables).
- [x] Juegos de lógica (módulo Razonamiento) — 2 actividades nuevas adaptadas:
      `tools/tres-en-raya/` (la persona es ❌ y siempre empieza; el rival ⭕
      juega según el nivel — regla 13, única variable es cuánto se fija el
      rival: azar → remata su línea → también bloquea la tuya; perder no se
      castiga [regla 5]: mensaje de ánimo con consejo concreto y otra
      partida, el empate también se celebra) y `tools/sudoku-visual/`
      (4×4 con pictos en vez de números, bloques 2×2 sombreados; se valida
      contra una solución precalculada para que nunca haya callejones sin
      salida; primer fallo → pista socrática [regla 12], segundo fallo → se
      explica y se coloca solo [regla 11], nadie se queda atascado; regla 13:
      única variable es el nº de huecos, 4 → 6 → 8). Ambos juegos llevan
      además un botón 💡 Ayuda a demanda con método socrático en dos pasos:
      la 1ª pulsación hace una pregunta que dirige la atención al dato clave
      (sin dar la jugada); la 2ª marca la casilla concreta y explica el
      porqué. En el sudoku, colocar el picto sigue siendo cosa de la persona.
- [x] Percepción viso-espacial (módulo Memoria/atención) — 3 actividades
      nuevas: `tools/giros-espejos/` (rotación mental, reflejos e
      inversiones de grafías; regla 13: única variable es el tipo de
      transformación — girado → espejo → letras b/d/p/q; transformaciones
      con CSS en un span interior, nunca en el botón), `tools/los-bloques/`
      (construcción tipo bloques: copiar un modelo 4×4 de bloques de
      colores con paleta de 3; regla 13: única variable es el nº de bloques
      4 → 6 → 8; validación amable por casilla — pista al primer fallo, al
      segundo se corrige sola), y `tools/donde-esta/` (vocabulario espacial:
      tocar el objeto a la izquierda/derecha/encima/debajo de la
      referencia; ítems generados al vuelo con nombres es/en para el TTS
      [los emojis no se leen en voz alta]; regla 13: única variable es el
      eje — horizontal → vertical → mixto; la pista socrática enseña la
      estrategia: "busca primero la referencia, después mira hacia el
      lado"). Las secuencias visuales ya estaban cubiertas por Patrones.
- [x] Viso-espacial, segunda tanda (módulo Memoria/atención) — 3 actividades
      más, sin solaparse con las anteriores: `tools/el-camino/` (orientación
      y rutas estilo robot de suelo: llevar la tortuga a la estrella con 4
      flechas —y flechas del teclado físico—; los tableros se generan al
      vuelo y una BFS garantiza que siempre hay camino; regla 13: única
      variable es el nº de árboles 0/3/5; chocar solo avisa, regla 5),
      `tools/encajar/` (tetris adaptado: la pieza se mueve/gira/baja con
      botones, SIN caída automática ni cronómetro; el hueco es la huella
      exacta de la pieza, generado por pieza; regla 13: única variable es
      el tamaño de pieza 2/3/4 celdas; fallos: pista → hueco marcado → se
      encaja sola), y `tools/el-teatro/` (escenas con profundidad: escenario
      de 2 filas ×4 columnas —fondo arriba pequeño, delante abajo grande—
      y órdenes "Pon el perro delante del árbol"; regla 13: única variable
      es el nº de órdenes por escena 2/3/4; la pista enseña qué fila es
      delante/detrás; nombres con artículo es/en para el TTS).
- [x] Tanda del usuario (2026-07-09): `tools/constructores/` (Coordinación —
      construcción libre con bloques, sin modelo ni acierto/fallo),
      `tools/senales/` (Autonomía — señalética cotidiana: peligro, baño,
      prohibición, salidas, emergencias, transporte; 6 niveles, 3 opciones
      por pregunta) y `tools/domino/` (Razonamiento — encadenar fichas de
      dominó girándolas para que coincidan los números). Las tres venían
      completas (5 archivos, i18n conectado); el registro que faltaba
      (tarjetas, strings de portada, sw.js, equipo/, PLAN.md, conteos) lo
      detectó `scripts/check.js` y se completó junto a la 2ª tanda
      viso-espacial.
- [x] ¿Qué me pongo? (`tools/que-me-pongo/`, módulo Autonomía/hogar) — nueva
      actividad: elegir la ropa adecuada (torso, piernas, pies, un extra
      como gorra/paraguas) según el tiempo que hace. Clon exacto del motor
      de ¿Qué hago primero? (situación + picto + 3 opciones, explicación y
      pista socrática ya incluidas). 2 niveles (regla 13: nivel 1 solo los
      dos contrastes extremos —mucho calor / mucho frío—, nivel 2 mantiene
      el mismo formato y añade un tercer tiempo menos evidente —lluvia—,
      que depende de ir seco en vez de temperatura).
- [x] Dominó reescrito (`tools/domino/`, 2026-07-10, a petición del usuario:
      "no es fácil, interactivo ni fácil de usar"). La versión anterior era
      un solitario con rotación MANUAL de la ficha (elegir → girar con
      botones → intentar colocar → error). Ahora es el juego de mesa real
      adaptado: mano de 4 fichas, rival tranquilo visible por turnos,
      montón para robar, y la ficha SE ORIENTA SOLA al tocarla (solo
      pregunta el lado si encaja en ambos extremos). Fichas dibujadas con
      puntos reales (rejilla 3×3 CSS). Fallos: pista socrática → se marcan
      las jugables (regla 12). Finales sin castigo: ganar da estrella,
      perder da ánimo, el cierre por bloqueo compara fichas restantes y el
      empate se celebra. Regla 13: única variable es maxPips (3/5/6).
- [x] Parte G de PLAN-MEJORAS.md COMPLETA (2026-07-10, con aprobación del
      usuario para G2 y G5): `scripts/check.js` amplía sus 5 comprobaciones
      a 8 (paridad con `equipo/`, conteos README/SPEC sincronizados, lint
      del patrón `DATA.porRonda` que rompió la-frase/palabras — las tres
      verificadas rompiendo el caso real y comprobando que el checker lo
      detecta); anclas de módulo en la portada (`site/index.html`, 6
      enlaces `#mod-N` con teclado y sin JS, scroll suave ya respetado por
      `prefers-reduced-motion` de `base.css`); nota de coordinación entre
      sesiones en este archivo; `temp_original_data.js` borrado (se
      publicaba en el hosting sin que nadie lo usara) y `temp_*` en
      `.gitignore`; `scripts/smoke.js` — smoke test dinámico con Playwright
      (devDependency, como `firebase-tools`) que abre las 49 actividades en
      es/en, pulsa el primer nivel si lo hay, y falla con cualquier error
      de consola. Las 49 pasan limpio (98 pruebas) en la primera pasada.
- [x] Parte D + E3-E6 de PLAN-MEJORAS.md (2026-07-10, con aprobación del
      usuario): 4 actividades nuevas de terapia ocupacional —
      `tools/la-calle/` (movilidad comunitaria: cruzar, transporte,
      perderse; clon de ¿Qué hago primero?), `tools/mi-cuerpo-avisa/`
      (interocepción, módulo Emociones — resuelve D1 dándole una 4ª
      herramienta al módulo más pequeño; clon de ¿Qué necesito?),
      `tools/emergencias/` (menú de 2 actividades: reconocer una emergencia
      real —quiz que mezcla emergencias con "falsas alarmas"— y practicar
      la llamada —ordenar nombre→qué pasa→dónde estás, motor de Lista de
      Tareas—; deja clarísimo que el 112 es solo para emergencias de
      verdad), `tools/la-compra/` (menú de 2 actividades: secciones del
      súper —clon de ¿Dónde lo guardo?— y lista de la compra por comida
      del día —clon de Partes del Día—; cierra la cadena de AVD
      instrumental con El Monedero y La Casa). Un bug real de las
      herramientas con menú de 2 actividades: en `la-compra` los `momentos`
      de la lista acumulativa se pusieron por error dentro de cada NIVEL en
      vez de al nivel superior (como en Partes del Día) — `banco().lista.
      momentos` salía `undefined` y crasheaba al elegir nivel; lo encontró
      Playwright jugando la actividad de verdad, no una lectura del código.
      También D3 (`tools/patrones/` nivel 4 "Descifra el código",
      símbolo→letra, mismo motor de secuencia — cierra el hueco de la
      taxonomía en PLAN.md §4.1) y D2 ítem 1 (preferencias de tamaño de
      letra y sonidos en `/ajustes/`, aplicadas UNA VEZ en el núcleo
      compartido — `--escala-texto` en `tokens.css` + `storage.js` la lee y
      la aplica al cargar cualquier página, `feedback.js` respeta la
      preferencia de sonidos — así las 53 actividades la heredan sin tocar
      ni una). Herramientas ahora 53, sw v51→v52.
- [ ] Backlog transversal — ver PLAN.md §7 (modo cuidador, multi-perfil, etc.)
