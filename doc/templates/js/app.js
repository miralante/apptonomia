/* {{DISPLAY_EN}} — home page script. Replace the body of start() with the
   app's own logic. Shared pieces it can use:
     App.i18n        (js/i18n.js)          translations
     App.feedback    (js/feedback.js)      answer round, reward screen, celebration
     ApptonomiaStars (js/stars-engine.js)  star goals and milestones
     ApptonomiaAchievements (js/achievements-engine.js) achievements board

   Storage rule: every localStorage key starts with STORAGE_PREFIX, so the
   config/ page can clear the app's data and nothing else. */
(function () {
  'use strict';

  window.App = window.App || {};
  var STORAGE_PREFIX = '{{SLUG}}:';
  window.App.STORAGE_PREFIX = STORAGE_PREFIX;

  /* The stars engine keeps its "last celebrated total" under the app's prefix. */
  if (window.ApptonomiaStars && window.ApptonomiaStars.useStorageKey) {
    window.ApptonomiaStars.useStorageKey(STORAGE_PREFIX + 'stars:last');
  }

  function readStars() {
    try { return Number(localStorage.getItem(STORAGE_PREFIX + 'stars')) || 0; } catch (e) { return 0; }
  }

  function start() {
    var counter = document.getElementById('stars');
    if (!counter || !window.ApptonomiaStars) return;
    var total = readStars();
    counter.textContent = '⭐ ' + total;
    window.ApptonomiaStars.goal(counter, total, {
      reached: App.i18n.t('stars.reached'),
      goal: App.i18n.t('stars.goal')
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
