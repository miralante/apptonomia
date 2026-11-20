// Smoke suite of the scaffold. Keep these tests and add the app's own flows.
'use strict';

const { test, expect } = require('./playwright.js');

/* Fails the test on any console error or uncaught exception of the page. */
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  return errors;
}

test('home renders the shared header and footer, with no errors', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('./');
  await expect(page.locator('.suite-chrome-header .suite-chrome-name')).not.toBeEmpty();
  await expect(page.locator('.suite-chrome-footer a[href$="about/"]')).toBeVisible();
  await expect(page.locator('.suite-chrome-footer a[href$="config/"]')).toBeVisible();
  await expect(page.locator('[data-suite-stars]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('no horizontal scroll at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('./');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

for (const route of ['about/', 'legal/', 'config/']) {
  test(`${route} loads and its back link goes home`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(route);
    await expect(page.locator('h1')).not.toBeEmpty();
    await page.locator('.back-link').click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
    expect(errors).toEqual([]);
  });
}

test('an unknown deep path shows the 404 page and stays there', async ({ page }) => {
  const response = await page.goto('no/such/page');
  expect(response.status()).toBe(404);
  await expect(page.locator('main h1')).not.toBeEmpty();
  await page.waitForTimeout(500);
  expect(new URL(page.url()).pathname).toBe('/no/such/page');
  await page.locator('main a.btn').click();
  await expect(page).toHaveURL(/\/$/);
});

test('config/ clears only this app\'s data, after two steps', async ({ page }) => {
  await page.goto('config/');
  await page.evaluate(() => {
    localStorage.setItem('{{SLUG}}:stars', '7');
    localStorage.setItem('other-app:stars', '3');
  });
  await page.reload();
  await page.locator('#config-clear').click();
  await expect(page.locator('#config-confirm')).toBeVisible();
  await page.locator('#config-yes').click();
  const left = await page.evaluate(() => [localStorage.getItem('{{SLUG}}:stars'), localStorage.getItem('other-app:stars')]);
  expect(left).toEqual([null, '3']);
});

test('the service worker installs (every precache entry loads)', async ({ page }) => {
  await page.goto('./');
  /* ready resolves while the worker may still be "activating"; wait for the end. */
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active && registration.active.state === 'activated';
  }, null, { timeout: 15000 });
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open(names.find((n) => n.indexOf('{{SLUG}}-') === 0));
    return (await cache.keys()).length;
  });
  expect(cached).toBeGreaterThan(10);
});
