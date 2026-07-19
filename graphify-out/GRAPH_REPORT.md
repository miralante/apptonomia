# Graph Report - apptonomia  (2026-07-19)

## Corpus Check
- 348 files · ~370,087 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2075 nodes · 3770 edges · 352 communities (329 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3463cd5e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Keyboard Typing Activity Logic
- Es Docs
- En Docs
- Chess Activity Logic
- Shop Activity Logic
- Wallet Activity Logic
- Piano Keys Activity Logic
- Numbers Activity Logic
- Tools Files
- Package
- Checkers Activity Logic
- Domino Activity Logic
- Theatre Activity Logic
- Shopping Activity Logic
- Builders Activity Logic
- Fit Activity Logic
- Word Search Activity Logic
- Visual Sudoku Activity Logic
- Blocks Activity Logic
- Clock Activity Logic
- Connect Four Activity Logic
- Emergencies Activity Logic
- Phone Numbers Activity Logic
- Dictionary Activity Logic
- Tic Tac Toe Activity Logic
- Tracing Activity Logic
- Js (Assets)
- Path Activity Logic
- Quantities Activity Logic
- Roman Numerals Activity Logic
- Spelling Activity Logic
- Double Meaning Activity Logic
- Bullying Chat Activity Logic
- Ecos Activity Logic
- Safe Chat Activity Logic
- Times Of Day Activity Logic
- Patterns Activity Logic
- Whats Missing Activity Logic
- Where Is Activity Logic
- Words Activity Logic
- Categories Activity Logic
- Differences Activity Logic
- Friends Activity Logic
- My Body Activity Logic
- Odd One Out Activity Logic
- Post Or Not Activity Logic
- Puzzle Activity Logic
- Sentence Activity Logic
- Signs Activity Logic
- Situations Activity Logic
- Street Activity Logic
- Turns Mirrors Activity Logic
- What Do I Need Activity
- What First Activity Logic
- What To Wear Activity Logic
- Where To Store Activity Logic
- Cross Browser.js (Scripts)
- House Activity Logic
- Stories Activity Logic
- Task List Activity Logic
- App.js (Ajustes)
- Manifest
- Comedy Club Activity Logic
- Idioms Activity Logic
- My Agenda Activity Logic
- Oca Activity Logic
- Riddles Activity Logic
- Js (Assets)
- Routines Activity Logic
- Social Safety Activity Logic
- Js (Assets)
- Catch Activity Logic
- Emotions Activity Logic
- Calm Activity Logic
- Coloring Activity Logic
- Pairs Activity Logic
- Shop Activity Page
- 4. Diseño paso a paso
- Piano Keys Activity Page
- Js (Assets)
- app.js
- Tools Files
- Rename Tool Slugs.js (Scripts)
- Tools Files
- Tools Files
- Img (Assets)
- Tools Files
- Keyboard Typing Activity Data
- Tools Files
- Tools Files
- Catch Activity Data
- Clock Activity Data
- Coloring Activity Data
- Comedy Club Activity Data
- Comedy Club Activity Page
- Idioms Activity Data
- Piano Keys Activity Data
- Roman Numerals Activity Page
- Stories Activity Data
- Apptonomia
- Apptonomia
- Documentación de Apptonomia
- Roles del proyecto
- Clock Activity Page
- Coloring Activity Page
- Differences Activity Page
- Ecos Activity Page
- Emotions Activity Page
- Fit Activity Page
- Keyboard Typing Activity Page
- Numbers Activity Page
- Phone Numbers Activity Page
- Quantities Activity Page
- Sentence Activity Page
- Technical information
- Guide for professionals and families
- app.js
- app.js
- app.js
- i18n-split.js
- app.js
- i18n-keys-smoke.js
- Guía rápida de uso
- i18n-safe-chat-fix.js
- i18n-repair-ui-keys.js
- Apptonomia
- equipo.md
- manifest.json
- app.js
- Los tres roles del proyecto (ES)
- 🔢 Pensar y contar — Razonamiento y matemáticas module

## God Nodes (most connected - your core abstractions)
1. `App.utils shared script module` - 18 edges
2. `App.i18n shared script module` - 18 edges
3. `App.tts shared script module` - 18 edges
4. `App.storage shared script module` - 18 edges
5. `App.feedback shared script module` - 18 edges
6. `Service worker (sw.js) registration target` - 18 edges
7. `Guía rápida de uso` - 15 edges
8. `Hidden route /equipo/ — Guía para el equipo de apoyo` - 15 edges
9. `pintarTodo()` - 14 edges
10. `renderVisual()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AGENTS.md (compatibility pointer)` --semantically_similar_to--> `agent.md (compatibility pointer)`  [INFERRED] [semantically similar]
  AGENTS.md → agent.md
- `Los tres roles del proyecto (ES)` --semantically_similar_to--> `Three project roles (End user, Support, Construction)`  [INFERRED] [semantically similar]
  CONTRIBUTING.es.md → doc/en/roles.md
- `The three project roles (EN)` --semantically_similar_to--> `Los tres roles del proyecto (ES)`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → CONTRIBUTING.es.md
- `The three project roles (EN)` --semantically_similar_to--> `Three project roles (End user, Support, Construction)`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → doc/en/roles.md
- `nuevaEscena()` --indirect_call--> `rel()`  [INFERRED]
  tools/theatre/app.js → scripts/check.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Six-module therapeutic taxonomy shared across product spec, catalog and settings progress view** — doc_en_spec_spec, doc_en_activities_activities, ajustes_index_ajustespage [INFERRED 0.85]
- **Multi-file locale loading implemented across pages** — doc_es_i18n_multifile_system, site_index, equipo_index, presentacion_index [INFERRED 0.85]
- **Hidden routes family (equipo/, presentacion/)** — doc_es_tecnico_hidden_routes, equipo_index, presentacion_index [EXTRACTED 1.00]
- **Shared board-game shell (tablero + level select + rival + help)** — tools_checkers_index_page, tools_chess_index_page, tools_connect_four_index_page, tools_domino_index_page [INFERRED 0.85]
- **Situational judgment quiz shell (situacion picto/texto + pregunta + opciones + explicacion)** — tools_friends_index_page, tools_my_body_index_page, tools_emergencies_index_page [INFERRED 0.85]
- **English-named screen-id template family (startScreen/quizScreen/endScreen, chooseLevel/chooseAnotherLevel keys)** — tools_dictionary_index_page, tools_double_meaning_index_page, tools_my_agenda_index_page [INFERRED 0.85]
- **Shared multiple-choice quiz interaction pattern (progress bar, card, options, explicación, siguiente)** — tools_odd_one_out_index, tools_patterns_index, tools_riddles_index, tools_signs_index, tools_situations_index, tools_sentence_index, tools_roman_numerals_index, tools_spelling_index [INFERRED 0.80]
- **Tools that teach online/social safety decision-making through scenario practice** — tools_safe_chat_index, tools_post_or_not_index, tools_social_safety_index, tools_situations_index [INFERRED 0.85]
- **Tools built around a grid-based 'tablero' (board) interaction** — tools_oca_index, tools_path_index, tools_puzzle_index [INFERRED 0.70]
- **Shared tool-shell scripts loaded by every activity tool (utils, i18n, tts, storage, feedback)** — assets_js_utils_module, assets_js_i18n_module, assets_js_tts_module, assets_js_storage_module, assets_js_feedback_module [INFERRED 0.85]
- **El Monedero (Wallet) tool bundles six money-literacy activities behind one shared menu/level/end-screen shell** — tools_wallet_index_contar, tools_wallet_index_pagar, tools_wallet_index_conquepago, tools_wallet_index_cambio, tools_wallet_index_hucha, tools_wallet_index_redondeo [EXTRACTED 1.00]
- **Apptonomia PWA icon set: SVG source plus 192px and 512px PNG exports, rounded-square badge with blue ring and green checkmark** — assets_img_icono_svg_icon, assets_img_icono_192_icon, assets_img_icono_512_icon [INFERRED 0.85]

## Communities (352 total, 23 thin omitted)

### Community 0 - "Keyboard Typing Activity Logic"
Cohesion: 0.10
Nodes (49): actualizarEstrellas(), actualizarGuia(), actualizarOpcionesUI(), actualizarReto(), bonito(), cargarPaso(), charEsperado(), clavesTipeables() (+41 more)

### Community 1 - "Es Docs"
Cohesion: 0.17
Nodes (26): Multi-file per-locale i18n system (strings.<locale>.js), 🎯 Puntería y manos — Coordinación y motricidad module, 📋 Mi día a día — Autonomía y hogar module, 💜 Emociones module, 💬 Lenguaje y palabras module, 🧠 Memoria y atención module, No-pressure / error-never-punishes principle, Six Therapeutic Modules system (+18 more)

### Community 2 - "En Docs"
Cohesion: 0.15
Nodes (21): agent.md (compatibility pointer), AGENTS.md (compatibility pointer), Ajustes (Settings) hidden-route page, CLAUDE.md — AI Agent Workflow, graphify usage rules, activities.md (EN) — Activity Catalog, Module 1: Coordination and motor skills, Module 2: Autonomy and home (+13 more)

### Community 3 - "Chess Activity Logic"
Cohesion: 0.14
Nodes (40): banco(), cap(), capturaDeRey(), col(), contarPiezas(), crearTablero(), destinosDeSeleccion(), destinosPuzzle() (+32 more)

### Community 4 - "Shop Activity Logic"
Cohesion: 0.14
Nodes (39): abrirActividad(), azar(), botonesSiNo(), cfgActual(), datos(), generarCompra(), guardar(), iniciarRondaQuiz() (+31 more)

### Community 5 - "Wallet Activity Logic"
Cohesion: 0.14
Nodes (34): abrirActividad(), anadirDinero(), azar(), cfgActual(), comprobar(), datos(), enBucket(), generarPar() (+26 more)

### Community 6 - "Piano Keys Activity Logic"
Cohesion: 0.14
Nodes (32): actualizarBotonGrabacion(), actualizarEstrellas(), actualizarSecuenciaLibre(), actualizarSimonUI(), bonito(), clickSimon(), crearParticulas(), frecuenciaDe() (+24 more)

### Community 7 - "Numbers Activity Logic"
Cohesion: 0.11
Nodes (20): abrirActividad(), cifras(), grupoPuntos(), guardar(), iniciarRonda(), mostrar(), mostrarExplicacion(), mostrarPista() (+12 more)

### Community 8 - "Tools Files"
Cohesion: 0.25
Nodes (31): App.dinero (money) shared script module, App.feedback shared script module, App.i18n shared script module, App.storage shared script module, App.tts shared script module, App.utils shared script module, Service worker (sw.js) registration target, Historias (Stories) tool page (+23 more)

### Community 9 - "Package"
Cohesion: 0.07
Nodes (26): author, description, devDependencies, firebase-tools, playwright, keywords, license, name (+18 more)

### Community 10 - "Checkers Activity Logic"
Cohesion: 0.22
Nodes (26): ariaCelda(), banco(), col(), contarFichas(), crearTablero(), dentro(), destinosDeSeleccion(), eligeMovimientoRival() (+18 more)

### Community 11 - "Domino Activity Logic"
Cohesion: 0.26
Nodes (26): anunciarTurno(), banco(), cerrarPartida(), colocar(), dondeEncaja(), empiezaTurnoJugador(), extremoDer(), extremoIzq() (+18 more)

### Community 12 - "Theatre Activity Logic"
Cohesion: 0.15
Nodes (18): rel(), ariaSlot(), banco(), cap(), completarEscena(), guardar(), iniciarRonda(), nuevaEscena() (+10 more)

### Community 13 - "Shopping Activity Logic"
Cohesion: 0.21
Nodes (25): anadirALista(), banco(), guardar(), iniciarLista(), iniciarSecciones(), irMenu(), irNivelesLista(), irNivelesSecciones() (+17 more)

### Community 14 - "Builders Activity Logic"
Cohesion: 0.20
Nodes (23): actualizarCeldaVisual(), actualizarContador(), capitalize(), casillasQueFaltan(), cols(), comprobarPlantilla(), crearCuadricula(), crearPaletaBloques() (+15 more)

### Community 15 - "Fit Activity Logic"
Cohesion: 0.25
Nodes (23): altura(), anchura(), bajar(), banco(), calcularAterrizaje(), celdasPieza(), cols(), encajar() (+15 more)

### Community 16 - "Word Search Activity Logic"
Cohesion: 0.22
Nodes (23): bank(), cellEl(), check(), clearSelection(), finish(), generateBoard(), giveHint(), init() (+15 more)

### Community 17 - "Visual Sudoku Activity Logic"
Cohesion: 0.21
Nodes (22): ariaCelda(), banco(), colocar(), comprobarCompletado(), elegirHueco(), elegirPicto(), esBloque(), esBloqueSombreado() (+14 more)

### Community 18 - "Blocks Activity Logic"
Cohesion: 0.23
Nodes (20): ariaCelda(), banco(), comprobarCompletado(), guardar(), iniciarRonda(), limpiarAviso(), mostrarAviso(), nombreColor() (+12 more)

### Community 19 - "Clock Activity Logic"
Cohesion: 0.22
Nodes (20): combinacionDistinta(), generarPreguntaAsociar(), generarPreguntaLeer(), guardar(), hora12(), horaAleatoria(), iniciarRonda(), minutoAleatorio() (+12 more)

### Community 20 - "Connect Four Activity Logic"
Cohesion: 0.25
Nodes (20): ariaColumna(), banco(), columnaQueCompleta(), columnasLibres(), crearTablero(), eligeColumnaRival(), filaLibre(), guardar() (+12 more)

### Community 21 - "Emergencies Activity Logic"
Cohesion: 0.25
Nodes (20): banco(), guardar(), iniciarLlamada(), iniciarReconocer(), irMenu(), mostrarExplicacionR(), ocultarTodas(), pintarEstrellas() (+12 more)

### Community 22 - "Phone Numbers Activity Logic"
Cohesion: 0.24
Nodes (20): answerQuiz(), cardSpeech(), finishQuiz(), goSummary(), init(), nextCard(), nextQuiz(), paintCardProgress() (+12 more)

### Community 23 - "Dictionary Activity Logic"
Cohesion: 0.25
Nodes (19): answerQuiz(), bank(), cardSpeech(), finishQuiz(), goStart(), init(), nextCard(), nextQuiz() (+11 more)

### Community 24 - "Tic Tac Toe Activity Logic"
Cohesion: 0.24
Nodes (18): ariaCelda(), banco(), casillaQueCompleta(), casillasLibres(), crearTablero(), eligeCasillaRival(), guardar(), iniciarPartida() (+10 more)

### Community 25 - "Tracing Activity Logic"
Cohesion: 0.20
Nodes (16): cadenaDesdePuntos(), comprobar(), continuarTrazo(), coordenadas(), distancia(), guardar(), iniciarRonda(), iniciarTrazo() (+8 more)

### Community 26 - "Js (Assets)"
Cohesion: 0.09
Nodes (29): apply(), buscar(), data(), datos(), detectar(), inicio(), lang(), locale() (+21 more)

### Community 27 - "Path Activity Logic"
Cohesion: 0.33
Nodes (16): banco(), columnas(), distancia(), filas(), guardar(), hayCamino(), iniciarRonda(), llegar() (+8 more)

### Community 28 - "Quantities Activity Logic"
Cohesion: 0.35
Nodes (16): checkAnswer(), currentCase(), formatValue(), hide(), init(), isCorrect(), moveSlider(), nextTask() (+8 more)

### Community 29 - "Roman Numerals Activity Logic"
Cohesion: 0.29
Nodes (16): answer(), buildRound(), finish(), init(), next(), paintLevels(), paintProgress(), paintReference() (+8 more)

### Community 30 - "Spelling Activity Logic"
Cohesion: 0.29
Nodes (16): answer(), bank(), finish(), goStart(), init(), maskedWord(), next(), paintLevels() (+8 more)

### Community 31 - "Double Meaning Activity Logic"
Cohesion: 0.32
Nodes (15): answer(), bank(), explanationFor(), finish(), goStart(), init(), next(), paintLevels() (+7 more)

### Community 32 - "Bullying Chat Activity Logic"
Cohesion: 0.32
Nodes (13): abrirChat(), burbuja(), guardar(), irMenu(), limpiarZonaRespuesta(), mostrarPantalla(), pintarAccion(), pintarEleccion() (+5 more)

### Community 33 - "Ecos Activity Logic"
Cohesion: 0.29
Nodes (14): guardar(), iniciarRonda(), nuevaSecuencia(), pintarEstrellas(), pintarNiveles(), pintarPads(), pintarProgreso(), render() (+6 more)

### Community 34 - "Safe Chat Activity Logic"
Cohesion: 0.32
Nodes (13): abrirChat(), burbuja(), guardar(), irMenu(), limpiarZonaRespuesta(), mostrarPantalla(), pintarAccion(), pintarEleccion() (+5 more)

### Community 35 - "Times Of Day Activity Logic"
Cohesion: 0.31
Nodes (14): anadirALista(), banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarColumnasVacias(), pintarEstrellas() (+6 more)

### Community 36 - "Patterns Activity Logic"
Cohesion: 0.30
Nodes (13): guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso(), render() (+5 more)

### Community 37 - "Whats Missing Activity Logic"
Cohesion: 0.30
Nodes (13): guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), ocultarUno(), pintarEstrellas(), pintarNiveles(), pintarObjetos() (+5 more)

### Community 38 - "Where Is Activity Logic"
Cohesion: 0.33
Nodes (13): banco(), cap(), generarItem(), guardar(), iniciarRonda(), ordenVisual(), pintarEstrellas(), pintarNiveles() (+5 more)

### Community 39 - "Words Activity Logic"
Cohesion: 0.33
Nodes (13): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), opcionesDistractoras(), pintarEstrellas(), pintarProgreso() (+5 more)

### Community 40 - "Categories Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 41 - "Differences Activity Logic"
Cohesion: 0.33
Nodes (12): crearRejilla(), empezarRonda(), guardar(), mostrarAyuda(), pintarContadorDiferencias(), pintarEscena(), pintarEstrellas(), pintarProgresoGlobal() (+4 more)

### Community 42 - "Friends Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 43 - "My Body Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 44 - "Odd One Out Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 45 - "Post Or Not Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 46 - "Puzzle Activity Logic"
Cohesion: 0.32
Nodes (12): banco(), colocarEn(), guardar(), iniciarRonda(), pintarEstrellas(), pintarNiveles(), pintarProgreso(), render() (+4 more)

### Community 47 - "Sentence Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 48 - "Signs Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 49 - "Situations Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 50 - "Street Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 51 - "Turns Mirrors Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), claveTipo(), construirOpciones(), guardar(), iniciarRonda(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 52 - "What Do I Need Activity"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 53 - "What First Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 54 - "What To Wear Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 55 - "Where To Store Activity Logic"
Cohesion: 0.36
Nodes (12): banco(), guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 56 - "Cross Browser.js (Scripts)"
Cohesion: 0.18
Nodes (29): bank(), distractorsFor(), finishRound(), goStart(), locale(), nameInLocale(), nextCard(), nextQuiz() (+21 more)

### Community 57 - "House Activity Logic"
Cohesion: 0.36
Nodes (11): guardar(), iniciarRonda(), pintarEstrellas(), pintarNiveles(), pintarProgreso(), pintarSlots(), render(), siguiente() (+3 more)

### Community 58 - "Stories Activity Logic"
Cohesion: 0.36
Nodes (11): guardar(), iniciarRonda(), pintarEstrellas(), pintarNiveles(), pintarProgreso(), pintarSlots(), render(), siguiente() (+3 more)

### Community 59 - "Task List Activity Logic"
Cohesion: 0.36
Nodes (11): guardar(), iniciarRonda(), pintarEstrellas(), pintarNiveles(), pintarProgreso(), pintarSlots(), render(), siguiente() (+3 more)

### Community 60 - "App.js (Ajustes)"
Cohesion: 0.25
Nodes (8): tools/dictionary activity (as consumer of word bank), Dictionary Word Bank (content/dictionary), App.i18n core module, es/en binary spots to generalize, Cultural content non-literal translation rule, I18N.md (EN) — Multilingual Architecture, Multi-file strings.<locale>.js system, Number/money/time format rule (long vs short scale, separators)

### Community 61 - "Manifest"
Cohesion: 0.05
Nodes (43): 10. Cross references, 1. Principles that are never broken, 2.1 Mandatory traits, 2.2 What the activity **must not** do, 2. How an activity should be, 3. Quick checklist of the 13 accessibility rules, 4. Step-by-step design, 5.1 Be very didactic (+35 more)

### Community 62 - "Comedy Club Activity Logic"
Cohesion: 0.40
Nodes (10): guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarProgreso(), render(), responder() (+2 more)

### Community 63 - "Idioms Activity Logic"
Cohesion: 0.40
Nodes (10): guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarProgreso(), render(), responder() (+2 more)

### Community 64 - "My Agenda Activity Logic"
Cohesion: 0.36
Nodes (10): answer(), finishRound(), nextCase(), paintLevels(), paintStars(), renderCase(), save(), showExplanation() (+2 more)

### Community 65 - "Oca Activity Logic"
Cohesion: 0.40
Nodes (10): banco(), especialesDe(), guardar(), iniciarPartida(), llegar(), pintarEstrellas(), pintarNiveles(), pintarTablero() (+2 more)

### Community 66 - "Riddles Activity Logic"
Cohesion: 0.40
Nodes (10): guardar(), iniciarRonda(), mostrarExplicacion(), mostrarPista(), pintarEstrellas(), pintarProgreso(), render(), responder() (+2 more)

### Community 68 - "Js (Assets)"
Cohesion: 0.38
Nodes (7): aria(), crearFicha(), desglose(), etiqueta(), hablado(), info(), pintarFichas()

### Community 69 - "Routines Activity Logic"
Cohesion: 0.51
Nodes (9): abrirRutina(), contarHechos(), guardar(), hechosDe(), marcarHecho(), pintarEstrellas(), pintarMenu(), pintarPasos() (+1 more)

### Community 71 - "Social Safety Activity Logic"
Cohesion: 0.40
Nodes (9): answer(), next(), paintLevels(), paintStars(), renderCase(), save(), showExplanation(), showScreen() (+1 more)

### Community 72 - "Js (Assets)"
Cohesion: 0.44
Nodes (8): alAzar(), celebrate(), encourage(), sonidoAcierto(), sonidoAnimo(), sonidosActivados(), success(), tono()

### Community 73 - "Catch Activity Logic"
Cohesion: 0.20
Nodes (24): clearHint(), createTargetEl(), currentStage(), fill(), finishRound(), hide(), onSequenceMiss(), onSequenceTap() (+16 more)

### Community 74 - "Emotions Activity Logic"
Cohesion: 0.42
Nodes (8): elegir(), guardar(), mostrar(), pintarEmociones(), respirar(), salirRespiracion(), verSemana(), volverSeleccion()

### Community 75 - "Calm Activity Logic"
Cohesion: 0.46
Nodes (7): detener(), guardar(), iniciarSesion(), pintarEstrellas(), pintarNiveles(), terminarAntes(), terminarSesion()

### Community 76 - "Coloring Activity Logic"
Cohesion: 0.46
Nodes (7): empezar(), guardar(), pintarColores(), pintarEstrellas(), pintarTarjetasDibujos(), pintarZona(), terminar()

### Community 77 - "Pairs Activity Logic"
Cohesion: 0.54
Nodes (7): destapar(), empezar(), guardar(), pintarContador(), pintarEstrellas(), pintarNiveles(), terminar()

### Community 78 - "Shop Activity Page"
Cohesion: 0.25
Nodes (8): Mis Rutinas (tool), La Tienda (tool), Shop: ¿Mucho o poco? activity, Shop: ¿Qué me queda? activity, Shop: Una compra activity, La Compra (tool), Shopping: Mi lista de la compra activity, Shopping: ¿En qué sección? activity

### Community 79 - "4. Diseño paso a paso"
Cohesion: 0.05
Nodes (43): 10. Referencias cruzadas, 1. Principios que nunca se rompen, 2.1 Rasgos obligatorios, 2.2 Lo que la actividad **no** debe hacer, 2. Cómo debe ser una actividad, 3. Checklist rápido de las 13 reglas de accesibilidad, 4. Diseño paso a paso, 5.1 Ser muy didáctico (+35 more)

### Community 80 - "Piano Keys Activity Page"
Cohesion: 0.29
Nodes (7): Parejas (tool), Piano (tool), Piano: Canciones mode, Piano: Compositor mode, Piano: Toca libre mode, Piano: Sigue la melodía mode, Piano: Simón dice mode

### Community 82 - "Js (Assets)"
Cohesion: 0.53
Nodes (3): elegirVoz(), idiomaActivo(), speak()

### Community 84 - "app.js"
Cohesion: 0.24
Nodes (18): bank(), buildHint(), check(), clearInput(), escapeHtml(), finish(), goStart(), init() (+10 more)

### Community 86 - "Tools Files"
Cohesion: 0.60
Nodes (5): ¿Lo publico? (tool), Chat Seguro (tool), Señales (tool), Situaciones (tool), Redes, intimidad y ley (tool)

### Community 88 - "Tools Files"
Cohesion: 1.00
Nodes (4): Las Damas (Checkers) Game Page, El Ajedrez (Chess) Game Page, Cuatro en Raya (Connect Four) Game Page, Dominó (Domino) Game Page

### Community 90 - "Tools Files"
Cohesion: 0.67
Nodes (4): Emergencias (Emergencies) Activity Page, Entre Amigos (Friends) Social Scenarios Quiz Page, La Casa (House) Sequencing Activity Page, Mi Cuerpo Me Avisa (My Body) Interoception Quiz Page

### Community 93 - "Img (Assets)"
Cohesion: 0.67
Nodes (3): Apptonomia PWA icon 192x192, Apptonomia PWA icon 512x512, Apptonomia PWA icon vector source (SVG)

### Community 94 - "Tools Files"
Cohesion: 1.00
Nodes (3): Diccionario (Dictionary) Activity Page, Doble Sentido (Double Meaning) Quiz Page, Mi agenda (My Agenda) Planning Quiz Page

### Community 97 - "Tools Files"
Cohesion: 0.67
Nodes (3): La Oca (tool), El Camino (tool), Puzzle (tool)

### Community 99 - "Tools Files"
Cohesion: 1.00
Nodes (3): ¿Qué no encaja? (tool), Patrones (tool), Adivinanzas (tool)

### Community 145 - "Apptonomia"
Cohesion: 0.50
Nodes (4): Apptonomia, 📚 Documentation, 📄 Other repo documents, 👥 Roles in the project

### Community 146 - "Apptonomia"
Cohesion: 0.50
Nodes (4): Apptonomia, 📚 Documentación, 📄 Otros documentos del repo, 👥 Roles en el proyecto

### Community 147 - "Documentación de Apptonomia"
Cohesion: 0.67
Nodes (3): Documentación de Apptonomia, 📂 Estructura de la documentación, 🧭 Por dónde empezar según tu perfil

### Community 148 - "Roles del proyecto"
Cohesion: 0.67
Nodes (3): 🗺️ Por dónde empezar, según tu perfil, 🤝 Proyecto multidisciplinar, Roles del proyecto

### Community 312 - "Technical information"
Cohesion: 0.05
Nodes (42): 10. Recipe: adding a new therapeutic module (area), 11. PWA and service worker, 12.1 Local server, 12.2 Syntax and structure checks, 12.3 Smoke test, 12.4 Cross-browser and cross-device test, 12.5 Deployment, 12. Execution, verification and deployment (+34 more)

### Community 314 - "Guide for professionals and families"
Cohesion: 0.06
Nodes (33): Activities by therapeutic goal, Activity selection, Adaptations, Audio doesn't work, Credits, Data, Developing fine motor skills, Difficulty level (+25 more)

### Community 316 - "app.js"
Cohesion: 0.23
Nodes (20): bank(), clearHint(), drawSegment(), fill(), fillShape(), finish(), goStart(), init() (+12 more)

### Community 317 - "app.js"
Cohesion: 0.36
Nodes (12): banco(), claveTipo(), construirOpciones(), guardar(), iniciarRonda(), pintarEstrellas(), pintarNiveles(), pintarProgreso() (+4 more)

### Community 318 - "app.js"
Cohesion: 0.16
Nodes (37): answerOptions(), backFromQuiz(), checkAnswer(), decomposeRound(), divideRound(), dotRow(), equationText(), fill() (+29 more)

### Community 319 - "i18n-split.js"
Cohesion: 0.36
Nodes (9): compareShapes(), escString(), indent(), loadData(), refactor(), renderNeutral(), renderStrings(), shape() (+1 more)

### Community 320 - "app.js"
Cohesion: 0.50
Nodes (8): cargarProgreso(), empezarRonda(), guardarProgreso(), init(), mostrarComplecion(), mostrarSelectorNiveles(), mostrarSituacion(), seleccionarOpcion()

### Community 321 - "i18n-keys-smoke.js"
Cohesion: 0.48
Nodes (5): clavesEnUso(), extractRegisteredKeys(), loadAppKeys(), loadHtmlKeys(), validar()

### Community 322 - "Guía rápida de uso"
Cohesion: 0.09
Nodes (23): 1. Entrar en la aplicación, Cambiar el idioma, Configuración personal, ✅ Cuando aciertas, 🔶 Cuando no es correcto, Cómo funciona el audio, Elegir una actividad, En actividades con niveles (+15 more)

### Community 323 - "i18n-safe-chat-fix.js"
Cohesion: 0.70
Nodes (4): applySufijos(), loadData(), main(), renderData()

### Community 328 - "Apptonomia"
Cohesion: 0.12
Nodes (17): 1. Abrir la aplicación, 2. Elegir una actividad, 3. Cambiar el idioma, ✅ Accesible para todos, Actividades destacadas, Apptonomia, Características principales, Créditos y licencia (+9 more)

### Community 330 - "equipo.md"
Cohesion: 0.26
Nodes (4): Therapeutic objective coverage taxonomy, Local progress/storage contract (estrellas, completado, localStorage only), 13 mandatory accessibility rules for new activities, PWA update notice (controllerchange detection)

### Community 332 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, lang, name, scope, short_name (+2 more)

### Community 333 - "app.js"
Cohesion: 0.33
Nodes (8): importProgress(), renderActivityProgress(), renderPreferences(), renderState(), resetApp(), resetPerson(), savePreference(), validateBackup()

### Community 337 - "Los tres roles del proyecto (ES)"
Cohesion: 1.00
Nodes (3): Los tres roles del proyecto (ES), The three project roles (EN), Three project roles (End user, Support, Construction)

### Community 340 - "🔢 Pensar y contar — Razonamiento y matemáticas module"
Cohesion: 0.67
Nodes (3): 🔢 Pensar y contar — Razonamiento y matemáticas module, Pairs/Parejas as the canonical activity code example, Parejas / Pairs (therapeutic activity, canonical code example)

## Knowledge Gaps
- **264 isolated node(s):** `name`, `short_name`, `description`, `lang`, `start_url` (+259 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Guide to creating activities / tools` connect `Manifest` to `equipo.md`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Guía para crear actividades / herramientas` connect `4. Diseño paso a paso` to `equipo.md`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `short_name`, `description` to the rest of the system?**
  _264 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Keyboard Typing Activity Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.1003921568627451 - nodes in this community are weakly interconnected._
- **Should `Chess Activity Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.140534262485482 - nodes in this community are weakly interconnected._
- **Should `Shop Activity Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.13658536585365855 - nodes in this community are weakly interconnected._
- **Should `Wallet Activity Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.14444444444444443 - nodes in this community are weakly interconnected._