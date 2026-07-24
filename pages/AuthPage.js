const { BasePage } = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    // Login section
    this.loginEmail = page.locator('input[data-qa="login-email"]');
    this.loginPassword = page.locator('input[data-qa="login-password"]');
    this.loginBtn = page.locator('button[data-qa="login-button"]');
    this.loginError = page.getByText('Your email or password is incorrect!');

    // Signup section
    this.signupName = page.locator('input[data-qa="signup-name"]');
    this.signupEmail = page.locator('input[data-qa="signup-email"]');
    this.signupBtn = page.locator('button[data-qa="signup-button"]');

    // Account info form (after signup)
    this.titleMr = page.locator('#id_gender1');
    this.password = page.locator('#password');
    this.daySelect = page.locator('#days');
    this.monthSelect = page.locator('#months');
    this.yearSelect = page.locator('#years');
    this.firstName = page.locator('#first_name');
   this.firstName = page.locator('#first_name');
    this.lastName = page.locator('#last_name');
    this.address1 = page.locator('#address1');
    this.country = page.locator('#country');
    this.state = page.locator('#state');
    this.city = page.locator('input[data-qa="city"]');
    this.zipcode = page.locator('#zipcode');
    this.mobileNumber = page.locator('#mobile_number');
    this.createAccountBtn = page.locator('button[data-qa="create-account"]');
    this.accountCreatedHeader = page.locator('h2[data-qa="account-created"]');
    this.continueBtn = page.locator('a[data-qa="continue-button"]');

    this.deleteAccountLink = page.getByText('Delete Account');
    this.accountDeletedHeader = page.locator('h2[data-qa="account-deleted"]');
  }

  async goto() {
    await super.goto('/login');
  }

  async login(email, password) {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginBtn.click();
  }

  async startSignup(name, email) {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupBtn.click();
  }

  /**
   * Fills the multi-step account details form — exercises
   * native <select> dropdowns via selectOption (not click+click).
   */
  async fillAccountDetails({ password, day, month, year, firstName, lastName, address1, country, state, city, zipcode, mobileNumber }) {
    await this.titleMr.check();
    await this.password.fill(password);
    await this.daySelect.selectOption(day);
    await this.monthSelect.selectOption(month);
    await this.yearSelect.selectOption(year);
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.address1.fill(address1);
    await this.country.selectOption(country);
    await this.state.fill(state);
    await this.city.fill(city);
    await this.zipcode.fill(zipcode);
    await this.mobileNumber.fill(mobileNumber);
    await this.createAccountBtn.click();
  }

  async continueAfterAccountCreation() {
    await this.continueBtn.click();
  }

  /**
   * Site raises a native JS confirm() dialog on delete — must be
   * handled before it blocks execution.
   */
  async deleteAccount() {
    await this.acceptDialogOnce(() => this.deleteAccountLink.click());
  }
}

module.exports = { AuthPage };
