# E-Commerce Playwright Automation Framework

End-to-end test automation framework built with **Playwright + JavaScript** against [automationexercise.com](https://automationexercise.com), a public e-commerce practice site with a real REST API.

Covers UI, API, combined UI+API verification, visual regression, flake tracking, and CI across three browser engines.

---

## 🚀 Quick Start

```bash
npm install
npx playwright install --with-deps
npx playwright test
```

Run subsets:
```bash
npm run test:smoke     # @smoke tagged tests only
npm run test:ui        # UI specs only
npm run test:api       # API specs only
npm run test:e2e       # combined UI+API specs
npm run test:visual    # visual regression only
npm run test:headed    # watch it run in a real browser
npm run report         # open last HTML report
```

---

## 🧪 Skills Demonstrated

| Skill | Where |
|---|---|
| Page Object Model | [`/pages`](./pages) |
| Custom fixtures (auto-injected page objects) | [`/fixtures/test-options.js`](./fixtures/test-options.js) |
| Multi-step forms, dropdowns, JS alert handling | [`/pages/AuthPage.js`](./pages/AuthPage.js), [`/tests/ui/signup.spec.js`](./tests/ui/signup.spec.js) |
| Hover-reveal elements | [`/pages/ProductsPage.js`](./pages/ProductsPage.js) |
| Full CRUD API testing + schema validation | [`/tests/api/`](./tests/api) |
| Combined UI + API verification | [`/tests/e2e/`](./tests/e2e) |
| Visual regression with masking | [`/tests/visual/`](./tests/visual) |
| Test data isolation (unique data per test) | [`/utils/testDataGenerator.js`](./utils/testDataGenerator.js) |
| Custom reporter — flaky test tracking | [`/reporters/flake-reporter.js`](./reporters/flake-reporter.js) |
| CI across Chromium, Firefox, WebKit | [`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml) |

---

## 📁 Project Structure

```
├── pages/                # Page Object Model classes
│   ├── BasePage.js
│   ├── AuthPage.js
│   └── ProductsPage.js
├── fixtures/
│   └── test-options.js   # extends base test with page objects
├── reporters/
│   └── flake-reporter.js # tracks tests that only pass on retry
├── utils/
│   └── testDataGenerator.js
├── config/
│   └── env.js
├── tests/
│   ├── ui/                # signup, cart, hover-reveal, dropdowns
│   ├── api/                # full CRUD against the real REST API
│   ├── e2e/                # create via API, verify via UI (and vice versa)
│   └── visual/              # toHaveScreenshot with masking
├── .github/workflows/playwright.yml
└── playwright.config.js
```

---

## 🔍 Design Decisions Worth Noting

**Test isolation.** Every test that touches user data generates a unique user via `faker` (`utils/testDataGenerator.js`) rather than using a shared fixed account — this avoids collisions when tests run in parallel workers.

**Retry policy.** Retries are enabled only in CI (`retries: process.env.CI ? 2 : 0`), never locally — masking flakiness during local development defeats the purpose of catching it early.

**Flake visibility.** The custom reporter (`reporters/flake-reporter.js`) explicitly surfaces any test that passed only after a retry. A suite can be "100% green" in CI and still be quietly unreliable — this reporter makes that visible instead of hiding it.

**API method correctness.** Some of this site's endpoints are non-obvious (e.g. `verifyLogin` requires POST, not GET) — verified against the [official API list](https://automationexercise.com/api_list) rather than assumed.

**Visual regression baselines.** Baselines are OS/browser-specific. They should be generated inside the same environment that CI runs in (not copied from local) to avoid false-positive diffs from font rendering differences.

---

## ⚠️ Known Limitations

**WebKit is excluded from the browser matrix.** Both API requests and UI interactions against automationexercise.com fail consistently under WebKit specifically:
- API calls (`request.get`/`post`) receive an HTML error page instead of JSON
- Basic UI actions (`locator.fill`, `locator.scrollIntoViewIfNeeded`) time out on pages that load correctly in Chromium and Firefox

This reproduces consistently and is isolated to WebKit's request/rendering layer against this specific site — not a bug in this framework's page objects, fixtures, or test logic (all of which pass reliably in Chromium and Firefox). Rather than mask this with retries or workarounds, it's documented here and WebKit is excluded from both local runs and CI.

---

## ⚙️ CI/CD

GitHub Actions runs the full suite on every push/PR across **Chromium, Firefox, and WebKit** in a matrix, uploading the HTML report and (on failure) traces/videos as artifacts. See [`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml).

---

## 📌 Scope Note

This is a portfolio framework built against a public practice site, not a production app. Structure and patterns are written to production standards regardless.
