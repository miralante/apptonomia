  /* suite:reward-screen:begin
     Miralante closing screen of an activity. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/reward-screen.js. The block between
     the begin/end markers is copied byte for byte into assets/js/feedback.js of each
     app by apptonomia/scripts/sync-answer-round.js. Never edit a copy by hand.

     The reward is the stars won, with a short summary. Nothing else is shown here
     (no money, no points, no ranking). */

  /**
   * Writes the closing reward into `container`, replacing what it held.
   * @param {Element} container - element that holds the summary of the round
   * @param {number} stars - stars the person has
   * @param {string} summary - the summary sentence of the round
   */
  function paintReward(container, stars, summary) {
    if (!container) return;
    container.textContent = '';
    var estrellas = document.createElement('span');
    estrellas.className = 'reward-stars';
    estrellas.textContent = '⭐ ' + stars;
    var texto = document.createElement('span');
    texto.className = 'reward-summary';
    texto.textContent = summary || '';
    container.appendChild(estrellas);
    container.appendChild(texto);
  }

  window.App.feedback.paintReward = paintReward;
  /* suite:reward-screen:end */
