#!/usr/bin/env node
/* Run every project's navigation smoke test. */
'use strict';
var cp=require('child_process'),path=require('path');
var projects=['calculia','memofun','okeymoney','routime','sinonimia','teclatlon'], failed=[];
var base=process.argv[2];
projects.forEach(function(p){
  var args=[path.join(__dirname,'..',p,'scripts','navigation-check.js')];
  if(base)args.push(base);
  console.log('\n=== '+p+' ===');
  var r=cp.spawnSync(process.execPath,args,{encoding:'utf8'});
  if(r.stdout)process.stdout.write(r.stdout); if(r.stderr)process.stderr.write(r.stderr);
  if(r.status!==0)failed.push(p);
});
console.log('\n=== Resumen ===');
if(failed.length){console.error('Fallos en: '+failed.join(', '));process.exitCode=1;}
else console.log('Navegación de la suite OK');
