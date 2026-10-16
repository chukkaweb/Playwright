# Playwright Learning and Practice Checklist

A structured checklist covering Playwright fundamentals, reusable test architecture, and debugging.

## 1. Core Topics

- [ ] **🔧 Setup:** Local setup and environment.
- [ ] **📦 CLI Commands:** `npx playwright test`, `show-report`, `--debug`, and `codegen`.
- [ ] **🧠 Core Concepts:** Browser, Browser Context, Page, and Locator.
- [ ] **📄 First Test:** Write a sample test using TypeScript.
- [ ] **⏱️ Async/Await:** Handle asynchronous operations and Promises.
- [ ] **🧪 Assertions:** Hard assertions, soft assertions, and auto-retrying assertions.
- [ ] **🎯 Locators:** Built-in locators such as `getByRole()`, `getByText()`, and `getByLabel()`.
- [ ] **🪝 Hooks:** `beforeEach`, `afterEach`, `beforeAll`, and `afterAll`.
- [ ] **📂 Test Grouping:** Organize tests using `test.describe()` and `test()`.
- [ ] **💡 CSS and XPath:** Understand selector patterns and their limitations.
- [ ] **✍️ Codegen:** Generate test skeletons by recording browser actions.
- [ ] **🌍 Emulation:** Devices, viewport, geolocation, locale, and color scheme.
- [ ] **📁 CI Setup:** Run tests using GitHub Actions.
- [ ] **🔍 Trace Viewer:** Investigate failures using traces.
- [ ] **⏱️ Timeouts and Retries:** Configure test, assertion, and action timeouts.
- [ ] **📋 Annotations and Tags:** Skip, annotate, tag, and filter tests.
- [ ] **🧑‍💻 Best Practices:** Naming, isolation, maintainability, and stability.

## 2. Recommended Topics

| Status | Topic | Why It Matters |
| --- | --- | --- |
| Recommended | Page Object Model (POM) | Organize page interactions into reusable classes |
| Recommended | Custom Helpers and Utilities | Centralize common operations |
| Recommended | Fixtures | Reuse setup, teardown, and test dependencies |
| Recommended | Environment Configuration | Run against the intended environment |
| Recommended | API Testing | Test APIs and prepare test data |
| Recommended | Authentication with Storage State | Reuse authenticated state across tests |
| Optional | Visual Testing | Detect unexpected visual changes |
| Optional | Network Mocking | Test controlled responses, failures, and edge cases |
| Optional | Test Tags and Filtering | Select relevant test groups |
| Optional | Multi-Browser Projects | Run tests across browser and device configurations |

### Progress Checklist

- [ ] Implement Page Object Model.
- [ ] Create reusable helpers.
- [ ] Define custom fixtures.
- [ ] Configure environment variables.
- [ ] Write API tests.
- [ ] Reuse authentication through storage state.
- [ ] Try screenshot comparisons.
- [ ] Mock API responses.
- [ ] Tag and filter tests.
- [ ] Configure multiple browser projects.

## 3. Reusability Patterns

| Pattern | Description | Example |
| --- | --- | --- |
| Page Object Model | Encapsulate page or component interactions | `loginPage.login(username, password)` |
| Helper Functions | Reuse common operations | `fillForm(page, data)` |
| Fixtures | Provide reusable dependencies and lifecycle management | `test.extend({ userSession: ... })` |
| Environment Variables | Supply environment-specific configuration | `process.env.BASE_URL` |
| Storage State | Initialize contexts with saved authentication state | `test.use({ storageState: 'playwright/.auth/user.json' })` |

**Notes:**

- Load `.env` files explicitly if your setup uses them.
- Keep credentials and authentication-state files out of Git.
- Avoid sharing mutable server-side data between parallel tests.

## 4. Suggested Folder Structure

| Path | Purpose |
| --- | --- |
| `tests/login.spec.ts` | Login test scenarios |
| `tests/dashboard.spec.ts` | Dashboard test scenarios |
| `tests/auth.setup.ts` | Authentication setup |
| `pages/login.page.ts` | Login page object |
| `pages/dashboard.page.ts` | Dashboard page object |
| `utils/helpers.ts` | Reusable helper functions |
| `utils/test-data.ts` | Test data and data builders |
| `fixtures/test.ts` | Custom test fixtures |
| `playwright/.auth/` | Generated authentication state; exclude from Git |
| `playwright.config.ts` | Test runner configuration |

## 5. Useful CLI Commands

### Install Playwright Test

```bash
npm init playwright@latest
```

### Run All Tests

```bash
npx playwright test
```

### Run One Test File

```bash
npx playwright test tests/login.spec.ts
```

### Run in Headed Mode

```bash
npx playwright test --headed
```

### Debug Tests

```bash
npx playwright test --debug
```

### Open UI Mode

```bash
npx playwright test --ui
```

### View the HTML Report

```bash
npx playwright show-report
```

### Generate Test Code

```bash
npx playwright codegen https://example.com
```

### Run a Configured Browser Project

```bash
npx playwright test --project=chromium
```

### Filter by Test Title or Tag

```bash
npx playwright test --grep "@smoke"
```

## 6. Seven Useful Playwright Features

### 1. Trace Viewer

Trace Viewer helps investigate failed tests, especially in CI.

A trace can include:

- Action timelines.
- DOM snapshots.
- Screenshots.
- Network activity.
- Console messages.

**Practice:** Enable tracing, reproduce a failure, and inspect the actions leading to it.

### 2. Auto-Waiting

Playwright actions automatically wait for relevant actionability checks, such as visibility, stability, and whether an element can receive events.

Auto-retrying assertions wait for their expected condition.

```typescript
await page.getByRole('button', { name: 'Submit' }).click();

await expect(
  page.getByText('Saved successfully')
).toBeVisible();
```

**Remember:** Auto-waiting does not understand every application-specific readiness condition. Use locators and assertions that express the required state instead of fixed delays.

### 3. Test Generator — Codegen

Codegen records browser interactions and generates test code.

It is useful for:

- Learning locator syntax.
- Creating an initial test skeleton.
- Exploring application interactions.

**Remember:** Review generated code, improve locators, and add meaningful assertions.

### 4. Network Interception

Control network responses to test scenarios without relying on backend behavior.

```typescript
await page.route('**/api/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'Ganesh' }
    ])
  });
});
```

**Practice:**

- Return an empty response.
- Simulate a server error.
- Test slow responses.
- Verify loading and error states.

### 5. Browser Contexts

Playwright Test provides an isolated browser context for each test by default.

Contexts isolate browser state such as cookies and local storage.

This supports:

- Independent tests.
- Parallel execution.
- Multiple user sessions.

**Important:** Browser isolation does not isolate backend records. Tests still need independent data or appropriate cleanup.

### 6. Built-in API Testing

Use the `request` fixture to call APIs.

```typescript
import { test, expect } from '@playwright/test';

test('loads users through the API', async ({ request }) => {
  const response = await request.get('/api/users');

  expect(response.ok()).toBeTruthy();

  const users = await response.json();

  expect(Array.isArray(users)).toBe(true);
});
```

This example assumes `baseURL` is configured.

**Uses:**

- Test API responses.
- Create test data.
- Prepare preconditions before UI tests.
- Clean up test records.

### 7. Multi-Browser Testing

Run tests across:

- Chromium.
- Firefox.
- WebKit.

This helps catch browser-engine differences.

**Precision:** WebKit testing is useful for Safari-related compatibility, but it is not identical to testing the installed Safari browser.

## 7. Final Practice Checklist

- [ ] Complete the basic Playwright setup.
- [ ] Write two or three sample test cases.
- [ ] Create a page object for at least one page.
- [ ] Implement reusable authentication setup.
- [ ] Save and reuse authentication state.
- [ ] Keep authentication files and secrets out of Git.
- [ ] Debug a failure using Trace Viewer.
- [ ] Run tests through the CLI.
- [ ] Configure a CI workflow.
- [ ] Try different browser and device configurations.
- [ ] Group and tag test scenarios.
- [ ] Mock one success response and one failure response.
- [ ] Write at least one API test.
- [ ] Verify tests can run independently.

## Reference

[LinkedIn post: Seven Playwright features](https://www.linkedin.com/posts/manojbind23_7-playwright-features-most-testers-dont-activity-7419340606663184386-QQbV)

## Key Learning

Go beyond recording basic UI interactions.

Focus on reliable locators, meaningful assertions, test isolation, reusable setup, network control, and failure investigation.
