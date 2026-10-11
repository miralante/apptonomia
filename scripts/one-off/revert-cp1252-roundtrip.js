#!/usr/bin/env node
/* one-off/revert-cp1252-roundtrip.js

   DESHACE el daño de reescribir el HTML con PowerShell 5.1.

   Qué pasó: para subir el `?v=` del componente se hizo
   `Get-Content -Raw` + `WriteAllText(UTF8)` en las seis páginas.
   PowerShell 5.1 lee un fichero SIN BOM con la página de códigos del
   sistema (cp1252), así que cada byte UTF-8 se convirtió en el carácter
   que cp1252 asigna a ese byte, y al escribirlo de vuelta en UTF-8 cada
   acento se convirtió en dos caracteres: `é` pasó a `Ã©`.

   La cadena intermedia S es lo que se leyó, y el fichero original eran
   los bytes de S codificados en cp1252. Por eso deshacer es codificar S
   en cp1252, no en UTF-8: `latin1` de Node vale para 0x00-0xFF pero NO
   para el tramo alto de cp1252, así que hace falta el mapa explícito de
   los 27 signos que cp1252 coloca por encima de U+00FF.

   Falla en voz alta si aparece un carácter que cp1252 no puede
   representar: significaría que el fichero tenía texto ya correcto
   mezclado y que deshacer a ciegas lo empeoraría. */
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

/* Los signos de cp1252 que ocupan 0x80-0x9F, donde difieren de Latin-1.
   Los cinco bytes sin definir (0x81, 0x8D, 0x8F, 0x90, 0x9D) se
   devuelven a sí mismos y se caen en el `c <= 0xFF` de abajo. */
const CP1252_HIGH = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x86], [0x2020, 0x87], [0x2021, 0x88], [0x02c6, 0x89],
  [0x2030, 0x8a], [0x0160, 0x8b], [0x0152, 0x8c], [0x017d, 0x8e],
  [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93], [0x201d, 0x94],
  [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97], [0x02dc, 0x98],
  [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b], [0x0153, 0x9c],
  [0x017e, 0x9e], [0x0178, 0x9f],
]);

let fixed = 0;
for (const page of PAGES) {
  const file = path.join(ROOT, page);
  const current = fs.readFileSync(file);
  const intermediate = current.toString('utf8');   // S

  if (intermediate.indexOf('\uFFFD') !== -1) {
    console.log(`\u2717 ${page}: hay U+FFFD, la informaci\u00F3n ya se perdi\u00F3; no se toca`);
    process.exitCode = 1;
    continue;
  }

  const out = Buffer.alloc(intermediate.length);
  let at = 0;
  for (const ch of intermediate) {
    const c = ch.codePointAt(0);
    if (c <= 0xff) {
      out[at++] = c;
    } else if (CP1252_HIGH.has(c)) {
      out[at++] = CP1252_HIGH.get(c);
    } else {
      console.log(
        `\u2717 ${page}: aparece U+${c.toString(16).toUpperCase()} ("${ch}"), ` +
        'que cp1252 no representa. El fichero mezcla texto ya correcto; ' +
        'deshacer a ciegas lo empeoraria. Revisarlo a mano.'
      );
      process.exitCode = 1;
      at = -1;
      break;
    }
  }
  if (at === -1) continue;

  const result = out.subarray(0, at);
  const recovered = result.toString('utf8');       // debe volver a ser UTF-8 v\u00E1lido
  if (recovered.indexOf('\uFFFD') !== -1) {
    console.log(`\u2717 ${page}: los bytes recuperados no forman UTF-8 v\u00E1lido; no se escribe`);
    process.exitCode = 1;
    continue;
  }

  fs.writeFileSync(file, result);
  const before = current.length;
  console.log(
    `\u2713 ${page.padEnd(20)} ${before} bytes -> ${result.length} bytes`
  );
  fixed++;
}

console.log(`\n${fixed} fichero(s) recuperados.`);