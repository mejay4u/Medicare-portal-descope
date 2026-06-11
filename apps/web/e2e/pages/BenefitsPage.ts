import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BenefitsPage extends BasePage {
  readonly heading: Locator;
  readonly benefitTabs: Locator;
  readonly deductibleBar: Locator;
  readonly outOfPocketBar: Locator;
  readonly benefitItems: Locator;

  constructor(page: Page) {
    super(page);
    this.heading        = page.getByRole('heading', { level: 1 });
    this.benefitTabs    = page.getByTestId('benefit-tab');
    this.deductibleBar  = page.getByTestId('deductible-bar');
    this.outOfPocketBar = page.getByTestId('oop-bar');
    this.benefitItems   = page.getByTestId('benefit-item');
  }

  async goto(): Promise<void> {
    await this.navigate('/benefits');
    await this.waitForNetworkIdle();
  }

  async switchTab(label: string): Promise<void> {
    await this.benefitTabs.getByText(label).click();
  }

  async getActiveTabLabel(): Promise<string> {
    return this.benefitTabs.locator('[aria-selected="true"]').innerText();
  }

  async getBenefitCount(): Promise<number> {
    return this.benefitItems.count();
  }

  async assertLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.deductibleBar).toBeVisible();
  }
}
