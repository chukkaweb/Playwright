https://playwright.dev/docs/intro
https://www.youtube.com/watch?v=N4j4Di1oGGA&list=PLc-TiJDo4UOW-plK9AHkG7MkJuNEPBZx7

1. Local Setup & Environment
2. Playwright CLI Commands
3. Common Commands (e.g., test, show-report, debug)
4. Playwright Notes (General overview and context)
5. Your First Playwright Test (TypeScript)
6. Core Concepts in Playwright (Page, Browser, Context, etc.)
7. `async`, `await` – What and Why
8. Locators (Basic)
9. What is a Locator?
10. CSS Selector vs XPath – Quick Comparison Table
11. What is XPath?
12. CSS vs XPath
13. Playwright Built-in Locators
14. What is Codegen?
15. Assertions – Quick Notes
16. Hard Assertion vs Soft Assertion
17. Actions & Interactions (click, fill, select, etc.)
18. What are Hooks in Playwright?
19. Test Grouping in Playwright
20. Common Test Case Examples in Playwright (TypeScript)
21. Annotations in Playwright
22. Timeouts
23. Retries
24. What is Playwright Trace Viewer?
25. What is Emulation in Playwright?
26. Playwright CI Setup (GitHub Actions)
27. Best Practices ✅
28. Handling Authentication / Storage State ✅
29. Fixtures (Custom reusable setup) ✅
30. Parallel Test Execution / Projects ✅
31. Debugging Tests (with Trace, Inspector, Breakpoints) ✅

========= 🛠 Playwright – Local Setup & Environment Notes =========

✅ 1. Prerequisites
Make sure Node.js is installed (`node -v`)
Recommended: Use VS Code and TypeScript

✅ 2. Project Setup (First Time)
npm init playwright@latest
Initializes a Playwright project.
Creates folders like `tests/` and `playwright.config.ts`
Installs browsers (Chromium, Firefox, WebKit)

✅ 3. Folder Structure
my-project/
├── tests/                  Test files (e.g., .spec.ts)
├── playwright.config.ts    Configuration file
├── package.json
├── node_modules/

✅ 4. Installing Manually (Optional Setup)
npm init -y                        Create package.json
npm i -D @playwright/test          Install Playwright test package
npx playwright install             Install browsers


✅ 5. Run Tests Locally
npx playwright test
✅ 6. Open Test Report
npx playwright show-report
✅ 7. Run in Debug Mode
npx playwright test --debug
✅ 8. Environment Variables Setup (Optional)

Create a `.env` file:
BASE_URL=https://example.com
USERNAME=ganesh
PASSWORD=123456
Use `dotenv` (optional):
npm i dotenv

Load in config or tests:
require('dotenv').config();
console.log(process.env.BASE_URL);

✅ 9. VS Code Extension (Optional)
Install Playwright Test for VS Code
Supports:
  Code snippets
  Run/debug tests inline
  Test explorer UI


✅ 10. TypeScript Config (Optional)
If you use TypeScript:
npx tsc --init
Enable `esnext`, `moduleResolution`, and `"types": ["@playwright/test"]`

📌 Tip:
If using Git:
 .gitignore
node_modules/
test-results/
playwright-report/

Let me know if you'd like to add:
✅ Custom config setup
✅ Using `.env` for multiple environments (like dev, stage, prod)
✅ Running in Docker or CI (GitHub Actions, etc.)


 ===== 🎯 Playwright CLI Commands – One-Line Explanations ====== 
| Command                                      | One-Line Explanation                             |
| -- |  |
| `npx playwright test`                        | Runs all tests in the project.                   |
| `npx playwright test tests/login.spec.ts`    | Runs a specific test file.                       |
| `npx playwright test -g "test name"`         | Runs a test with matching title.                 |
| `npx playwright test --debug`                | Runs tests in debug mode with inspector.         |
| `npx playwright show-report`                 | Opens the last HTML test report in browser.      |
| `npx playwright test --ui`                   | Launches interactive UI to run and manage tests. |
| `npx playwright install`                     | Installs all supported browsers.                 |
| `npx playwright install chromium`            | Installs only Chromium browser.                  |
| `npx playwright codegen https://example.com` | Records user actions and generates test code.    |
| `npx playwright test --reporter=html`        | Generates an HTML report for the test run.       |
| `npx playwright list`                        | Lists all discovered test files and test cases.  |

 ========= 📘 Playwright with TypeScript – Common Commands =========

1. Launch Browser
const browser = await chromium.launch({ headless: false });
Launches Chromium browser.
`headless: false` shows the UI.

2. Create New Page
const context = await browser.newContext();
const page = await context.newPage();

Creates a new browser context and page (tab).

3. Navigate to URL
await page.goto('https://example.com');
Opens the given URL.

4. Click Element
await page.click('text=Login');
Clicks the element with text "Login".

5. Type in Input
await page.fill('username', 'Ganesh');
Fills the input with id `username` with the value `'Ganesh'`.

6. Press Key
await page.press('input', 'Enter');
Simulates pressing a key like `Enter`.

7. Wait for Element
await page.waitForSelector('message');
Waits until the element appears on the page.

8. Check Visibility
const isVisible = await page.isVisible('logout');
Returns `true` if the element is visible.

9. Get Text Content
const text = await page.textContent('.alert');
Gets the text from an element.

10. Take Screenshot
await page.screenshot({ path: 'screenshot.png' });
Takes a screenshot of the page.

11. Close Browser
await browser.close();

Closes the browser.
🛠 Basic Example
import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com');
  await page.click('text=More information');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();

========= 📝 Playwright Notes – With TypeScript (Simple & Clear) =========
✅ What is Playwright?
Playwright is an open-source end-to-end testing framework for web apps.
Developed by Microsoft.
Supports Chromium, Firefox, and WebKit.
Works with JavaScript/TypeScript, supports headless/headful, screenshots, videos, etc.

🎯 Why Playwright?
Cross-browser testing (Chrome, Firefox, Safari).
Auto-wait for elements.
Supports parallel execution.
Built-in test runner with TypeScript support.
Useful features like codegen, trace viewer, test retries, etc.

🧱 Folder Structure (Default)
my-project/
├── tests/                Test files
├── playwright.config.ts  Config file
├── package.json
├── test-results/         Test reports and traces

📦 Install Playwright
npm init playwright@latest
Sets up everything: Browsers, config, and example tests.
  
🚀 Basic Test Example
import { test, expect } from '@playwright/test';
test('homepage has title', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});

📘 Why is this important in Playwright?
Playwright is asynchronous, because most operations (like page actions) return Promises.
✅ Example:
test('Login Test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.fill('username', 'ganesh');
  await page.fill('password', 'secret123');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/dashboard/);
});


========= ✅ Your First Playwright Test (TypeScript) =========
📁 Folder Structure (after `npx playwright install`)
my-playwright-project/
├── tests/
│   └── first-test.spec.ts
├── playwright.config.ts

🧪 Test File: `first-test.spec.ts`
import { test, expect } from '@playwright/test';
test('homepage should have title and login button', async ({ page }) => {
  // Step 1: Navigate to page
  await page.goto('https://example.com');
  // Step 2: Check the page title
  await expect(page).toHaveTitle(/Example Domain/);
  // Step 3: Check if a specific element is visible
  const moreInfoLink = page.locator('text=More information');
  await expect(moreInfoLink).toBeVisible();
  // Step 4: Click a link
  await moreInfoLink.click();
  // Optional: Assert the new page URL or content
  await expect(page).toHaveURL(/iana\.org/);
});

▶️ How to Run the Test
npx playwright test
✅ Output

Playwright runs the test and shows a report in the terminal:
✔  1 passed (3s)

💡 Tip:
If you want to see it in the browser:
npx playwright test --headed
Or to open the Test UI runner:
npx playwright test --ui

Let me know if you want:
📄 Example for login test with form filling
💾 Example with storage (like saving login state)
📊 How to generate HTML test reports


========= 📁 CLI Commands (One-Line) =========
| Command                        | Explanation                           |
|  | - |
| `npx playwright test`          | Run all tests                         |
| `npx playwright test --debug`  | Debug mode                            |
| `npx playwright show-report`   | Open test report                      |
| `npx playwright test --ui`     | Launch test UI                        |
| `npx playwright install`       | Install browsers                      |
| `npx playwright codegen <url>` | Record actions and generate test code |

🧰 Useful Features
✅ Screenshots & videos
✅ Trace Viewer
✅ Parallel tests
✅ Custom reporters
✅ Page object model support

========= 🚀 Core Concepts in Playwright =========
|   | Concept              | Explanation                                                                  | Example                                    |
| -- |  | -- | - |
| 1  | Browser              | The actual browser used for testing – Chromium, Firefox, or WebKit.              | `chromium.launch()`                            |
| 2  | Context              | A browser context is like a new incognito window. It helps isolate sessions. | `browser.newContext()`                         |
| 3  | Page                 | A single tab in a browser. All actions happen on a page.                         | `context.newPage()`                            |
| 4  | Selectors / Locators | Used to identify elements on the page.                                       | `page.locator('text=Login')`                   |
| 5  | Actions              | Interactions like click, fill, hover, etc.                                       | `page.click('button')`                         |
| 6  | Assertions           | To validate the state or content of elements.                                | `expect(page).toHaveTitle(...)`                |
| 7  | Test Runner          | Built-in tool to run tests and manage test files, retries, etc.              | `npx playwright test`                          |
| 8  | Fixtures             | Setup code that runs before or after tests (e.g., login once, reuse).        | `test.beforeEach(...)`                         |
| 9  | Auto-waiting         | Playwright waits automatically for actions and elements to be ready.         | No need to add `waitForTimeout()`              |
| 10 | Parallel Testing     | Playwright runs tests in parallel by default, improving speed.               | Set in `playwright.config.ts`                  |
| 11 | Trace Viewer         | Records and shows what happened step-by-step in a test.                      | `npx playwright show-trace trace.zip`          |
| 12 | Codegen              | Auto-generates code by recording your browser actions.                           | `npx playwright codegen <url>`                 |
| 13 | Storage State        | Used for saving login session and reusing it in tests.                       | `context.storageState({ path: 'state.json' })` |
| 14 | Configuration        | File to manage global settings like browser, baseURL, timeout.                   | `playwright.config.ts`                         |

🧪 Example Flow:
// 1. Launch browser
const browser = await chromium.launch();
// 2. Create context (like incognito session)
const context = await browser.newContext();

// 3. Open a new tab (page)
const page = await context.newPage();

// 4. Go to URL
await page.goto('https://example.com');

// 5. Interact and validate
await page.click('text=Login');
await expect(page).toHaveTitle(/Login Page/);

// 6. Close
await browser.close();

Let me know if you'd like:

🔁 Diagram of this flow

🔐 Login session reuse example
📄 `playwright.config.ts` explained in detail

Add // @ts-check at the start of each test file when using JavaScript in VS Code to get automatic type checking.
  

========= 🔄 Understanding `async`, `await`, and Function Execution =========
✅ What is `async`?
Marks a function to always return a Promise.
Inside an `async` function, you can use `await`.
async function myFunction() {
  return 'Hello';
}

// This returns a Promise
myFunction().then(console.log); // Output: Hello


✅ What is `await`?
`await` is used inside an async function*to pause execution until a Promise resolves.
async function showData() {
  const result = await fetch('https://api.example.com');
  console.log(result);
}


This pauses at `await` until the `fetch` completes.
🧠 Execution Flow
console.log('Start');
async function test() {
  console.log('Inside async function');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('After await');
}

test();
console.log('End');

Output:
Start
Inside async function
End
After await
👉 Explanation:

`await` pauses only inside*the async function.
Main thread continues to next line (`End`).
After 1 second, it resumes and prints `After await`.

Each `await` ensures:
Page loads before filling
Field fills before button click
Navigation happens before assertion

Without `await`, test becomes unreliable.
Would you like me to add this to your Playwright Topics Checklist*document now?

🧪 Playwright Test Features
`test()` – Defines a test block.
`expect()` – Assertion API.
`beforeAll`, `beforeEach`, `afterEach`, `afterAll` – Hooks.
Fixtures – To share setup (like browser, context, login).

========= 🔍 Locators =========
https://playwright.dev/docs/locators
page.locator('text=Login')
page.locator('id')
page.locator('.class')

Smart and stable element selectors.
⚙️ Config File (`playwright.config.ts`)
const config: PlaywrightTestConfig = {
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'https://example.com',
    screenshot: 'only-on-failure',
  },
};
export default config;


========= ✅ What is a Locator? =========

A locator is a way to find and interact with elements on a web page.
Playwright's `locator()` API helps you write reliable and stable tests.

🧱 Basic Syntax
page.locator('selector')
🔍 Common Locator Types with Examples

| Locator Type | Syntax Example                             | Description               |
| - | - | -- |
| Text         | `page.locator('text=Login')`                   | Finds element with exact text |
| Partial Text | `page.locator('text=Log')`                     | Matches partial text          |
| CSS Selector | `page.locator('username')`                    | By ID                         |
|                  | `page.locator('.btn-primary')`                 | By class                      |
| XPath        | `page.locator('//input[@type="text"]')`        | XPath selector                |
| Role (ARIA)  | `page.getByRole('button', { name: 'Submit' })` | Accessible role + label       |
| Label        | `page.getByLabel('Email')`                     | Input tied to a label         |
| Placeholder  | `page.getByPlaceholder('Enter name')`          | Input placeholder text        |
| Test ID      | `page.getByTestId('login-button')`             | Using `data-testid` attribute |

✅ Actions with Locators
await page.locator('text=Login').click();
await page.locator('email').fill('ganesh@test.com');
await page.locator('.submit-btn').press('Enter');

🎯 Tips for Locators
Prefer `getByRole()` and `getByTestId()` for stability.
Use `locator()` for flexibility with CSS/XPath.
Avoid fragile selectors like `div:nth-child(3)`.
  
✅ Chaining Locators
await page.locator('.form').locator('input[type="text"]').fill('Ganesh');

✅ Locators vs Element Handles
| Feature     | `locator()` | `page.$()` / `elementHandle` |
| -- | -- | - |
| Recommended | ✅ Yes       | ❌ No (older/less stable)     |
| Auto-wait   | ✅ Yes       | ❌ No                         |
| Can retry?  | ✅ Yes       | ❌ No                         |


Let me know if you want:
✅ Locator best practices
✅ Role-based testing examples
✅ Playwright selectors cheatsheet (like `:has()`, `:nth()`, `:visible`, etc.)

========= 🎯 Playwright Built-in Locators =========
Playwright provides built-in locators for reliable and readable test automation. These locators use accessible roles, labels, placeholders, test IDs, and more.
📘 Common Built-in Locator Methods
| Locator Method   | Description                       | Example                                    |
| -- | - | - |
| `getByRole()`        | Selects by ARIA role and name     | `page.getByRole('button', { name: 'Submit' })` |
| `getByLabel()`       | Selects input by associated `<label>` | `page.getByLabel('Email Address')`             |
| `getByPlaceholder()` | Selects input using placeholder text  | `page.getByPlaceholder('Enter your name')`     |
| `getByText()`        | Selects element by visible text       | `page.getByText('Logout')`                     |
| `getByTitle()`       | Selects by `title` attribute          | `page.getByTitle('Help')`                      |
| `getByAltText()`     | Selects images by `alt` attribute     | `page.getByAltText('Company Logo')`            |
| `getByTestId()`      | Selects using `data-testid` attribute | `page.getByTestId('login-button')`             |


✅ Usage Example
await page.getByRole('button', { name: 'Login' }).click();
await page.getByLabel('Email').fill('test@example.com');
await page.getByPlaceholder('Enter password').fill('123456');
await page.getByTestId('submit-btn').click();

🧠 Why Use Built-in Locators?
More readable than CSS/XPath
Stable and resilient to UI changes
Improved accessibility coverage (especially `getByRole()`)

💡 Tip:
Use Playwright’s [Codegen](https://playwright.dev/docs/codegen) to explore these locators — it often uses the most reliable ones automatically.
Let me know if you want:
✅ A locator strategy guide
✅ Playwright locator chaining examples
✅ Best practices for choosing the right locator

Let me know if you want:
🔁 Chaining multiple actions
🎥 Video/gif of interactions using codegen
🧩 Keyboard & mouse simulation examples


========= ✅ What is XPath? =========
XPath is a language used to locate elements in an XML/HTML document.
Useful when CSS selectors are not enough or for complex DOM trees.

✅ Using XPath in Playwright
Playwright mainly uses CSS selectors, but you can also use XPath with this method:
page.locator('//tagname[@attribute="value"]')
Or:
await page.$('//button[text()="Login"]')

✅ Basic XPath Syntax
| XPath Expression                | Meaning                                       |
| - |  |
| `//tag`                         | Selects all `<tag>` elements                  |
| `//div[@id="main"]`             | Selects `<div>` with `id="main"`              |
| `//input[@type="text"]`         | Selects all text input fields                 |
| `//button[text()="Submit"]`     | Selects `<button>` with exact text "Submit"   |
| `//a[contains(text(),"Click")]` | Anchor tag with text containing "Click"       |
| `//div[@class="header"]/h1`     | Selects `<h1>` inside div with class `header` |

✅ Example in Playwright
await page.locator('//input[@name="username"]').fill('Ganesh');
await page.locator('//button[text()="Login"]').click();
Or with `page.$` and `page.$$`:
const loginBtn = await page.$('//button[text()="Login"]');
await loginBtn?.click();

⚠️ Note:
XPath is powerful but can be brittle.
Prefer CSS selectors when possible.
Use XPath when elements have no unique ID/class and are deeply nested.


🔍 Tip: Get XPath Easily
Open browser → Right-click → Inspect → Right-click element → Copy → Copy XPath
Let me know if you want notes on:

========= ✅ CSS vs XPath =========
✅ Best practices for selectors
✅ Advanced XPath functions (like `starts-with`, `contains`, etc.)

Sure! Here's a clear and simple table format of the most common XPath commands and patterns — ideal for Playwright and other automation tools:

📘 Common XPath Commands & Patterns – Table Format
| XPath Pattern                        | Description                               | Example Match                         |
| - |  | -- |
| `//tag`                                  | Selects all elements with that tag            | `//input` → All `<input>` elements        |
| `//tag[@attr="value"]`                   | Selects element with specific attribute value | `//input[@type="text"]`                   |
| `//tag[text()="value"]`                  | Selects element with exact visible text   | `//button[text()="Submit"]`               |
| `//tag[contains(text(), "part")]`        | Selects element that contains partial text    | `//a[contains(text(),"Login")]`           |
| `//tag[contains(@attr, "part")]`         | Attribute contains value                      | `//div[contains(@class, "active")]`       |
| `//tag[starts-with(@attr, "value")]`     | Attribute starts with value                   | `//input[starts-with(@id, "user")]`       |
| `//tag[@attr1="val1" and @attr2="val2"]` | Multiple AND conditions                   | `//input[@type="text" and @name="email"]` |
| `//tag[@attr1="val1" or @attr2="val2"]`  | Multiple OR conditions                    | `//input[@type="text" or @type="email"]`  |
| `//*[text()="value"]`                    | Any element with exact text                   | `//*[text()="Dashboard"]`                 |
| `//div[@class="box"]/span`               | Nested element selection                      | `<span>` inside `<div class="box">`       |
| `(//tag)[index]`                         | Select element by position                    | `(//input)[1]` → First input element      |
| `//tag[@attr]`                           | Element that has the attribute (any value)    | `//input[@placeholder]`                   |



Let me know if you want another table for:
✅ XPath functions (`normalize-space`, `last()`, etc.)
✅ CSS vs XPath comparison
✅ Playwright-specific locator best practices

========= 🧪 CSS Selector vs XPath – Quick Comparison Table =========

| Feature                      | CSS Selector                     | XPath                                 |
| - |  | -- |
| Syntax Simplicity        | ✅ Simple and clean                   | ❌ More complex                            |
| Performance              | ✅ Slightly faster in most browsers   | ⚠️ Slightly slower                        |
| Readability              | ✅ Easier to read                     | ❌ Harder to read                          |
| Supported in Playwright  | ✅ Fully supported                    | ✅ Fully supported                         |
| Direction Support        | ❌ Only forward (parent → child)  | ✅ Supports both directions (↑ and ↓)  |
| Select by Text           | ❌ Not supported                      | ✅ Supported (`//tag[text()='value']`)     |
| Indexing                 | ⚠️ Complex (`:nth-child(n)`)         | ✅ Straightforward (`(//tag)[n]`)          |
| Chained/Nested Elements  | ✅ Good with `>` or space             | ✅ Good with `//` or `/`                   |
| Special Functions        | ❌ No built-in text or position logic | ✅ Has `contains()`, `starts-with()`, etc. |
| Browser DevTools Support | ✅ Excellent (Inspect → Copy CSS)     | ✅ Available via “Copy XPath”              |
| Best for                 | ✅ Simple, stable elements            | ✅ Complex DOM or text-based selection     |

✅ When to Use
Use CSS Selectors:
  🔹 When dealing with simple, clean HTML structure
  🔹 For better performance and readability

Use XPath:
  🔹 When you need to select by text, or go upward in DOM
  🔹 For complex nested or dynamic structures

Let me know if you’d like:
✅ Real-world examples comparing both
✅ Advanced patterns like `:has()` and `:nth-child()` in CSS or `contains()` in XPath


========= ✅ What is Codegen? =========
Codegen = Code Generator
It records your actions in a browser and generates Playwright test code automatically.
Helps beginners quickly create tests without writing code manually.

💻 Command to Run Codegen
npx playwright codegen https://example.com
📌 What Happens:
Opens a browser window.
Records every click, input, or navigation.
Shows auto-generated code (TypeScript/JavaScript/Python/etc.)
You can copy the generated code and use it in your test files.

✅ Generate in TypeScript
npx playwright codegen --target=ts https://example.com
✅ Output Example:

import { test, expect } from '@playwright/test';
test('auto-generated test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.click('text=More information');
});

✅ Useful Codegen Options
| Command                     | Description               |
|  | - |
| `--target=ts`               | Generates TypeScript code |
| `--target=js`               | Generates JavaScript code |
| `--target=python`           | Generates Python code     |
| `--save-storage=state.json` | Saves login/session state |
| `--load-storage=state.json` | Loads saved session state |


✅ Tip:
Use codegen for:
Quickly building test cases
Learning selector syntax
Generating login steps and reusing storage state
Let me know if you want to learn about:

✅ How to reuse login session with codegen
✅ How to customize generated tests
✅ How to integrate codegen output into your test framework


Here’s a quick and clear comparison of CSS Selector vs XPath — ideal for Playwright, Selenium, or interview prep:





========= 🎯 Playwright Actions & Interactions =========
These are methods used to interact with web elements, like clicking, typing, hovering, etc.

✅ Common Actions

| Action       | Syntax Example                                 | What it Does                         |
| - | -- | - |
| `click()`        | `await page.click('text=Login');`                  | Clicks on a button, link, or element     |
| `fill()`         | `await page.fill('email', 'ganesh@test.com');`    | Fills input field with text              |
| `type()`         | `await page.type('email', 'ganesh');`             | Types character-by-character (slower)    |
| `press()`        | `await page.press('input', 'Enter');`             | Simulates keyboard press like Enter, Tab |
| `dblclick()`     | `await page.dblclick('item');`                    | Double-clicks the element                |
| `hover()`        | `await page.hover('.menu');`                       | Moves mouse over element                 |
| `check()`        | `await page.check('agree');`                      | Checks a checkbox                        |
| `uncheck()`      | `await page.uncheck('agree');`                    | Unchecks a checkbox                      |
| `selectOption()` | `await page.selectOption('selectcountry', 'IN');` | Selects dropdown value                   |
| `dragTo()`       | `await source.dragTo(target);`                     | Drags one element to another             |
| `screenshot()`   | `await page.screenshot({ path: 'page.png' });`     | Takes a screenshot                       |

🧪 Full Example
test('user login test', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.fill('username', 'ganesh');
  await page.fill('password', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
});

💡 Tips:
All actions auto-wait: No need to manually add delays or waits.
Always combine actions with assertions to validate outcomes.
Use `locator().click()` instead of `page.click()` for more stable selectors.


========= ✅ Playwright Assertions – Quick Notes =========

📌 What is an Assertion?
An assertion is used to check that something is true during a test.
If the assertion fails, the test will fail.

Playwright uses `expect()` from its test library for making assertions.
🧪 Importing Assertion
import { test, expect } from '@playwright/test';
🧰 Common Assertions in Playwright

| Assertion       | Usage Example                                    | Checks                        |
| - | - |  |
| `toBeVisible()`     | `expect(locator).toBeVisible();`                     | Element is visible on page        |
| `toBeHidden()`      | `expect(locator).toBeHidden();`                      | Element is not visible            |
| `toHaveText()`      | `expect(locator).toHaveText('Success');`             | Element contains exact text       |
| `toContainText()`   | `expect(locator).toContainText('Welcome');`          | Text contains substring           |
| `toHaveValue()`     | `expect(locator).toHaveValue('Ganesh');`             | Input field has value             |
| `toHaveAttribute()` | `expect(locator).toHaveAttribute('type', 'submit');` | Attribute check                   |
| `toHaveCount()`     | `expect(locator).toHaveCount(3);`                    | Number of matching elements       |
| `toBeChecked()`     | `expect(locator).toBeChecked();`                     | Checkbox/radio is selected        |
| `toBeDisabled()`    | `expect(locator).toBeDisabled();`                    | Element is disabled               |
| `toBeEditable()`    | `expect(locator).toBeEditable();`                    | Input is editable                 |
| `toHaveClass()`     | `expect(locator).toHaveClass(/active/);`             | Class name check (supports RegEx) |


✅ Example Full Test
test('Login form test', async ({ page }) => {
  await page.goto('https://example.com/login');

  const username = page.locator('username');
  const submitBtn = page.locator('button[type="submit"]');

  await expect(username).toBeVisible();
  await username.fill('Ganesh');

  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  await expect(page.locator('.success-msg')).toHaveText('Login successful');
});


💡 Tips:
Assertions automatically wait for timeout (default: 5s).
Use `expect()` only after page actions to verify results.

Let me know if you want:
✅ List of advanced assertions
✅ How to add custom assertions
✅ Tips for flaky test handling with retries

========= ✅ Hard Assertion vs Soft Assertion in Playwright =========

| Aspect                | Hard Assertion                         | Soft Assertion                                    |
| - |  | -- |
| Definition            | Stops the test immediately on failure      | Continues execution even if the assertion fails       |
| Behavior              | Test fails and exits on first failed check | Test runs all assertions, collects all failures       |
| Use Case              | Critical checks (e.g., login success)      | Optional or multiple validations in a test            |
| Support in Playwright | ✅ Fully supported using `expect()`         | ❌ Not natively supported (needs workaround or plugin) |

🔴 Hard Assertion Example (Default in Playwright)
import { test, expect } from '@playwright/test';

test('hard assertion example', async ({ page }) => {
  await page.goto('https://example.com');

  await expect(page.locator('username')).toBeVisible(); // If this fails, test stops here
  await expect(page.locator('password')).toBeVisible();
});
If the first `expect` fails, the second line won’t be executed.

🟡 Soft Assertion Example (Workaround)
Playwright doesn't support native soft assertions, but you can manually collect errors like this:
test('soft assertion example', async ({ page }) => {
  const errors: string[] = [];
  await page.goto('https://example.com');
  try {
    await expect(page.locator('username')).toBeVisible();
  } catch (e) {
    errors.push('Username field not visible');
  }

  try {
    await expect(page.locator('password')).toBeVisible();
  } catch (e) {
    errors.push('Password field not visible');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n')); // Fails at end with all errors
  }
});


✅ Summary
Use hard assertions for essential test flow control.
Use soft assertion (workaround) when you want to validate multiple things but fail only at the end.

Let me know if you want:
✅ A reusable soft assertion helper function
✅ Integration with third-party assertion libraries (like `chai-soft-assert`)


========= 🔁 What are Hooks in Playwright? =========
Hooks are special functions that run before or after your tests or test steps.
They help you set up or clean up things like data, browser state, or logins.

✅ Commonly Used Hooks
| Hook       | When it Runs                           | Use Case Example                      |
| -- |  | -- |
| `beforeAll()`  | Runs once before all tests in the file | Login setup, DB connection, test data     |
| `afterAll()`   | Runs once after all tests in the file  | Cleanup, logout, close DB                 |
| `beforeEach()` | Runs before each test                  | Open page, reset state                    |
| `afterEach()`  | Runs after each test                   | Take screenshot on failure, clear cookies |

🧪 Example
import { test, expect } from '@playwright/test';
test.beforeAll(async () => {
  console.log('🔧 Runs once before all tests');
});
test.beforeEach(async ({ page }) => {
  await page.goto('https://example.com');
});
test('Homepage test', async ({ page }) => {
  await expect(page).toHaveTitle(/Example Domain/);
});
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: `error-${testInfo.title}.png` });
  }
});
test.afterAll(async () => {
  console.log('✅ All tests finished');
});

🎯 Why Use Hooks?
✅ Avoid repeating setup code in every test
✅ Handle login once and reuse
✅ Run cleanup only once
✅ Take action on failure or after success

Let me know if you want:
🔐 Example: login in `beforeAll()` and reuse state
📂 Best practice for using hooks in large projects
🧪 Global hooks in `playwright.config.ts`

========= 🧩 Test Grouping in Playwright =========
Grouping helps you organize tests and run specific sets (e.g., smoke, login, dashboard). You can group tests by:
`describe` blocks
tags
file naming
projects (browsers/devices)

✅ 1. Grouping with `test.describe()`
import { test, expect } from '@playwright/test';
test.describe('Login Tests', () => {
  test('Valid login', async ({ page }) => {
    // test logic
  });
  test('Invalid login', async ({ page }) => {
    // test logic
  });
});
🔹 Output groups test results under `"Login Tests"` in the report.

✅ 2. Grouping with `test.only` or `test.skip`
| Function      | Purpose                     |
| - |  |
| `test.only()` | Run only that specific test |
| `test.skip()` | Skip the test               |

test.skip('This test is not ready', async () => { });
test.only('Run this test only', async () => { });

✅ 3. Grouping by Tags (Annotations)
You can use `@tag` comments and filter using `grep`.
// @smoke
test('smoke test', async ({ page }) => {
  // ...
});

Run only smoke tests:
npx playwright test --grep @smoke

✅ 4. Grouping by Test Files
Structure folders like:
tests/
├── login/
│   └── login.spec.ts
├── dashboard/
│   └── dashboard.spec.ts


Run only login tests:
npx playwright test tests/login

✅ 5. Grouping by Projects (Browser/Device)
In `playwright.config.ts`:
projects: [
  { name: 'Chrome', use: { browserName: 'chromium' } },
  { name: 'Mobile', use: { ...devices['iPhone 12'] } },
]

Then run specific project:
npx playwright test --project=Mobile

✅ Summary
| Grouping Method  | Use Case                      |
| - | -- |
| `describe()`     | Group related test cases      |
| `test.only/skip` | Focus or ignore specific test |
| Tags & `--grep`  | Logical groups like @smoke    |
| Folder structure | Group by feature/module       |
| Projects         | Test across browsers/devices  |

Let me know if you want:
📄 Folder structure best practices
🚀 Example of CI-based test group execution (e.g., smoke only on deploy)

========= 🚀 Playwright CI Setup (GitHub Actions) =========
CI helps you automatically run Playwright tests when you push code — ensuring your app is always tested.
✅ 1. Prerequisites
You must have a Playwright project (`npx playwright install`)
Code must be pushed to a GitHub repo

✅ 2. Create GitHub Actions Workflow
📄 File: `.github/workflows/playwright.yml`
yaml
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Tests
        run: npx playwright test

      - name: Upload HTML Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

✅ 3. What Happens Here
| Step                 | Purpose                           |
|  | - |
| `checkout`               | Gets your code from GitHub            |
| `setup-node`             | Installs Node.js for running scripts  |
| `npm install`            | Installs all project dependencies     |
| `npx playwright install` | Installs browsers (Chromium etc.)     |
| `npx playwright test`    | Runs your test cases                  |
| `upload-artifact`        | Stores the test report as an artifact |



✅ 4. View Reports
After CI runs → Go to Actions > Workflow > Job > Artifacts
Download and open the `playwright-report/index.html`

🛠️ Optional: BaseURL for CI
In `playwright.config.ts`, you can set:
use: {
  baseURL: 'https://your-staging-url.com',
}

So tests run against a deployed environment during CI.
✅ Summary

| ✅ Step               | 🔧 Command or File                   |
| -- |  |
| GitHub workflow file | `.github/workflows/playwright.yml`   |
| Run tests            | `npx playwright test`                |
| Install browsers     | `npx playwright install --with-deps` |
| Upload HTML report   | `actions/upload-artifact`            |

Let me know if you'd like:
☁️ Playwright setup with Jenkins / GitLab CI
💡 Run tests only on pull requests
📤 Send test reports to Slack or email


========= 🏷️ 1. Annotations in Playwright =========
Annotations are used to mark tests with special behavior (like skip, only, slow, tag, etc.).
✅ Common Annotations

| Annotation        | Purpose                    | Example                                  |
| -- | -- | - |
| `test.skip()`     | Skip this test             | `test.skip('Not working yet', ...)`      |
| `test.only()`     | Run only this test         | `test.only('Debug this', ...)`           |
| `test.fixme()`    | Mark test as known to fail | `test.fixme('Bug open')`                 |
| `test.slow()`     | Increases timeout          | `test.slow()`                            |
| `test.describe()` | Group related tests        | `test.describe('Login', () => { ... })`  |
| `test.use()`      | Set test options per test  | `test.use({ viewport: { width: 400 } })` |


🧪 2. Tagging Tests
You can add custom tags using `test.info().annotations` or use `grep` with comments.
✅ Tag with comment style
// @smoke
test('Smoke test for login', async ({ page }) => {
  // ...
});
Run using:
npx playwright test --grep @smoke

🌐 3. Browser Context in Playwright
✅ What is a Context?
A browser context is like a fresh, isolated browser profile (like a new incognito window).
Each context:
Has its own cookies, localStorage, sessions
Can run multiple parallel users safely

✅ Example: Create Context Manuall
test('Context example', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com');
  await context.close();
});

✅ Why use it?

| Use Case                     | How Context Helps            |
| - | - |
| Multi-user testing           | Create 2+ isolated sessions  |
| Keep tests clean & stateless | No cookie or cache pollution |
| Pre-login setup              | Save storage state, reuse it |

✅ Example: Login once & reuse
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com/login');
  await page.fill('username', 'ganesh');
  await page.fill('password', 'password');
  await page.click('button[type=submit]');
  await context.storageState({ path: 'auth.json' });
});

test.use({ storageState: 'auth.json' });

✅ Summary
| Feature             | Description                             | Example / Use                |
| - |  | - |
| Annotations     | Mark tests with skip, only, fixme, etc. | `test.skip()`, `test.only()` |
| Tags            | Group tests with `@tag` and grep them   | `--grep @smoke`              |
| Browser Context | Isolated session for each test block    | `browser.newContext()`       |

Let me know if you’d like:
✅ How to reuse storage state for authenticated tests
📂 Best folder structure for multiple context-based scenarios
🔁 Parallel test users (2 users in one test using 2 contexts)


========= 🎯 What is Playwright Trace Viewer? =========

The Trace Viewer*is a visual tool to inspect test execution step-by-step*— including screenshots, DOM snapshots, network calls, console logs, and more.

> 💡 It helps debug why*a test failed by showing exactly what happened in the browser.
✅ How to Use Trace Viewer
Step 1: Enable trace recording in config or test
Option A: In `playwright.config.ts`

use: {
  trace: 'on-first-retry', // or 'on', 'retain-on-failure'
},

Option B: Inside a specific test
test.use({ trace: 'on' });

Step 2: Run Your Test
npx playwright test
If a test fails (or if you used `trace: 'on'`), a `.zip` trace file is created in `test-results/`.

Step 3: Open the Trace
npx playwright show-trace test-results/<trace-file>.zip
This opens an interactive viewer in your browser.

🛠️ What You Can See in Trace Viewer

| Feature           | Description                          |
| -- |  |
| Timeline*     | See all steps in sequence            |
| Screenshots*  | Snapshots before/after each action   |
| DOM Snapshot* | Inspect page HTML at each step       |
| Action Log*   | Clicks, fills, navigations, etc.     |
| Console Logs* | Console output from the browser      |
| Network*      | API requests and responses           |
| Selectors Tab*| Check why a locator worked or failed |



🚀 Real Use Case
If your test fails at:


await page.click('button:has-text("Submit")');
The trace viewer will:

Show whether the button was visible
Whether it was clickable
What the DOM looked like
What console errors were present



🔍 Tip: Best Trace Config
use: {
  trace: 'retain-on-failure',
}

========= 🎯 What is Emulation in Playwright? =========

Emulation*means simulating a specific device, browser environment, or location.

> 🔍 It helps test how your app behaves on mobile devices, different screen sizes, geolocations, timezones, or languages — without a real device.



✅ Common Emulation Options

| Emulation Type       | What It Does                                | Example                            |
| -- | - | - |
| Device emulation*| Simulates phones/tablets                    | iPhone 13, Pixel 5, iPad           |
| Viewport*        | Changes screen size                         | `width: 375, height: 667`          |
| Geolocation*     | Fakes user's location                       | Simulate Bangalore or London       |
| Timezone*        | Fakes local time                            | `Asia/Kolkata`, `America/New_York` |
| Language*        | Changes browser language                    | `en-US`, `fr-FR`                   |
| Permissions*     | Mock camera, location, notifications access | Grant or deny permissions          |
| Color Scheme*    | Light or dark mode                          | `colorScheme: 'dark'`              |



✅ 1. Emulate a Mobile Device
import { devices } from '@playwright/test';

test.use({
  ...devices['iPhone 13'],
});




✅ 2. Custom Viewport and User Agent
test.use({
  viewport: { width: 360, height: 740 },
  userAgent: 'MyCustomAgent',
});

✅ 3. Emulate Geolocation
test.use({
  geolocation: { latitude: 12.97, longitude: 77.59 }, // Bangalore
  permissions: ['geolocation'],
});




✅ 4. Emulate Timezone
test.use({
  timezoneId: 'Asia/Kolkata',
});


✅ 5. Emulate Language
test.use({
  locale: 'fr-FR',
});


✅ 6. Emulate Dark Mode
test.use({
  colorScheme: 'dark',
});




✅ 7. Full Emulation Example in a Test
test.use({
  ...devices['Pixel 5'],
  geolocation: { latitude: 28.61, longitude: 77.20 }, // Delhi
  permissions: ['geolocation'],
  locale: 'en-IN',
  timezoneId: 'Asia/Kolkata',
  colorScheme: 'dark',
});


📌 When to Use Emulation?
Mobile responsive testing
Location-based content or features
Language and localization testing
Time-sensitive features (e.g., business hours, sales)
Dark mode UI verification


========= ✅ Common Test Case Examples in Playwright (TypeScript) =========

🧾 1. Input Box (Text Field)
test('should fill input box', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('username', 'ganesh');
  await expect(page.locator('username')).toHaveValue('ganesh');
});
🧪 Suggested Tests:
Empty input
Valid input
Invalid input
Max character limit

👉 Total: \~3–5 test cases


🔐 2. Password Field
test('should type password', async ({ page }) => {
  await page.fill('password', 'secret123');
  await expect(page.locator('password')).toHaveAttribute('type', 'password');
});
🧪 Suggested Tests:
Min/Max length
Special character handling
Show/hide toggle

👉 Total: 2–4 test cases

✅ 3. Form Submission
test('form should submit successfully', async ({ page }) => {
  await page.fill('username', 'ganesh');
  await page.fill('password', 'secret123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
});


🧪 Suggested Tests:
Valid form submission
Empty form
Missing one field
Invalid values
Server error case

👉 Total: 4–6 test cases

📋 4. Select Dropdown
test('should select country from dropdown', async ({ page }) => {
  await page.selectOption('country', 'IN');
  await expect(page.locator('country')).toHaveValue('IN');
});


🧪 Suggested Tests:
Default selection
Change selection
Invalid value (optional)

👉 Total: 2–3 test cases

☑️ 5. Checkbox
test('should check and uncheck checkbox', async ({ page }) => {
  const checkbox = page.locator('agree');
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
});


🧪 Suggested Tests:
Default state
Check/uncheck
Mandatory validation

👉 Total: 2–3 test cases



🔘 6. Radio Button
test('should select gender radio', async ({ page }) => {
  await page.check('input[value="male"]');
  await expect(page.locator('input[value="male"]')).toBeChecked();
});

🧪 Suggested Tests:

Select each option
Default selected option
Validation

👉 Total: 2–3 test cases



📄 7. File Upload
test('should upload file', async ({ page }) => {
  await page.setInputFiles('input[type="file"]', 'tests/files/sample.pdf');
});


🧪 Suggested Tests:

Valid file
Invalid file type
File size check

👉 Total: 3–4 test cases



🔍 8. Search Input + Result
test('should return results for valid search', async ({ page }) => {
  await page.fill('search', 'laptop');
  await page.press('search', 'Enter');
  await expect(page.locator('.product')).toHaveCountGreaterThan(0);
});


🧪 Suggested Tests:

Valid search
No results
Empty search
Special characters

👉 Total: 4–5 test cases



📦 Summary Table

| Feature         | Suggested Test Count |
|  | -- |
| Input Field     | 3–5                  |
| Password Field  | 2–4                  |
| Form Submission | 4–6                  |
| Select Dropdown | 2–3                  |
| Checkbox        | 2–3                  |
| Radio Button    | 2–3                  |
| File Upload     | 3–4                  |
| Search Field    | 4–5                  |



✅ Pro Tip:

For each feature:

  Write positive and negative test cases.
  Include boundary and required field checks.



Let me know if you'd like:
📂 A reusable test folder structure
🔐 A login form example with storage state
📊 Data-driven tests using a loop or JSON file

Great! Let’s now continue with important Playwright topics you haven’t fully covered yet, along with simple explanations and examples:



========= 🔍 Topics You Can Still Explore =========

| 📘 Topic | 🔎 Description & Example |
| -- |  |

📂 1. Test Fixtures

Reusable setup for tests (like login, custom data, context sharing).
// example-fixtures.ts
import { test as base } from '@playwright/test';

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await page.goto('/login');
    await use(page);
  },
});

test('using fixture', async ({ loginPage }) => {
  await loginPage.fill('username', 'ganesh');
});

🧪 2. Parameterized Tests (Data-Driven Testing)
const credentials = [
  { user: 'admin', pass: 'admin123' },
  { user: 'guest', pass: 'guest123' },
];

for (const cred of credentials) {
  test(`login test for ${cred.user}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('username', cred.user);
    await page.fill('password', cred.pass);
    await page.click('button[type=submit]');
  });
}

🔁 3. Retry Failed Tests

Configure retries in `playwright.config.ts`:
retries: 2,
Or per test:
test('flaky test', async ({ page }) => {
  test.info().retry;
});


📦 4. Storage State (Login Reuse)

Save login session to a file and reuse it in multiple tests.
// Save once
await context.storageState({ path: 'auth.json' });

// Reuse
test.use({ storageState: 'auth.json' });


📃 5. Handling Alerts / Popups
page.once('dialog', dialog => {
  console.log(dialog.message());
  dialog.accept();
});
await page.click('alertBtn');


🌐 6. API Testing in Playwright

Playwright can test APIs too.
test('GET API test', async ({ request }) => {
  const res = await request.get('https://api.github.com/users/octocat');
  expect(res.status()).toBe(200);
});




📸 7. Screenshots and Video

In `playwright.config.ts`:

use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}


Or manually:

await page.screenshot({ path: 'screenshot.png' });




🧼 8. Test Hooks (beforeAll, afterEach, etc.)
test.beforeEach(async ({ page }) => {
  await page.goto('https://example.com');
});

test.afterEach(async ({}, testInfo) => {
  console.log(`Test ${testInfo.title} done`);
});




🧪 9. Parallel Testing / Projects

Define separate browsers/devices in `playwright.config.ts`:


projects: [
  { name: 'Chromium', use: { browserName: 'chromium' } },
  { name: 'Firefox', use: { browserName: 'firefox' } },
],



🚫 10. Handling Timeouts & Waits

Avoid using `waitForTimeout` — prefer `await expect()` or `locator.waitFor()`:


await expect(page.locator('success')).toBeVisible({ timeout: 5000 });




🧪 11. Custom Reporters

Use built-in like `html`, or install others like Allure:

npx playwright show-report
In config:

reporter: [['html'], ['list']]


📊 12. Integrate with CI/CD (GitHub Actions / Jenkins)

You’ve started this already, but you can expand it with:

Slack notifications
Filtering tests using tags
Running in headless cloud services



✅ Final Summary Table

| Category             | Covered | Need to Explore  |
| -- | - | - |
| Setup & Config       | ✅       |                  |
| Locators & Selectors | ✅       |                  |
| Assertions           | ✅       |                  |
| Fixtures             | ❌       | ✅                |
| Tags & Filtering     | ✅       |                  |
| Hooks                | ✅       |                  |
| Context & Storage    | ✅       |                  |
| API Testing          | ❌       | ✅                |
| Screenshots/Video    | ❌       | ✅                |
| Parameterized Tests  | ❌       | ✅                |
| Retry Logic          | ❌       | ✅                |
| Popups/Alerts        | ❌       | ✅                |
| Reporters            | ✅       | Optional         |
| Parallel Testing     | ❌       | ✅                |
| CI/CD                | ✅       | Expand if needed |




========= Retries =========
Test retries are a way to automatically re-run a test when it fails
When all tests pass, they will run in order in the same worker process.
Should any test fail, Playwright Test will discard the entire worker process along with the browser and will start a new one. Testing will continue in the new worker process starting with the next test.
If you enable retries, second worker process will start by retrying the failed test and continue from there.

Playwright supports test retries. When enabled, failing tests will be retried multiple times until they pass, or until the maximum number of retries is reached. By default failing tests are not retried.

 Give failing tests 3 retry attempts
npx playwright test --retries=3

You can configure retries in the configuration file:
playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  // Give failing tests 3 retry attempts
  retries: 3,
});

Playwright Test will categorize tests as follows:
"passed" - tests that passed on the first run;
"flaky" - tests that failed on the first run, but passed when retried;
"failed" - tests that failed on the first run and failed all retries.


========= Timeouts =========

Timeout	Default	Description
Test timeout	30_000 ms	  Timeout for each test
Set in config { timeout: 60_000 }
Override in test
test.setTimeout(120_000)

Expect timeout	5_000 ms	Timeout for each assertion
Set in config { expect: { timeout: 10_000 } }
Override in test
expect(locator).toBeVisible({ timeout: 10_000 })
Playwright Test enforces a timeout for each test, 30 seconds by default Time spent by the test function, fixture setups, and beforeEach hooks is included in the test timeout.
Timed out test produces the following error:
example.spec.ts:3:1 › basic test =======================================
Timeout of 30000ms exceeded.
Set timeout for a single test
example.spec.ts
import { test, expect } from '@playwright/test';

test('slow test', async ({ page }) => {
  test.slow(); // Easy way to triple the default timeout
  // ...
});

test('very slow test', async ({ page }) => {
  test.setTimeout(120_000);
  // ...
  
});

export default defineConfig({
  globalTimeout: 3_600_000,
});


TypeScript
Playwright supports TypeScript out of the box. You just write tests in TypeScript, and Playwright will read them, transform to JavaScript and run.


  
===== best practices =====
✅ 1. Use `await` with every Playwright action
Why:*Playwright APIs are async; forgetting `await` can lead to flaky tests.
await page.goto('https://example.com');
await page.click('login');

✅ 2. Use built-in locators*(like `getByRole`, `getByText`, etc.)
Why:*More reliable and readable than XPath or complex CSS.
await page.getByRole('button', { name: 'Submit' }).click();

✅ 3. Avoid hard waits (`page.waitForTimeout`)
Why:*Slows tests and causes flakiness. Use smart waits.
✅ Prefer:
await expect(page.locator('success')).toBeVisible();
🚫 Avoid:
await page.waitForTimeout(3000);

✅ 4. Use test hooks (`beforeEach`, `afterAll`, etc.)
Why:*Helps reduce code repetition (e.g., login or navigation steps).
test.beforeEach(async ({ page }) => {
  await page.goto('https://app.com/login');
});
✅ 5. Reuse authentication using `storageState`
Why:*Speeds up tests and avoids login in every test.
// Save login session
await context.storageState({ path: 'auth.json' });
// Reuse it
test.use({ storageState: 'auth.json' });

✅ 6. Use `test.describe()` to group related tests
Why:*Organizes your test files and makes debugging easier.
test.describe('Login Tests', () => {
  test('Valid login', async ({ page }) => { ... });
  test('Invalid login', async ({ page }) => { ... });
});

✅ 7. Isolate tests using browser contexts
Why:*Each test runs in a clean session (like incognito).
const context = await browser.newContext();
const page = await context.newPage();

✅ 8. Keep test files small and focused
Why:*Easier to debug, review, and maintain.
> 👍 One test file = one feature (e.g., `login.spec.ts`, `checkout.spec.ts`)

✅ 9. Use meaningful test names
Why:*Makes reports and failures easier to understand.
test('User can add item to cart and see total price updated', async () => { ... });

✅ 10. Use assertions smartly
Why:*Avoids false positives.
await expect(page).toHaveURL(/dashboard/);
await expect(page.locator('h1')).toHaveText('Welcome Ganesh');

✅ 11. Use environment variables for test data/configs
Why:*Keep sensitive data out of code.
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

✅ 12. Run tests in parallel (using `projects`)
Why:*Speeds up test suite in CI.
projects: [
  { name: 'Chrome', use: { browserName: 'chromium' } },
  { name: 'Firefox', use: { browserName: 'firefox' } },
],

✅ 13. Add CI integration (GitHub Actions, Jenkins)
Why:*Automates test runs on every commit or PR.
> Example: `.github/workflows/playwright.yml`

✅ 14. Use codegen for rapid script generation (but refactor)
Why:*Helps beginners, but clean up later for reliability.
npx playwright codegen https://example.com

✅ 15. Use custom helpers or fixtures for reusable logic
Why:*Avoid duplication and keep tests clean.
test.use({ loginPage: async ({ page }, use) => { ... } });

✅ 16. Use HTML reports for debugging
npx playwright show-report
  




