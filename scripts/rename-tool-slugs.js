#!/usr/bin/env node
/* ============================================================
   Apptonomia — scripts/rename-tool-slugs.js
   Renombra tools/<old>/ a tools/<new>/ y actualiza todas las
   referencias en sw.js, site/index.html y site/strings.<locale>.js.

   No toca nada dentro de tools/<slug>/ ni de los archivos de la
   actividad (el contenido es agnóstico al slug).

   Las claves i18n ("<slug>_nombre", "<slug>_detalle") se derivan
   del slug sin guiones, igual que el resto del proyecto.

   Uso: node scripts/rename-tool-slugs.js
   Salida: lista de movimientos + reemplazos + estado final.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;

var RAIZ = path.join(__dirname, '..');

// old slug -> new slug (NO incluye ajedrez -> chess, ya hecho en el piloto)
var RENAMES = {
  'adivinanzas': 'riddles',
  'atrapa': 'catch',
  'calma': 'calm',
  'categorias': 'categories',
  'chat-acoso': 'bullying-chat',
  'chat-seguro': 'safe-chat',
  'colorear': 'coloring',
  'constructores': 'builders',
  'cuatro-en-raya': 'connect-four',
  'damas': 'checkers',
  'dichos': 'idioms',
  'diferencias': 'differences',
  'donde-esta': 'where-is',
  'donde-lo-guardo': 'where-to-store',
  'el-camino': 'path',
  'el-teatro': 'theatre',
  'emergencias': 'emergencies',
  'emociones': 'emotions',
  'encajar': 'fit',
  'entre-amigos': 'friends',
  'giros-espejos': 'turns-mirrors',
  'historias': 'stories',
  'la-calle': 'street',
  'la-casa': 'house',
  'la-compra': 'shopping',
  'la-frase': 'sentence',
  'la-tienda': 'shop',
  'lista-tareas': 'task-list',
  'lo-publico': 'post-or-not',
  'los-bloques': 'blocks',
  'mi-cuerpo-avisa': 'my-body',
  'monedero': 'wallet',
  'numeros': 'numbers',
  'palabras': 'words',
  'parejas': 'pairs',
  'partes-del-dia': 'times-of-day',
  'patrones': 'patterns',
  'piano-teclas': 'piano-keys',
  'que-falta': 'whats-missing',
  'que-me-pongo': 'what-to-wear',
  'que-necesito': 'what-do-i-need',
  'que-no-encaja': 'odd-one-out',
  'que-primero': 'what-first',
  'reloj': 'clock',
  'rutinas': 'routines',
  'senales': 'signs',
  'situaciones': 'situations',
  'sudoku-visual': 'visual-sudoku',
  'trazos': 'tracing',
  'tres-en-raya': 'tic-tac-toe'
};

function keyBase(slug) { return slug.replace(/-/g, ''); }
function toPosix(p) { return p.split(path.sep).join('/'); }

/* === 1. Mover directorios + actualizar índice git === */
var moved = 0;
Object.keys(RENAMES).forEach(function (oldSlug) {
  var newSlug = RENAMES[oldSlug];
  var oldDir = path.join(RAIZ, 'tools', oldSlug);
  var newDir = path.join(RAIZ, 'tools', newSlug);
  if (!fs.existsSync(oldDir)) {
    console.log('SKIP (no existe): ' + oldSlug);
    return;
  }
  if (fs.existsSync(newDir)) {
    console.error('CONFLICT (destino ya existe): ' + newSlug);
    process.exit(2);
  }
  fs.renameSync(oldDir, newDir);
  var newPosix = toPosix(newDir);
  try { execSync('git add "' + newPosix + '"', { cwd: RAIZ, stdio: 'pipe' }); } catch (e) {}
  try { execSync('git rm -r "' + toPosix(oldDir) + '"', { cwd: RAIZ, stdio: 'pipe' }); } catch (e) {}
  moved++;
  console.log('MOVE tools/' + oldSlug + ' -> tools/' + newSlug);
});
console.log('Movidos: ' + moved);

/* === 2. Reemplazos masivos en ficheros ===
   Hacemos el más largo primero para evitar pisar prefijos comunes. */
var pairs = Object.keys(RENAMES).map(function (k) { return [k, RENAMES[k]]; });
pairs.sort(function (a, b) { return b[0].length - a[0].length; });

function replaceInText(txt, mapping) {
  var total = 0;
  mapping.forEach(function (p) {
    var oldSlug = p[0], newSlug = p[1];
    var oldBase = keyBase(oldSlug), newBase = keyBase(newSlug);
    var pathOld = 'tools/' + oldSlug + '/';
    var pathNew = 'tools/' + newSlug + '/';
    var nombOld = oldBase + '_nombre';
    var nombNew = newBase + '_nombre';
    var detOld  = oldBase + '_detalle';
    var detNew  = newBase + '_detalle';
    if (txt.indexOf(pathOld) !== -1) {
      var c = txt.split(pathOld).length - 1;
      txt = txt.split(pathOld).join(pathNew);
      total += c;
    }
    if (txt.indexOf(nombOld) !== -1) {
      var c2 = txt.split(nombOld).length - 1;
      txt = txt.split(nombOld).join(nombNew);
      total += c2;
    }
    if (txt.indexOf(detOld) !== -1) {
      var c3 = txt.split(detOld).length - 1;
      txt = txt.split(detOld).join(detNew);
      total += c3;
    }
  });
  return { txt: txt, count: total };
}

var targets = ['sw.js', 'site/index.html', 'site/strings.es.js', 'site/strings.en.js'];
targets.forEach(function (rel) {
  var full = path.join(RAIZ, rel);
  var orig = fs.readFileSync(full, 'utf8');
  var r = replaceInText(orig, pairs);
  fs.writeFileSync(full, r.txt, 'utf8');
  console.log('UPDATED ' + rel + ' (' + r.count + ' reemplazos)');
});

console.log('Listo.');
