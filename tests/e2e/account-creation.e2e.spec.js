const { test, expect } = require('../../fixtures/test-options');
const { apiBaseUrl } = require('../../config/env');
const { generateUser } = require('../../utils/testDataGenerator');

test.describe('Cross-layer: API create, UI verify @e2e', () => {
  test('user created via API can log in through the UI', async ({ request, authPage, page }) => {
    const user = generateUser();

    // Arrange: create the account through the API — fast, no UI overhead
    const createRes = await request.post(`${apiBaseUrl}/createAccount`, {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: 'Mr',
        birth_date: user.day,
        birth_month: user.month,
        birth_year: user.year,
        firstname: user.firstName,
        lastname: user.lastName,
        address1: '123 Test St',
        country: user.country,
        zipcode: '10001',
        state: 'NY',
        city: 'New York',
        mobile_number: '5555555555',
      },
    });
    const createBody = await createRes.json();
    expect(createBody.responseCode).toBe(201);

    // Act: log in through the actual UI
    await authPage.goto();
    await authPage.login(user.email, user.password);

    // Assert: UI reflects the account that was created purely via API
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    // Cleanup via API — faster and more reliable than UI deletion for teardown
    await request.delete(`${apiBaseUrl}/deleteAccount`, {
      form: { email: user.email, password: user.password },
    });
  });
});
