const { BasePage } = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.productCards = page.locator('.product-image-wrapper');
    this.searchInput = page.locator('#search_product');
    this.searchBtn = page.locator('#submit_search');
    this.continueShoppingBtn = page.getByText('Continue Shopping');
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
  }

  async goto() {
    await super.goto('/products');
  }

  /**
   * Hover-reveal pattern: "Add to cart" overlay only appears on hover
   * in this site's markup, matching real e-commerce UX.
   */
  async addProductToCartByName(productName) {
    const card = this.page.locator('.product-image-wrapper', {
      has: this.page.locator('.productinfo p', { hasText: productName }),
    });
    await card.hover();
    await card.getByText('Add to cart').first().click();
  }

  async dismissAddedToCartModal() {
    await this.continueShoppingBtn.click();
  }

  async searchProduct(term) {
    await this.searchInput.fill(term);
    await this.searchBtn.click();
  }

  async goToCart() {
    await this.viewCartLink.click();
  }
}

module.exports = { ProductsPage };
