/* {{DISPLAY_EN}} — config/ (settings / data reset). Suite pattern: CLAUDE.md §B.5
   of the metaproject and doc/en/crear-app.md.

   - Shows how many items the app keeps in this browser.
   - Deletes them after a two-step confirmation.
   - Only keys that start with '{{SLUG}}:' are touched. Never localStorage.clear():
     on a shared origin that would wipe other apps' data too.
   - No network, no analytics. */
(function () {
  'use strict';

  var PREFIX = '{{SLUG}}:';

  function localeKey() {
    return window.App && window.App.i18n ? window.App.i18n.STORAGE_KEY : null;
  }

  function $(id) { return document.getElementById(id); }

  function ownKeys() {
    var keys = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        /* The reader's language is a preference, not progress: it stays, so the
           page does not switch language right after the reset. */
        if (key && key.indexOf(PREFIX) === 0 && key !== localeKey()) keys.push(key);
      }
    } catch (e) { /* storage may be off */ }
    return keys;
  }

  function showStatus(text) {
    $('config-status').textContent = text;
  }

  function refresh() {
    var count = ownKeys().length;
    showStatus(count ? App.i18n.t('config.stored').replace('{n}', function () { return String(count); })
                     : App.i18n.t('config.empty'));
    $('config-clear').disabled = count === 0;
  }

  function askConfirm(open) {
    $('config-start').classList.toggle('hidden', open);
    $('config-confirm').classList.toggle('hidden', !open);
    (open ? $('config-no') : $('config-clear')).focus();
  }

  function clearAll() {
    ownKeys().forEach(function (key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    });
    $('config-start').classList.remove('hidden');
    $('config-confirm').classList.add('hidden');
    refresh();
    showStatus(App.i18n.t('config.done'));
    /* The clear button is now disabled and cannot hold focus: move it to the result. */
    $('config-status').setAttribute('tabindex', '-1');
    $('config-status').focus();
  }

  function start() {
    $('config-clear').addEventListener('click', function () { askConfirm(true); });
    $('config-no').addEventListener('click', function () { askConfirm(false); });
    $('config-yes').addEventListener('click', clearAll);
    refresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
