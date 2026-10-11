#!/usr/bin/env node
/* one-off/check-encoding-touched.js

   Comprueba que las páginas que se han reescrito siguen en UTF-8 limpio:
   sin BOM, sin doble codificación (mojibake) y con los textos con
   acento intactos.

   Existe porque al subir un `?v=` se reescribió el HTML con
   `Get-Content -Raw` + `WriteAllText` en PowerShell 5.1, que lee los
   ficheros SIN BOM como cp1252: un acento se convierte en dos caracteres
   y al volver a escribir en UTF-8 la corrupción queda fijada en el
   fichero. Ninguna puerta del proyecto lo detecta, porque el HTML sigue
   siendo HTML válido. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PAGES = [
  'index.html',
  'about/index.html',
  'legal/index.html',
  'team/index.html',
  'project/index.html',
  'dev/index.html',
];

/* Doble codificación: UTF-8 leído como cp1252. El segundo carácter cae
   en el tramo alto de cp1252, no en Latin-1, así que el rango incluye los
   signos U+2013-U+2026, U+20AC, etc. */
const MOJIBAKE =
  /[\u00C3\u00C2\u00E2\u00F0][\u0080-\u00FF\u201A\u201E\u201C\u201D\u2020\u2022\u2026\u2030\u20AC\u2122\u0152\u0160\u017D\u0178\u0192]|\uFFFD/g;

/* Cada página lleva su propio texto, así que no se buscan cadenas
   literales: se comprueba que el fichero sigue teniendo alfabeto
   acentuado (si se hubiera perdido, saldría limpio y no roto) y que trae
   el `?v=` esperado del componente. */
const ACCENTED = /[\u00C0-\u00FF]/g;
const EXPECTED_TOKEN = 'locale-picker.js?v=apptonomia-v5ac';

let failures = 0;
for (const page of PAGES) {
  const file = path.join(ROOT, page);
  const bytes = fs.readFileSync(file);
  const text = bytes.toString('utf8');
  const bom = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  const crlf = (bytes.toString('latin1').match(/\r\n/g) || []).length;
  const hits = [...new Set(text.match(MOJIBAKE) || [])];
  const accents = (text.match(ACCENTED) || []).length;
  const token = text.includes(EXPECTED_TOKEN);

  const problems = [];
  if (bom) problems.push('BOM');
  if (hits.length) problems.push('mojibake: ' + hits.join(' '));
  if (accents < 5) problems.push('casi sin acentos (' + accents + ')');
  if (!token) problems.push('falta ' + EXPECTED_TOKEN);

  console.log(
    (problems.length ? '\u2717 ' : '\u2713 ') +
    page.padEnd(20) +
    ' CRLF=' + String(crlf).padStart(4) +
    ' acentos=' + String(accents).padStart(4) +
    (problems.length ? '  ' + problems.join(' | ') : '  limpio')
  );
  if (problems.length) failures++;
}

console.log(
  failures
    ? `\u2717 ${failures} fichero(s) con problema de codificaci\u00F3n`
    : '\u2713 las 6 p\u00E1ginas est\u00E1n en UTF-8 limpio'
);
process.exit(failures ? 1 : 0);