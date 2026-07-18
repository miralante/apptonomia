/* ============================================================
   Apptonomia — Textos de Completa la Palabra (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "🔡 Completa la Palabra",
    "instruction": "Mira la palabra y elige la letra que falta para escribirla bien.",
    "chooseLevel": "Elige un grupo de palabras",
    "wordsCount": "8 palabras",
    "done": "✔ Hecho",
    "chooseAnotherLevel": "Elegir otro grupo",
    "noLetter": "sin letra",
    "correctExplanation": "✅ ¡Correcto!",
    "wrongExplanationPrefix": "❌ Esa letra no es. Se escribe así: ",
    "hint": "🤔 Prueba otra vez. Piensa en cómo suena: ",
    "finalSummary": "Has ganado {n} estrellas. Ahora tienes {total} estrellas."
  }, 'es');
})();
