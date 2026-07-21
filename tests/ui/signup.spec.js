const { test, expect } = require('../../fixtures/test-options');
const { generateUser } = require('../../utils/testDataGenerator');

test.describe('User Signup @smoke', () => {
  test('new user can sign up and delete account', async ({ authPage, page }) => {
    const user = generateUser();

    await authPage.goto();
    await authPage.startSignup(user.name, user.email);

    await expect(page.locator('h2.title')).toHaveText('Enter Account Information');

    await authPage.fillAccountDetails(user);

    await expect(authPage.accountCreatedHeader).toBeVisible();
    await authPage.continueAfterAccountCreation();

    // Verify logged-in state reflects the new account
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    // Clean up — delete the account we just created (test isolation)
    await authPage.deleteAccount();
    await expect(authPage.accountDeletedHeader).toBeVisible();
  });

  test('login fails with incorrect credentials', async ({ authPage }) => {
    await authPage.goto();
    await authPage.login('nonexistent.user@example.com', 'wrongpassword');
    await expect(authPage.loginError).toBeVisible();
  });
});
