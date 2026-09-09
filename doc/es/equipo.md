# Guía para familias y profesionales de apoyo

> 🌐 **Other language:** [English](../en/team.md)

Este documento es la **guía para familias, terapeutas, docentes y
cuidadores/as** — las personas que ayudan a la persona usuaria a
navegar la suite Miralante. Explica cómo elegir la app correcta de
la suite para una necesidad, cómo instalarla en un dispositivo, y
dónde encontrar documentación más profunda por app.

El portal Apptonomia en `https://apptonomia.uk/` es el punto de
entrada: muestra las seis apps de la suite, una tarjeta por app.
Cada tarjeta abre esa app en una pestaña nueva en su propio
dominio. Desde ahí, cada app es independiente y envía su propio
`doc/<lang>/equipo.md` con la guía de apoyo específica.

---

## 1. ¿Qué es la suite Miralante?

La suite Miralante es **siete aplicaciones web estáticas
gratuitas**, cada una dirigida a una necesidad cotidiana
diferente:

| App | En qué ayuda | Dominio |
|---|---|---|
| **Calculia** | Matemáticas y razonamiento lógico con actividades cortas y visuales | <https://calculia.apptonomia.uk> |
| **Memofun** | Tarjetas de estudio para repaso autónomo, una idea por tarjeta | <https://memofun.apptonomia.uk> |
| **Okeymoney** | Finanzas personales y autonomía financiera cotidiana | <https://okeymoney.apptonomia.uk> |
| **Routime** | Actividades cotidianas para entrenar la mente y habilidades de la vida diaria | <https://routime.apptonomia.uk> |
| **Sinonimia** | Diccionario en lenguaje llano de palabras difíciles | <https://sinonimia.apptonomia.uk> |
| **Teclatlon** | Mecanografía táctil con el teclado físico del ordenador | <https://teclatlon.apptonomia.uk> |

El **portal Apptonomia** en <https://apptonomia.uk> enlaza con las
seis. Cada app es **gratis, sin cuentas, sin telemetría** — el
progreso vive solo en el `localStorage` del dispositivo.

---

## 2. Elegir la app correcta

Las tarjetas del portal están agrupadas por **lo que la persona
quiere hacer hoy**, no por taxonomía terapéutica. Elige la
tarjeta que coincida con la actividad que quieres apoyar:

| Si quieres… | Abre… |
|---|---|
| Practicar cálculo mental, fracciones, dinero, el reloj, patrones, adivinanzas | **Calculia** |
| Repasar un tema con tarjetas entre clases (literatura, geografía, ciencias, historia…) | **Memofun** |
| Practicar decisiones cotidianas sobre dinero (saldo, metas de ahorro, registrar un gasto) | **Okeymoney** |
| Practicar rutinas de la vida diaria, juegos de mesa, o reconocer emociones | **Routime** |
| Buscar el significado en lenguaje llano de una palabra burocrática, legal o médica | **Sinonimia** |
| Practicar mecanografía táctil con el teclado físico del ordenador | **Teclatlon** |

Si no estás seguro de qué app encaja, abre primero **Calculia** —
es la herramienta más transversal (15 actividades entre
matemáticas y razonamiento). Para decisiones de apoyo más
detalladas, el `doc/es/equipo.md` de cada app profundiza.

---

## 3. Instalar una app

Cada app que se envía como PWA puede instalarse en la pantalla
de inicio del dispositivo para uso sin conexión. El flujo es el
mismo en todos los dispositivos:

1. Abre la URL de la app en un navegador moderno (Chrome, Edge,
   Safari, Firefox).
2. Espera a que la página termine de cargar.
3. **iOS / iPadOS**: toca el botón Compartir, luego **Añadir a
   pantalla de inicio**.
4. **Android**: toca el menú del navegador (⋮), luego **Añadir a
   pantalla de inicio** o **Instalar app**.
5. **Chrome / Edge de escritorio**: haz clic en el icono de
   instalación de la barra de direcciones (un pequeño monitor con
   flecha hacia abajo), o abre el menú → **Instalar [Nombre de la
   app]**.

Una vez instalada, la app se ejecuta en su propia ventana, sin la
barra de URLs del navegador, y funciona sin conexión.

### 3.1 Qué se guarda en el dispositivo

- **El progreso, los ajustes y los datos personales** viven en
  `localStorage` en el dispositivo. Sin cuentas, sin
  sincronización en la nube.
- **Puedes borrar todo lo que la app guarda** desde la ruta
  **Ajustes** dentro de la app (o, en las PWA que no envían
  ruta de Ajustes, con un botón "Borrar mis datos" en el menú
  principal).
- El borrado **está acotado al prefijo de `localStorage` de esa
  app**. No afecta a las otras apps del navegador ni a otros
  datos.

---

## 4. Ayudar a una persona a usar una app

### 4.1 Antes de la sesión

- Asegúrate de que el dispositivo está cargado (o enchufado).
- Asegúrate de que la app ya está abierta, en el idioma que la
  persona usa.
- Siéntate al lado de la persona, no enfrente — tu cara no es lo
  que está mirando; la pantalla sí.
- Desactiva las notificaciones durante el tiempo que dure la
  sesión si puedes.

### 4.2 Durante la sesión

- **No cronometres la actividad.** Ninguna de las apps tiene
  cronómetro; la ausencia de reloj es una característica, no un
  bug.
- **No pongas nota.** Las apps no dan feedback negativo. Si la
  persona contesta mal, la app dice algo de ánimo y le deja
  volver a intentarlo.
- **No empujes más allá de la frustración.** Si la persona
  quiere parar, para. La actividad seguirá ahí la próxima
  sesión.
- **Escucha "casi" o "no lo sé" como respuestas legítimas.** Las
  apps sacan a la superficie esas señales por su cuenta.

### 4.3 Después de la sesión

- Deja que la persona cierre la sesión como quiera. Algunas apps
  autoguardan con cada acción; otras guardan al cerrar.
  Ninguna pregunta "¿estás seguro de que quieres salir?".
- Si el dispositivo se comparte con otras personas (hermanos,
  pareja), el `localStorage` por app mantiene el progreso de cada
  persona por separado — no hay estado compartido del que
  preocuparse.

---

## 5. Privacidad y datos

La suite Miralante está construida alrededor de una única promesa
de privacidad: **nada sale del dispositivo**. Concretamente:

- **Sin cuentas.** Cualquiera puede usar cualquier app sin
  registrarse.
- **Sin analítica.** Las apps no llaman a Google Analytics,
  Plausible, Sentry, ni a ninguna otra herramienta de telemetría
  externa.
- **Sin IA remota.** Las apps no llaman a Gemini, OpenAI,
  Anthropic, ni a ninguna otra API de IA. Las tarjetas de
  Memofun, por ejemplo, las escribe quien mantiene el proyecto,
  no se generan en vivo.
- **Sin fuentes desde un CDN.** Las dos tipografías que usa la
  suite (Atkinson Hyperlegible, Nunito) se empaquetan bajo
  `assets/fonts/` en cada repo de cada app.
- **Sin telemetría, sin cookies, sin fingerprinting.** Las apps
  hacen el mismo número de peticiones de red en cada visita — los
  static assets y nada más.

El modelo de amenaza completo está en la
[`../../CLAUDE.md`](../../CLAUDE.md) §A.2.2 y en cada
`CLOUDFLARE.md` por hermano.

### 5.1 Cuándo la persona de apoyo debería plantearse borrar

- La persona que usa el dispositivo ha cambiado (p. ej. un
  dispositivo compartido entre dos usuarios en centros de apoyo
  diferentes).
- La app ha sido usada por otra persona (p. ej. un hermano,
  pareja, amigo) y quieres un lienzo en blanco.
- El dispositivo se va a donar, reciclar o devolver.

En cada caso, la ruta de **Ajustes** dentro de la app (o el
botón del menú) borra solo el progreso de esa app. Las otras
apps del dispositivo quedan intactas.

---

## 6. Cuando algo no funciona

Si una app se comporta de forma inesperada:

1. **Comprueba el navegador.** Las apps requieren un navegador
   moderno (Chrome / Edge / Safari / Firefox de los últimos ~2
   años). Los navegadores más antiguos pueden no soportar el
   service worker, IndexedDB o las características de CSS que
   usan las apps.
2. **Prueba una recarga fuerte.** `Ctrl + Shift + R` (Windows /
   Linux) o `Cmd + Shift + R` (macOS) recarga la página y rompe
   la caché.
3. **Prueba una ventana de incógnito.** Si la app funciona ahí,
   el problema está en tu estado local (una clave de
   `localStorage` corrupta, por ejemplo). Borra y reinstala.
4. **Comprueba la red.** Las apps son capaces de funcionar sin
   conexión una vez instaladas, pero la **primera** carga
   necesita la red. Si el dispositivo está sin conexión y la
   app no se ha instalado aún, verás un 404 o un error de red —
   eso es lo esperado.

Si el problema persiste, **abre una issue** en el repo del
hermano afectado (`miralante/<hermano>`) usando la plantilla
de bug — **no** incluyas datos personales en el reporte.

---

## 7. Contribuir como profesional de apoyo

Las personas profesionales de apoyo son el segundo grupo más
grande de colaboradores de la suite Miralante — después de las
desarrolladoras. Las contribuciones más habituales:

- **Correcciones de redacción.** "Esta frase es demasiado larga",
  "Esta palabra es demasiado formal", "Este ejemplo no encaja con
  la realidad de nuestro centro". Abre una issue `content`.
- **Niveles de dificultad.** "Esta actividad es demasiado fácil /
  difícil para nuestro grupo", "¿Podríais añadir un nivel
  `Básico` / `Intermedio`?". Abre una issue `UX`.
- **Contenido que falta.** "Necesitamos una actividad sobre
  [tema] que la suite aún no tiene". Abre una issue `content`.

Todas las contribuciones son bienvenidas. El flujo de
contribución de cada hermano vive en su propio
`CONTRIBUTING.es.md` (enlazado desde la tarjeta del portal).

---

## 8. Ver también

- El portal Apptonomia en <https://apptonomia.uk>.
- El `doc/es/equipo.md` de cada hermano para la guía de apoyo
  específica de cada app.
- La [`../../CLAUDE.md`](../../CLAUDE.md) del metaproyecto para
  las políticas transversales que afectan a cada app.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) para las
  reglas de cumplimiento cross-project (UNE 153101, WCAG AAA,
  lenguaje público, sin telemetría).
