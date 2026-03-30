import { test } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Main page navigation', () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightHomePage(page);
    await homePage.goto();
  });

  // ── Layout ────────────────────────────────────────────────────────────────

  test('should display Docs, API and Community as visible and enabled links', async () => {
    await test.step('Docs link is visible, enabled and has correct ARIA role', async () => {
      await homePage.assertNavLinkAccessible(homePage.docsLink, 'Docs');
    });

    await test.step('API link is visible, enabled and has correct ARIA role', async () => {
      await homePage.assertNavLinkAccessible(homePage.apiLink, 'API');
    });

    await test.step('Community link is visible, enabled and has correct ARIA role', async () => {
      await homePage.assertNavLinkAccessible(homePage.communityLink, 'Community');
    });
  });

  // ── Routing ───────────────────────────────────────────────────────────────

  test('Docs link navigates to the Installation page', async () => {
    await homePage.clickNavLinkAndVerify(homePage.docsLink, /\/docs\/intro/, 'Installation');
  });

  test('API link navigates to the API reference page', async () => {
    await homePage.clickNavLinkAndVerify(homePage.apiLink, /\/docs\/api\//, 'Playwright Library');
  });

  test('Community link navigates to the Community welcome page', async () => {
    await homePage.clickNavLinkAndVerify(homePage.communityLink, /\/community\//, /welcome/i);
  });
});
