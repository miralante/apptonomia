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

  /* Claves de 'apptonomia:*' que NO son progreso de una actividad:
     'locale' (idioma) y 'prefs' (tamaño de letra, sonidos — ver
     /ajustes/). Se excluyen de estrellasTotales() y listaToolIds(). */
  var CLAVES_NO_HERRAMIENTA = ['locale', 'prefs'];

  /* Aplica ya mismo la preferencia de tamaño de letra guardada en
     /ajustes/ (regla: una sola vez en el núcleo compartido, nunca por
     herramienta — storage.js se carga en site/ y en todas las
     actividades antes de pintar nada). Por defecto --escala-texto
     queda en 1 (tokens.css), así que quien no haya tocado la
     preferencia no ve ningún cambio. */
  (function aplicarTamanoLetra() {
    try {
      var raw = localStorage.getItem(PREFIJO + 'prefs');
      var prefs = raw ? JSON.parse(raw) : {};
      var ESCALA = { normal: 1, grande: 1.15, muygrande: 1.3 };
      var escala = ESCALA[prefs.tamanoLetra] || 1;
      document.documentElement.style.setProperty('--escala-texto', escala);
    } catch (e) { /* silencio: se queda el tamaño por defecto */ }
  })();

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
        if (!clave || clave.indexOf(PREFIJO) !== 0) continue;
        if (CLAVES_NO_HERRAMIENTA.indexOf(clave.slice(PREFIJO.length)) !== -1) continue;
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
   * y sin las claves de CLAVES_NO_HERRAMIENTA). Usado por ajustes/
   * para mostrar el estado y para el restablecimiento completo.
   * @returns {string[]}
   */
  function listaToolIds() {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var clave = localStorage.key(i);
        if (!clave || clave.indexOf(PREFIJO) !== 0) continue;
        var id = clave.slice(PREFIJO.length);
        if (CLAVES_NO_HERRAMIENTA.indexOf(id) === -1) out.push(id);
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
