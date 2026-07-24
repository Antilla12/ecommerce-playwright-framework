// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // retry only in CI — never mask flakiness locally
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['./reporters/flake-reporter.js'],
  ],

  use: {
    baseURL: 'https://automationexercise.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
  },

  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /tests\/logged-in\//,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /tests\/logged-in\//,
    },
    {
      name: 'chromium-logged-in',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      testMatch: /tests\/logged-in\//,
      dependencies: ['setup'],
    },
    // webkit intentionally excluded — automationexercise.com's API and page
    // responses fail against WebKit's request layer specifically (API calls
    // return an HTML challenge/error page instead of JSON, and pages hang on
    // basic locator.fill), while chromium/firefox work identically. This
    // reproduces consistently and is not a bug in this framework's code —
    // see README "Known Limitations" for details.
  ],
});
