  /* suite:celebrate:begin
     Apptonomia achievement screen ("logros"). ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/celebrate.js. The block between the
     begin/end markers is copied byte for byte into assets/js/feedback.js of each app
     (and into the new-app template) by apptonomia/scripts/sync-answer-round.js.
     Never edit a copy by hand.

     The achievement is a state of the page, not a layer over it: it takes the place
     of the activity's content inside <main> (the header and the back link stay), and
     it shows a congratulation, the progress line ("Ya tienes X · A por las Y") and
     the button "A por más". There is no timer: it stays until the person presses
     the button.

     "A por más" returns the person to the entry point of the activity (the page as
     it starts: navigation.entry()), unless the activity passes its own action. The
     navigation tree is the one of doc/en/navigation-flow.md: home, hub, activity.

     Each app supplies three small hooks OUTSIDE this block, in the same file:
       playCelebrationSound()  plays the app's success sound
       restDue()               true when this celebration carries the rest reminder
                               (counts the rounds, or the minutes, as the app decides)
       restDone()              resets the rest reminder after it was shown
     The app's own strings must carry core.moreGoal ("A por más" / "Go for more") and,
     when the app has stars, core.starEarned ("¡Has conseguido una nueva estrella!"). */

  /* The entry point of an activity is the card in its hub that started it (doc/en/
     navigation-flow.md). "A por más" goes back there: to the hub, restored where the card
     was when it was pressed (history back), when the hub is the page the person came from;
     otherwise to the hub's link. */
  /* The path of a URL, with a trailing "index.html" dropped: the shared header writes a
     folder link ("../") as "../index.html", while the referrer of a hub reached by its
     folder is "/hub/". Both name the same page and must compare equal. */
  function urlPath(u) {
    try {
      return u ? new URL(u, window.location.href).pathname.replace(/\/index\.html$/, '/') : null;
    } catch (e) { return null; }
  }

  /* The app's text for `key`, or `fallback` when the app has no such string. An i18n core
     returns '' or the key itself for a missing string; neither must reach the screen. */
  function textOf(key, fallback) {
    var i18n = window.App.i18n;
    var value = i18n && typeof i18n.t === 'function' ? i18n.t(key) : '';
    return value && value !== key ? value : fallback;
  }

  function pageHref(selector) {
    var el = document.querySelector(selector);
    return el && el.getAttribute('href') ? el.href : null;
  }

  var navigation = {
    /** Goes back to the hub card that started the activity. */
    entry: function () {
      var up = pageHref('.back-link');
      if (up && urlPath(document.referrer) === urlPath(up) && window.history.length > 1) {
        window.history.back();
        return;
      }
      if (up) { window.location.href = up; return; }
      window.location.reload();
    }
  };

  /* While the achievement shows, "← Volver" must leave the activity, not step back inside
     it (App.backStep of the page is held off). The page's own step returns when it closes. */
  var heldBackStep;
  function holdBackStep() {
    if (window.App.backStep === holdFalse) return;
    heldBackStep = window.App.backStep;
    window.App.backStep = holdFalse;
  }
  function releaseBackStep() {
    if (window.App.backStep === holdFalse) window.App.backStep = heldBackStep;
  }
  function holdFalse() { return false; }

  /**
   * Shows the achievement screen in the page until the person presses "A por más".
   * @param {string} message - the congratulation
   * @param {function} [after] - the action of "A por más", when the activity has its own
   *                             (e.g. the next question). Without it, the activity is
   *                             back at its entry point.
   * @param {string} [goal] - the progress line, e.g. "Ya tienes 8 estrellas · A por las 15 estrellas"
   */
  function celebrate(message, after, goal) {
    /* A new star is congratulated: "¡Has conseguido una nueva estrella!". The stars engine
       knows when the total went up (see stars-engine.js, takeNewStar). The generic finish
       message ("¡Has terminado!", "¡Ronda completada!") is replaced by it, because the star
       already says the round is done; an app's own message is kept after it. */
    if (window.ApptonomiaStars && window.ApptonomiaStars.takeNewStar && window.ApptonomiaStars.takeNewStar()) {
      var star = textOf('core.starEarned', '');
      if (star) {
        var generic = [textOf('core.roundComplete', ''), textOf('endTitle', '')].filter(Boolean);
        message = (!message || generic.indexOf(message) !== -1) ? star : (star + ' ' + message).trim();
      }
    }
    if (restDue()) {
      var rest = textOf('core.rest', '');
      if (rest) message = (message + ' ' + rest).trim();
      restDone();
    }
    var stage = document.querySelector('main') || document.body;
    var layer = document.getElementById('app-celebration');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'app-celebration';
      layer.className = 'celebration hidden';
      layer.setAttribute('role', 'region');
      layer.setAttribute('aria-labelledby', 'app-celebration-message');
      layer.innerHTML = '<div class="emoji" aria-hidden="true">⭐</div>' +
        '<div class="message" id="app-celebration-message"></div>' +
        '<div class="goal"></div>' +
        '<button type="button" class="btn celebration-more"></button>';
    }
    if (layer.parentNode !== stage) stage.insertBefore(layer, stage.firstChild);
    layer.querySelector('.message').textContent = message;
    var goalEl = layer.querySelector('.goal');
    goalEl.textContent = goal || '';
    goalEl.classList.toggle('hidden', !goal);
    var button = layer.querySelector('.celebration-more');
    button.textContent = textOf('core.moreGoal', 'A por más');
    button.onclick = function () {
      releaseBackStep();
      if (after) {
        layer.classList.add('hidden');
        stage.classList.remove('is-celebrating');
        after();
      } else {
        // Leaving the activity: the achievement stays on screen until the page changes,
        // so the last slide never shows before the entry point.
        navigation.entry();
      }
    };
    holdBackStep();
    stage.classList.add('is-celebrating');
    layer.classList.remove('hidden');
    playCelebrationSound();
    button.focus();
  }

  window.App.feedback.celebrate = celebrate;
  window.App.navigation = navigation;
  /* suite:celebrate:end */
