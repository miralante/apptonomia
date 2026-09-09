# Referencia técnica — metaproyecto Apptonomia

> 🌐 **Other language:** [English](../en/technical.md)

Este documento es la **referencia técnica** del metaproyecto
Apptonomia: el desglose archivo por archivo del portal, la
arquitectura del plumbing entre proyectos, el sistema i18n, y
el contrato de despliegue. Para la arquitectura por hermano, lee
el `doc/<lang>/tecnico.md` propio de cada uno.

---

## 1. Disposición del repo

```
apptonomia/
├── index.html                       ← El propio portal (seis tarjetas)
├── _headers                         ← Cabeceras HTTP de seguridad de Cloudflare
├── wrangler.toml                    ← Configuración de Cloudflare Workers + static assets
├── 404.html                         ← Fallback de Cloudflare para rutas sin match
├── js/
│   ├── bootstrap.js                 ← Detección de idioma pre-paint, <html lang>
│   ├── prepaint.js                  ← Script inline antes de las hojas de estilo
│   ├── script.js                    ← Comportamiento principal del portal
│   ├── strings.es.js                ← Copy de UI en es
│   └── strings.en.js                ← Copy de UI en en
├── css/
│   └── styles.css                   ← Tokens de diseño + componentes
├── assets/
│   ├── fonts/                       ← Atkinson Hyperlegible + Nunito (woff2)
│   ├── icons/                       ← Favicon, iconos PWA
│   └── og-image.svg                 ← Imagen Open Graph
├── about/                           ← Sub-página "Sobre este proyecto"
├── legal/                           ← Sub-página legal
├── team/                            ← Sub-página "Equipo"
├── project/                         ← Sub-página "Proyecto"
├── doc/                             ← Esta carpeta (docs bilingües + plantillas)
├── graphify-out-meta/               ← Knowledge graph cross-project
│   ├── graph.json                   ← Índice ligero (un nodo por hermano)
│   └── graph.html                   ← Render visual
├── scripts/
│   ├── check.js                     ← Lint estructural + paridad i18n
│   ├── check-forbidden-terms.js     ← Escaneo de blocklist de "discapacidad" / etc.
│   ├── sync-graphify-skill.js       ← Sincronización cross-project de graphify
│   ├── build-meta-graph.js          ← Reconstruye graphify-out-meta desde los grafos de los hermanos
│   ├── build-head.js                ← Regeneración idempotente de SEO/OG/Twitter
│   ├── sync-cloudflare-skills.js     ← Sincroniza skills relacionados con Cloudflare a un hermano
│   └── rename-doc-lowercase.js      ← Helper one-off para renombrar docs a minúsculas
├── CLAUDE.md                        ← Manual operativo + políticas de la suite
├── CLOUDFLARE.md                    ← Runbook de despliegue (el canónico)
├── README.md, README.es.md          ← Intro pública (es + en)
├── CONTRIBUTING.md, .es.md          ← Flujo de contribución
├── CODE_OF_CONDUCT.md, .es.md       ← Pacto del colaborador
├── SECURITY.md, .es.md              ← Divulgación de vulnerabilidades
├── LICENSE                          ← MIT
└── og-image.svg                     ← Imagen Open Graph
```

---

## 2. El portal (`index.html`)

`index.html` es un único archivo HTML estático. Contiene:

- El `<head>` con los metadatos SEO, Open Graph, Twitter Card,
  JSON-LD `ItemList`, URL canónica y la etiqueta `<html lang>`.
- El `<script>` de pre-paint (`js/prepaint.js`) que establece el
  idioma activo antes de que se parsee cualquier CSS.
- El `<script>` de bootstrap (`js/bootstrap.js`) que detecta el
  locale preferido desde `navigator.languages` y cae a español.
- El `<script>` principal (`js/script.js`) que cablea el selector
  de idioma, los manejadores de clic de las tarjetas y las
  actualizaciones de las meta tags Open Graph.
- El `<body>` con las seis tarjetas, cada una renderizada desde
  un atributo data que mapea al `strings.<locale>.js` del locale
  activo.

El portal **no** renderiza contenido desde una base de datos.
Cada pieza de texto de UI vive en `js/strings.<locale>.js`, y
el portal es un archivo estático puro.

### 2.1 Bootstrap i18n

El script de bootstrap (`js/bootstrap.js`) es intencionalmente
diminuto:

```js
// Pseudo-código, ver js/bootstrap.js para la versión canónica.
function detectLocale(navigatorLanguages, supported) {
  for (const lang of navigatorLanguages || []) {
    const base = lang.toLowerCase().split('-')[0];
    if (supported.indexOf(base) !== -1) return base;
  }
  return 'es'; // predeterminado
}
```

El locale activo se refleja en `<html lang>`, se escribe en
`<title>`, `<meta name="description">`, `<meta property="og:*">`
y el JSON-LD `ItemList`. No se escribe en `localStorage` — el
portal es sin estado a propósito.

---

## 3. El plumbing entre proyectos

### 3.1 `scripts/sync-graphify-skill.js`

La única herramienta de mutación entre proyectos sancionada.
Tiene cuatro sub-comandos:

| Sub-comando | Qué hace |
|---|---|
| `sync --check` (por defecto) | Informa qué hermanos están desincronizados de `~/.claude/skills/graphify/`, sin cambiar nada. |
| `sync --apply` | Copia `SKILL.md` + `references/` en el `.claude/skills/graphify/` de cada hermano. Nunca sobreescribe `.graphifyignore` ni los archivos de estado `.graphify_*`. |
| `update --check` | Informa qué grafos por proyecto están desactualizados (HEAD != campo `Built from commit:` de `GRAPH_REPORT.md`). |
| `update --apply` | Refresca los grafos por proyecto desactualizados y reconstruye `graphify-out-meta/graph.json` + `graph.html`. Pasa `--all` para incluir el propio metaproyecto; pasa `--target <slug>` para acotar a un hermano. |
| `ask <slug> <pregunta>` | Ejecuta `python -m graphify query <pregunta> --graph <slug>/graphify-out/graph.json` desde la raíz del metaproyecto. Establece `cwd` al hermano para que `.graphifyignore` siga aplicando. |

El script es intencionalmente minimalista: sin dependencias de
npm, compara el `sha256` de `SKILL.md`, falla en alto en cualquier
edición entre proyectos que no esté en la whitelist (solo
`SKILL.md` + `references/` — nunca el `sw.js` propio del
hermano).

### 3.2 El meta-grafo (`graphify-out-meta/`)

`graph.json` contiene un nodo por hermano más dos tipos de
aristas:

- **Aristas de similitud** (no dirigidas): parejas de hermanos que
  comparten ≥2 nombres normalizados de comunidades entre sus
  grafos por proyecto.
- **Aristas de jerarquía** (dirigidas, `parent_of`):
  `apptonomia → <hermano>`, reflejando que el metaproyecto carga
  el plumbing entre proyectos.

El meta-grafo se regenera con `scripts/build-meta-graph.js`
después de cada ejecución de `update --apply`. No es la fuente
de verdad de ningún hermano — el `graphify-out/graph.json`
propio de cada hermano lo es.

### 3.3 Grafos profundos por hermano

Cada repo de cada hermano tiene su propio
`graphify-out/graph.json`, construido ejecutando `graphify update
.` dentro de ese hermano. El `scripts/sync-graphify-skill.js
ask` del metaproyecto es la forma orquestada de consultar esos
grafos desde la raíz del metaproyecto sin hacer `cd` al
hermano.

---

## 4. i18n

### 4.1 `js/strings.<locale>.js`

Cada locale tiene su propio archivo:

```js
// js/strings.es.js (forma canónica)
window.STRINGS = {
  es: {
    'meta.title': 'Apptonomia — suite de actividades',
    'meta.description': '…',
    'cards.calculia.name': 'Calculia',
    'cards.calculia.tagline': '…',
    // …
  }
};
```

El script principal (`js/script.js`) lee desde
`window.STRINGS[currentLocale]`; si falta una clave, cae al
bloque `es` (que es la fuente de verdad para cada clave).

### 4.2 Añadir un nuevo locale

Receta:

1. Crea `js/strings.<locale>.js` con el mismo conjunto de claves
   que `js/strings.es.js`, traducido.
2. Añade el locale a la lista `SUPPORTED` en `js/bootstrap.js`.
3. Añade un botón al selector de idioma en `index.html`.
4. Actualiza `scripts/check.js` para incluir el nuevo locale en
   el chequeo de paridad.
5. Actualiza los badges de `README.md` + `README.es.md` (el
   badge `i18n`) para listar el nuevo locale.

Receta completa: ver [`i18n.md`](i18n.md).

---

## 5. Despliegue

Apptonomia se despliega a **Cloudflare Workers + static assets**
vía el conector Git de Cloudflare — automático en cada push a
`main`.

### 5.1 Configuración de Wrangler (`wrangler.toml`)

El `wrangler.toml` del metaproyecto pinea el nombre del proyecto
(`name = "apptonomia"`), el directorio de static assets
(`directory = "."`) y el manejo de rutas no encontradas
(`not_found_handling = "404-page"`, que hace que Cloudflare
sirva el propio `404.html` de este repo).

### 5.2 Cabeceras HTTP de seguridad (`_headers`)

El archivo `_headers` lo lee Cloudflare en el edge. Establece las
cabeceras estándar transversales de la suite (HSTS,
X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
Permissions-Policy, Cross-Origin-Opener-Policy,
Content-Security-Policy) más controles de caché por ruta.

El `Content-Security-Policy` es intencionalmente estricto:
`default-src 'self'; script-src 'self'; style-src 'self'
'unsafe-inline'; img-src 'self' data:; font-src 'self';
connect-src 'self'; frame-ancestors 'none'; base-uri 'self';
form-action 'self'`. El `style-src` incluye `'unsafe-inline'`
porque el portal inline algunos estilos críticos para el primer
paint (tipografía, anillo de foco). Los scripts inline no
están permitidos.

### 5.3 Control de caché

Apptonomia no envía un `sw.js`. La frescura de la caché se
controla puramente por cabeceras HTTP + `?v=` content-hash en
las etiquetas `<script src="js/...">`:

- `js/strings.<locale>.js`, `js/bootstrap.js`, `js/script.js` —
  `?v=<sha256>` en la etiqueta `<script>` de `index.html`. El
  hash se regenera con `scripts/build-head.js` después de un
  cambio de contenido.
- `assets/fonts/*`, `assets/icons/*` — `Cache-Control:
  public, max-age=31536000, immutable`. Estos archivos solo
  cambian cuando quien mantiene cambia las tipografías o
  iconos; la caché inmutable sobrevive un despliegue.
- `index.html`, `404.html` — `Cache-Control: public,
  max-age=0, must-revalidate`. Siempre re-fetcheados; el
  `?v=` en los scripts dentro es lo que invalida el JS
  empaquetado.

### 5.4 Primer despliegue

El primer despliegue de un proyecto nuevo sigue
[`../../CLOUDFLARE.md`](../../CLOUDFLARE.md). El
`CLOUDFLARE.md` del metaproyecto es el runbook canónico para
toda la suite; los `CLOUDFLARE.md` por hermano describen
detalles específicos por app.

---

## 6. Testing

No hay `npm test` en este repo. El chequeo estructural es
`node scripts/check.js`, que:

1. Verifica que cada archivo `.js` del árbol enviado parsee.
2. Verifica que `_redirects` se mantenga dentro de los límites
   por archivo de Cloudflare.
3. Verifica que `_headers` se mantenga dentro del límite por
   archivo de Cloudflare de 100 reglas de cabecera.
4. Verifica que ningún archivo enviado exceda los 25 MB
   (límite por archivo de Cloudflare Pages).

El script `check-forbidden-terms.js` escanea el árbol del portal
en busca de términos clínicos que no deben aparecer en
superficies públicas (ver la [`../../CLAUDE.md`](../../CLAUDE.md)
§B.4 para la regla).

---

## 7. Scripts de housekeeping

La carpeta `scripts/` contiene scripts Node one-off que han
demostrado ser útiles durante el desarrollo. Son Node plano, sin
dependencias:

- `build-head.js` — regeneración idempotente de SEO/OG/Twitter.
  Ejecutar después de cambiar el copy SEO o el JSON-LD
  `ItemList`.
- `build-meta-graph.js` — reconstruye `graphify-out-meta/` desde
  el `graphify-out/` de cada hermano. Lo suele invocar
  `sync-graphify-skill.js update --apply`.
- `rename-doc-lowercase.js` — helper one-off usado por el
  refactor de renombrado en vuelo en algunos hermanos.
  Idempotente.

Ninguno de estos scripts se ejecuta automáticamente en CI. Cada
uno es explícito.

---

## Ver también

- [`spec.md`](spec.md) — definición de producto (no técnica).
- [`i18n.md`](i18n.md) — cómo funciona la UI es/en del portal.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — checklist
  de cumplimiento de la suite.
- [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) — runbook canónico
  de despliegue para toda la suite.
- [`../../CLAUDE.md`](../../CLAUDE.md) §A — manual operativo.
