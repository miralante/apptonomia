# Plantilla de app nueva

Esta carpeta es el **andamiaje canónico** de toda app nueva de la
suite Miralante. Es un único árbol: lo que ves aquí es lo que recibe
el repositorio nuevo, salvo este archivo y su versión en inglés.

> 🌐 **Otro idioma:** [English](TEMPLATES.md)

---

## Cómo se usa

No la copies a mano. Desde el metaproyecto:

```bash
cd apptonomia
node scripts/new-app.js --slug mi-app --es "Mi App" --en "My App"
```

[`scripts/new-app.js`](../../scripts/new-app.js) copia esta carpeta a
`../mi-app`, rellena todos los marcadores (lee y escribe en UTF-8, así
que tildes y emojis llegan intactos), resuelve las secciones opcionales
`{{#FLAG}}…{{/FLAG}}` y se detiene —borrando lo que había escrito— si
algún marcador queda sin valor. No ejecuta git, no hace push ni
despliega. Después sigue [`../es/crear-app.md`](../es/crear-app.md) §3.

| Opción | Por defecto | Marcador(es) |
|---|---|---|
| `--slug` (obligatoria) | — | `SLUG`, `REPO` |
| `--es` (obligatoria) | — | `DISPLAY_ES` |
| `--en` | el valor de `--es` | `DISPLAY_EN`, `DISPLAY`, `DISPLAY_NAME` |
| `--domain` | `<slug>.apptonomia.uk` | `DOMAIN` |
| `--email` | `hello@apptonomia.uk` | `SUPPORT_EMAIL` |
| `--shape` | `single-purpose` | `SHAPE` |
| `--branch` | `main` | `PRODUCTION_BRANCH`, `DEFAULT_BRANCH` |
| `--with A,B` | ninguna | conserva las secciones `{{#A}}…{{/A}}` (`HAS_CONTENT_CC_BY_SA`, `HAS_THIRD_PARTY_IMAGES`) |
| `--set CLAVE=valor` | — | cualquier marcador; el resto de los de CLOUDFLARE.md / SECURITY.md tienen valores neutros en `new-app.js` |

**La plantilla está probada.** `node scripts/check-template.js --ui`
genera una app desechable y ejecuta su `check.js`, `smoke-sw.js`,
`suite-markup.js`, `scan-secrets.js` y la batería de Playwright. La CI
del metaproyecto lo ejecuta en cada push: un cambio aquí que rompa una
app nueva rompe la build.

---

## Qué contiene

```
doc/templates/
├── TEMPLATES.md / .es.md      ← este archivo (no se copia)
├── index.html                 ← inicio: montajes de cabecera/pie, contador de estrellas
├── 404.html                   ← enlaces absolutos desde la raíz (se sirve en la URL pedida)
├── about/ legal/ config/      ← las tres páginas que enlaza el pie compartido
│                                 (config/ = ajustes y borrado de datos, §B.5)
├── strings.es.js / .en.js     ← textos; es es la fuente de verdad
├── js/
│   ├── i18n.js                ← núcleo App.i18n (de la app)
│   ├── app.js                 ← lógica del inicio (de la app)
│   ├── sw-register.js         ← registra sw.js desde cualquier profundidad
│   ├── locale-picker*.js      ← cajón de idioma y ajustes (mismo archivo que los hermanos)
│   ├── suite-chrome.js        ← sincronizado: cabecera y pie compartidos
│   ├── stars-engine.js        ← sincronizado: objetivos de estrellas
│   ├── achievements-engine.js ← sincronizado: logros
│   └── feedback.js            ← bloques sincronizados (ronda, recompensa, celebración) + ganchos de la app
├── assets/
│   ├── css/suite-base.css     ← sincronizado: tokens de diseño (la copia canónica vive aquí)
│   ├── css/brand.css          ← colores de acento de la app
│   ├── css/styles.css         ← bloque suite-chrome sincronizado + reglas propias
│   ├── css/locale-picker.css
│   ├── fonts/                 ← Atkinson Hyperlegible, Nunito (OFL)
│   └── icons/icon.svg         ← logo / icono PWA provisional
├── sw.js / manifest.json      ← PWA: páginas network-first, archivos cache-first
├── _headers / wrangler.toml / .assetsignore   ← Cloudflare
├── package.json               ← solo comandos, sin dependencias
├── playwright.config.js / tests/   ← batería de humo (Playwright de la máquina)
├── scripts/
│   ├── check.js               ← estructura, i18n, sw.js ↔ disco, marcadores
│   ├── smoke-sw.js            ← cada entrada del precache carga; comportamiento del 404
│   ├── check-version-bump.js  ← control de subida de VERSION
│   ├── sw-files.js            ← el único lector de sw.js, compartido por los tres anteriores
│   ├── serve.js               ← servidor local que se comporta como Cloudflare
│   ├── scan-secrets.js
│   └── checks/suite-markup.js ← sincronizado: auditoría de cabecera/pie
├── .github/                   ← workflow de CI y plantillas de issues
└── CLAUDE.md, README*, CONTRIBUTING*, CODE_OF_CONDUCT*, SECURITY*,
    CLOUDFLARE.md, LICENSE, THIRD_PARTY_LICENSES.md, doc/
```

Los **archivos sincronizados** son copias de `apptonomia/scripts/suite/`.
No los edites aquí: edita la fuente canónica y ejecuta su script de
sincronización; con `--only apptonomia/doc/templates` llega a esta
carpeta sin tocar los repos hermanos.

---

## Convenciones

- **Código técnico en inglés**; interfaz y documentación bilingües (es/en).
- **Toda clave de localStorage empieza por `<slug>:`**, para que
  `config/` borre los datos de la app sin `localStorage.clear()`.
- **Sin dependencias de terceros en ejecución** — ni CDN, ni analítica, ni IA remota.
- **Sin paso de build** — HTML/CSS/JS servidos como assets estáticos de Cloudflare.
- **Sin marcadores en archivos commiteados** — `check.js` falla si queda alguno.

---

## Ver también

- [`../es/crear-app.md`](../es/crear-app.md) — la receta completa.
- [`../es/bloques-compartidos.md`](../es/bloques-compartidos.md) — los bloques sincronizados.
- [`../es/guia-de-cumplimiento.md`](../es/guia-de-cumplimiento.md) —
  la lista de cumplimiento que toda app nueva debe pasar.
