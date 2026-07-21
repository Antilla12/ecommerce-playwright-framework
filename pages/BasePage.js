class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  /**
   * Waits for a specific network response before proceeding —
   * avoids race conditions between click and async data load.
   */
  async waitForResponseAfter(action, urlMatcher) {
    const [response] = await Promise.all([
      this.page.waitForResponse(urlMatcher),
      action(),
    ]);
    return response;
  }

  async acceptDialogOnce(action) {
    this.page.once('dialog', (dialog) => dialog.accept());
    await action();
  }
}

module.exports = { BasePage };
