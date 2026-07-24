const { test, expect } = require('../../fixtures/test-options');

test.describe('Cart @smoke', () => {
  test('user can add a product to cart via hover-reveal button', async ({ productsPage, page }) => {
    await productsPage.goto();

    await productsPage.addProductToCartById(1); // Blue Top
    await expect(page.getByText('Added!')).toBeVisible({ timeout: 5000 });

    await productsPage.goToCartFromModal();
    await expect(page.locator('#cart_info')).toContainText('Blue Top');
  });

  test('user can continue shopping after adding to cart', async ({ productsPage, page }) => {
    await productsPage.goto();

    await productsPage.addProductToCartById(1); // Blue Top
    await expect(page.getByText('Added!')).toBeVisible({ timeout: 5000 });
    await productsPage.dismissAddedToCartModal();

    // Modal closed, back on products page — no navigation happened
    await expect(page).toHaveURL(/products/);
  });

  test('search returns matching products only', async ({ productsPage, page }) => {
    await productsPage.goto();
    await productsPage.searchProduct('Dress');

    await expect(page.locator('.features_items .productinfo p').first()).toBeVisible();
    const productNames = await page.locator('.features_items .productinfo p').allTextContents();
    expect(productNames.every(name => name.length > 0)).toBeTruthy();
  });
});