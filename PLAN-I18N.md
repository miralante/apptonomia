# Apptonomia — Plan de migración i18n (ES/EN)

> Migración de toda la aplicación a bilingüe **español/inglés** usando el sistema
> `App.i18n` (`assets/js/i18n.js`, ya creado y funcionando).
> Este plan está escrito para ser ejecutado **paso a paso por un modelo LLM sencillo**:
> tareas concretas, archivos exactos y criterios de aceptación verificables.
> Leer antes `CLAUDE.md` (reglas obligatorias). No inventar nada fuera de este plan.

---

## 1. Estado actual (no repetir lo ya hecho)

**YA MIGRADO — no tocar:**

- Núcleo: `assets/js/i18n.js` (nuevo), `assets/js/tts.js` y `assets/js/feedback.js` (adaptados).
- Landing `site/` con selector de idioma 🇪🇸/🇬🇧 y `site/strings.js`.
- 25 herramientas ya tienen `strings.js` y usan `App.i18n`: adivinanzas, atrapa, calma,
  categorias, chat-seguro, comedy-club, dichos, diferencias, ecos, emociones,
  entre-amigos, la-casa, la-frase, monedero, oca, palabras, parejas, patrones,
  piano-teclas, puzzle, que-falta, que-no-encaja, rutinas, situaciones, trazos.

**PENDIENTE — es lo que hay que hacer:**

> NOTA (2026-07-07): esta tabla quedó obsoleta — todas las fases están completadas, ver §5 Progreso. Se conserva solo como registro del plan original.

| Tarea | Fase |
|---|---|
| Commit de seguridad del trabajo actual | Fase 0 |
| Migrar `tools/colorear/` | Fase 1 |
| Migrar `tools/historias/` | Fase 2 |
| Migrar `tools/reloj/` | Fase 3 |
| Migrar `tools/keyboard-typing/` | Fase 4 |
| Migrar `tools/numeros/` | Fase 5 |
| Actualizar `sw.js` (caché offline) | Fase 6 |
| Verificación final y actualizar documentación | Fase 7 |

En las 5 herramientas pendientes, `index.html` **ya carga** `assets/js/i18n.js`.
Todo lo demás (strings.js, atributos `data-i18n`, app.js, data.js) está sin hacer.

---

## 2. El patrón (copiar SIEMPRE de la referencia)

**Referencia de oro: `tools/parejas/`.** Ante cualquier duda, abrir esos 4 archivos
y copiar su estructura. Otra referencia con datos por idioma: `tools/adivinanzas/data.js`.

### 2.1 Orden de carga de scripts en `index.html` (obligatorio)

```html
<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/i18n.js"></script>   <!-- ya está en las 5 pendientes -->
<script src="../../assets/js/tts.js"></script>
<script src="../../assets/js/storage.js"></script>
<script src="../../assets/js/feedback.js"></script>
<script src="strings.js"></script>                 <!-- NUEVO: antes de data.js -->
<script src="data.js"></script>
<script src="app.js"></script>
```

### 2.2 `strings.js` (archivo nuevo por herramienta)

```js
/* ============================================================
   Apptonomia — Textos de <Nombre> (ES/EN)
   Se registran en App.i18n con App.i18n.register(). Ver assets/js/i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    es: {
      title: '🎨 Colorear',
      instruccion: '…texto exacto que hoy está en el HTML/app.js…',
      // una clave por cada texto visible o aria-label de la herramienta
    },
    en: {
      title: '🎨 Coloring',
      instruccion: '…traducción en inglés sencillo (Easy Read)…',
    }
  });
})();
```

Reglas de las claves:
- `title` siempre existe (lo usa `data-i18n-title` para el `<title>` de la página).
- Textos comunes NO se redefinen: usar `core.volver`, `core.volverAlMenu`,
  `core.jugarOtraVez`, `core.siguiente`, `core.escuchar`, `core.escucharInstrucciones`,
  `core.escucharTexto`, `core.rondaCompletada` (ya definidos en `i18n.js`).
- Placeholders con llaves: `'contador': '{n} de {total}'`.

### 2.3 `index.html` — atributos

- `<html lang="es">` → `<html lang="es" data-i18n-title="title">`
- Cada elemento con texto visible: `data-i18n="clave"` (se mantiene el texto español
  dentro como contenido por defecto).
- Cada `aria-label`: `data-i18n-aria="clave"` (se mantiene el `aria-label` español).
- Enlaces/botones comunes: `data-i18n="core.volver"`, `data-i18n="core.volverAlMenu"`,
  `data-i18n="core.jugarOtraVez"`, `data-i18n-aria="core.escucharInstrucciones"`.
- Añadir `<script src="strings.js"></script>` justo antes de `data.js`
  (si la herramienta no tiene `data.js`, justo antes de `app.js`).

### 2.4 `app.js` — sustituir textos en código

- Texto fijo → `App.i18n.t('clave')`.
- Texto con número/variable → `App.i18n.t('clave').replace('{n}', valor)`.
- Elegir frase aleatoria de un array → `App.i18n.pick('clave')`.
- Datos por idioma → `var banco = DATA[App.i18n.locale()] || DATA.es;`
- Después de crear HTML dinámico con atributos `data-i18n`, llamar `App.i18n.apply(nodo)`.
- NO tocar `App.tts.speak()` ni `App.feedback.*`: ya hablan en el idioma activo.

### 2.5 `data.js` — datos por idioma

Convertir `const DATA = [ … ]` en:

```js
const DATA = {
  es: [ /* el array original, SIN CAMBIOS */ ],
  en: [ /* traducción al inglés, misma estructura y mismo número de campos */ ]
};
```

Actualizar el comentario de cabecera explicando el nuevo formato
(ver `tools/adivinanzas/data.js` como ejemplo).

**Si un campo no es texto** (coordenadas, colores, emojis, números), se copia tal cual.
Si TODOS los campos de `data.js` son independientes del idioma, NO duplicar:
dejar el array único y traducir solo los textos de `strings.js`.

---

## 3. Fases de ejecución

Ejecutar en orden. **Un commit por fase.** No empezar una fase sin cumplir
los criterios de la anterior.

---

### FASE 0 — Commit de seguridad (5 min)

El repositorio tiene ~120 archivos modificados con la migración de las 25 herramientas
ya hechas. Antes de continuar, guardar ese trabajo:

```bash
git add -A
git commit -m "i18n: ES/EN core, landing and 25 tools (WIP: 5 tools + sw.js pending)"
```

**Criterio de aceptación**: `git status` limpio; el commit existe en `git log`.

---

### FASE 1 — `tools/colorear/` (Pintar por zonas)

1. Leer entera la herramienta: `index.html`, `app.js`, `data.js`, `styles.css`.
2. Crear `tools/colorear/strings.js` con TODOS los textos visibles y aria-labels
   (instrucción, nombres de pantallas, botones propios, mensajes de progreso/final).
3. `index.html`: atributos `data-i18n` / `data-i18n-aria` / `data-i18n-title` (§2.3)
   y `<script src="strings.js">`.
4. `app.js`: sustituir textos por `App.i18n.t()` / `.pick()` (§2.4).
5. `data.js`: los dibujos tienen nombre (p. ej. "Una casa") y quizá nombres de colores
   → traducirlos con el formato de §2.5. Las zonas/coordenadas/colores hex se copian tal cual.

**Criterios de aceptación** (aplican igual a las Fases 2–5):
- Con idioma English elegido en la landing: TODO el texto de la herramienta está en inglés
  (título de pestaña, botones, instrucciones, feedback, audio TTS con voz inglesa).
- Con Español: idéntica a como estaba antes de la migración.
- Jugable de principio a fin sin errores en consola en ambos idiomas.
- El progreso guardado (estrellas) se conserva al cambiar de idioma.
- Commit: `i18n: colorear ES/EN`.

---

### FASE 2 — `tools/historias/` (Ordenar viñetas)

Mismos pasos 1–5 de la Fase 1 aplicados a `tools/historias/`.

Atención especial: cada historia tiene título y textos de viñetas → todos van a
`DATA = {es, en}`. Mantener el MISMO orden de historias y viñetas en ambos idiomas.

Commit: `i18n: historias ES/EN`.

---

### FASE 3 — `tools/reloj/` (Leer horas)

Mismos pasos 1–5 de la Fase 1 aplicados a `tools/reloj/`.

Atención especial a cómo se dicen las horas en cada idioma — NO traducir literalmente:
- es: "las tres y media", "las cuatro menos cuarto", "las dos y cuarto"
- en: "half past three", "a quarter to four", "a quarter past two"
- Momentos del día: desayuno/breakfast, comida/lunch, cena/dinner, dormir/bedtime.

Si `app.js` construye la frase de la hora con código, crear claves con placeholders
(p. ej. `horaYMedia: 'half past {h}'`) en vez de duplicar la lógica.

Commit: `i18n: reloj ES/EN`.

---

### FASE 4 — `tools/keyboard-typing/` (Teclado)

Mismos pasos 1–5 de la Fase 1 aplicados a `tools/keyboard-typing/`.

Atención especial:
- Las palabras y frases PARA TECLEAR son contenido de práctica → van a `DATA = {es, en}`.
  En inglés usar palabras cotidianas y cortas sin acentos (cat, dog, house, water…).
- En español se conservan las palabras actuales (con ñ y tildes si ya las hay).
- Los textos de la interfaz (instrucciones, niveles, ánimo) van a `strings.js`.
- Esta herramienta guarda progreso por nivel en localStorage: NO cambiar las claves
  de storage; el progreso es común a ambos idiomas.

Commit: `i18n: keyboard-typing ES/EN`.

---

### FASE 5 — `tools/numeros/` (Matemáticas del día a día)

La más grande (8 actividades). Mismos pasos 1–5 de la Fase 1, con MUCHO cuidado:

1. `strings.js`: textos de las 8 actividades (menú, instrucciones, botones, feedback).
2. `data.js`: enunciados y opciones por idioma donde haya texto; los números se copian.
3. **TRAMPA de traducción — escala numérica**: en español "un billón" = 1.000.000.000.000
   (12 ceros) pero en inglés "one billion" = 1,000,000,000 (9 ceros).
   Al traducir la lectura de números grandes:
   - es: mil → thousand · millón → million · mil millones → billion · billón → trillion
4. **Formato de números**: es usa punto de millar y coma decimal (1.234,50 €);
   en usa lo contrario (1,234.50 €). Si `app.js` formatea números con texto fijo,
   crear una clave o rama por idioma. La moneda sigue siendo el euro en ambos.
5. Los colores por posición (unidades azul, decenas verde, centenas morado) NO cambian.

Commit: `i18n: numeros ES/EN`.

---

### FASE 6 — `sw.js` (caché offline)

La lista `ARCHIVOS` de `sw.js` NO incluye todavía ningún archivo de i18n. Añadir:

1. `assets/js/i18n.js`
2. `site/strings.js`
3. Los 30 `tools/<slug>/strings.js` (los 25 ya migrados + los 5 de este plan).
   Generar la lista con: `ls tools/*/strings.js` — deben salir 30.
4. Subir `VERSION` (v28 → v29).

**Criterios de aceptación**:
- `grep -c "strings.js" sw.js` devuelve 31 (30 tools + site).
- `grep -c "i18n.js" sw.js` devuelve 1.
- Tras una visita con servidor, la app funciona offline en ambos idiomas.
- Commit: `i18n: cache i18n.js and strings.js in service worker (v29)`.

---

### FASE 7 — Verificación final y documentación

1. Checklist en navegador (o en canal preview de Firebase si no hay navegador local —
   ver CLAUDE.md, avisar al usuario antes de desplegar):
   - [ ] En la landing, el botón 🇬🇧 English cambia TODA la web al inglés y persiste al recargar.
   - [ ] Las 30 herramientas jugables en ambos idiomas sin errores de consola.
   - [ ] El TTS habla con voz española en ES y voz inglesa en EN en todas las herramientas.
   - [ ] Volver a 🇪🇸 Español restaura todo exactamente como estaba.
   - [ ] El progreso (estrellas) NO se pierde al cambiar de idioma.
2. Actualizar `CLAUDE.md`:
   - Añadir a "Estado actual": `- [x] i18n — aplicación bilingüe ES/EN (App.i18n + strings.js por herramienta)`.
   - Añadir a "Cómo añadir una actividad nueva" el paso: crear `strings.js` y textos en ambos idiomas.
3. Actualizar `SPEC.md` si documenta el orden de scripts o la anatomía de herramienta
   (añadir `strings.js` a la anatomía estándar).
4. Marcar las fases completadas en este archivo (PLAN-I18N.md).

Commit final: `i18n: docs update, migration complete`.

---

## 4. Qué NO hacer (recordatorio)

- NO tocar las 25 herramientas ya migradas ni `assets/js/*` (salvo bug evidente: avisar).
- NO cambiar claves de `localStorage` existentes (`apptonomia:<slug>`).
- NO añadir frameworks, librerías de i18n externas ni build steps.
- NO usar traducción literal en horas (Fase 3) ni en números grandes (Fase 5).
- NO olvidar `sw.js`: sin la Fase 6 la app offline queda rota en inglés.
- En inglés también aplica **Lectura Fácil** (Easy Read): frases cortas, una idea
  por frase, sin metáforas. Las reglas de accesibilidad de CLAUDE.md aplican igual.

## 5. Progreso (marcar al completar cada fase)

- [x] Fase 0 — Commit de seguridad (`37bce3a`)
- [x] Fase 1 — colorear (`33a2deb`)
- [x] Fase 2 — historias (`8550784`)
- [x] Fase 3 — reloj (`7643fac`)
- [x] Fase 4 — keyboard-typing (`7cca8b7`)
- [x] Fase 5 — numeros (`a1d4b19`)
- [x] Fase 6 — sw.js (`0556751`)
- [x] Fase 7 — Verificación final + docs

### Notas de la Fase 7 (verificación real en navegador con Playwright)

- Landing: el botón 🇬🇧 English cambia todo a inglés y persiste en
  `localStorage['apptonomia:locale']`; 🇪🇸 Español lo revierte.
- Las 5 herramientas cargan en inglés sin errores de consola ni de página
  (colorear, historias, reloj, keyboard-typing, numeros).
- `colorear` en español es jugable de principio a fin (elegir dibujo → aparecen
  zonas y colores → pintar cambia el `fill` de la zona).
- `numeros`: comprobado en inglés que el separador decimal es `.` (p. ej. "9.90 €"),
  los miles usan `,` (p. ej. "1,000,000,000,000"), y la escala es correcta
  ("one billion" = 10^9, "one trillion" = 10^12 — no traducción literal de "billón").
- `reloj`: comprobado en inglés que las opciones usan expresiones nativas
  ("quarter to 5", "quarter past 6"), no traducción literal del español.
- **Pendiente de verificación manual** (no cubierto por el script automatizado):
  `keyboard-typing` (nombre, lecciones, modo libre) y las 25 herramientas ya
  migradas en sesiones anteriores — no se han vuelto a probar en esta sesión.
- **Gap preexistente, fuera del alcance de esta migración**: `tools/piano-teclas/`
  tiene `strings.js` pero no está en absoluto en `sw.js` (ni siquiera su
  `index.html`/`app.js`), así que no funciona offline. No se tocó porque no
  forma parte del catálogo de `PLAN.md` ni de este plan de i18n.
  (RESUELTO después: piano-teclas está en sw.js desde su integración completa, ver CLAUDE.md.)
