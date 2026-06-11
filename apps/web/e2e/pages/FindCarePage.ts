import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FindCarePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly askAiButton: Locator;
  readonly smartMatchSection: Locator;
  readonly providerCards: Locator;
  readonly filterSidebar: Locator;
  readonly applyFiltersButton: Locator;
  readonly inNetworkToggle: Locator;
  readonly noResultsState: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput       = page.getByPlaceholder(/search by name/i);
    this.searchButton      = page.getByRole('button', { name: /^search$/i });
    this.askAiButton       = page.getByRole('button', { name: /ask ai/i });
    this.smartMatchSection = page.getByTestId('smart-match-section');
    this.providerCards     = page.getByTestId('provider-card');
    this.filterSidebar     = page.getByRole('complementary');
    this.applyFiltersButton = page.getByRole('button', { name: /apply filters/i });
    this.inNetworkToggle   = page.getByTestId('in-network-toggle');
    this.noResultsState    = page.getByTestId('no-results');
  }

  async goto(): Promise<void> {
    await this.navigate('/find-care');
    await this.waitForNetworkIdle();
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.waitForNetworkIdle();
  }

  async toggleInNetwork(): Promise<void> {
    await this.inNetworkToggle.click();
  }

  async applyFilters(): Promise<void> {
    await this.applyFiltersButton.click();
    await this.waitForNetworkIdle();
  }

  async getProviderCount(): Promise<number> {
    return this.providerCards.count();
  }

  async getProviderInNetworkStates(): Promise<boolean[]> {
    const badges = this.page.getByTestId('in-network-badge');
    const count = await badges.count();
    return Promise.all(
      Array.from({ length: count }, (_, i) => badges.nth(i).isVisible()),
    );
  }

  async openProviderDetail(index: number): Promise<void> {
    await this.providerCards
      .nth(index)
      .getByRole('link', { name: /view details/i })
      .click();
  }

  async assertSmartMatchVisible(): Promise<void> {
    await expect(this.smartMatchSection).toBeVisible();
  }
}
