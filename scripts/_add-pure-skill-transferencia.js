#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * scripts/_add-pure-skill-transferencia.js
 *
 * Adds (or replaces) the i18n key `transferencia` in the strings.es.js and
 * strings.en.js of the activities that follow the "pure-skill" vehicle
 * (SPEC §3.6.b). Idempotent: if the key already exists, replaces its value.
 *
 * Run from the repository root:
 *   node scripts/_add-pure-skill-transferencia.js
 *
 * Intentionally a one-off script. Delete after the PR is merged.
 */
'use strict';

var fs = require('fs');
var path = require('path');

var REPO = path.resolve(__dirname, '..');
var TOOLS = path.join(REPO, 'tools');

// Activities that use the pure-skill vehicle per the audit (2026-07-23).
// Excludes `stories` and `where-is`, which already declare `transferencia`.
var ACTIVITIES = [
  'blocks', 'builders', 'catch', 'checkers', 'chess', 'coloring',
  'connect-dots', 'connect-four', 'differences', 'domino', 'ecos',
  'fit', 'keyboard-typing', 'oca', 'pairs', 'path', 'piano-keys',
  'puzzle', 'tic-tac-toe', 'tracing', 'turns-mirrors', 'visual-sudoku'
];

// Short transfer lines (≤ 12 words, second person, daily-life anchor).
// Each entry is { es: '...', en: '...' }.
var TRANSFER = {
  'blocks': {
    es: 'Esto te ayuda a fijarte en cómo encajan las piezas cuando ordenas o montas cosas.',
    en: 'This helps you notice how pieces fit when you tidy or build things at home.'
  },
  'builders': {
    es: 'Esto te ayuda a imaginar y a montar cosas por ti mismo/a.',
    en: 'This helps you imagine and build things on your own.'
  },
  'catch': {
    es: 'Esto te ayuda a reaccionar rápido cuando coges cosas en movimiento.',
    en: 'This helps you react quickly when you grab moving things.'
  },
  'checkers': {
    es: 'Esto entrena tu estrategia para anticipar jugadas y movimientos.',
    en: 'This trains your strategy to anticipate plays and moves.'
  },
  'chess': {
    es: 'Esto entrena tu estrategia y tu paciencia para pensar antes de actuar.',
    en: 'This trains your strategy and patience to think before acting.'
  },
  'coloring': {
    es: 'Esto te ayuda a elegir y a mantenerte concentrado/a mientras pintas.',
    en: 'This helps you choose and stay focused while you colour.'
  },
  'connect-dots': {
    es: 'Esto te ayuda a seguir una secuencia de números y trazos en papel.',
    en: 'This helps you follow number and stroke sequences on paper.'
  },
  'connect-four': {
    es: 'Esto entrena tu estrategia para anticipar la jugada del rival.',
    en: 'This trains your strategy to anticipate your opponent\'s move.'
  },
  'differences': {
    es: 'Esto te ayuda a fijarte en los detalles cuando ordenas tu cuarto.',
    en: 'This helps you notice details when you tidy your room.'
  },
  'domino': {
    es: 'Esto te ayuda a emparejar y contar fichas en juegos de mesa.',
    en: 'This helps you match and count tiles in board games.'
  },
  'ecos': {
    es: 'Esto te ayuda a recordar secuencias de sonidos en tu día a día.',
    en: 'This helps you remember sound sequences in your day.'
  },
  'fit': {
    es: 'Esto te ayuda a encajar piezas y a organizar cosas por su forma.',
    en: 'This helps you fit pieces and sort things by shape.'
  },
  'keyboard-typing': {
    es: 'Esto te ayuda a escribir mensajes reales a la familia en el ordenador.',
    en: 'This helps you write real messages to family on the computer.'
  },
  'oca': {
    es: 'Esto te ayuda a contar casillas y a esperar tu turno en juegos.',
    en: 'This helps you count squares and wait your turn in games.'
  },
  'pairs': {
    es: 'Esto te ayuda a recordar dónde está cada cosa en casa.',
    en: 'This helps you remember where each thing is at home.'
  },
  'path': {
    es: 'Esto te ayuda a seguir indicaciones y llegar a un sitio por ti mismo/a.',
    en: 'This helps you follow directions and get somewhere on your own.'
  },
  'piano-keys': {
    es: 'Esto te ayuda a disfrutar de la música y a tocar con más confianza.',
    en: 'This helps you enjoy music and play with more confidence.'
  },
  'puzzle': {
    es: 'Esto te ayuda a fijarte en la imagen completa cuando ordenas o montas.',
    en: 'This helps you see the whole picture when you tidy or build.'
  },
  'tic-tac-toe': {
    es: 'Esto entrena tu estrategia para anticipar la jugada del rival.',
    en: 'This trains your strategy to anticipate your opponent\'s move.'
  },
  'tracing': {
    es: 'Esto te ayuda a escribir mejor en tu cuaderno.',
    en: 'This helps you write better in your notebook.'
  },
  'turns-mirrors': {
    es: 'Esto te ayuda a orientarte y a entender planos y direcciones.',
    en: 'This helps you orient yourself and understand maps and directions.'
  },
  'visual-sudoku': {
    es: 'Esto entrena tu lógica para resolver problemas de cada día.',
    en: 'This trains your logic to solve everyday problems.'
  }
};

/*
 * Strategy: in each strings.<locale>.js, locate the literal pattern
 *
 *   });    // end of the dictionary object
 *   }, 'es');   // or  }, 'en');
 *
 * and inject  "transferencia": "<value>",  as the **last** key of the
 * dictionary, immediately before `});`. We do not touch the existing key
 * list — only add or replace the value of `transferencia`. Idempotent.
 */

function escapeForQuotes(value, quote) {
  // Strings in the project use both single and double quotes depending on
  // file. We escape both to be safe, then pick the right wrapper.
  return value.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote);
}

function pickQuote(file) {
  // Detect which quote style the file uses by sampling the existing
  // dictionary. Returns the quote character to wrap the new value in.
  var src = fs.readFileSync(file, 'utf8');
  var m = src.match(/App\.i18n\.register\(\s*\{([\s\S]*?)\}\s*,\s*'(es|en)'/);
  if (!m) return null;
  var body = m[1];
  // Count: if there are more double quotes than single, file uses double.
  var dq = (body.match(/"/g) || []).length;
  var sq = (body.match(/'/g) || []).length;
  return dq >= sq ? '"' : "'";
}

function inject(slug, locale, value) {
  var file = path.join(TOOLS, slug, 'strings.' + locale + '.js');
  if (!fs.existsSync(file)) {
    console.error('  MISSING ' + file);
    return false;
  }
  var src = fs.readFileSync(file, 'utf8');
  var quote = pickQuote(file);
  if (!quote) {
    console.error('  CANT_PARSE ' + file);
    return false;
  }
  var escaped = escapeForQuotes(value, quote);

  // If `transferencia` already exists, replace its value.
  var re = new RegExp(
    '("transferencia"\\s*:\\s*)(["\'])([^"\']*?)\\2',
    'm'
  );
  if (re.test(src)) {
    var updated = src.replace(re, function (_, prefix, _q, _old) {
      return prefix + quote + escaped + quote;
    });
    if (!DRY_RUN) fs.writeFileSync(file, updated, 'utf8');
    console.log('  REPLACED ' + slug + ' [' + locale + ']');
    return true;
  }

  // Otherwise, insert it as the last key of the dictionary.
  // The dictionary ends with `}, '<locale>');` — we capture the dict's
  // closing `}` separately from the register's `, '<locale>');`.
  var insertRe = new RegExp(
    '(\\}\\s*),\\s*(\'' + locale + '\'\\s*\\)\\s*;)',
    'm'
  );
  if (!insertRe.test(src)) {
    console.error('  NO_INSERT_POINT ' + file);
    return false;
  }
  var updated2 = src.replace(insertRe, function (_match, dictClose, registerEnd) {
    // dictClose is the `}` that ends the dictionary (followed by a comma).
    // We replace it with: `,\n  "transferencia": "..."\n}` (a clean
    // comma + the new key + the same dict-close).
    var newKey = ',\n  ' + quote + 'transferencia' + quote + ': ' + quote + escaped + quote + '\n}';
    return newKey + ', ' + registerEnd;
  });
  if (!DRY_RUN) fs.writeFileSync(file, updated2, 'utf8');
  console.log('  ADDED    ' + slug + ' [' + locale + ']');
  return true;
}

var ok = 0, ko = 0;
var DRY_RUN = process.argv.indexOf('--dry-run') !== -1;
if (DRY_RUN) console.log('# DRY RUN — no files will be modified.');
console.log('Adding/replacing `transferencia` in pure-skill activities...');
ACTIVITIES.forEach(function (slug) {
  var tr = TRANSFER[slug];
  if (!tr) { ko++; console.error('NO_TRANSFER_DEFINED ' + slug); return; }
  if (inject(slug, 'es', tr.es)) ok++; else ko++;
  if (inject(slug, 'en', tr.en)) ok++; else ko++;
});
console.log('Done. ok=' + ok + ' ko=' + ko);
process.exit(ko === 0 ? 0 : 1);