/* Apptonomia — "About the app" page (about-app/).
   Linked from the portal footer. Shows the achievements unlocked on
   this device and lets the person delete them (two-step confirm).
   Catalog, storage and badge renderer: ../js/achievements.js.
   Must load before ../assets/js/locale-picker.js (deferred), which
   reads window.LocalePickerConfig when it runs. */
(function () {
  'use strict';

  /* The shared strings live one level up. */
  window.LocalePickerConfig = { path: '../js/strings' };

  var t = function (key) { return App.i18n.t('aboutApp.' + key); };

  function renderAchievements() {
    var list = App.achievements.list;
    var done = App.achievements.unlocked();
    var count = list.filter(function (a) { return !!done[a.id]; }).length;
    document.getElementById('achievementsCount').textContent = t('achievementsCount')
      .replace('{n}', String(count))
      .replace('{total}', String(list.length));
    App.achievements.render(document.getElementById('achievementsGrid'));
    document.title = t('pageTitle');
  }

  function wireReset() {
    var start = document.getElementById('resetStart');
    var box = document.getElementById('resetConfirmBox');
    var status = document.getElementById('resetStatus');
    start.addEventListener('click', function () {
      status.textContent = '';
      start.hidden = true;
      box.hidden = false;
      document.getElementById('resetCancel').focus();
    });
    document.getElementById('resetCancel').addEventListener('click', function () {
      box.hidden = true;
      start.hidden = false;
      start.focus();
    });
    document.getElementById('resetConfirm').addEventListener('click', function () {
      App.achievements.reset();
      box.hidden = true;
      start.hidden = false;
      renderAchievements();
      status.textContent = t('resetDone');
      start.focus();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* Credit what this device already earned (e.g. settings changed
       before achievements existed). */
    App.achievements.evaluate();
    renderAchievements();
    wireReset();
  });
  document.addEventListener('apptonomia:localechange', renderAchievements);
})();
