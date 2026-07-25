#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * scripts/_add-chat-pistas.js
 *
 * For bullying-chat and safe-chat: each "segura: false" option already
 * carries an `aviso` (the post-error encouragement message). The
 * Socratic pattern (rule 12) needs a short `pista` to show on the first
 * mistake that re-orients the person's thinking without giving away the
 * answer, and then the existing `aviso` (renamed conceptually to the
 * "explicacion") on the second.
 *
 * This script inserts a `pista` field immediately BEFORE each `aviso`
 * field in DATA.es and DATA.en blocks. The pista is generated from the
 * aviso: a short question (≤ 15 words) that captures the key doubt.
 *
 * Idempotent: skips options that already have a `pista` field.
 *
 * Run from the repo root:
 *   node scripts/_add-chat-pistas.js
 *   node scripts/_add-chat-pistas.js --dry-run
 *
 * This is a one-off script. Delete after the migration is committed.
 */
'use strict';

var fs = require('fs');
var path = require('path');

var DRY_RUN = process.argv.indexOf('--dry-run') !== -1;
if (DRY_RUN) console.log('# DRY RUN — no files will be modified.');

/*
 * Heurística para generar la pista a partir del aviso.
 *
 * Busca la primera frase imperativa/negativa del aviso y la convierte
 * en una pregunta que invita a pensar. Si no encuentra patrón,
 * usa el fallback genérico.
 *
 * Esto NO es perfecto — algunas pistas serán mejorables a mano — pero
 * establece el patrón y reduce 264 inserciones a 1 pasada.
 */

function generarPista(aviso, locale) {
  var t = aviso.trim();
  if (!t) return '';

  // Tomar la primera oración (hasta el primer ".").
  var primera = t.split('.')[0].trim();

  // Si la primera oración es muy corta, concatenar la segunda.
  if (primera.split(/\s+/).length < 8) {
    var partes = t.split('.');
    if (partes[1] && partes[1].trim().length > 0) {
      primera = (primera + '. ' + partes[1].trim()).trim();
    }
  }

  var p = primera;

  // Patrones específicos para transformar a pregunta:
  // ES: "X no hace que Y" -> "¿X hará que Y?"
  // ES: "X no arregla / no ayuda / no para" -> genérico
  // EN: "X will not Y" -> "Will X really Y?"
  if (locale === 'es') {
    // "Devolver el insulto no hace que pare" -> "¿Devolver el insulto hará que pare?"
    var m1 = p.match(/^(.+?)\s+no\s+hace\s+que\s+(.+?)[,.]?$/i);
    if (m1) {
      p = '¿' + m1[1].charAt(0).toUpperCase() + m1[1].slice(1) + ' hará que ' + m1[2] + '?';
    }
    // "X alarga / empeora Y" -> "¿X arregla Y?"
    else if (/^(.+?)\s+(alarga|empeora|no\s+arregla|no\s+ayuda)\s+(.+?)[,.]?$/i.test(p)) {
      var mm = p.match(/^(.+?)\s+(alarga|empeora|no\s+arregla|no\s+ayuda)\s+(.+?)[,.]?$/i);
      var verb = mm[2].replace(/^no\s+/i, '');  // "arregla" / "ayuda"
      p = '¿' + mm[1].charAt(0).toUpperCase() + mm[1].slice(1) + ' ' + verb + ' ' + mm[3] + '?';
    }
    // "Si obedeces a una amenaza, vendrán más" -> "Si obedeces, ¿pararán?"
    else if (/^Si\s+(obedeces|dejas|borras|pasas|calles|renuncias)\s+(.+?),\s*(.+?)[,.]?$/i.test(p)) {
      var ms = p.match(/^Si\s+(obedeces|dejas|borras|pasas|calles|renuncias)\s+(.+?),\s*(.+?)[,.]?$/i);
      p = 'Si ' + ms[1] + ', ' + ms[3].charAt(0).toLowerCase() + ms[3].slice(1) + '?';
    }
    // "No tienes que X" -> "¿Realmente tienes que X?"
    else if (/^No\s+tienes\s+que\s+(.+?)[,.]?$/i.test(p)) {
      var mn = p.match(/^No\s+tienes\s+que\s+(.+?)[,.]?$/i);
      p = '¿Realmente tienes que ' + mn[1] + '?';
    }
    // "No hace falta X" -> "¿Hace falta X?"
    else if (/^No\s+hace\s+falta\s+(.+?)[,.]?$/i.test(p)) {
      var mh = p.match(/^No\s+hace\s+falta\s+(.+?)[,.]?$/i);
      p = '¿Hace falta ' + mh[1] + '?';
    }
    // "X no hace Y" genérico -> "Si haces X, ¿Y?"
    else if (/^(.+?)\s+no\s+(.+?)[,.]?$/i.test(p)) {
      var mg = p.match(/^(.+?)\s+no\s+(.+?)[,.]?$/i);
      p = 'Si ' + mg[1] + ', ¿' + mg[2] + '?';
    }
    // Fallback universal: "¿De verdad: <primera frase>?"
    else {
      if (p.length > 0) {
        var minus = p.charAt(0).toLowerCase() + p.slice(1);
        minus = minus.replace(/[.!?]$/, '');
        p = '¿De verdad: ' + minus + '?';
      }
    }
  } else {
    // English patterns.
    var m1e = p.match(/^(.+?)\s+(will\s+not|won't|cannot|can't)\s+(.+?)[,.]?$/i);
    if (m1e) {
      p = 'Will ' + m1e[1] + ' really ' + m1e[3] + '?';
    } else if (/^If\s+you\s+(.+?),\s*(.+?)[,.]?$/i.test(p)) {
      var mse = p.match(/^If\s+you\s+(.+?),\s*(.+?)[,.]?$/i);
      p = 'If you ' + mse[1] + ', ' + mse[2].charAt(0).toLowerCase() + mse[2].slice(1) + '?';
    } else if (/^(It|That|This)\s+is\s+(better|worse)\s+(.+?)[,.]?$/i.test(p)) {
      var mbe = p.match(/^(It|That|This)\s+is\s+(better|worse)\s+(.+?)[,.]?$/i);
      p = 'Is ' + mbe[3] + ' really ' + mbe[2] + '?';
    } else {
      if (p.length > 0) {
        var minuse = p.charAt(0).toLowerCase() + p.slice(1);
        minuse = minuse.replace(/[.!?]$/, '');
        p = 'Really: ' + minuse + '?';
      }
    }
  }

  // Trim a 18 palabras.
  var palabras = p.split(/\s+/);
  if (palabras.length > 18) {
    p = palabras.slice(0, 18).join(' ') + '…';
  }

  return p;
}

function procesarArchivo(file) {
  if (!fs.existsSync(file)) {
    console.error('  MISSING ' + file);
    return { added: 0, skipped: 0, fallback: 0 };
  }
  var src = fs.readFileSync(file, 'utf8');

  var re = /(,\s*segura:\s*false,\s*\n?\s*aviso:\s*'((?:\\'|[^'])*)')/g;
  var added = 0, skipped = 0, fallback = 0;
  var updated = src.replace(re, function (match, full, avisoContent) {
    var aviso = avisoContent.replace(/\\'/g, "'");

    if (/pista:\s*'/.test(match)) { skipped++; return match; }

    var pista = generarPista(aviso, 'es');
    if (!pista) { skipped++; return match; }

    if (pista.indexOf('¿De verdad:') === 0 || pista.indexOf('Really:') === 0) {
      fallback++;
    }

    var pistaEsc = pista.replace(/'/g, "\\'");

    added++;
    var nlIdx = full.lastIndexOf('\n');
    var ind;
    if (nlIdx !== -1) {
      var lineStart = full.lastIndexOf('\n', nlIdx - 1) + 1;
      ind = full.slice(lineStart, nlIdx).match(/^\s*/)[0];
    } else {
      ind = '                  ';
    }
    return match.replace(/,\s*segura:\s*false,\s*\n?\s*aviso:/,
                       ',\n' + ind + 'segura: false,\n' + ind + "pista: '" + pistaEsc + "',\n" + ind + 'aviso:');
  });

  if (!DRY_RUN && updated !== src) {
    fs.writeFileSync(file, updated, 'utf8');
  }
  console.log((DRY_RUN ? '  (dry) ' : '  ') + file + ': added=' + added + ' skipped=' + skipped + ' fallback=' + fallback);
  return { added: added, skipped: skipped, fallback: fallback };
}

var files = [
  path.resolve('tools/bullying-chat/data.js'),
  path.resolve('tools/safe-chat/data.js')
];

var totalAdded = 0, totalSkipped = 0, totalFallback = 0;
files.forEach(function (f) {
  var r = procesarArchivo(f);
  totalAdded += r.added;
  totalSkipped += r.skipped;
  totalFallback += r.fallback;
});

console.log('Done. totalAdded=' + totalAdded + ' totalSkipped=' + totalSkipped + ' totalFallback=' + totalFallback);
process.exit(0);