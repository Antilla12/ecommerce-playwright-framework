const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const userDataFile = path.join(__dirname, '../../playwright/.auth/user-data.json');

test.describe('Logged-in user @logged-in', () => {
  test('user starts already authenticated — no login flow needed', async ({ page }) => {
    const user = JSON.parse(fs.readFileSync(userDataFile, 'utf-8'));

    // No login steps here — storageState from the setup project already
    // has us authenticated. Going straight to the homepage should show
    // the logged-in state immediately.
    await page.goto('/');

    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
  });

  test('authenticated user can add to cart and see it persist across navigation', async ({ page }) => {
    await page.goto('/products');

    await page.locator('a.add-to-cart[data-product-id="1"]').first().click({ force: true });
    await expect(page.getByText('Added!')).toBeVisible({ timeout: 5000 });
    await page.getByText('View Cart').click();

    await expect(page.locator('#cart_info')).toContainText('Blue Top');

    // Navigate away and back — cart should persist because we're a real
    // logged-in session, not an anonymous one that could lose state.
    await page.goto('/products');
    await page.goto('/view_cart');
    await expect(page.locator('#cart_info')).toContainText('Blue Top');
  });
});