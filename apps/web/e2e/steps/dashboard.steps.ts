import { When, Then } from '../fixtures';
import { expect } from '../fixtures';

Then('I should see my member name', async ({ dashboardPage }) => {
  await expect(dashboardPage.memberName).toBeVisible();
});

Then('I should see my plan details', async ({ dashboardPage }) => {
  await expect(dashboardPage.memberPlan).toBeVisible();
});

Then('I should see the deductible progress bar', async ({ dashboardPage }) => {
  await expect(dashboardPage.deductibleProgress).toBeVisible();
});

When('I click the quick action {string}', async ({ dashboardPage }, label: string) => {
  await dashboardPage.clickQuickAction(label);
});

Then('I should see at least {int} recent activity item', async ({ dashboardPage }, min: number) => {
  const count = await dashboardPage.getRecentActivityCount();
  expect(count).toBeGreaterThanOrEqual(min);
});

Then('I should see the wellness card', async ({ dashboardPage }) => {
  await expect(dashboardPage.wellnessCard).toBeVisible();
});

Then('I should see the insurance card', async ({ dashboardPage }) => {
  await expect(dashboardPage.insuranceCard).toBeVisible();
});
