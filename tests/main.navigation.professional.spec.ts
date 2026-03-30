// Suite:   playwright.dev – Main Navigation Bar
// Req:     TC-NAV-001 – Main page must display nav links: Docs, API, Community
// Target:  https://playwright.dev/
import { expect, test } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Main page navigation', { annotation: { type: 'requirement', description: 'TC-NAV-001' } }, () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightHomePage(page);
    await homePage.goto();
  });

  // ── Layout: ARIA role · visibility · enabled state · accessible name ──────

  test('TC-NAV-001 all three nav links are visible, enabled and accessible', async () => {
    await test.step('Docs – role=link, visible, enabled, accessible name "Docs"', async () => {
      await homePage.assertNavLinkAccessible(homePage.docsLink, 'Docs');
    });

    await test.step('API – role=link, visible, enabled, accessible name "API"', async () => {
      await homePage.assertNavLinkAccessible(homePage.apiLink, 'API');
    });

    await test.step('Community – role=link, visible, enabled, accessible name "Community"', async () => {
      await homePage.assertNavLinkAccessible(homePage.communityLink, 'Community');
    });
  });

  // ── Routing: click → correct destination URL and h1 ───────────────────────

  test('TC-NAV-001a Docs link navigates to the Installation page', async () => {
    await homePage.clickNavLinkAndVerify(homePage.docsLink, /\/docs\/intro/, 'Installation');
  });

  test('TC-NAV-001b API link navigates to the Playwright Library API reference', async () => {
    await homePage.clickNavLinkAndVerify(homePage.apiLink, /\/docs\/api\//, 'Playwright Library');
  });

  test('TC-NAV-001c Community link navigates to the Community welcome page', async () => {
    await homePage.clickNavLinkAndVerify(homePage.communityLink, /\/community\//, /welcome/i);
  });

  // ── Edge case: keyboard reachability (WCAG 2.1 SC 2.1.1) ─────────────────

  test('TC-NAV-002 nav links accept keyboard focus', async () => {
    await test.step('Docs link receives keyboard focus', async () => {
      await homePage.assertNavLinkFocusable(homePage.docsLink);
    });

    await test.step('API link receives keyboard focus', async () => {
      await homePage.assertNavLinkFocusable(homePage.apiLink);
    });

    await test.step('Community link receives keyboard focus', async () => {
      await homePage.assertNavLinkFocusable(homePage.communityLink);
    });
  });
    // ── Edge case: link targets are not swapped or broken ────────────────────
  //
  // TC-NAV-003: Verifies the href attribute of each nav link before any click.
  // The routing tests (TC-NAV-001a/b/c) confirm the destination AFTER navigation,
  // but they cannot catch a transposed-href regression where, e.g., Docs and API
  // silently swap targets (both would land on a valid page, so click+URL would
  // still pass). Asserting href at the source element closes that gap.
  //
  // Secondary: checks that no ancestor hides the link from assistive technology
  // via aria-hidden="true", which toBeVisible() does not detect.

  test('TC-NAV-003 nav links point to correct target URLs and are not aria-hidden', async () => {
    await test.step('Docs href resolves to /docs/intro', async () => {
      await expect(homePage.docsLink).toHaveAttribute('href', /\/docs\/intro/);
      await expect(homePage.docsLink).not.toHaveAttribute('aria-hidden', 'true');
    });

    await test.step('API href resolves to /docs/api/', async () => {
      await expect(homePage.apiLink).toHaveAttribute('href', /\/docs\/api\//);
      await expect(homePage.apiLink).not.toHaveAttribute('aria-hidden', 'true');
    });

    await test.step('Community href resolves to /community/', async () => {
      await expect(homePage.communityLink).toHaveAttribute('href', /\/community\//);
      await expect(homePage.communityLink).not.toHaveAttribute('aria-hidden', 'true');
    });
  });
});
