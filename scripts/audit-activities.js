#!/usr/bin/env node
/* Ad-hoc audit: how each tool complies with the new contracts.
   Does NOT modify the repo. Outputs a CSV with one row per activity
   and a summary at the end. */
'use strict';

var fs = require('fs');
var path = require('path');

var RAIZ = path.join(__dirname, '..');
var TOOLS = path.join(RAIZ, 'tools');

function rel(p) { return path.relative(RAIZ, p).split(path.sep).join('/'); }
function read(p) { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; } }
function exists(p) { try { fs.accessSync(p); return true; } catch (e) { return false; } }

var slugs = fs.readdirSync(TOOLS).filter(function (name) {
  var full = path.join(TOOLS, name);
  return fs.statSync(full).isDirectory();
}).sort();

var rows = [];

slugs.forEach(function (slug) {
  var dir = path.join(TOOLS, slug);
  var idx = read(path.join(dir, 'index.html'));
  var app = read(path.join(dir, 'app.js'));
  var data = read(path.join(dir, 'data.js'));
  var strEs = read(path.join(dir, 'strings.es.js'));
  var strEn = read(path.join(dir, 'strings.en.js'));
  var css = read(path.join(dir, 'styles.css'));

  if (!idx) { rows.push([slug, 'MISSING index.html']); return; }

  var checks = {
    instruccion_i18n: !!strEs.match(/['"]instruccion['"]\s*:/) && !!strEn.match(/['"]instruccion['"]\s*:/),
    contexto_i18n: !!strEs.match(/['"]contexto['"]\s*:/) && !!strEn.match(/['"]contexto['"]\s*:/),
    transferencia_i18n: !!strEs.match(/['"]transferencia['"]\s*:/) && !!strEn.match(/['"]transferencia['"]\s*:/),
    feedback_success: app.indexOf('App.feedback.success') >= 0 || app.indexOf('App.feedback.acierto') >= 0,
    feedback_encourage: app.indexOf('App.feedback.encourage') >= 0 || app.indexOf('App.feedback.animo') >= 0,
    mostrarPista: app.indexOf('mostrarPista') >= 0,
    mostrarExplicacion: app.indexOf('mostrarExplicacion') >= 0,
    tts_speak: app.indexOf('App.tts.speak') >= 0,
    reduced_motion_html: idx.indexOf('prefers-reduced-motion') >= 0,
    reduced_motion_css: css.indexOf('prefers-reduced-motion') >= 0,
    escena_en_html: /<img[^>]+src=.*(cocina|tienda|calle|supermercado|escena|fondo)/i.test(idx),
    banco_data_25: false
  };

  // count items in DATA.es / DATA.en and DATA.casos / DATA.banco / DATA.porRonda
  var bancoCount = 0;
  try {
    var sandbox = { DATA: {}, module: { exports: {} }, window: {}, exports: {} };
    vm_run(data, sandbox);
    var D = sandbox.DATA || {};
    ['es', 'en'].forEach(function (loc) {
      var L = D[loc] || {};
      if (Array.isArray(L.casos)) bancoCount = Math.max(bancoCount, L.casos.length);
      if (Array.isArray(L.tarjetas)) bancoCount = Math.max(bancoCount, L.tarjetas.length);
      if (Array.isArray(L.cartas)) bancoCount = Math.max(bancoCount, L.cartas.length);
      if (Array.isArray(L.preguntas)) bancoCount = Math.max(bancoCount, L.preguntas.length);
      if (Array.isArray(L.items)) bancoCount = Math.max(bancoCount, L.items.length);
      if (Array.isArray(L.elementos)) bancoCount = Math.max(bancoCount, L.elementos.length);
      if (Array.isArray(L.porRonda)) bancoCount = Math.max(bancoCount, L.porRonda.length);
    });
    if (Array.isArray(D.casos)) bancoCount = Math.max(bancoCount, D.casos.length);
    if (Array.isArray(D.preguntas)) bancoCount = Math.max(bancoCount, D.preguntas.length);
    if (Array.isArray(D.porRonda)) bancoCount = Math.max(bancoCount, D.porRonda.length);
    if (Array.isArray(D.niveles)) bancoCount = Math.max(bancoCount, D.niveles.reduce(function (a, n) {
      return a + (Array.isArray(n.casos) ? n.casos.length : 0);
    }, 0));
  } catch (e) { /* keep bancoCount=0 */ }
  checks.banco_data_25 = bancoCount >= 25;

  rows.push([
    slug,
    String(+checks.instruccion_i18n),
    String(+checks.contexto_i18n),
    String(+checks.transferencia_i18n),
    String(+checks.feedback_success),
    String(+checks.feedback_encourage),
    String(+checks.mostrarPista),
    String(+checks.mostrarExplicacion),
    String(+checks.tts_speak),
    String(+checks.reduced_motion_html || checks.reduced_motion_css),
    String(bancoCount || 0),
    String(+checks.banco_data_25)
  ]);
});

function vm_run(code, sandbox) {
  var vm = require('vm');
  vm.runInNewContext(code, sandbox, { timeout: 200 });
}

console.log('slug,instruccion,contexto,transferencia,success,encourage,mostrarPista,mostrarExplicacion,tts,reduced_motion,banco,banco>=25');
rows.forEach(function (r) { console.log(r.join(',')); });

// Summary: top problems per column
var headers = ['instruccion', 'contexto', 'transferencia', 'success', 'encourage', 'mostrarPista', 'mostrarExplicacion', 'tts', 'reduced_motion', 'banco>=25'];
console.log('\n--- SUMMARY (counts of missing per column) ---');
for (var i = 0; i < headers.length; i++) {
  var missing = rows.filter(function (r) { return r[i + 1] !== '1' && r[i + 1] !== 'true'; });
  console.log(headers[i] + ': ' + (rows.length - missing.length) + '/' + rows.length + ' OK; missing: ' +
    (missing.length ? missing.map(function (r) { return r[0]; }).slice(0, 12).join(', ') + (missing.length > 12 ? '… (' + missing.length + ' total)' : '') : 'none'));
}

// Priority: missing all of (contexto, transferencia, mostrarPista, mostrarExplicacion) = abstract drill without simulation/socratic
console.log('\n--- ACTIVITIES WITH NO SIMULATION NOR SOCRATIC (alto) ---');
rows.forEach(function (r) {
  if (r[2] === '0' && r[3] === '0' && r[6] === '0' && r[7] === '0') {
    console.log(r[0] + '  (banco=' + r[10] + ')');
  }
});

console.log('\n--- ACTIVITIES MISSING transferencia BUT PRESENT ELSEWHERE (medio) ---');
rows.forEach(function (r) {
  if (r[3] === '0') console.log(r[0] + '  (banco=' + r[10] + ', contexto=' + r[2] + ', mostrarPista=' + r[6] + ')');
});
