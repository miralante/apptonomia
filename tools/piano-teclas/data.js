/* ============================================================
   Datos: Piano (notas musicales, independientes del idioma).
   Formato:
   - DATA.melodiasSeguir = [{ id, secuencia: string[] }] — modo
     "Sigue la melodía". El nombre NO está aquí: es texto y vive en
     strings.js. app.js lo busca con MELODIA_KEYS[id] (ver app.js).
   - DATA.canciones = [{ id, dificultad: 'facil'|'media', secuencia }]
     — modo "Canciones". El nombre tampoco está aquí, mismo patrón
     con CANCION_KEYS (ver app.js). 'dificultad' se traduce con
     App.i18n.t('dificultad' + Facil/Media).
   Las notas son do-re-mi-... en notación anglosajona (C D E F G A B,
   sostenidos con #): son un dato musical, no cambian con el idioma.
   Para ampliar: añadir una melodía o canción nueva con un id, su
   secuencia, y su nombre en strings.js (es y en).
   ============================================================ */
const DATA = {
  melodiasSeguir: [
    { id: 'ascendente', secuencia: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'] },
    { id: 'descendente', secuencia: ['C', 'B', 'A', 'G', 'F', 'E', 'D', 'C'] },
    { id: 'doremi', secuencia: ['C', 'D', 'E', 'C', 'E', 'D', 'C'] },
    { id: 'arcoiris', secuencia: ['C', 'E', 'G', 'C', 'G', 'E', 'C'] },
    { id: 'ondina', secuencia: ['E', 'F', 'G', 'A', 'G', 'F', 'E', 'D', 'C'] }
  ],

  canciones: [
    {
      id: 'cumpleanos', dificultad: 'facil',
      secuencia: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F', 'C', 'C', 'C', 'A', 'F', 'E', 'D', 'B', 'B', 'A', 'F', 'G', 'F']
    },
    {
      id: 'estrellita', dificultad: 'facil',
      secuencia: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C']
    },
    {
      /* "Himno de la alegría" (Beethoven) / "Ode to Joy": antes había
         aquí una segunda entrada ("Twinkle") con la MISMA secuencia
         que "estrellita" — son la misma melodía en dos idiomas, no
         dos canciones distintas. Se sustituye por una canción real
         diferente para no repetir contenido. */
      id: 'himnoalegria', dificultad: 'media',
      secuencia: ['E', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C', 'C', 'D', 'E', 'D', 'C']
    },
    {
      id: 'verde', dificultad: 'media',
      secuencia: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'G', 'C', 'D', 'E', 'F', 'F', 'F', 'F', 'F', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'D', 'D', 'E', 'D', 'G']
    }
  ]
};
