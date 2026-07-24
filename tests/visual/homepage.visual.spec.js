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
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.locator('.features_items').waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    // .first() on the grid was tried initially, but this site doesn't
    // guarantee a fixed product order — the same 19% pixel diff we saw
    // debugging the cart flow (different product card entirely) showed up
    // here too. Targeting a specific product by its stable data-product-id
    // (Blue Top = id 1, confirmed via the same method used in cart.spec.js)
    // removes that assumption.
    const blueTopCard = page.locator('.product-image-wrapper', {
      has: page.locator('a.add-to-cart[data-product-id="1"]'),
    }).first();

    await blueTopCard.scrollIntoViewIfNeeded();
    await blueTopCard.locator('img').evaluate((img) =>
      img.complete ? Promise.resolve() : new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      })
    );

    await expect(blueTopCard).toHaveScreenshot('product-card.png');
  });
});

/**
 * NOTE: First run generates baselines locally — commit them under
 * tests/visual/homepage.visual.spec.js-snapshots/.
 * For CI, baselines should be regenerated INSIDE the CI container
 * (same OS/browser as the pipeline) to avoid false-positive diffs
 * from font rendering differences between local and CI environments.
 */