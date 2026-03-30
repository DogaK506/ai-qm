import { type Page, type Locator, expect } from '@playwright/test';

export class PlaywrightHomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly docsLink: Locator;
  readonly apiLink: Locator;
  readonly communityLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });

    const mainNav = page.getByRole('navigation', { name: 'Main' });
    this.docsLink = mainNav.getByRole('link', { name: 'Docs' });
    this.apiLink = mainNav.getByRole('link', { name: 'API' });
    this.communityLink = mainNav.getByRole('link', { name: 'Community' });
  }

  async goto() {
    await this.page.goto('https://playwright.dev/');
  }

  async clickGetStarted() {
    await this.getStartedLink.click();
  }

  async assertNavLinkAccessible(link: Locator, name: string) {
    await expect(link).toHaveRole('link');
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
    await expect(link).toHaveAccessibleName(name);
  }

  async assertNavLinkFocusable(link: Locator) {
    await link.focus();
    await expect(link).toBeFocused();
  }

  async clickNavLinkAndVerify(link: Locator, expectedUrlPattern: RegExp, expectedHeading: string | RegExp) {
    await link.click();
    await expect(this.page).toHaveURL(expectedUrlPattern);
    await expect(this.page.getByRole('heading', { name: expectedHeading, level: 1 })).toBeVisible();
  }
}
