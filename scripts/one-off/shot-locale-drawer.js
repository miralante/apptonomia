#!/usr/bin/env node
/* one-off/shot-locale-drawer.js

   Comprobación visual del cambio "el idioma dentro del ⚙️": abre la
   portada en local, hace capturas del cajón en claro y en oscuro, y
   comprueba en números que el panel del desplegable cabe DENTRO del
   cajón (si se sale, se ve pero deja de recibir el clic).

   Uso:PORT=4173 node scripts/one-off/shot-locale-drawer.js
   Escribe en test-results/, que es un directorio de artefactos. */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '..', '..', 'node_modules', 'playwright'));

const ORIGIN = `http://127.0.0.1:${process.env.PORT || 4173}`;
const OUT = path.join(__dirname, '..', '..', 'test-results');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = [];

  async function shot(name, scheme, openPanel) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(ORIGIN + '/', { waitUntil: 'load' });
    await page.click('.locale-settings-trigger');
    await page.waitForTimeout(300);
    if (openPanel) {
      await page.click('#accessibility-settings .locale-picker-btn');
      await page.waitForTimeout(250);
    }
    const geom = await page.evaluate(() => {
      const drawer = document.getElementById('accessibility-settings');
      const panel = document.querySelector('#accessibility-settings .locale-picker-panel');
      const btn = document.querySelector('#accessibility-settings .locale-picker-btn');
      const d = drawer.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      const gear = document.querySelector('.locale-settings-trigger').getBoundingClientRect();
      return {
        drawer: { x: Math.round(d.x), y: Math.round(d.y), w: Math.round(d.width), h: Math.round(d.height) },
        panel: { x: Math.round(p.x), y: Math.round(p.y), w: Math.round(p.width), h: Math.round(p.height) },
        button: { x: Math.round(b.x), w: Math.round(b.width) },
        gear: { x: Math.round(gear.x), y: Math.round(gear.y), w: Math.round(gear.width) },
        gearIsLastInRow: document.querySelector('.locale-settings-trigger')
          .parentNode.lastElementChild.classList.contains('locale-settings-trigger'),
        panelInsideDrawer: p.x >= d.x - 1 && p.x + p.width <= d.x + d.width + 1 &&
          p.y >= d.y - 1 && p.y + p.height <= d.y + d.height + 1,
        /* el botón del desplegable debe recibir el clic: el punto central
           del panel tiene que caer dentro del cajón. Solo tiene sentido con
           el panel abierto —cerrado no pinta y elementFromPoint devuelve el
           fondo del cajón, no el panel. */
        panelHitTestable: panel.classList.contains('is-open') ? (() => {
          const el = document.elementFromPoint(p.x + p.width / 2, p.y + p.height / 2);
          return !!(el && panel.contains(el));
        })() : 'n/a (panel cerrado)',
        rowLabel: document.querySelector('[data-settings-language-label]').textContent,
        drawerTitle: document.querySelector('[data-settings-title]').textContent
      };
    });
    await page.screenshot({ path: path.join(OUT, name) });
    report.push({ name, scheme, openPanel, ...geom });
    await ctx.close();
  }

  await shot('locale-drawer-light.png', 'light', false);
  await shot('locale-drawer-panel-light.png', 'light', true);
  await shot('locale-drawer-panel-dark.png', 'dark', true);

  await browser.close();

  let bad = 0;
  for (const r of report) {
    console.log(`\n${r.name}  [${r.scheme}${r.openPanel ? ' + panel' : ''}]`);
    console.log(`   cajon      x=${r.drawer.x} w=${r.drawer.w} h=${r.drawer.h}`);
    console.log(`   panel      x=${r.panel.x} y=${r.panel.y} w=${r.panel.w} h=${r.panel.h}`);
    console.log(`   boton      x=${r.button.x} w=${r.button.w}`);
    console.log(`   engranaje  x=${r.gear.x} y=${r.gear.y} w=${r.gear.w}  ultimoEnLaFila=${r.gearIsLastInRow}`);
    console.log(`   dentro del cajon: ${r.panelInsideDrawer}   recibe clic: ${r.panelHitTestable}`);
    console.log(`   textos: "${r.drawerTitle}" / "${r.rowLabel}"`);
    if (!r.panelInsideDrawer || r.panelHitTestable === false || !r.gearIsLastInRow) bad++;
  }
  console.log(`\n${bad ? '✗ ' + bad + ' captura(s) con problema' : '✓ las tres capturas están bien'}`);
  process.exit(bad ? 1 : 0);
})();