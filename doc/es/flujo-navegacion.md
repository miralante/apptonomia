# Flujo de navegación (estándar de la suite)

La suite tiene una sola forma de llevar a la persona de una actividad al siguiente
punto lógico, igual en todas las apps. La pantalla de logros la usa, así que cerrar
un logro nunca reinicia la actividad que lo ha dado.

> 🌐 **Otro idioma:** [inglés](../en/navigation-flow.md)

## El problema que resuelve

Antes de este estándar, el botón de cierre del logro («A por más») hacía lo que
cada actividad tuviera cableado. Varias actividades lo cableaban para volver a
empezar desde la primera diapositiva: al terminar aparecía el logro, y al cerrarlo
volvía a verse la primera diapositiva. Un bucle. Cada actividad decidía por su
cuenta qué viene después, y ninguna lo hacía igual.

## Los niveles

La persona avanza por tres niveles. Cada página está en uno de ellos.

| Nivel | Qué es | Ejemplo |
|---|---|---|
| Portada | La página de entrada de la app, con todo el catálogo | `index.html` de la app |
| Hub | Página que lista las actividades de un grupo o sección | `numbers-group/`, la lista de actividades de una ruta |
| Actividad | Una actividad. Sus etapas (explicación, vida real, prueba) están dentro de la página | `tools/los-numeros/` |

Entre niveles, una página tiene como mucho dos enlaces:

- **Arriba** es el nivel superior. Es el enlace de volver de la página
  (`.back-link`). La suite ya lo exige (ver `doc/es/bloques-compartidos.md`,
  suite-chrome): siempre sube un nivel, nunca vuelve por el historial del
  navegador.
- **Siguiente** es el siguiente punto lógico del flujo. Es opcional. Es la
  siguiente etapa de la misma actividad (cuando una etapa es una página propia) o
  la siguiente actividad de una secuencia. Se declara con un enlace estándar en la
  cabecera:

  ```html
  <link rel="next" href="../order-numbers/">
  ```

  Una página sin `rel="next"` no tiene punto siguiente; su flujo termina en su
  enlace de arriba.

## Las reglas

1. **Las etapas dentro de una página se mueven con los botones de la propia
   página.** Explicación, vida real y prueba se cambian con los controles de la
   actividad (flechas, «Siguiente», «Empezar»). La pantalla de logros no cambia de
   etapa.
2. **La pantalla de logros cierra una ronda o una prueba.** Su botón **«A por
   más»** retoma el flujo:
   - una página con `rel="next"` va al siguiente punto;
   - si no, al enlace de arriba (el hub al que pertenece la actividad);
   - si no hay enlace de arriba, la pantalla solo se cierra.
3. **Una acción explícita sustituye al flujo.** Cuando la propia actividad debe
   seguir dentro de la página (la siguiente pregunta, la siguiente ronda, un asistente
   que se cierra), pasa su acción a `celebrate`. Esa acción sustituye al flujo. Úsala
   solo para continuaciones dentro de la actividad.
4. **El logro nunca repite una ronda de la misma actividad.** Otra ronda de la misma
   prueba, lanzada desde el logro, es el bucle que este estándar elimina. Cuando una
   actividad de prueba no tiene punto siguiente, «A por más» vuelve al **punto de
   entrada** de la actividad: su primera diapositiva de explicación, donde la persona
   elige qué hacer. Esta es la elección para las actividades de prueba de calculia.
   Se implementa de dos formas: `reviewIntro` (`activity-flow-options.js`) vuelve a
   mostrar la primera diapositiva de explicación, y las actividades con ronda propia
   recargan su página (`window.location.reload()`, que muestra la primera pantalla de
   la página y conserva el progreso guardado). Es una acción explícita, no una
   repetición de la ronda.
5. **Quedarse en la página solo cuando el logro cerrado no termina una actividad.**
   Por ejemplo, una estrella de frase pasa una acción vacía para que la persona se
   quede donde está.

## Cómo funciona en el código

El objeto de navegación vive en el bloque compartido del logro
(`apptonomia/scripts/suite/celebrate.js`, que `scripts/sync-answer-round.js` copia
en `assets/js/feedback.js` de cada app). Se expone como `App.navigation`:

- `App.navigation.target()`: la URL a la que va el flujo desde esta página, o `null`.
- `App.navigation.resume()`: va a esa URL. Devuelve `false` cuando no hay destino, y
  entonces la pantalla de logros solo se cierra.

La pantalla de logros llama a `resume()` cuando su botón no tiene acción explícita.
No hace falta nada más en la app. No hay una tabla de rutas en el código: el flujo se
lee de la página, así que una página que gana o pierde un punto siguiente cambia su
flujo solo cambiando su marcado.

## Declarar el flujo de una página

| Punto del flujo | Marcado | Obligatorio |
|---|---|---|
| Arriba (el hub o el nivel superior) | `<a class="back-link" href="../">` en la cabecera | sí, en toda página por debajo de la portada |
| Siguiente (la siguiente etapa o actividad) | `<link rel="next" href="…">` en `<head>` | solo cuando el flujo tiene un punto siguiente |

La plantilla (`apptonomia/doc/templates/app-template/`) incluye los dos ejemplos.

## Comprobaciones

- Una página con pantalla de logros y sin enlace de arriba se cierra y se queda. Es
  válido, pero antes de publicar la página debe tener un enlace de arriba en su
  cabecera, para que el flujo pueda salir de la actividad.
- `rel="next"` debe apuntar a una página existente de la misma app.

## Dónde se aplica

Todas las apps de la suite llevan el bloque compartido, así que toda página que
muestra una pantalla de logros usa este flujo. Calculia, Routime, Memofun, Okeymoney,
Teclatlon y Sinonimia están cubiertas por el mismo bloque; también la plantilla de
app nueva.

## Relacionado

- [`bloques-compartidos.md`](bloques-compartidos.md): los bloques compartidos y cómo
  se copian.
- `apptonomia/scripts/suite/celebrate.js`: la fuente canónica del objeto de
  navegación y de la pantalla de logros.
