import { test as base, createBdd } from 'playwright-bdd';
import { DashboardPage } from '../pages/DashboardPage';
import { ClaimsPage } from '../pages/ClaimsPage';
import { FindCarePage } from '../pages/FindCarePage';
import { BenefitsPage } from '../pages/BenefitsPage';

type Pages = {
  dashboardPage: DashboardPage;
  claimsPage: ClaimsPage;
  findCarePage: FindCarePage;
  benefitsPage: BenefitsPage;
};

export const test = base.extend<Pages>({
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  claimsPage:    async ({ page }, use) => use(new ClaimsPage(page)),
  findCarePage:  async ({ page }, use) => use(new FindCarePage(page)),
  benefitsPage:  async ({ page }, use) => use(new BenefitsPage(page)),
});

export { expect } from '@playwright/test';

export const { Given, When, Then, Before, After } = createBdd(test);
