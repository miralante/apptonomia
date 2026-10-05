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

    // The drawer is the accessibility panel only. The language picker is a
    // first-level control in the header, not a sublevel of this drawer, and
    // there is no "more settings" link duplicating the app's own settings.
    await expect(drawer.locator('.locale-picker-btn')).toHaveCount(0);
    await expect(drawer.locator('[data-settings-success], [data-settings-error]')).toHaveCount(0);
    await expect(drawer.locator('[data-settings-more]')).toHaveCount(0);

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

  test('keeps the language dropdown and the gear side by side, gear on the right', async ({ page }) => {
    // The gear is inserted as the next sibling of #locale-picker, so the two
    // share one row and the gear is the rightmost control of the header.
    const order = await page.evaluate(() => {
      const picker = document.getElementById('locale-picker');
      const gear = document.querySelector('.locale-settings-trigger');
      return {
        sameRow: gear.parentNode === picker.parentNode,
        gearAfterPicker: picker.nextElementSibling === gear,
        parentAlignsEnd: getComputedStyle(picker.parentNode).justifyContent,
      };
    });
    expect(order.sameRow).toBe(true);
    expect(order.gearAfterPicker).toBe(true);
    expect(order.parentAlignsEnd).toBe('flex-end');

    // Reachable in one click, without opening the drawer first.
    const languageButton = page.locator('#locale-picker .locale-picker-btn');
    const languageOptions = page.locator('#locale-picker .locale-picker-panel');
    await expect(languageButton).toBeVisible();
    await languageButton.click();
    await expect(languageOptions).toBeVisible();
    await expect(languageOptions).toBeInViewport();
    const panelBox = await languageOptions.boundingBox();
    const buttonBox = await languageButton.boundingBox();
    expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(buttonBox.x + buttonBox.width + 1);
    await page.keyboard.press('Escape');
    await expect(languageOptions).toBeHidden();
    // Opening the language menu must not open the settings drawer.
    await expect(page.locator('#accessibility-settings')).toBeHidden();
  });

  test('cache-busts the mutable language runtime script', async ({ page }) => {
    await expect(page.locator('script[src*="js/script.js"]'))
      .toHaveAttribute('src', /[?&]v=apptonomia-v\d+/);
  });

  test('changes language from the header dropdown and persists after reload', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const tagline = page.locator('[data-i18n="home.tagline"]');
    const englishTagline = await tagline.textContent();

    // The dropdown in the header, one click away: the drawer is never opened.
    const languageButton = page.locator('#locale-picker .locale-picker-btn');
    const languageOptions = page.locator('#locale-picker .locale-picker-panel');
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
    // The drawer's own labels follow the language too, once it is opened.
    await page.locator('.locale-settings-trigger').click();
    await expect(page.locator('#accessibility-settings [data-settings-title]')).toHaveText('Ajustes');
  });

  test('applies theme and high contrast to the page and persists the selection', async ({ page }) => {
    const drawer = page.locator('#accessibility-settings');
    await page.locator('.locale-settings-trigger').click();

    const bodyColors = () => page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      color: getComputedStyle(document.body).color,
    }));

    await expect(page.locator('html')).not.toHaveAttribute('data-theme');
    const autoLight = await bodyColors();
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => bodyColors().then(colors => colors.background)).not.toBe(autoLight.background);

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
