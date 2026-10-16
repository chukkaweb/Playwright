# Playwright with TypeScript — Practical Notes

Playwright automates browsers. Playwright Test adds a test runner, assertions, fixtures, reports, retries, and parallel execution.

These notes cover setup, reliable tests, reusable architecture, and CI.

> Application-specific examples assume your app has the illustrated routes, labels, and test IDs. Adapt them to your application.

## Learning Order

1. Setup and CLI commands.
2. Browser, Context, Page, and async/await.
3. Configuration and your first test.
4. Locators, actions, assertions, and waiting.
5. Hooks, grouping, tags, and data-driven tests.
6. Page Object Model and fixtures.
7. Authentication and storage state.
8. API testing, mocking, and browser events.
9. Timeouts, retries, debugging, and reports.
10. Projects, emulation, parallel execution, and CI.

## 1. Setup and Environment

### Prerequisites

- A Node.js version supported by your installed Playwright release.
- npm.
- An editor such as VS Code.
- Basic TypeScript and Promise knowledge.

```bash
node --version
npm --version
```

### Recommended Setup

```bash
npm init playwright@latest
```

The initializer helps configure tests, browser installation, and an optional GitHub Actions workflow.

### Manual Setup

```bash
npm init -y
npm install -D @playwright/test
npx playwright install
```

Browser installation downloads browser binaries; it does not create your test architecture.

### TypeScript Support

Playwright transforms TypeScript and runs it directly.

It does not replace static type checking. Run a separate check with a suitable `tsconfig.json`:

```bash
npx tsc --noEmit
```

For JavaScript files, `// @ts-check` can enable editor type checking.

### Useful .gitignore Entries

```gitignore
node_modules/
test-results/
playwright-report/
blob-report/
playwright/.auth/
.env
.env.*
!.env.example
```

Commit the package lockfile. Do not commit credentials or saved authentication state.

## 2. CLI Commands

| Command | Purpose |
| --- | --- |
| `npx playwright test` | Run discovered tests |
| `npx playwright test tests/login.spec.ts` | Run one test file |
| `npx playwright test -g "valid login"` | Filter by title |
| `npx playwright test --grep "@smoke"` | Filter by tag or matching title |
| `npx playwright test --list` | List discovered tests without running |
| `npx playwright test --headed` | Show the browser |
| `npx playwright test --debug` | Debug with Playwright Inspector |
| `npx playwright test --ui` | Open UI Mode |
| `npx playwright test --project=chromium` | Run a configured project |
| `npx playwright test --workers=1` | Use one worker |
| `npx playwright test --retries=2` | Allow two retries |
| `npx playwright test --reporter=html` | Generate an HTML report |
| `npx playwright show-report` | Open the HTML report |
| `npx playwright install` | Install default browser binaries |
| `npx playwright install chromium` | Install Chromium |
| `npx playwright install --with-deps` | Install browsers and OS dependencies |
| `npx playwright codegen https://example.com` | Record browser interactions |
| `npx playwright show-trace path/to/trace.zip` | Open a trace |

**Correction:** Use `npx playwright test --list`, not `npx playwright list`.

## 3. Core Concepts

### Simple Understanding

Imagine a browser as a building:

- **Browser:** The building.
- **Context:** An isolated apartment with its own browser storage.
- **Page:** A tab inside that apartment.
- **Locator:** Instructions for finding an element.

| Concept | Meaning |
| --- | --- |
| Browser | Chromium, Firefox, or WebKit instance |
| Browser Context | Isolated browser session |
| Page | A browser tab or popup |
| Locator | Reusable way to locate elements |
| Action | Interaction such as click or fill |
| Assertion | Check an expected result |
| Fixture | Managed test dependency with setup and teardown |
| Project | Named test configuration |
| Worker | Process executing tests |

### Built-in Fixtures

```typescript
import { test, expect } from '@playwright/test';

test('opens the homepage', async ({ page }) => {
  await page.goto('https://example.com');

  await expect(page).toHaveTitle(/Example Domain/);
});
```

Playwright Test manages the `page` and its context.

The browser is typically reused within a worker, while each test receives a fresh context by default.

### Manual Context Creation

Useful for multiple users in one test:

```typescript
test('creates isolated sessions', async ({ browser }) => {
  const firstContext = await browser.newContext();
  const secondContext = await browser.newContext();

  try {
    const firstPage = await firstContext.newPage();
    const secondPage = await secondContext.newPage();

    await firstPage.goto('https://example.com');
    await secondPage.goto('https://example.com');

    await expect(firstPage).toHaveTitle(/Example Domain/);
    await expect(secondPage).toHaveTitle(/Example Domain/);
  } finally {
    await firstContext.close();
    await secondContext.close();
  }
});
```

**Important:** Browser isolation does not isolate backend data. Parallel tests still need independent records or cleanup.

## 4. async and await

### Simple Understanding

`await` means:

> Wait for this operation before continuing this async function.

It does not block the whole JavaScript thread.

```typescript
test('submits a form', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('test-password');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
});
```

### What Needs await?

- Browser actions.
- Navigation.
- Event promises.
- Async assertions.
- Async helper methods.

Locator creation itself is synchronous:

```typescript
const button = page.getByRole('button', { name: 'Save' });

await button.click();
```

**Memory:** Create the locator; await the operation.

## 5. Basic Configuration

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,

  expect: {
    timeout: 5_000
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4200',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
```

### Configuration Placement

| Top Level | Inside use |
| --- | --- |
| `testDir` | `baseURL` |
| `timeout` | `headless` |
| `retries` | `viewport` |
| `workers` | `storageState` |
| `projects` | `screenshot` |
| `reporter` | `video` |
| `fullyParallel` | `trace` |

### Starting the App Automatically

Add this top-level option if Playwright should start your local app:

```typescript
webServer: {
  command: 'npm run start',
  url: 'http://localhost:4200',
  reuseExistingServer: !process.env.CI,
  timeout: 120_000
}
```

The command and URL must match your project.

If testing an already running deployment, `webServer` is unnecessary.

## 6. Your First Test

### tests/home.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test('homepage displays its title and heading', async ({ page }) => {
  await page.goto('https://example.com');

  await expect(page).toHaveTitle(/Example Domain/);

  await expect(
    page.getByRole('heading', { name: 'Example Domain' })
  ).toBeVisible();
});
```

### Structure

1. **Arrange:** Open the page and prepare data.
2. **Act:** Perform an interaction where needed.
3. **Assert:** Verify the user-visible result.

A useful test checks behavior, not just whether an action completed without throwing.

## 7. Locators

### What Is a Locator?

A locator describes how to find an element.

It resolves elements when used, making it suitable for pages that rerender.

### Preferred Locators

| Method | Example |
| --- | --- |
| Role and accessible name | `page.getByRole('button', { name: 'Save' })` |
| Label | `page.getByLabel('Email')` |
| Text | `page.getByText('Saved successfully', { exact: true })` |
| Placeholder | `page.getByPlaceholder('Search products')` |
| Test ID | `page.getByTestId('cart-count')` |
| Alternative text | `page.getByAltText('Company logo')` |
| Title attribute | `page.getByTitle('Help')` |

Prefer user-facing semantics. Use test IDs as explicit contracts when appropriate.

Role-based locators are useful, but they do not replace accessibility testing.

### CSS Selectors

```typescript
page.locator('#username');             // ID
page.locator('.alert');                // Class
page.locator('input[name="email"]');   // Attribute
page.locator('button[type="submit"]'); // Tag and attribute
```

**Correction:**

```typescript
page.locator('username');
```

This selects a `<username>` element. It does not select `id="username"`.

### Scope and Filter

```typescript
const product = page
  .getByRole('listitem')
  .filter({ hasText: 'Laptop' });

await product
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

### Strictness

Actions requiring one element fail if multiple elements match.

Fix the locator instead of adding `.first()` without understanding the ambiguity.

Use positional locators only when position is part of the requirement.

### Locator vs ElementHandle

| Locator | ElementHandle |
| --- | --- |
| Resolves matching elements when used | References a particular DOM element |
| Recommended for normal tests | Lower-level API, generally discouraged |
| Works naturally with retrying assertions | Can become detached after rerendering |

Prefer locators over `page.$()` and `page.$$()`.

## 8. CSS vs XPath

| Feature | CSS | XPath |
| --- | --- | --- |
| ID | `#email` | `//*[@id="email"]` |
| Attribute | `input[name="email"]` | `//input[@name="email"]` |
| Direct child | `.form > input` | `//form/input` |
| Descendant | `.form input` | `//form//input` |
| Ancestor relationships | Relational selectors such as `:has()` can help | Explicit axes such as `ancestor::` |
| Shadow DOM | Playwright CSS locators generally pierce open shadow roots | XPath does not pierce shadow roots |

### XPath Example

```typescript
await page
  .locator('//input[@name="email"]')
  .fill('user@example.com');
```

### Useful XPath Patterns

| Pattern | Meaning |
| --- | --- |
| `//input` | All input elements |
| `//input[@type="email"]` | Input with the specified type |
| `//button[normalize-space(.)="Save"]` | Button with normalized text |
| `//input[starts-with(@id, "user")]` | ID starts with `user` |
| `(//input)[1]` | First matching input; XPath indexing is one-based |

**Notes:**

- Playwright has text locators; XPath is not required for text matching.
- Standard CSS does not select by text content, but Playwright provides additional selector capabilities.
- Avoid copied absolute XPath and long structural CSS chains.
- Choose selectors for stability and meaning, not assumed speed differences.

## 9. Actions and Interactions

| Action | Example |
| --- | --- |
| Click | `await page.getByRole('button', { name: 'Save' }).click()` |
| Fill input | `await page.getByLabel('Email').fill('user@example.com')` |
| Press key | `await page.getByLabel('Search').press('Enter')` |
| Sequential keyboard input | `await page.getByLabel('Search').pressSequentially('Angular')` |
| Check | `await page.getByLabel('Accept terms').check()` |
| Uncheck | `await page.getByLabel('Accept terms').uncheck()` |
| Native select | `await page.getByLabel('Country').selectOption('IN')` |
| Hover | `await page.getByRole('button', { name: 'Account' }).hover()` |
| Upload | `await page.getByLabel('Upload file').setInputFiles('tests/files/sample.pdf')` |

### Important Notes

- Prefer `fill()` for normal inputs.
- Use `pressSequentially()` when per-key behavior matters.
- `selectOption()` is for native `<select>` elements.
- Custom dropdowns usually require clicking the control and selecting an option.
- Radio buttons can use `check()`.
- Use locator-based APIs instead of older page-level selector methods.

### Drag and Drop

```typescript
await page.getByTestId('source')
  .dragTo(page.getByTestId('target'));
```

## 10. Assertions

### Auto-Retrying Assertions

```typescript
await expect(page.getByRole('heading')).toHaveText('Dashboard');

await expect(page.getByRole('button', { name: 'Save' }))
  .toBeEnabled();

await expect(page.getByLabel('Email'))
  .toHaveValue('user@example.com');

await expect(page.getByLabel('Accept terms')).toBeChecked();

await expect(page.getByTestId('product')).toHaveCount(3);

await expect(page).toHaveURL(/\/dashboard/);
```

These wait for the expected condition within the assertion timeout.

### Immediate Value Assertions

```typescript
expect(2 + 2).toBe(4);
expect(['Angular', 'React']).toContain('Angular');
```

These do not automatically retry.

### Avoid Snapshotting a Changing Condition

Less reliable:

```typescript
expect(await page.getByTestId('success').isVisible()).toBe(true);
```

Prefer:

```typescript
await expect(page.getByTestId('success')).toBeVisible();
```

`isVisible()` reads the current state; it does not wait for visibility.

### Hard vs Soft Assertions

| Assertion | On Failure |
| --- | --- |
| Hard | Stops the current test's normal execution |
| Soft | Records failure and allows execution to continue |

```typescript
await expect.soft(page.getByLabel('Email')).toBeVisible();

await expect.soft(page.getByRole('button', { name: 'Save' }))
  .toBeEnabled();
```

A failed soft assertion still makes the test fail.

Use hard assertions for prerequisites that later steps depend on.

### Checking At Least One Search Result

```typescript
await expect(page.getByTestId('product').first()).toBeVisible();
```

There is no standard locator assertion named `toHaveCountGreaterThan()`.

## 11. Auto-Waiting and Synchronization

### Simple Understanding

Playwright waits for actions to be possible. Your assertions wait for business outcomes.

For example, clicking Save does not automatically prove that saving finished.

```typescript
await page.getByRole('button', { name: 'Save' }).click();

await expect(page.getByRole('status'))
  .toHaveText('Saved successfully');
```

### Avoid Fixed Delays

```typescript
// Avoid:
await page.waitForTimeout(3000);
```

A fixed delay can be too short on CI and unnecessarily long locally.

### Wait for a Specific Response

Register the wait before triggering the request:

```typescript
const responsePromise = page.waitForResponse(response =>
  response.url().endsWith('/api/orders') &&
  response.request().method() === 'POST'
);

await page.getByRole('button', { name: 'Place order' }).click();

const response = await responsePromise;

expect(response.status()).toBe(201);

await expect(page.getByRole('status'))
  .toContainText('Order created');
```

Prefer explicit UI readiness over generic waits such as `networkidle`.

## 12. Hooks and Test Grouping

| Hook | Purpose |
| --- | --- |
| `beforeEach` | Setup before every test |
| `afterEach` | Cleanup after every test |
| `beforeAll` | Setup for a worker's execution of a suite |
| `afterAll` | Cleanup for that worker's suite execution |

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('shows required fields', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('password is masked', async ({ page }) => {
    await expect(page.getByLabel('Password'))
      .toHaveAttribute('type', 'password');
  });
});
```

### Important Notes

- Test-scoped fixtures such as `page` belong in tests and `beforeEach`, not `beforeAll`.
- `beforeAll` can run again when a failed worker is replaced.
- Do not assume hooks run exactly once across all workers and retries.
- Avoid making tests depend on a previous test.

## 13. Tags and Annotations

### Tag a Test

```typescript
test(
  'user can sign in',
  { tag: ['@smoke', '@auth'] },
  async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('button', { name: 'Sign in' }))
      .toBeVisible();
  }
);
```

Run tagged tests:

```bash
npx playwright test --grep "@smoke"
```

A comment such as `// @smoke` alone does not tag a test.

### Common Modifiers

| API | Meaning |
| --- | --- |
| `test.skip()` | Do not execute |
| `test.fixme()` | Do not execute; known issue needs fixing |
| `test.fail()` | Execute and expect failure |
| `test.slow()` | Triple the test timeout |
| `test.only()` | Focus execution; remove before committing |

Set `forbidOnly` on CI to catch accidental focused tests.

**Correction:** `test.info().retry` reports the current retry index. It does not configure retries.

## 14. Data-Driven Tests

Use a loop to create separately reported cases with unique titles.

```typescript
const cases = [
  { name: 'missing email', email: '', password: 'example' },
  { name: 'missing password', email: 'user@example.com', password: '' }
];

for (const item of cases) {
  test(`rejects ${item.name}`, async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(item.email);
    await page.getByLabel('Password').fill(item.password);

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByTestId('validation-error')).toBeVisible();
  });
}
```

Keep real credentials in environment variables or a secret manager.

## 15. Page Object Model

### Simple Understanding

A page object puts reusable page interactions in one place.

Tests describe behavior; page objects describe how to interact with the UI.

### pages/login.page.ts

```typescript
import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly signInButton: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
  }
}
```

### tests/login.spec.ts

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('valid user reaches dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing E2E_EMAIL or E2E_PASSWORD');
  }

  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(page).toHaveURL(/\/dashboard/);
});
```

### Notes

- Keep page objects focused.
- Reuse component objects for shared widgets.
- Do not hide every assertion behind a generic helper.
- Calling a plain TypeScript class directly tests its logic; it does not verify Angular rendering, dependency injection, or browser behavior.

## 16. Custom Fixtures

Fixtures provide reusable dependencies with managed setup and teardown.

They are more than hooks: fixtures can depend on other fixtures and have test or worker scope.

### fixtures/test.ts

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type AppFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await use(loginPage);

    // Optional fixture-specific teardown goes here.
  }
});

export { expect };
```

### Use the Fixture

```typescript
import { test, expect } from '../fixtures/test';

test('login form is ready', async ({ loginPage }) => {
  await expect(loginPage.email).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();
});
```

### Fixture Lifecycle

1. Prepare the dependency.
2. Call `await use(value)` to run the consumer.
3. Perform teardown after `use()` completes.

**Correction:**

- Define fixtures with `test.extend()`.
- Configure fixture values/options with `test.use()`.

## 17. Authentication and Storage State

### Why Reuse Authentication?

Most feature tests should begin authenticated instead of repeating the login UI.

Keep dedicated tests for login itself.

### tests/auth.setup.ts

```typescript
import { test as setup, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing E2E_EMAIL or E2E_PASSWORD');
  }

  await page.goto('/login');

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await mkdir('playwright/.auth', { recursive: true });

  await page.context().storageState({
    path: 'playwright/.auth/user.json'
  });
});
```

### Project Dependencies

Replace the basic config's projects with:

```typescript
projects: [
  {
    name: 'setup',
    testMatch: /.*\.setup\.ts/
  },
  {
    name: 'chromium',
    testIgnore: /.*\.setup\.ts/,
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json'
    },
    dependencies: ['setup']
  }
]
```

The setup project runs before dependent tests.

### Important Notes

- Saved state contains sensitive authentication data.
- Keep it out of Git.
- Storage state covers cookies and local storage; IndexedDB capture is available when explicitly enabled.
- Session storage is not automatically persisted by this mechanism.
- Reusing authentication does not mean tests share a browser context.
- Tests mutating the same account can conflict. Use separate accounts or data where needed.
- Authentication expiry and logout scenarios need deliberate handling.

## 18. Environment Configuration

### Optional dotenv Setup

```bash
npm install -D dotenv
```

At the top of `playwright.config.ts`:

```typescript
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.ENV_FILE ?? '.env'
});
```

### Example Environment Template

```dotenv
BASE_URL=http://localhost:4200
E2E_EMAIL=
E2E_PASSWORD=
```

Commit a template such as `.env.example`, not the file containing secrets.

Use CI secrets for pipeline credentials.

Avoid destructive tests against production unless that behavior is explicitly intended and controlled.

## 19. API Testing

The `request` fixture supports API calls without driving browser UI.

```typescript
import { test, expect } from '@playwright/test';

test('GET users returns a list', async ({ request }) => {
  const response = await request.get('/api/users');

  expect(response.status()).toBe(200);

  const users = await response.json();

  expect(Array.isArray(users)).toBe(true);
});
```

### Uses

- Validate API contracts.
- Create test data.
- Prepare UI preconditions.
- Clean up records.

`page.request` shares cookies with its browser context. The standalone `request` fixture uses a separate API request context.

**Memory:** Use API setup to make UI tests faster; keep UI tests focused on UI behavior.

## 20. Network Mocking

Register routes before triggering the request.

```typescript
test('shows an error when users fail to load', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unavailable' })
    });
  });

  await page.goto('/users');

  await expect(page.getByRole('alert'))
    .toContainText('Unable to load users');
});
```

### Useful Scenarios

- Empty data.
- Server errors.
- Slow responses.
- Specific business edge cases.

**Tradeoff:** Mocked UI tests verify behavior under a simulated contract. They do not prove the real backend integration works.

## 21. Dialogs, Popups, Downloads, and Frames

### Browser Dialog

Register the handler before triggering the dialog:

```typescript
page.once('dialog', async dialog => {
  await dialog.accept();
});

await page.getByRole('button', { name: 'Delete' }).click();
```

If you register a dialog listener, it must accept or dismiss the dialog.

### Popup

```typescript
const popupPromise = page.waitForEvent('popup');

await page.getByRole('link', { name: 'Open report' }).click();

const popup = await popupPromise;

await expect(popup).toHaveURL(/\/report/);
```

### Download

```typescript
const downloadPromise = page.waitForEvent('download');

await page.getByRole('button', { name: 'Export' }).click();

const download = await downloadPromise;

await download.saveAs(test.info().outputPath('report.csv'));
```

### iframe

```typescript
const frame = page.frameLocator('iframe[title="Payment"]');

await frame.getByLabel('Card number').fill('test-card-value');
```

**Memory:** Start waiting for an event before performing the action that triggers it.

## 22. Timeouts

| Timeout | Purpose |
| --- | --- |
| Test timeout | Bounds a test's execution budget |
| Expect timeout | Bounds auto-retrying assertions |
| Action timeout | Bounds individual actions |
| Navigation timeout | Bounds navigation operations |
| Global timeout | Bounds the overall test run |

Common defaults:

- Test timeout: 30 seconds.
- Assertion timeout: 5 seconds.

### Global Configuration

```typescript
export default defineConfig({
  timeout: 30_000,

  expect: {
    timeout: 5_000
  },

  globalTimeout: 3_600_000,

  use: {
    actionTimeout: 10_000,
    navigationTimeout: 30_000
  }
});
```

### Per Test

```typescript
test('large report completes', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto('/reports');

  await expect(page.getByText('Report ready'))
    .toBeVisible({ timeout: 60_000 });
});
```

`test.slow()` triples the configured test timeout.

**Important:** Increasing a timeout does not fix a wrong locator or broken application.

## 23. Retries

Retries rerun a failing test.

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0
});
```

Two retries allow up to three attempts.

### Result Categories

| Result | Meaning |
| --- | --- |
| Passed | Passed initially |
| Flaky | Failed initially but passed on retry |
| Failed | Failed all allowed attempts |

### Worker Behavior

After a failure, Playwright discards the worker and starts a replacement. Worker-level setup may therefore run again.

### Important Notes

- Retries are not a substitute for fixing flakiness.
- Repeated writes can create duplicate backend records.
- Use unique data and reliable cleanup.
- Investigate flaky tests instead of treating the retry as success.

## 24. Debugging and Trace Viewer

### Debug Commands

```bash
npx playwright test tests/login.spec.ts --debug
npx playwright test --ui
```

### Pause in a Test

```typescript
await page.pause();
```

Use this during local debugging and remove it before CI runs.

### Trace Configuration

```typescript
use: {
  trace: 'retain-on-failure'
}
```

Another option:

```typescript
use: {
  trace: 'on-first-retry'
}
```

`on-first-retry` records only when the first retry occurs. With retries disabled, it will not capture a trace.

### Open a Trace

```bash
npx playwright show-trace path/to/trace.zip
```

### Investigate

- Which action failed?
- Did the locator match?
- Was the element visible and actionable?
- What did the DOM contain?
- Did the API fail?
- Were there browser console errors?

Traces may contain sensitive application data. Handle them appropriately.

## 25. Screenshots, Video, and Visual Assertions

### Manual Screenshot

```typescript
await page.screenshot({
  path: test.info().outputPath('page.png'),
  fullPage: true
});
```

### Automatic Artifacts

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
}
```

### Visual Comparison

```typescript
await expect(page).toHaveScreenshot('dashboard.png');
```

A screenshot artifact is not automatically a visual regression test. Visual assertions compare against baselines.

Keep the browser, OS, fonts, and data consistent when generating and comparing baselines.

## 26. Codegen

Codegen records interactions and generates test code.

```bash
npx playwright codegen https://example.com
```

### Save Authentication During Recording

```bash
npx playwright codegen \
  --save-storage=playwright/.auth/user.json \
  https://example.com
```

### Reuse Saved State

```bash
npx playwright codegen \
  --load-storage=playwright/.auth/user.json \
  https://example.com
```

### After Recording

- Review locators.
- Add meaningful assertions.
- Remove duplication.
- Extract reusable logic only where useful.
- Keep tests independent.

**Memory:** Codegen creates a starting point, not a finished test suite.

## 27. Projects and Parallel Execution

### Projects

A project is a named configuration, such as a browser, device, or authenticated role.

```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] }
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] }
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] }
  }
]
```

WebKit testing is not identical to testing the installed Safari browser.

### Parallelism

- Test files run in parallel by default, subject to available workers.
- Tests within a file normally run in order.
- `fullyParallel: true` allows eligible tests within files to run in parallel.
- `workers` controls concurrent worker processes.
- Projects define configurations; they are not the same as workers.

### CI Sharding

```bash
npx playwright test --shard=1/3
```

Sharding divides a suite across separate runs or machines.

**Senior point:** Increasing workers helps only if the app, test data, and CI resources can support the extra load.

## 28. Emulation

Emulation changes browser context settings; it does not replace testing on real hardware.

### Mobile Device

```typescript
test.use({
  ...devices['Pixel 5']
});
```

### Locale, Timezone, Location, and Theme

```typescript
test.use({
  viewport: { width: 1280, height: 720 },
  locale: 'en-IN',
  timezoneId: 'Asia/Kolkata',
  geolocation: {
    latitude: 17.385,
    longitude: 78.4867
  },
  permissions: ['geolocation'],
  colorScheme: 'dark'
});
```

### Uses

- Responsive layout.
- Location-based content.
- Localization.
- Timezone-sensitive behavior.
- Dark mode.

Timezone configuration changes the timezone, not the current instant.

## 29. CI with GitHub Actions

### .github/workflows/playwright.yml

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test
        env:
          BASE_URL: ${{ vars.E2E_BASE_URL }}
          E2E_EMAIL: ${{ secrets.E2E_EMAIL }}
          E2E_PASSWORD: ${{ secrets.E2E_PASSWORD }}

      - name: Upload report
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

### CI Notes

- Commit `package-lock.json` for `npm ci`.
- Configure a reachable test deployment or use `webServer`.
- Use dedicated test accounts.
- Secrets are generally unavailable to pull requests from forks.
- Restrict access to reports containing sensitive data.
- For reproducible builds, pin your team's supported Node version.
- Diagnose resource contention before increasing workers or retries.

## 30. Suggested Project Structure

| Path | Purpose |
| --- | --- |
| `tests/*.spec.ts` | User-facing test scenarios |
| `tests/auth.setup.ts` | Authentication setup project |
| `pages/*.page.ts` | Page objects |
| `components/` | Reusable component objects |
| `fixtures/test.ts` | Typed custom fixtures |
| `utils/` | Focused helpers |
| `test-data/` | Data builders and non-secret datasets |
| `tests/files/` | Upload fixtures |
| `playwright/.auth/` | Generated authentication state |
| `playwright.config.ts` | Runner configuration |
| `.github/workflows/playwright.yml` | CI workflow |

Supporting files can be `.ts`; test files commonly use `.spec.ts`.

Add layers only when they solve real repetition. Avoid unnecessary `steps`, `common`, and helper abstractions for a small suite.

## 31. Practical Test Scenarios

| Feature | Useful Cases |
| --- | --- |
| Text input | Required, valid, invalid, boundary length |
| Password | Masking, validation, show/hide |
| Login | Valid, invalid credentials, server error |
| Select | Default and changed selection |
| Checkbox | Default, check/uncheck, required validation |
| Radio group | Selection and mutual exclusivity |
| Upload | Valid file, invalid type, size limit |
| Search | Matches, no results, empty input, stale response handling |
| Network failure | Error message and recovery |
| Authentication | Protected route, expired session, logout |

Choose cases by business risk, not an arbitrary test count.

## 32. Best Practices

- Test user-visible behavior.
- Prefer semantic locators and explicit test IDs.
- Await asynchronous operations and assertions.
- Avoid fixed waits.
- Assert outcomes after actions.
- Keep tests independent.
- Use API setup where it makes UI tests faster and clearer.
- Isolate mutable test data.
- Use fixtures for lifecycle management.
- Keep POM classes small and focused.
- Reuse authentication without sharing mutable test state.
- Record enough artifacts to investigate failures.
- Monitor and fix flaky tests.
- Keep credentials and authentication state out of Git.
- Test real integrations as well as mocked scenarios.
- Do not use `force: true` to hide interaction problems.
- Prevent committed `test.only()` with `forbidOnly`.
- Run TypeScript checking separately.

## 33. Senior Interview Quick Answers

### Why Playwright?

It supports browser automation with isolated contexts, resilient locators, auto-waiting, retrying assertions, API testing, tracing, and a configurable test runner.

### Why Locators?

Locators resolve elements when used and integrate with Playwright's waiting and assertion behavior, making them suitable for dynamic pages.

### Hooks vs Fixtures?

Hooks organize setup around tests. Fixtures provide named, reusable dependencies with managed lifecycle, scope, and dependency composition.

### POM vs Fixtures?

POM encapsulates UI interactions. Fixtures create and manage dependencies, including page objects. They work together.

### Why Does a Test Pass Locally but Fail in CI?

Possible causes include timing assumptions, shared data, different environments, missing dependencies, expired authentication, or limited resources. Inspect traces and network activity before increasing timeouts.

### How Do You Reduce Flaky Tests?

Use stable locators, assert explicit readiness, isolate data, avoid fixed delays, register event waits before actions, and investigate retry-only passes.

### What Would You Test in an Angular App?

Critical user flows, forms, routing, authentication, API outcomes, loading/error states, and relevant accessibility behavior. Verify rendered behavior rather than Angular implementation details.

## Practice Checklist

- [ ] Install Playwright and run a first test.
- [ ] Use role, label, and test-ID locators.
- [ ] Write positive, negative, and boundary cases.
- [ ] Use auto-retrying assertions.
- [ ] Replace fixed waits with meaningful conditions.
- [ ] Create one focused page object.
- [ ] Create one typed fixture.
- [ ] Add authentication setup and storage state.
- [ ] Write an API test.
- [ ] Mock success and error responses.
- [ ] Handle a dialog, popup, and download.
- [ ] Add data-driven tests and tags.
- [ ] Investigate a failure with Trace Viewer.
- [ ] Run multiple browser projects.
- [ ] Verify tests run independently and in parallel.
- [ ] Run the suite in CI.

## References

- [Getting Started](https://playwright.dev/docs/intro)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Fixtures](https://playwright.dev/docs/test-fixtures)
- [Authentication](https://playwright.dev/docs/auth)
- [Configuration](https://playwright.dev/docs/test-configuration)
- [CI Setup](https://playwright.dev/docs/ci-intro)
- [Video Playlist from Original Notes](https://www.youtube.com/watch?v=N4j4Di1oGGA&list=PLc-TiJDo4UOW-plK9AHkG7MkJuNEPBZx7)
