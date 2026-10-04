const { test, expect } = require('playwright/test');

const ORIGIN = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${process.env.UI_PORT || 4173}`;
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

    const languageButton = drawer.locator('.locale-picker-btn');
    const languageOptions = drawer.locator('.locale-picker-panel');
    await languageButton.click();
    await expect(languageOptions).toBeVisible();
    await expect(languageOptions).toBeInViewport();
    const panelBox = await languageOptions.boundingBox();
    const drawerBox = await drawer.boundingBox();
    expect(panelBox.x).toBeGreaterThanOrEqual(drawerBox.x);
    expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(drawerBox.x + drawerBox.width);
    await languageButton.click();

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

  test('cache-busts the mutable language runtime script', async ({ page }) => {
    await expect(page.locator('script[src*="js/script.js"]'))
      .toHaveAttribute('src', /[?&]v=apptonomia-v\d+/);
  });

  test('changes language from inside the drawer and persists after reload', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const tagline = page.locator('[data-i18n="home.tagline"]');
    const englishTagline = await tagline.textContent();

    await page.locator('.locale-settings-trigger').click();
    const drawer = page.locator('#accessibility-settings');
    await drawer.locator('.locale-picker-btn').click();
    await drawer.locator('.locale-picker-panel [data-locale="es"]').click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(tagline).not.toHaveText(englishTagline);
    await expect(drawer.locator('[data-settings-title]')).toHaveText('Ajustes');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('apptonomia:locale'))).toBe('es');

    // Both directions must apply translations immediately, not just update
    // the selected locale label or wait for a document reload.
    await drawer.locator('.locale-picker-btn').click();
    await drawer.locator('.locale-picker-panel [data-locale="en"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(tagline).toHaveText(englishTagline);
    await expect(drawer.locator('[data-settings-title]')).toHaveText('Settings');

    await drawer.locator('.locale-picker-btn').click();
    await drawer.locator('.locale-picker-panel [data-locale="es"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(tagline).not.toHaveText(englishTagline);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(tagline).not.toHaveText(englishTagline);
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
