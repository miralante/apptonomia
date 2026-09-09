# Catálogo de actividades y superficies

> 🌐 **Other language:** [English](../en/activities.md)

Apptonomia es un **proyecto de portal + plumbing**, no una app de
tiempo de ejecución con una rejilla fija de actividades. Este
documento enumera lo que realmente envía — las seis tarjetas del
portal (las "actividades" con las que interactúa la persona
visitante) más las superficies de plumbing entre proyectos que
mantiene quien desarrolla.

> La definición canónica de producto (público, reglas no
> negociables, i18n, SEO) está en [`spec.md`](spec.md). La
> arquitectura del plumbing está en [`tecnico.md`](tecnico.md).

---

## 1. El portal — las seis tarjetas

El portal en `https://apptonomia.uk/` expone seis tarjetas, una
por cada app de la suite. Cada tarjeta abre esa app en una
pestaña nueva en su propio dominio.

| Tarjeta | Dominio | Qué hace |
|---|---|---|
| **Calculia** | <https://calculia.apptonomia.uk> | Matemáticas y razonamiento lógico con actividades cortas y visuales. |
| **Memofun** | <https://memofun.apptonomia.uk> | Tarjetas de estudio para repaso autónomo, una idea por tarjeta. |
| **Okeymoney** | <https://okeymoney.apptonomia.uk> | Finanzas personales y autonomía financiera cotidiana. |
| **Routime** | <https://routime.apptonomia.uk> | Actividades cotidianas para entrenar la mente y habilidades de la vida diaria entre sesiones. |
| **Sinonimia** | <https://sinonimia.apptonomia.uk> | Diccionario en lenguaje llano de palabras difíciles. |
| **Teclatlon** | <https://teclatlon.apptonomia.uk> | Mecanografía táctil con el teclado físico del ordenador. |

La forma de cada tarjeta está documentada en [`spec.md`](spec.md)
§3.1. Añadir una séptima tarjeta significa seguir la receta en
[`crear-app.md`](crear-app.md) §8.

### 1.1 Qué contiene cada tarjeta

Cada tarjeta tiene:

- El nombre a mostrar de la app en el locale activo.
- Una tagline de una línea en el locale activo.
- Un botón `Abrir` que lanza la app en una pestaña nueva.
- Un `aria-label` que refleja el contenido visible para los
  lectores de pantalla.

No hay carrusel, no hay animación que se dispare automáticamente,
no hay copy de marketing. Las tarjetas se organizan en una rejilla
responsiva de 1 / 2 / 3 columnas.

---

## 2. El plumbing — qué mantiene quien desarrolla

El repo de Apptonomia es también el **plumbing entre proyectos**
de la suite. Las superficies del plumbing son:

| Superficie | Qué hace |
|---|---|
| `scripts/sync-graphify-skill.js` | Sincroniza `~/.claude/skills/graphify/` en el `.claude/skills/graphify/` de cada hermano (compara antes el `sha256` de `SKILL.md`). La única herramienta de mutación entre proyectos sancionada. |
| `scripts/sync-graphify-skill.js ask <slug> <pregunta>` | Consulta el grafo profundo de un hermano desde la raíz del metaproyecto, sin tener que hacer `cd` al hermano. |
| `scripts/sync-graphify-skill.js update --apply` | Refresca los grafos por proyecto que estén desactualizados y reconstruye `graphify-out-meta/graph.json`. |
| `graphify-out-meta/graph.json` | Índice cross-project ligero: un nodo por hermano + aristas de similitud / jerarquía. |
| `graphify-out-meta/graph.html` | Render visual del meta-grafo. |
| `CLAUDE.md` Block A + Block B | Manual operativo + políticas transversales de la suite. |
| `doc/` | Esta carpeta: docs bilingües, cumplimiento de la suite, receta para nueva app, plantillas de archivo. |
| `js/strings.<locale>.js` | Copy de UI del portal en es + en. |
| `index.html` | El propio portal. |
| `_headers` | Cabeceras HTTP de seguridad (CSP, HSTS, Permissions-Policy, caché inmutable para fonts/CSS). |
| `wrangler.toml` | Configuración de Cloudflare Workers + static assets. |

### 2.1 Garantías del plumbing

- **Sin runtime de terceros.** El portal y los scripts de
  plumbing no hacen ningún `fetch` a un host externo en tiempo
  de ejecución.
- **Sin paso de build.** `node scripts/check.js`, `node
  scripts/sync-graphify-skill.js` y `node scripts/build-meta-
  graph.js` son scripts Node planos — no hace falta
  `npm install`.
- **Docs bilingües.** Cada doc se envía en es + en (o en un
  único archivo bilingüe con ambos idiomas claramente marcados).
- **Operaciones destructivas en dos pasos.** Cada comando que
  toca a otro hermano requiere aprobación explícita del usuario
  antes de ejecutarse (ver `CLAUDE.md` §A.3).

---

## 3. Lo que el metaproyecto **no** envía

- **Sin actividades de tiempo de ejecución.** El portal es una
  página; no ejecuta una app.
- **Sin datos de usuario.** Sin `localStorage`, sin IndexedDB,
  sin cookies. Apptonomia no guarda nada en el dispositivo de
  quien visita.
- **Sin PWA / service worker.** El portal no es instalable; el
  `?v=` content-hash en los bundles de i18n es suficiente para
  romper la caché inmutable cuando cambia su contenido.
- **Sin catálogo de actividades por app.** Los catálogos de
  actividades viven en el `doc/<lang>/activities.md` propio de
  cada hermano. El "catálogo" de Apptonomia es la rejilla de
  seis tarjetas del portal, listada en §1 arriba.

---

## Ver también

- [`spec.md`](spec.md) — la definición canónica de producto del
  portal + plumbing.
- [`tecnico.md`](tecnico.md) — cómo funciona el plumbing por
  dentro.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — el
  checklist de cumplimiento de la suite que los siete hermanos
  (y cualquier futura adición) deben pasar.
- [`crear-app.md`](crear-app.md) — la receta para añadir una
  séptima tarjeta (y un séptimo hermano detrás).
