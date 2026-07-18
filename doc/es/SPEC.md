# SPEC.md — Definición del producto

> **Este documento define QUÉ es Apptonomia, PARA QUIÉN es y por qué.**
>
> Para saber CÓMO está construida la aplicación (arquitectura, APIs, recetas),
> consulta [`tecnico.md`](tecnico.md).

---

## 1. Producto

Apptonomia es una **aplicación web de actividades de terapia ocupacional** para
personas con discapacidad intelectual. Está pensada para que la persona usuaria
pueda practicar habilidades de la vida diaria de forma **autónoma**, sin necesidad
de que un profesional esté presente en cada momento.

### 1.1 Qué es y qué no es

**Es:**
- Una herramienta de práctica autónoma y refuerzo entre sesiones
- Un complemento a la intervención profesional (familia, terapeuta, profesor)
- Una aplicación usable sin conocimientos técnicos
- Una PWA instalable en el dispositivo de la persona usuaria

**No es:**
- Un sustituto del profesional de terapia ocupacional
- Una herramienta de evaluación clínica estandarizada
- Un registro de datos personales (no guarda información personal identificable)
- Una red social ni un sistema con conexión a internet obligatoria

### 1.2 Público objetivo

**Usuario final (persona con discapacidad intelectual):**
- Practica las actividades de forma autónoma o con apoyo puntual
- Necesita una interfaz accesible, clara y sin presión

**Familias:**
- Encuentran una herramienta para trabajar en casa
- Acompañan y supervisan el uso diario
- Observan progreso a través de las estrellas ⭐

**Terapeutas ocupacionales y profesores:**
- Seleccionan actividades que se ajustan a objetivos terapéuticos concretos
- Usan la aplicación como complemento entre sesiones
- Pueden ver la guía de uso en `team/`

---

## 2. Objetivos del producto

### 2.1 Objetivos terapéuticos

Apptonomia trabaja **6 áreas terapéuticas** (módulos):

| Módulo | Área | Objetivo principal |
|--------|------|-------------------|
| 🎯 Puntería y manos | Coordinación y motricidad | Movimientos precisos con manos y dedos, coordinación ojo-mano |
| 📋 Mi día a día | Autonomía y hogar | Habilidades para la vida diaria independiente |
| 🧠 Memoria y atención | Memoria y atención | Memoria visual y auditiva, atención y concentración |
| 🔢 Pensar y contar | Razonamiento y matemáticas | Lógica, matemáticas y estrategias |
| 💬 Lenguaje y palabras | Lenguaje y comunicación | Vocabulario, comprensión, expresión |
| 💜 Emociones | Emociones y relaciones | Reconocimiento y regulación emocional, habilidades sociales |

El catálogo completo, área por área y actividad por actividad, está en
[`actividades.md`](actividades.md). El propósito terapéutico específico de cada
actividad está en `team/index.html`.

### 2.2 Objetivos de UX

- **Autonomía real**: que la persona usuaria pueda usar la app sin necesitar a otra persona a su lado
- **Accesibilidad universal**: usable por personas con distintas capacidades (lectura fácil, botones grandes, alto contraste, audio)
- **Sin presión**: nada de cronómetros visibles, ni notas negativas, ni "game over"
- **Refuerzo positivo continuo**: celebrar los intentos, no solo los aciertos
- **Bajo riesgo emocional**: nunca se muestra error explícito ni se resta puntuación

---

## 3. Restricciones innegociables (de producto)

Estas restricciones vienen del **producto**, no son técnicas. Son las "leyes"
que nunca se rompen, porque definen qué tipo de experiencia ofrecemos.

### 3.1 El error nunca castiga

- No se restan estrellas ni progreso por fallar
- El fallo produce un mensaje de **ánimo** (`animar()`), nunca un "incorrecto"
- Se puede reintentar sin límite
- Se usan pistas (método socrático) antes de mostrar la respuesta

### 3.2 Sin presión temporal

- **No hay cronómetros visibles** en la interfaz
- No se mide el tiempo que tarda la persona (internamente puede, pero no se enseña)
- El ritmo lo marca la persona usuaria

### 3.3 Lectura Fácil siempre

- Frases cortas, una idea por frase
- Vocabulario cotidiano (sin tecnicismos)
- Sin lenguaje clínico en la interfaz ("paciente", "terapia", "discapacidad")
- El lenguaje clínico solo se permite en `team/` y en la documentación del repo

### 3.4 Privacidad por defecto

- **Sin registro**: no se pide correo, nombre real ni contraseña
- **Sin cookies ni analítica**: nada de rastreo
- **Sin datos personales**: el progreso se guarda en el dispositivo (`localStorage`)
- La aplicación funciona sin conexión a internet
- **Contrato de progreso local**: el almacenamiento en `localStorage` se limita a
  `estrellas` (número entero) y a `completado` (qué niveles se han terminado),
  más los pocos datos opcionales que la actividad pida explícitamente (por
  ejemplo, el nombre escrito en Teclado o en Piano, que la persona usuaria borra
  cuando quiera). **Nunca** se guardan: fallos, tiempo tardado, número de
  intentos, comparativas con otras personas, historiales detallados de uso ni
  perfiles identificables. El progreso nunca sale del dispositivo; la copia
  local es responsabilidad de quien gestiona el dispositivo (ver `/settings/`).
  El progreso no se sincroniza en la nube ni se cruza entre dispositivos.

### 3.5 Accesibilidad universal

- Botones ≥ 64×64 px, separación ≥ 16 px
- Contraste WCAG AA mínimo
- Audio disponible en todo texto importante (botón 🔊)
- Navegación completa por teclado
- Respeta `prefers-reduced-motion`
- Máximo 4–6 opciones por pantalla
- Compatible con lectores de pantalla (ARIA)

---

## 4. Principios de diseño

Estos principios **mandan sobre cualquier otra decisión**. Si una tarea entra en
conflicto con ellos, ganan los principios. Son la brújula del producto.

1. **Lectura Fácil**: frases cortas, una idea por frase, vocabulario cotidiano, sin metáforas.
2. **Una acción por pantalla**: la persona usuaria nunca debe decidir entre más de 4–6 opciones visibles a la vez.
3. **Objetos táctiles grandes**: botones mínimo **64×64 px**, separación mínima 16 px.
4. **Tipografía grande**: base 20 px, títulos 28–36 px, fuente legible (Atkinson Hyperlegible o Nunito).
5. **Tema claro por defecto** con alto contraste (WCAG AA mínimo, AAA cuando sea posible).
6. **Audio en todo**: cada texto importante tiene botón 🔊 (Web Speech API, es-ES / en-US, velocidad 0.9).
7. **Sin presión**: sin cronómetros visibles, sin puntuación negativa, sin "game over".
8. **Refuerzo positivo inmediato**: celebración visual + sonora al acertar (≤ 2 s).
9. **`prefers-reduced-motion`**: todas las animaciones se desactivan si el sistema lo pide.
10. **Autonomía**: funciona offline (PWA), sin login, sin coste, sin datos personales.

---

## 5. Criterios de éxito

Un cambio en Apptonomia se considera exitoso cuando:

1. **Mantiene la autonomía**: la persona usuaria puede seguir usando la app sin ayuda externa para esa actividad
2. **Es accesible**: cumple WCAG AA y los 13 reglas de `tecnico.md` §5
3. **No introduce presión**: no hay contadores ni castigos nuevos
4. **Funciona offline**: la app sigue siendo usable sin conexión
5. **Respeta la privacidad**: no se recoge ningún dato personal nuevo
6. **Mantiene la paridad ES/EN**: cualquier texto nuevo aparece en ambos idiomas
7. **No rompe actividades existentes**: las actividades existentes siguen funcionando igual

---

## 6. Lo que Apptonomia NO hace

Decisiones explícitas que pueden sorprender — están aquí para que no se
"sugieran" en el futuro:

| NO | Por qué |
|----|---------|
| No tiene cuenta de usuario | Privacidad y simplicidad |
| No guarda datos en la nube | Privacidad y offline-first |
| No tiene ranking ni comparativas | Sin presión, sin frustración |
| No usa notificaciones push | No introduce presión ni dependencias externas |
| No tiene compras integradas | Es y será gratis |
| No muestra publicidad | Financiación pública / sin ánimo de lucro |
| No recoge analítica | Privacidad |
| No tiene chatbot ni IA generativa | Determinismo, accesibilidad y predictibilidad |
| No usa redes sociales | Privacidad y foco |
| No trabaja motricidad gruesa ni coordinación postural | Requiere espacio físico y acompañamiento presencial |
| No ofrece trabajo en equipo en tiempo real | La aplicación es individual y no conecta a varias personas |
| No evalúa automáticamente la expresión oral | El reconocimiento de voz no ofrece fiabilidad suficiente para evaluar |

---

## 7. Cómo está organizado este documento

Este SPEC.md es la **definición del producto**: QUÉ, PARA QUIÉN y POR QUÉ.
El resto de la documentación cubre el CÓMO:

Para más informacion, consultar el mapa de toda la documentación | [`indice.md`](indice.md) |
