/* Sanity check for content/dictionary/{es,en}.json.
   Reports: total entries, duplicates (with locations), category list,
   tier distribution, fields present and tier range.
   Validates against the documented schema in content/dictionary/README.md. */
'use strict';

var fs = require('fs');
var path = require('path');

function report(locale, file) {
  var raw = fs.readFileSync(path.join('content', 'dictionary', file), 'utf8');
  var data = JSON.parse(raw);
  var words = data.words || [];

  var byWord = {};
  var dupes = [];
  var missingFields = 0;
  var badTier = 0;
  var fields = ['word', 'definition', 'example', 'category'];

  words.forEach(function (w, i) {
    fields.forEach(function (f) {
      if (typeof w[f] !== 'string' || w[f].trim() === '') {
        missingFields += 1;
        console.error('  Missing/empty field "' + f + '" at index ' + i + ': ' + JSON.stringify(w));
      }
    });
    var t = Number(w.tier);
    if (!(t >= 1 && t <= 4)) {
      badTier += 1;
      console.error('  Bad tier at index ' + i + ': ' + JSON.stringify(w));
    }
    var k = String(w.word).toLowerCase().trim();
    if (byWord[k]) {
      dupes.push(w.word + ' (also at index ' + byWord[k] + ' and ' + i + ')');
    } else {
      byWord[k] = i;
    }
  });

  var categories = {};
  words.forEach(function (w) { categories[w.category] = (categories[w.category] || 0) + 1; });
  var tiers = {};
  words.forEach(function (w) { tiers[w.tier] = (tiers[w.tier] || 0) + 1; });

  console.log(locale + ': ' + words.length + ' words');
  console.log('  duplicates: ' + dupes.length + (dupes.length ? ' -> ' + dupes.join('; ') : ''));
  console.log('  missing-field errors: ' + missingFields);
  console.log('  bad-tier errors: ' + badTier);
  console.log('  categories (' + Object.keys(categories).length + '):');
  Object.keys(categories).sort().forEach(function (c) {
    console.log('    ' + c + ': ' + categories[c]);
  });
  console.log('  tiers: ' + Object.keys(tiers).sort().map(function (k) { return k + '=' + tiers[k]; }).join(', '));
  console.log('');
}

report('es', 'es.json');
report('en', 'en.json');