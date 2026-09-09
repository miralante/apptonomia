# Guía rápida

> 🌐 **Other language:** [English](../en/guia-rapida.md)

Esta guía explica **paso a paso cómo usar Apptonomia**, el portal
del metaproyecto de la suite Miralante. También enumera las
**cuatro formas de abrir el portal** y los flujos típicos para
cada rol.

---

## 1. Cómo abrir Apptonomia

Hay **cuatro formas**, ordenadas de la más fácil a la más difícil.
Elige la que se ajusta a tu situación:

| # | Método | Qué necesitas | ¿Sin conexión? | Notas |
|---|---|---|---|---|
| **A** | Desde internet (<https://apptonomia.uk>) | Un navegador | ❌ | El portal en vivo, actualizado automáticamente |
| **B** | Descargar el ZIP de GitHub | Un navegador | ❌ | Una vez descomprimido, no hace falta internet para el propio portal |
| **C** | Servidor local con Python | Python 3 | ❌ | Sirve la carpeta con los tipos MIME correctos |
| **D** | Servidor local con Node.js | Node.js | ❌ | Igual que C, usa `npx serve` |

> 💡 Si solo quieres **mirar el portal**, usa el método **A** o
> **B**. Para **uso sin conexión** necesitas el método B (y
> haber descomprimido antes de quedarte sin internet). Los
> métodos C y D son útiles si quieres desarrollar sobre el
> propio portal.

---

## 2. El portal

El portal en `https://apptonomia.uk/` muestra **seis tarjetas**,
una por cada app de la suite. Cada tarjeta tiene:

- El nombre a mostrar de la app.
- Una tagline de una línea.
- Un botón `Abrir` que lanza la app en su propio dominio en una
  pestaña nueva.

Las tarjetas se organizan en una rejilla responsiva de 1 / 2 /
3 columnas según el ancho del viewport. No hay carrusel, no
hay animación que se dispare automáticamente, no hay copy de
marketing.

## 3. Elegir una app

Toca (o haz clic en) cualquier tarjeta. La app se abre en una
pestaña nueva en su propio dominio (`<slug>.apptonomia.uk`).
Desde ahí, la app es independiente — cada una tiene su propia
instalación PWA, su propio `localStorage`, sus propios ajustes.

### 3.1 Elegir la tarjeta correcta

Si no estás seguro de qué tarjeta encaja con una necesidad:

| Quiero… | Abre… |
|---|---|
| Practicar cálculo mental, fracciones, dinero, el reloj | **Calculia** |
| Repasar un tema con tarjetas | **Memofun** |
| Practicar decisiones cotidianas sobre dinero | **Okeymoney** |
| Practicar rutinas de la vida diaria o juegos de mesa | **Routime** |
| Buscar el significado en lenguaje llano de una palabra burocrática, legal o médica | **Sinonimia** |
| Practicar mecanografía táctil con el teclado físico | **Teclatlon** |

## 4. Botones en cada tarjeta

Cada tarjeta tiene dos affordances principales:

- **La propia tarjeta** es un botón. Pulsarla en cualquier sitio
  (o pulsar Enter con el foco puesto) abre la app en una pestaña
  nueva.
- **El botón `Abrir` visible** es también un botón, con el mismo
  destino.

No hay ruta de ajustes en el propio portal (Apptonomia no guarda
nada en el dispositivo; las apps sí).

## 5. Idioma

Toca el botón de idioma (🇪🇸 o 🇬🇧) en la parte superior del
portal para cambiar entre español e inglés. El idioma activo se
refleja en `<html lang>` para los lectores de pantalla.

El idioma detectado desde `navigator.languages` se usa en la
primera visita; el selector manual lo sobreescribe y se recuerda
para la sesión (el portal no escribe en `localStorage`).

## 6. Instalar una app

Una vez que abres una app desde una tarjeta, la app en sí puede
instalarse como PWA:

- **iOS / iPadOS**: Compartir → **Añadir a pantalla de inicio**.
- **Android**: menú (⋮) → **Añadir a pantalla de inicio** o
  **Instalar app**.
- **Chrome / Edge de escritorio**: icono de instalación en la
  barra de direcciones.

El `doc/<lang>/equipo.md` propio de cada app cubre la instalación
con más detalle.

---

## 7. Cuando algo no funciona

| Síntoma | Causa probable | Qué probar |
|---|---|---|
| El portal no carga | Sin internet, o DNS | Comprueba la URL, luego la red |
| El botón `Abrir` de una tarjeta no hace nada | Bloqueador de pop-ups | Permite pop-ups para `apptonomia.uk` |
| Las tarjetas no se alinean / son difíciles de leer | Navegador muy antiguo | Usa un navegador de los últimos 2 años (Chrome, Edge, Safari, Firefox) |
| El botón de idioma no cambia | JavaScript desactivado | Activa JavaScript; el portal lo necesita para i18n |
| Una app abre pero dice "Service worker registration failed" | Primera carga sin red, antes de instalar la app | Instala la app con red primero; luego funcionará sin conexión |

Para cualquier otra cosa, abre una issue siguiendo
[`../../CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) o contacta
con quien mantiene.

---

## Ver también

- [`spec.md`](spec.md) — qué es el portal y las reglas no
  negociables.
- [`equipo.md`](equipo.md) — guía para familias y profesionales
  de apoyo.
- El `doc/<lang>/guia-rapida.md` propio de cada app hermana para
  el paso a paso de instalación por app.
