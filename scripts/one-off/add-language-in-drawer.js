#!/usr/bin/env node
/* one-off/add-language-in-drawer.js

   Añade la opción `languageInDrawer` al componente compartido
   (assets/js/locale-picker.js + assets/css/locale-picker.css) y deja las
   ocho copias del componente byte a byte idénticas, que es como las
   mantiene la suite.

   Con la opción apagada (por defecto) NO cambia nada en ninguna app: el
   desplegable sigue en la cabecera, junto al ⚙️. Con ella encendida
   (Apptonomia) el desplegable se mueve al cajón compartido como primera
   fila y el ⚙️ se queda solo en la cabecera.

   Valida los doce parches ANTES de escribir nada: si un bloque no
   aparece, o aparece dos veces, para y lo dice. */
'use strict';
const fs = require('fs');
const path = require('path');

const SUITE = path.resolve(__dirname, '..', '..', '..');

/* Ruta del componente dentro de cada proyecto. Sinonimia lo guarda en js/
   y css/, los demás en assets/. */
const JS = {
  apptonomia: 'assets/js/locale-picker.js',
  calculia: 'assets/js/locale-picker.js',
  ludia: 'assets/js/locale-picker.js',
  memofun: 'assets/js/locale-picker.js',
  okeymoney: 'assets/js/locale-picker.js',
  routime: 'assets/js/locale-picker.js',
  sinonimia: 'js/locale-picker.js',
  teclatlon: 'assets/js/locale-picker.js'
};
const CSS = {
  apptonomia: 'assets/css/locale-picker.css',
  calculia: 'assets/css/locale-picker.css',
  ludia: 'assets/css/locale-picker.css',
  memofun: 'assets/css/locale-picker.css',
  okeymoney: 'assets/css/locale-picker.css',
  routime: 'assets/css/locale-picker.css',
  sinonimia: 'css/locale-picker.css',
  teclatlon: 'assets/css/locale-picker.css'
};

const JS_PATCHES = [
  /* Cabecera del componente: documentar la opción nueva. */
  [
    "   El idioma NO vive dentro del cajón: llegar al idioma cuesta un clic,\n" +
    "   no dos. Es el modelo de Teclatlon, donde la app trae su propio cajón\n" +
    "   y este componente se limita al desplegable (`settings: false`).\n",
    "   El idioma NO vive dentro del cajón: llegar al idioma cuesta un clic,\n" +
    "   no dos. Es el modelo de Teclatlon, donde la app trae su propio cajón\n" +
    "   y este componente se limita al desplegable (`settings: false`).\n" +
    "\n" +
    "   `languageInDrawer: true` invierte esa decisión para una app concreta:\n" +
    "   el desplegable se MUEVE al cajón compartido como primera fila y el ⚙️\n" +
    "   se queda solo en la cabecera. Es lo que hace Apptonomia, en la que el\n" +
    "   propio ⚙️ ES la configuración. Las demás apps siguen con el modelo de\n" +
    "   cabecera, que es el que construye este componente por defecto.\n"
  ],
  /* La opción de configuración. */
  [
    "  var ENABLE_SETTINGS = cfg.settings !== false;\n",
    "  var ENABLE_SETTINGS = cfg.settings !== false;\n" +
    "  /* `languageInDrawer: true` deja el desplegable DENTRO del cajón\n" +
    "     compartido, como su primera fila, y el ⚙️ solo en la cabecera. Por\n" +
    "     defecto (false) el idioma se queda en #locale-picker, junto al ⚙️,\n" +
    "     y llegar a él cuesta un clic en lugar de dos. */\n" +
    "  var LANGUAGE_IN_DRAWER = cfg.languageInDrawer === true;\n"
  ],
  /* Comentario de la sección de ajustes compartidos. */
  [
    "     duplicated control. Teclatlon opts out of the gear entirely\n" +
    "     because its richer drawer is already part of its main screen.\n",
    "     duplicated control. Teclatlon opts out of the gear entirely\n" +
    "     because its richer drawer is already part of its main screen.\n" +
    "     With `languageInDrawer` the drawer DOES take the language as its\n" +
    "     first row, and the header keeps the gear alone.\n"
  ],
  /* Copy del rótulo de idioma. */
  [
    "      contrast: 'Alto contraste', successSound:",
    "      language: 'Idioma',\n      contrast: 'Alto contraste', successSound:"
  ],
  [
    "      contrast: 'High contrast', successSound:",
    "      language: 'Language',\n      contrast: 'High contrast', successSound:"
  ],
  /* Traducir el rótulo en cada render del cajón. */
  [
    "    drawer.querySelector('[data-settings-close]').setAttribute('aria-label', copy.close);\n",
    "    drawer.querySelector('[data-settings-close]').setAttribute('aria-label', copy.close);\n" +
    "    /* Solo existe con `languageInDrawer`: sin esa opción el cajón no\n" +
    "       tiene fila de idioma y no hay nada que traducir. */\n" +
    "    var languageLabel = drawer.querySelector('[data-settings-language-label]');\n" +
    "    if (languageLabel) languageLabel.textContent = copy.language;\n"
  ],
  /* Comentario de buildUI. */
  [
    "  /* Render del dropdown de idioma. Siempre en la cabecera, dentro de\n" +
    "     #locale-picker: el idioma es un control de primer nivel, no un\n" +
    "     subapartado del cajón de ajustes. */\n",
    "  /* Render del dropdown de idioma. Por defecto en la cabecera, dentro\n" +
    "     de #locale-picker: el idioma es un control de primer nivel, no un\n" +
    "     subapartado del cajón de ajustes. Con `languageInDrawer` ese mismo\n" +
    "     #locale-picker ya vive dentro del cajón y se construye ahí. */\n"
  ],
  /* Dónde cae el ⚙️. */
  [
    "    var headerLocalePicker = document.getElementById('locale-picker');\n" +
    "    if (headerLocalePicker && headerLocalePicker.parentNode) {\n" +
    "      /* Inmediatamente después del desplegable de idioma y dentro de su\n" +
    "         misma fila (que es el extremo derecho de la cabecera), el ⚙️ cae\n" +
    "         arriba a la derecha. No se toca #locale-picker: su panel se\n" +
    "         ancla a ese contenedor y un hijo más lo desplazaría. */\n" +
    "      headerLocalePicker.parentNode.insertBefore(trigger, headerLocalePicker.nextSibling);\n" +
    "    }\n",
    "    /* La fila de cabecera se captura ANTES de mover nada: con\n" +
    "       `languageInDrawer` el contenedor del desplegable se va al cajón y\n" +
    "       su parentNode deja de ser la cabecera. */\n" +
    "    var headerLocalePicker = document.getElementById('locale-picker');\n" +
    "    var headerRow = headerLocalePicker ? headerLocalePicker.parentNode : null;\n" +
    "    if (headerRow) {\n" +
    "      if (LANGUAGE_IN_DRAWER) {\n" +
    "        /* En esa fila se queda solo el ⚙️, y .suite-controls está\n" +
    "           alineada al final: sigue cayendo arriba a la derecha. */\n" +
    "        headerRow.appendChild(trigger);\n" +
    "      } else {\n" +
    "        /* Inmediatamente después del desplegable de idioma y dentro de su\n" +
    "           misma fila (que es el extremo derecho de la cabecera), el ⚙️ cae\n" +
    "           arriba a la derecha. No se toca #locale-picker: su panel se\n" +
    "           ancla a ese contenedor y un hijo más lo desplazaría. */\n" +
    "        headerRow.insertBefore(trigger, headerLocalePicker.nextSibling);\n" +
    "      }\n" +
    "    }\n"
  ],
  /* Fila de idioma como primera del cajón. */
  [
    "    drawer.innerHTML =\n" +
    "      '<div class=\"locale-settings-drawer-header\">' +\n" +
    "        '<h2 id=\"accessibility-settings-title\" data-settings-title></h2>' +\n" +
    "        '<button type=\"button\" class=\"locale-settings-close\" data-settings-close>✕</button>' +\n" +
    "      '</div>' +\n" +
    "      '<div class=\"locale-settings-drawer-body\">' +\n" +
    "        '<div class=\"locale-settings-row\"><span data-settings-theme-label></span>' +\n",
    "    /* Con `languageInDrawer` el idioma es la PRIMERA fila del cajón: es\n" +
    "       el ajuste que más se usa, y puesta arriba su panel cae sobre las\n" +
    "       filas siguientes en vez de desbordar el borde inferior. */\n" +
    "    var languageRow = LANGUAGE_IN_DRAWER\n" +
    "      ? '<div class=\"locale-settings-row locale-settings-language\" data-settings-language-row>' +\n" +
    "          '<span data-settings-language-label></span></div>'\n" +
    "      : '';\n" +
    "    drawer.innerHTML =\n" +
    "      '<div class=\"locale-settings-drawer-header\">' +\n" +
    "        '<h2 id=\"accessibility-settings-title\" data-settings-title></h2>' +\n" +
    "        '<button type=\"button\" class=\"locale-settings-close\" data-settings-close>✕</button>' +\n" +
    "      '</div>' +\n" +
    "      '<div class=\"locale-settings-drawer-body\">' +\n" +
    "        languageRow +\n" +
    "        '<div class=\"locale-settings-row\"><span data-settings-theme-label></span>' +\n"
  ],
  /* Mover el contenedor al cajón. */
  [
    "    document.body.appendChild(backdrop);\n" +
    "    document.body.appendChild(drawer);\n" +
    "    renderSettings(drawer);\n",
    "    document.body.appendChild(backdrop);\n" +
    "    document.body.appendChild(drawer);\n" +
    "    if (LANGUAGE_IN_DRAWER && headerLocalePicker) {\n" +
    "      /* Se MUEVE el contenedor que trae la app, no se reconstruye: así\n" +
    "         conserva el id que busca el resto del componente, el ancla del\n" +
    "         panel y sus escuchas. buildUI() lo rellena después, ya dentro\n" +
    "         del cajón. */\n" +
    "      drawer.querySelector('[data-settings-language-row]').appendChild(headerLocalePicker);\n" +
    "    }\n" +
    "    renderSettings(drawer);\n"
  ],
  /* Escape cierra primero el desplegable, después el cajón. */
  [
    "    document.addEventListener('keydown', function (event) {\n" +
    "      if (event.key === 'Escape' && !drawer.hidden) closeSettings(trigger, backdrop, drawer);\n" +
    "    });\n",
    "    document.addEventListener('keydown', function (event) {\n" +
    "      if (event.key !== 'Escape' || drawer.hidden) return;\n" +
    "      /* Con el desplegable dentro del cajón hay dos capas abiertas: la\n" +
    "         primera Escape cierra el desplegable y deja el cajón, como en\n" +
    "         cualquier desplegable. Este escuchador se registró antes que el\n" +
    "         del propio componente, así que cerrar el panel aquí evita que el\n" +
    "         cajón se cierre en la misma pulsación. */\n" +
    "      var openPanel = drawer.querySelector('.locale-picker-panel.is-open');\n" +
    "      if (openPanel) {\n" +
    "        var languageBtn = openPanel.previousElementSibling;\n" +
    "        openPanel.classList.remove('is-open');\n" +
    "        if (languageBtn) {\n" +
    "          languageBtn.setAttribute('aria-expanded', 'false');\n" +
    "          languageBtn.focus();\n" +
    "        }\n" +
    "        return;\n" +
    "      }\n" +
    "      closeSettings(trigger, backdrop, drawer);\n" +
    "    });\n"
  ],
  /* Comentarios del bootstrap. */
  [
    "      /* El ⚙️ se inserta antes que nada porque es hermano del\n" +
    "         #locale-picker, no hijo: el orden de los dos controles en la\n" +
    "         cabecera no depende de cuál se construya primero. */\n",
    "      /* El ⚙️ se inserta antes que nada porque es hermano del\n" +
    "         #locale-picker —o, con `languageInDrawer`, el único control de\n" +
    "         esa fila—, no hijo: el orden de los dos controles en la\n" +
    "         cabecera no depende de cuál se construya primero. */\n"
  ],
  [
    "      /* El idioma va siempre a la cabecera, tenga la app o no el ⚙️. */\n",
    "      /* El idioma va a la cabecera —o al cajón, con `languageInDrawer`—,\n" +
    "         tenga la app o no el ⚙️. buildSettings() corre antes y, cuando la\n" +
    "         fila de idioma va dentro del cajón, ya ha movido #locale-picker\n" +
    "         allí: buildUI() lo rellena donde esté. */\n"
  ]
];

const CSS_PATCHES = [
  [
    ".settings-drawer #locale-picker .locale-picker-panel {\n" +
    "  right: auto;\n" +
    "  left: 0;\n" +
    "}\n",
    ".settings-drawer #locale-picker .locale-picker-panel {\n" +
    "  right: auto;\n" +
    "  left: 0;\n" +
    "}\n" +
    "\n" +
    "/* Con `languageInDrawer` el desplegable se traslada al cajón COMPARTIDO y\n" +
    "   pasa a ser su primera fila: el rótulo arriba y el desplegable debajo,\n" +
    "   como las demás filas del cajón. La fila estira el contenedor a todo el\n" +
    "   ancho y el panel se ancla a la izquierda —igual que dentro del cajón\n" +
    "   propio de Teclatlon—, porque alineado a la derecha se saldría de la\n" +
    "   fila y su mitad quedaría bajo el fondo del cajón: visible, pero sin\n" +
    "   recibir el clic. */\n" +
    ".locale-settings-language #locale-picker { width: 100%; }\n" +
    ".locale-settings-drawer #locale-picker .locale-picker-panel { right: auto; left: 0; }\n"
  ]
];

function readNormalized(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const crlf = raw.indexOf('\r\n') !== -1;
  return { text: crlf ? raw.replace(/\r\n/g, '\n') : raw, crlf: crlf };
}

function apply(text, patches, label) {
  let out = text;
  patches.forEach(function (pair, i) {
    const find = pair[0];
    const at = out.indexOf(find);
    if (at === -1) {
      throw new Error(
        label + ': no aparece el bloque ' + (i + 1) + ' de ' + patches.length +
        '.\nBuscado:\n' + find.slice(0, 200)
      );
    }
    if (at !== out.lastIndexOf(find)) {
      throw new Error(label + ': el bloque ' + (i + 1) + ' aparece más de una vez.');
    }
    out = out.replace(find, pair[1]);
  });
  return out;
}

function writeOut(file, text, crlf) {
  fs.writeFileSync(file, crlf ? text.replace(/\n/g, '\r\n') : text, 'utf8');
}

/* 1) Parchear una copia de referencia (Apptonomia). */
const jsRef = readNormalized(path.join(SUITE, 'apptonomia', JS.apptonomia));
const cssRef = readNormalized(path.join(SUITE, 'apptonomia', CSS.apptonomia));
const jsOut = apply(jsRef.text, JS_PATCHES, 'locale-picker.js');
const cssOut = apply(cssRef.text, CSS_PATCHES, 'locale-picker.css');

/* 2) Salvaguarda: si dos proyectos NO eran idénticos antes de tocar nada,
      esta escritura se estaría pisando una versión propia. */
const targets = [];
Object.keys(JS).forEach(function (project) {
  targets.push({ file: path.join(SUITE, project, JS[project]), kind: 'js' });
  targets.push({ file: path.join(SUITE, project, CSS[project]), kind: 'css' });
});
const before = {};
targets.forEach(function (t) {
  const current = fs.readFileSync(t.file, 'utf8');
  if (before[t.kind] === undefined) before[t.kind] = current;
  else if (before[t.kind] !== current) {
    throw new Error('Las copias de ' + t.kind + ' ya no eran idénticas: ' + t.file);
  }
});

/* 3) Volcar el resultado en las ocho copias de cada fichero. */
targets.forEach(function (t) {
  writeOut(t.file, t.kind === 'js' ? jsOut : cssOut, t.kind === 'js' ? jsRef.crlf : cssRef.crlf);
});

console.log('OK  ' + targets.length + ' ficheros escritos (8 copias de js + 8 de css)');
console.log('    js  ' + jsOut.length + ' chars, css ' + cssOut.length + ' chars');