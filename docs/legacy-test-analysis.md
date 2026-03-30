# Legacy Test Analysis Report

**Target Files:** `tests/main.navigation.spec.ts` & `pages/NavigationPage.ts`
**Status:** Diagnosis only. **No code changes applied in Chapter 2.**

## 1. AI-Detected Issues (Prioritized Checklist)

### 🔴 P1: Synchronization Issues
* **Issue:** Hardcoded `await page.waitForTimeout(2000)` used before assertions and clicks.
* **Impact:** *fixed waits → flakiness and wasted CI time.* If the page loads in 100ms, we waste 1.9s. If the network is slow and it takes 2500ms, the test fails artificially.

### 🔴 P1: Selector Quality (Strict Mode Risk)
* **Issue:** `this.apiLink = page.getByText('API')` is an unscoped, partial-text matcher.
* **Impact:** *unscoped text locator → execution failures.* If the word "API" appears anywhere else on the page (e.g., in a footer or a paragraph), Playwright will throw a Strict Mode violation and crash the test.

### 🟠 P2: Selector Quality (Brittle Coupling)
* **Issue:** `this.docsLink = page.locator('.navbar__item[href="/docs/intro"]')` relies on specific Docusaurus CSS classes and DOM structure.
* **Impact:** *CSS/ID selectors → brittle to markup changes.* If the developers change the framework or update the class names during a UI refresh, the test will break even though the button still works for users.

### 🟡 P3: Readability & Maintenance Cost
* **Issue:** The POM uses three completely different locator strategies (`locator()`, `getByText()`, and `getByRole()`) for three conceptually identical navigation links.
* **Impact:** *inconsistent code → high maintenance effort.* Changes to the UI require reverse-engineering multiple different locator strategies.

---

## 2. Additional SDET Findings (Issues missed or undervalued by AI)

While the AI successfully caught the basic anti-patterns, it missed several structural and coverage-related risks:

* **Coverage Gap (Missing Navigation Target Checks):** The test checks visibility for all three links but only clicks and asserts the routing for the `docsLink`. The `apiLink` and `communityLink` are never clicked, meaning we don't actually know if they navigate correctly.
* **Accessibility Coverage Gap:** Asserting `toBeVisible()` ensures the element is rendered, but it does not guarantee it is interactable. The test lacks `toBeEnabled()` or `toHaveAccessibleName()` checks, meaning a disabled or unreadable link would falsely pass this test.
* **Redundancy & Scope Bleed:** The single test block mixes two distinct testing concerns: UI Layout (are the buttons visible?) and User Journey Routing (does clicking take me to the right URL?). If the routing click fails, we lose visibility into the remaining layout assertions. These should be split into separate test cases.
No code changes applied in Chapter 2.