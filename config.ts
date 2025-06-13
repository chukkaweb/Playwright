Package.json node version 22.15.9 use 

✅ Basic Structure of `playwright.config.ts`
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'https://example.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
🔹 Core Config Options

| Option           | Description                                                  |
| - |  |
| `testDir`        | Folder where test files are located                          |
| `timeout`        | Timeout for each test (in ms)                                |
| `expect.timeout` | Timeout for assertions like `expect(page).toHaveText(...)`   |
| `retries`        | Number of times to retry failed tests                        |
| `workers`        | Number of parallel test workers (threads)                    |
| `reporter`       | Built-in or custom reporters (e.g., `html`, `list`, `junit`) |

🔹 `use` Options (shared for all tests)

| Option              | Description                                 |
| - | - |
| `baseURL`           | Base URL for all `page.goto()` calls        |
| `headless`          | Run browser in headless mode                |
| `viewport`          | Default browser size                        |
| `locale`            | Set browser language                        |
| `timezoneId`        | Set browser timezone                        |
| `colorScheme`       | `'light'` or `'dark'`                       |
| `userAgent`         | Custom user agent string                    |
| `permissions`       | e.g., `['geolocation']`                     |
| `geolocation`       | Latitude & longitude coordinates            |
| `storageState`      | Path to `.json` file with logged-in session |
| `video`             | `'on'`, `'off'`, `'retain-on-failure'`      |
| `screenshot`        | `'on'`, `'only-on-failure'`, `'off'`        |
| `trace`             | `'on'`, `'off'`, `'retain-on-failure'`      |
| `ignoreHTTPSErrors` | Ignore HTTPS errors during navigation       |


🔹 `projects` Option

Used for:

* Running tests across **multiple browsers**
* Emulating **devices** (e.g., mobile)
* Running **parallel test setups**
projects: [
  { name: 'Chrome', use: { ...devices['Desktop Chrome'] } },
  { name: 'iPhone', use: { ...devices['iPhone 13'] } },
],


🔹 `reporter` Examples

reporter: [
  ['list'],                    // simple console output
  ['html', { open: 'never' }], // HTML report
  ['junit', { outputFile: 'results.xml' }] // CI-friendly
],

🔹 Advanced Options

| Option                 | Description                                    |
| - | - |
| `globalSetup`          | Script to run before all tests                 |
| `globalTeardown`       | Script after all tests finish                  |
| `outputDir`            | Folder for screenshots/videos/traces           |
| `snapshotPathTemplate` | Pattern to save screenshots for visual testing |
| `metadata`             | Add custom info like test suite metadata       |
| `fullyParallel`        | Run tests fully parallel without sharding      |



✅ Example Use Case: Auth via Storage State


use: {
  storageState: 'auth.json',
}


You can create `auth.json` via a login test and reuse the session.

✅ Example Use Case: CI and Retry Strategy
retries: process.env.CI ? 2 : 0,
reporter: process.env.CI ? 'junit' : 'html',




✅ Example Use Case: Mobile View + Dark Mode
use: {
  ...devices['Pixel 5'],
  colorScheme: 'dark',
}




Would you like me to add this list to your Playwright Notes in Canvas?
