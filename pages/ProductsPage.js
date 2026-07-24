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
   * The site renders two "Add to cart" buttons per product — one in the
   * static card, one inside a hover overlay. Both share the same
   * data-product-id, so we target that attribute directly instead of
   * relying on hover state, which proved unreliable across browsers.
   */
  async addProductToCartById(productId) {
    const button = this.page.locator(`a.add-to-cart[data-product-id="${productId}"]`).first();
    await button.click();
    
  }

  async dismissAddedToCartModal() {
    await this.continueShoppingBtn.click();
  }

  async searchProduct(term) {
    await this.searchInput.fill(term);
    await this.searchBtn.click();
  }

  async goToCartFromModal() {
    await this.viewCartLink.click();
  }
}

module.exports = { ProductsPage };
