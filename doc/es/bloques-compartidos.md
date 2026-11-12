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

- **Montajes.** Cada página monta la cabecera compartida con `data-suite-header` y el
  pie compartido con `data-suite-footer`. Un montaje que ya tiene hijos se salta. El
  contenido propio de la página no forma parte del bloque: va junto al montaje, dentro
  del mismo `<header>` o `<footer>` (el enlace de volver, el título y las estrellas de
  una herramienta; el botón "borrar mi progreso" de teclatlon; los créditos de ARASAAC
  de sinonimia).
- **Cabecera.** Dibuja la marca (`core.chrome.appName`) y el selector de idioma, que es
  el ⚙️ con su cajón de idioma, tema, tamaño de letra y alto contraste. Las páginas cuyo
  propio marcado ya nombra la app usan `data-suite-brand="off"`, de modo que el montaje
  solo dibuja el selector en el bloque de controles que ya tenía la página.
- **Pie.** Enlaza al portal, a `about/`, a `legal/` y, con `data-suite-settings`, a
  `config/`. `data-suite-base` indica la ruta relativa a la raíz de la app;
  `data-suite-contact` añade un enlace mailto.
- **Textos.** La cabecera necesita una sola cadena, `core.chrome.appName`, en los
  ficheros de idioma de la app. Las etiquetas del pie (`core.chrome.portal`, `about`,
  `legal`, `settings`) tienen textos base en es y en, así que una app no necesita
  cadenas para ellas. La app puede redactarlas por su cuenta; su valor gana al base.
  Las etiquetas del pie llevan `data-suite-label`, no `data-i18n`: la pasada de
  traducción de cada app reescribe todo nodo `data-i18n` para el que no tiene clave
  (calculia lo hace), así que las etiquetas las dibuja el bloque y se vuelven a dibujar
  cuando cambian `<html lang>` o `data-lang`.
- **Orden.** `suite-chrome.js` debe ejecutarse antes que `locale-picker.js`. Los dos
  suelen ir diferidos, así que el bloque va primero en el documento: el selector busca
  `#locale-picker` al ejecutarse, y el montaje de cabecera es quien lo dibuja.
- **Momento.** El script pinta en cuanto se ejecuta, lo que debe ocurrir después de los
  montajes que rellena. También vuelve a pintar en `DOMContentLoaded`, así que funciona
  desde `<head>`.
- **Auditoría de marcado.** `scripts/sync-suite-chrome.js` comprueba en cada página HTML
  de la suite que están los dos montajes y los dos scripts (`suite-chrome.js`,
  `locale-picker.js`), y falla si queda la marca antigua `data-pie-app`. Una página que
  no puede llevarlos se lista en `AUDIT_EXEMPT` con su motivo.

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

- **sinonimia** mantiene su propio i18n (no `App.i18n`). Su pie lleva los créditos de
  ARASAAC y los controles offline, junto al montaje del pie.
- **teclatlon `index.html`** conserva el botón "borrar mi progreso" junto al montaje del
  pie, y su montaje de cabecera va dentro de su propia cabecera de herramienta.
- **Páginas de herramienta** (`tools/`): el montaje de cabecera compartida va primero; el
  enlace de volver, el título y el contador de estrellas siguen en el `tool-header` de la
  propia herramienta, que depende de la actividad.
- **`doc/templates/app-template/index.html`** es un ejemplo del marcado. Su núcleo de
  i18n es el de la propia app.
- **Stubs**: `apptonomia/project/index.html` (la presentación, con su pie propio) y
  `ludia/refresh.html` y `ludia/legal/index.html` (stubs de redirección) no se auditan.
- **Páginas 404** montan la cabecera y el pie como cualquier página. Algunas, como la de
  calculia, redirigen además a la portada con `meta refresh`, así que quien llega a ellas
  puede no verlas durante mucho tiempo.

## Relacionado

- [`../../scripts/suite/`](../../scripts/suite/) — las fuentes canónicas.
- [`crear-app.md`](crear-app.md) — la receta para una hermana nueva, que ejecuta los
  scripts de sincronización como parte del arranque.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — la lista de cumplimiento de la
  suite.
