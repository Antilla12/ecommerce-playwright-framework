const { test: setup } = require('@playwright/test');
const { apiBaseUrl } = require('../../config/env');
const { generateUser } = require('../../utils/testDataGenerator');
const fs = require('fs');
const path = require('path');

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');
const userDataFile = path.join(__dirname, '../../playwright/.auth/user-data.json');

/**
 * Runs once before the "logged-in" project's tests. Creates a real account
 * via the API (fast, no UI flakiness), logs in through the actual UI once
 * so cookies/session are real, then persists that browser state to disk.
 * Every test in the "logged-in" project loads this file and starts already
 * authenticated — no repeated login flow per test.
 */
setup('authenticate', async ({ page, request }) => {
  const user = generateUser();

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
      address1: user.address1,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobileNumber,
    },
  });
  const createBody = await createRes.json();
  if (createBody.responseCode !== 201) {
    throw new Error(`Setup failed: could not create user — ${JSON.stringify(createBody)}`);
  }

  await page.goto('/login');
  await page.locator('input[data-qa="login-email"]').fill(user.email);
  await page.locator('input[data-qa="login-password"]').fill(user.password);
  await page.locator('button[data-qa="login-button"]').click();

  await page.getByText(`Logged in as ${user.name}`).waitFor({ state: 'visible' });

  await page.context().storageState({ path: authFile });

  // Persist the plain credentials too — some tests need the email/name,
  // not just the cookie state (e.g. to assert "Logged in as X").
  fs.writeFileSync(userDataFile, JSON.stringify(user, null, 2));
});