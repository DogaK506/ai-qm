import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';
import { PlaywrightDocsPage } from '../pages/PlaywrightDocsPage';

test.describe('Get Started navigation', () => {
  test('clicking "Get started" shows the Installation page', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    const docsPage = new PlaywrightDocsPage(page);

    await homePage.goto();
    await homePage.clickGetStarted();

    await expect(docsPage.installationHeading).toBeVisible();
  });
});
