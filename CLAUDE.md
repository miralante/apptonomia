# CLAUDE.md — Flujo para agentes IA

> Este archivo contiene **solo instrucciones operativas para agentes IA**.
> No es una especificación del producto, una referencia técnica, un catálogo ni
> un registro del estado del proyecto.

## 1. Fuentes canónicas

Cada tema se mantiene en un único documento. Antes de actuar, identifica la
materia del cambio y lee su fuente canónica:

| Tema | Fuente canónica |
|---|---|
| Qué es el producto, para quién y principios no negociables | [`doc/es/SPEC.md`](doc/es/SPEC.md) · [`doc/en/SPEC.md`](doc/en/SPEC.md) |
| Arquitectura, estructura, anatomía, APIs, contratos, pruebas y despliegue | [`doc/es/tecnico.md`](doc/es/tecnico.md) · [`doc/en/technical.md`](doc/en/technical.md) |
| Internacionalización | [`doc/I18N.md`](doc/I18N.md) · [`doc/en/I18N.md`](doc/en/I18N.md) |
| Catálogo de actividades | [`doc/es/actividades.md`](doc/es/actividades.md) · [`doc/en/activities.md`](doc/en/activities.md) |
| Cobertura y orientación terapéutica | [`doc/es/equipo.md`](doc/es/equipo.md) · [`doc/en/team.md`](doc/en/team.md) |
| Roadmap y decisiones de producto cerradas | Sigue en Git: cada PR deja su mensaje y la sesión actual puede usar `git log` para reconstruir el camino. |
| Flujo de contribución humana | [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Flujo operativo de agentes IA | `CLAUDE.md` (este archivo) |

La fuente canónica de cada materia prevalece para esa materia. Si dos documentos
se contradicen, no conviertas `CLAUDE.md` en una copia de ambos: contrasta el
código y corrige el documento desactualizado en su ubicación canónica.

## 2. Flujo obligatorio de trabajo

### 2.1 Al empezar una sesión

Este repositorio puede recibir cambios del usuario y de varias sesiones en
paralelo. Ejecuta antes de modificar nada:

```bash
git status --short
git log --oneline -3
node scripts/check.js
```

- Lee y conserva cualquier cambio sin confirmar que no sea tuyo.
- No uses `git reset --hard`, `git clean`, `git checkout -- <archivo>` ni otra
  operación que descarte trabajo para «arreglar» el estado inicial.
- Si `check.js` ya falla, averigua si el fallo pertenece al trabajo en curso antes
  de añadir cambios nuevos.

### 2.2 Antes de editar

1. Clasifica la tarea con la tabla de fuentes canónicas.
2. Lee las secciones relevantes y los archivos de código afectados.
3. Para UI, contenido o actividades, revisa siempre `SPEC.md` §3–§4 y
   `tecnico.md` §5.
4. El plan de proyecto cerrado vive en `git log`. La materia y el documento
   canónico a usar dependen del tema, no de una hoja de ruta externa.

### 2.3 Durante el cambio

- Haz el cambio mínimo y coherente que resuelva la tarea; no mezcles refactors
  ajenos al objetivo.
- No sobrescribas trabajo paralelo. Si el archivo cambió desde la última lectura,
  vuelve a leerlo y reconcilia las dos intenciones.
- Actualiza la fuente canónica correspondiente, no una copia en `CLAUDE.md`.
- Si cambia texto de interfaz, conserva la paridad de idiomas definida en
  `doc/I18N.md` y `doc/en/I18N.md`.
- Si cambia una actividad, sigue la receta de `tecnico.md` §9 y actualiza los
  catálogos y guías que esa receta indica (actividades, equipo).

### 2.4 Antes de terminar

1. Ejecuta siempre `node scripts/check.js`.
2. Ejecuta las pruebas relevantes descritas en `tecnico.md` §12.
3. Comprueba los enlaces si modificaste documentación.
4. Informa solo de verificaciones realmente ejecutadas; indica con claridad las
   pruebas manuales que queden pendientes.

## 3. Operaciones externas y destructivas

- Un despliegue, incluso a un canal temporal de Firebase, realiza una operación
  de red: solicita aprobación explícita antes de ejecutarlo. Los comandos están
  en `tecnico.md` §12.5.
- No publiques, hagas `push` ni abras/cierres recursos externos sin petición o
  autorización explícita.
- No elimines ni reviertas cambios del usuario o de otra sesión para simplificar
  tu tarea; intégralos o explica el conflicto.

## 4. Qué no debe volver a este archivo

No añadas aquí:

- principios de producto o reglas de accesibilidad;
- estructura del proyecto, anatomía de actividades, APIs o recetas;
- catálogo o taxonomía terapéutica;
- hojas de ruta, fases, backlog o estado actual;
- crónicas de implementaciones y bugs ya resueltos.

Esos contenidos pertenecen a las fuentes de §1. El historial detallado de cambios
vive en Git; `CLAUDE.md` debe seguir siendo breve, operativo y estable.
