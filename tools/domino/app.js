/* ============================================================
   Apptonomia — Dominó Espacial (lógica)
   Actividad de visión-espacial tipo dominó con ayuda socrática.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'domino';
  var $ = App.utils.$;

  /* Estado de la aplicación */
  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var cadenaDominó = $('#cadenaDominó');
  var fichasDisponiblesEl = $('#fichasDisponibles');
  var zonaRotar = $('#zonaRotar');
  var fichaParaRotar = $('#fichaParaRotar');
  var valorNecesarioEl = $('#valorNecesario');
  var indicadorValor = $('#indicadorValor');
  var feedbackEl = $('#feedback');
  var starsEl = $('#stars');
  var contadorFichas = $('#contadorFichas');
  var progresoTexto = $('#progresoTexto');
  var modalAyuda = $('#modalAyuda');
  var consejoSocraticoEl = $('#consejoSocratico');
  var opcionesAyudaEl = $('#opcionesAyuda');

  /* Progreso persistente */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (typeof progreso.cadenasCompletadas !== 'number') progreso.cadenasCompletadas = 0;

  /* Estado del juego */
  var nivelActual = 'facil';
  var fichasDisponibles = [];
  var fichasColocadas = [];
  var fichaSeleccionada = null;
  var fichaParaColocar = null; // Ficha con rotación aplicada
  var extremoCadena = 0; // Valor del extremo derecho de la cadena

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  /* ------------------------------------------------------------
     RENDERIZADO DE FICHAS
     ------------------------------------------------------------ */
  function crearElementoFicha(ficha, esInicio) {
    var el = document.createElement('div');
    el.className = 'ficha' + (esInicio ? ' inicio' : '');
    el.dataset.id = ficha.id;
    el.setAttribute('role', 'listitem');
    el.setAttribute('tabindex', '0');
    
    if (esInicio) {
      el.setAttribute('aria-label', App.i18n.t('cadenaVacia'));
    } else {
      el.setAttribute('aria-label', App.i18n.t('ficha').replace('{n1}', ficha.izquierda).replace('{n2}', ficha.derecha));
    }
    
    // Mitad izquierda
    var mitadIzq = document.createElement('div');
    mitadIzq.className = 'mitad-ficha';
    mitadIzq.dataset.valor = ficha.izquierda;
    mitadIzq.innerHTML = DATA.renderizarPuntos(ficha.izquierda);
    el.appendChild(mitadIzq);
    
    // Mitad derecha
    var mitadDer = document.createElement('div');
    mitadDer.className = 'mitad-ficha';
    mitadDer.dataset.valor = ficha.derecha;
    mitadDer.innerHTML = DATA.renderizarPuntos(ficha.derecha);
    el.appendChild(mitadDer);
    
    return el;
  }

  function renderizarFichasDisponibles() {
    fichasDisponiblesEl.innerHTML = '';
    
    fichasDisponibles.forEach(function(ficha, index) {
      var el = crearElementoFicha(ficha, false);
      el.classList.add('disponible');
      el.dataset.index = index;
      
      if (!ficha.colocada) {
        el.addEventListener('click', function() { seleccionarFicha(index); });
        el.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            seleccionarFicha(index);
          }
        });
      } else {
        el.classList.add('colocada');
      }
      
      fichasDisponiblesEl.appendChild(el);
    });
  }

  function renderizarCadena() {
    // Mantener la ficha de inicio
    var inicioEl = $('#fichaInicio');
    cadenaDominó.innerHTML = '';
    cadenaDominó.appendChild(inicioEl);
    
    // Añadir fichas colocadas
    fichasColocadas.forEach(function(ficha) {
      var el = crearElementoFicha(ficha, false);
      el.classList.add('colocada');
      cadenaDominó.appendChild(el);
    });
    
    actualizarIndicadorValor();
  }

  function actualizarIndicadorValor() {
    if (fichasColocadas.length === 0) {
      valorNecesarioEl.textContent = extremoCadena;
      indicadorValor.style.background = 'var(--mod-coordinacion-suave)';
    } else {
      valorNecesarioEl.textContent = extremoCadena;
      indicadorValor.style.background = extremoCadena === 0 ? 'var(--color-superficie)' : 'var(--mod-coordinacion-suave)';
    }
  }

  /* ------------------------------------------------------------
     SELECCIÓN Y ROTACIÓN DE FICHAS
     ------------------------------------------------------------ */
  function seleccionarFicha(index) {
    fichaSeleccionada = fichasDisponibles[index];
    fichaParaColocar = {
      id: fichaSeleccionada.id,
      izquierda: fichaSeleccionada.izquierda,
      derecha: fichaSeleccionada.derecha
    };
    
    // Mostrar zona de rotación
    mostrarZonaRotacion();
    
    // Resaltar ficha seleccionada
    var fichas = fichasDisponiblesEl.querySelectorAll('.ficha');
    fichas.forEach(function(f) { f.classList.remove('seleccionada'); });
    fichas[index].classList.add('seleccionada');
  }

  function mostrarZonaRotacion() {
    zonaRotar.classList.remove('oculto');
    renderizarFichaParaRotar();
  }

  function ocultarZonaRotacion() {
    zonaRotar.classList.add('oculto');
    fichaSeleccionada = null;
    fichaParaColocar = null;
    
    // Quitar selección visual
    var fichas = fichasDisponiblesEl.querySelectorAll('.ficha');
    fichas.forEach(function(f) { f.classList.remove('seleccionada'); });
  }

  function renderizarFichaParaRotar() {
    fichaParaRotar.innerHTML = '';
    
    var mitadIzq = document.createElement('div');
    mitadIzq.className = 'mitad-ficha';
    mitadIzq.dataset.valor = fichaParaColocar.izquierda;
    mitadIzq.innerHTML = DATA.renderizarPuntos(fichaParaColocar.izquierda);
    fichaParaRotar.appendChild(mitadIzq);
    
    var mitadDer = document.createElement('div');
    mitadDer.className = 'mitad-ficha';
    mitadDer.dataset.valor = fichaParaColocar.derecha;
    mitadDer.innerHTML = DATA.renderizarPuntos(fichaParaColocar.derecha);
    fichaParaRotar.appendChild(mitadDer);
    
    fichaParaRotar.setAttribute('aria-label', 
      App.i18n.t('ficha').replace('{n1}', fichaParaColocar.izquierda).replace('{n2}', fichaParaColocar.derecha));
  }

  function rotarIzquierda() {
    // Intercambiar izquierda y derecha
    var temp = fichaParaColocar.izquierda;
    fichaParaColocar.izquierda = fichaParaColocar.derecha;
    fichaParaColocar.derecha = temp;
    renderizarFichaParaRotar();
    App.tts.speak(fichaParaColocar.izquierda + ' - ' + fichaParaColocar.derecha);
  }

  function rotarDerecha() {
    rotarIzquierda(); // En dominó, izquierda y derecha son simétricos
  }

  /* ------------------------------------------------------------
     COLOCAR FICHAS EN LA CADENA
     ------------------------------------------------------------ */
  function intentarColocar() {
    if (!fichaParaColocar) return;
    
    // Verificar si la ficha encaja
    var valorIzq = fichaParaColocar.izquierda;
    var valorDer = fichaParaColocar.derecha;
    
    // La ficha encaja si alguno de sus valores coincide con el extremo
    var encajaIzquierda = valorIzq === extremoCadena;
    var encajaDerecha = valorDer === extremoCadena;
    
    if (encajaIzquierda || encajaDerecha) {
      colocarFicha(encajaIzquierda);
    } else {
      // La ficha no encaja
      mostrarError();
    }
  }

  function colocarFicha(encajaPorIzquierda) {
    // Ajustar la ficha según cómo encaja
    var fichaColocada = {
      id: fichaParaColocar.id,
      izquierda: encajaPorIzquierda ? fichaParaColocar.izquierda : fichaParaColocar.derecha,
      derecha: encajaPorIzquierda ? fichaParaColocar.derecha : fichaParaColocar.izquierda
    };
    
    // Marcar como colocada
    fichasDisponibles.forEach(function(f) {
      if (f.id === fichaColocada.id) f.colocada = true;
    });
    
    // Añadir a la cadena
    fichasColocadas.push(fichaColocada);
    
    // Actualizar extremo
    extremoCadena = encajaPorIzquierda ? fichaColocada.derecha : fichaColocada.izquierda;
    
    // Actualizar UI
    renderizarCadena();
    renderizarFichasDisponibles();
    actualizarContador();
    
    // Feedback positivo
    feedbackEl.textContent = App.i18n.t('aciertoColocar');
    feedbackEl.className = 'feedback exito';
    App.feedback.celebrar('');
    App.tts.speak(App.i18n.t('aciertoColocar'));
    
    // Ocultar zona de rotación
    zonaRotar.classList.add('oculto');
    fichaSeleccionada = null;
    fichaParaColocar = null;
    
    // Verificar si quedan fichas que encajen
    verificarFinDeJuego();
  }

  function mostrarError() {
    var fichaEl = fichaParaRotar;
    fichaEl.classList.add('incorrecta');
    setTimeout(function() { fichaEl.classList.remove('incorrecta'); }, 400);
    
    // Mostrar consejo socrático
    var consejo = DATA.getConsejoSocratico('error', { valor: extremoCadena });
    feedbackEl.textContent = consejo;
    feedbackEl.className = 'feedback animo';
    App.tts.speak(consejo);
  }

  function verificarFinDeJuego() {
    var fichasValidas = fichasDisponibles.filter(function(f) {
      return !f.colocada && (f.izquierda === extremoCadena || f.derecha === extremoCadena);
    });
    
    if (fichasValidas.length === 0 && fichasDisponibles.some(function(f) { return !f.colocada; })) {
      // Quedan fichas pero ninguna encaja
      feedbackEl.textContent = App.i18n.t('sinFichasEncajan');
      feedbackEl.className = 'feedback';
    }
  }

  function actualizarContador() {
    contadorFichas.textContent = fichasColocadas.length;
    progresoTexto.textContent = App.i18n.t('fichaColocada').replace('{n}', fichasColocadas.length);
  }

  /* ------------------------------------------------------------
     AYUDA SOCRÁTICA
     ------------------------------------------------------------ */
  function abrirAyuda() {
    modalAyuda.classList.remove('oculto');
    modalAyuda.setAttribute('aria-hidden', 'false');
    
    // Generar consejos según el estado actual
    var consejos = generarConsejosAyuda();
    consejoSocraticoEl.textContent = DATA.getConsejoSocratico('ayuda', { valor: extremoCadena });
    
    // Mostrar opciones de ayuda
    opcionesAyudaEl.innerHTML = '';
    DATA.opcionesAyuda.forEach(function(opcion) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opcion-ayuda';
      btn.textContent = opcion.texto;
      btn.dataset.accion = opcion.accion;
      btn.addEventListener('click', function() { ejecutarAccionAyuda(opcion.accion); });
      opcionesAyudaEl.appendChild(btn);
    });
    
    App.tts.speak(consejoSocraticoEl.textContent);
  }

  function cerrarAyuda() {
    modalAyuda.classList.add('oculto');
    modalAyuda.setAttribute('aria-hidden', 'true');
  }

  function generarConsejosAyuda() {
    var consejos = [];
    
    // Consejo básico sobre qué número buscar
    consejos.push(DATA.getConsejoSocratico('inicio', { valor: extremoCadena }));
    
    // Si hay fichas seleccionadas pero no se ha colocado
    if (fichaSeleccionada) {
      consejos.push(DATA.getConsejoSocratico('rotacion', { 
        valor1: fichaSeleccionada.izquierda, 
        valor2: fichaSeleccionada.derecha 
      }));
    }
    
    return consejos;
  }

  function ejecutarAccionAyuda(accion) {
    var valorBuscado = extremoCadena;
    var fichasConValor = [];
    
    fichasDisponibles.forEach(function(f) {
      if (!f.colocada && (f.izquierda === valorBuscado || f.derecha === valorBuscado)) {
        fichasConValor.push(f);
      }
    });
    
    switch (accion) {
      case 'mostrarNumero':
        App.tts.speak(App.i18n.t('ayudaNumero') + ' ' + valorBuscado);
        valorNecesarioEl.style.transform = 'scale(1.3)';
        setTimeout(function() { valorNecesarioEl.style.transform = ''; }, 500);
        break;
        
      case 'resaltarFichas':
        if (fichasConValor.length > 0) {
          App.tts.speak(App.i18n.t('ayudaResaltar').replace('{valor}', valorBuscado));
          fichasConValor.forEach(function(ficha) {
            var fichaEl = fichasDisponiblesEl.querySelector('[data-id="' + ficha.id + '"]');
            if (fichaEl) {
              fichaEl.classList.add('sugerida');
              setTimeout(function() { fichaEl.classList.remove('sugerida'); }, 2000);
            }
          });
        } else {
          App.tts.speak('No hay fichas con el número ' + valorBuscado);
        }
        break;
        
      case 'explicarRotacion':
        App.tts.speak(App.i18n.t('ayudaRotacion'));
        break;
        
      case 'cerrar':
      default:
        cerrarAyuda();
        return;
    }
    
    cerrarAyuda();
  }

  /* ------------------------------------------------------------
     NAVEGACIÓN Y EVENTOS
     ------------------------------------------------------------ */
  $('#btnInstruccion').addEventListener('click', function() {
    App.tts.speak($('#instruccion').textContent);
  });

  // Botones de dificultad
  $('#btnNivelFacil').addEventListener('click', function() { empezarJuego('facil'); });
  $('#btnNivelMedio').addEventListener('click', function() { empezarJuego('medio'); });
  $('#btnNivelDificil').addEventListener('click', function() { empezarJuego('dificil'); });

  // Controles de rotación
  $('#btnRotarIzq').addEventListener('click', rotarIzquierda);
  $('#btnRotarDer').addEventListener('click', rotarDerecha);
  $('#btnColocar').addEventListener('click', intentarColocar);
  $('#btnCancelar').addEventListener('click', ocultarZonaRotacion);

  // Herramientas
  $('#btnAyuda').addEventListener('click', abrirAyuda);
  $('#btnCerrarAyuda').addEventListener('click', cerrarAyuda);
  
  $('#btnNuevaCadena').addEventListener('click', function() {
    if (confirm(App.i18n.t('confirmNuevaCadena') || '¿Empezar una nueva cadena?')) {
      empezarJuego(nivelActual);
    }
  });

  $('#btnTerminado').addEventListener('click', terminarJuego);

  // Pantalla final
  $('#btnSeguirEncadenando').addEventListener('click', function() { empezarJuego(nivelActual); });
  $('#btnCambiarDificultad').addEventListener('click', function() {
    pantallaFinal.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
  });

  /* ------------------------------------------------------------
     INICIO Y FINAL DEL JUEGO
     ------------------------------------------------------------ */
  function empezarJuego(nivel) {
    nivelActual = nivel;
    fichaSeleccionada = null;
    fichaParaColocar = null;
    fichasColocadas = [];
    extremoCadena = Math.floor(Math.random() * (DATA.niveles[nivel].maxValor + 1));
    
    // Generar fichas para este nivel
    fichasDisponibles = DATA.getFichasParaNivel(nivel);
    
    // Asegurar que al menos una ficha encaje con el extremo inicial
    var fichasQueEncajan = fichasDisponibles.filter(function(f) {
      return f.izquierda === extremoCadena || f.derecha === extremoCadena;
    });
    
    if (fichasQueEncajan.length === 0) {
      // Añadir una ficha que encaje
      var fichaExtra = {
        id: 999,
        izquierda: extremoCadena,
        derecha: Math.floor(Math.random() * (DATA.niveles[nivel].maxValor + 1))
      };
      fichasDisponibles.push(fichaExtra);
    }
    
    // Actualizar UI
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    
    // Configurar ficha de inicio
    var inicioEl = $('#fichaInicio');
    var mitades = inicioEl.querySelectorAll('.mitad-ficha');
    mitades.forEach(function(m) {
      m.dataset.valor = extremoCadena;
      m.innerHTML = DATA.renderizarPuntos(extremoCadena);
    });
    
    renderizarCadena();
    renderizarFichasDisponibles();
    actualizarContador();
    
    // Hablar el valor inicial
    App.tts.speak(App.i18n.t('consejoInicio').replace('{valor}', extremoCadena));
  }

  function terminarJuego() {
    if (fichasColocadas.length === 0) {
      App.feedback.animo(feedbackEl);
      App.tts.speak(App.i18n.t('instruccion'));
      return;
    }
    
    progreso.estrellas += 1;
    progreso.cadenasCompletadas += 1;
    guardar();
    pintarEstrellas();
    
    // Crear vista en miniatura
    crearVistaMinatura();
    
    // Mostrar resumen
    var resumen = App.i18n.t('cadenaCompletada').replace('{n}', fichasColocadas.length);
    $('#resumenFinal').textContent = resumen;
    
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    
    App.feedback.celebrar(App.i18n.t('finalTitulo'));
  }

  function crearVistaMinatura() {
    var vistaMiniatura = $('#vistaMiniatura');
    vistaMiniatura.innerHTML = '';
    
    fichasColocadas.forEach(function(ficha) {
      var el = crearElementoFicha(ficha, false);
      vistaMiniatura.appendChild(el);
    });
  }

  /* ------------------------------------------------------------
     INICIALIZACIÓN
     ------------------------------------------------------------ */
  pintarEstrellas();
  App.i18n.apply();

})();
