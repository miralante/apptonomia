# Flujo de navegación (estándar de la suite)

La suite tiene un único árbol de navegación, igual en todas las apps. La pantalla de
logros es un estado de la página de una actividad, y devuelve a la persona al
comienzo de esa actividad. Nunca la lleva por sí sola a otra actividad.

> 🌐 **Otro idioma:** [inglés](../en/navigation-flow.md)

## El árbol

```
Portada        index.html de la app: todo el catálogo
└── Hub        página que lista las actividades de un grupo o sección
    └── Actividad      su punto de entrada: la página tal como se abre, con su primera pantalla
        └── Logro      estado de la misma página, dentro de <main>
                       «A por más» → vuelve al punto de entrada de la actividad
```

- **Portada** es lo más alto de la app.
- **Hub** es el nivel superior de una actividad. El enlace de volver de la cabecera
  (`.back-link`) lleva allí. La suite ya exige ese enlace en toda página por debajo
  de la portada (ver `doc/es/bloques-compartidos.md`, suite-chrome): siempre sube un
  nivel, nunca vuelve por el historial del navegador.
- **Actividad** tiene sus etapas (explicación, vida real, prueba) dentro de la página.
  Las etapas se mueven con los botones de la propia página.

## Las reglas

1. **El punto de entrada de una actividad es la página tal como se abre.** Su primera
   pantalla es donde empieza la actividad, y a donde vuelve la persona tras un logro.
2. **El logro se muestra en la propia página.** Ocupa el lugar del contenido de la
   actividad dentro de `<main>`. La cabecera y el enlace de volver siguen visibles. No
   es una capa sobre la página.
3. **«A por más» vuelve al punto de entrada de la actividad.** Recarga la página
   (`App.navigation.entry()`), que muestra la primera pantalla y conserva el progreso
   guardado. Una actividad puede pasar su propia acción si algo debe ocurrir dentro de
   la página: las pruebas de calculia vuelven a su primera diapositiva de explicación
   (`reviewIntro`), por ejemplo.
4. **El logro nunca lleva a la persona a otra actividad.** Ir a una actividad distinta
   es una elección de la persona desde el hub, con el enlace de volver. Un enlace que
   declare la actividad siguiente (`rel="next"`) no lo usa el logro, y ninguna página
   lo declara.
5. **Una estrella de frase u otra recompensa que no termina una actividad** pasa una
   acción vacía, para que la persona se quede donde está.

## Cómo funciona en el código

El bloque del logro vive en `apptonomia/scripts/suite/celebrate.js` y `celebrate.css`,
y `scripts/sync-answer-round.js` lo copia en el `assets/js/feedback.js` y la hoja
compartida de cada app:

- `celebrate(message, after, goal)` pone la recompensa en `<main>` (`#app-celebration`),
  marca `<main>` con `.is-celebrating` y oculta el resto del contenido mientras se
  muestra.
- «A por más» oculta de nuevo la recompensa y luego llama a `after`, o a
  `App.navigation.entry()` si no hay `after`.

## Comprobaciones

- Una página con logro tiene un `<main>`, así que la recompensa tiene dónde mostrarse.
- Toda página por debajo de la portada tiene enlace de volver en su cabecera, para que
  la persona pueda subir al hub.

## Relacionado

- [`bloques-compartidos.md`](bloques-compartidos.md): los bloques compartidos y cómo se
  copian.
- `apptonomia/scripts/suite/celebrate.js`: la fuente canónica del logro y del punto de
  entrada.
