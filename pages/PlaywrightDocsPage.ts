import { type Page, type Locator } from '@playwright/test';

export class PlaywrightDocsPage {
  readonly page: Page;
  readonly installationHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.installationHeading = page.getByRole('heading', { name: 'Installation' });
  }
}
