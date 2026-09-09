# Contribuir a {{DISPLAY_ES}}

> 🌐 **Otros idiomas:** [English](CONTRIBUTING.md)

Gracias por tu interés en contribuir a {{DISPLAY_ES}}. Esta guía
cubre el flujo de trabajo, los roles del proyecto y el pequeño
conjunto de recetas que mantienen la app coherente con el resto de
la suite Miralante.

---

## 🔀 Flujo de GitHub

```text
1. 🔍 Busca o crea una issue (en español o inglés)
2. 💬 Comenta y acuerda el alcance
3. 🌿 Crea una rama (haz fork si no tienes acceso de push)
4. ✏️  Haz cambios siguiendo las recetas de abajo
5. 📤 Abre un Pull Request (PR) referenciando la issue
6. 👀 Espera la revisión
7. ✅ Mergear cuando esté aprobado
```

**Etiquetas de issues** (se usan para clasificar el trabajo entrante):

| Etiqueta | Significado |
|---|---|
| `UX` | Mejora de usabilidad o experiencia |
| `content` | Textos, traducciones, copy de accesibilidad |
| `bug` | Error reproducible en el comportamiento |
| `tech` | Implementación técnica, refactor |
| `docs` | Cambios solo de documentación |
| `good first issue` | Apto para una primera contribución |

### Convenciones de rama

- `feat/<slug>` — funcionalidades nuevas
- `fix/<slug>` — corrección de bugs
- `docs/<slug>` — cambios solo de documentación
- `i18n/<codigo>` — traducción a un idioma (p. ej. `i18n/ca`, `i18n/gl`)

---

## 🤝 Roles en el proyecto

| Rol | Quién es | Cómo participa |
|---|---|---|
| 👤 **Persona usuaria** | Usa la app | No lee ni escribe código; reporta issues |
| ❤️ **Apoyo** | Familia, terapeuta, docente | Propone contenido, correcciones de redacción, niveles de dificultad |
| 💻 **Construcción** | Desarrollador/a | Implementa código, mantiene arquitectura, revisa PRs, despliega |

Ver [`doc/es/roles.md`](doc/es/roles.md) para la descripción
completa de cada rol.

---

## 📏 Qué esperamos de un PR

Antes de abrir un PR:

- [ ] `node scripts/check.js` pasa en local.
- [ ] Si es PWA: `node scripts/check-version-bump.js` pasa, y has
      bumpeado `VERSION` en `sw.js` por cualquier cambio en un
      archivo cacheado.
- [ ] Si has tocado copy de UI, el cambio existe en **ambos**
      `strings.es.js` y `strings.en.js`.
- [ ] Has probado el cambio en un navegador real de escritorio (y
      en móvil si la app es PWA).
- [ ] No has introducido ningún runtime de terceros (Google Fonts,
      analítica, IA remota).
- [ ] No has editado otro hermano de la suite desde este PR.

Si eres colaborador/a nuevo/a, comenta primero en la issue para
que quien mantiene pueda acordar el alcance antes de que empieces
a escribir código.

---

## 🌐 Traducciones

Para añadir un nuevo idioma:

1. Añade el locale a `strings.<locale>.js` con el mismo conjunto
   de claves que `strings.es.js` + `strings.en.js`.
2. Actualiza el selector de idioma en `index.html` y la lista
   `SUPPORTED` en `js/i18n.js`.
3. Añade una fila de badge al `README.md` (el badge `i18n`).
4. Actualiza el `apptonomia/js/strings.<locale>.js` del
   metaproyecto para añadir el nombre de tu app a la tarjeta del
   portal.

Receta completa: ver [`doc/es/i18n.md`](doc/es/i18n.md).

---

## 🤖 Trabajar con agentes IA de código

Si usas un agente IA de código para ayudarte, apúntalo al
[`CLAUDE.md`](CLAUDE.md) del proyecto (o equivalente) antes de que
empiece. El flujo de trabajo del agente está documentado allí:
fuentes canónicas, chequeos obligatorios al iniciar sesión, regla
del bump de caché, política de operaciones externas / destructivas,
y políticas transversales de la suite (lectura fácil, WCAG AAA,
lenguaje público, sin telemetría).

---

## ⚖️ Código de conducta

Todas las personas participantes deben seguir
[`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).

## 🛡️ Seguridad

Ver [`SECURITY.es.md`](SECURITY.es.md) para cómo reportar una
posible vulnerabilidad de forma privada.

---

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones se licenciarán bajo
la [Licencia MIT](LICENSE).
