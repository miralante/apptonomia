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
     The app's own strings must carry core.moreGoal ("A por más" / "Go for more"). */

  /* The navigation of the activity (doc/en/navigation-flow.md). "A por más" goes back
     to the entry point: the page as it starts, with its first screen. */
  var navigation = {
    /** Returns the activity to its entry point: its page as it starts. */
    entry: function () {
      window.location.reload();
    }
  };

  /**
   * Shows the achievement screen in the page until the person presses "A por más".
   * @param {string} message - the congratulation
   * @param {function} [after] - the action of "A por más", when the activity has its own
   *                             (e.g. the next question). Without it, the activity is
   *                             back at its entry point.
   * @param {string} [goal] - the progress line, e.g. "Ya tienes 8 estrellas · A por las 15 estrellas"
   */
  function celebrate(message, after, goal) {
    if (restDue()) {
      var rest = window.App.i18n ? window.App.i18n.t('core.rest') : '';
      if (rest) message = message + ' ' + rest;
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
    button.textContent = window.App.i18n ? window.App.i18n.t('core.moreGoal') : 'A por más';
    button.onclick = function () {
      layer.classList.add('hidden');
      stage.classList.remove('is-celebrating');
      if (after) after();
      else navigation.entry();
    };
    stage.classList.add('is-celebrating');
    layer.classList.remove('hidden');
    playCelebrationSound();
    button.focus();
  }

  window.App.feedback.celebrate = celebrate;
  window.App.navigation = navigation;
  /* suite:celebrate:end */
