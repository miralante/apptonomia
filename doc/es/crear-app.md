# Crear una nueva app para la suite

Esta guía es la **receta** para añadir un nuevo hermano a la
suite Miralante — la séptima app, o cualquier futura. Es la
compañera práctica de [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md);
lee ambas antes de empezar, y luego usa [`templates/`](../templates/)
como andamios de archivos.

> 🌐 **Other language:** [English](../en/crear-app.md)

---

## Contenido

1. [Antes de empezar](#1-antes-de-empezar)
2. [Decide lo básico](#2-decide-lo-básico)
3. [Prepara el nuevo repo](#3-prepara-el-nuevo-repo)
4. [Anatomía de archivos obligatoria](#4-anatomía-de-archivos-obligatoria)
5. [Conecta el núcleo compartido](#5-conecta-el-núcleo-compartido)
6. [Contrato de caché para hermanos PWA](#6-contrato-de-caché-para-hermanos-pwa)
7. [Árbol de docs (bilingüe)](#7-árbol-de-docs-bilingüe)
8. [Registra el nuevo hermano en apptonomia/](#8-registra-el-nuevo-hermano-en-apptonomia)
9. [Gates de CI](#9-gates-de-ci)
10. [Primer despliegue](#10-primer-despliegue)
11. [Scripts de mantenimiento](#11-scripts-de-mantenimiento)

---

## 1. Antes de empezar

Necesitas:

- **Un alcance en una frase.** "Una app que enseña X a Y". Si no
  puedes decirlo en una frase, el alcance es demasiado grande —
  divídelo.
- **El perfil de público** al que va dirigida la app (lee
  [`guia-de-cumplimiento.md` §1](guia-de-cumplimiento.md#1-lectura-fácil-siempre-une-153101)
  para el contrato de lectura fácil; §2 para el objetivo WCAG AAA).
- **Un hermano existente** como referencia arquitectónica más
  cercana. Elige entre `routime/` (catálogo multi-actividad),
  `calculia/` (catálogo multi-actividad con núcleo compartido),
  `memofun/` (basado en barajas), `okeymoney/` (app de estado
  compartido único), `sinonimia/` (single-page app), `teclatlon/`
  (app de actividad única). El más cercano te dice de qué esqueleto
  de `app.js` partir.
- **Permiso para crear un nuevo repo** bajo la organización de
  GitHub `miralante/`, y para añadir una tarjeta al portal
  Apptonomia. Ambos requieren aprobación explícita del usuario
  antes del primer push (ver metaproyecto `../../CLAUDE.md` §A.3).

Si falta cualquiera de estos, para y pregunta. Crear un nuevo
hermano no es una sorpresa de una sola persona.

---

## 2. Decide lo básico

Antes de tocar archivos, escribe estas decisiones en un one-pager
(guardado como `doc/<lang>/spec.md` §1 cuando los docs estén
escritos):

| Decisión | Qué elegir | Dónde mirar la guía |
|---|---|---|
| **Nombre a mostrar** (español) | "Mi App" / "Calculia" / … | Cabecera del `README.es.md` de cada hermano |
| **Nombre a mostrar** (inglés) | "My App" / "Calculia" / … | Cabecera del `README.md` de cada hermano |
| **Slug** | `mi-app`, minúsculas, guiones, ASCII | Nombre de carpeta; también prefijo de `localStorage` e id JSON-LD |
| **Dominio** | `<slug>.apptonomia.uk` | `wrangler.toml` de los demás hermanos |
| **Forma** | catálogo multi-actividad / app de propósito único / basado en barajas | Ver §2.1 abajo |
| **PWA o no** | Sí si envía actividades que la persona visita de nuevo; no si es una herramienta de un solo uso | Presencia del `manifest.json` en cada hermano |
| **Disposición** | Tres niveles (núcleo compartido + por-actividad + portal) o fichero único | Ver §2.2 abajo |
| **Núcleo compartido** | Reusar `assets/js/{utils,i18n,tts,storage,feedback}.js` de Apptonomia (portar y recortar), o escribir el tuyo | Ver §5 abajo |

### 2.1 Forma

- **Catálogo multi-actividad** — un portal que lista N actividades,
  cada una con su propia carpeta (`tools/<slug>/`). Ejemplo: Routime (69 actividades),
  Calculia (15), Apptonomia (variable).
- **App de propósito único** — una app, una pantalla, pero varios
  modos de práctica declarados en `data.js`. Ejemplo: Teclatlon.
- **App de estado compartido único** — una app, una pantalla, un
  libro contable `localStorage` compartido que cada flujo lee y
  escribe. Ejemplo: Okeymoney.
- **Basado en barajas** — la unidad de contenido es una baraja
  (archivo JSON); la app es una actividad de renderizado que sabe
  cómo reproducir cualquier baraja. Ejemplo: Memofun.
- **Single-page app** — la unidad de contenido son datos (un
  diccionario); la app es una experiencia de búsqueda/exploración.
  Ejemplo: Sinonimia.

### 2.2 Disposición

- **Tres niveles**: `assets/` (núcleo compartido) + `tools/<slug>/`
  (una carpeta por actividad) + `index.html` raíz (portal).
- **Fichero único**: `index.html` + `app.js` + `data.js` +
  `strings.<locale>.js` + `styles.css` en la raíz del repo.

La disposición de tres niveles es el valor por defecto de la suite
para catálogos > 3 actividades. El fichero único es apropiado para
diccionarios estilo Sinonimia o entrenadores estilo Teclatlon.

---

## 3. Prepara el nuevo repo

```
# 1. Crea el repo en GitHub bajo miralante/<slug> (hazlo desde la
#    UI web; puede requerir membresía de la org).
# 2. Genera la app desde la plantilla del metaproyecto. new-app.js copia
#    doc/templates/, rellena todos los marcadores en UTF-8 y se niega a
#    terminar si alguno queda sin valor. No toca git.
cd apptonomia
node scripts/new-app.js --slug <slug> --es "<Nombre>" --en "<Name>"   [--email <correo de soporte>] [--shape single-purpose]   [--with HAS_CONTENT_CC_BY_SA] [--set CLAVE=valor]
cd ../<slug>
git init -b main
git remote add origin git@github.com:miralante/<slug>.git

# 3. Añade la skill de graphify y comprueba la app nueva.
node ../apptonomia/scripts/sync-graphify-skill.js sync --apply
npm run lint && npm run lint:markup && npm run test:sw && npm run test:ui
```

No copies la carpeta a mano ni sustituyas los marcadores con `sed`
o PowerShell: `sed -i ''` solo funciona en macOS, y en Windows
PowerShell 5.1 `Get-Content`/`Set-Content` sin `-Encoding UTF8`
estropean tildes y emojis. `node scripts/check-template.js --ui`
(en la CI del metaproyecto) demuestra que la plantilla sigue
generando una app que pasa sus propias comprobaciones.

La carpeta [`templates/`](../templates/) tiene un andamio para
copiar y pegar de cada archivo obligatorio. Tras renombrar los
marcadores, tendrás la anatomía de archivos en su sitio sin
escribir nada desde cero.

---

## 4. Anatomía de archivos obligatoria

Cada hermano envía este baseline. Ver
[`guia-de-cumplimiento.md` §8](guia-de-cumplimiento.md#8-anatomía-de-archivos-obligatoria-por-hermano)
para la lista canónica con propósito y razonamiento. El mínimo
viable que debes tener **antes** del primer despliegue:

- `CLAUDE.md` (copiado de `templates/CLAUDE.md`, luego recortado)
- `README.md` + `README.es.md`
- `LICENSE` (MIT)
- `CONTRIBUTING.md` + `CONTRIBUTING.es.md`
- `CODE_OF_CONDUCT.md` + `CODE_OF_CONDUCT.es.md`
- `SECURITY.md` + `SECURITY.es.md` (plantilla canónica en
  [`doc/templates/SECURITY.md`](../templates/SECURITY.md) ↔
  [`doc/templates/SECURITY.es.md`](../templates/SECURITY.es.md);
  ver §11 abajo: **no se editan a mano**, se renderizan con
  `scripts/one-off/write-security-md.js`; el canal
  `{{SUPPORT_EMAIL}}` se resuelve desde
  `app.config.json > supportEmail` de cada repo, con fallback
  duro en el script)
- `CLOUDFLARE.md` (runbook de despliegue)
- `_headers`, `wrangler.toml`, `404.html`
- `index.html` + `app.js` (o `tools/<slug>/app.js` para catálogos)
- `strings.es.js` + `strings.en.js`
- `assets/css/styles.css` (o `css/styles.css`)
- `assets/fonts/*.woff2` (Atkinson Hyperlegible + Nunito)
- `scripts/check.js` (portar de `templates/scripts/check.js`)
- Si es PWA: `manifest.json` + `sw.js` + `scripts/check-version-bump.js`
  + `scripts/smoke-sw.js`
- `package.json` con las puertas canónicas (`lint`, `lint:markup`,
  `test:ui`, y `test:sw` / `test:crawl` si la app las trae) — ver §4.3
- `playwright.config.js` + `tests/playwright.js` (el shim) +
  `tests/smoke.spec.js` (el smoke canónico) + las specs propias de la
  app en `tests/`
- `scripts/serve.js` (el servidor de test canónico)
- `404.html` (la página 404 canónica, sin redirección)
- `.github/workflows/validate.yml` con el job de CI que ejecuta las
  puertas (ver §9)

### 4.1 Cuál es el mínimo de los mínimos

Si la app es una herramienta de un solo uso (no se vuelve a
visitar) y no envía datos de progreso, puedes saltarte la PWA
por completo: sin `manifest.json`, sin `sw.js`. El resto de la
anatomía de archivos sigue aplicando.

### 4.2 Convención de rama por defecto

Los hermanos nuevos deben usar `main` como rama por defecto. Los
siete hermanos actuales son una mezcla de `main` (apptonomia,
memofun, sinonimia) y `master` (calculia, okeymoney, teclatlon,
routime); la plantilla de SECURITY se parametriza con
`{{DEFAULT_BRANCH}}`, así que hoy cada archivo es fiel a su
repo. Migrar a `main` es editar una sola línea en
[`scripts/one-off/write-security-md.js`](../scripts/one-off/write-security-md.js)
tras subir el rename.

### 4.3 El contrato de test

Las 8 apps de la suite comparten los **mismos nombres de puerta** y el
mismo significado. El nombre de la puerta describe el contrato, no la
tecnología que hay detrás:

| Puerta | Qué hace | Fichero que la implementa | Obligatoria |
|---|---|---|---|
| `npm run lint` | Checks estructurales: sintaxis JS, anatomía de archivos, paridad `sw.js` ↔ disco, paridad de claves es/en, marcadores pendientes | `scripts/check.js` | Sí |
| `npm run lint:markup` | Auditoría del chrome compartido (cabecera y pie) en todas las páginas | `scripts/checks/suite-markup.js` | Sí |
| `npm run test:ui` | La suite de specs de Playwright (`tests/*.spec.js`) en Chromium real; incluye el smoke canónico | `tests/smoke.spec.js` + las specs de la app | Sí |
| `npm run test:crawl` | El crawler: recorre todas las rutas públicas y pulsa todos los controles | `scripts/ui-smoke.js` | Opcional — solo si la app lo trae |
| `npm run test:sw` | Smoke del service worker: cada entrada del precache carga y el 404 no redirige | `scripts/smoke-sw.js` | Sí si la app es PWA |
| `npm run test:sw-redirects` | Redirecciones 307 del service worker | `scripts/check-sw-redirects.js` | No — solo si la app lo trae |
| `npm run serve` | El servidor de test canónico: replica Cloudflare Pages (CSP de `_headers`, carpeta → `index.html`, `404.html` con estado 404) | `scripts/serve.js` | De uso manual — la CI no la invoca |

Reglas que no se rompen:

- **`test:ui` es SIEMPRE la suite de specs de Playwright** y
  **`test:crawl` es SIEMPRE el crawler**. Antes esas dos puertas
  intercambiaban nombres según la app; ya no. El nombre viejo
  `test:playwright` no existe en ninguna app.
- **El crawler es opcional.** Hoy lo traen 7 de las 8 apps (calculia,
  ludia, memofun, okeymoney, routime, sinonimia, teclatlon);
  apptonomia, que es un portal de aterrizaje, no. Una app que **no**
  trae `scripts/ui-smoke.js` **no declara** `test:crawl`: una puerta que
  apunta a un fichero inexistente es peor que no tenerla.
- **Playwright no es una dependencia del proyecto**: ni `dependencies`
  ni `devDependencies`. En local es la instalación de la máquina; en CI
  se instala al vuelo con
  `npm install --no-save --no-audit --no-fund @playwright/test@1.63.0`
  (y `playwright` si la app además lo necesita para el crawler). El
  shim `tests/playwright.js` carga la API desde la copia que el propio
  runner ya tiene cargada, para que el test y el runner usen la MISMA
  copia.
- **El 404 no redirige.** Cloudflare lo sirve en la URL pedida, así que
  la página es todo root-absoluto, sin meta refresh ni redirect JS. Si
  en algún doc aparece un 404 que "redirige a la home", está mal.
- **El servidor de test canónico es `scripts/serve.js`** (copia byte a
  byte de `apptonomia/scripts/suite/serve.js`, repartida por
  `apptonomia/scripts/sync-suite-test-kit.js`). Replica el
  comportamiento de Cloudflare Pages, y `playwright.config.js` lo
  levanta como `webServer`.
- **El smoke canónico es `tests/smoke.spec.js`** (3 tests: home + cajón
  de ajustes con la fila de idioma, sin scroll horizontal a 320 px, y
  el 404 con estado 404). Está sincronizado; los flujos propios de la
  app van en `tests/app.spec.js`.

### 4.4 Checklist de una app nueva

Para nacer con el contrato de test completo, la app nueva trae:

- [ ] `package.json` con las puertas `lint`, `lint:markup` y `test:ui`;
      además `test:sw` si es PWA y `test:crawl` **solo** si trae
      `scripts/ui-smoke.js`.
- [ ] `playwright.config.js` + `tests/playwright.js` (el shim) +
      `tests/smoke.spec.js` (el smoke canónico) + `tests/app.spec.js` (los
      flujos de la app).
- [ ] `scripts/serve.js` (el servidor canónico), que es también el
      `webServer` de `playwright.config.js`.
- [ ] `404.html` (la página canónica): todo root-absoluto, sin
      redirección, con la cabecera y el pie compartidos.
- [ ] El job de CI que ejecuta las puertas
      (`.github/workflows/validate.yml`): `npm run lint`,
      `npm run lint:markup`, `npm run test:sw` y `npm run test:ui`.
- [ ] Ninguna puerta del workflow sin su comando en `package.json`, y
      ninguna puerta de test en `package.json` que el workflow no
      invoque (salvo `serve`, que es de uso manual).
- [ ] Playwright **no** en `devDependencies`: se instala en el entorno
      o al vuelo en CI.

La plantilla de [`doc/templates/`](../templates/) ya trae todo esto: se
genera con `node scripts/new-app.js` y se verifica con
`node scripts/check-template.js`.

---

## 5. Conecta el núcleo compartido

El núcleo compartido es lo que hace que un hermano se sienta
parte de la suite. Es **portar y recortar**, no "copiar
literalmente" — parte de los `assets/js/{utils,i18n,tts,storage,feedback}.js`
de Apptonomia y elimina las funciones que el hermano no usa.

### 5.1 Pasos del porte

1. **Copia** cada archivo del núcleo desde `apptonomia/assets/js/`
   al propio `assets/js/` del hermano.
2. **Renombra el prefijo de almacenamiento.** En `storage.js`,
   busca la constante `STORAGE_PREFIX` y cámbiala de `apptonomia:`
   a `<slug>:`. Este es el prefijo con el que empieza cada clave
   de `localStorage` del hermano (ver
   [`guia-de-cumplimiento.md` §5.2 regla 1](guia-de-cumplimiento.md#5-patrón-de-ajustes--borrado-de-datos)).
3. **Recorta.** `node scripts/check.js` reporta "exports no usados"
   por módulo del núcleo después de que el código del hermano lo
   haya importado. Elimina lo no usado; quédate con lo referenciado.
4. **Ejecuta** `scripts/check.js` del hermano — afirma que el
   prefijo de almacenamiento existe y que ninguna clave se escribe
   fuera de él.

### 5.2 Lo que no debes hacer

- **No introduzcas un paso de build.** Nada de webpack, vite,
  parcel, esbuild, rollup, ni ningún bundler. El hermano envía
  HTML/CSS/JS plano que Cloudflare sirve como static assets. Añadir
  un paso de build es la razón de rechazo más común para nuevos
  hermanos.
- **No añadas dependencias de npm/pip.** Node plano para
  `scripts/`, JS vanilla para el navegador. Ver metaproyecto
  `../../CLAUDE.md` §A.2.2.
- **No bifurcares el núcleo en el hermano.** Una copia en
  `<hermano>/assets/js/` está bien (la recortamos). Un fork de git
  no.
- **No añadas `localStorage.clear()`.** Ver
  [`guia-de-cumplimiento.md` §5.2 regla 3](guia-de-cumplimiento.md#5-patrón-de-ajustes--borrado-de-datos).

---

## 6. Contrato de caché para hermanos PWA

Si el hermano es una PWA, envía un `sw.js` con una cadena
`VERSION` y un array `ARCHIVOS` (o `FILES`) que liste cada archivo
que el SW pre-cachea:

```js
// sw.js (forma canónica; ver templates/sw.js)
var VERSION = '<slug>-v1';
var ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  // ...una entrada por archivo que la persona visitante ve en la primera carga
];
```

Entonces en **cada** commit que toque un archivo listado en
`ARCHIVOS`:

1. Bumpea `VERSION` (p. ej. `<slug>-v1` → `<slug>-v2`).
2. Añade el nuevo archivo a `ARCHIVOS` si es un archivo nuevo.
3. Ejecuta `node scripts/check-version-bump.js` — falla en CI
   cuando un archivo en caché cambió pero `VERSION` no, así que
   este es el gate automático que atrapa el error de "olvidé
   bumpear".

La regla completa está en
[`guia-de-cumplimiento.md` §7](guia-de-cumplimiento.md#7-contrato-de-caché-del-service-worker).

---

## 7. Árbol de docs (bilingüe)

Cada hermano envía `doc/<lang>/` con al menos:

```
doc/
├── en/
│   ├── index.md          ← punto de entrada, enlaza con los demás
│   ├── readme.md         ← intro en lectura fácil para personas usuarias / familias
│   ├── spec.md           ← definición de producto, público, no negociables
│   ├── roles.md          ← los tres roles del proyecto
│   ├── team.md           ← guía para familias / terapeutas / docentes
│   ├── technical.md      ← arquitectura, estructura, APIs, despliegue
│   ├── i18n.md           ← cómo funciona la UI es/en, receta para añadir un idioma
│   ├── activities.md     ← catálogo de actividades (si catálogo > 1)
│   ├── creating-elements-guide.md ← didáctica + gamificación + neuromarketing
│   └── quick-guide.md    ← cómo abrir la app (4 métodos)
└── es/
    ├── indice.md
    ├── readme.md
    ├── spec.md
    ├── roles.md
    ├── equipo.md
    ├── tecnico.md
    ├── i18n.md
    ├── actividades.md
    ├── guia-crear-elementos.md
    └── guia-rapida.md
```

Los nombres de archivo en español usan `indice`, `equipo`,
`tecnico`, `guia-rapida`, `actividades`, `guia-crear-elementos`
(sin acentos, todo en minúsculas, guiones). Los nombres en inglés
usan `index`, `team`, `technical`, `quick-guide`, `activities`,
`creating-elements-guide`. Este patrón lo aplica el metaproyecto y
es lo que `scripts/check.js` verifica.

### 7.1 Mínimo por idioma

- `index.md` / `indice.md` — punto de entrada con el árbol de
  directorio y la tabla "por dónde empezar según perfil".
- `readme.md` — intro en lectura fácil reflejando la forma de
  Routime (ver
  [`guia-de-cumplimiento.md` §1](guia-de-cumplimiento.md#1-lectura-fácil-siempre-une-153101)).
- `spec.md` / `spec.md` — qué es la app, para quién, los
  principios no negociables.
- `roles.md` — los tres roles del proyecto (persona usuaria /
  apoyo / construcción).
- `team.md` / `equipo.md` — guía para familias y profesionales de
  apoyo (cuándo, por qué, cómo).
- `technical.md` / `tecnico.md` — arquitectura, estructura,
  anatomía de actividades, APIs, contratos, tests, despliegue.
- `i18n.md` — cómo funciona la UI es/en, receta para añadir un
  locale.
- `quick-guide.md` / `guia-rapida.md` — cuatro formas de abrir la
  app (internet, ZIP, Python, Node).
- `activities.md` / `actividades.md` — solo si el catálogo tiene
  más de una actividad; si no, lo cubre `spec.md` §2.
- `creating-elements-guide.md` / `guia-crear-elementos.md` —
  recetas didácticas + de gamificación + neuromarketing para el
  público; solo si el catálogo tiene más de una actividad.

### 7.2 Por qué bilingüe

El público de la suite lee primero en español; los docs de
mantenimiento se hacen por defecto en es + en para mantener la
paridad. Cada cambio de producto al copy de la UI **debe** aplicar
a ambos locales — ver
[`guia-de-cumplimiento.md` §9 fila 3](guia-de-cumplimiento.md#9-auto-verificación-de-cumplimiento-antes-de-abrir-un-pr).

---

## 8. Registra el nuevo hermano en apptonomia/

El portal Apptonomia es la cara pública de la suite. Añadir un
nuevo hermano significa añadir su tarjeta allí. Archivos a tocar
en el repo `apptonomia/`:

1. **`index.html`** — añade una nueva tarjeta que enlace a
   `<slug>.apptonomia.uk`. Sigue la forma de las tarjetas
   existentes; no inventes un diseño nuevo.
2. **`js/strings.es.js` + `js/strings.en.js`** — añade el nombre
   del slug, su tagline y `aria-label` en ambos idiomas. Iguala el
   tono de las entradas existentes (una frase por idioma, lectura
   fácil).
3. **`graphify-out-meta/graph.json`** — regenerado automáticamente
   por `node scripts/sync-graphify-skill.js update --apply`. No lo
   edites a mano.
4. **`CLAUDE.md` §A.1.1** — añade una fila a la tabla de hermanos
   para que la tabla de fuentes canónicas del metaproyecto se
   mantenga completa.
5. **`doc/en/index.md` + `doc/es/indice.md`** — añade una entrada
   "por dónde empezar" que apunte al `CLAUDE.md` y `README.md`
   propios del nuevo hermano.

Los cinco cambios viajan en el mismo PR; no los repartas entre
hermanos (la regla del metaproyecto "Las ediciones a un hermano
están acotadas a ese hermano" se invierte para el registro — el
registro ES transversal por diseño).

---

## 9. Gates de CI

El primer PR de un nuevo hermano dispara los jobs de
`.github/workflows/validate.yml` (la plantilla de ese workflow está en
[`templates/.github/workflows/validate.yml`](../templates/.github/workflows/validate.yml)):
cópiala literal y ajusta el campo `name:`.

| Job | Puerta que invoca | Qué comprueba | Dónde arreglar |
|---|---|---|---|
| `check` | `npm run lint` | Sintaxis JS, anatomía de archivos, paridad sw ↔ disco, paridad es/en de claves | Salida de `scripts/check.js` |
| `check` | `npm run lint:markup` | Chrome compartido: cabecera y pie en todas las páginas | Salida de `scripts/checks/suite-markup.js` |
| `cache-bump` | `node scripts/check-version-bump.js` (solo PWA) | Un archivo en caché cambió pero `VERSION` no | Bumpea `VERSION` en `sw.js` |
| `secrets-scan` | `node scripts/scan-secrets.js` | Ninguna API key / token / PEM en el árbol de trabajo | Mueve el secreto fuera del repo, rótalo |
| `ui` | `npm run test:sw` (solo PWA) | Cada entrada del precache carga; el 404 no redirige | Salida de `scripts/smoke-sw.js` |
| `ui` | `npm run test:ui` | Smoke canónico + specs de la app en Chromium | La spec que falla |
| `ui` | `npm run test:crawl` (opcional) | El crawler: recorre las rutas públicas y pulsa todos los controles | La ruta o el control que falla |
| `i18n-smoke` (opcional, no viene en la plantilla) | `node scripts/i18n-keys-smoke.js` | Cada clave `data-i18n*` está registrada para cada locale | Añade la clave que falta a `strings.<locale>.js` |

Reglas de este job:

- **Una puerta, un nombre.** El workflow invoca `npm run test:ui`
  (nunca `npx playwright test` ni `playwright test` a pelo): si el
  nombre de la puerta cambia, el workflow se actualiza en el mismo
  cambio. Y al revés: una puerta que el workflow invoca pero que
  `package.json` no define es un fallo silencioso de CI.
- **Toda puerta de test de `package.json` la invoca el workflow**
  (salvo `serve`, que es de uso manual). `npm run test:crawl` solo
  aparece si la app trae `scripts/ui-smoke.js`.
- **Playwright se instala al vuelo en CI**
  (`npm install --no-save --no-audit --no-fund @playwright/test@1.63.0`
  y `npx playwright install --with-deps chromium`), nunca como
  dependencia del proyecto.

Los gates `lint`, `lint:markup` y `test:ui` son obligatorios: cada
hermano debe definirlos y la CI debe ejecutarlos en cada PR y push a
la rama de producción. Antes de hacer push, ejecuta `npm run lint`,
`npm run lint:markup` y `npm run test:ui`; para una PWA ejecuta además
`npm run test:sw` y `node scripts/check-version-bump.js`.
No hagas push si una prueba obligatoria falta, falla o no se pudo ejecutar.

---

## 10. Primer despliegue

La suite se despliega a **Cloudflare Workers + static assets** vía
el conector Git de Cloudflare — ver el `CLOUDFLARE.md` de cada
hermano para el contrato por app, y el `CLOUDFLARE.md` del
metaproyecto para el runbook compartido (rebuild, rollback,
dominio personalizado, rotación de credenciales).

Una checklist de primer despliegue:

- [ ] Repo creado bajo `miralante/<slug>` con derechos de admin
      para quien mantiene.
- [ ] Proyecto creado en el panel de Cloudflare con framework
      preset "None", `wrangler.toml` pineado (nombre de proyecto),
      `[assets] directory = "."`, `not_found_handling = "404-page"`.
- [ ] Dominio personalizado `<slug>.apptonomia.uk` configurado en
      DNS de Cloudflare (CNAME al subdominio workers.dev).
- [ ] Conector Git habilitado en Cloudflare (o Workers Builds
      apuntado al repo).
- [ ] Primer push → Cloudflare construye → primera URL de preview.
- [ ] Smoke test de la URL de preview en un navegador real
      (escritorio + móvil si es PWA).
- [ ] **Aprobación manual del usuario** para el despliegue a
      producción (esto es una operación de red — ver metaproyecto
      `CLAUDE.md` §A.3).

---

## Requisito de responsive y layout

Cada nuevo hermano debe seguir el contrato responsive de la suite: declarar
UTF-8 y el viewport móvil real, usar contenedores fluidos y rejillas/columnas
flexibles, evitar el desbordamiento horizontal, apilar las columnas en
pantallas estrechas, mantener objetivos táctiles utilizables y evitar
alturas fijas o espacios decorativos que provoquen scroll excesivo. Hay que
verificar el layout a 320px, 375px, 768px y escritorio, comprobando tanto el
overflow como el espacio vacío innecesario.

El HTML también debe declarar UTF-8. Si se cambia un recurso CSS/JS inmutable,
hay que actualizar en el mismo cambio su versión semántica de caché
(`<slug>-vN`), y la comprobación final debe hacerse contra la URL publicada,
en una sesión nueva, no solo en una previsualización local.

## 11. Scripts de mantenimiento

Son utilidades de housekeeping ejecutadas desde
`scripts/one-off/`, modeladas según el patrón de la suite
(construir una vez, re-ejecutar cuando cambian los valores,
nunca en cada commit).

### `write-security-md.js`

Re-render idempotente de `SECURITY.{md,es.md}` para cada hermano
más las dos plantillas canónicas en `doc/templates/`. Lee la
tabla `REPOS` al inicio del script — ese es el único sitio a
editar cuando un valor cambia:

| Campo | Cuándo editar |
|---|---|
| `gitOrg` / `repo` | El repo se renombra o cambia de organización. |
| `branch` | El repo migra de `master` a `main` (convención objetivo). |
| `supportEmail` | Solo fallback duro. El valor real viene del `app.config.json > supportEmail` del repo (el script lo imprime). Edítalo allí, no aquí. |
| `extraThreat` / `extraThreatEs` | Un hermano nuevo tiene un añadido específico al modelo de amenaza. |

```bash
# desde apptonomia/ (cualquier cwd):
node scripts/one-off/write-security-md.js
```

Escribe `wrote <path>` por cada archivo que produce (14 concretos
+ 2 plantillas = 16 líneas de salida) y sale con código no cero
si alguna variable requerida en las plantillas no resuelve. Sin
efectos secundarios: no toca `git`, no hace `npm install`, no
abre el navegador.

## Ver también

- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — el
  checklist de cumplimiento transversal que cada nuevo hermano
  debe pasar antes de mergear.
- [`tecnico.md`](tecnico.md) — cómo funciona el plumbing del
  metaproyecto (`scripts/sync-graphify-skill.js`, el meta-grafo)
  para unir a los hermanos.
- [`templates/`](../templates/) — andamios de archivo de copiar y
  pegar para cada archivo obligatorio.
- El metaproyecto [`../../CLAUDE.md`](../../CLAUDE.md) §A.1.1 — la
  tabla canónica de hermanos existentes.
