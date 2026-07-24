const { test, expect } = require('@playwright/test');

test.describe('Visual Regression @visual', () => {
  test('homepage header matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    // Full-page screenshots on this site are unreliable: a live third-party
    // ad widget and rotating carousel shift total page height between runs
    // even with masking (mask hides content, not layout space). Snapshotting
    // a stable, ad-free section (the header) gives a deterministic baseline
    // instead of fighting non-deterministic page height.
    await expect(page.locator('#header')).toHaveScreenshot('homepage-header.png');
  });

  test('product listing page matches baseline', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator('.features_items')).toHaveScreenshot('product-listing.png', {
      maxDiffPixelRatio: 0.05, // small tolerance for lazy-loaded product images
    });
  });
});

/**
 * NOTE: First run generates baselines locally — commit them under
 * tests/visual/homepage.visual.spec.js-snapshots/.
 * For CI, baselines should be regenerated INSIDE the CI container
 * (same OS/browser as the pipeline) to avoid false-positive diffs
 * from font rendering differences between local and CI environments.
 */