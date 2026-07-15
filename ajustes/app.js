/* ============================================================
   Apptonomia — Ajustes (ruta oculta)
   Ver/restablecer lo guardado en localStorage. Dos acciones:
   - "Restablecer datos de la persona": borra idioma + nombre
     (Teclado y Piano son las únicas herramientas con nombre).
     El progreso de todas las actividades se conserva.
   - "Restablecer toda la aplicación": borra todo lo de
     'apptonomia:*' (equivale a abrir la app por primera vez).
   Confirmación en dos pasos (mismo patrón que "Borrar mi progreso"
   de keyboard-typing): un clic pide confirmar, el segundo borra.
   Página en español fijo (como equipo/), no usa App.i18n.register().
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;

  /* Herramientas que guardan un nombre de pila (ver PLAN.md §9.1 /
     equipo/index.html §Progreso y privacidad). Mantener esta lista al
     día si una herramienta nueva pide un nombre. */
  var HERRAMIENTAS_CON_NOMBRE = ['keyboard-typing', 'piano-teclas'];

  var PREFIJO = 'apptonomia:';

  /* --- Copia de mi progreso (F1): exportar/importar todas las claves
     'apptonomia:*' tal cual están en localStorage (algunas son JSON,
     'locale' es un string plano) — así no hace falta conocer el formato
     interno de cada herramienta. --- */
  function exportarProgreso() {
    var datos = {};
    for (var i = 0; i < localStorage.length; i++) {
      var clave = localStorage.key(i);
      if (clave && clave.indexOf(PREFIJO) === 0) {
        datos[clave] = localStorage.getItem(clave);
      }
    }
    var blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'apptonomia-progreso.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    var f = $('#feedbackExportar');
    f.textContent = 'Hecho. Revisa la carpeta de descargas del navegador.';
    f.className = 'feedback acierto';
  }

  var archivoImportar = null;

  function validarCopia(datos) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return false;
    var claves = Object.keys(datos);
    if (!claves.length) return false;
    for (var i = 0; i < claves.length; i++) {
      if (claves[i].indexOf(PREFIJO) !== 0) return false;
      if (typeof datos[claves[i]] !== 'string') return false;
    }
    return true;
  }

  function importarProgreso() {
    var f = $('#feedbackImportar');
    if (!archivoImportar) return;
    try {
      var datos = JSON.parse(archivoImportar);
    } catch (e) {
      f.textContent = 'Ese archivo no es una copia válida (no se puede leer). No se ha tocado nada.';
      f.className = 'feedback animo';
      return;
    }
    if (!validarCopia(datos)) {
      f.textContent = 'Ese archivo no es una copia de Apptonomia válida. No se ha tocado nada.';
      f.className = 'feedback animo';
      return;
    }
    for (var clave in datos) {
      if (Object.prototype.hasOwnProperty.call(datos, clave)) {
        try { localStorage.setItem(clave, datos[clave]); } catch (e) { /* ignorar */ }
      }
    }
    f.textContent = 'Hecho. Se ha recuperado el progreso guardado en el archivo.';
    f.className = 'feedback acierto';
    pintarEstado();
    pintarProgresoActividades();
  }

  function pintarEstado() {
    var ids = App.storage.listaToolIds();
    var estrellas = App.storage.estrellasTotales();
    var idioma = App.i18n.locale() === 'en' ? 'English' : 'Español';
    var lista = $('#listaEstado');
    lista.innerHTML = '';

    var items = [
      'Idioma actual: ' + idioma,
      'Actividades con progreso guardado: ' + ids.length,
      'Estrellas totales: ' + estrellas
    ];
    items.forEach(function (texto) {
      var li = document.createElement('li');
      li.textContent = texto;
      lista.appendChild(li);
    });
  }

  /* --- Modo cuidador (D2-ítem3 de PLAN.md §9.2): progreso de solo
     lectura por actividad. Cada celda de progreso ya está en el HTML con
     data-tool="<slug>"; aquí solo se rellena el texto, sin generar el
     catálogo por JS (mismo criterio que equipo/index.html: filas
     estáticas, fuente de verdad legible sin ejecutar nada). --- */
  function pintarProgresoActividades() {
    App.utils.$$('#progreso-actividades [data-tool]').forEach(function (celda) {
      var datos = App.storage.get(celda.dataset.tool);
      var estrellas = typeof datos.estrellas === 'number' ? datos.estrellas : 0;
      celda.textContent = estrellas > 0 ? '⭐ ' + estrellas : 'Sin empezar';
    });
  }

  /* --- Preferencias (D2 de PLAN.md §9.2): tamaño de letra y sonidos.
     Se guardan juntas en 'apptonomia:prefs' (un único objeto JSON, no una
     clave por preferencia) para no ensuciar listaToolIds()/estrellasTotales()
     con más claves que excluir — storage.js ya excluye 'prefs' entera. */
  function pintarPreferencias() {
    var prefs = App.storage.get('prefs');
    var tamano = prefs.tamanoLetra || 'normal';
    var sonidos = prefs.sonidos !== false ? 'on' : 'off';
    App.utils.$$('#selectorTamano .btn-pref').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.valor === tamano ? 'true' : 'false');
    });
    App.utils.$$('#selectorSonidos .btn-pref').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.valor === sonidos ? 'true' : 'false');
    });
  }

  function guardarPreferencia(clave, valor) {
    var prefs = App.storage.get('prefs');
    prefs[clave] = valor;
    App.storage.set('prefs', prefs);
    if (clave === 'tamanoLetra') {
      var ESCALA = { normal: 1, grande: 1.15, muygrande: 1.3 };
      document.documentElement.style.setProperty('--escala-texto', ESCALA[valor] || 1);
    }
    pintarPreferencias();
  }

  App.utils.$$('#selectorTamano .btn-pref').forEach(function (b) {
    b.addEventListener('click', function () { guardarPreferencia('tamanoLetra', b.dataset.valor); });
  });
  App.utils.$$('#selectorSonidos .btn-pref').forEach(function (b) {
    b.addEventListener('click', function () { guardarPreferencia('sonidos', b.dataset.valor === 'on'); });
  });
  pintarPreferencias();

  /* Confirmación en dos pasos sobre un mismo botón. */
  function confirmarDoble(btn, textoNormal, textoConfirmar, alConfirmar) {
    var confirmando = false;
    var timeoutId = null;
    btn.textContent = textoNormal;
    btn.addEventListener('click', function () {
      if (!confirmando) {
        confirmando = true;
        btn.textContent = textoConfirmar;
        timeoutId = setTimeout(function () {
          confirmando = false;
          btn.textContent = textoNormal;
        }, 5000);
        return;
      }
      clearTimeout(timeoutId);
      confirmando = false;
      btn.textContent = textoNormal;
      alConfirmar();
    });
  }

  function resetPersona() {
    App.storage.remove('locale');
    HERRAMIENTAS_CON_NOMBRE.forEach(function (id) {
      var estado = App.storage.get(id);
      if (typeof estado.nombre === 'string' && estado.nombre) {
        estado.nombre = '';
        App.storage.set(id, estado);
      }
    });
    var f = $('#feedbackPersona');
    f.textContent = 'Hecho. Idioma y nombres borrados. El progreso se ha conservado.';
    f.className = 'feedback acierto';
    pintarEstado();
    pintarProgresoActividades();
  }

  function resetApp() {
    App.storage.remove('locale');
    App.storage.remove('prefs');
    App.storage.listaToolIds().forEach(function (id) {
      App.storage.remove(id);
    });
    var f = $('#feedbackApp');
    f.textContent = 'Hecho. Se ha borrado todo. La aplicación queda como recién instalada.';
    f.className = 'feedback acierto';
    pintarEstado();
    pintarProgresoActividades();
  }

  confirmarDoble($('#btnResetPersona'),
    '🧑 Restablecer datos de la persona',
    '¿Seguro? Toca otra vez para borrar idioma y nombres.',
    resetPersona);

  confirmarDoble($('#btnResetApp'),
    '🗑️ Restablecer toda la aplicación',
    '¿Seguro? Toca otra vez para borrar TODO. No se puede deshacer.',
    resetApp);

  $('#btnExportar').addEventListener('click', exportarProgreso);

  $('#inputImportar').addEventListener('change', function (ev) {
    var archivo = ev.target.files && ev.target.files[0];
    var btnImportar = $('#btnImportar');
    var f = $('#feedbackImportar');
    archivoImportar = null;
    btnImportar.disabled = true;
    if (!archivo) return;
    var lector = new FileReader();
    lector.onload = function () {
      archivoImportar = lector.result;
      btnImportar.disabled = false;
      f.textContent = '';
      f.className = 'feedback';
    };
    lector.onerror = function () {
      f.textContent = 'No se ha podido leer el archivo. Inténtalo otra vez.';
      f.className = 'feedback animo';
    };
    lector.readAsText(archivo);
  });

  confirmarDoble($('#btnImportar'),
    '📂 Recuperar copia',
    '¿Seguro? Toca otra vez para sustituir el progreso actual.',
    importarProgreso);

  pintarEstado();
  pintarProgresoActividades();
})();
