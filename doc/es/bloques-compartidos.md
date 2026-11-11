# Bloques compartidos

Un **bloque compartido** es código que usan todas las apps de la suite y que se
define una sola vez, en el metaproyecto, y después se copia en cada app. La copia
es byte a byte, así que un bloque nunca se desvía entre apps. Esta página lista los
bloques, dónde se copia cada uno y cómo cambiarlos o ampliarlos. La regla que lo
sostiene está en [`../../CLAUDE.md`](../../CLAUDE.md) (§ "Shared components: one definition").

> 🌐 **Otro idioma:** [English](../en/shared-blocks.md)

## La regla

- La fuente canónica vive en `apptonomia/scripts/suite/`.
- Nunca edites una copia dentro de una app. El siguiente `--apply` la sobrescribe, y
  el modo `--check` marca la diferencia como fallo.
- Cambia el fichero canónico, ejecuta el script de sincronización con `--apply`, y
  después regenera los tokens de versión y sube la `VERSION` del service worker de
  cada app que haya cambiado (ver abajo).

## Los bloques

| Bloque | Fuente canónica | Se copia en | Script de sincronización |
|---|---|---|---|
| **suite-chrome** (cabecera y pie compartidos) | `scripts/suite/suite-chrome.js` (fichero entero) y `scripts/suite/suite-chrome.css` (bloque marcado) | JS: `assets/js/suite-chrome.js`. CSS: la hoja compartida de la app. Destinos: la plantilla, calculia, routime, memofun, okeymoney, teclatlon | `scripts/sync-suite-chrome.js` |
| **answer-round** (respuesta correcta e incorrecta, pista) | `scripts/suite/answer-round.js` y `.css` (bloques marcados) | `assets/js/feedback.js` y la hoja compartida. Destinos: calculia, memofun, okeymoney, routime, teclatlon, la plantilla (solo JS) | `scripts/sync-answer-round.js` |
| **reward-screen** (pantalla final con estrellas) | `scripts/suite/reward-screen.js` y `.css` (bloques marcados) | igual que answer-round | `scripts/sync-answer-round.js` |
| **celebrate** | `scripts/suite/celebrate.js` y `.css` (bloques marcados) | igual que answer-round | `scripts/sync-answer-round.js` |
| **stars-engine** (`window.MiralanteStars`) | `scripts/suite/stars-engine.js` (fichero entero) | `assets/js/stars-engine.js` (sinonimia: `js/stars-engine.js`). Destinos: calculia, memofun, routime, sinonimia, teclatlon, la plantilla | `scripts/sync-stars-engine.js` |
| **achievements-engine** (`window.ApptonomiaAchievements`) | `scripts/suite/achievements-engine.js` (fichero entero) | `assets/js/achievements-engine.js`. Destinos: calculia, okeymoney, memofun, routime, teclatlon, la plantilla | `scripts/sync-achievements-engine.js` |

Hay dos tipos de copia:

- **Fichero entero** (suite-chrome.js, stars-engine.js, achievements-engine.js): el
  fichero de la app es el canónico. La sincronización lo crea si falta.
- **Bloque marcado** (answer-round, reward-screen, celebrate, suite-chrome.css): solo
  el texto entre `/* suite:<nombre>:begin` y `/* suite:<nombre>:end */` pertenece al
  bloque. El resto del fichero es de la app. Un bloque que falta se inserta (en JS,
  antes del último `})();` del IIFE; en CSS, al final del fichero).

## Comandos

Desde `apptonomia/`:

```bash
node scripts/sync-suite-chrome.js            # --check (por defecto): informa de diferencias, no cambia nada
node scripts/sync-suite-chrome.js --apply    # copia las fuentes canónicas donde difieren
```

Los demás scripts de sincronización usan los mismos dos modos. El modo de
comprobación termina con código 1 si alguna copia difiere, así que puede ir en una
puerta de calidad.

Tras `--apply` en una app:

```bash
cd ../calculia                              # cualquier hermana; la plantilla es apptonomia/doc/templates
node ../scripts/asset-tokens.js calculia    # regenera los tokens ?v= de los ficheros cambiados
node scripts/check.js                       # la puerta estructural de la app
```

Nunca escribas un valor `?v=` a mano (ver [`../../scripts/ASSET-TOKENS.md`](../../scripts/ASSET-TOKENS.md)).

## suite-chrome en detalle

El bloque de cabecera y pie es el que más cambia, así que tiene su propio contrato.
El comentario de uso completo está al principio de `scripts/suite/suite-chrome.js`.

- **Montajes.** Una página declara `<header data-suite-header>` y/o
  `<footer data-suite-footer>`. Un montaje que ya tiene hijos se salta.
- **Cabecera.** Dibuja el selector de idioma, y la marca (`core.chrome.appName`) salvo
  que el montaje tenga `data-suite-brand="off"`. Las páginas cuyo propio título ya
  nombra la app usan la forma solo con selector, que sustituye en su sitio el bloque de
  controles de antes.
- **Pie.** Enlaza al portal, a `about/`, a `legal/` y, con `data-suite-settings`, a
  `config/`. `data-suite-base` indica la ruta relativa a la raíz de la app;
  `data-suite-contact` añade un enlace mailto.
- **Textos.** Se escriben con las claves `data-i18n` `core.chrome.appName`,
  `core.chrome.portal`, `core.chrome.about`, `core.chrome.legal` y `core.chrome.settings`.
  Viven en el espacio `core` del diccionario base de cada app (`assets/js/i18n.js`, es y
  en). Si el `strings.<locale>.js` de una app redefine `core`, hay que repetir ahí el
  bloque `chrome`, porque el `register()` posterior sustituye todo el espacio.
- **Momento.** El script pinta en cuanto se ejecuta, lo que debe ocurrir después de los
  montajes que rellena. También vuelve a pintar en `DOMContentLoaded`, así que funciona
  desde `<head>`. El selector de idioma va diferido, y encuentra su contenedor ya pintado.

## Añadir una app

1. Pide la aprobación del responsable del despliegue. La regla para cambios entre
   proyectos está en [`../../CLAUDE.md`](../../CLAUDE.md) § A.2.2.
2. Añade una línea a la lista de destinos (`TARGETS` o `APPS`, según el script) de la
   sincronización de cada bloque que vaya a tomar la app.
3. Ejecuta la sincronización con `--apply`, después los tokens de versión, y después el
   `scripts/check.js` de la app.
4. Si es una PWA, añade el fichero nuevo a la lista de caché del service worker y sube
   su `VERSION` en el mismo cambio.

## Excepciones conocidas

- **sinonimia** toma los motores de estrellas y de logros, pero no suite-chrome. Su pie
  lleva los créditos de ARASAAC y los controles offline, y su i18n no es `App.i18n`.
- **teclatlon `index.html`** conserva su propio pie: tiene el botón de borrar el
  progreso, que el pie compartido no ofrece.
- **Las páginas de actividad** (`tools/`) conservan su propia cabecera. El enlace de
  volver y el contador de estrellas dependen de la actividad, no de la suite.
- **`doc/templates/app-template/index.html`** de la plantilla es un ejemplo del
  marcado. Su núcleo de i18n es el de la propia app.

## Relacionado

- [`../../scripts/suite/`](../../scripts/suite/) — las fuentes canónicas.
- [`crear-app.md`](crear-app.md) — la receta para una hermana nueva, que ejecuta los
  scripts de sincronización como parte del arranque.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — la lista de cumplimiento de la
  suite.
