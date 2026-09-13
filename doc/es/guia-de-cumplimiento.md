# Guía de cumplimiento de la suite

Esta es la guía canónica de cumplimiento para todas las apps de la
suite Miralante — Apptonomia, Calculia, Memofun, Okeymoney, Sinonimia,
Teclatlon, Routime — y para cualquier nueva app que se una a ella.
Es espejo y complemento de las políticas de toda la suite en el
metaproyecto [`../../CLAUDE.md`](../../CLAUDE.md) §B; cuando ambas
difieren, esta guía es la versión detallada y `CLAUDE.md` es el
puntero autoritativo.

> 🌐 **Other language:** [English](../en/guia-de-cumplimiento.md)

---

## Contenido

1. [Lectura fácil siempre (UNE 153101)](#1-lectura-fácil-siempre-une-153101)
2. [WCAG AA mínimo, AAA siempre que sea posible](#2-wcag-aa-mínimo-aaa-siempre-que-sea-posible)
3. [Lenguaje público: eufemismo "usuario/a tipo"](#3-lenguaje-público-eufemismo-usuarioa-tipo)
4. [Sin telemetría, sin cuentas, sin almacenamiento remoto](#4-sin-telemetría-sin-cuentas-sin-almacenamiento-remoto)
5. [Patrón de ajustes / borrado de datos](#5-patrón-de-ajustes--borrado-de-datos)
6. [Tipografía del portal](#6-tipografía-del-portal)
7. [GEO, AEO y LLMO (presencia en buscadores, answer engines y LLMs)](#7-geo-aeo-y-llmo-presencia-en-buscadores-answer-engines-y-llms)
8. [Contrato de caché del service worker](#8-contrato-de-caché-del-service-worker)
9. [Anatomía de archivos obligatoria por hermano](#9-anatomía-de-archivos-obligatoria-por-hermano)
10. [Auto-verificación de cumplimiento antes de abrir un PR](#10-auto-verificación-de-cumplimiento-antes-de-abrir-un-pr)

---

## 1. Lectura fácil siempre (UNE 153101)

Todo el texto que ve la persona usuaria (cadenas de la UI,
instrucciones, ejemplos, mensajes de error, flujos de onboarding,
textos de ajustes) sigue la **UNE 153101:2018 EX** (norma española
de lectura fácil) y las guías europeas de lectura fácil de
Inclusion Europe. Reglas operativas:

- **Una idea por frase.** Si te ves escribiendo un punto y coma o
  una subordinada larga, parte la frase.
- **Vocabulario cotidiano.** Nada de términos clínicos, técnicos,
  regulatorios o jerga en la UI. Si una palabra tiene un sinónimo
  más sencillo, úsalo. (Cuando el texto es *contenido* — p. ej.
  una entrada del diccionario de Sinonimia sobre un trámite real
  — eso es contenido, no etiquetado; la regla de términos
  clínicos de más abajo no aplica.)
- **Frases cortas.** Un techo blando de ~15 palabras por frase es
  un buen comienzo; por debajo de 12 es mejor.
- **Voz activa.** "La aplicación muestra una celebración" gana a
  "Una celebración es mostrada".
- **Tú directo.** Háblale a la persona usuaria ("puedes tocar…"),
  no sobre ella ("el usuario puede tocar…").
- **Sin acrónimos ni siglas** a menos que la persona los haya visto
  expandidos antes en la misma pantalla.
- **Sin sarcasmo, ironía, juegos de palabras ni dobles sentidos.**
  Rompen la comprensión literal y la Lectura Fácil.

Cada hermano cita esta norma en su `doc/<lang>/spec.md` §3 y puede
añadir reglas de lectura fácil específicas del proyecto encima.

---

## 2. WCAG AA mínimo, AAA siempre que sea posible

Toda la suite cumple WCAG 2.1 con **AA como mínimo** y adopta los
**criterios AAA que aplican al público de la suite** siempre que
sea factible. La conformidad AAA completa no es realista para una
aplicación web entera (el propio W3C señala que AAA está pensado
para contextos específicos); la lista de abajo enumera los
criterios AAA que SÍ son aplicables y que esta suite honra.

### 2.1 Criterios AAA adoptados

- **1.4.6 Contraste (mejorado)** — contraste de texto ≥ 7:1
  (texto grande ≥ 4.5:1). WCAG AA (4.5:1) es el suelo legal; AAA es
  el objetivo de diseño. Pares verificados en Okeymoney:
  `#F2F4F8` sobre `#161A21` = 14.6:1, `#B7BDC9` sobre `#161A21` =
  8.4:1. Los demás hermanos apuntan al mismo ratio cuando se
  vuelva a tocar su paleta de tokens.
- **3.1.5 Nivel de lectura** — cuando el contenido es para el
  público general no requiere capacidad lectora avanzada. Ya
  cubierto por UNE 153101 (§1) y las guías de lectura fácil de
  Inclusion Europe.
- **1.4.1 Uso del color** — el color nunca es el único canal.
  Cada estado de feedback (éxito / pista / error / bloqueo)
  combina forma, icono, texto o sonido. `App.feedback.success()`,
  `App.feedback.encourage()` y `App.feedback.lockUntilAck()` del
  núcleo compartido codifican esto; los hermanos deben reutilizar
  estos métodos, no reinventar canales de feedback propios.

### 2.2 Redacción por proyecto

El `doc/<lang>/spec.md` §3.5/§5/§6 de cada hermano referencia este
mínimo usando la frase literal **"WCAG AA mínimo, AAA siempre
que sea posible"**. Mantener esa frase en cada `spec.md` es lo
que permite que la regla sobreviva a que los docs de un solo
proyecto se desactualicen.

---

## 3. Lenguaje público: eufemismo "usuario/a tipo"

La suite envía productos cuyo objetivo real es el apoyo de
terapia ocupacional a personas con discapacidad intelectual, pero
**ese encuadre no se usa en las superficies públicas** — solo en
la documentación interna.

### 3.1 Dónde se admite cada término

- **"Discapacidad intelectual"** es el término canónico y **solo
  puede aparecer en documentación interna** (`CLAUDE.md`,
  `doc/<lang>/spec.md`, `technical.md` / `tecnico.md`, `roles.md`,
  `CONTRIBUTING.md`, `CONTRIBUTING.es.md`, los `_test_*.js` y otros
  ficheros de tooling en `scripts/`). Está explícitamente
  **prohibido** en superficies públicas, el portal del
  metaproyecto, READMEs que cualquiera pueda leer sin
  autenticación, charlas públicas, copy de redes sociales, notas
  de prensa y material de marketing.
- **"Usuario/a tipo"** (plural "usuarios/as tipo") es el eufemismo
  aceptado para el público en las superficies públicas. Se usa
  como marcador genérico de perfil, no como etiqueta para ninguna
  persona real.
  - Aplica a `README.md` / `README.es.md`, el portal público
    (`apptonomia.uk/`), charlas públicas, copy de redes sociales,
    notas de prensa, marketing, y cualquier documento de
    colaborador que también funcione como descripción pública del
    proyecto (p. ej. `CONTRIBUTING.md`).
  - **No** aplica a la UI de las apps en sí: la "Regla
    obligatoria: cero menciones en el producto que ve la persona
    usuaria" (ver `spec.md` §4 de cada hermano) sigue
    prohibiendo **cualquier** mención, incluido "usuario/a tipo",
    en `index.html`, `app.js`, `strings.<locale>.js`,
    `js/i18n.js`, `about/privacidad.html` y cualquier otra
    superficie de usuario. El eufemismo es para el mundo
    exterior, no para lo que la persona visitante lee en el sitio.
  - **No** aplica al contenido del proyecto que nombra un concepto
    clínico por su nombre real (p. ej. una entrada del
    diccionario de Sinonimia sobre un certificado de discapacidad,
    o un caso de estudio de Routime sobre un trámite
    burocrático): eso es contenido, no etiquetado del público.

### 3.2 Razón de ser

Presentar el objetivo real del proyecto en docs de mantenimiento
es útil y necesario para quien mantiene y contribuye a la suite.
Presentarlo en marketing o en el portal no es necesario ni
respetuoso con el público — "usuario/a tipo" permite al material
público describir para qué son las apps (cuál es el perfil
habitual) sin nombrar públicamente a un grupo clínico.

---

## 4. Sin telemetría, sin cuentas, sin almacenamiento remoto

Cada app de la suite es un **sitio estático puramente del lado
del cliente** — sin backend, sin base de datos, sin telemetría, sin
runtime de terceros, sin cuentas, sin cookies, sin analítica, sin
copia de seguridad remota.

- **Lo que se envía a quien visita es HTML/CSS/JS plano** servido
  como archivos estáticos desde Cloudflare Workers + static assets
  (o cualquier host estático equivalente).
- **Los datos de la persona usuaria viven solo en su navegador**
  (`localStorage` para estado, opcionalmente IndexedDB para datos
  más grandes). Puede borrarlos en cualquier momento desde la ruta
  de **Ajustes** dentro de la app o desde los controles de datos
  del sitio del navegador.
- **Ningún `fetch` a hosts externos en tiempo de ejecución.** La
  página puede cargar assets estáticos del mismo origen; no debe
  llamar a terceros. Esto incluye, entre otros: APIs de IA
  (Gemini, OpenAI, Anthropic, …), analítica (Google Analytics,
  Plausible, …), reporte de errores (Sentry, …), fuentes (Google
  Fonts, …).
- **Solo tipografías auto-alojadas.** Las dos fuentes que usa la
  suite son Atkinson Hyperlegible (400/700) y Nunito (variable
  400–900), empaquetadas como `.woff2` bajo `assets/fonts/`. Sin
  CDN, sin `@import` desde `fonts.googleapis.com`.

Esta regla se refleja en el metaproyecto
[`../../CLAUDE.md`](../../CLAUDE.md) §A.2.2 (regla "No introducir
dependencias entre proyectos") y §B.5 (sync de graphify, la
única herramienta de mutación entre proyectos sancionada). El
razonamiento es el mismo que en §6: el modelo de amenaza de un
sitio estático offline es "lo que una página maliciosa offline
sobre el mismo origen podría hacer", algo que el navegador ya
aisla.

---

## 5. Patrón de ajustes / borrado de datos

Cada hermano que envía una PWA expone una forma de que la persona
de apoyo del dispositivo (familia, docente, terapeuta) **vea y
borre lo que el navegador local almacena para esa app**. La forma
varía por proyecto pero el contrato es el mismo, para que quien
contribuye no lo reinvente por app.

### 5.1 Referencia canónica

- **Routime** es la implementación canónica. Lee
  [`../../../routime/settings/`](../../../routime/settings/) (una
  ruta oculta *fuera del menú*: `index.html` + `app.js` +
  `strings.<locale>.js` + `styles.css`) y los comentarios en
  [`../../../routime/settings/app.js`](../../../routime/settings/app.js)
  para ver el razonamiento completo: confirmación en dos pasos, sin
  analítica, sin red. Routime también envía una exportación /
  importación en JSON porque su catálogo tiene 69 actividades y
  el esfuerzo se justifica ahí.
- **Calculia** tiene su propia carpeta `settings/`
  ([`../../../calculia/settings/app.js`](../../../calculia/settings/app.js)).
  Cuando la toques, alineala con la referencia de Routime, no la
  dupliques.

### 5.2 Convención que sigue cada hermano que envía una PWA

1. **Un prefijo de `localStorage` por app.** Decláralo como
   constante cerca del inicio del `app.js` raíz y úsalo para cada
   clave — no inventes prefijos ad-hoc. Prefijos verificados:

   | Proyecto | Prefijo | Evidencia |
   |---|---|---|
   | `routime` | `routime:` | canónico, ver [`../../../routime/settings/app.js`](../../../routime/settings/app.js) |
   | `calculia` | `calculia:` | [`../../../calculia/settings/app.js`](../../../calculia/settings/app.js) |
   | `memofun` | *TBD — claves vistas: `prefs.cursoFijado` (sin prefijo de proyecto)* | necesita auditoría clave por clave |
   | `okeymoney` | `okeymoney:` (libro contable compartido `okeymoney:data`) | [`../../../okeymoney/app.js`](../../../okeymoney/app.js) |
   | `sinonimia` | `sinonimia-` (con guion) — vista: `sinonimia-idioma` | `sinonimia/js/bootstrap-i18n.js:43` |
   | `teclatlon` | *TBD — migrando claves legacy en vuelo* | `teclatlon/app.js:30` (migración en curso) |

   *El propio Apptonomia no envía una PWA y no almacena datos de
   usuario, así que no tiene prefijo.*

   **Estado**: los prefijos marcados como *TBD* se descubrieron
   con un `grep` rápido el 2026-08-30 pero **no se verificaron
   archivo por archivo**. Antes de añadir una UI de reset a
   cualquiera de esos proyectos, quien mantiene debe confirmar el
   prefijo leyendo el `app.js` del proyecto y enumerando cada
   clave que escribe.

2. **Una forma de borrar todas las claves bajo ese prefijo**,
   accesible por la persona de apoyo (no por la persona usuaria
   final). Dos formas aceptables:
   - Una ruta oculta dedicada `settings/` (Routime, Calculia).
   - Un botón "Borrar mis datos" en el menú principal, con
     confirmación en dos pasos (mismo patrón que
     [`routime/tools/piano-keys/`](../../../routime/tools/piano-keys/)'s
     "Delete my progress"). Aceptable para hermanos cuyo catálogo
     es pequeño (1–5 actividades) y donde una ruta dedicada sería
     una cáscara casi vacía.

3. **No `localStorage.clear()`.** Siempre acota el borrado al
   prefijo propio del proyecto, para que un navegador compartido
   que aloje varios hermanos no se borre entre apps.

4. **Paridad i18n.** Cualquier cadena que vea la persona de apoyo
   vive en `strings.es.js` + `strings.en.js` (sin literales en
   `app.js` / `index.html`). La forma de ruta oculta usa
   `data-i18n` exactamente igual que el resto de la app; la forma
   de botón en menú usa `App.i18n.t('key')`.

5. **Contrato de caché.** Si las cadenas o el botón nuevos viven
   en un archivo listado en `sw.js` `ARCHIVOS`, bumpea `VERSION`
   en el `sw.js` del proyecto. Apptonomia no envía `sw.js` y está
   exento; sinonimia envía uno (cache-first) desde 2026-09-01.

6. **Nunca red.** Sin analítica, sin telemetría, sin copia remota.
   Exportación/importación local (archivo JSON vía `<a download>`)
   es aceptable cuando se justifica por el tamaño del catálogo;
   en otro caso, omítela.

### 5.3 Dónde aplicar este patrón

- Nuevo hermano: copia la tabla de la convención, elige un prefijo,
  añade una ruta oculta `settings/` o un botón en el menú
  principal, y referencia esta sección.
- Hermano existente sin ruta de reset: abre un PR por proyecto que
  lea el `CLAUDE.md` del hermano, siga sus reglas, y aterrice la UI
  mínima viable de borrado. **No** lo empaquetes con trabajo no
  relacionado.

---

## 6. Tipografía del portal

El portal usa las mismas dos tipografías auto-alojadas que el resto
de la suite — **Atkinson Hyperlegible** (pesos 400 y 700) y
**Nunito** (variable, 400–900) — empaquetadas como `.woff2` bajo
`assets/fonts/` y expuestas a través de la propiedad personalizada
`--font` en `css/styles.css`. Sin CDN, sin `@import` desde
`fonts.googleapis.com`.

Apptonomia no envía `sw.js`, así que no hay `VERSION` que bumpear
cuando cambian estos archivos; la caché inmutable de Cloudflare
(`_headers`) es lo que controla la frescura de los assets del
portal.

### 6.1 Detalle de implementación

`css/styles.css` declara la propiedad personalizada `--font`
apuntando a los `.woff2` locales; cada selector que quiera la
tipografía del cuerpo usa `font-family: var(--font)`. Las dos
fuentes se empaquetan una sola vez bajo `assets/fonts/` y nunca
se referencian desde un CDN.

### 6.2 Añadir una nueva fuente

No lo hagas, salvo que tengas un motivo concreto. El par se eligió
por legibilidad (Atkinson Hyperlegible está diseñada para baja
visión) y personalidad (Nunito para encabezados). Añadir una
tercera fuente para una tarjeta específica del portal es una
puerta de un solo sentido que se acumula en toda la suite — cada
hermano termina adoptando el mismo conjunto, y el presupuesto
total de `.woff2` empieza a importar.

---

### 6.3 Cabeceras principales compactas

Memofun es la referencia visual para las cabeceras de Calculia, Routime,
Okeymoney, Teclatlon, Ludia y el portal Apptonomia. Se usa un icono de 44px,
título Nunito de 28px, margen interior vertical de 8px y separación de 6px
entre filas. Por debajo de 650px, el icono mide 32px y el título 22px.
El texto secundario tiene peso normal y los controles se alinean con una
altura mínima de 44px. Los botones de idioma muestran nombres completos en
escritorio y ES/EN en móvil, con nombres accesibles completos. Cada app
conserva su navegación y ajustes. El portal muestra su nombre una sola vez,
con el texto de presentación debajo. Sinonimia conserva su cabecera.
Cada app mantiene sus estilos y versión de caché sin importar archivos de
otra aplicación durante la ejecución.

## 7. GEO, AEO y LLMO (presencia en buscadores, answer engines y LLMs)

SEO clásico (títulos, descripciones, Open Graph, Twitter Card,
hreflang, JSON-LD `SoftwareApplication` / `BreadcrumbList`, sitemap,
robots.txt) está cubierto por **`app.config.json` +
`scripts/build-head.js`** en cada hermano y por
[`../../scripts/sync-graphify-skill.js`](../../scripts/sync-graphify-skill.js)
en el metaproyecto. Este apartado recoge las tres capas adicionales
que el equipo del portal ha decidido adoptar para el metaproyecto y
los seis hermanos — **GEO** (Generative Engine Optimization), **AEO**
(Answer Engine Optimization) y **LLMO** (Large Language Model
Optimization) — y la fuente canónica de cada una.

> **Estado (2026-09-05)**: vacíos auditados antes de añadir las
> tres capas. Los siete proyectos tenían SEO básico bien factorizado
> y **ningún** `<meta name="geo.*">`, **`FAQPage`/`QAPage`/`SpeakableSpecification`
> JSON-LD**, feed RSS/Atom ni `/llms.txt` ni directivas AI-crawler
> en `robots.txt`. Este §7 documenta el patrón que se aplicará a
> partir de ahora para cerrar esos huecos.

### 7.1 GEO — solo semántico (Dublin Core)

La suite es global y multilingüe (es/en hoy; abierta a más
locales), así que atar `geo.region` / `geo.placename` a un país
concreto contradice el alcance. La capa GEO que se adopta es **GEO
semántico / Dublin Core** — geografía-agnóstica, entendible por
crawlers modernos y enfocada en describir el recurso, no en
fijar una coordenada:

- **`DC.title`** = el `<title>` del proyecto.
- **`DC.creator`** = el nombre del proyecto (Routime, Calculia…).
  Para el portal Apptonomia, `DC.creator = "Apptonomia"`.
- **`DC.subject`** = una a tres frases que describen el dominio del
  proyecto, sin mencionar el público clínico (regla §3). Las
  mismas frases que `meta.description`.
- **`DC.description`** = la descripción extendida que ya vive en
  `app.config.json`.
- **`DC.language`** = `es` o `en` según la variante actual; el HTML
  expone `x-default` para la convención hreflang.
- **`DC.type`** = `InteractiveResource` (recurso interactivo) o
  `Collection` para el portal (que agrega a los seis hermanos).
- **`DC.rights`** = una nota corta sobre la licencia del contenido
  (p. ej. "MIT — contenido CC BY 4.0, ver LICENSE").

Se renderizan como `<meta name="DC.*">` en el bloque que
`scripts/build-head.js` inserta entre los marcadores
`<!-- build:head:start -->` y `<!-- build:head:end -->`. Los campos
viven en `app.config.json` con nombres `dc*` (`dcCreator`,
`dcSubject`, `dcRights`, …).

### 7.2 AEO — solo `FAQPage` JSON-LD (sin render visible)

La capa AEO que se adopta es **`FAQPage` JSON-LD, sin bloque
visible de "Preguntas frecuentes" en la landing**, por dos razones
que la política general de la suite ya recoge:

- **Regla §3** prohíbe exponer lenguaje clínico en superficies
  públicas, y la forma natural de un FAQ visible ("¿Para quién es
  esta app?") fuerza ese terreno. Un FAQ como JSON-LD puede
  declararse **solo en machine-readable form** sin publicar el
  texto en pantalla, y aun así aparecer como rich result en
  buscadores que lo soporten.
- **Regla §3** también prohíbe duplicar copy entre la landing y
  `doc/` (riesgo de drift entre la cara pública y la
  documentación). Mantener el FAQ solo como JSON-LD evita que dos
  superficies tengan que mantenerse en paralelo.

Cada proyecto declara 3–5 pares `{question, answer}` en
`app.config.json > faq[]` redactados literalmente a partir del
`meta.description` (sin lenguaje clínico), y `scripts/build-head.js`
los inyecta en el bloque JSON-LD preexistente, como un nodo
adicional `@type: FAQPage` en el `@graph` (no reemplaza el nodo
`SoftwareApplication` ni el `BreadcrumbList` ya existentes). Si
un día hay que mostrar una FAQ visible, eso se discute caso por
caso y se documenta en este mismo §7.

**No** se adopta `QAPage` (no tenemos hilos de preguntas reales) ni
`SpeakableSpecification` (los TTS del sitio están pensados para que
la persona usuaria escuche su propia entrada, no para
read-aloud-asistido). **No** se añaden feeds RSS/Atom/JSON-Feed
todavía: la suite es un sitio estático sin flujo de cambios y un
feed vacío sería superficie muerta.

### 7.3 LLMO — `/llms.txt` y permitir AI crawlers

La capa LLMO cubre dos cosas:

1. **`/llms.txt`** en cada proyecto, siguiendo el formato
   propuesto por [`llmstxt.org`](https://llmstxt.org) (Markdown
   corto en la raíz, complementado por `/llms-full.txt` opcional
   con el detalle). El portal y cada hermano exponen:

   ```markdown
   # <Nombre del proyecto>

   > Resumen de una frase (derivado de `meta.description`).

   ## Qué es
   - 2-4 viñetas cortas, sin lenguaje clínico (§3).

   ## Qué NO es
   - Lista de 2-4 viñetas sobre exclusiones explícitas (sin
     backend, sin cuentas, sin telemetría, …) que ayudan a un
     modelo a no equivocarse al resumir.

   ## Recursos
   - [Calculia](https://calculia.apptonomia.uk/) — frase corta.
   - ...

   ## Licencia
   MIT — código. CC BY 4.0 — contenido (entradas de diccionario,
   barajas, etc., donde aplique).
   ```

   El `<head>` declara `<link rel="alternate" type="text/markdown"
   href="/llms.txt">` para que los crawlers lo descubran sin
   ambigüedad. `scripts/build-llms-txt.js` lo genera a partir de
   `app.config.json > llms*`.

2. **`robots.txt` permite los crawlers de IA conocidos**, no los
   bloquea. Una suite educativa, gratuita, sin registro, sin
   telemetría y de acceso abierto solo se beneficia si los modelos
   que la citan pueden resumirla correctamente. Por defecto se
   acepta este conjunto (alineado con `User-agent: *` ya existente
   en los hermanos que tienen `robots.txt`):

   ```text
   User-agent: GPTBot
   Allow: /

   User-agent: ClaudeBot
   Allow: /

   User-agent: Claude-Web
   Allow: /

   User-agent: anthropic-ai
   Allow: /

   User-agent: cohere-ai
   Allow: /

   User-agent: PerplexityBot
   Allow: /

   User-agent: CCBot
   Allow: /

   User-agent: Google-Extended
   Allow: /

   User-agent: Applebot-Extended
   Allow: /

   Sitemap: https://<domain>/sitemap.xml
   ```

   Si en el futuro hay motivos para bloquear un crawler concreto
   (p. ej. porque alguien descubre que ignora `nofollow` o no
   respeta licencias), se añade un bloque `User-agent: <X> /
   Disallow: /` específico, no se cambia el `User-agent: * /
   Allow: /` global. Esta decisión se documenta aquí.

### 7.4 Quién implementa qué y dónde

| Capa | Quién lo emite | Dónde vive | Quién lo verifica |
|---|---|---|---|
| SEO clásico | `scripts/build-head.js` a partir de `app.config.json` | `index.html` / `site/index.html` | `scripts/check.js` + navegador |
| GEO (Dublin Core) | `scripts/build-head.js` a partir de `app.config.json` | `index.html` | `scripts/check.js` (comprueba que los 7 `<meta name="DC.*">` existen) |
| AEO (`FAQPage`) | `scripts/build-head.js` a partir de `app.config.json` | bloque JSON-LD en `index.html` | `scripts/check.js` (valida @type FAQPage + count de Q/A ≥ 3) |
| LLMO (`/llms.txt`) | `scripts/build-llms-txt.js` a partir de `app.config.json` | `llms.txt` en la raíz | `scripts/check.js` (existencia + parseo + nº de secciones) |
| LLMO (AI crawlers) | `scripts/build-robots.js` (o sustitución) | `robots.txt` en la raíz | `scripts/check.js` (lista de UAs presentes, no exhaustiva) |

`scripts/check.js` se ampliará en cada hermano para aplicar los
nuevos gates (filas 11–14 de la auto-verificación §10). El
metaproyecto expone `apptonomia/scripts/check.js` con los mismos
cuatro gates adaptados al portal.

---

## 8. Contrato de caché del service worker

Cada hermano que envía una PWA expone `sw.js` con una cadena
`VERSION` (p. ej. `routime-v3`, `calculia-v22`, `teclatlon-v30`,
`sinonimia-v1`, …). Un cambio en cualquier archivo listado en el
`ARCHIVOS` / `FILES` de ese hermano requiere bumpear `VERSION` en
ese mismo hermano.

### 7.1 Por qué importa el bump

El handler `install` del service worker compara su `VERSION` con
el nombre de la caché activa y solo re-fetch + activa cuando
difieren. Un bump que no aterriza es silencioso: las personas
usuarias finales siguen viendo los archivos antiguos en caché hasta
que el SW se desregistra.

- **SWs cache-first** (Calculia, Memofun, Okeymoney, Routime,
  Sinonimia): el bump importa **tanto online como offline** (su
  `fetch` devuelve la respuesta en caché antes de intentar la
  red).
- **SWs network-first** (Teclatlon): el bump solo afecta offline,
  pero mantenemos la misma regla en todos los hermanos para
  homogeneizar la directiva y evitar razonamiento caso por caso en
  CI.

El coste de bumpear es un entero; el coste de no bumpear es "la
persona usuaria piensa que el arreglo no llegó". Bumpea con
generosidad, no con保守. Ver el `CLOUDFLARE.md` de cada hermano
para el contrato de despliegue por app.

### 7.2 La regla, en una línea

> Cualquier commit que toque un archivo listado en `ARCHIVOS` /
> `FILES` del `sw.js` del hermano DEBE bumpear `VERSION` en el
> mismo commit.

`scripts/check-version-bump.js` lo aplica en CI haciendo diff
contra el commit anterior y fallando cuando un archivo en caché
cambió pero `VERSION` no.

---

## 8. Anatomía de archivos obligatoria por hermano

Cada hermano (Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon,
Routime) envía el mismo conjunto base de archivos. Los hermanos
nuevos deben seguir la misma anatomía, y los existentes pueden
crecer encima pero no desviarse. Ver [`crear-app.md`](crear-app.md)
para la receta completa de creación y [`templates/`](../templates/)
para andamios de archivo para copiar y pegar.

| Archivo / carpeta | ¿Obligatorio? | Propósito |
|---|---|---|
| `CLAUDE.md` | sí | Manual operativo para agentes IA + tabla de fuentes canónicas. |
| `README.md` + `README.es.md` | sí | Introducción pública (es + en), badges, arranque rápido. |
| `LICENSE` | sí | MIT. |
| `CONTRIBUTING.md` + `CONTRIBUTING.es.md` | sí | Flujo de contribución (es + en). |
| `CODE_OF_CONDUCT.md` + `CODE_OF_CONDUCT.es.md` | sí | Pacto del colaborador (es + en). |
| `SECURITY.md` + `SECURITY.es.md` | sí | Cómo reportar una vulnerabilidad de forma privada. |
| `CLOUDFLARE.md` | sí | Runbook canónico de despliegue (Cloudflare Workers + static assets). |
| `_headers`, `wrangler.toml`, `404.html` | sí | Configuración del host Cloudflare static-asset. |
| `manifest.json` (PWA) | sí (si PWA) | Metadata de instalación PWA. |
| `sw.js` (PWA) | sí (si PWA) | Service worker con `VERSION` + `ARCHIVOS`. |
| `index.html` | sí | La app misma (o un portal que enlace a `tools/`). |
| `app.js` (o `tools/<slug>/app.js`) | sí | Código de aplicación (identificadores en inglés, núcleo `App.*`). |
| `strings.es.js` + `strings.en.js` | sí | Copy de UI (paridad es/en aplicada). |
| `assets/js/{utils,i18n,tts,storage,feedback}.js` | sí (si reusa núcleo compartido) | Núcleo compartido. Recortable por proyecto. |
| `assets/css/styles.css` (o `css/styles.css`) | sí | Tokens de diseño + componentes. |
| `assets/fonts/*.woff2` | sí | Atkinson Hyperlegible + Nunito, auto-alojadas. |
| `scripts/check.js` | sí | Lint estructural Node plano + check de paridad i18n. |
| `scripts/check-version-bump.js` | sí (si PWA) | Gate CI para el bump de caché del `sw.js`. |
| `doc/<lang>/{index,spec,roles,team,i18n,technical,quick-guide,readme}.md` | sí | Docs bilingües. |
| `doc/<lang>/activities.md` | sí (si catálogo > 1) | Catálogo de actividades. |
| `doc/<lang>/creating-elements-guide.md` | sí (si catálogo > 1) | Recetas didácticas + gamificación + neuromarketing para el público. |
| `.claude/skills/graphify/` | sí | Fuente del knowledge graph por proyecto (sincronizada desde `~/.claude/skills/graphify/`). |
| `.graphifyignore` | sí | Exclusiones por proyecto para el skill graphify. |
| `graphify-out/` | sí (regenerado) | Artefacto de build (gitignored). |
| `settings/` | recomendado (PWA) | Ruta oculta de reset, ver §5. |
| `_redirects` | opcional | Redirecciones estáticas o dinámicas (límite por archivo de Cloudflare: 2 100). |

---

## 10. Auto-verificación de cumplimiento antes de abrir un PR

Abre el PR solo después de que cada fila de esta lista pase. Cada
fila apunta al doc que explica la regla.

| # | Auto-check | Dónde mirar |
|---|---|---|
| 1 | No he añadido ningún término clínico (p. ej. "discapacidad intelectual") a una superficie pública (README, portal, charlas, copy de redes). | §3 arriba |
| 2 | No he añadido el término "usuario/a tipo" a la UI de usuario de ninguna app. | §3 arriba + cada `spec.md` §4 |
| 3 | Cada cadena de UI que he tocado existe en **ambos** `strings.es.js` y `strings.en.js`. | cada `spec.md` + `scripts/check.js` (gate de paridad es/en) |
| 4 | Mi copy de UI sigue UNE 153101 (frases cortas, una idea por pantalla, vocabulario cotidiano). | §1 arriba + cada `spec.md` §3 |
| 5 | No he añadido ninguna llamada a runtime de terceros (`fetch` a una API externa, Google Fonts, beacon de analítica). | §4 arriba |
| 6 | Si he cambiado un archivo listado en `ARCHIVOS` del `sw.js` del hermano, he bumpeado `VERSION` en el mismo commit. | §8 arriba + `scripts/check-version-bump.js` |
| 7 | No he empaquetado ninguna llamada a `localStorage.clear()`; cualquier borrado que haya añadido está acotado al prefijo propio del hermano. | §5 arriba |
| 8 | He ejecutado `node scripts/check.js` del hermano y ha pasado. | §9 arriba |
| 9 | No he editado otro hermano desde este PR. | metaproyecto `CLAUDE.md` §A.2.2 |
| 10 | No he ejecutado ningún despliegue. | metaproyecto `CLAUDE.md` §A.3 |
| 11 | He añadido (o no toqué) los seis `<meta name="DC.*">` en el `<head>` del proyecto, a partir de `app.config.json`. | §7.1 arriba |
| 12 | He añadido (o no toqué) el nodo `FAQPage` en el JSON-LD, con 3–5 pares `{question, answer}` redactados sin lenguaje clínico (§3). | §7.2 arriba |
| 13 | He generado (o no toqué) `/llms.txt` en la raíz del proyecto a partir de `app.config.json` y `/llms.txt` se enlaza con `<link rel="alternate" type="text/markdown">`. | §7.3 arriba |
| 14 | El `robots.txt` del proyecto (si existe o lo he añadido) permite los crawlers de IA documentados en §7.3 sin bloquearlos. | §7.3 arriba |

---

## Ver también

- [`crear-app.md`](crear-app.md) — receta completa para añadir una
  nueva app a la suite, incluidas las plantillas de archivos bajo
  [`templates/`](../templates/).
- [`tecnico.md`](tecnico.md) — cómo funciona el plumbing del
  metaproyecto (`scripts/sync-graphify-skill.js`,
  `scripts/check.js`, el meta-grafo).
- [`i18n.md`](i18n.md) — cómo añadir un nuevo idioma al portal
  Apptonomia (es/en son los únicos locales enviados hoy).
- [`guia-rapida.md`](guia-rapida.md) — paso a paso para una nueva
  persona colaboradora que acaba de clonar el metaproyecto.
- El metaproyecto [`../../CLAUDE.md`](../../CLAUDE.md) §B — las
  políticas de toda la suite que esta guía refleja en forma
  narrativa.
