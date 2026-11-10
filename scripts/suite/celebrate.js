  /* suite:celebrate:begin
     Apptonomia closing celebration. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/celebrate.js. The block between the
     begin/end markers is copied byte for byte into assets/js/feedback.js of each app
     (and into the new-app template) by apptonomia/scripts/sync-answer-round.js.
     Never edit a copy by hand.

     Each app supplies three small hooks OUTSIDE this block, in the same file:
       playCelebrationSound()  plays the app's success sound
       restDue()               true when this celebration carries the rest reminder
                               (counts the rounds, or the minutes, as the app decides)
       restDone()              resets the rest reminder after it was shown
     The overlay, its text and its timing are the same everywhere. */

  /**
   * Shows the closing overlay with `message` until the reading time has passed,
   * then hides it and calls `after`. The time is fixed by the length of the
   * message, so a long closing message (name, transfer line, progress) can be read.
   * @param {string} message - the closing text
   * @param {function} [after] - called when the overlay hides
   * @returns {number} how long the overlay stays up, in ms
   */
  function celebrate(message, after) {
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
      layer.setAttribute('role', 'status');
      layer.innerHTML = '<div class="emoji" aria-hidden="true">⭐</div><div class="message"></div>';
      document.body.appendChild(layer);
    }
    layer.querySelector('.message').textContent = message;
    layer.classList.remove('hidden');
    playCelebrationSound();

    var reduced = !!(window.App.utils && window.App.utils.reducedMotion());
    var duration = Math.min(10000, (reduced ? 2500 : 3000) + String(message).length * 60);
    setTimeout(function () {
      layer.classList.add('hidden');
      if (after) after();
    }, duration);
    return duration;
  }

  window.App.feedback.celebrate = celebrate;
  /* suite:celebrate:end */
