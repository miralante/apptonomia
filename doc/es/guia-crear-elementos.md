# Guía pedagógica para crear elementos

> Guía canónica de Apptonomia para diseñar actividades, lecciones,
> ejercicios, barajas y otros elementos de aprendizaje en la suite
> Miralante. Cada app adapta estas reglas a su público y a su producto;
> sus documentos `SPEC.md` y `tecnico.md` concretan los requisitos propios.

## 1. Principios de diseño

Cada elemento debe tener un objetivo de aprendizaje claro y observable.
Diseña primero qué podrá hacer la persona al terminar; el formato,
la historia y las recompensas deben ayudar a practicar ese objetivo.

- **Parte de la persona y su contexto.** Usa situaciones, vocabulario y
  conocimientos familiares para el público de la app. No presupongas una
  edad, experiencia, capacidad o entorno que el producto no haya definido.
- **Hazlo concreto y significativo.** Siempre que encaje con el objetivo,
  sitúa la práctica en una tarea o situación reconocible y muestra para qué
  puede servir lo aprendido.
- **Avanza de forma gradual.** Empieza con pocos conceptos y apoyo visible;
  aumenta una dimensión de dificultad cada vez. Comprueba que cada paso
  prepara para el siguiente y ofrece práctica suficiente antes de avanzar.
- **Mantén la carga cognitiva adecuada.** Presenta una consigna breve,
  vocabulario directo y una idea principal por pantalla. Retira adornos,
  opciones y texto que compitan con la tarea.
- **Permite participar con autonomía.** Explica cómo empezar, qué hacer y
  cómo continuar. La actividad debe poder entenderse sin depender de una
  explicación externa, salvo que el diseño del producto indique lo contrario.

## 2. Accesibilidad y comprensión

La accesibilidad forma parte del diseño pedagógico. Sigue las reglas de
accesibilidad del proyecto y prueba el elemento con sus métodos de entrada,
lectura y presentación compatibles.

- Escribe consignas directas, en voz activa y con una acción cada vez.
- Evita dobles negaciones, metáforas confusas y expresiones ambiguas.
- No comuniques el acierto solo con color, sonido o animación; acompáñalo
  con una señal perceptible y comprensible.
- Respeta las preferencias de audio, movimiento, contraste y tamaño de
  texto que exponga la app.
- Ofrece tiempo suficiente y evita penalizar errores, pausas o ritmos
  distintos, según las reglas del producto.

## 3. Pistas, error y refuerzo

El error debe ayudar a pensar y a volver a intentarlo con seguridad.
Usa una secuencia de apoyo que conserve la oportunidad de resolver:

1. **Reorienta:** una pregunta o pista pequeña que ayude a revisar la idea.
2. **Concreta:** una pista más explícita, ejemplo o parte del procedimiento.
3. **Aclara:** muestra la respuesta o solución con una explicación breve.

Ajusta esta secuencia al tipo de actividad. No reveles la solución antes de
que la persona haya podido usar el apoyo, y evita mensajes que avergüencen,
culpen o comparen. Después del acierto, explica qué estuvo bien y deja claro
cuál es el siguiente paso.

## 4. Gamificación y persuasión responsables

Usa el juego para sostener la práctica y hacer visible el progreso, no para
presionar. Las recompensas deben corresponder a una acción o logro que la
persona pueda comprender. El progreso debe ser legible, predecible y estar
bajo el control de la persona.

No uses falsa urgencia, escasez artificial, rachas que castiguen una pausa,
comparación social como presión, pérdida de progreso para forzar el regreso
ni patrones engañosos. La motivación debe venir de aprender, dominar pasos,
explorar y recibir reconocimiento amable.

El sonido, la animación, el color y el microtexto pueden ayudar a mantener
la atención y señalar consecuencias. Mantén esos recursos breves, coherentes
con la tarea, opcionales cuando corresponda y compatibles con las
preferencias de accesibilidad.

## 5. Revisión antes de publicar

- [ ] El objetivo de aprendizaje se expresa en una frase y se puede observar.
- [ ] El contenido encaja con el público, alcance y vocabulario de la app.
- [ ] La dificultad avanza paso a paso y cada nivel prepara para el siguiente.
- [ ] Las consignas y respuestas se entienden sin explicación adicional.
- [ ] Las pistas ayudan a razonar antes de mostrar la solución.
- [ ] El feedback es específico, respetuoso y permite continuar.
- [ ] Las señales importantes no dependen de un solo sentido.
- [ ] El juego refuerza la práctica sin presionar ni penalizar pausas.
- [ ] Se ha probado el flujo completo con las preferencias de accesibilidad
      compatibles con la actividad.
- [ ] Las reglas específicas de `SPEC.md` y `tecnico.md` están satisfechas.

## Ver también

- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md): lectura fácil,
  accesibilidad y requisitos transversales de la suite.
- [`crear-app.md`](crear-app.md): receta para crear un hermano de la suite.
- Guía técnica y de producto de cada app: concreta sus requisitos y
  prevalece cuando define una regla más específica.
