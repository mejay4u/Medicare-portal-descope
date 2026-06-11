import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClaimsPage extends BasePage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly claimCards: Locator;
  readonly pagination: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.heading      = page.getByRole('heading', { level: 1 });
    this.searchInput  = page.getByPlaceholder(/search/i);
    this.statusFilter = page.getByTestId('status-filter');
    this.claimCards   = page.getByTestId('claim-card');
    this.pagination   = page.getByTestId('pagination');
    this.emptyState   = page.getByTestId('empty-state');
  }

  async goto(): Promise<void> {
    await this.navigate('/claims');
    await this.waitForNetworkIdle();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption(status);
  }

  async getClaimCount(): Promise<number> {
    return this.claimCards.count();
  }

  async openClaim(index: number): Promise<void> {
    await this.claimCards.nth(index).click();
  }

  async getAllStatusBadgeTexts(): Promise<string[]> {
    const badges = this.page.getByTestId('claim-status-badge');
    const count = await badges.count();
    return Promise.all(
      Array.from({ length: count }, (_, i) => badges.nth(i).innerText()),
    );
  }

  async assertLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}
