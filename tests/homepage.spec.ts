import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Playwright homepage', () => {
  test('has title containing "Playwright"', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    await homePage.goto();
    await expect(page).toHaveTitle(/Playwright/);
  });
});
