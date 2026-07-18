/* ============================================================
   Apptonomia — Textos de Doble Sentido (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "👀 Doble Sentido",
    "instruction": "Algunas palabras pueden significar dos cosas distintas. Escucha la frase y decide si tiene un significado o dos.",
    "chooseLevel": "Elige un grupo de frases",
    "itemsCount": "8 frases",
    "done": "✔ Hecho",
    "chooseAnotherLevel": "Elegir otro grupo",
    "question": "¿Esta frase tiene doble sentido?",
    "optionYes": "Sí, puede significar dos cosas",
    "optionNo": "No, solo significa una cosa",
    "doubleExplanation": "✅ ¡Correcto! Puede ser: {m1}, o puede ser: {m2}.",
    "singleExplanation": "✅ ¡Correcto! Solo significa: {m1}.",
    "hint": "🤔 Prueba otra vez. Escucha bien la frase.",
    "finalSummary": "Has ganado {n} estrellas. Ahora tienes {total} estrellas."
  }, 'es');
})();
