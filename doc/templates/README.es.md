# {{DISPLAY_ES}}

> 🌐 **Otros idiomas:** [English](README.md)
>
> 🚀 **Pruébalo en vivo:** [{{DOMAIN}}](https://{{DOMAIN}})

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-success.svg)](#-caracter%C3%ADsticas)
[![Sitio estático](https://img.shields.io/badge/build-ninguno-informational.svg)](#-caracter%C3%ADsticas)
[![PWA](https://img.shields.io/badge/PWA-instalable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentaci%C3%B3n)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/validate.yml)

Aplicación web gratuita y estática, sin dependencias, pensada para
nuestras personas tipo: **<one-sentence description of what the
app does>**.

Sin cuentas, sin cookies, sin analítica: todo funciona en el
navegador y el progreso se guarda solo en `localStorage`, en tu
propio dispositivo.

- 🌐 **Aplicación**: [{{DOMAIN}}](https://{{DOMAIN}})
- 📦 **Repositorio**: [github.com/{{GIT_ORG}}/{{REPO}}](https://github.com/{{GIT_ORG}}/{{REPO}})
- 💻 **Usar en tu propio ordenador**: abre `index.html`
  directamente en un navegador, o usa `npx serve .` /
  `python -m http.server 8080` para la experiencia PWA completa.

---

## 🚀 Pruébalo en vivo

{{DISPLAY_ES}} está desplegada en **[{{DOMAIN}}](https://{{DOMAIN}})** —
ábrela en un navegador, instálala en la pantalla de inicio para
usarla sin conexión, y empieza. Sin cuentas, sin telemetría.

---

## ✨ Características

{{DISPLAY_ES}} es **<one-line shape description>**: <two-to-five
short bullet points about what it actually does>.

- 🎯 **<Característica 1>** — <one-sentence description>.
- 🌐 **Bilingüe** — español (por defecto) e inglés.
- 🪶 **Cero dependencias en tiempo de ejecución** — HTML/CSS/JS
  puros, sin build.
- 🔒 **Privacidad por defecto** — sin cuentas, sin cookies, sin
  analítica: todo se guarda en `localStorage` en el dispositivo
  del usuario.
- 📦 **PWA instalable** — funciona sin conexión.
- 🖐️ **Accesibilidad** — áreas de pulsación grandes, alto
  contraste, lenguaje llano, navegación completa por teclado,
  `prefers-reduced-motion`.

---

## 👥 Roles en el proyecto

{{DISPLAY_ES}} tiene tres roles claramente diferenciados — persona
usuaria, apoyo y construcción — cada uno con su propio espacio y
su propio punto de entrada. Ver
[`doc/es/roles.md`](doc/es/roles.md) para la descripción completa.

---

## 📚 Documentación

Toda la documentación del proyecto está en la carpeta `doc/`:

| Idioma | Punto de entrada |
|---|---|
| 🇪🇸 Español (este archivo) | [`doc/es/indice.md`](doc/es/indice.md) |
| 🇬🇧 English | [`doc/en/index.md`](doc/en/index.md) |

Según tu rol y perfil, te interesa una u otra documentación:

| Soy… | Empieza por… |
|---|---|
| 👤 Persona usuaria o familiar | [`doc/es/readme.md`](doc/es/readme.md) |
| ❤️ Terapeuta, familiar o profesional de apoyo | [`doc/es/equipo.md`](doc/es/equipo.md) |
| 🤔 Quiero entender qué es {{DISPLAY_ES}} y por qué | [`doc/es/spec.md`](doc/es/spec.md) |
| 💻 Desarrollador/a | [`doc/es/tecnico.md`](doc/es/tecnico.md) |

### 📄 Otros documentos del repo

| Documento | Para quién |
|---|---|
| [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) | Familias, terapeutas y desarrolladores que quieran contribuir |
| `CLAUDE.md` | Agentes IA: reglas obligatorias y estado del proyecto |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Guía canónica de despliegue en Cloudflare Workers |
| Historial del proyecto | En `git log`; no se mantiene una hoja de ruta externa |
| `doc/es/i18n.md` / `doc/en/i18n.md` | Detalles del sistema multiidioma ES/EN |

---

## 🛠️ Añadir o ampliar contenido

<If the sibling has a catalogue: describe the catalogue parity
rule that ties tools/<slug>/ on disk, the cards in
site/index.html, the rows in settings/index.html, and the
ARCHIVOS list in sw.js.>

Para añadir una actividad nueva:

1. Crea `tools/<slug>/` con los seis archivos canónicos (usa una
   actividad existente como plantilla).
2. Registra la actividad: añade su tarjeta a `site/index.html` (+
   las claves en `site/strings.<locale>.js`), su fila de progreso
   a `config/index.html` (+ las claves en
   `config/strings.<locale>.js`), y sus seis archivos a
   `ARCHIVOS` en `sw.js`.
3. Bumpea `VERSION` en `sw.js` (p. ej. `{{SLUG}}-vN` →
   `{{SLUG}}-vN+1`).
4. Lee primero `doc/es/guia-crear-elementos.md` — técnicas
   didácticas, de gamificación y neuromarketing para nuestras
   personas tipo; si una regla de la guía entra en conflicto con
   `tecnico.md`, gana `tecnico.md`.

<If the sibling has no catalogue (single-purpose), borra esta
sección.>

---

## ✅ Validar cambios

```bash
node scripts/check.js
```

No hace falta `npm install` — el script usa solo la biblioteca
estándar de Node. Comprueba sintaxis JS, anatomía canónica de
archivos, paridad sw.js ↔ disco, paridad es/en de claves, y (si
aplica) el lock de paridad de catálogo.

Si el hermano es PWA, ejecuta también:

```bash
node scripts/check-version-bump.js
```

para confirmar que cualquier cambio en un archivo cacheado vino
acompañado de un bump de `VERSION` en `sw.js` (el gate del bump
de caché).

---

## ☁️ Despliegue

{{DISPLAY_ES}} es un sitio totalmente estático (HTML/CSS/JS, sin
paso de build), por lo que se envía directamente a
**[Cloudflare Workers (static
assets)](https://developers.cloudflare.com/workers/static-assets/)**
a través de su integración integrada con GitHub. Las cabeceras de
seguridad HTTP viven en [`_headers`](_headers), y los metadatos
del proyecto en [`wrangler.toml`](wrangler.toml). Ver
[`CLOUDFLARE.md`](CLOUDFLARE.md) para el runbook completo
(rebuild, rollback, dominio personalizado, rotación de
credenciales).

Los pull requests obtienen automáticamente una URL de preview en
`{{SLUG}}-<branch>.<account-subdomain>.workers.dev` — no hace
falta ningún workflow extra.

---

## 🛡️ Seguridad

{{DISPLAY_ES}} es un sitio estático puramente del lado del cliente:
sin backend, sin base de datos, sin telemetría, sin runtime de
terceros. El modelo de amenaza es esencialmente "lo que una página
maliciosa offline podría hacer sobre el mismo origen", algo que el
navegador ya aísla. Ver [`SECURITY.es.md`](SECURITY.es.md) (o
[`SECURITY.md`](SECURITY.md)) para cómo reportar una posible
vulnerabilidad de forma privada.

---

## 📄 Licencia

MIT — ver [`LICENSE`](LICENSE).

---

## 🤝 Contribuir

Issues y pull requests son bienvenidos. Ver
[`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) para el flujo de trabajo
(y [`CONTRIBUTING.md`](CONTRIBUTING.md) para la versión en inglés).
Todas las personas participantes deben seguir
[`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).

---

## 🌐 La suite Miralante — proyectos del grupo

{{DISPLAY_ES}} es una de las **siete apps** de la suite
**Miralante**, que comparten autor, la misma filosofía de
accesibilidad sin backend, y la misma historia de despliegue.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(portal — landing only, no es app)* | Landing que presenta la suite Miralante | [github.com/{{GIT_ORG}}/apptonomia](https://github.com/{{GIT_ORG}}/apptonomia) |
| Calculia | Matemáticas y razonamiento lógico | [github.com/{{GIT_ORG}}/calculia](https://github.com/{{GIT_ORG}}/calculia) |
| Memofun | Tarjetas de estudio para aprendizaje significativo | [github.com/{{GIT_ORG}}/memofun](https://github.com/{{GIT_ORG}}/memofun) |
| Okeymoney | Finanzas personales y autonomía cotidiana | [github.com/{{GIT_ORG}}/okeymoney](https://github.com/{{GIT_ORG}}/okeymoney) |
| Routime | Actividades para rutinas y habilidades de la vida diaria | [github.com/{{GIT_ORG}}/routime](https://github.com/{{GIT_ORG}}/routime) |
| Sinonimia | Diccionario en lenguaje llano | [github.com/{{GIT_ORG}}/sinonimia](https://github.com/{{GIT_ORG}}/sinonimia) |
| Teclatlon | Mecanografía táctil con el teclado físico | [github.com/{{GIT_ORG}}/teclatlon](https://github.com/{{GIT_ORG}}/teclatlon) |
| **{{DISPLAY_ES}}** *(este proyecto)* | **<one-sentence description>** | [github.com/{{GIT_ORG}}/{{REPO}}](https://github.com/{{GIT_ORG}}/{{REPO}}) |

El `apptonomia/CLOUDFLARE.md` del metaproyecto es la guía canónica
de despliegue para toda la suite; cada hermano tiene su propio
doc específico de proyecto que enlaza de vuelta allí.
