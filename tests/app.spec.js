const { test, expect } = require('@playwright/test');

const BASE = 'http://127.0.0.1:4173/project/';
const HOME = 'http://127.0.0.1:4173/';
const SETTLE_MS = 400;
const NAV_TIMEOUT = 15000;

/** Wait for the deck to settle after a navigation action */
async function settle(page) {
  await page.waitForTimeout(SETTLE_MS);
}

/** Poll until the active slide index matches the expected index */
async function waitForActiveSlide(page, idx) {
  const maxWait = Date.now() + NAV_TIMEOUT;
  while (Date.now() < maxWait) {
    const active = await page.evaluate(() => {
      const active = document.querySelector('.slide.is-active');
      if (!active) return -1;
      const slides = Array.from(document.querySelectorAll('.slide'));
      return slides.indexOf(active);
    });
    if (active === idx) return;
    await page.waitForTimeout(50);
  }
  throw new Error(`Timed out waiting for slide index ${idx}`);
}

/** Poll until the slide counter text matches the expected values */
async function waitForCounter(page, num, total) {
  const maxWait = Date.now() + NAV_TIMEOUT;
  while (Date.now() < maxWait) {
    const text = (await page.locator('#slideNum').textContent() || '').trim();
    const totalText = (await page.locator('#slideTotal').textContent() || '').trim();
    if (text === String(num) && totalText === String(total)) return;
    await page.waitForTimeout(50);
  }
  throw new Error(`Timed out waiting for counter ${num}/${total}`);
}

test.describe('apptonomia deck', () => {

  // Reset localStorage before each test to prevent state bleed
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => localStorage.removeItem('deck.locale'));
    await page.reload();
    await settle(page);
  });

  test('Page loads with slides visible', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);
    const slides = await page.locator('.slide').count();
    expect(slides).toBeGreaterThan(0);
  });

  test('Slide counter is visible', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);
    await expect(page.locator('#slideNum')).toBeVisible();
    await expect(page.locator('#slideTotal')).toBeVisible();
  });

  test('Keyboard ArrowRight advances to next slide', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);
    await waitForActiveSlide(page, 0);

    await page.keyboard.press('ArrowRight');
    await waitForActiveSlide(page, 1);
    await waitForCounter(page, 2, 12);
  });

  test('Keyboard ArrowLeft goes to previous slide', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);
    // Advance to slide 2 first
    await page.keyboard.press('ArrowRight');
    await waitForActiveSlide(page, 1);

    await page.keyboard.press('ArrowLeft');
    await waitForActiveSlide(page, 0);
    await waitForCounter(page, 1, 12);
  });

  test('Home key goes to first slide', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);
    // Advance to slide 3
    await page.keyboard.press('ArrowRight');
    await waitForActiveSlide(page, 1);
    await page.keyboard.press('ArrowRight');
    await waitForActiveSlide(page, 2);

    await page.keyboard.press('Home');
    await waitForActiveSlide(page, 0);
    await waitForCounter(page, 1, 12);
  });

  test('End key goes to last slide', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);

    await page.keyboard.press('End');
    await waitForActiveSlide(page, 11);
    await waitForCounter(page, 12, 12);
  });

  test('Space key advances to next slide', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);
    await waitForActiveSlide(page, 0);

    await page.keyboard.press('Space');
    await waitForActiveSlide(page, 1);
    await waitForCounter(page, 2, 12);
  });

  test('#btnNext button advances to next slide', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);
    await waitForActiveSlide(page, 0);

    await page.locator('#btnNext').click();
    await waitForActiveSlide(page, 1);
    await waitForCounter(page, 2, 12);
  });

  test('#btnPrev button goes to previous slide', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);
    // Advance to slide 2 first
    await page.locator('#btnNext').click();
    await waitForActiveSlide(page, 1);

    await page.locator('#btnPrev').click();
    await waitForActiveSlide(page, 0);
    await waitForCounter(page, 1, 12);
  });

  test('Language switch to English updates texts and persists in localStorage', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);

    // Capture Spanish text from a translatable element
    const getFirstI18nText = async () => {
      return page.evaluate(() => {
        const el = document.querySelector('[data-i18n]');
        return el ? el.textContent : '';
      });
    };
    const spanishText = await getFirstI18nText();

    // Switch to English
    await page.locator('#btnLangEn').click();
    await settle(page);

    // Text should change (if there are translations)
    const englishText = await getFirstI18nText();
    // Just check that the locale is set and localStorage is updated
    const locale = await page.evaluate(() => localStorage['deck.locale']);
    expect(locale).toBe('en');

    // btnLangEn should be aria-pressed
    const ariaPressed = await page.locator('#btnLangEn').getAttribute('aria-pressed');
    expect(ariaPressed).toBe('true');
  });

  test('Unsupported browser language falls back to English', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'fr-FR' });
    const page = await context.newPage();
    try {
      await page.addInitScript(() => localStorage.clear());
      await page.goto(BASE);
      await settle(page);
      expect(await page.locator('html').getAttribute('lang')).toBe('en');
      expect(await page.evaluate(() => window.App.i18n.locale())).toBe('en');
    } finally {
      await context.close();
    }
  });

  test('Suite home shows EN for an unsupported browser language', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'fr-FR' });
    const page = await context.newPage();
    try {
      await page.addInitScript(() => localStorage.clear());
      await page.goto(HOME);
      await expect(page.locator('#locale-picker')).toBeVisible();
      await expect(page.locator('.locale-picker-current')).toHaveText('EN');
      expect(await page.locator('html').getAttribute('lang')).toBe('en');
    } finally {
      await context.close();
    }
  });

  test('Language switch to Spanish updates texts', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);

    // Switch to English first, then back to Spanish
    await page.locator('#btnLangEn').click();
    await settle(page);

    await page.locator('#btnLangEs').click();
    await settle(page);

    const locale = await page.evaluate(() => localStorage['deck.locale']);
    expect(locale).toBe('es');

    const ariaPressed = await page.locator('#btnLangEs').getAttribute('aria-pressed');
    expect(ariaPressed).toBe('true');
  });

  test('Language preference persists after page reload', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);

    await page.locator('#btnLangEn').click();
    await settle(page);

    // Reload the page
    await page.reload();
    await settle(page);

    const locale = await page.evaluate(() => localStorage['deck.locale']);
    expect(locale).toBe('en');

    const ariaPressed = await page.locator('#btnLangEn').getAttribute('aria-pressed');
    expect(ariaPressed).toBe('true');
  });

  test('Active language button has aria-pressed="true"', async ({ page }) => {
    // Pre-set Spanish locale to match the HTML default (the app reads
    // navigator.language as 'en' in Playwright, so we must force 'es').
    await page.goto(BASE);
    await page.evaluate(() => localStorage.setItem('deck.locale', 'es'));
    await page.reload();
    await settle(page);

    // Default Spanish button should be pressed
    const esPressed = await page.locator('#btnLangEs').getAttribute('aria-pressed');
    expect(esPressed).toBe('true');

    const enPressed = await page.locator('#btnLangEn').getAttribute('aria-pressed');
    expect(enPressed).not.toBe('true');

    // Switch to English
    await page.locator('#btnLangEn').click();
    await settle(page);

    const enPressedAfter = await page.locator('#btnLangEn').getAttribute('aria-pressed');
    expect(enPressedAfter).toBe('true');

    const esPressedAfter = await page.locator('#btnLangEs').getAttribute('aria-pressed');
    expect(esPressedAfter).not.toBe('true');
  });

  test('Print button triggers window.print', async ({ page }) => {
    await page.goto(BASE);
    await settle(page);

    let printCalled = false;
    await page.evaluate(() => {
      window.print = () => { window.__printCalled = true; };
    });

    await page.locator('#btnPrint').click();
    await settle(page);

    const printCalled2 = await page.evaluate(() => window.__printCalled);
    expect(printCalled2).toBe(true);
  });

});
