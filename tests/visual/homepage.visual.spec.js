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

  test('product card matches baseline', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    // The full product grid (.features_items) was tried here first, but its
    // rendered height varies by 50-500+ px between identical runs — the site
    // appears to serve variable amounts of promotional/recommended content
    // that isn't within this framework's control to stabilize. Rather than
    // loosen tolerances to hide that instability, this test scopes down to
    // a single, structurally stable product card, which is deterministic.
    const firstCard = page.locator('.product-image-wrapper').first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.locator('img').evaluate((img) =>
      img.complete ? Promise.resolve() : new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      })
    );

    await expect(firstCard).toHaveScreenshot('product-card.png');
  });
});

/**
 * NOTE: First run generates baselines locally — commit them under
 * tests/visual/homepage.visual.spec.js-snapshots/.
 * For CI, baselines should be regenerated INSIDE the CI container
 * (same OS/browser as the pipeline) to avoid false-positive diffs
 * from font rendering differences between local and CI environments.
 */