/* ==========================================================================
   Apptonomia — Progreso en localStorage
   Expone window.App.storage.get(toolId) / .set(toolId, data) / .remove(toolId)
   Clave interna: 'apptonomia:<toolId>'. Sin datos personales.
   Siempre tolerante a fallos (modo privado puede lanzar excepciones).
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var PREFIJO = 'apptonomia:';

  /**
   * Lee el progreso de una herramienta.
   * @param {string} toolId - slug de la herramienta, p. ej. 'parejas'
   * @returns {object} progreso guardado o {} si no hay nada / hay error
   */
  function get(toolId) {
    try {
      var raw = localStorage.getItem(PREFIJO + toolId);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Guarda el progreso de una herramienta.
   * @param {string} toolId
   * @param {object} data - objeto serializable a JSON
   * @returns {boolean} true si se guardó
   */
  function set(toolId, data) {
    try {
      localStorage.setItem(PREFIJO + toolId, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Borra el progreso de una herramienta. */
  function remove(toolId) {
    try {
      localStorage.removeItem(PREFIJO + toolId);
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Suma de estrellas de todas las herramientas (para el menú).
      Bug corregido: el try/catch envolvía TODO el bucle, así que una sola
      clave no-JSON entre medias (p. ej. 'apptonomia:locale', que guarda un
      string plano como 'en', no JSON) cortaba la suma para el resto de
      herramientas que vinieran después en el orden de iteración de
      localStorage (no es el orden de inserción). Cada clave se procesa
      ahora en su propio try/catch. */
  function estrellasTotales() {
    var total = 0;
    for (var i = 0; i < localStorage.length; i++) {
      try {
        var clave = localStorage.key(i);
        if (!clave || clave.indexOf(PREFIJO) !== 0 || clave === PREFIJO + 'locale') continue;
        var datos = JSON.parse(localStorage.getItem(clave) || '{}');
        if (datos && typeof datos.estrellas === 'number') {
          total += datos.estrellas;
        }
      } catch (e) { /* clave individual corrupta o no-JSON: seguir con las demás */ }
    }
    return total;
  }

  /**
   * Ids de todas las herramientas con algo guardado (sin el prefijo,
   * y sin 'locale', que no es una herramienta). Usado por ajustes/
   * para mostrar el estado y para el restablecimiento completo.
   * @returns {string[]}
   */
  function listaToolIds() {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var clave = localStorage.key(i);
        if (clave && clave.indexOf(PREFIJO) === 0 && clave !== PREFIJO + 'locale') {
          out.push(clave.slice(PREFIJO.length));
        }
      }
    } catch (e) { /* ignorar */ }
    return out;
  }

  window.App.storage = {
    get: get,
    set: set,
    remove: remove,
    estrellasTotales: estrellasTotales,
    listaToolIds: listaToolIds
  };
})();
