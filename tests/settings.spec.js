const { test, expect } = require('playwright/test');

/* Same origin as tests/app.spec.js and playwright.config.js: those read
   PORT, this one read UI_PORT, so `PORT=4190 npx playwright test` started
   the server on 4190 and left these tests knocking on 4173 — six
   ERR_CONNECTION_REFUSED that had nothing to do with the pages.
   With contrast/run-all.ps1 holding 4173 that is exactly the situation
   you hit, so the name has to match. */
const ORIGIN = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${process.env.PORT || 4173}`;
const HOME = `${ORIGIN}/`;

test.describe('Apptonomia landing settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(HOME);
    await expect(page.locator('.locale-settings-trigger')).toBeVisible();
  });

  test('opens and closes the accessible settings drawer', async ({ page }) => {
    const trigger = page.locator('.locale-settings-trigger');
    const drawer = page.locator('#accessibility-settings');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toBeHidden();
    await trigger.click();
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('role', 'dialog');
    await expect(drawer).toHaveAttribute('aria-modal', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer.locator('[data-settings-title]')).toHaveText('Settings');

    // On this landing the gear IS the whole configuration, so the language
    // is the drawer's first row (locale-picker-config.js sets
    // languageInDrawer), and there is no "more settings" link duplicating
    // the app's own settings.
    await expect(drawer.locator('.locale-picker-btn')).toHaveCount(1);
    await expect(drawer.locator('[data-settings-language-row]')).toHaveCount(1);
    await expect(drawer.locator('[data-settings-language-label]')).toHaveText('🌐 Language');
    await expect(drawer.locator('[data-settings-success], [data-settings-error]')).toHaveCount(0);
    await expect(drawer.locator('[data-settings-more]')).toHaveCount(0);

    // First row on purpose: the panel drops over the rows below instead of
    // past the bottom edge of the drawer, where overflow would clip it.
    const firstRow = await drawer.locator('.locale-settings-drawer-body > *').first()
      .getAttribute('class');
    expect(firstRow).toContain('locale-settings-language');

    await drawer.locator('[data-settings-close]').click();
    await expect(drawer).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.locator('.locale-settings-backdrop').click({ position: { x: 20, y: 20 } });
    await expect(drawer).toBeHidden();

    await trigger.click();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('leaves the gear alone in the header and the language inside the drawer', async ({ page }) => {
    const placement = await page.evaluate(() => {
      const picker = document.getElementById('locale-picker');
      const gear = document.querySelector('.locale-settings-trigger');
      const drawer = document.getElementById('accessibility-settings');
      return {
        pickerInDrawer: drawer.contains(picker),
        gearRowIsSuiteControls: gear.parentNode.classList.contains('suite-controls'),
        gearRowChildren: gear.parentNode.children.length,
        parentAlignsEnd: getComputedStyle(gear.parentNode).justifyContent,
      };
    });
    expect(placement.pickerInDrawer).toBe(true);
    expect(placement.gearRowIsSuiteControls).toBe(true);
    // Only the gear is left in that row: no empty gap where the dropdown
    // used to sit.
    expect(placement.gearRowChildren).toBe(1);
    expect(placement.parentAlignsEnd).toBe('flex-end');

    // Closed drawer: the dropdown is nowhere to be seen on the page.
    await expect(page.locator('.locale-picker-btn')).toBeHidden();

    await page.locator('.locale-settings-trigger').click();
    const drawer = page.locator('#accessibility-settings');
    const languageButton = drawer.locator('.locale-picker-btn');
    const languageOptions = drawer.locator('.locale-picker-panel');
    await expect(languageButton).toBeVisible();
    await languageButton.click();
    await expect(languageOptions).toBeVisible();
    await expect(languageOptions).toBeInViewport();

    // The panel must land fully INSIDE the drawer. Anchored to the right of
    // a full-width row it overflowed the drawer and stopped taking clicks.
    const panelBox = await languageOptions.boundingBox();
    const drawerBox = await drawer.boundingBox();
    expect(panelBox.x).toBeGreaterThanOrEqual(drawerBox.x);
    expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(drawerBox.x + drawerBox.width + 1);

    // One Escape closes the dropdown only; the drawer stays open, the way
    // any nested dropdown behaves. The second one closes the drawer.
    await page.keyboard.press('Escape');
    await expect(languageOptions).toBeHidden();
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });

  test('cache-busts the mutable language runtime script', async ({ page }) => {
    await expect(page.locator('script[src*="js/script.js"]'))
      .toHaveAttribute('src', /[?&]v=apptonomia-v\d+/);
  });

  test('changes language from inside the settings drawer and persists after reload', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const tagline = page.locator('[data-i18n="home.tagline"]');
    const englishTagline = await tagline.textContent();

    // The dropdown is the drawer's first row, so the gear opens it.
    await page.locator('.locale-settings-trigger').click();
    const drawer = page.locator('#accessibility-settings');
    const languageButton = drawer.locator('.locale-picker-btn');
    const languageOptions = drawer.locator('.locale-picker-panel');
    await languageButton.click();
    await languageOptions.locator('[data-locale="es"]').click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(tagline).not.toHaveText(englishTagline);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('apptonomia:locale'))).toBe('es');

    // Both directions must apply translations immediately, not just update
    // the selected locale label or wait for a document reload.
    await languageButton.click();
    await languageOptions.locator('[data-locale="en"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(tagline).toHaveText(englishTagline);

    await languageButton.click();
    await languageOptions.locator('[data-locale="es"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(tagline).not.toHaveText(englishTagline);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(tagline).not.toHaveText(englishTagline);
    // The drawer's own labels follow the language too, once it is opened,
    // including the new language row.
    await page.locator('.locale-settings-trigger').click();
    await expect(page.locator('#accessibility-settings [data-settings-title]')).toHaveText('Ajustes');
    await expect(page.locator('#accessibility-settings [data-settings-language-label]')).toHaveText('🌐 Idioma');
  });

  test('applies theme and high contrast to the page and persists the selection', async ({ page }) => {
    const drawer = page.locator('#accessibility-settings');
    await page.locator('.locale-settings-trigger').click();

    const bodyColors = () => page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      color: getComputedStyle(document.body).color,
    }));

    // El tema por defecto es "light" y se queda en "light": emular un
    // sistema oscuro NO debe pintar la página de oscuro, porque ya no
    // queda la opción "auto" que le entregaba la decisión al sistema.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const defaultColors = await bodyColors();
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => bodyColors().then(colors => colors.background)).toBe(defaultColors.background);

    await drawer.locator('[data-settings-theme="light"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(drawer.locator('[data-settings-theme="light"]')).toHaveAttribute('aria-pressed', 'true');
    const light = await bodyColors();

    await drawer.locator('[data-settings-theme="dark"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const dark = await bodyColors();
    expect(dark).not.toEqual(light);

    const contrast = drawer.locator('[data-settings-contrast]');
    await contrast.check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'contrast');
    await expect(contrast).toBeChecked();
    expect(await bodyColors()).not.toEqual(dark);

    await contrast.uncheck();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('apptonomia:locale:accessibility')).theme)).toBe('dark');
  });

  test('changes visible page text size and restores it after reload', async ({ page }) => {
    const drawer = page.locator('#accessibility-settings');
    await page.locator('.locale-settings-trigger').click();
    const bodyFontSize = () => page.locator('body').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    const cardTextFontSize = () => page.locator('.suite-card p').first()
      .evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    const cardTitleFontSize = () => page.locator('.suite-card h3').first()
      .evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    const baseSize = await bodyFontSize();
    const baseCardTextSize = await cardTextFontSize();
    const baseCardTitleSize = await cardTitleFontSize();

    await drawer.locator('[data-settings-size="small"]').click();
    await expect.poll(bodyFontSize).toBeCloseTo(baseSize * 0.9, 1);
    await expect.poll(cardTextFontSize).toBeCloseTo(baseCardTextSize * 0.9, 1);
    await expect.poll(cardTitleFontSize).toBeCloseTo(baseCardTitleSize * 0.9, 1);
    await expect(drawer.locator('[data-settings-size="small"]')).toHaveAttribute('aria-pressed', 'true');
    await drawer.locator('[data-settings-size="normal"]').click();
    await expect.poll(bodyFontSize).toBeCloseTo(baseSize, 1);
    await expect.poll(cardTextFontSize).toBeCloseTo(baseCardTextSize, 1);
    await expect.poll(cardTitleFontSize).toBeCloseTo(baseCardTitleSize, 1);
    await drawer.locator('[data-settings-size="large"]').click();
    await expect.poll(bodyFontSize).toBeCloseTo(baseSize * 1.15, 1);
    await expect.poll(cardTextFontSize).toBeCloseTo(baseCardTextSize * 1.15, 1);
    await expect.poll(cardTitleFontSize).toBeCloseTo(baseCardTitleSize * 1.15, 1);
    await expect(drawer.locator('[data-settings-size="large"]')).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-a11y-text', 'large');
    await expect.poll(bodyFontSize).toBeCloseTo(baseSize * 1.15, 1);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('apptonomia:locale:accessibility')).textSize)).toBe('large');
  });
});
