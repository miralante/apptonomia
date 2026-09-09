# Roles del proyecto

El metaproyecto Apptonomia tiene **tres roles claramente
diferenciados**. Cada uno tiene su propio espacio en el repo:

| Rol | Quién es | Cómo participa | Dónde mirar primero |
|---|---|---|---|
| 👤 **Persona usuaria** (visitante de `apptonomia.uk`) | La persona que aterriza en el portal y abre una de las seis apps de la suite | Visita `apptonomia.uk`, lee las seis tarjetas, abre la app elegida en su propio dominio. **No participa** en el desarrollo. | El portal — no hay nada más que leer |
| ❤️ **Apoyo / familia** | Ayuda a una persona usuaria a navegar la suite | Elige la app correcta de la suite para una necesidad; ayuda a instalarla en el dispositivo | El `README.md` de cada app de la suite |
| 💻 **Construcción / desarrollador/a** | Mantiene el portal y el plumbing entre proyectos | Edita `index.html`, `js/`, `_headers`, `wrangler.toml`; ejecuta `node scripts/sync-graphify-skill.js`; revisa PRs transversales | [`../../CLAUDE.md`](../../CLAUDE.md) |

> 💡 **La persona usuaria es el público, y su experiencia es
> central**. El portal Apptonomia existe por una sola razón:
> ayudar a la persona visitante a elegir la app correcta de la
> suite y abrirla en su propio dominio. El diseño del portal, el
> copy, la accesibilidad y el SEO siguen ese único propósito.

---

## 🗺️ Por dónde empezar, según perfil

| Si eres… | Empieza por… | Luego… |
|---|---|---|
| 👤 Visitante del portal | [`index.html`](../../index.html) — el propio portal | La app que abriste en una pestaña nueva |
| ❤️ Apoyo / familia | El `README.md` de la app (enlazado desde cada tarjeta) | El `doc/es/equipo.md` de esa app |
| 🤔 Solo quiero entender qué es Apptonomia | [`README.es.md`](../../README.es.md) — intro pública | [`CLAUDE.md`](../../CLAUDE.md) §A — manual operativo |
| 💻 Desarrollador/a del metaproyecto (portal + plumbing) | [`CLAUDE.md`](../../CLAUDE.md) | [`CLOUDFLARE.md`](../../CLOUDFLARE.md) — runbook de despliegue |
| 🌐 Traductor/a del copy del portal | [`i18n.md`](i18n.md) — cómo funciona la UI es/en | [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) |
| 🌐 Colaborador/a de una nueva app | [`crear-app.md`](crear-app.md) — receta + [`templates/`](../templates/) | [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — cumplimiento de la suite |

---

## 🤝 Coordinación entre proyectos

Apptonomia es la **raíz del metaproyecto** de la suite Miralante.
Sus colaboradores coordinan los siete repos hermanos (Calculia,
Memofun, Okeymoney, Sinonimia, Teclatlon, Routime, y cualquier
futura adición) a través de:

- **La tabla de fuentes canónicas** en
  [`../../CLAUDE.md`](../../CLAUDE.md) §A.1 — una fila por tema,
  un doc canónico por tema.
- **El meta-grafo de graphify** en
  [`../../graphify-out-meta/`](../../graphify-out-meta/) — un nodo
  por proyecto hermano más aristas de similitud / jerarquía,
  regenerado por `node scripts/sync-graphify-skill.js update
  --apply`.
- **El script de sincronización del metaproyecto** —
  `scripts/sync-graphify-skill.js` — la única herramienta de
  mutación entre proyectos sancionada. Es intencionalmente
  minimalista (Node, sin deps, sha256-compara `SKILL.md`) para que
  quien mantenga en el futuro pueda leerla en cinco minutos.

> 👉 **¿Quieres participar?** Empieza por
> [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) (en la raíz del
> repo). Explica el flujo de GitHub, etiquetas, ramas y checklists
> por perfil.
