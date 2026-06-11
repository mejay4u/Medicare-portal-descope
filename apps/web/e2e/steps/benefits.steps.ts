import { When, Then } from '../fixtures';
import { expect } from '../fixtures';

Then('I should see the benefits deductible progress bar', async ({ benefitsPage }) => {
  await expect(benefitsPage.deductibleBar).toBeVisible();
});

Then('I should see benefit items listed', async ({ benefitsPage }) => {
  const count = await benefitsPage.getBenefitCount();
  expect(count).toBeGreaterThan(0);
});

When('I switch to the {string} benefits tab', async ({ benefitsPage }, tab: string) => {
  await benefitsPage.switchTab(tab);
});
