/* ============================================================
   Apptonomia — Textos de Diccionario (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "📚 Diccionario",
    "instruction": "Aprende palabras difíciles con su significado sencillo y un ejemplo. Después, haz un test para comprobar qué recuerdas.",
    "chooseLevel": "Elige un grupo de palabras",
    "wordsCount": "8 palabras",
    "done": "✔ Hecho",
    "chooseAnotherLevel": "Elegir otro grupo",
    "definitionLabel": "Significa:",
    "exampleLabel": "Por ejemplo:",
    "startQuiz": "Hacer el test",
    "quizQuestion": "¿Qué significa esta palabra?",
    "correctExplanation": "✅ ¡Correcto!",
    "wrongExplanationPrefix": "❌ Eso no es. El significado es: ",
    "hint": "🤔 Prueba otra vez. Piensa en el ejemplo: ",
    "finalSummary": "Has ganado {n} estrellas. Ahora tienes {total} estrellas."
  }, 'es');
})();
