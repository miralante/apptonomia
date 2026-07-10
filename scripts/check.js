#!/usr/bin/env node
/* ============================================================
   Apptonomia — scripts/check.js
   Comprobación estructural sin dependencias (solo Node puro).
   Uso: node scripts/check.js
   Comprueba:
   1. Que todos los .js de tools/, site/ y assets/js/ parsean
      (equivalente a `node --check`).
   2. Que cada tools/<slug>/ tiene exactamente los 5 archivos
      canónicos (index.html, app.js, data.js, strings.js, styles.css).
   3. Paridad sw.js <-> disco: toda ruta de ARCHIVOS existe, y todo
      archivo de herramienta está en ARCHIVOS.
   4. Paridad de claves es/en en cada strings.js de tools/<slug>/.
   5. Paridad de catálogo: cada tools/<slug>/ tiene tarjeta en
      site/index.html (href="../tools/<slug>/") y viceversa.
   6. Paridad con equipo/: el nombre de portada (site/index.html) de
      cada actividad aparece también en equipo/index.html.
   7. Conteos sincronizados: el nº de "## Actividades (N)" en
      README.md y "(N actuales)" en SPEC.md coincide con el nº real
      de carpetas en tools/.
   8. Lint del patrón que rompió la-frase/palabras: si data.js
      separa { es, en } a nivel superior (sin porRonda de nivel
      superior) y app.js usa el literal DATA.porRonda en vez de
      banco().porRonda, es casi seguro el mismo bug (comparar contra
      undefined nunca termina la ronda).
   Salida: lista de fallos con archivo exacto. Exit code 1 si hay
   alguno, "OK (N checks)" si no.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var execFileSync = require('child_process').execFileSync;

var RAIZ = path.join(__dirname, '..');
var fallos = [];
var checks = 0;

function rel(p) {
  return path.relative(RAIZ, p).split(path.sep).join('/');
}

function listarJs(dir) {
  var out = [];
  (function recorrer(actual) {
    var entradas = fs.readdirSync(actual, { withFileTypes: true });
    entradas.forEach(function (entrada) {
      var full = path.join(actual, entrada.name);
      if (entrada.isDirectory()) {
        recorrer(full);
      } else if (entrada.isFile() && entrada.name.endsWith('.js')) {
        out.push(full);
      }
    });
  })(dir);
  return out;
}

/* --- 1. node --check en tools/, site/, assets/js/ --- */
var archivosJs = []
  .concat(listarJs(path.join(RAIZ, 'tools')))
  .concat(listarJs(path.join(RAIZ, 'site')))
  .concat(listarJs(path.join(RAIZ, 'assets', 'js')));

archivosJs.forEach(function (archivo) {
  checks += 1;
  try {
    execFileSync(process.execPath, ['--check', archivo], { stdio: 'pipe' });
  } catch (e) {
    fallos.push(rel(archivo) + ': no parsea (node --check) — ' +
      (e.stderr ? e.stderr.toString().trim().split('\n')[0] : e.message));
  }
});

/* --- 2. Anatomía estándar de tools/<slug>/ --- */
var CANONICOS = ['index.html', 'app.js', 'data.js', 'strings.js', 'styles.css'];
var toolsDir = path.join(RAIZ, 'tools');
var slugs = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter(function (e) { return e.isDirectory(); })
  .map(function (e) { return e.name; });

slugs.forEach(function (slug) {
  checks += 1;
  var dir = path.join(toolsDir, slug);
  var archivos = fs.readdirSync(dir);
  var faltan = CANONICOS.filter(function (c) { return archivos.indexOf(c) === -1; });
  var sobran = archivos.filter(function (a) { return CANONICOS.indexOf(a) === -1; });
  if (faltan.length || sobran.length) {
    var detalle = [];
    if (faltan.length) detalle.push('faltan: ' + faltan.join(', '));
    if (sobran.length) detalle.push('sobran: ' + sobran.join(', '));
    fallos.push('tools/' + slug + '/: ' + detalle.join('; '));
  }
});

/* --- 3. Paridad sw.js <-> disco --- */
checks += 1;
var swContenido = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
var matchArchivos = swContenido.match(/var ARCHIVOS = \[([\s\S]*?)\];/);
var rutasSw = [];
if (matchArchivos) {
  var re = /'([^']+)'/g;
  var m;
  while ((m = re.exec(matchArchivos[1])) !== null) {
    rutasSw.push(m[1]);
  }
} else {
  fallos.push('sw.js: no se ha encontrado el array ARCHIVOS');
}

rutasSw.forEach(function (ruta) {
  if (ruta === './') return;
  var full = path.join(RAIZ, ruta.replace(/^\.\//, ''));
  if (!fs.existsSync(full)) {
    fallos.push('sw.js: ARCHIVOS incluye ' + ruta + ' pero no existe en disco');
  }
});

slugs.forEach(function (slug) {
  CANONICOS.forEach(function (archivo) {
    var ruta = './tools/' + slug + '/' + archivo;
    if (rutasSw.indexOf(ruta) === -1) {
      fallos.push('sw.js: falta ' + ruta + ' en ARCHIVOS');
    }
  });
});

/* --- 4. Paridad de claves es/en en strings.js --- */
function clavesPlanas(obj, prefijo) {
  var out = [];
  Object.keys(obj || {}).forEach(function (k) {
    var clave = prefijo ? prefijo + '.' + k : k;
    var valor = obj[k];
    if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
      out = out.concat(clavesPlanas(valor, clave));
    } else {
      out.push(clave);
    }
  });
  return out;
}

slugs.forEach(function (slug) {
  var archivo = path.join(toolsDir, slug, 'strings.js');
  if (!fs.existsSync(archivo)) return;
  checks += 1;
  var capturado = null;
  var sandbox = {
    App: {
      i18n: {
        register: function (dict) { capturado = dict; }
      }
    },
    window: {}
  };
  sandbox.window = sandbox;
  try {
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(archivo, 'utf8'), sandbox, { filename: archivo });
  } catch (e) {
    fallos.push('tools/' + slug + '/strings.js: error al ejecutar — ' + e.message);
    return;
  }
  if (!capturado || !capturado.es || !capturado.en) {
    fallos.push('tools/' + slug + '/strings.js: no registra bloques es/en');
    return;
  }
  var clavesEs = clavesPlanas(capturado.es, '').sort();
  var clavesEn = clavesPlanas(capturado.en, '').sort();
  var soloEs = clavesEs.filter(function (c) { return clavesEn.indexOf(c) === -1; });
  var soloEn = clavesEn.filter(function (c) { return clavesEs.indexOf(c) === -1; });
  if (soloEs.length || soloEn.length) {
    var detalle = [];
    if (soloEs.length) detalle.push('solo en es: ' + soloEs.join(', '));
    if (soloEn.length) detalle.push('solo en en: ' + soloEn.join(', '));
    fallos.push('tools/' + slug + '/strings.js: ' + detalle.join('; '));
  }
});

/* --- 5. Paridad de catálogo con site/index.html --- */
checks += 1;
var siteHtml = fs.readFileSync(path.join(RAIZ, 'site', 'index.html'), 'utf8');
var slugsEnSite = [];
var reHref = /href="\.\.\/tools\/([^/]+)\/index\.html"/g;
var mh;
while ((mh = reHref.exec(siteHtml)) !== null) {
  slugsEnSite.push(mh[1]);
}

slugs.forEach(function (slug) {
  if (slugsEnSite.indexOf(slug) === -1) {
    fallos.push('site/index.html: falta la tarjeta de tools/' + slug + '/');
  }
});
slugsEnSite.forEach(function (slug) {
  if (slugs.indexOf(slug) === -1) {
    fallos.push('site/index.html: tiene tarjeta de tools/' + slug + '/ pero esa carpeta no existe');
  }
});

/* --- 6. Paridad con equipo/: el nombre de portada de cada tarjeta
   de site/index.html debe aparecer también en equipo/index.html.
   Se usa el nombre de la PORTADA (no el <title> interno de cada
   herramienta) porque algunas herramientas antiguas tienen un
   título propio más "de marca" (p.ej. comedy-club se titula "Club
   de la Comedia" pero se cataloga como "Chistes" en portada y en
   equipo) — comparar contra ese nombre da cero falsos positivos. */
checks += 1;
var equipoHtml = fs.readFileSync(path.join(RAIZ, 'equipo', 'index.html'), 'utf8');
var reTarjeta = /<a href="\.\.\/tools\/([^/]+)\/index\.html" class="tarjeta">[\s\S]*?<span class="nombre"[^>]*>([^<]+)<\/span>/g;
var mt;
while ((mt = reTarjeta.exec(siteHtml)) !== null) {
  var nombrePortada = mt[2].trim();
  if (equipoHtml.indexOf(nombrePortada) === -1) {
    fallos.push('equipo/index.html: falta "' + nombrePortada + '" (tools/' + mt[1] + '/), o el texto no coincide exactamente');
  }
}

/* --- 7. Conteos sincronizados: README.md y SPEC.md deben decir el
   número real de carpetas en tools/. --- */
checks += 1;
var readmeTxt = fs.readFileSync(path.join(RAIZ, 'README.md'), 'utf8');
var mReadme = readmeTxt.match(/## Actividades \((\d+)\)/);
if (!mReadme) {
  fallos.push('README.md: no se encontró "## Actividades (N)"');
} else if (Number(mReadme[1]) !== slugs.length) {
  fallos.push('README.md: dice ' + mReadme[1] + ' actividades, pero tools/ tiene ' + slugs.length);
}

var specTxt = fs.readFileSync(path.join(RAIZ, 'SPEC.md'), 'utf8');
var mSpec = specTxt.match(/\((\d+) actuales\)/);
if (!mSpec) {
  fallos.push('SPEC.md: no se encontró "(N actuales)"');
} else if (Number(mSpec[1]) !== slugs.length) {
  fallos.push('SPEC.md: dice ' + mSpec[1] + ' actuales, pero tools/ tiene ' + slugs.length);
}

/* --- 8. Lint del patrón que rompió la-frase/palabras: data.js con
   { es, en } de nivel superior (sin porRonda de nivel superior) +
   app.js que usa el literal DATA.porRonda en vez de banco().porRonda. */
slugs.forEach(function (slug) {
  var dataFile = path.join(toolsDir, slug, 'data.js');
  var appFile = path.join(toolsDir, slug, 'app.js');
  if (!fs.existsSync(dataFile) || !fs.existsSync(appFile)) return;
  checks += 1;
  var appTxt = fs.readFileSync(appFile, 'utf8');
  if (!/\bDATA\.porRonda\b/.test(appTxt)) return; /* no usa el patrón de riesgo */
  var sandboxD = { window: {} };
  sandboxD.window = sandboxD;
  var datos;
  try {
    vm.createContext(sandboxD);
    vm.runInContext(
      fs.readFileSync(dataFile, 'utf8') + '\nthis.__CHECK_DATA__ = (typeof DATA !== "undefined") ? DATA : undefined;',
      sandboxD, { filename: dataFile }
    );
    datos = sandboxD.__CHECK_DATA__;
  } catch (e) { return; /* si no evalúa aislado, no es de este check */ }
  if (datos && datos.es && typeof datos.es === 'object' && typeof datos.porRonda === 'undefined') {
    fallos.push('tools/' + slug + '/app.js: usa DATA.porRonda pero data.js separa { es, en } sin porRonda de nivel superior — usar banco().porRonda (ver bug real en la-frase/palabras)');
  }
});

/* --- Resultado --- */
if (fallos.length) {
  console.log('FALLOS (' + fallos.length + '):');
  fallos.forEach(function (f) { console.log('  - ' + f); });
  process.exitCode = 1;
} else {
  console.log('OK (' + checks + ' checks)');
}
