# Apptonomia

Aplicación web de actividades de terapia ocupacional para personas con
discapacidad intelectual. Pensada para usarse de forma autónoma, en el navegador,
sin coste y sin datos personales. Interfaz en español y Lectura Fácil.

## Uso

```bash
python -m http.server 8080
```

(alternativa sin Python: `npx serve .`, sirve en `http://localhost:3000` por
defecto salvo que se indique otro puerto con `-l`. En Windows, si `python` no
está realmente instalado, el sistema puede mostrar un acceso directo a la
Microsoft Store en vez de dar error — en ese caso usa `npx serve .`.)

Abrir http://localhost:8080/site/index.html

Es una PWA: una vez desplegada (HTTPS real), tras la primera visita funciona sin
conexión y se puede instalar como aplicación de escritorio o de móvil.

Despliegue (Firebase Hosting, proyecto `apptonomia`):

```bash
npm run firebase:hosting   # canal de preview
npm run firebase:deploy    # producción
```

Comprobación estructural (sin dependencias, sin linter): verifica que todo el
JS parsea, que cada `tools/<slug>/` tiene sus 5 archivos, que `sw.js` está en
paridad con el disco, que `strings.js` tiene las mismas claves en es/en, y que
el catálogo de `site/index.html` coincide con las carpetas de `tools/`.

```bash
node scripts/check.js
```

## Documentación

| Documento | Contenido |
|---|---|
| `CLAUDE.md` | Reglas obligatorias y convenciones (leer siempre primero) |
| `SPEC.md` | Especificación técnica: arquitectura, diseño modular, APIs y recetas |
| `I18N.md` | Arquitectura multiidioma (ES/EN) y cómo añadir un idioma nuevo |
| `PLAN.md` | Hoja de ruta, catálogo de actividades y taxonomía terapéutica |
| `equipo/` | Guía para familias y profesionales (ruta oculta, solo por URL) |
| `ajustes/` | Ver/borrar el progreso guardado en este navegador (ruta oculta, solo por URL) |

## Estructura

```
apptonomia/
├── assets/            # Núcleo compartido (css, js, pictogramas)
├── site/index.html    # Menú principal (6 módulos) + strings.js (ES/EN)
├── equipo/            # Guía para el equipo de apoyo (ruta oculta)
├── ajustes/           # Ver/borrar localStorage (ruta oculta)
├── tools/<slug>/      # Una carpeta por actividad (index.html, app.js, data.js, strings.js, styles.css)
├── manifest.json      # PWA
└── sw.js              # Service worker (cache offline)
```

## Actividades (49)

| Módulo | Actividades |
|---|---|
| 🎯 Puntería y manos (coordinación) | Atrapa, Teclado, Trazos, Colorear, Piano, Constructores |
| 📋 Mi día a día (autonomía y hogar) | Mis Rutinas, La Casa, Situaciones, Chat Seguro, Chat Acoso, ¿Lo publico?, Señales, Partes del Día, ¿Qué hago primero?, ¿Qué necesito?, ¿Dónde lo guardo?, Lista de Tareas, ¿Qué me pongo? |
| 🧠 Memoria y atención | Parejas, Diferencias, ¿Qué falta?, Ecos, Giros y Espejos, Los Bloques, ¿Dónde está?, El Camino, Encaja la Pieza, El Teatro |
| 🔢 Pensar y contar (razonamiento y matemáticas) | Adivinanzas, Patrones, Los Números, El Monedero, El Reloj, Historias, ¿Qué no encaja?, Puzzle, La Oca, Tres en Raya, Sudoku Visual, Dominó Espacial |
| 💬 Lenguaje y palabras | Chistes, Dichos, Categorías, La Frase, Palabras |
| 💜 Emociones | ¿Cómo me siento?, Calma, Entre Amigos |

Para añadir una actividad nueva: receta en `SPEC.md` §4 y reglas en `CLAUDE.md`.
Para añadir un idioma nuevo: receta en `I18N.md` §5.

## Stack

HTML5 + CSS3 + JavaScript vanilla. Sin frameworks, sin build, sin backend.
Progreso solo en `localStorage`. Interfaz en español e inglés (`App.i18n`, ver
`I18N.md`); audio con Web Speech API (es-ES / en-US según el idioma activo).
