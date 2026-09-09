# Apptonomia

**Página portal que presenta las seis apps gratuitas de la suite Miralante — Calculia, Memofun, Okeymoney, Routime, Sinonimia y Teclatlon.**

---

## ¿Qué es Apptonomia?

Apptonomia es la **página de aterrizaje** de la suite Miralante. No ejecuta una app en sí misma — su trabajo es ayudarte a encontrar la app adecuada de las seis gratuitas para lo que quieras hacer hoy, y llevarte directamente a ella.

Abre **[apptonomia.uk](https://apptonomia.uk)** y verás una tarjeta por cada app. Toca cualquier tarjeta para abrir esa app en tu navegador. Cada app es independiente: funciona en el navegador, sin coste, sin cuentas y sin datos personales.

---

## Qué puedes encontrar aquí

La página muestra seis tarjetas, una por cada app de la suite. Cada tarjeta tiene una descripción corta y un botón que abre la app en su propio dominio.

| App | Qué hace |
|---|---|
| **Calculia** | Matemáticas y razonamiento lógico con actividades cortas y visuales. |
| **Memofun** | Tarjetas de estudio para repaso autónomo, una idea por tarjeta. |
| **Okeymoney** | Finanzas personales y autonomía financiera cotidiana. |
| **Routime** | Actividades cotidianas para entrenar la mente y las habilidades de la vida diaria entre sesiones. |
| **Sinonimia** | Diccionario en lenguaje llano de palabras difíciles, con sinónimos y pictogramas. |
| **Teclatlon** | Mecanografía táctil con el teclado físico del ordenador, dedo a dedo. |

---

## Características principales

### ✅ Diseñada para la autonomía

- **Sin presión**: la página no tiene registro, ni popups, ni marketing
- **Lectura Fácil**: frases cortas, vocabulario cotidiano, una idea por tarjeta
- **Bilingüe**: español (predeterminado) e inglés

### ✅ Accesible para todos

- **Botones grandes**: mínimo 64×64 píxeles
- **Texto grande**: letra clara y legible (Atkinson Hyperlegible)
- **Alto contraste** y anillos de foco visibles
- **Navegación por teclado** y soporte completo de `prefers-reduced-motion`

### ✅ Privacidad por defecto

Sin backend, sin base de datos, sin telemetría, sin servicios externos. La página es un solo archivo HTML estático con un pequeño arranque de i18n y dos paquetes de idioma. No hay nada que borrar, nada que eliminar.

### ✅ En dos idiomas

- 🇪🇸 **Español** (predeterminado)
- 🇬🇧 **English** (se puede cambiar con el botón del idioma)

---

## Cómo empezar

### 1. Abrir la página

Visita **[apptonomia.uk](https://apptonomia.uk)** o abre `index.html` desde un servidor local.

### 2. Elige la app que quieres probar

Lee las seis tarjetas. Cada tarjeta tiene una descripción corta de lo que hace la app y un botón que la abre en una pestaña nueva.

### 3. Instala la app que te guste (opcional)

Cada app es una PWA: puedes instalarla en tu pantalla de inicio para usarla sin conexión, igual que una app nativa. Las instrucciones de instalación están en la documentación de cada app.

### 4. Cambiar el idioma

Toca el botón del idioma (🇪🇸 o 🇬🇧) en la parte superior de la página.

---

## Ejemplo de uso

Imagina que hoy quieres practicar cálculo mental. Abres **[apptonomia.uk](https://apptonomia.uk)** y ves seis tarjetas. La primera dice **"Calculia — matemáticas y razonamiento lógico con actividades cortas y visuales"**. Tocas **Abrir** y Calculia se abre en una pestaña nueva. Desde ahí puedes instalar Calculia en tu pantalla de inicio y usarla cuando quieras.

---

## Más información

- [`../README.es.md`](../../README.es.md) — Visión general del repositorio, build, despliegue
- [`../../CLAUDE.md`](../../CLAUDE.md) — Cómo se gestiona el metaproyecto, y el script de sincronización entre proyectos
- [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) — Guía canónica de despliegue en Cloudflare Workers para toda la suite

---

## Créditos y licencia

Apptonomia es un proyecto de código abierto, distribuido bajo la licencia MIT.

Cada una de las seis apps de la suite tiene su propio repositorio, sus propios maintainers (o compartidos) y su propia licencia MIT. Comparten la misma filosofía de accesibilidad sin backend, pero no comparten código.
