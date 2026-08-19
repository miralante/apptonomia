# Contribuir a Apptonomia

> 🌐 **Otros idiomas:** [English](CONTRIBUTING.md)

Gracias por tu interés en contribuir a Apptonomia. Esta guía cubre
el flujo de trabajo, los roles del proyecto y el pequeño conjunto de
recetas que mantienen el portal coherente.

---

## 🔀 Flujo de trabajo en GitHub

```text
1. 🔍 Buscar o crear un issue (en español o inglés)
2. 💬 Comentar y consensuar el alcance
3. 🌿 Crear una rama (fork si no tienes acceso de push)
4. ✏️  Hacer los cambios siguiendo las recetas de abajo
5. 📤 Abrir un Pull Request (PR) referenciando el issue
6. 👀 Esperar revisión
7. ✅ Merge cuando hay aprobación
```

**Etiquetas de issues** (las usamos para clasificar):

| Etiqueta | Significado |
|---|---|
| `UX` | Mejora de usabilidad o experiencia |
| `contenido` | Textos, traducciones, copy de accesibilidad |
| `bug` | Error reproducible en el comportamiento |
| `tech` | Implementación técnica, refactor |
| `docs` | Cambios en la documentación |
| `good first issue` | Apto para una primera contribución |

### Convenciones de ramas

- `feat/<slug>` — nuevas funcionalidades
- `fix/<slug>` — corrección de bugs
- `docs/<slug>` — cambios solo en documentación
- `i18n/<código>` — traducción a un idioma (ej. `i18n/ca`, `i18n/gl`)

Ejemplos:

- `fix/flash-cambio-idioma`
- `i18n/ca-catalan`
- `docs/mejorar-readme`

### Commits

- Mensaje en **inglés** (convención del repo), resumen en imperativo
- Una cosa por commit — commits grandes se pueden pedir trocear
- Si cierran un issue, incluir `Closes #123` al final

---

## 📝 Qué puedes aportar

Este repositorio es el **portal de entrada** de la suite Apptonomia,
así que la mayoría de contribuciones serán una de estas:

- **Correcciones de copy** — typos, redacción más clara, ajustes de
  accesibilidad en `strings.es.js` / `strings.en.js`
- **Nuevo idioma** — consulta [`doc/es/I18N.md`](doc/es/I18N.md) §5
- **Accesibilidad** — contraste, orden de foco, visibilidad de foco,
  `prefers-reduced-motion`, etiquetas ARIA
- **SEO / metadatos** — `<meta>`, JSON-LD, tarjetas `og:` / `twitter:`
- **Corrección de bugs** — cualquier cosa que se rompa en un navegador
  soportado
- **Cabeceras de seguridad / CSP** — endurecer la política en
  [`_headers`](_headers)

Cada una de estas es lo bastante pequeña como para que las recetas de
abajo la cubran sin una revisión arquitectónica aparte.

---

## 🌐 Recetas

### Corrección de copy

1. Edita `strings.es.js` (el español es la fuente de verdad según la
   política de idiomas del proyecto).
2. Refleja el cambio en `strings.en.js`.
3. Si el cambio toca la estructura HTML visible, ejecuta
   `node scripts/check.js` para verificar la paridad de claves.
4. Abre un PR con una descripción de una línea.

### Nuevo idioma

Consulta [`doc/es/I18N.md`](doc/es/I18N.md) §5 para el paso a paso
completo (registrar el locale en `bootstrap.js`, añadir un
`strings.<locale>.js`, añadir un botón de idioma en `index.html`,
reflejar en ambos archivos de strings). La arquitectura está lista
para multi-idioma desde el inicio: la página va a través de
`App.i18n.t()` y atributos `data-i18n`, así que añadir un idioma
**no requiere cambios** en el bootstrap ni en `script.js`.

### Mejora de accesibilidad

Lee primero [`doc/es/SPEC.md`](doc/es/SPEC.md) §3 — las restricciones
innegociables son botones ≥ 64×64 px, contraste WCAG AA, copy en
lectura fácil y feedback sin presión. Cualquier cosa que las rompa
será rechazada.

### Añadir o endurecer una cabecera de seguridad

Las cabeceras viven en [`_headers`](_headers). La CSP es
deliberadamente estricta (`script-src 'self'`, sin scripts inline; el
bloque JSON-LD se interpreta como dato y no necesita `unsafe-inline`).
Endurecerla es bienvenido; relajarla casi nunca lo es — abre un issue
antes.

---

## ✅ Checklist antes de abrir PR

- [ ] `node scripts/check.js` pasa en local (el proyecto lo trae).
- [ ] Si añadiste cadenas de UI, `es` y `en` están en sincronía.
- [ ] Probaste el flujo en al menos un navegador real de escritorio
      (Chrome / Firefox / Safari).
- [ ] No añadiste ninguna dependencia de runtime nueva (solo HTML /
      CSS / JS vanilla — ver [`doc/es/tecnico.md`](doc/es/tecnico.md) §1).
- [ ] No aflojaste la CSP en `_headers` sin abrir un issue.

---

## 🚫 Lo que este repositorio NO acepta

- **Relajar la CSP** (`script-src 'self'` se queda estricto — no se
  permiten scripts inline; el bloque JSON-LD está bien porque es dato,
  no código).
- **Nuevas dependencias de runtime** — solo HTML / CSS / JS vanilla,
  sin npm, sin CDNs, sin paso de build.
- **Añadir analítica / telemetría / llamadas a terceros de cualquier
  tipo.**
- **Datos personales** de cualquier tipo — el portal es una landing
  pública; no recoge nada.
- **Una SPA, un router o un paso de build.** El portal es una página;
  si te ves alcanzando un router, estás resolviendo el problema
  equivocado.

---

## 📞 Comunicación

- **Issues** → canal principal para propuestas, bugs, preguntas
- **Revisiones de Pull Request** → para revisar cambios concretos

---

## 📜 Código de conducta

Este proyecto sigue [`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).
Participar implica aceptarlo.

---

## 🙏 Gracias

Gracias por dedicar tiempo a una herramienta que ayuda a las personas
a aprender a su propio ritmo.