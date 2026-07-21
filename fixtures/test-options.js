const base = require('@playwright/test');
const { ProductsPage } = require('../pages/ProductsPage');
const { AuthPage } = require('../pages/AuthPage');

/**
 * Extends Playwright's base test with our page objects pre-wired.
 * Usage: test('...', async ({ productsPage, authPage }) => { ... })
 */
exports.test = base.test.extend({
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
});

exports.expect = base.expect;
