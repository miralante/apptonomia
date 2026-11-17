  /* suite:celebrate:begin
     Apptonomia achievement screen ("logros"). ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/celebrate.js. The block between the
     begin/end markers is copied byte for byte into assets/js/feedback.js of each app
     (and into the new-app template) by apptonomia/scripts/sync-answer-round.js.
     Never edit a copy by hand.

     This is the only closing screen of an activity: a congratulation, the progress
     line ("Ya tienes X · A por las Y") and the button "A por más". There is no timer:
     the screen stays up until the person presses the button.

     Each app supplies three small hooks OUTSIDE this block, in the same file:
       playCelebrationSound()  plays the app's success sound
       restDue()               true when this celebration carries the rest reminder
                               (counts the rounds, or the minutes, as the app decides)
       restDone()              resets the rest reminder after it was shown
     The app's own strings must carry core.moreGoal ("A por más" / "Go for more").
     The overlay, its text and its button are the same everywhere. */

  /* The navigation of the flow (doc/en/navigation-flow.md). A page names the next point
     of the flow with <link rel="next" href="…"> and the level above with its back link
     (.back-link). The achievement screen resumes there when it has no action of its own. */
  var navigation = {
    /** Where the flow goes from this page: the next point, else the level above, else null. */
    target: function () {
      return pageHref('link[rel="next"]') || pageHref('.back-link');
    },
    /** Goes to the next point of the flow. Returns false when there is none (the screen just closes). */
    resume: function () {
      var href = navigation.target();
      if (!href) return false;
      window.location.href = href;
      return true;
    }
  };

  function pageHref(selector) {
    var el = document.querySelector(selector);
    return el && el.getAttribute('href') ? el.href : null;
  }

  /**
   * Shows the achievement screen until the person presses "A por más". Without an
   * action of its own, "A por más" goes to the next point of the flow.
   * @param {string} message - the congratulation
   * @param {function} [after] - the action of "A por más" (e.g. start the next round). Given: it replaces the flow.
   * @param {string} [goal] - the progress line, e.g. "Ya tienes 8 estrellas · A por las 15 estrellas"
   */
  function celebrate(message, after, goal) {
    if (restDue()) {
      var rest = window.App.i18n ? window.App.i18n.t('core.rest') : '';
      if (rest) message = message + ' ' + rest;
      restDone();
    }
    var layer = document.getElementById('app-celebration');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'app-celebration';
      layer.className = 'celebration hidden';
      layer.setAttribute('role', 'dialog');
      layer.setAttribute('aria-modal', 'true');
      layer.setAttribute('aria-labelledby', 'app-celebration-message');
      layer.innerHTML = '<div class="emoji" aria-hidden="true">⭐</div>' +
        '<div class="message" id="app-celebration-message"></div>' +
        '<div class="goal"></div>' +
        '<button type="button" class="btn celebration-more"></button>';
      document.body.appendChild(layer);
    }
    layer.querySelector('.message').textContent = message;
    var goalEl = layer.querySelector('.goal');
    goalEl.textContent = goal || '';
    goalEl.classList.toggle('hidden', !goal);
    var button = layer.querySelector('.celebration-more');
    button.textContent = window.App.i18n ? window.App.i18n.t('core.moreGoal') : 'A por más';
    button.onclick = function () {
      layer.classList.add('hidden');
      if (after) after();
      else navigation.resume();
    };
    layer.classList.remove('hidden');
    playCelebrationSound();
    button.focus();
  }

  window.App.feedback.celebrate = celebrate;
  window.App.navigation = navigation;
  /* suite:celebrate:end */
