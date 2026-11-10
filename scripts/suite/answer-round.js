  /* suite:answer-round:begin
     Miralante answer round. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/answer-round.js. The block between
     the begin/end markers is copied byte-for-byte into assets/js/feedback.js of
     each app by apptonomia/scripts/sync-answer-round.js. Never edit a copy by hand.

     Rules (the same in every app):
       - Right answer: the chosen answer stays, the other answers are hidden, and
         the app says it is correct (markCorrect + the app's own success message).
       - Wrong answer: the answers are hidden while the socratic hint is shown;
         «Entendido» brings the answers back. The wrong answer stays disabled.
       - Mistakes are never punished and retries are unlimited. */

  /* The label of the acknowledgement button, in the active language. */
  function textoEntendido() {
    return window.App.i18n ? App.i18n.t('core.understood') : 'Entendido';
  }

  /* Keeps the reading pause in a stable place, before the option group.
     Activities wrap their options differently, so find the nearest ancestor
     that shares a parent with the zone and put the zone in front of it. */
  function colocarZonaAntesDeOpciones(buttons, zona) {
    var primero = buttons && buttons.length ? buttons[0] : null;
    if (!primero || !zona || !zona.parentNode) return;

    var grupoOpciones = primero;
    while (grupoOpciones.parentNode && grupoOpciones.parentNode !== zona.parentNode) {
      grupoOpciones = grupoOpciones.parentNode;
    }
    if (grupoOpciones.parentNode === zona.parentNode) {
      zona.parentNode.insertBefore(zona, grupoOpciones);
    }
  }

  /**
   * Pauses the round after a wrong answer. While the hint shows, the round's
   * answers are hidden. Buttons already disabled from an earlier wrong try in
   * this round stay disabled. Shows/reuses an «Entendido» button inside `zona`
   * and focuses it; tapping it shows the answers again, hides the hint and
   * re-enables the buttons this call locked.
   * @param {Element|Element[]|NodeList} buttons - answers of the current round
   * @param {Element} zona - wrap holding the hint (or explanation) text
   * @param {function} [alConfirmar] - called after the person taps «Entendido»
   */
  function lockUntilAck(buttons, zona, alConfirmar) {
    var opciones = buttons && typeof buttons.length === 'number' ? buttons : (buttons ? [buttons] : []);
    var pendientes = Array.prototype.filter.call(opciones, function (b) {
      return b && !b.disabled && b.getAttribute('aria-disabled') !== 'true';
    });
    /* `disabled` is enough for native buttons, but some activities use custom
       interactive elements whose click handlers can still run. Capture the
       events as well so no answer can be picked while the pause waits. */
    function bloquearEvento(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    pendientes.forEach(function (b) {
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
      b.classList.add('bloqueada');
      b.addEventListener('click', bloquearEvento, true);
      b.addEventListener('keydown', bloquearEvento, true);
    });
    if (!zona) return;
    colocarZonaAntesDeOpciones(opciones, zona);
    /* The answers are hidden while the hint shows, not only disabled. */
    var ocultas = Array.prototype.filter.call(opciones, function (b) {
      return b && !b.classList.contains('hidden');
    });
    ocultas.forEach(function (b) { b.classList.add('hidden'); });
    var boton = zona.querySelector('.btn-entendido');
    if (!boton) {
      boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'btn btn-entendido';
      zona.appendChild(boton);
    }
    boton.textContent = textoEntendido();
    boton.classList.remove('hidden');
    boton.onclick = function () {
      pendientes.forEach(function (b) {
        b.removeEventListener('click', bloquearEvento, true);
        b.removeEventListener('keydown', bloquearEvento, true);
        b.disabled = false;
        b.removeAttribute('aria-disabled');
        b.classList.remove('bloqueada');
      });
      ocultas.forEach(function (b) { b.classList.remove('hidden'); });
      boton.classList.add('hidden');
      zona.classList.add('hidden');
      if (alConfirmar) alConfirmar();
    };
    boton.focus();
  }

  /**
   * A right answer is final: the chosen answer stays as it is, the other answers
   * are hidden and none of them can be pressed. The caller marks the answer
   * and says it is correct.
   * @param {Element} control - the answer the person chose
   * @param {Element|Element[]|NodeList} buttons - all the answers of the round
   */
  function markCorrect(control, buttons) {
    var opciones = buttons && typeof buttons.length === 'number' ? buttons : (buttons ? [buttons] : []);
    Array.prototype.forEach.call(opciones, function (b) {
      if (!b || b === control) return;
      b.classList.add('hidden');
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
    });
    if (control) {
      control.disabled = true;
      control.setAttribute('aria-disabled', 'true');
    }
  }

  window.App.feedback.lockUntilAck = lockUntilAck;
  window.App.feedback.markCorrect = markCorrect;
  /* suite:answer-round:end */
