/* Apptonomia — textos del portal (ES).
   Locale-specific file. Loaded unconditionally from index.html;
   script.js picks the active one from App.i18n.
   Las claves son código: misma forma que en strings.en.js (paridad 1:1). */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    core: {
      skipToContent: 'Ir al contenido'
    },
    meta: {
      description: 'Portal a la suite Apptonomia: Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon y Routime.'
    },
    home: {
      title: 'Apptonomia',
      tagline: '¿Qué vas a hacer ahora?'
    },
    tags: {
      math: 'Matemáticas',
      study: 'Estudio',
      life: 'Vida diaria',
      words: 'Palabras',
      keyboard: 'Teclado',
      activities: 'Actividades'
    },
    projects: {
      calculia: 'Cálculo y razonamiento lógico con actividades cortas y visuales.',
      memofun: 'Tarjetas de memoria para aprender a tu ritmo.',
      okeymoney: 'Dinero y autonomía cotidiana, paso a paso.',
      sinonimia: 'Diccionario en lectura fácil con sinónimos y pictogramas.',
      teclatlon: 'Mecanografía con el teclado físico del ordenador.',
      routime: 'Actividades cotidianas para entrenar mente y habilidades.'
    },
    footer: {
      note: 'Apptonomia — acceso a la suite'
    }
  }, 'es');
}