# Banco de palabras — Diccionario

Base de datos de contenido con palabras complejas en español (`es.json`) e
inglés (`en.json`), cada una con un significado en Lectura Fácil y un ejemplo
de vida real. Pensado como fuente para actividades que enseñan el
significado de palabras difíciles (como `tools/dictionary`).

## Estado

Este banco es **contenido independiente, no conectado a ningún `app.js`
todavía**. La actividad `tools/dictionary` ya funciona hoy con su propio
`data.js` (24 palabras: 3 niveles × 8). Este archivo es una base más amplia
(100 palabras por idioma, en 4 categorías/niveles de dificultad) para ampliar
esa actividad u otras futuras, respetando la arquitectura de §2.3 de
`tecnico.md` (cada actividad es autónoma y no importa de otras carpetas): si
se usa en una actividad, hay que copiar el subconjunto elegido dentro de su
propio `tools/<slug>/data.js`, no referenciar este archivo desde `tools/`.

## Origen del contenido

Las palabras se seleccionaron a partir de listas reales de vocabulario
avanzado C1/C2: para español, recursos DELE y ELE (ProfedeELE, Hablamos en
Español); para inglés, listas CEFR C1/C2 (esl-lounge, Espresso English,
Cambridge word lists). Las definiciones y ejemplos son **redacción propia en
Lectura Fácil**, no copias de esas fuentes ni traducción literal entre
idiomas (cada idioma tiene su propio vocabulario y dificultad — ver
`doc/es/I18N.md` §3 / `doc/en/I18N.md` §3).

## Formato

```json
{
  "meta": { ... },
  "words": [
    { "word": "asequible", "definition": "...", "example": "...", "category": "...", "tier": 1 }
  ]
}
```

- `word`: la palabra.
- `definition`: significado en Lectura Fácil (frase corta, una idea).
- `example`: frase de ejemplo con un contexto real de vida adulta.
- `category`: tema (día a día, personalidad y emociones, trabajo y sociedad,
  ciencia/ideas y mundo).
- `tier`: nivel de dificultad orientativo, 1 (más fácil) a 4 (más difícil).

## Siguiente paso si se quiere usar

Para ampliar la actividad `tools/dictionary`, seguir la receta de §9 de
`tecnico.md`: copiar los grupos de 8 palabras elegidos al `DATA.es` / `DATA.en`
de `tools/dictionary/data.js` (añadiendo niveles `level4`, `level5`...),
manteniendo el mismo `id` en ambos idiomas, y verificar con
`node scripts/check.js`.
