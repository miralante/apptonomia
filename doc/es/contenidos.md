# Contenidos — documentación de Apptonomia

> 🌐 **Other language:** [English](../en/contents.md)

Esta es la **tabla de contenidos** de la documentación del
metaproyecto Apptonomia. El punto de entrada es
[`indice.md`](indice.md) (español) o [`index.md`](../en/index.md)
(inglés).

---

## Bloque A — Flujo de trabajo

| # | Documento | Para quién |
|---|---|---|
| A.1 | [`indice.md`](indice.md) — punto de entrada de esta carpeta (estás aquí) | Todo el mundo |
| A.2 | [`roles.md`](roles.md) — los tres roles del proyecto | Profesionales de apoyo, desarrolladores/as |
| A.3 | [`spec.md`](spec.md) — qué es Apptonomia, para quién, los no negociables | Nuevos colaboradores/as |
| A.4 | [`equipo.md`](equipo.md) — guía para familias y profesionales de apoyo | Familias, terapeutas, docentes |
| A.5 | [`tecnico.md`](tecnico.md) — arquitectura, estructura, scripts, despliegue | Desarrolladores/as |
| A.6 | [`i18n.md`](i18n.md) — cómo funciona la UI es/en del portal, receta para añadir un locale | Traductores/as, desarrolladores/as |

## Bloque B — Políticas y recetas de toda la suite

| # | Documento | Para quién |
|---|---|---|
| B.1 | [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — checklist de cumplimiento de la suite (UNE 153101, WCAG AAA, lenguaje público, sin telemetría, ajustes / borrado de datos, tipografía del portal, contrato de caché) | Todo el mundo |
| B.2 | [`crear-app.md`](crear-app.md) — receta para añadir un nuevo hermano | Desarrolladores/as de nuevas apps |
| B.3 | [`actividades.md`](actividades.md) — qué envía el metaproyecto (seis tarjetas + plumbing + plantillas) | Nuevos colaboradores/as |

## Bloque C — Plantillas de archivos

| # | Documento / carpeta | Para quién |
|---|---|---|
| C.1 | [`templates/`](templates/) — andamios de copiar y pegar para nuevos hermanos | Desarrolladores/as de nuevas apps |

---

## Otros documentos del repo (fuera de `doc/`)

Viven en la raíz del repo, no bajo `doc/`:

| Documento | Para quién |
|---|---|
| [`../../README.es.md`](../../README.es.md) | Intro pública (español) — qué es el portal |
| [`../../README.md`](../../README.md) | Intro pública (inglés) |
| [`../../CLAUDE.md`](../../CLAUDE.md) | Manual operativo para agentes IA + tabla de fuentes canónicas |
| [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) | Runbook de despliegue en Cloudflare |
| [`../../CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) | Flujo de contribución (español) |
| [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) | Contribution workflow (inglés) |
| [`../../CODE_OF_CONDUCT.es.md`](../../CODE_OF_CONDUCT.es.md) | Pacto del colaborador (español) |
| [`../../CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) | Contributor Covenant (inglés) |
| [`../../SECURITY.es.md`](../../SECURITY.es.md) | Cómo reportar una vulnerabilidad |
| [`../../SECURITY.md`](../../SECURITY.md) | How to report a vulnerability |
| [`../../LICENSE`](../../LICENSE) | Licencia MIT |

Cada hermano de la suite (Calculia, Memofun, Okeymoney, Sinonimia,
Teclatlon, Routime) tiene su propio árbol `doc/<lang>/` con la
misma forma. Son los docs canónicos de producto / apoyo /
técnico de cada hermano — este `doc/` solo cubre el metaproyecto
+ portal.
