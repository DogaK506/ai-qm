# Suite Maintenance Summary

**Project:** `ai.test.maintenance`  
**Target site:** https://playwright.dev/  
**Reviewed:** 5 spec files, 2 page objects  
**Date:** 2026-03-30

---

## 1. File Inventory

| File | Tests | Status |
|------|-------|--------|
| `homepage.spec.ts` | 1 | ✅ Keep – clean, minimal, single responsibility |
| `navigation.spec.ts` | 1 | ✅ Keep – clean Get Started routing test |
| `main.navigation.spec.ts` | 1 | ⚠️ Obsolete – superseded (see §3) |
| `main.navigation.refactored.spec.ts` | 5 | ⚠️ Intermediate draft – superseded by professional (see §3) |
| `main.navigation.professional.spec.ts` | 6 | ✅ Canonical – keep as the authoritative nav suite |

---

## 2. Issues Found

### 2.1 Broken / Anti-pattern Selectors
**File:** `main.navigation.spec.ts`

| Line | Issue |
|------|-------|
| 12 | `await page.waitForTimeout(2000)` — hardcoded fixed wait, primary flakiness cause |
| 6 & 12 | `PlaywrightHomePage` instantiated twice per test run (once in `beforeEach`, once in the test body); `beforeEach` instance discarded |

These were never fixed in this file after the refactor was completed in later iterations.

### 2.2 Redundant / Duplicate Scenarios

The suite evolved through three successive generations of the same navigation tests:

```
main.navigation.spec.ts          ← Generation 1 (legacy, broken)
main.navigation.refactored.spec.ts ← Generation 2 (partial improvements)
main.navigation.professional.spec.ts ← Generation 3 (canonical, full coverage)
```

**Exact scenario overlaps across active files:**

| Scenario | `homepage` | `navigation` | `main.nav` (legacy) | `main.nav.refactored` | `main.nav.professional` |
|---|---|---|---|---|---|
| Homepage title check | ✅ | — | — | — | — |
| Get Started → Installation | — | ✅ | — | — | — |
| Docs/API/Community visible | — | — | ✅ | ✅ | ✅ (TC-NAV-001) |
| Docs routing (click + URL) | — | — | ✅ (partial) | ✅ | ✅ (TC-NAV-001a) |
| API routing | — | — | ❌ missing | ✅ | ✅ (TC-NAV-001b) |
| Community routing | — | — | ❌ missing | ✅ | ✅ (TC-NAV-001c) |
| Keyboard focus (WCAG) | — | — | — | ✅ (TC-NAV-002) | ✅ (TC-NAV-002) |
| href + aria-hidden check | — | — | — | — | ✅ (TC-NAV-003) |

`navigation.spec.ts` and `main.navigation.professional.spec.ts` both click Docs and assert the Installation heading — minor overlap, but they test different entry points (Get Started button vs. nav link) so both are justified.

### 2.3 Obsolete Logic

- `main.navigation.spec.ts`: entire file is obsolete after `main.navigation.professional.spec.ts` reached full coverage. Running it in CI produces a slower, lower-quality duplicate of TC-NAV-001 + TC-NAV-001a.
- `main.navigation.refactored.spec.ts`: same describe-block name (`'Main page navigation'`) as both the legacy file and the professional file — causes ambiguous reporter output and confusing test IDs in CI.

---

## 3. Consolidation Plan

### Phase 1 — Mark obsolete files (done)
`main.navigation.spec.ts` has been updated with `test.describe.skip` and a `@deprecated` comment so it is excluded from all CI runs while remaining in git history.

### Phase 2 — Retire the refactored draft
`main.navigation.refactored.spec.ts` should be deleted once the team confirms `main.navigation.professional.spec.ts` is the stable canonical file. Until then, add `test.describe.skip` to prevent duplicate runs.

### Phase 3 — Rename describe block
In `main.navigation.professional.spec.ts` the `test.describe` title `'Main page navigation'` is shared with two other files. Rename to `'TC-NAV-001 Main navigation bar'` for unambiguous CI output.

### Phase 4 — Target state (after cleanup)

```
tests/
  homepage.spec.ts               ← title check          (1 test)
  navigation.spec.ts             ← Get Started routing  (1 test)
  main.navigation.professional.spec.ts  ← full nav suite  (6 tests)
```

Total: 8 tests, zero duplicates, zero legacy files running in CI.

---

## 4. Diff — Representative Cleanup (`main.navigation.spec.ts`)

```diff
--- a/tests/main.navigation.spec.ts
+++ b/tests/main.navigation.spec.ts
-import { test, expect } from '@playwright/test';
-import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';
-
-test.describe('Main page navigation', () => {
-  test.beforeEach(async ({ page }) => {
-    const homePage = new PlaywrightHomePage(page);
-    await homePage.goto();
-  });
-
-  test('should display navigation links: Docs, API, Community', async ({ page }) => {
-    const homePage = new PlaywrightHomePage(page);
-    await page.waitForTimeout(2000);            // ← fixed wait (flaky)
-
-    await expect(homePage.docsLink).toBeVisible();
-    await expect(homePage.apiLink).toBeVisible();
-    await expect(homePage.communityLink).toBeVisible();
-
-    await homePage.docsLink.click();
-    await expect(page).toHaveURL(/.*docs\/intro/);  // ← mixed concern
-  });
-
-
-});
+// OBSOLETE – superseded by main.navigation.professional.spec.ts (TC-NAV-001 … TC-NAV-003).
+// Retained only for historical reference. Do NOT run in CI.
+// @deprecated
+import { test } from '@playwright/test';
+
+test.describe.skip('Main page navigation (legacy – obsolete)', () => {
+  // All scenarios covered with better selectors, assertions and traceability in:
+  //   tests/main.navigation.professional.spec.ts
+});
```

**Issues resolved by this diff:**

| # | Issue |
|---|-------|
| 1 | `waitForTimeout(2000)` removed — eliminates the primary flakiness source |
| 2 | Dual POM instantiation removed |
| 3 | Mixed visibility + routing concerns removed |
| 4 | `test.describe.skip` ensures CI never runs it while preserving history |
| 5 | `@deprecated` tag signals intent to any future contributor or AI tool |
