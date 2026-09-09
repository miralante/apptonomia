# SPEC — Apptonomia (metaproyecto + portal)

> 🌐 **Other language:** [English](../en/spec.md)

Este documento es la **definición de producto** del metaproyecto
Apptonomia: qué envía el portal, qué hace el plumbing entre
proyectos, y los principios no negociables que ambos deben
seguir. Para las definiciones de producto por hermano, lee el
`doc/<lang>/spec.md` propio de cada uno.

---

## 1. ¿Qué es Apptonomia?

Apptonomia es la **raíz del metaproyecto** de la suite Miralante.
Aloja dos cosas en un solo repo:

1. **El portal público** en `https://apptonomia.uk/` — una tarjeta
   por app hermana, enlazando al dominio propio de esa app. Los
   metadatos SEO, Open Graph, JSON-LD `ItemList`, copy
   multilingüe (`js/strings.es.js`, `js/strings.en.js`) y las
   cabeceras HTTP de seguridad viven junto al plumbing entre
   proyectos.
2. **El plumbing entre proyectos** — el meta-grafo en
   `graphify-out-meta/`, el script de sincronización
   (`scripts/sync-graphify-skill.js`), el manual operativo
   `CLAUDE.md` y el árbol `docs/` que define las políticas de
   toda la suite que cada hermano debe honrar.

No envía un producto propio — su alcance es la suite en conjunto.

### 1.1 Los siete hermanos

| Proyecto | Qué envía | Forma |
|---|---|---|
| `apptonomia/` | Suite de actividades de terapia ocupacional (el flagship original) | catálogo multi-actividad |
| `calculia/` | Práctica de matemáticas y razonamiento lógico | catálogo multi-actividad |
| `memofun/` | Entrenador de estudio/recuerdo basado en tarjetas | basado en barajas |
| `okeymoney/` | Entrenador de finanzas personales y autonomía cotidiana | app de estado compartido único |
| `sinonimia/` | Diccionario en lenguaje llano | single-page app |
| `teclatlon/` | Entrenador de mecanografía táctil (solo teclado físico) | app de actividad única |
| `routime/` | Suite de actividades de habilidades para la vida diaria | catálogo multi-actividad |

Cada hermano tiene su propio repo, su propio dominio, su propio
`CLAUDE.md` y su propio árbol `doc/<lang>/`.

---

## 2. Principios no negociables

### 2.1 Lectura fácil siempre (UNE 153101)

Todo el texto que ve la persona usuaria en el portal sigue la
**UNE 153101:2018 EX** (norma española de lectura fácil) y las
guías europeas de lectura fácil de Inclusion Europe: frases
cortas, una idea por frase, vocabulario cotidiano, sin jerga
clínica ni técnica. Añadir un nuevo idioma o una nueva pieza de
copy de UI significa seguir UNE 153101 — no parafrasearla.

### 2.2 WCAG AA mínimo, AAA siempre que sea posible

El portal cumple WCAG 2.1 con **AA como mínimo** y adopta los
**criterios AAA que aplican al público de la suite** siempre que
sea factible. La conformidad AAA completa no es realista para
una aplicación web entera; la
[`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) §2 del
metaproyecto enumera los criterios AAA que SÍ son aplicables y
que la suite honra.

### 2.3 Sin telemetría, sin cuentas, sin almacenamiento remoto

El portal es una sola página HTML estática con un pequeño
arranque de i18n y dos paquetes de idioma. Sin backend, sin base
de datos, sin telemetría, sin runtime de terceros, sin cuentas,
sin cookies, sin analítica. Todo funciona en el navegador.

### 2.4 Lenguaje público: eufemismo "usuario/a tipo"

El objetivo real de la suite vive en la documentación interna; el
portal usa **"usuario/a tipo"** en cualquier copy que describa al
público. La regla completa — incluyendo dónde se admite y dónde
no cada término — está en
[`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) §3.

### 2.5 Cero build, cero dependencias

Sin `npm install`, sin bundler, sin transpilador. El portal es
HTML/CSS/JS plano servido como static assets de Cloudflare.
Añadir un paso de build es una puerta de un solo sentido que
rompe cada hermano y el portal de golpe.

---

## 3. Estructura del portal

### 3.1 Forma visual

El portal tiene **seis tarjetas** — una por cada app de la
suite. Cada tarjeta tiene:

- El nombre a mostrar de la app (en el locale activo).
- Una tagline de una línea (en el locale activo).
- Un botón `Abrir` que lanza la app en su propio dominio en una
  pestaña nueva.
- Un `aria-label` que describe el mismo contenido para
  lectores de pantalla.

Las tarjetas se organizan en una rejilla responsiva: una
columna en móvil, dos en tablet, tres en escritorio. No hay
carrusel, no hay animación que se dispare automáticamente, y no
hay copy de marketing.

### 3.2 SEO + accesibilidad

El portal envía:

- `<title>` + `<meta name="description">` por locale.
- Metadatos Open Graph + Twitter Card por locale.
- JSON-LD `ItemList` de los seis productos, en `@context:
  ItemList` con un `ListItem` por app.
- `<link rel="canonical">` a `https://apptonomia.uk/`.
- `<html lang="es">` (o `en`) establecido por el bootstrap de
  i18n en el primer paint.
- Atkinson Hyperlegible + Nunito como únicas tipografías,
  empaquetadas bajo `assets/fonts/` (ver
  [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) §6).

### 3.3 i18n

- Dos locales: `es` (predeterminado) y `en`.
- Detectado desde `navigator.languages` en el primer paint, con
  un selector manual como fallback.
- El locale activo se refleja en `<html lang>` para los lectores
  de pantalla.
- El copy de UI vive en `js/strings.<locale>.js`; **nunca** en
  hardcoded dentro de `index.html` o `app.js`.
- Ver [`i18n.md`](i18n.md) para la receta para añadir un tercer
  locale.

---

## 4. Plumbing entre proyectos

### 4.1 El script de sincronización

`scripts/sync-graphify-skill.js` es la única herramienta de
mutación entre proyectos sancionada. Copia
`~/.claude/skills/graphify/` en el `.claude/skills/graphify/` de
cada hermano, comparando antes el `sha256` de `SKILL.md`.
También puede refrescar los grafos por proyecto que estén
desactualizados y reconstruir el meta-grafo en
`graphify-out-meta/`. Lee el comentario de cabecera para la
superficie completa.

### 4.2 El meta-grafo

`graphify-out-meta/graph.json` contiene un índice cross-project
ligero:

- **Un nodo por proyecto hermano**, con el nombre a mostrar del
  proyecto, su slug y su dominio.
- **Aristas de similitud** (no dirigidas): parejas de hermanos
  que comparten ≥2 nombres normalizados de comunidades entre sus
  grafos por proyecto.
- **Aristas de jerarquía** (dirigidas, `parent_of`):
  `apptonomia → <hermano>`, reflejando que la raíz del
  metaproyecto carga el plumbing entre proyectos.

`graph.html` es la representación visual.

### 4.3 Grafos profundos por hermano

Cada hermano posee su propio grafo profundo en
`<hermano>/graphify-out/graph.json`, construido por
`graphify update .` dentro del repo de ese hermano. La
[`../../CLAUDE.md`](../../CLAUDE.md) §B.5.2 del metaproyecto
documenta cuándo consultar el grafo profundo de un hermano
(por defecto) vs. el meta-grafo (para comparaciones
cross-project).

---

## 5. Despliegue

El portal se despliega a **Cloudflare Workers + static assets**
vía el conector Git de Cloudflare — automático en cada push a
`main`. Las cabeceras HTTP de seguridad viven en `_headers`;
los metadatos del proyecto en `wrangler.toml`. Ver
[`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) para el runbook
completo.

> Apptonomia no envía un `sw.js` (sin service worker, sin
> instalar en pantalla de inicio). El `?v=` content-hash en
> los bundles de i18n / strings es suficiente para romper la
> caché inmutable cuando cambia su contenido; ver
> `scripts/build-head.js` y las query strings `?<hash>` por
> locale en las etiquetas `<script src="...">` de
> `index.html`.

---

## 6. Lo que este repo **no es**

- **No es una app de tiempo de ejecución.** El portal no envía
  actividades, envía enlaces a las apps.
- **No es la fuente de verdad de ningún hermano.** El
  `doc/<lang>/spec.md` de cada hermano es la fuente de verdad
  para ese producto. Este documento es la fuente de verdad
  solo para el portal + plumbing.
- **No es un fork de ningún hermano.** Los hermanos pueden
  copiar desde [`templates/`](../templates/) pero no hacen
  `git submodule` ni enlazan con workspace a este repo.

---

## Ver también

- [`../../CLAUDE.md`](../../CLAUDE.md) — manual operativo para
  agentes IA y humanos que trabajan en toda la suite.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — checklist
  de cumplimiento de la suite (UNE 153101, WCAG AAA, lenguaje
  público, sin telemetría, ajustes / borrado de datos,
  tipografía del portal, contrato de caché).
- [`crear-app.md`](crear-app.md) — receta para añadir un nuevo
  hermano, incluidas las plantillas de archivo bajo
  [`templates/`](../templates/).
- [`tecnico.md`](tecnico.md) — cómo funciona el plumbing del
  metaproyecto por dentro.
- El `doc/<lang>/spec.md` de cada hermano para las definiciones
  de producto por proyecto.
