import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly memberName: Locator;
  readonly memberPlan: Locator;
  readonly deductibleProgress: Locator;
  readonly quickActions: Locator;
  readonly recentActivity: Locator;
  readonly wellnessCard: Locator;
  readonly insuranceCard: Locator;

  constructor(page: Page) {
    super(page);
    this.memberName         = page.getByTestId('member-name');
    this.memberPlan         = page.getByTestId('member-plan');
    this.deductibleProgress = page.getByTestId('deductible-progress');
    this.quickActions       = page.getByTestId('quick-actions');
    this.recentActivity     = page.getByTestId('recent-activity');
    this.wellnessCard       = page.getByTestId('wellness-card');
    this.insuranceCard      = page.getByTestId('insurance-card');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForNetworkIdle();
  }

  async clickQuickAction(label: string): Promise<void> {
    await this.quickActions.getByText(label).click();
  }

  async getRecentActivityCount(): Promise<number> {
    return this.recentActivity.getByTestId('activity-item').count();
  }

  async assertLoaded(): Promise<void> {
    await expect(this.memberName).toBeVisible();
    await expect(this.memberPlan).toBeVisible();
  }
}
