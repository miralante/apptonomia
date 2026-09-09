# Plantillas de archivo para nuevos hermanos

Esta carpeta es la **fuente canónica** de los andamios de archivo
que cada nuevo hermano de la suite Miralante envía desde el día
uno. Cópialos en la raíz del nuevo repo, y luego ejecuta un
buscar/reemplazar global sobre los marcadores de posición.

> 🌐 **Other language:** [English](README.md)

---

## Cómo usarlas

```bash
# 1. Crea el nuevo repo en GitHub bajo miralante/<slug>.
# 2. Clónalo en local.
git clone git@github.com:miralante/<slug>.git
cd <slug>

# 3. Copia cada archivo de esta carpeta a la raíz del nuevo repo.
cp -R ../apptonomia/doc/templates/. .

# 4. Reemplaza los marcadores. Cada archivo de esta carpeta
#    usa los mismos pocos marcadores:
#      {{SLUG}}        — minúsculas, guiones, ASCII, p. ej. "mi-app"
#      {{DISPLAY_ES}}  — nombre a mostrar en español, p. ej. "Mi App"
#      {{DISPLAY_EN}}  — nombre a mostrar en inglés, p. ej. "My App"
#      {{DOMAIN}}      — dominio completo, p. ej. "mi-app.apptonomia.uk"
#      {{SHAPE}}       — multi-activity / single-purpose / deck-driven / shared-state / single-page
#      {{GIT_ORG}}     — "miralante"
#      {{REPO}}        — mismo que {{SLUG}} por defecto
#      {{YEAR}}        — año en curso (p. ej. 2026)
#      {{AUTHOR}}      — nombre a mostrar de quien mantiene (por defecto: la org de GitHub)
#
#    Un sed rápido funciona en macOS / Linux:
#      find . -type f \( -name '*.md' -o -name '*.js' -o -name '*.html' \
#                          -o -name '*.yml' -o -name '*.toml' -o -name '*.json' \) \
#        -exec sed -i '' \
#          -e 's/{{SLUG}}/mi-app/g' \
#          -e 's/{{DISPLAY_ES}}/Mi App/g' \
#          -e 's/{{DISPLAY_EN}}/My App/g' \
#          -e 's/{{DOMAIN}}/mi-app.apptonomia.uk/g' \
#          -e 's/{{SHAPE}}/single-purpose/g' \
#          -e 's/{{GIT_ORG}}/miralante/g' \
#          -e 's/{{REPO}}/mi-app/g' \
#          -e 's/{{YEAR}}/2026/g' \
#          -e 's/{{AUTHOR}}/miralante/g' \
#          {} +
#
#    En Windows (PowerShell):
#      Get-ChildItem -Recurse -File -Include *.md,*.js,*.html,*.yml,*.toml,*.json |
#        ForEach-Object { (Get-Content $_ -Raw) `
#          -replace '{{SLUG}}', 'mi-app' `
#          -replace '{{DISPLAY_ES}}', 'Mi App' `
#          -replace '{{DISPLAY_EN}}', 'My App' `
#          -replace '{{DOMAIN}}', 'mi-app.apptonomia.uk' `
#          -replace '{{SHAPE}}', 'single-purpose' `
#          -replace '{{GIT_ORG}}', 'miralante' `
#          -replace '{{REPO}}', 'mi-app' `
#          -replace '{{YEAR}}', '2026' `
#          -replace '{{AUTHOR}}', 'miralante' `
#          | Set-Content $_ -NoNewline }

# 5. Recorta CLAUDE.md al alcance del hermano (borra comandos de
#    Block A.2 que no apliquen, borra las secciones de Block B
#    exclusivas del metaproyecto, etc.). La plantilla envía los
#    valores por defecto completos de la suite; recórtala a lo
#    que tu hermano necesita.

# 6. Ejecuta `node scripts/check.js` y `node scripts/check-version-
#    bump.js` del hermano. Ambos deben pasar.

# 7. Abre el primer PR con título "feat: bootstrap <slug> from
#    apptonomia/doc/templates". CI ejecutará los cuatro gates.
```

---

## Qué hay en esta carpeta

```
doc/templates/
├── README.md                     ← este archivo (inglés)
├── README.es.md                  ← este archivo (español)
├── CLAUDE.md                     ← plantilla de manual operativo para agentes IA
├── README.md                     ← (sobrescribe el de arriba, intencional)
├── README.es.md
├── CONTRIBUTING.md
├── CONTRIBUTING.es.md
├── CODE_OF_CONDUCT.md
├── CODE_OF_CONDUCT.es.md
├── SECURITY.md
├── SECURITY.es.md
├── CLOUDFLARE.md
├── LICENSE                       ← MIT, 1 línea
├── _headers                      ← cabeceras de caché de Cloudflare
├── wrangler.toml                 ← config de Cloudflare Workers
├── 404.html
├── sw.js                         ← (solo si el hermano es PWA)
├── manifest.json                 ← (solo si el hermano es PWA)
├── scripts/
│   ├── check.js                  ← lint estructural + paridad i18n
│   └── check-version-bump.js     ← (solo si el hermano es PWA)
└── doc/
    └── en/
        └── readme.md             ← plantilla de intro en lectura fácil
```

Cada archivo debajo de este tiene su propio `README` y es un
andamio para copiar y pegar.

---

## Convenciones que sigue cada plantilla

- **Código técnico en inglés** — variables, nombres de funciones,
  identificadores, comentarios, mensajes de commit. Ver el
  `CLAUDE.md` §B.2 de cada hermano para la política de idiomas
  completa.
- **UI / docs bilingües** — cada cadena de UI y cada doc vive en
  **ambos** `es` y `en`. El contenido técnico en inglés
  (changelog, mensajes de commit, identificadores) sigue en inglés.
- **Ningún marcador en archivos commiteados** — el marcador es una
  herramienta del paso de *bootstrap*; el archivo commiteado debe
  tener todas las ocurrencias de `{{...}}` resueltas.
- **Sin runtime de terceros** — sin Google Fonts, sin analítica,
  sin IA remota. Ver [`../doc/es/guia-de-cumplimiento.md` §4](../es/guia-de-cumplimiento.md#4-sin-telemetría-sin-cuentas-sin-almacenamiento-remoto).
- **Solo tipografías auto-alojadas** — Atkinson Hyperlegible
  (400/700) + Nunito (variable 400–900), empaquetadas bajo
  `assets/fonts/`.
- **Sin paso de build** — HTML/CSS/JS plano servido como static
  assets de Cloudflare. Sin webpack, vite, parcel, esbuild, rollup.

---

## Lo que esta carpeta **no es**

- **No es un starter one-size-fits-all.** Cada hermano sigue
  recortando su `CLAUDE.md` y `scripts/check.js` a su alcance. Las
  plantillas envían los valores por defecto completos de la suite;
  recorta, no expandas.
- **No es un fork.** Los nuevos hermanos copian desde esta carpeta;
  no hacen `git submodule` ni enlazan con `pnpm workspace`. La
  regla del metaproyecto es: sin dependencias entre proyectos.
- **No es la fuente de verdad para decisiones de producto.** Esta
  carpeta envía andamios. Las decisiones de producto (público,
  alcance, actividades) las toma quien mantiene y se escriben en
  `doc/<lang>/spec.md` §1.

---

## Ver también

- [`../doc/es/crear-app.md`](../es/crear-app.md) — receta completa
  para añadir un nuevo hermano.
- [`../doc/es/guia-de-cumplimiento.md`](../es/guia-de-cumplimiento.md) —
  checklist de cumplimiento de la suite que cada nuevo hermano debe
  pasar.
- El `CLAUDE.md` de cada hermano existente — la referencia
  canónica de cómo se organiza un hermano maduro.
