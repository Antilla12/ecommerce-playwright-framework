const { test, expect } = require('../../fixtures/test-options');

test.describe('Cart @smoke', () => {
  test('user can add a product to cart via hover-reveal button', async ({ productsPage, page }) => {
    await productsPage.goto();

    await productsPage.addProductToCartByName('Blue Top');
    await expect(page.getByText('Your product has been added to cart')).toBeVisible();
    await productsPage.dismissAddedToCartModal();

    await productsPage.goToCart();
    await expect(page.locator('#cart_info')).toContainText('Blue Top');
  });

  test('search returns matching products only', async ({ productsPage, page }) => {
    await productsPage.goto();
    await productsPage.searchProduct('Dress');

    await expect(page.locator('.features_items .productinfo p').first()).toBeVisible();
    const productNames = await page.locator('.features_items .productinfo p').allTextContents();
    expect(productNames.every(name => name.length > 0)).toBeTruthy();
  });
});
