import { type Page, type Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
