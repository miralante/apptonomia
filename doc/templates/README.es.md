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
[![Pacto del colaborador](https://img.shields.io/badge/Pacto%20del%20colaborador-2.1-4baaaa.svg)](CODE_OF_CONDUCT.es.md)

Aplicación web gratuita y estática, sin dependencias, pensada para
nuestras personas tipo: **<one-sentence description of what the
app does>**. Pertenece a la suite **Miralante**, formada por
siete aplicaciones hermanas — la lista completa está en
[🌐 La suite Miralante](#-la-suite-miralante--proyectos-del-grupo)
más abajo.

Sin cuentas, sin cookies, sin analítica: todo funciona en el
navegador y el progreso se guarda solo en `localStorage`, en tu
propio dispositivo.

- 🌐 **Aplicación**: [{{DOMAIN}}](https://{{DOMAIN}})
- 📦 **Repositorio**: [github.com/{{GIT_ORG}}/{{REPO}}](https://github.com/{{GIT_ORG}}/{{REPO}})
- 💻 **Usar en tu propio ordenador**: abre `index.html`
  directamente en un navegador, o usa `npx serve .` /
  `python -m http.server 8080` para la experiencia PWA completa.

---

## 📖 Acerca de

<Un párrafo (3–5 frases) que describa qué es {{DISPLAY_ES}},
para quién es y qué la diferencia de otros enfoques para el
mismo problema. Ancla la descripción en la experiencia concreta
de uso, no en claims de marketing:

- Explica el **propósito** en lenguaje llano — qué puede hacer la
  persona usuaria con la app que antes no podía (o no podía tan
  fácilmente).
- Nombra la **forma** de la app — propósito único vs. catálogo,
  una pantalla vs. varias, PWA vs. página suelta.
- Menciona la **suite** a la que pertenece, con enlace a la tabla
  [🌐 La suite Miralante](#-la-suite-miralante--proyectos-del-grupo)
  más abajo.
- Cierra con los **principios innegociables** que el proyecto
  siempre honra (sin cuentas, sin telemetría, accesibilidad por
  defecto, lenguaje llano, etc.).

Usa [`doc/es/spec.md`](doc/es/spec.md) como fuente de verdad
para las decisiones de producto — nunca las reformules en este
README de forma que pueda divergir de la especificación.

---

## 🎯 Objetivos

<Lista con 3–5 objetivos concretos que {{DISPLAY_ES}} busca
cumplir. Cada objetivo debe ser:**

- **Específico** — algo que la app hace o no hace, no una
  aspiración vaga.
- **Verificable** — se puede señalar una pantalla, un flujo o
  un archivo del repo que lo demuestra.
- **Orientado a la persona usuaria** — formulado desde su punto
  de vista, no desde quien mantiene el código.

Ejemplos de buena formulación:

- "Una persona usuaria nueva puede completar su primera
  actividad en menos de un minuto, sin tutorial."
- "Todas las pantallas funcionan en un móvil de 320 px sin
  scroll horizontal."
- "El progreso sobrevive a un recarga, a una sesión sin
  conexión y a cerrar la pestaña, sin cuenta."

Compara cada objetivo con [`doc/es/spec.md`](doc/es/spec.md):
si un objetivo no está en la especificación, añádelo allí o
sácalo de la lista. Objetivos que se separan de la
especificación se vuelven responsabilidades.

---

## 👥 Audiencia y roles

{{DISPLAY_ES}} está pensada para una **persona tipo** —
<una frase corta que describa a la audiencia en lenguaje no
clínico y no técnico>. La especificación real del producto
vive en [`doc/es/spec.md`](doc/es/spec.md); este README evita
a propósito cualquier etiqueta clínica para que la descripción
pública se mantenga genérica.

El proyecto reconoce tres roles alrededor de la app, cada uno
con su propio punto de entrada:

| Rol | Quién es | Por dónde empieza |
|---|---|---|
| 👤 **Persona usuaria** | Usa la app en el día a día | La propia app |
| ❤️ **Apoyo** | Familia, terapeuta, docente | [`doc/es/equipo.md`](doc/es/equipo.md) |
| 💻 **Construcción** | Desarrollador/a o agente IA | [`doc/es/tecnico.md`](doc/es/tecnico.md) |

Descripción completa de los roles:
[`doc/es/roles.md`](doc/es/roles.md).

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

##  Documentación

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
| [`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md) | Pacto del colaborador (Contributor Covenant 2.1) |
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

<!--
  ┌─────────────────────────────────────────────────────────────────┐
  │ SECCIÓN OPCIONAL `## 🙏 Créditos` — lee antes de               │
  │ mantener o eliminar                                              │
  └─────────────────────────────────────────────────────────────────┘

  Incluye esta sección SOLO cuando {{DISPLAY_ES}} envíe contenido
  de terceros bajo copyright cuya atribución deba preservarse en
  la superficie pública (p. ej. pictogramas ARASAAC, currículos
  oficiales, glosarios de terceros). Cuando la mantengas, la
  atribución DEBE cumplir los requisitos de la licencia de
  terceros (CC BY-SA, CC BY-NC-SA, etc.).

  Cuando {{DISPLAY_ES}} solo envíe código y copia de UI original,
  ELIMINA todo este bloque (el encabezado de sección, los ejemplos
  de abajo y el `---` final). No hay nada que acreditar y la
  sección se convierte en relleno.

  Regla canónica + inventario por hermano:
  [`../../doc/es/guia-de-cumplimiento.md` §9.1](../../doc/es/guia-de-cumplimiento.md#91-sección-opcional--créditos-en-readmemd)

  Patrón de ejemplo A (contenido bajo CC BY-SA — Memofun):

  ## 🙏 Créditos

  La regla "sin IA en el producto" de Memofun se hereda del
  `SPEC.md` de Apptonomia. El contenido de las barajas lo escribe
  directamente el agente de IA de programación que trabaja en este
  repositorio — ver `CLAUDE.md` §"Generating deck content" para
  las reglas, y [`doc/es/spec.md`](doc/es/spec.md) §2.5 para el
  tono y los requisitos de lectura fácil.

  La biblioteca `decks/curriculum/` se construye a partir del
  currículo español de la Comunidad de Madrid y del English
  National Curriculum (DfE), más las rutas vocacionales Entry
  Level / BTEC Level 2.

  Patrón de ejemplo B (pictogramas bajo CC BY-NC-SA — Sinonimia):

  ## 🙏 Créditos

  Las definiciones y ejemplos se basan en glosarios públicos de
  "lenguaje claro" de administraciones y tribunales (IVAP, Red de
  Lenguaje Claro) y en glosarios médicos pensados para pacientes.

  Los pictogramas en `img/` provienen de
  [ARASAAC](https://arasaac.org) (autor Sergio Palao, Gobierno
  de Aragón) bajo licencia CC BY-NC-SA. Si añades un pictograma
  nuevo de ARASAAC, mantén esa licencia y la atribución del pie
  — no pueden usarse comercialmente sin permiso de ARASAAC.
-->

---

## 🌐 La suite Miralante — proyectos del grupo

{{DISPLAY_ES}} es una de las **siete apps** de la suite
**Miralante**, que comparten autor, la misma filosofía de
accesibilidad sin backend, y la misma historia de despliegue.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(portal — landing only, no es app)* | Landing que presenta la suite Miralante | [github.com/{{GIT_ORG}}/apptonomia](https://github.com/{{GIT_ORG}}/apptonomia) |
| Calculia | Matemáticas y razonamiento lógico | [github.com/{{GIT_ORG}}/calculia](https://github.com/{{GIT_ORG}}/calculia) |
| Ludia | Juegos adaptados con reglas, ejercicios y partidas | [github.com/{{GIT_ORG}}/ludia](https://github.com/{{GIT_ORG}}/ludia) |
| Memofun | Tarjetas de estudio para aprendizaje significativo | [github.com/{{GIT_ORG}}/memofun](https://github.com/{{GIT_ORG}}/memofun) |
| Okeymoney | Finanzas personales y autonomía cotidiana | [github.com/{{GIT_ORG}}/okeymoney](https://github.com/{{GIT_ORG}}/okeymoney) |
| Routime | Actividades para rutinas y habilidades de la vida diaria | [github.com/{{GIT_ORG}}/routime](https://github.com/{{GIT_ORG}}/routime) |
| Sinonimia | Diccionario en lenguaje llano | [github.com/{{GIT_ORG}}/sinonimia](https://github.com/{{GIT_ORG}}/sinonimia) |
| Teclatlon | Mecanografía táctil con el teclado físico | [github.com/{{GIT_ORG}}/teclatlon](https://github.com/{{GIT_ORG}}/teclatlon) |
| **{{DISPLAY_ES}}** *(este proyecto)* | **<one-sentence description>** | [github.com/{{GIT_ORG}}/{{REPO}}](https://github.com/{{GIT_ORG}}/{{REPO}}) |

El `apptonomia/CLOUDFLARE.md` del metaproyecto es la guía canónica
de despliegue para toda la suite; cada hermano tiene su propio
doc específico de proyecto que enlaza de vuelta allí.
