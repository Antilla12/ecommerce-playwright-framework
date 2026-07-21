const { test, expect } = require('@playwright/test');

test.describe('Visual Regression @visual', () => {
  test('homepage matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready); // ensure fonts settled before snapshot

    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      mask: [
        page.locator('.carousel'), // rotating promo banner — not deterministic
      ],
    });
  });

  test('product listing page matches baseline', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator('.features_items')).toHaveScreenshot('product-listing.png');
  });
});

/**
 * NOTE: First run generates baselines locally — commit them under
 * tests/visual/homepage.visual.spec.js-snapshots/.
 * For CI, baselines should be regenerated INSIDE the CI container
 * (same OS/browser as the pipeline) to avoid false-positive diffs
 * from font rendering differences between local and CI environments.
 */
