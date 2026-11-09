/* Apptonomia — achievements ("logros") for the portal.
   Exposes window.App.achievements: list, unlocked(), achieve(id),
   evaluate(), render(container), reset().

   Apptonomia is a landing: it has no lessons or stars of its own.
   The achievements reward what a visitor actually does here — come
   back on different days, open the suite's apps, read the portal in
   both languages and adjust the shared settings panel (gear icon).

   Storage (localStorage, this device only, never sent anywhere):
   - 'apptonomia:achievements' -> { id: timestamp } of unlocked ones.
   - 'apptonomia:activity'     -> small counters, not a usage history:
       { days: n, lastDay: 'YYYY-MM-DD', streak: n,
         apps: ['memofun', ...], locales: ['es', ...] }
   The settings achievement is derived from the keys the shared
   locale picker already writes, so returning visitors who changed
   their settings before this file existed get it on their next visit.

   Portal tracking runs only on pages whose <body> carries
   data-achievements="portal" (index.html). Other pages that load this
   file (about-app/) only render, plus count a language switch. Texts come from App.i18n under aboutApp.*
   (achievement<Name>, achievement<Name>Desc, achievementLocked,
   achievementUnlockedAt). */
(function () {
  'use strict';

  window.App = window.App || {};

  var ACHIEVEMENTS_KEY = 'apptonomia:achievements';
  var ACTIVITY_KEY = 'apptonomia:activity';
  /* Keys owned by assets/js/locale-picker.js (shared settings panel). */
  var SETTINGS_KEY = 'apptonomia:locale:accessibility';
  var SOUNDS_KEY = 'miralante:sounds';

  /* Apps that can be opened from the portal today (anchor cards with
     data-app in index.html). Keep in sync when a "coming soon" card
     becomes a link. */
  var AVAILABLE_APPS = ['sinonimia', 'memofun', 'teclatlon'];
  var LOCALES = ['es', 'en'];

  var LIST = [
    { id: 'firstApp',       icon: '⭐', key: 'achievementFirstApp' },
    { id: 'tenDays',        icon: '🌟', key: 'achievementTenDays' },
    { id: 'streak3',        icon: '🔥', key: 'achievementStreak3' },
    { id: 'allApps',        icon: '🏆', key: 'achievementAllApps' },
    { id: 'bothLanguages',  icon: '🌍', key: 'achievementBothLanguages' },
    { id: 'customSettings', icon: '🎨', key: 'achievementCustomSettings' }
  ];

  function readJson(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || 'null');
      return (value && typeof value === 'object') ? value : null;
    } catch (e) {
      return null;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  /** Unlocked achievements as { id: timestamp }. */
  function unlocked() {
    return readJson(ACHIEVEMENTS_KEY) || {};
  }

  /** Idempotent unlock. Returns true only the first time. */
  function achieve(id) {
    var done = unlocked();
    if (done[id]) return false;
    done[id] = Date.now();
    writeJson(ACHIEVEMENTS_KEY, done);
    return true;
  }

  function activity() {
    var a = readJson(ACTIVITY_KEY) || {};
    return {
      days: typeof a.days === 'number' ? a.days : 0,
      lastDay: typeof a.lastDay === 'string' ? a.lastDay : '',
      streak: typeof a.streak === 'number' ? a.streak : 0,
      apps: Array.isArray(a.apps) ? a.apps : [],
      locales: Array.isArray(a.locales) ? a.locales : []
    };
  }

  function addUnique(list, value) {
    if (list.indexOf(value) === -1) list.push(value);
  }

  /* Local calendar day, so a visit late at night counts for that day. */
  function dayString(date) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return date.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
  }

  function settingsChanged() {
    var s = readJson(SETTINGS_KEY);
    if (s && (s.textSizeSet === true || s.textSize === 'small' || s.textSize === 'large' || s.contrast === true)) {
      return true;
    }
    var sounds = readJson(SOUNDS_KEY);
    return !!(sounds && (sounds.success === false || sounds.error === true));
  }

  /** Unlocks everything the stored data already earns. */
  function evaluate() {
    var a = activity();
    if (a.apps.length >= 1) achieve('firstApp');
    if (a.days >= 10) achieve('tenDays');
    if (a.streak >= 3) achieve('streak3');
    if (AVAILABLE_APPS.every(function (app) { return a.apps.indexOf(app) !== -1; })) achieve('allApps');
    if (LOCALES.every(function (loc) { return a.locales.indexOf(loc) !== -1; })) achieve('bothLanguages');
    if (settingsChanged()) achieve('customSettings');
  }

  function recordVisit() {
    var a = activity();
    var today = dayString(new Date());
    if (a.lastDay !== today) {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      a.streak = (a.lastDay === dayString(yesterday)) ? a.streak + 1 : 1;
      a.days += 1;
      a.lastDay = today;
      writeJson(ACTIVITY_KEY, a);
    }
  }

  function recordApp(app) {
    if (AVAILABLE_APPS.indexOf(app) === -1) return;
    var a = activity();
    addUnique(a.apps, app);
    writeJson(ACTIVITY_KEY, a);
    evaluate();
  }

  function recordLocale(locale) {
    if (LOCALES.indexOf(locale) === -1) return;
    var a = activity();
    addUnique(a.locales, locale);
    writeJson(ACTIVITY_KEY, a);
    evaluate();
  }

  /** Clears achievements and their counters (not language or settings). */
  function reset() {
    try {
      localStorage.removeItem(ACHIEVEMENTS_KEY);
      localStorage.removeItem(ACTIVITY_KEY);
    } catch (e) { /* ignore */ }
  }

  function t(key) {
    return App.i18n ? App.i18n.t('aboutApp.' + key) : key;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** Draws one badge per achievement inside `container` (a <ul>). */
  function render(container) {
    if (!container) return;
    var done = unlocked();
    var locale = App.i18n ? App.i18n.locale() : 'es';
    container.innerHTML = '';
    LIST.forEach(function (a) {
      var isUnlocked = !!done[a.id];
      var status = isUnlocked
        ? t('achievementUnlockedAt').replace('{date}', new Date(done[a.id]).toLocaleDateString(locale))
        : t('achievementLocked');
      var item = document.createElement('li');
      item.className = 'achievement-badge ' + (isUnlocked ? 'unlocked' : 'locked');
      item.setAttribute('data-achievement', a.id);
      item.innerHTML =
        '<span class="achievement-badge-icon" aria-hidden="true">' + a.icon + '</span>' +
        '<span class="achievement-badge-name">' + escapeHtml(t(a.key)) + '</span>' +
        '<span class="achievement-badge-desc">' + escapeHtml(t(a.key + 'Desc')) + '</span>' +
        '<span class="achievement-badge-status">' + escapeHtml(status) + '</span>';
      container.appendChild(item);
    });
  }

  /* Wraps App.i18n.set so every runtime language switch (locale picker
     or language buttons) is reported. Pages listen to
     'apptonomia:localechange' to repaint dynamic text. */
  function watchLocale() {
    if (!App.i18n || App.i18n.__achievementsWrapped) return;
    var originalSet = App.i18n.set;
    App.i18n.set = function (locale) {
      originalSet(locale);
      document.dispatchEvent(new CustomEvent('apptonomia:localechange', { detail: { locale: locale } }));
    };
    App.i18n.__achievementsWrapped = true;
  }

  function trackPortal() {
    recordVisit();
    recordLocale(App.i18n ? App.i18n.locale() : '');
    evaluate();

    /* Opening an app: the cards open in a new tab, so this page stays. */
    function onCard(event) {
      var card = event.target.closest && event.target.closest('a.suite-card[data-app]');
      if (card) recordApp(card.getAttribute('data-app'));
    }
    document.addEventListener('click', onCard);
    document.addEventListener('auxclick', onCard);

    /* The shared settings drawer writes its own keys; re-check after
       any interaction inside it. */
    function onSettings(event) {
      if (event.target.closest && event.target.closest('#accessibility-settings')) {
        window.setTimeout(evaluate, 0);
      }
    }
    document.addEventListener('click', onSettings);
    document.addEventListener('change', onSettings);
  }

  window.App.achievements = {
    list: LIST,
    availableApps: AVAILABLE_APPS,
    unlocked: unlocked,
    achieve: achieve,
    evaluate: evaluate,
    render: render,
    reset: reset
  };

  watchLocale();
  /* Any page that loads this file counts a language switch. */
  document.addEventListener('apptonomia:localechange', function (event) {
    recordLocale(event.detail.locale);
  });

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body && document.body.getAttribute('data-achievements') === 'portal') trackPortal();
  });
})();
