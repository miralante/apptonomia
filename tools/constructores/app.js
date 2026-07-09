/* ============================================================
   Apptonomia — Constructores (lógica)
   Minecraft simplificado para visión-espacial y discapacidad intelectual.
   Sin niveles formales: el usuario elige crear libremente o seguir
   una plantilla. Actividad libre con estrellas por completar.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'constructores';
  var $ = App.utils.$;

  /* Estado de la aplicación */
  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var cuadricula = $('#cuadricula');
  var bloquesEl = $('#bloques');
  var feedbackEl = $('#feedback');
  var starsEl = $('#stars');
  var contadorBloques = $('#contadorBloques');
  var construccionTitulo = $('#construccionTitulo');
  var selectorPlantilla = $('#selectorPlantilla');
  var vistaMiniatura = $('#vistaMiniatura');

  /* Progreso persistente */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (typeof progreso.construcciones !== 'number') progreso.construcciones = 0;

  /* Estado del juego */
  var modoActual = 'libre'; // 'libre' o 'plantilla'
  var plantillaActual = null;
  var bloqueSeleccionado = null;
  var modoBorrar = false;
  var nivelActual = 1; // Por defecto, nivel 1
  var celdas = []; // Array de elementos td de la cuadrícula
  var gridState = []; // Estado actual de la cuadrícula (null o id del bloque)

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  /* ------------------------------------------------------------
     PANTALLA DE INICIO
     ------------------------------------------------------------ */
  function mostrarSelectorPlantilla() {
    selectorPlantilla.classList.remove('oculto');
    var cont = $('#plantillas');
    cont.innerHTML = '';

    var plantillasDisponibles = DATA.getPlantillasPorNivel(nivelActual);
    plantillasDisponibles.forEach(function(p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tarjeta-plantilla';
      btn.setAttribute('aria-label', App.i18n.t(p.nombre));

      // Preview de la plantilla
      var preview = document.createElement('div');
      preview.className = 'preview-plantilla';
      preview.style.gridTemplateColumns = 'repeat(' + p.gridSize.cols + ', 1fr)';
      preview.style.gridTemplateRows = 'repeat(' + p.gridSize.rows + ', 1fr)';

      // Reducir la matriz para el preview (mostrar solo las primeras filas/cols si es muy grande)
      var previewCols = Math.min(p.gridSize.cols, 6);
      var previewRows = Math.min(p.gridSize.rows, 4);
      
      for (var i = 0; i < previewRows; i++) {
        for (var j = 0; j < previewCols; j++) {
          var celda = document.createElement('div');
          celda.className = 'celda';
          if (p.matriz[i] && p.matriz[i][j]) {
            celda.classList.add('bloque-' + p.matriz[i][j]);
          }
          preview.appendChild(celda);
        }
      }

      var nombre = document.createElement('span');
      nombre.className = 'nombre-plantilla';
      nombre.textContent = App.i18n.t(p.nombre);

      btn.appendChild(preview);
      btn.appendChild(nombre);
      btn.addEventListener('click', function() { seleccionarPlantilla(p); });
      cont.appendChild(btn);
    });
  }

  function ocultarSelectorPlantilla() {
    selectorPlantilla.classList.add('oculto');
  }

  /* ------------------------------------------------------------
     SELECCIÓN DE MODO Y PLANTILLA
     ------------------------------------------------------------ */
  $('#btnModoLibre').addEventListener('click', function() {
    modoActual = 'libre';
    plantillaActual = null;
    var gridSize = DATA.gridSizes[nivelActual];
    empezarJuegoLibre(gridSize.cols, gridSize.rows);
  });

  $('#btnModoPlantilla').addEventListener('click', function() {
    modoActual = 'plantilla';
    mostrarSelectorPlantilla();
  });

  function seleccionarPlantilla(plantilla) {
    plantillaActual = plantilla;
    empezarJuegoConPlantilla(plantilla);
  }

  /* ------------------------------------------------------------
     CREACIÓN DE LA CUADRÍCULA
     ------------------------------------------------------------ */
  function crearCuadricula(cols, rows, plantilla) {
    cuadricula.innerHTML = '';
    cuadricula.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    
    celdas = [];
    gridState = [];

    for (var i = 0; i < rows; i++) {
      gridState[i] = [];
      for (var j = 0; j < cols; j++) {
        var celda = document.createElement('div');
        celda.className = 'celda sin-bloque';
        celda.setAttribute('role', 'gridcell');
        celda.setAttribute('tabindex', '0');
        celda.dataset.row = i;
        celda.dataset.col = j;

        // Si hay plantilla, mostrar la guía
        if (plantilla && plantilla.matriz[i] && plantilla.matriz[i][j]) {
          var bloqueId = plantilla.matriz[i][j];
          celda.dataset.bloquePlantilla = bloqueId;
          celda.classList.add('sin-bloque-plantilla');
        }

        celda.addEventListener('click', hacerClickCelda);
        celda.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hacerClickCelda.call(this, e);
          }
        });

        celdas.push(celda);
        gridState[i][j] = null;
        cuadricula.appendChild(celda);
      }
    }

    // Añadir clase para mostrar guías de plantilla
    if (plantilla) {
      cuadricula.classList.add('modo-plantilla');
    } else {
      cuadricula.classList.remove('modo-plantilla');
    }
  }

  function hacerClickCelda(e) {
    var celda = e.currentTarget || e.target;
    var row = parseInt(celda.dataset.row, 10);
    var col = parseInt(celda.dataset.col, 10);

    if (modoBorrar) {
      // Borrar el bloque de esta celda
      if (gridState[row][col]) {
        gridState[row][col] = null;
        actualizarCeldaVisual(celda, null);
        actualizarContador();
      }
    } else if (bloqueSeleccionado) {
      // Colocar o reemplazar el bloque
      gridState[row][col] = bloqueSeleccionado.id;
      actualizarCeldaVisual(celda, bloqueSeleccionado.id);
      actualizarContador();
      
      // Feedback suave
      celda.style.transform = 'scale(1.15)';
      setTimeout(function() { celda.style.transform = ''; }, 100);
    }
  }

  function actualizarCeldaVisual(celda, bloqueId) {
    // Quitar todas las clases de bloques
    celda.className = celda.className.replace(/bloque-\w+/g, '').trim();
    celda.classList.add('celda');

    if (bloqueId) {
      celda.classList.add('con-bloque', 'bloque-' + bloqueId);
      celda.classList.remove('sin-bloque', 'sin-bloque-plantilla');
      celda.setAttribute('aria-label', App.i18n.t('celdaConBloque').replace('{bloque}', App.i18n.t('bloque' + capitalize(bloqueId))));
    } else {
      celda.classList.add('sin-bloque');
      celda.removeAttribute('aria-label');
      if (modoActual === 'plantilla' && celda.dataset.bloquePlantilla) {
        celda.classList.add('sin-bloque-plantilla');
      }
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ------------------------------------------------------------
     PALETA DE BLOQUES
     ------------------------------------------------------------ */
  function crearPaletaBloques(nivel) {
    bloquesEl.innerHTML = '';
    var bloquesDisponibles = DATA.bloques[nivel];

    bloquesDisponibles.forEach(function(bloque) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bloque-btn bloque-' + bloque.id;
      btn.dataset.bloqueId = bloque.id;
      btn.setAttribute('aria-label', App.i18n.t('bloque' + capitalize(bloque.id)));
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');

      // Solo mostrar pictograma si el bloque no tiene color de fondo distintivo
      if (['piedra', 'techo', 'ladrillo', 'arena', 'nieve'].indexOf(bloque.id) !== -1) {
        var picto = document.createElement('span');
        picto.className = 'picto-bloque';
        picto.textContent = bloque.picto;
        picto.setAttribute('aria-hidden', 'true');
        btn.appendChild(picto);
      }

      btn.addEventListener('click', function() { seleccionarBloque(bloque, btn); });
      bloquesEl.appendChild(btn);
    });

    // Seleccionar el primer bloque por defecto
    if (bloquesDisponibles.length > 0) {
      seleccionarBloque(bloquesDisponibles[0], bloquesEl.querySelector('.bloque-btn'));
    }
  }

  function seleccionarBloque(bloque, btn) {
    bloqueSeleccionado = bloque;
    modoBorrar = false;
    $('#btnBorrar').classList.remove('modo-borrar-activo');

    // Actualizar UI de la paleta
    var botones = bloquesEl.querySelectorAll('.bloque-btn');
    botones.forEach(function(b) {
      b.classList.remove('seleccionado');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('seleccionado');
    btn.setAttribute('aria-checked', 'true');
  }

  /* ------------------------------------------------------------
     HERRAMIENTAS
     ------------------------------------------------------------ */
  $('#btnBorrar').addEventListener('click', function() {
    modoBorrar = !modoBorrar;
    if (modoBorrar) {
      bloqueSeleccionado = null;
      $('#btnBorrar').classList.add('modo-borrar-activo');
      // Quitar selección de bloques
      var botones = bloquesEl.querySelectorAll('.bloque-btn');
      botones.forEach(function(b) {
        b.classList.remove('seleccionado');
        b.setAttribute('aria-checked', 'false');
      });
    } else {
      $('#btnBorrar').classList.remove('modo-borrar-activo');
    }
  });

  $('#btnLimpiarTodo').addEventListener('click', function() {
    if (confirm(App.i18n.t('confirmLimpiar'))) {
      limpiarCuadricula();
    }
  });

  function limpiarCuadricula() {
    var cols = plantillaActual ? plantillaActual.gridSize.cols : DATA.gridSizes[nivelActual].cols;
    var rows = plantillaActual ? plantillaActual.gridSize.rows : DATA.gridSizes[nivelActual].rows;
    
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        gridState[i][j] = null;
        var index = i * cols + j;
        actualizarCeldaVisual(celdas[index], null);
      }
    }
    actualizarContador();
  }

  /* ------------------------------------------------------------
     INICIO DEL JUEGO
     ------------------------------------------------------------ */
  function empezarJuegoLibre(cols, rows) {
    modoActual = 'libre';
    plantillaActual = null;
    construccionTitulo.textContent = App.i18n.t('construccionLibre');
    iniciarJuego(cols, rows, null);
  }

  function empezarJuegoConPlantilla(plantilla) {
    modoActual = 'plantilla';
    plantillaActual = plantilla;
    construccionTitulo.textContent = App.i18n.t('plantillaActiva').replace('{nombre}', App.i18n.t(plantilla.nombre));
    iniciarJuego(plantilla.gridSize.cols, plantilla.gridSize.rows, plantilla);
  }

  function iniciarJuego(cols, rows, plantilla) {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    ocultarSelectorPlantilla();

    crearCuadricula(cols, rows, plantilla);
    crearPaletaBloques(nivelActual);
    actualizarContador();
  }

  function actualizarContador() {
    var count = 0;
    for (var i = 0; i < gridState.length; i++) {
      for (var j = 0; j < gridState[i].length; j++) {
        if (gridState[i][j]) count++;
      }
    }
    contadorBloques.textContent = count;
  }

  /* ------------------------------------------------------------
     FINALIZAR Y CELEBRAR
     ------------------------------------------------------------ */
  $('#btnTerminado').addEventListener('click', function() {
    terminarConstruccion();
  });

  function terminarConstruccion() {
    var numBloques = parseInt(contadorBloques.textContent, 10);

    if (numBloques === 0) {
      // No ha colocado nada, animarle amablemente
      App.feedback.animo(feedbackEl);
      App.tts.speak(App.i18n.t('instruccion'));
      return;
    }

    progreso.estrellas += 1;
    progreso.construcciones += 1;
    guardar();
    pintarEstrellas();

    // Crear vista en miniatura
    crearVistaMinatura();

    // Mostrar resumen
    var resumen;
    if (modoActual === 'plantilla') {
      resumen = App.i18n.t('resumenPlantilla').replace('{n}', numBloques);
    } else {
      resumen = App.i18n.t('resumenLibre').replace('{n}', numBloques);
    }
    $('#resumenFinal').textContent = resumen;

    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');

    App.feedback.celebrar(App.i18n.t('finalTitulo'));
  }

  function crearVistaMinatura() {
    vistaMiniatura.innerHTML = '';
    var cols = plantillaActual ? plantillaActual.gridSize.cols : DATA.gridSizes[nivelActual].cols;
    var rows = plantillaActual ? plantillaActual.gridSize.rows : DATA.gridSizes[nivelActual].rows;

    // Escalar para la miniatura
    var scaleCols = Math.max(1, Math.floor(16 / cols));
    var scaleRows = Math.max(1, Math.floor(12 / rows));

    vistaMiniatura.style.gridTemplateColumns = 'repeat(' + (cols * scaleCols) + ', 1fr)';
    vistaMiniatura.style.gridTemplateRows = 'repeat(' + (rows * scaleRows) + ', 1fr)';

    for (var i = 0; i < rows; i++) {
      for (var r = 0; r < scaleRows; r++) {
        for (var j = 0; j < cols; j++) {
          for (var c = 0; c < scaleCols; c++) {
            var miniCelda = document.createElement('div');
            miniCelda.className = 'celda';
            var bloqueId = gridState[i][j];
            if (bloqueId) {
              miniCelda.classList.add('bloque-' + bloqueId);
            } else {
              miniCelda.classList.add('sin-bloque');
            }
            vistaMiniatura.appendChild(miniCelda);
          }
        }
      }
    }
  }

  /* ------------------------------------------------------------
     NAVEGACIÓN DESDE LA PANTALLA FINAL
     ------------------------------------------------------------ */
  $('#btnSeguirCreando').addEventListener('click', function() {
    // Volver a crear con la misma configuración
    if (modoActual === 'plantilla' && plantillaActual) {
      empezarJuegoConPlantilla(plantillaActual);
    } else {
      var gridSize = DATA.gridSizes[nivelActual];
      empezarJuegoLibre(gridSize.cols, gridSize.rows);
    }
  });

  $('#btnCambiarPlantilla').addEventListener('click', function() {
    pantallaFinal.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
    mostrarSelectorPlantilla();
  });

  /* ------------------------------------------------------------
     INSTRUCCIONES CON AUDIO
     ------------------------------------------------------------ */
  $('#btnInstruccion').addEventListener('click', function() {
    App.tts.speak($('#instruccion').textContent);
  });

  /* ------------------------------------------------------------
     INICIALIZACIÓN
     ------------------------------------------------------------ */
  pintarEstrellas();

  // Aplicar textos i18n
  App.i18n.apply();

})();
