# Apptonomia

> 🌐 **Otros idiomas:** [English](README.md)
>
> 🚀 **Pruébalo en vivo:** [apptonomia.uk](https://apptonomia.uk/)

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-success.svg)](#-caracter%C3%ADsticas)
[![Sitio estático](https://img.shields.io/badge/build-ninguno-informational.svg)](#-caracter%C3%ADsticas)
[![Sin PWA](https://img.shields.io/badge/PWA-ninguna-lightgrey.svg)](#-caracter%C3%ADsticas)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentaci%C3%B3n-del-proyecto-biling%C3%BCe)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fsync--graphify--skill.js-blue.svg)](.github/workflows/validate.yml)
[![Pacto del colaborador](https://img.shields.io/badge/Pacto%20del%20colaborador-2.1-4baaaa.svg)](CODE_OF_CONDUCT.es.md)

**Portal de la suite Apptonomia** — una landing estática, gratuita y sin
dependencias que enlaza con siete pequeñas aplicaciones web de la
suite, todas pensadas para que nuestras personas tipo aprendan a su
propio ritmo, en el navegador, sin coste, sin cuentas y sin datos
personales.

- 🌐 **Aplicación**: [apptonomia.uk](https://apptonomia.uk/)
- 📦 **Repositorio**: [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia)
- 💻 **Ejecutar en local**: abre `index.html` directamente en un
  navegador, o sirve la carpeta con cualquier servidor estático
  (
npx serve .` / `python -m http.server 8080`).

---

## 🚀 Pruébalo en vivo

La landing está desplegada en **[apptonomia.uk](https://apptonomia.uk/)** —
ábrela en un navegador para ver la suite completa.

---

## ✨ Características

Este repositorio aloja el **portal de entrada** de la suite Apptonomia:
una única página estática que presenta las siete aplicaciones de la
suite y enlaza con cada una. Es deliberadamente pequeño — un único
`index.html`, un bootstrap de i18n (`bootstrap.js` + `script.js`), los dos
bundles `strings.<locale>.js`, y un `_headers` para las cabeceras HTTP
de seguridad.

- 🌐 **Una sola página estática** — sin framework SPA, sin paso de
  build.
- 🪶 **Cero dependencias en tiempo de ejecución** — HTML/CSS/JS puros.
- 🌍 **Bilingüe** — español (por defecto) e inglés, con conmutación por
  
navigator.languages` o por selector manual.
- 🔒 **Privacidad por defecto** — sin backend, sin base de datos, sin
  telemetría, sin servicios de terceros.
- 📦 **SEO listo** — Open Graph, Twitter Card, JSON-LD `ItemList` con
  las siete apps para búsqueda y recuperación por IA.
- ☁️ **Cloudflare Workers** — desplegado con el binding static-assets.

---

## 👥 Roles del proyecto

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (persona tipo) | Visita la landing para elegir una app de la suite | Abre la página en un navegador; no lee ni escribe código | La aplicación — no hace falta leer nada más |
| ❤️ **Apoyo / familia** | Ayuda a la persona usuaria a navegar la suite | Elige la app de la suite adecuada; ayuda a instalarla en el dispositivo | El `README.md` de cada app de la suite |
| 💻 **Construcción / desarrollador/a** | Mantiene la landing y el cross-project plumbing | Edita `index.html`, `js/`, `_headers`, `wrangler.toml`; ejecuta `node scripts/sync-graphify-skill.js` | [`CLAUDE.md`](CLAUDE.md) |

Ver [`doc/es/roles.md`](doc/es/roles.md) para la descripción completa
de los roles y los patrones trio/par/único en el conjunto de la suite.

---

## 📚 Documentación del proyecto (bilingüe)

Toda la documentación del proyecto vive en la carpeta `doc/`, junto
con algunos archivos en la raíz del repositorio:

| Idioma | Punto de entrada |
|---|---|
| 🇪🇸 Español (este archivo) | [`README.es.md`](README.es.md) |
| 🇬🇧 English | [`README.md`](README.md) |

| Tema | Documento |
|---|---|
| Producto, audiencia, reglas de accesibilidad | [`doc/es/SPEC.md`](doc/es/SPEC.md) · [`doc/en/SPEC.md`](doc/en/SPEC.md) |
| Arquitectura y referencia técnica | [`doc/es/tecnico.md`](doc/es/tecnico.md) · [`doc/en/technical.md`](doc/en/technical.md) |
| Internacionalización (añadir un idioma) | [`doc/es/I18N.md`](doc/es/I18N.md) · [`doc/en/I18N.md`](doc/en/I18N.md) |
| Guía de despliegue (Cloudflare Workers) | [`CLOUDFLARE.md`](CLOUDFLARE.md) |
| Flujo operativo para agentes de IA | [`CLAUDE.md`](CLAUDE.md) |

### 📄 Otros documentos del repo

| Documento | Para quién |
|---|---|
| [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) | Familias, terapeutas y desarrolladores que quieran contribuir |
| [`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md) | Pacto del colaborador (Contributor Covenant 2.1) |
| `CLAUDE.md` | Agentes IA: reglas obligatorias y estado del proyecto |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Guía canónica de despliegue en Cloudflare Workers para la suite (Apptonomia + Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon) |
| Historial del proyecto | En `git log`; no se mantiene una hoja de ruta externa |
| `doc/es/I18N.md` / `doc/en/I18N.md` | Detalles del sistema multiidioma ES/EN |

---

## 🛠️ Preparar / Ampliar contenido

La landing es deliberadamente pequeña, así que "preparar contenido"
significa añadir o actualizar las tarjetas de las apps de la suite en la
página principal:

1. Edita `index.html` para añadir o actualizar una tarjeta (un
   `<a class="card">` por app de la suite, con atributos `data-i18n` para los
   textos bilingües).
2. Añade las claves correspondientes **en ambos** `js/strings.es.js` y
   `js/strings.en.js` (`es` es la fuente de verdad, `en` debe guardar
   paridad).
3. Actualiza el bloque JSON-LD `ItemList` en `index.html` si añades una
   app nueva (y añade la entrada a la tabla "La suite Miralante"
   del `README.md` de cada app de la suite — ver convención de la
   suite más abajo).

Para añadir una nueva app a la suite:

1. Crea un nuevo repo de la suite siguiendo las mismas convenciones
   (`index.html`, `app.js`, `strings.<locale>.js`, `sw.js` con un
   `VERSION` cache-first, `CLOUDFLARE.md`, `CLAUDE.md`, la directiva
   del eufemismo "persona tipo").
2. Añade la app aquí en `index.html` y en la tabla "La suite
   Miralante" del `README.md` de cada app de la suite.
3. Añade la app al índice cross-project en
   [`graphify-out-meta/graph.json`](graphify-out-meta/graph.json)
   ejecutando `node scripts/sync-graphify-skill.js update --apply --target ../<proyecto>`.

---

## ✅ Validar los cambios

```bash
node scripts/sync-graphify-skill.js              # comprueba el sync del skill de graphify (canónico: ~/.claude/skills/graphify/)
node scripts/sync-graphify-skill.js sync --apply # copia donde el SHA diverge
node scripts/sync-graphify-skill.js update --apply # reconstruye grafos por-proyecto obsoletos y el meta-grafo
```

No hace falta `npm install` — los scripts solo usan la librería estándar
de Node. Este repo no tiene `scripts/check.js` (la landing es una sola
página estática sin paso de build); cada repo de la suite tiene sus
propios checks. Como equivalente ligero, `scripts/check-forbidden-terms.js`
corre en CI y escanea la landing pública (`index.html`, `js/*.js`,
`about/privacidad.html`) buscando la blocklist común de la suite
(discapacidad / terapia ocupacional / menores) — consulta el job
`forbidden-terms` en
[`.github/workflows/validate.yml`](.github/workflows/validate.yml).

---

## ☁️ Despliegue

Apptonomia es un sitio totalmente estático (HTML/CSS/JS, sin build), así
que se publica directamente en **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
mediante su integración nativa con GitHub. Las cabeceras de seguridad
HTTP viven en [`_headers`](_headers), y la metadata del proyecto en
[`wrangler.toml`](wrangler.toml). Consulta [`CLOUDFLARE.md`](CLOUDFLARE.md)
con la guía completa (rebuild, rollback, dominio personalizado,
rotación de credenciales).

Las pull requests reciben automáticamente una URL de previsualización
en `apptonomia-<rama>.<subdominio-cuenta>.workers.dev` — sin necesidad
de un workflow extra.

---

## 🔐 Seguridad

Apptonomia es un sitio estático completamente del lado del cliente: sin
backend, sin base de datos, sin telemetría, sin servicios de terceros en
tiempo de ejecución. El modelo de amenaza es esencialmente "qué podría
hacer una página maliciosa offline contra el mismo origen", algo que el
navegador ya aísla. Ver [`SECURITY.es.md`](SECURITY.es.md) (o
[`SECURITY.md`](SECURITY.md)) para reportar una sospecha de forma
privada (canal preferido:
[`hello@apptonomia.uk`](mailto:hello@apptonomia.uk)).

---

## 📄 Licencia

MIT — ver [`LICENSE`](LICENSE).

---

## Contribuir

Issues y pull requests son bienvenidos. Ver [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md)
para el flujo de trabajo (y [`CONTRIBUTING.md`](CONTRIBUTING.md) para la versión en inglés).
Todas las personas participantes deben seguir
[`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).

---

## 🧹 Mantenimiento

Este repo no tiene 
ode_modules`, artefactos de build, ni directorio
de caché. El directorio `graphify-out-meta/` se regenera con

ode scripts/sync-graphify-skill.js update --apply`; para forzar una
reconstrucción limpia del meta-grafo desde cero:

```bash
rm -rf graphify-out-meta/   # el siguiente update --apply lo reconstruye
```

La copia de `.claude/skills/graphify/SKILL.md` en este repo se sobrescribe
con `sync --apply` desde la fuente canónica en
`~/.claude/skills/graphify/` — nunca edites la copia por-proyecto
directamente.

---

## 🌐 La suite Miralante — proyectos del grupo

Este repositorio es el **portal de entrada** de la suite Apptonomia.
Las aplicaciones reales viven en sus propios repositorios:

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(este repo — portal)* | Landing que presenta la suite | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| [Routime](https://routime.apptonomia.uk/) | Actividades para rutinas y vida cotidiana (diseñado para nuestras personas tipo) | [github.com/miralante/routime](https://github.com/miralante/routime) |
| [Calculia](https://calculia.apptonomia.uk/) | Cálculo y razonamiento lógico | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| [Memofun](https://memofun.apptonomia.uk/) | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| [Okeymoney](https://okeymoney.apptonomia.uk/) | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| [Sinonimia](https://sinonimia.apptonomia.uk/) | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| [Teclatlon](https://teclatlon.apptonomia.uk/) | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |
| [Ludia](https://ludia.apptonomia.uk/) | Juegos adaptados: aprende, practica y juega con ayuda | [github.com/miralante/ludia](https://github.com/miralante/ludia) |

El [`CLOUDFLARE.md`](CLOUDFLARE.md) de este repo es la guía canónica
de despliegue de la suite; cada repo de la suite tiene su propio doc
específico que apunta aquí.


