# Documentación de Apptonomia

> Aplicación web de actividades de terapia ocupacional para personas con discapacidad intelectual.
>
> **Aplicación**: [apptonomia.web.app](https://apptonomia.web.app) · **Repositorio**: [github.com/thenkdframe/apptonomia](https://github.com/thenkdframe/apptonomia)

---

## 👥 Roles en el proyecto

Apptonomia tiene **tres roles diferenciados**. Cada uno tiene su espacio:

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (con discapacidad intelectual) | Practica las actividades | Usa la app de forma autónoma. **No participa** en el desarrollo. | La aplicación |
| ❤️ **Apoyo**: familia, cuidador/a, terapeuta, profesor/a | Persona cercana a la persona usuaria | Acompaña, supervisa y aporta contenido (qué actividades faltan, si el wording es claro, si la dificultad es adecuada). | [`equipo.md`](es/equipo.md) |
| 💻 **Construcción**: desarrollador/a | Programa la aplicación | Implementa código, mantiene arquitectura, revisa PRs, despliega. | [`tecnico.md`](es/tecnico.md) |

> 💡 **La persona usuaria es siempre el centro del producto**, pero no
> contribuye al desarrollo ni lee esta documentación técnica. Las decisiones
> técnicas las toman las personas de apoyo y las personas desarrolladoras
> en GitHub.

---

## 🤝 Proyecto multidisciplinar

La construcción de Apptonomia une a **personas de apoyo** (terapeutas,
familias, profesorado) y **desarrolladores**, coordinados en GitHub.

> 👉 **¿Quieres participar?** Empieza por [`CONTRIBUTING.md`](../CONTRIBUTING.md)
> (en la raíz). Explica el flujo de GitHub, las etiquetas, las ramas y los
> checklists de cada perfil.

---

## 🗺️ Mapa de la documentación

Si no sabes por dónde empezar, aquí está el orden recomendado:

1. **`README.md`** — Presentación rápida: qué es, cómo abrirla, qué hay
2. **`SPEC.md`** — Definición del producto: para qué es, para quién, qué reglas nunca se rompen
3. **`tecnico.md`** — Cómo está construida la app (solo si vas a programar)
4. El resto, según tu rol

| Documento | Qué contiene | Cuándo leerlo |
|---|---|---|
| `README.md` | Presentación breve, cómo abrir la aplicación | Primer contacto |
| `SPEC.md` | Definición del producto (qué es, para quién, restricciones innegociables) | Para entender la filosofía del proyecto |
| `guia-rapida.md` | Cómo usar la app paso a paso | Para usuarios y familias |
| `actividades.md` | Catálogo completo de las 57 actividades | Para elegir qué usar |
| `equipo.md` | Cómo usar Apptonomia en terapia | Terapeutas ocupacionales y familias |

---

## 🚦 Rutas por perfil

| Si eres… | Tu rol en el proyecto | Te interesa… | Después… |
|---|---|---|---|
| 👤 Persona usuaria o familiar directo | Persona usuaria / apoyo inicial | [`guia-rapida.md`](es/guia-rapida.md) (cómo se usa) | [`actividades.md`](es/actividades.md) (qué hay) |
| ❤️ Terapeuta, familiar o profesional de apoyo | Apoyo (contribuye con contenido) | [`equipo.md`](es/equipo.md) (cómo usar Apptonomia) | [`actividades.md`](es/actividades.md) (qué hay) · [`SPEC.md`](es/SPEC.md) §3 (las reglas que tu contenido no debe romper) |
| 👩‍🏫 Profesorado | Apoyo educativo | [`guia-rapida.md`](es/guia-rapida.md) | [`actividades.md`](es/actividades.md) (filtros por nivel) |
| 💻 Desarrollador/a | Construcción (implementa) | [`tecnico.md`](es/tecnico.md) (arquitectura, recetas) | [`CONTRIBUTING.md`](../CONTRIBUTING.md) (flujo GitHub, checklists) |
| 🌐 Traductor/a | Construcción (paridad idiomas) | [`I18N.md`](I18N.md) (sistema multiidioma) | [`CONTRIBUTING.md`](../CONTRIBUTING.md) (etiquetas `i18n/*`) |
| 🤔 Solo quiero entender qué es | Curioso | [`SPEC.md`](es/SPEC.md) (definición del producto) | — |

---

## 🇪🇸 Español

### Definición del producto
- [SPEC](es/SPEC.md) — QUÉ es Apptonomia, PARA QUIÉN es y por qué

### Para personas usuarias y familias
- [README](es/README.md) — ¿Qué es Apptonomia? Características principales
- [Guía rápida](es/guia-rapida.md) — Cómo usar la aplicación paso a paso
- [Actividades](es/actividades.md) — Catálogo completo de las 57 herramientas

### Para profesionales y familias (rol de apoyo)
- [Guía para profesionales](es/equipo.md) — Cómo usar Apptonomia en terapia

### Para desarrolladores (rol de construcción)
- [Información técnica](es/tecnico.md) — Arquitectura, API, despliegue

---

## 🇬🇧 English

### Product definition
- [SPEC](en/SPEC.md) — WHAT Apptonomia is, WHO it's for, and why

### For users and families
- [README](en/README.md) — What is Apptonomia? Main features
- [Quick guide](en/quick-guide.md) — How to use the app step by step
- [Activities](en/activities.md) — Complete catalog of all 57 tools

### For professionals and families (support role)
- [Guide for professionals](en/team.md) — How to use Apptonomia in therapy

### For developers (construction role)
- [Technical information](en/technical.md) — Architecture, API, deployment

---

## 📂 Estructura de la documentación

```
doc/
├── index.md           ← Este archivo (punto de entrada)
├── es/
│   ├── SPEC.md       ← Definición del producto
│   ├── README.md     ← Para usuarios
│   ├── guia-rapida.md
│   ├── actividades.md
│   ├── equipo.md     ← Para profesionales
│   └── tecnico.md    ← Para desarrolladores
└── en/
    ├── SPEC.md       ← Product definition
    ├── README.md     ← For users
    ├── quick-guide.md
    ├── activities.md
    ├── team.md       ← For professionals
    └── technical.md  ← For developers
```

---

## 🔗 Documentos del repositorio (raíz)

| Documento | Qué contiene |
|---|---|
| [`README.md`](../README.md) | Presentación rápida del repo y roles del proyecto |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | Cómo contribuir (terapeutas, familias, devs) |
| `CLAUDE.md` | Flujo operativo, coordinación y aprobaciones para agentes IA |
| Historial del proyecto | Sigue en Git (`git log`); no se mantiene una hoja de ruta externa. |
| `I18N.md` | Arquitectura multiidioma (ES/EN) y cómo añadir un idioma |
| `agent.md` | Puntero de compatibilidad que redirige a `CLAUDE.md` |

---

## ℹ️ Información del proyecto

| Dato | Valor |
|------|-------|
| Versión actual | 4.0 |
| Última actualización | 2026-07-15 |
| Idiomas | Español (España), Inglés |
| Número de actividades | 57 |
| Número de módulos | 6 |
| Licencia | MIT |
