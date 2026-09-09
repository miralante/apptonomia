# Documentación de Apptonomia

> Mapa de navegación para los documentos propios del metaproyecto.
> Para la **suite en conjunto**, el plumbing entre proyectos y el flujo
> de trabajo de los agentes IA, mira [`../../CLAUDE.md`](../../CLAUDE.md);
> para la guía canónica de despliegue en Cloudflare Workers que cubre
> las seis apps de la suite, mira
> [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md).
>
> **Página**: [apptonomia.uk](https://apptonomia.uk) · **Otro idioma**: [English](../en/index.md)

---

## 📂 Estructura de la documentación

El árbol `doc/` de este repositorio cubre la **propia página de
aterrizaje** más los **documentos transversales de la suite** que rigen
para cada app de la suite Miralante y la receta para añadir nuevas. El
plumbing entre proyectos, el meta-grafo y el manual operativo viven en
`../../CLAUDE.md`. Cada una de las seis apps de la suite tiene su
propio repo y su propio árbol `doc/`.

```
doc/
├── en/
│   ├── index.md               ← (espejo en inglés)
│   ├── README.md
│   ├── spec.md
│   ├── roles.md
│   ├── team.md
│   ├── technical.md
│   ├── i18n.md
│   ├── contents.md
│   ├── activities.md
│   ├── guia-rapida.md
│   ├── guia-de-cumplimiento.md
│   └── crear-app.md
└── es/
    ├── indice.md              ← Este archivo (punto de entrada, ES)
    ├── readme.md
    ├── spec.md
    ├── roles.md
    ├── equipo.md
    ├── tecnico.md
    ├── i18n.md
    ├── contenidos.md
    ├── actividades.md
    ├── guia-rapida.md
    ├── guia-de-cumplimiento.md
    └── crear-app.md
```

Más la carpeta de plantillas de archivos:

```
doc/
└── templates/                  ← Andamios de copiar y pegar para nuevos hermanos
    ├── TEMPLATES.md / TEMPLATES.es.md  ← (intro de esta carpeta)
    ├── CLAUDE.md
    ├── README.md / README.es.md
    ├── CONTRIBUTING.md / CONTRIBUTING.es.md
    ├── CODE_OF_CONDUCT.md / CODE_OF_CONDUCT.es.md
    ├── SECURITY.md / SECURITY.es.md
    ├── CLOUDFLARE.md
    ├── LICENSE
    ├── _headers
    ├── wrangler.toml
    ├── 404.html
    ├── sw.js                   ← (solo PWA)
    ├── manifest.json           ← (solo PWA)
    ├── scripts/
    │   ├── check.js
    │   └── check-version-bump.js ← (solo PWA)
    ├── doc/en/readme.md
    └── .github/
        ├── ISSUE_TEMPLATE/bug.md / bug.es.md
        └── workflows/validate.yml
```

---

Cómo contribuir y otros documentos de la raíz del repositorio
(`CLAUDE.md`, `CONTRIBUTING.md`, `LICENSE`…) viven en la raíz.

---

## 🧭 Por dónde empezar

| Si quieres… | Empieza por |
|---|---|
| 👤 Persona usuaria o familiar (qué es la página, cómo se usa) | [`README.md`](README.md) |
| Entender el metaproyecto, el plumbing entre proyectos y el flujo de los agentes | [`../../CLAUDE.md`](../../CLAUDE.md) |
| Entender qué envía Apptonomia (portal + plumbing) | [`spec.md`](spec.md) |
| Conocer los tres roles del proyecto | [`roles.md`](roles.md) |
| Ayudar a una persona usuaria / terapeuta a usar una app de la suite | [`equipo.md`](equipo.md) |
| Entender la arquitectura, los scripts y el despliegue del metaproyecto | [`tecnico.md`](tecnico.md) |
| Añadir un tercer idioma al portal | [`i18n.md`](i18n.md) |
| Recorrer la tabla de contenidos | [`contenidos.md`](contenidos.md) |
| Ver qué envía el metaproyecto (seis tarjetas + plumbing + plantillas) | [`actividades.md`](actividades.md) |
| Paso a paso de cómo usar Apptonomia | [`guia-rapida.md`](guia-rapida.md) |
| **Checklist de cumplimiento de la suite** (UNE 153101, WCAG AAA, lenguaje público, sin telemetría, ajustes/borrado de datos, tipografía del portal, contrato de caché) | [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) |
| **Añadir un nuevo hermano a la suite** (receta + plantillas de archivos) | [`crear-app.md`](crear-app.md) + [`templates/`](templates/) |
| Desplegar la página o cualquiera de las seis apps de la suite | [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) |
| Contribuir a este repositorio | [`../../CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) |
| Visitar la página del metaproyecto | [apptonomia.uk](https://apptonomia.uk) |

---

## Ver también

- [`../../CLAUDE.md`](../../CLAUDE.md) §A.1 — tabla de fuentes
  canónicas (las fuentes canónicas de este repo por tema).
- El `graphify-out-meta/` del metaproyecto — índice visual
  cross-project (un nodo por hermano + aristas de similitud /
  jerarquía).
